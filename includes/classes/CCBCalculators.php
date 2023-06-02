<?php

namespace cBuilder\Classes;

use cBuilder\Classes\Appearance\CCBAppearanceHelper;
use cBuilder\Classes\Appearance\Presets\CCBPresetGenerator;
use cBuilder\Classes\CustomFields\CCBCustomFields;
use cBuilder\Helpers\CCBFieldsHelper;

class CCBCalculators {

	const DESC_POSITION_BEFORE = 'before';
	const DESC_POSITION_AFTER  = 'after';
	const CALCULATOR_POST_TYPE = 'cost-calc';

	public static function getWPCalculatorsData() {
		$calculator_posts = new \WP_Query(
			array(
				'posts_per_page' => -1,
				'post_type'      => self::CALCULATOR_POST_TYPE,
				'post_status'    => array( 'publish' ),
			)
		);

		return $calculator_posts->posts;
	}

	public static function getWPCalculatorsWithIdsData( $ids ) {
		$calculator_posts = new \WP_Query(
			array(
				'post__in'       => $ids,
				'posts_per_page' => -1,
				'post_type'      => self::CALCULATOR_POST_TYPE,
				'post_status'    => array( 'publish' ),
			)
		);

		return $calculator_posts->posts;
	}

	/**
	 * Get Default Data
	 */
	private static function get_default_calculator_data() {
		return array(
			'id'           => '',
			'title'        => '',
			'forms'        => array(),
			'fields'       => array(),
			'builder'      => array(),
			'formula'      => array(),
			'settings'     => array(),
			'products'     => array(),
			'categories'   => array(),
			'conditions'   => array(),
			'success'      => false,
			'appearance'   => array(),
			'desc_options' => array(
				self::DESC_POSITION_BEFORE => __( 'Show before field', 'cost-calculator-builder' ),
				self::DESC_POSITION_AFTER  => __( 'Show after field', 'cost-calculator-builder' ),
			),
			'message'      => __( 'There is no calculator with this id', 'cost-calculator-builder' ),
		);
	}

	public static function edit_calc() {
		check_ajax_referer( 'ccb_edit_calc', 'nonce' );

		if ( ! current_user_can( 'publish_posts' ) ) {
			wp_send_json_error( __( 'You are not allowed to run this action', 'cost-calculator-builder' ) );
		}

		$result = self::get_default_calculator_data();

		if ( isset( $_GET['calc_id'] ) ) {
			$calc_id = (int) sanitize_text_field( $_GET['calc_id'] );

			$result['id']         = $calc_id;
			$result['title']      = get_post_meta( $calc_id, 'stm-name', true );
			$result['fields']     = CCBFieldsHelper::fields();
			$result['formula']    = get_post_meta( $calc_id, 'stm-formula', true );
			$result['conditions'] = get_post_meta( $calc_id, 'stm-conditions', true );

			$stm_fields        = get_post_meta( $calc_id, 'stm-fields', true );
			$result['builder'] = ! empty( $stm_fields ) ? $stm_fields : array();

			$preset_key = get_post_meta( $calc_id, 'ccb_calc_preset_idx', true );
			$preset_key = empty( $preset_key ) ? 0 : $preset_key;

			$appearance = CCBAppearanceHelper::get_appearance_data( $preset_key );

			if ( ! empty( $appearance ) ) {
				$result['preset_idx'] = $preset_key;
				$result['appearance'] = $appearance['data'];
				$result['presets']    = $appearance['list'];

				if ( count( $appearance['list'] ) <= $preset_key ) {
					$result['preset_idx'] = 0;
					update_post_meta( $calc_id, 'ccb_calc_preset_idx', 0 );
					$appearance_inner = CCBAppearanceHelper::get_appearance_data( $preset_key );

					if ( ! empty( $appearance_inner ) ) {
						$result['appearance'] = $appearance_inner['data'];
					}
				}
			}

			/* pro-features */
			$result['forms']      = ccb_contact_forms();
			$result['products']   = ccb_woo_products();
			$result['categories'] = ccb_woo_categories();

			$settings = get_option( 'stm_ccb_form_settings_' . $calc_id );

			if ( ! empty( $settings ) && isset( $settings[0] ) && isset( $settings[0]['general'] ) ) {
				$settings = $settings[0];
			}

			if ( ! empty( $settings ) ) {
				$result['settings'] = $settings;
			}

			if ( ! is_array( $result['settings'] ) || empty( $result['settings']['general'] ) ) {
				$result['settings'] = CCBSettingsData::settings_data();
			}

			if ( ! empty( $result['settings']['formFields']['body'] ) ) {
				$result['settings']['formFields']['body'] = str_replace( '<br>', PHP_EOL, $result['settings']['formFields']['body'] );
			}

			if ( defined( 'CALC_DEV_MODE' ) ) {
				$result['cats']            = CCBCategory::calc_categories_list();
				$result['icons']           = CCBCalculatorTemplates::calc_template_icons();
				$result['cat']             = get_post_meta( $calc_id, 'category', true );
				$result['icon']            = get_post_meta( $calc_id, 'icon', true );
				$result['pluginType']      = get_post_meta( $calc_id, 'plugin_type', true );
				$result['calcLink']        = get_post_meta( $calc_id, 'calc_link', true );
				$result['info']            = get_post_meta( $calc_id, 'info', true );
				$result['calcDescription'] = get_post_meta( $calc_id, 'description', true );
			}

			$general_settings   = get_option( 'ccb_general_settings' );
			$ccb_sync           = ccb_sync_settings_from_general_settings( $result['settings'], $general_settings );
			$result['settings'] = $ccb_sync['settings'];

			$result['calculators'] = self::get_calculator_list();
			$result['success']     = true;
			$result['message']     = '';
		}

		// send data
		wp_send_json( $result );
	}

	/**
	 * Duplicate Calculator
	 */
	public static function duplicate_calc() {

		check_ajax_referer( 'ccb_duplicate_calc', 'nonce' );

		if ( ! current_user_can( 'publish_posts' ) ) {
			wp_send_json_error( __( 'You are not allowed to run this action', 'cost-calculator-builder' ) );
		}

		$result = array(
			'calculators' => array(),
			'success'     => false,
			'message'     => __( "Couldn't duplicate calculator, please try again!', 'cost-calculator-builder" ),
		);

		$params = self::get_filter_data( $_GET );

		if ( isset( $_GET['calculator_ids'] ) ) {

			$ids = array_map(
				function ( $item ) {
					return (int) sanitize_text_field( $item );
				},
				explode( ',', $_GET['calculator_ids'] )
			);

			$result_ids = array();
			foreach ( $ids as $id ) {
				$new_calculator = array(
					'post_parent' => $id,
					'post_status' => 'publish',
					'post_type'   => 'cost-calc',
				);

				$duplicated_post_id = wp_insert_post( $new_calculator );

				$data = array(
					'id'         => $duplicated_post_id,
					'title'      => self::get_calculator_name_for_duplicate( $id ),
					'formula'    => get_post_meta( $id, 'stm-formula', true ),
					'settings'   => get_option( 'stm_ccb_form_settings_' . $id, true ),
					'builder'    => get_post_meta( $id, 'stm-fields', true ),
					'conditions' => get_post_meta( $id, 'stm-conditions', true ),
					'appearance' => get_post_meta( $id, 'ccb-appearance', true ),
					'preset_idx' => get_post_meta( $id, 'ccb_calc_preset_idx', true ),
				);

				if ( ccb_update_calc_values( $data ) ) {
					array_push( $result_ids, $duplicated_post_id );
				}
			}

			$result['success']        = true;
			$result['calculators']    = self::get_calculator_list( $params );
			$result['duplicated_ids'] = $result_ids;
			$result['message']        = __( 'Calculators duplicated successfully', 'cost-calculator-builder' );
		}

		if ( ! empty( $_GET['calc_id'] ) ) {
			$data = self::duplicate_target_calc( $_GET['calc_id'] );
			if ( ccb_update_calc_values( $data ) ) {
				$result['success']       = true;
				$result['calculators']   = self::get_calculator_list( $params );
				$result['message']       = __( 'Calculator duplicated successfully', 'cost-calculator-builder' );
				$result['duplicated_id'] = $_GET['calc_id'];
			}
		}

		wp_send_json( $result );
	}

	/**
	 * Duplicate target calc
	 * @param $calc_id
	 * @return array
	 */
	private static function duplicate_target_calc( $calc_id, $copy_title = true ) {
		$calc_id = (int) sanitize_text_field( $calc_id );

		$my_post = array(
			'post_type'   => 'cost-calc',
			'post_status' => true === $copy_title ? 'publish' : 'draft',
			'post_parent' => $calc_id,
		);

		// get id
		$id = wp_insert_post( $my_post );

		return array(
			'id'         => $id,
			'title'      => self::get_calculator_name_for_duplicate( $calc_id, $copy_title ),
			'formula'    => get_post_meta( $calc_id, 'stm-formula', true ),
			'settings'   => get_option( 'stm_ccb_form_settings_' . $calc_id, true ),
			'builder'    => get_post_meta( $calc_id, 'stm-fields', true ),
			'conditions' => get_post_meta( $calc_id, 'stm-conditions', true ),
			'preset_idx' => get_post_meta( $calc_id, 'ccb_calc_preset_idx', true ),
		);
	}

	/**
	 *  Generate calc id(create cost-calc post) and send
	 */
	public static function create_calc_id() {
		check_ajax_referer( 'ccb_create_id', 'nonce' );

		if ( ! current_user_can( 'publish_posts' ) ) {
			wp_send_json_error( __( 'You are not allowed to run this action', 'cost-calculator-builder' ) );
		}

		// create cost-calc post and get id
		$id = wp_insert_post(
			array(
				'post_type'   => 'cost-calc',
				'post_status' => 'draft',
			)
		);

		$result = array(
			'id'           => $id,
			'url'          => admin_url( 'admin.php' ) . '?page=cost_calculator_builder&action=edit&id=' . $id,
			'success'      => true,
			'forms'        => ccb_contact_forms(),
			'products'     => ccb_woo_products(),
			'categories'   => ccb_woo_categories(),
			'fields'       => CCBFieldsHelper::fields(),
			'desc_options' => array(
				self::DESC_POSITION_BEFORE => __( 'Show before field', 'cost-calculator-builder' ),
				self::DESC_POSITION_AFTER  => __( 'Show after field', 'cost-calculator-builder' ),
			),
		);

		$preset_key = get_post_meta( $id, 'ccb_calc_preset_idx', true );
		$preset_key = empty( $preset_key ) ? 0 : $preset_key;
		$appearance = CCBAppearanceHelper::get_appearance_data( $preset_key );

		if ( ! empty( $appearance ) ) {
			$result['preset_idx'] = $preset_key;
			$result['appearance'] = $appearance['data'];
			$result['presets']    = $appearance['list'];
		}
		$calculators = self::get_calculator_list();
		if ( $calculators['calculators_count'] <= 1 && 'skip' === get_option( 'ccb_quick_tour_type' ) ) {
			update_option( 'ccb_quick_tour_type', 'quick_tour_start' );
		}
		wp_send_json( $result );
	}

	/**
	 * Append ( copy int ) to new calendar title
	 * based on duplicated calculator title
	 *
	 * @param mixed
	 * @return mixed|string
	 */
	public static function get_calculator_name_for_duplicate( $calc_id, $copy_title = true ) {
		$args = array(
			'post_type'      => 'cost-calc',
			'posts_per_page' => -1,
			'post_status'    => 'publish',
			'post_parent'    => $calc_id,
		);

		$exist_duplicates          = get_children( $args, ARRAY_A );
		$count_duplicate_meta      = count( $exist_duplicates );
		$duplicated_from_calc_name = get_post_meta( $calc_id, 'stm-name', true );

		if ( $copy_title ) {
			return $duplicated_from_calc_name . ' (copy ' . $count_duplicate_meta . ')';
		}

		return $duplicated_from_calc_name;
	}

	/**
	 * Delete calc by id
	 */
	public static function delete_calc() {
		check_ajax_referer( 'ccb_delete_calc', 'nonce' );

		if ( ! current_user_can( 'publish_posts' ) ) {
			wp_send_json_error( __( 'You are not allowed to run this action', 'cost-calculator-builder' ) );
		}

		$result = array(
			'success'     => false,
			'calculators' => array(),
			'message'     => __( 'Could not delete calculator, please try again!', 'cost-calculator-builder' ),
		);

		$params = self::get_filter_data( $_GET );

		if ( isset( $_GET['calculator_ids'] ) ) {
			$ids = array_map(
				function ( $item ) {
					return (int) sanitize_text_field( $item );
				},
				explode( ',', $_GET['calculator_ids'] )
			);

			foreach ( $ids as $id ) {
				wp_delete_post( $id );
				clearMetaData( $id );
				ccb_update_woocommerce_calcs( $id, true );
			}

			$result['success']     = true;
			$result['calculators'] = self::get_calculator_list( $params );
			$result['message']     = __( 'Calculators deleted successfully', 'cost-calculator-builder' );
		}

		if ( isset( $_GET['calc_id'] ) ) {

			$calc_id = (int) sanitize_text_field( $_GET['calc_id'] );

			wp_delete_post( $calc_id );
			clearMetaData( $calc_id );
			ccb_update_woocommerce_calcs( $calc_id, true );

			$result['success']     = true;
			$result['calculators'] = self::get_calculator_list( $params );
			$result['message']     = __( 'Calculator deleted successfully', 'cost-calculator-builder' );
		}

		wp_send_json( $result );
	}

	/**
	 * Save Custom Styles
	 */
	public static function save_custom() {

		check_ajax_referer( 'ccb_save_custom', 'nonce' );

		if ( ! current_user_can( 'publish_posts' ) ) {
			wp_send_json_error( __( 'You are not allowed to run this action', 'cost-calculator-builder' ) );
		}

		$result = array(
			'success' => false,
			'message' => 'Something went wrong',
		);

		if ( isset( $_POST['action'] ) && 'calc_save_custom' === $_POST['action'] && ! empty( $_POST['content'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
			$data       = apply_filters( 'stm_ccb_sanitize_array', $_POST );
			$content    = str_replace( '\"', '"', $data['content'] );
			$content    = str_replace( "\'", "'", $content );
			$content    = str_replace( '\\\\', "\\", $content ); //phpcs:ignore
			$content    = json_decode( $content, true );
			$appearance = array();

			if ( isset( $content['appearance'] ) ) {
				$appearance = $content['appearance'];
			}

			$preset_key = ! isset( $data['selectedIdx'] ) ? 0 : $data['selectedIdx'];
			CCBPresetGenerator::save_custom( $preset_key, $appearance );
			update_post_meta( $data['id'], 'ccb_calc_preset_idx', sanitize_text_field( $preset_key ) );

			$result['success'] = true;
			$result['message'] = 'Custom Changes Saved successfully';
		}

		wp_send_json( $result );
	}

	public static function calc_skip_hint() {
		check_ajax_referer( 'calc_skip_hint', 'nonce' );

		if ( ! current_user_can( 'publish_posts' ) ) {
			wp_send_json_error( __( 'You are not allowed to run this action', 'cost-calculator-builder' ) );
		}

		$skipped_done = get_option( 'ccb_quick_tour_type', 'quick_tour_start' );
		if ( 'done' === $skipped_done ) {
			$hints = ! empty( $_POST['hints'] ) ? apply_filters( 'ccb_sanitize_hints', $_POST['hints'] ) : array();
			update_option( 'calc_hint_skipped', $hints );
		}

		$result = array(
			'success' => true,
			'message' => 'Hint skipped',
		);
		wp_send_json( $result );
	}

	public static function calc_skip_quick_tour() {
		check_ajax_referer( 'calc_skip_quick_tour', 'nonce' );

		if ( ! current_user_can( 'publish_posts' ) ) {
			wp_send_json_error( __( 'You are not allowed to run this action', 'cost-calculator-builder' ) );
		}

		update_option( 'ccb_quick_tour_type', 'done' );

		$result = array(
			'success' => true,
			'message' => 'Quick Tour skipped',
		);
		wp_send_json( $result );
	}

	/**
	 * Get All existing calculator
	 */
	public static function get_existing() {
		check_ajax_referer( 'ccb_get_existing', 'nonce' );

		if ( ! current_user_can( 'publish_posts' ) ) {
			wp_send_json_error( __( 'You are not allowed to run this action', 'cost-calculator-builder' ) );
		}

		$result = array(
			'forms'       => array(),
			'calculators' => array(),
		);

		$params      = self::get_filter_data( $_GET );
		$calculators = self::get_calculator_list( $params );

		$default_hints               = array( 'calculators', 'conditions', 'settings' );
		$result['calc_hint_skipped'] = ccb_pro_active() && ! empty( get_option( 'calc_allow_hint' ) ) ? get_option( 'calc_hint_skipped', array() ) : $default_hints;
		$result['quick_tour_step']   = get_option( 'ccb_quick_tour_type', 'skip' );
		$result['quick_tour_data']   = null;

		if ( 'done' !== $result['quick_tour_step'] ) {
			$quick_tour_data = CALC_PATH . '/demo-sample/quick_tour_data.txt'; //phpcs:ignore
			if ( file_exists( $quick_tour_data ) ) { //phpcs:ignore
				$contents = file_get_contents( $quick_tour_data ); //phpcs:ignore
				$contents = json_decode( $contents, true );

				if ( isset( $contents['calculators'] ) && count( $contents['calculators'] ) > 0 ) {
					$quick_tour_calc           = $contents['calculators'][0];
					$result['quick_tour_data'] = array(
						'title'      => $quick_tour_calc['ccb_name'],
						'fields'     => $quick_tour_calc['ccb_fields'],
						'conditions' => $quick_tour_calc['ccb_conditions'],
					);
				}
			}
		}

		if ( is_array( $calculators ) ) {
			$result['success']     = true;
			$result['calculators'] = $calculators;

			/* pro-features */
			$result['forms']    = ccb_contact_forms();
			$result['products'] = ccb_woo_products();
		}

		wp_send_json( $result );
	}

	/**
	 * Save all calculator settings via calc id
	 */
	public static function save_settings() {

		if ( ! current_user_can( 'publish_posts' ) ) {
			wp_send_json_error( __( 'You are not allowed to run this action', 'cost-calculator-builder' ) );
		}

		$result = array(
			'success' => false,
			'message' => 'Something went wrong',
		);

		if ( 'done' !== get_option( 'ccb_quick_tour_type', 'quick_tour_start' ) ) {
			update_option( 'ccb_quick_tour_type', 'done' );
		}

		$request_body = file_get_contents( 'php://input' );
		$request_data = json_decode( $request_body, true );
		$data         = apply_filters( 'stm_ccb_sanitize_array', $request_data );

		if ( isset( $data['settings']['formFields']['body'] ) ) {
			$content                                = $data['settings']['formFields']['body'];
			$content                                = str_replace( '\\n', '<br>', $content );
			$data['settings']['formFields']['body'] = str_replace( '\\', '', $content );
		}

		if ( ! empty( $data ) && ccb_update_calc_values( $data ) ) {
			$result['success']     = true;
			$result['message']     = 'Calculator updated successfully';
			$result['calculators'] = self::get_calculator_list();
		}

		wp_send_json( $result );
	}

	/**
	 * Get general settings
	 */
	public static function calc_get_general_settings() {
		if ( ! current_user_can( 'publish_posts' ) ) {
			wp_send_json_error( __( 'You are not allowed to run this action', 'cost-calculator-builder' ) );
		}

		$result = array(
			'success' => false,
			'data'    => null,
			'message' => 'Something went wrong',
		);

		$data = get_option( 'ccb_general_settings', CCBSettingsData::general_settings_data() );

		if ( isset( $data['recaptcha'] ) && empty( $data['recaptcha']['type'] ) ) {
			$data['recaptcha']['type'] = 'v2';
		}

		if ( ! empty( $data ) ) {
			$result['data']    = $data;
			$result['success'] = true;
			$result['message'] = __( 'General settings data', 'cost-calculator-builder' );
		}

		wp_send_json( $result );
	}

	/**
	 * Save general settings
	 */
	public static function save_general_settings() {
		if ( ! current_user_can( 'publish_posts' ) ) {
			wp_send_json_error( __( 'You are not allowed to run this action', 'cost-calculator-builder' ) );
		}

		$result = array(
			'success' => false,
			'message' => 'Something went wrong',
		);

		$request_body = file_get_contents( 'php://input' );
		$request_data = json_decode( $request_body, true );
		$data         = apply_filters( 'stm_ccb_sanitize_array', $request_data );

		if ( ! empty( $data ) && isset( $data['settings'] ) ) {
			update_option( 'ccb_general_settings', $data['settings'] );
			$result['success'] = true;
			$result['message'] = __( 'Settings updated successfully', 'cost-calculator-builder' );
		}

		wp_send_json( $result );
	}

	/**
	 * Return ready array for response
	 * @return array
	 */
	public static function get_calculator_list( $params = array() ) {
		$result         = array();
		$existing       = ccb_calc_get_all_posts( 'cost-calc', $params );
		$existing_count = ccb_calc_get_all_posts( 'cost-calc' );

		if ( is_array( $existing ) ) {
			foreach ( $existing as $key => $value ) {
				$temp = array();

				$temp['id']           = $key;
				$temp['project_name'] = ! empty( $value ) ? $value : 'name is empty';

				$result[] = $temp;
			}
		}

		return array(
			'calculators_count' => count( $existing_count ),
			'existing'          => $result,
		);
	}

	/**
	 * @param $data
	 * @return array
	 */
	private static function get_filter_data( $data ) {
		$sort_by   = ! empty( $data['sortBy'] ) ? sanitize_text_field( $data['sortBy'] ) : 'id';
		$direction = ! empty( $data['direction'] ) ? sanitize_text_field( $data['direction'] ) : 'desc';
		$page      = ! empty( $data['page'] ) ? (int) sanitize_text_field( $data['page'] ) : 1;
		$limit     = ! empty( $data['limit'] ) ? sanitize_text_field( $data['limit'] ) : 5;
		$offset    = 1 === $page ? 0 : ( $page - 1 ) * $limit;

		return array(
			'page'      => $page,
			'limit'     => $limit,
			'offset'    => $offset,
			'sort_by'   => $sort_by,
			'direction' => $direction,
		);
	}

	public static function ccb_delete_preset() {
		check_ajax_referer( 'ccb_delete_preset', 'nonce' );

		if ( ! current_user_can( 'publish_posts' ) ) {
			wp_send_json_error( __( 'You are not allowed to run this action', 'cost-calculator-builder' ) );
		}

		$result = array(
			'success' => false,
			'message' => 'Something went wrong',
		);

		if ( isset( $_GET['calc_id'] ) && isset( $_GET['selectedIdx'] ) && isset( $_GET['idx'] ) ) {
			$idx             = sanitize_text_field( $_GET['idx'] );
			$preset_key      = sanitize_text_field( $_GET['selectedIdx'] );
			$presets_from_db = CCBPresetGenerator::get_static_preset_from_db();

			array_splice( $presets_from_db, intval( $idx ), 1 );
			update_option( 'ccb_appearance_presets', apply_filters( 'ccb_appearance_data_update', $presets_from_db ) );
			update_post_meta( $_GET['calc_id'], 'ccb_calc_preset_idx', $preset_key );

			$presets = CCBAppearanceHelper::get_appearance_data( $preset_key );
			$result  = array(
				'success' => true,
				'message' => 'Preset deleted',
				'list'    => ! isset( $presets['list'] ) ? array() : $presets['list'],
				'data'    => ! isset( $presets['data'] ) ? array() : $presets['data'],
			);
		}

		wp_send_json( $result );
	}

	public static function ccb_add_preset() {
		check_ajax_referer( 'ccb_add_preset', 'nonce' );

		if ( ! current_user_can( 'publish_posts' ) ) {
			wp_send_json_error( __( 'You are not allowed to run this action', 'cost-calculator-builder' ) );
		}

		$result = array(
			'success' => false,
			'message' => 'Something went wrong',
		);

		if ( isset( $_GET['calc_id'] ) && isset( $_GET['selectedIdx'] ) ) {
			$preset_key        = sanitize_text_field( $_GET['selectedIdx'] );
			$presets           = CCBPresetGenerator::default_presets();
			$presets_from_db   = CCBPresetGenerator::get_static_preset_from_db();
			$presets_from_db[] = $presets[0];

			update_option( 'ccb_appearance_presets', apply_filters( 'ccb_appearance_data_update', $presets_from_db ) );
			update_post_meta( $_GET['calc_id'], 'ccb_calc_preset_idx', sanitize_text_field( $preset_key ) );

			$presets = CCBAppearanceHelper::get_appearance_data( $preset_key );
			$result  = array(
				'success' => true,
				'message' => 'Preset created',
				'list'    => $presets['list'] ?? array(),
				'data'    => $presets['data'] ?? array(),
			);
		}

		wp_send_json( $result );
	}

	public static function ccb_update_preset() {
		check_ajax_referer( 'ccb_update_preset', 'nonce' );

		if ( ! current_user_can( 'publish_posts' ) ) {
			wp_send_json_error( __( 'You are not allowed to run this action', 'cost-calculator-builder' ) );
		}

		$result = array(
			'success' => false,
			'message' => 'Something went wrong',
		);

		if ( isset( $_GET['calc_id'] ) && isset( $_GET['selectedIdx'] ) ) {
			$preset_key = sanitize_text_field( $_GET['selectedIdx'] );
			$presets    = CCBAppearanceHelper::get_appearance_data( $preset_key );

			if ( isset( $presets['data'] ) ) {
				$result = array(
					'success' => true,
					'message' => 'Preset changed',
					'data'    => $presets['data'],
					'list'    => $presets['list'],
				);
				update_post_meta( $_GET['calc_id'], 'ccb_calc_preset_idx', sanitize_text_field( $preset_key ) );
			}
		}

		wp_send_json( $result );
	}

	public static function calc_use_template() {
		check_ajax_referer( 'ccb_use_template', 'nonce' );

		if ( ! current_user_can( 'publish_posts' ) ) {
			wp_send_json_error( __( 'You are not allowed to run this action', 'cost-calculator-builder' ) );
		}

		$request_body = file_get_contents( 'php://input' );
		$request_data = json_decode( $request_body, true );
		$data         = apply_filters( 'stm_ccb_sanitize_array', $request_data );
		$template_id  = ! isset( $data['template_id'] ) ? null : $data['template_id'];

		$result = array(
			'url'         => '',
			'calculators' => array(),
			'success'     => false,
			'message'     => __( 'Could not duplicate calculator, please try again!', 'cost-calculator-builder' ),
		);

		if ( ! is_null( $template_id ) ) {
			$calc_id  = get_post_meta( $template_id, 'calc_id', true );
			$category = get_post_meta( $template_id, 'category', true );
			$data     = self::duplicate_target_calc( $calc_id, false );

			if ( 'custom_templates' !== $category ) {
				$data['preset_idx'] = 0;
			}

			if ( ccb_update_calc_values( $data ) ) {
				$result['success'] = true;
				$result['message'] = __( 'Calculator created successfully', 'cost-calculator-builder' );
				$result['url']     = admin_url( 'admin.php' ) . '?page=cost_calculator_builder&action=edit&id=' . $data['id'];
			}
		}

		wp_send_json( $result );
	}

	public static function calc_config_settings() {
		check_ajax_referer( 'ccb_save_config', 'nonce' );

		if ( ! current_user_can( 'publish_posts' ) ) {
			wp_send_json_error( __( 'You are not allowed to run this action', 'cost-calculator-builder' ) );
		}
		$result = array(
			'success' => false,
			'message' => __( 'Could not save calculator config, please try again!', 'cost-calculator-builder' ),
		);

		$request_body = file_get_contents( 'php://input' );
		$request_data = json_decode( $request_body, true );
		$data         = apply_filters( 'stm_ccb_sanitize_array', $request_data );

		if ( isset( $data['calc_id'] ) ) {
			update_post_meta( $data['calc_id'], 'category', $data['category'] );
			update_post_meta( $data['calc_id'], 'icon', $data['icon'] );
			update_post_meta( $data['calc_id'], 'plugin_type', $data['type'] );
			update_post_meta( $data['calc_id'], 'calc_link', $data['link'] );
			update_post_meta( $data['calc_id'], 'info', $data['info'] );
			update_post_meta( $data['calc_id'], 'description', $data['description'] );

			$result['success'] = true;
			$result['message'] = __( 'Calculator configs saved successfully', 'cost-calculator-builder' );
		}

		wp_send_json( $result );
	}

	public static function create_sample_calculator() {
		if ( empty( get_option( 'calc_sample_calculator', '' ) ) ) {
			update_option( 'calc_sample_calculator', true );
			$simple_calculator_path = CALC_PATH . '/demo-sample/sample_calculator.txt';

			if ( file_exists( $simple_calculator_path ) ) {
				$contents = file_get_contents( $simple_calculator_path ); //phpcs:ignore
				$contents = json_decode( $contents, true );
				$contents = json_decode( wp_json_encode( $contents ), true );
				if ( isset( $contents['calculators'] ) ) {
					foreach ( $contents['calculators'] as $calculator ) {
						if ( isset( $calculator['ccb_fields'] ) ) {
							$res = null;
							CCBExportImport::addCalculatorData( $calculator, $res, true );
						}
					}
				}
			}
		}
	}
}
