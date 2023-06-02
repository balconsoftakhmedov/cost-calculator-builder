<?php

namespace cBuilder\Classes;

use cBuilder\Classes\Appearance\Presets\CCBPresetGenerator;

class CCBExportImport {

	public static $demoCalculatorsFilePath = CALC_PATH . '/demo-sample/cost_calculator_data.txt'; //phpcs:ignore

	/** Get total calculators count for custom file*/
	public static function custom_import_calculators_total() {

		check_ajax_referer( 'ccb_custom_import', 'nonce' );

		if ( ! current_user_can( 'publish_posts' ) ) {
			wp_send_json_error( __( 'You are not allowed to run this action', 'cost-calculator-builder' ) );
		}

		$result = array(
			'message' => array(),
			'success' => false,
		);

		$files = $_FILES;
		if ( ! empty( $files['file'] ) && file_exists( $files['file']['tmp_name'] ) ) {
			$content = file_get_contents( $files['file']['tmp_name'] ); // phpcs:ignore;
			$content = is_json_string( $content ) || is_string( $content ) ? json_decode( $content, true ) : $content;

			if ( is_array( $content ) ) {
				if ( isset( $content['calculators'] ) ) {
					$result['message']['calculators'] = count( $content['calculators'] );
				} else {
					$result['message']['calculators'] = count( $content );
				}

				$result['success'] = true;
				$content           = wp_json_encode( $content );
				update_option( 'ccb_demo_import_content', $content );
			}
		}

		wp_send_json( $result );
	}

	/** Get total calculators count for demo file*/
	public static function demo_import_calculators_total() {
		check_ajax_referer( 'ccb_demo_import_apply', 'nonce' );
		if ( ! current_user_can( 'publish_posts' ) ) {
			wp_send_json_error( __( 'You are not allowed to run this action', 'cost-calculator-builder' ) );
		}

		$total_calculators = 0;
		if ( file_exists( self::$demoCalculatorsFilePath ) ) { //phpcs:ignore
			$file_contents     = file_get_contents( self::$demoCalculatorsFilePath ); // phpcs:ignore
			$total_calculators = self::get_file_total_calculators( $file_contents );
		}
		wp_send_json( array( 'calculators' => $total_calculators ) );
	}

	/** Load custom and demo import calculators*/
	public static function import_run() {
		check_ajax_referer( 'ccb_demo_import_run', 'nonce' );

		if ( ! current_user_can( 'publish_posts' ) ) {
			wp_send_json_error( __( 'You are not allowed to run this action', 'cost-calculator-builder' ) );
		}

		$result = array(
			'success' => true,
			'step'    => null,
			'key'     => 0,
		);

		$request_data = apply_filters( 'stm_ccb_sanitize_array', $_POST );

		if ( isset( $request_data['step'] ) && isset( $request_data['key'] ) ) {

			$result['step'] = sanitize_text_field( $request_data['step'] );
			$result['key']  = sanitize_text_field( $request_data['key'] );

			$contents          = null;
			$result['success'] = false;

			if ( file_exists( self::$demoCalculatorsFilePath ) && empty( $request_data['is_custom_import'] ) ) { //phpcs:ignore
				$contents = file_get_contents( self::$demoCalculatorsFilePath ); //phpcs:ignore
				$contents = json_decode( $contents, true );
			} elseif ( ! empty( $request_data['is_custom_import'] ) && ! empty( get_option( 'ccb_demo_import_content' ) ) ) {
				$contents = get_option( 'ccb_demo_import_content' );
				$contents = is_string( $contents ) ? json_decode( $contents ) : $contents;
			}

			$contents = json_decode( wp_json_encode( $contents ), true );
			if ( isset( $contents['calculators'] ) ) {
				$item = $contents['calculators'][ $result['key'] ];

				if ( isset( $item['ccb_fields'] ) ) {
					self::addCalculatorData( $item, $result );
				}
			} elseif ( ! empty( $request_data['is_custom_import'] ) && ! empty( $contents ) ) {
				if ( 0 === intval( $result['key'] ) ) {
					if ( empty( get_option( 'ccb_appearance_presets' ) ) ) {
						update_option( 'ccb_appearance_presets', CCBPresetGenerator::default_presets() );
					}

					if ( empty( get_option( 'ccb_general_settings' ) ) ) {
						update_option( 'ccb_general_settings', CCBSettingsData::general_settings_data() );
					}
				}

				$item = $contents[ $result['key'] ];
				if ( isset( $item['stm-fields'] ) ) {
					$item_data = array(
						'ccb_name'          => $item['stm-name'],
						'ccb_fields'        => $item['stm-fields'],
						'ccb_formula'       => $item['stm-formula'],
						'ccb_conditions'    => $item['stm-conditions'],
						'ccb_form_settings' => $item['stm_ccb_form_settings'],
						'ccb_custom_fields' => (array) $item['ccb-custom-fields'],
					);
					self::addCalculatorData( $item_data, $result, true );
				}
			}
		}

		wp_send_json( $result );
	}

	/**
	 * add calculator data and append values to result
	 * @param $data
	 * @param $result
	 */
	public static function addCalculatorData( $data, &$result, $custom_import = false, $status = 'publish' ) { //phpcs:ignore
		$default_settings = CCBSettingsData::settings_data();
		$title            = ! empty( $data['ccb_name'] ) ? sanitize_text_field( $data['ccb_name'] ) : 'Untitled';

		$calculator_post = array(
			'post_type'   => 'cost-calc',
			'post_title'  => $title,
			'post_status' => defined( 'CALC_DEV_MODE' ) ? 'publish' : $status,
		);

		$calculator_id = wp_insert_post( $calculator_post );
		update_post_meta( $calculator_id, 'stm-fields', isset( $data['ccb_fields'] ) ? (array) $data['ccb_fields'] : array() );
		update_post_meta( $calculator_id, 'stm-formula', isset( $data['ccb_formula'] ) ? (array) $data['ccb_formula'] : array() );
		update_post_meta( $calculator_id, 'stm-conditions', isset( $data['ccb_conditions'] ) ? (array) $data['ccb_conditions'] : array() );
		update_post_meta( $calculator_id, 'stm-name', isset( $data['ccb_name'] ) ? sanitize_text_field( $data['ccb_name'] ) : 'Untitled' );

		$data['ccb_form_settings'] = (array) $data['ccb_form_settings'];
		if ( ! isset( $data['ccb_form_settings']['texts'] ) ) {
			$data['ccb_form_settings']['texts'] = $default_settings['texts'];
		}

		$totals = CCBUpdatesCallbacks::get_total_fields( $calculator_id );
		if ( empty( $data['ccb_form_settings']['paypal']['formulas'] ) ) {
			$descriptions                                    = $data['ccb_form_settings']['paypal']['description'];
			$data['ccb_form_settings']['paypal']['formulas'] = CCBUpdatesCallbacks::ccb_appearance_totals( $totals, $descriptions );
		}

		if ( empty( $data['ccb_form_settings']['stripe']['formulas'] ) ) {
			$descriptions                                    = $data['ccb_form_settings']['stripe']['description'];
			$data['ccb_form_settings']['stripe']['formulas'] = CCBUpdatesCallbacks::ccb_appearance_totals( $totals, $descriptions );
		}

		if ( empty( $data['ccb_form_settings']['woo_checkout']['formulas'] ) ) {
			$descriptions = $data['ccb_form_settings']['woo_checkout']['description'];

			$data['ccb_form_settings']['woo_checkout']['formulas'] = CCBUpdatesCallbacks::ccb_appearance_totals( $totals, $descriptions );
		}

		update_option( 'stm_ccb_form_settings_' . sanitize_text_field( $calculator_id ), apply_filters( 'stm_ccb_sanitize_array', $data['ccb_form_settings'] ) );

		if ( $custom_import ) {
			$custom_fields = empty( $data['ccb_custom_fields'] ) ? '' : $data['ccb_custom_fields'];
			$box_style     = $data['ccb_form_settings']['general']['boxStyle'];
			CCBUpdatesCallbacks::ccb_appearance_helper( $calculator_id, $custom_fields, $box_style );
		} else {
			if ( ! is_null( $data['ccb_preset'] ) ) {
				$calc_preset = (array) $data['ccb_preset'];
				$presets     = CCBPresetGenerator::get_static_preset_from_db();
				$colors      = $calc_preset['desktop']['colors'];
				$color_exist = CCBUpdatesCallbacks::preset_exist( $presets, $colors );

				if ( is_numeric( $color_exist ) && isset( $presets[ $color_exist ] ) ) {
					update_post_meta( $calculator_id, 'ccb_calc_preset_idx', $color_exist );
				} else {
					$presets[] = $calc_preset;
					update_post_meta( $calculator_id, 'ccb_calc_preset_idx', count( $presets ) - 1 );
					update_option( 'ccb_appearance_presets', apply_filters( 'ccb_appearance_data_update', $presets ) );
				}
			} else {
				update_post_meta( $calculator_id, 'ccb_calc_preset_idx', 0 );
			}
		}

		if ( 'draft' === $status ) {
			$temp_data = array(
				'calc_id'     => $calculator_id,
				'icon'        => $data['ccb_icon'],
				'title'       => $data['ccb_name'],
				'link'        => $data['ccb_link'],
				'category'    => $data['ccb_category'],
				'description' => $data['ccb_description'],
				'info'        => $data['ccb_info'],
				'type'        => isset( $data['ccb_type'] ) ? sanitize_text_field( $data['ccb_type'] ) : 'default',
			);

			CCBCalculatorTemplates::create_and_save_template( $temp_data );
		}

		if ( ! empty( $result ) ) {
			$result['key']++;
			$result['data']        = 'Create Calculator: ' . $title;
			$result['success']     = true;
			$result['calculators'] = CCBCalculators::get_calculator_list();
		}
	}

	/**
	 * @param string $fileContents
	 * @return int
	 */
	private static function get_file_total_calculators( $file_contents ) {
		$file_contents = is_json_string( $file_contents ) ? json_decode( $file_contents, true ) : array();
		return count( $file_contents['calculators'] );
	}

	public static function export_calculators() {
		if ( wp_verify_nonce( $_REQUEST['ccb_nonce'], 'ccb_export_nonce' ) ) {
			if ( ! empty( $_GET['calculator_ids'] ) ) {
				$ids         = explode( ',', $_GET['calculator_ids'] );
				$calculators = CCBCalculators::getWPCalculatorsWithIdsData( $ids );
				$data        = self::parse_export_data( $calculators, array() );
			} else {
				$calculators = CCBCalculators::getWPCalculatorsData();
				/** return if no calculators data */
				if ( count( $calculators ) <= 0 ) {
					wp_send_json(
						array(
							'success' => true,
							'message' => 'There is no calculators yet!',
						)
					);
					die();
				}

				$categories = CCBCategory::calc_categories_list();
				$data       = self::parse_export_data( $calculators, $categories );
			}

			$data     = wp_json_encode( $data );
			$filename = 'cost_calculator_data_' . date( 'mdYhis' ) . '.txt'; //phpcs:ignore

			header( 'Content-Description: File Transfer' );
			header( 'Content-Disposition: attachment; filename=' . $filename );
			header( 'Content-Type: text/xml; charset=' . get_option( 'blog_charset' ), true );

			echo sanitize_without_tag_clean( $data ); //phpcs:ignore

			die();
		}
	}

	public static function parse_export_data( $calculators, $categories ) {
		$result = array(
			'calculators' => array(),
			'categories'  => array(),
		);

		if ( ! is_array( $calculators ) || ! reset( $calculators ) instanceof \WP_Post ) {
			return $result;
		}

		$presets = CCBPresetGenerator::get_static_preset_from_db();
		if ( empty( $presets ) ) {
			$presets = CCBPresetGenerator::default_presets();
		}

		foreach ( $calculators as $post ) {
			if ( isset( $post->ID ) ) {
				$post_store = get_post_meta( $post->ID );

				$calculator                      = array();
				$calculator['ccb_name']          = $post_store['stm-name'][0];
				$calculator['ccb_fields']        = unserialize( $post_store['stm-fields'][0] ); //phpcs:ignore
				$calculator['ccb_formula']       = unserialize( $post_store['stm-formula'][0] ); //phpcs:ignore
				$calculator['ccb_category']      = get_post_meta( $post->ID, 'category', true ); //phpcs:ignore
				$calculator['ccb_icon']          = get_post_meta( $post->ID, 'icon', true ); //phpcs:ignore
				$calculator['ccb_type']          = get_post_meta( $post->ID, 'plugin_type', true ); //phpcs:ignore
				$calculator['ccb_link']          = get_post_meta( $post->ID, 'calc_link', true ); //phpcs:ignore
				$calculator['ccb_info']          = get_post_meta( $post->ID, 'info', true ); //phpcs:ignore
				$calculator['ccb_description']   = get_post_meta( $post->ID, 'description', true ); //phpcs:ignore
				$calculator['ccb_conditions']    = unserialize( $post_store['stm-conditions'][0] ); //phpcs:ignore
				$calculator['ccb_form_settings'] = isset( get_option( 'stm_ccb_form_settings_' . $post->ID )[0] ) ? get_option( 'stm_ccb_form_settings_' . $post->ID )[0] : get_option( 'stm_ccb_form_settings_' . $post->ID );

				$preset_key = get_post_meta( $post->ID, 'ccb_calc_preset_idx', true );
				$preset_key = empty( $preset_key ) ? 0 : $preset_key;

				$calculator['ccb_preset'] = ! isset( $presets[ $preset_key ] ) ? $presets[0] : $presets[ $preset_key ];
				$calculators['box_style'] = empty( $calculator['ccb_preset'] ) || empty( $calculator['ccb_preset']['box_style'] ) ? 'vertical' : $calculator['ccb_preset']['box_style'];
				array_push( $result['calculators'], $calculator );
			}
		}

		foreach ( $categories as $category ) {
			$cat          = array();
			$cat['title'] = get_post_meta( $category['id'], 'title', true );
			$cat['slug']  = get_post_meta( $category['id'], 'slug', true );
			$cat['type']  = get_post_meta( $category['id'], 'type', true );
			array_push( $result['categories'], $cat );
		}

		return $result;
	}
}
