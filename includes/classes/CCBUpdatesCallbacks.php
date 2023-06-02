<?php

namespace cBuilder\Classes;

use cBuilder\Classes\Appearance\Presets\CCBPresetGenerator;
use cBuilder\Classes\CustomFields\CCBCustomFields;
use cBuilder\Classes\Database\Orders;
use cBuilder\Classes\Database\Payments;
use cBuilder\Helpers\CCBConditionsHelper;

class CCBUpdatesCallbacks {

	/**
	 * 3.1.23
	 * Update woo_products settings
	 * create category_ids option
	 * add all category ids if woo_products enabled empty value ( cause by default is "All categories" )
	 * add to array choosen value ( category_id )  if exist
	 */
	public static function ccb_make_woo_product_category_id_multiple() {
		$calculators    = self::get_calculators();
		$all_categories = ccb_woo_categories();
		$category_ids   = array();
		if ( ! ( $all_categories instanceof \WP_Error ) ) {
			$category_ids = array_column( $all_categories, 'term_id' );
		}

		foreach ( $calculators as $calculator ) {
			$calc_settings = get_option( 'stm_ccb_form_settings_' . $calculator->ID );
			$woo_products  = $calc_settings['woo_products'];

			/** create new option for list of category ids **/
			$woo_products['category_ids'] = array();
			if ( null !== $woo_products['category_id'] ) {
				array_push( $woo_products['category_ids'], $woo_products['category_id'] );
			}

			if ( $woo_products['enable'] ) {
				$woo_products['category_ids'] = $category_ids;
			}

			$calc_settings['woo_products'] = $woo_products;
			update_option( 'stm_ccb_form_settings_' . sanitize_text_field( $calculator->ID ), apply_filters( 'stm_ccb_sanitize_array', $calc_settings ) );
		}
	}

	/**
	 * 3.1.23
	 * Add  show_details_accordion option to settings.
	 * By default is true
	 */
	public static function ccb_add_show_details_accordion_option_to_settings() {
		$calculators = self::get_calculators();
		foreach ( $calculators as $calculator ) {
			$calc_settings                                      = get_option( 'stm_ccb_form_settings_' . $calculator->ID );
			$calc_settings['general']['show_details_accordion'] = true;
			update_option( 'stm_ccb_form_settings_' . sanitize_text_field( $calculator->ID ), apply_filters( 'stm_ccb_sanitize_array', $calc_settings ) );
		}
	}

	/**
	 * 3.0.0
	 * Update Payments table total column.
	 */
	public static function calculator_version_control() {
		if ( empty( get_option( 'ccb_general_settings' ) ) ) {
			update_option( 'ccb_general_settings', \cBuilder\Classes\CCBSettingsData::general_settings_data() );
		}
	}

	/**
	 * 2.3.2
	 * Update Payments table total column.
	 */
	public static function ccb_update_payments_table_total_column() {
		global $wpdb;
		$payment_table = Payments::_table();
		if ( $wpdb->get_var( $wpdb->prepare( 'SHOW COLUMNS FROM `%1s` LIKE %s;', $payment_table, 'total' ) ) ) { // phpcs:ignore
			$wpdb->query(
				$wpdb->prepare(
					"ALTER TABLE `%1s` CHANGE `total` `total` double NOT NULL DEFAULT '0.00000000';", // phpcs:ignore
					$payment_table
				)
			);
		}
	}

	/**
	 * 2.3.0
	 * Add Payments table.
	 */
	public static function ccb_add_payments_table() {
		Payments::create_table();
	}

	/**
	 * 2.3.0
	 * Move Payments data from order to payment table.
	 */
	public static function move_from_order_to_payment_table() {
		$orders = Orders::get_all();
		foreach ( $orders as $order ) {
			$exist = Payments::get( 'order_id', $order['id'] );
			if ( null !== $exist ) {
				continue;
			}

			$payment_type = Payments::$defaultType; // phpcs:ignore
			if ( ! empty( $order['payment_method'] ) && in_array( $order['payment_method'], Payments::$typeList, true ) ) { // phpcs:ignore
				$payment_type = $order['payment_method'];
			}

			$payment = array(
				'order_id'   => $order['id'],
				'type'       => $payment_type,
				'status'     => ! empty( $order['status'] ) ? $order['status'] : Payments::$defaultStatus, // phpcs:ignore
				'total'      => $order['total'],
				'currency'   => $order['currency'],
				'created_at' => wp_date( 'Y-m-d H:i:s' ),
				'updated_at' => wp_date( 'Y-m-d H:i:s' ),
			);

			if ( Payments::$completeStatus === $payment['status'] ) { // phpcs:ignore
				$payment['paid_at'] = wp_date( 'Y-m-d H:i:s' );
			}
			Payments::insert( $payment );
		}
		self::drop_payment_fields_from_order_table();
	}

	/**
	 * 2.3.0
	 * Update Orders table, remove payment_method, currency, total
	 */
	public static function drop_payment_fields_from_order_table() {
		global $wpdb;
		try {
			if ( $wpdb->get_var( $wpdb->prepare( 'SHOW COLUMNS FROM `%1s` LIKE %s;', Orders::_table(), 'payment_method' ) ) ) {  // phpcs:ignore
				$wpdb->query( $wpdb->prepare( 'ALTER TABLE `%1s` DROP  COLUMN `payment_method`;', Orders::_table() ) );  // phpcs:ignore
			}

			if ( $wpdb->get_var( $wpdb->prepare( 'SHOW COLUMNS FROM `%1s` LIKE %s;', Orders::_table(), 'currency' ) ) ) {  // phpcs:ignore
				$wpdb->query( $wpdb->prepare( 'ALTER TABLE `%1s` DROP  COLUMN `currency`;', Orders::_table() ) );  // phpcs:ignore
			}

			if ( $wpdb->get_var( $wpdb->prepare( 'SHOW COLUMNS FROM `%1s` LIKE %s;', Orders::_table(), 'total' ) ) ) {  // phpcs:ignore
				$wpdb->query( $wpdb->prepare( 'ALTER TABLE `%1s` DROP  COLUMN `total`;', Orders::_table() ) );  // phpcs:ignore
			}
		} catch ( \Exception $e ) {
			ccb_write_log( $e );
		}
	}

	/**
	 * Version 2.2.7
	 * Save setting calculators
	 */
	public static function cc_or_and_conditions() {
		$calculator_list = self::get_calculators();
		CCBConditionsHelper::updateConditionStructureToMakeMultiple( $calculator_list );
	}

	/**
	 * Version 2.2.6
	 * Create wp_cc_order table
	 */
	public static function cc_create_orders_table() {
		\cBuilder\Classes\Database\Orders::create_table();
	}

	/**
	 * Version 2.2.5
	 * update condition actions ( set values without spaces )
	 */
	public static function cc_update_all_calculators_condition_actions() {
		$calculator_list = self::get_calculators();
		CCBConditionsHelper::updateConditionActions( $calculator_list );
	}

	/**
	 *  Version 2.2.4
	 *  update condition node coordinates
	 *  and add links target data
	 *  based on old logic
	 */
	public static function cc_update_all_calculators_conditions_coordinates() {
		$calculator_list = self::get_calculators();
		CCBConditionsHelper::recalculateCoordinates( $calculator_list );
	}

	/**
	 * Version 2.1.0
	 */
	public static function update_condition_data() {
		$calculators = self::get_calculators();
		foreach ( $calculators as $calculator ) {
			$conditions = get_post_meta( $calculator->ID, 'stm-conditions', true );

			if ( ! empty( $conditions['links'] ) ) {
				foreach ( $conditions['links'] as $index => $link ) {

					$options_from = $link['options_from'];
					$condition    = isset( $link['condition'] ) ? $link['condition'] : array();
					$changed      = true;
					$options      = ! empty( $options_from['options'] ) ? $options_from['options'] : array();

					if ( isset( $condition ) ) {
						foreach ( $condition as $condition_key => $condition_item ) {
							foreach ( $options as $option_index => $option ) {
								if ( $condition_item['value'] === $option['optionValue'] && $changed ) {
									$condition[ $condition_key ]['key'] = $option_index;
									$changed                            = false;
								}
							}
						}
					}
					$conditions['links'][ $index ]['condition'] = $condition;
				}
			}

			update_post_meta( $calculator->ID, 'stm-conditions', apply_filters( 'stm_ccb_sanitize_array', $conditions ) );
		}
	}

	/**
	 *  Version 2.1.1
	 */
	public static function condition_restructure() {
		$calculators = self::get_calculators();

		foreach ( $calculators as $calculator ) {
			$conditions = get_post_meta( $calculator->ID, 'stm-conditions', true );

			if ( ! empty( $conditions['nodes'] ) ) {
				$conditions['nodes'] = array_map(
					function ( $node ) {
						if ( isset( $node['options'] ) ) {
							$node['options'] = ! isset( $node['options']['alias'] ) ? $node['options'] : $node['options']['alias'];
						}

						return $node;
					},
					$conditions['nodes']
				);
			}

			if ( ! empty( $conditions['links'] ) ) {
				$conditions['links'] = array_map(
					function ( $link ) {
						$link = self::replace_options( $link );
						if ( isset( $link['condition'] ) ) {
							$link['condition'] = array_map(
								function ( $condition ) {
									$condition = self::replace_options( $condition, true );

									return $condition;
								},
								$link['condition']
							);
						}

						return $link;
					},
					$conditions['links']
				);
			}

			update_post_meta( $calculator->ID, 'stm-conditions', apply_filters( 'stm_ccb_sanitize_array', $conditions ) );
		}
	}

	public static function rename_woocommerce_settings() {
		$calculators = self::get_calculators();

		foreach ( $calculators as $calculator ) {
			$settings = get_option( 'stm_ccb_form_settings_' . $calculator->ID );

			if ( ! empty( $settings ) && isset( $settings['wooCommerce'] ) ) {
				$settings['woo_checkout'] = $settings['wooCommerce'];
				unset( $settings['wooCommerce'] );

				update_option( 'stm_ccb_form_settings_' . sanitize_text_field( $calculator->ID ), apply_filters( 'stm_ccb_sanitize_array', $settings ) );
			}
		}
	}

	public static function ccb_from_v1_to_v2() {
		$calculators = self::get_calculators();
		if ( empty( empty( 'ccb_general_settings' ) ) ) {
			update_option( 'ccb_general_settings', CCBSettingsData::general_settings_data() );
		}

		if ( ! empty( $calculators ) ) {
			foreach ( $calculators as $calculator ) {
				$box_style     = null;
				$settings      = CCBSettingsData::settings_data();
				$calc_settings = get_option( 'stm_ccb_form_settings_' . $calculator->ID );

				if ( isset( $calc_settings['recaptcha'] ) && ! empty( $calc_settings['recaptcha']['enable'] ) && ! empty( $calc_settings['recaptcha']['type'] ) ) {
					$general_settings = get_option( 'ccb_general_settings' );
					if ( isset( $general_settings['recaptcha'] ) ) {
						$type                                    = $calc_settings['recaptcha']['type'];
						$general_settings['recaptcha']['enable'] = filter_var( $calc_settings['recaptcha']['enable'], FILTER_VALIDATE_BOOLEAN );
						$general_settings['recaptcha']['type']   = $type;

						if ( ! empty( $type ) && isset( $calc_settings['recaptcha'][ $type ] ) && ( empty( $general_settings['recaptcha'][ $type ]['siteKey'] ) || empty( $general_settings['recaptcha'][ $type ]['secretKey'] ) ) ) {
							$general_settings['recaptcha'][ $type ] = $calc_settings['recaptcha'][ $type ];
						}
					}
					update_option( 'ccb_general_settings', apply_filters( 'calc_update_options', $general_settings ) );
				}

				if ( isset( $calc_settings['general']['descriptions'] ) ) {
					$calc_settings['general']['descriptions'] = 'show' === $calc_settings['general']['descriptions'];
				} else {
					$calc_settings['general']['descriptions'] = true;
				}

				if ( isset( $calc_settings['general']['hide_empty'] ) ) {
					$calc_settings['general']['hide_empty'] = 'show' === $calc_settings['general']['hide_empty'];
				} else {
					$calc_settings['general']['hide_empty'] = true;
				}

				if ( ! isset( $calc_settings['texts'] ) ) {
					$calc_settings['texts'] = $settings['texts'];
				}

				$totals = self::get_total_fields( $calculator->ID );
				if ( empty( $calc_settings['paypal']['formulas'] ) ) {
					$descriptions                        = $calc_settings['paypal']['description'];
					$calc_settings['paypal']['formulas'] = self::ccb_appearance_totals( $totals, $descriptions );
				}

				if ( empty( $calc_settings['stripe']['formulas'] ) ) {
					$descriptions                        = $calc_settings['stripe']['description'];
					$calc_settings['stripe']['formulas'] = self::ccb_appearance_totals( $totals, $descriptions );
				}

				if ( empty( $calc_settings['woo_checkout']['formulas'] ) ) {
					$descriptions                              = $calc_settings['woo_checkout']['description'];
					$calc_settings['woo_checkout']['formulas'] = self::ccb_appearance_totals( $totals, $descriptions );
				}

				$calc_settings['texts']['required_msg'] = ! isset( $calc_settings['notice']['requiredField'] ) ? 'This field is required' : $calc_settings['notice']['requiredField'];
				update_option( 'stm_ccb_form_settings_' . $calculator->ID, apply_filters( 'calc_update_options', $calc_settings ) );

				if ( isset( $calc_settings['general']['boxStyle'] ) ) {
					$box_style = $calc_settings['general']['boxStyle'];
				}

				$custom_fields = get_post_meta( $calculator->ID, 'ccb-custom-fields', true );
				self::ccb_appearance_helper( $calculator->ID, $custom_fields, $box_style );
			}
		}
	}

	public static function ccb_appearance_totals( $totals, $descriptions ) {
		$formulas = array();
		foreach ( $totals as $idx => $total ) {
			$ccbDesc = strpos( $descriptions, '[ccb-total-' . $idx . ']' );
			if ( false !== $ccbDesc ) {
				$formulas[] = array(
					'idx'   => $idx,
					'title' => $total['label'],
				);
			}
		}

		return $formulas;
	}

	public static function get_total_fields( $calc_id ) {
		$fields = get_post_meta( $calc_id, 'stm-fields', true );
		$totals = array();
		foreach ( $fields as $field ) {
			if ( isset( $field['_tag'] ) && 'cost-total' === $field['_tag'] ) {
				$totals[] = $field;
			}
		}

		return $totals;
	}

	public static function ccb_appearance_helper( $calc_id, $custom_fields, $box_style = null ) {
		$presets         = CCBPresetGenerator::get_static_preset_from_db();
		$custom_preset   = $presets[0];
		$container_style = ( is_null( $box_style ) || 'vertical' === $box_style ) ? 'v-container' : 'h-container';

		if ( ! empty( $custom_fields ) ) {
			$colors = array(
				'container_color' => '#FFFFFF',
				'primary_color'   => '#001931',
				'secondary_color' => '#FFFFFF',
				'accent_color'    => '#00B163',
				'error_color'     => '#D94141',
			);

			if ( isset( $custom_fields[ $container_style ] ) && isset( $custom_fields[ $container_style ]['fields'] ) ) {
				$container               = $custom_fields[ $container_style ]['fields'];
				$container_color         = $container[1]['solid']['value'];
				$container_border        = $container[2]['default'];
				$container_border_width  = $container_border['value'];
				$container_border_style  = $container_border['style']['value'];
				$container_border_radius = $custom_fields[ $container_style ]['fields'][3]['default']['value'];

				if ( ! empty( $container_color ) ) {
					$colors['container_color'] = $container_color;
				}

				if ( is_numeric( $container_border_width ) ) {
					$custom_preset['desktop']['borders']['container_border'] = CCBPresetGenerator::generate_border_inner( $container_border_style, $container_border_width, $container_border_radius );
				}

				if ( isset( $custom_fields[ $container_style ]['fields'][6]['default']['options'] ) ) {
					$paddings                                                               = $custom_fields[ $container_style ]['fields'][6]['default']['options']; // phpcs:ignore
					$custom_preset['desktop']['spacing_and_positions']['container_padding'] = array( intval( $paddings['top_left']['value'] ), intval( $paddings['top_right']['value'] ), intval( $paddings['bottom_right']['value'] ), intval( $paddings['bottom_left']['value'] ) );
				}

				if ( isset( $custom_fields[ $container_style ]['fields'][5]['default']['options'] ) ) {
					$margins                                                               = $custom_fields[ $container_style ]['fields'][5]['default']['options']; // phpcs:ignore
					$custom_preset['desktop']['spacing_and_positions']['container_margin'] = array(
						intval( $margins['top_left']['value'] ),
						intval( $margins['top_right']['value'] ),
						intval( $margins['bottom_right']['value'] ),
						intval( $margins['bottom_left']['value'] ),
					);
				}
			}

			if ( isset( $custom_fields['headers'] ) && isset( $custom_fields['headers']['fields'] ) ) {
				$color         = $custom_fields['headers']['fields'][0]['color'];
				$primary_color = ! empty( $color['value'] ) ? $color['value'] : $color['default'];

				if ( ! empty( $primary_color ) ) {
					$colors['primary_color'] = $primary_color;
				}
			}

			if ( isset( $custom_fields['buttons'] ) && isset( $custom_fields['buttons']['fields'] ) ) {
				$button_fields = $custom_fields['buttons']['fields'];
				if ( is_array( $button_fields ) && count( $button_fields ) > 5 ) {
					$button_border_width  = isset( $button_fields[3]['default']['value'] ) ? $button_fields[3]['default']['value'] : 0;
					$button_border_style  = isset( $button_fields[3]['default']['style']['value'] ) ? $button_fields[3]['default']['style']['value'] : 0;
					$button_border_radius = isset( $button_fields[4]['default']['value'] ) ? $button_fields[4]['default']['value'] : 0;

					if ( isset( $button_fields[5]['solid'] ) ) {
						$accent_color           = $button_fields[5]['solid']['value'];
						$colors['accent_color'] = $accent_color;
					}

					if ( is_numeric( $button_border_width ) ) {
						$custom_preset['desktop']['borders']['button_border'] = CCBPresetGenerator::generate_border_inner( $button_border_style, $button_border_width, $button_border_radius );
					}
				}
			}

			if ( ( isset( $custom_fields['quantity'] ) && isset( $custom_fields['quantity']['fields'] ) ) || ( isset( $custom_fields['input-fields'] ) && isset( $custom_fields['input-fields']['fields'] ) ) ) {
				$input_fields = isset( $custom_fields['quantity'] ) ? $custom_fields['quantity']['fields'] : $custom_fields['input-fields']['fields'];
				if ( is_array( $input_fields ) && count( $input_fields ) > 4 ) {
					$secondary_color     = $input_fields[2]['solid']['value'];
					$field_border_width  = $input_fields[3]['default']['value'];
					$field_border_style  = $input_fields[3]['default']['style']['value'];
					$field_border_radius = $input_fields[4]['default']['value'];

					if ( ! empty( $secondary_color ) ) {
						$colors['secondary_color'] = $secondary_color;
					}

					if ( is_numeric( $field_border_width ) ) {
						$custom_preset['desktop']['borders']['fields_border'] = CCBPresetGenerator::generate_border_inner( $field_border_style, $field_border_width, $field_border_radius );
					}
				}
			}

			$exist = self::preset_exist( $presets, $colors );
			if ( ! $exist ) {
				$custom_preset['desktop']['colors'] = $colors;
				$presets[]                          = $custom_preset;
				update_option( 'ccb_appearance_presets', apply_filters( 'ccb_appearance_data_update', $presets ) );
				update_post_meta( $calc_id, 'ccb_calc_preset_idx', count( $presets ) - 1 );
			} else {
				update_post_meta( $calc_id, 'ccb_calc_preset_idx', $exist );
			}
		}
	}

	public static function preset_exist( $presets, $colors ) {
		$exist = false;
		foreach ( $presets as $idx => $preset ) {
			if ( $preset['desktop']['colors'] == $colors && ! is_numeric( $exist ) ) { // phpcs:ignore
				$exist = $idx;
			}
		}

		return $exist;
	}

	public static function get_calculators() {
		$calculators = new \WP_Query(
			array(
				'posts_per_page' => - 1,
				'post_type'      => 'cost-calc',
				'post_status'    => array( 'publish' ),
			)
		);

		return $calculators->posts;
	}

	private static function replace_options( $param, $camel_case = false ) {
		$option_to_key   = $camel_case ? 'optionTo' : 'options_to';
		$option_from_key = $camel_case ? 'optionFrom' : 'options_from';

		if ( isset( $param[ $option_to_key ] ) ) {
			$param[ $option_to_key ] = is_array( $param[ $option_to_key ] ) && ! empty( $param[ $option_to_key ]['alias'] ) ? $param[ $option_to_key ]['alias'] : $param[ $option_to_key ];
		}

		if ( isset( $param[ $option_from_key ] ) ) {
			$param[ $option_from_key ] = is_array( $param[ $option_from_key ] ) && ! empty( $param[ $option_from_key ]['alias'] ) ? $param[ $option_from_key ]['alias'] : $param[ $option_from_key ];
		}

		return $param;
	}

	public static function calculator_add_preloader_appearance() {
		$presets = CCBPresetGenerator::get_static_preset_from_db();
		foreach ( $presets as $idx => $preset ) {
			if ( ! isset( $preset['desktop']['others']['calc_preloader'] ) ) {
				$preset['desktop']['others']['calc_preloader'] = 0;
			}

			$presets[ $idx ] = $preset;
		}

		update_option( 'ccb_appearance_presets', $presets );
	}

	public static function calculator_add_box_shadows_appearance() {
		$presets = CCBPresetGenerator::get_static_preset_from_db();
		foreach ( $presets as $idx => $preset ) {
			if ( ! isset( $preset['desktop']['shadows'] ) ) {
				$preset['desktop']['shadows'] = array(
					'container_shadow' => CCBPresetGenerator::get_shadows_default(),
				);
			}

			if ( ! isset( $preset['desktop']['elements_sizes']['container_vertical_max_width'] ) ) {
				$preset['desktop']['elements_sizes']['container_vertical_max_width']   = 970;
				$preset['desktop']['elements_sizes']['container_horizontal_max_width'] = 970;
				$preset['desktop']['elements_sizes']['container_two_column_max_width'] = 1200;
			}

			$presets[ $idx ] = $preset;
		}

		update_option( 'ccb_appearance_presets', $presets );
	}

	public static function calculator_add_quick_tour_options() {
		$quick_tour  = get_option( 'ccb_quick_tour_type', 'quick_tour_start' );
		$calculators = self::get_calculators();

		if ( count( $calculators ) > 0 && 'done' !== $quick_tour ) {
			update_option( 'ccb_quick_tour_type', 'done' );
		} elseif ( 'done' !== $quick_tour ) {
			update_option( 'ccb_quick_tour_type', 'skip' );
		}
	}

	public static function calculator_add_invoice_options_and_remove_version_control() {
		$version_control = get_option( 'ccb_version_control' );
		if ( 'v1' === $version_control || empty( $version_control ) ) {
			self::ccb_from_v1_to_v2();
			update_option( 'ccb_version_control', 'v2' );
		}

		$general_settings = get_option( 'ccb_general_settings' );
		if ( empty( $general_settings['invoice'] ) ) {
			$general_settings['invoice'] = array(
				'use_in_all'       => false,
				'companyName'      => '',
				'companyInfo'      => '',
				'companyLogo'      => '',
				'showAfterPayment' => '',
				'buttonText'       => 'PDF Download',
				'dateFormat'       => 'DD MM YYYY',
			);

			update_option( 'ccb_general_settings', apply_filters( 'calc_update_options', $general_settings ) );
		}
	}

	public static function calculator_add_invoice_send_email() {
		$general_settings = get_option( 'ccb_general_settings' );
		if ( empty( $general_settings['invoice']['emailButton'] ) ) {
			$general_settings['invoice']['emailButton']   = false;
			$general_settings['invoice']['fromEmail']     = '';
			$general_settings['invoice']['fromName']      = '';
			$general_settings['invoice']['submitBtnText'] = 'Send';
			$general_settings['invoice']['btnText']       = 'Send Quote';
		}

		update_option( 'ccb_general_settings', apply_filters( 'calc_update_options', $general_settings ) );
	}

	public static function calculator_edit_woo_product_add_to_cart() {
		$db_version_from = get_option( 'ccb_version_from' );
		if ( '3.1.2' !== $db_version_from ) {
			$calculators = self::get_calculators();
			foreach ( $calculators as $calculator ) {
				$calc_settings                 = get_option( 'stm_ccb_form_settings_' . $calculator->ID );
				$woo_products                  = $calc_settings['woo_products'];
				$woo_products['hide_woo_cart'] = $woo_products['hide_woo_cart'] ? '' : true;
				$calc_settings['woo_products'] = $woo_products;

				update_option( 'stm_ccb_form_settings_' . sanitize_text_field( $calculator->ID ), apply_filters( 'stm_ccb_sanitize_array', $calc_settings ) );
			}
		}
	}

	public static function calculator_add_container_blur() {
		$presets = CCBPresetGenerator::get_static_preset_from_db();
		foreach ( $presets as $idx => $preset ) {
			if ( isset( $preset['desktop']['colors'] ) ) {
				$colors = $preset['desktop']['colors'];
				if ( isset( $colors['container_color'] ) ) {
					$container_bg = $colors['container_color'];

					unset( $colors['container_color'] );
					$colors['container']         = CCBPresetGenerator::get_container_default( $container_bg );
					$preset['desktop']['colors'] = $colors;
				}
			}
			$presets[ $idx ] = $preset;
		}

		update_option( 'ccb_appearance_presets', $presets );
	}

	public static function calculator_edit_woo_checkout() {
		$calculators = self::get_calculators();
		foreach ( $calculators as $calculator ) {
			$calc_settings                   = get_option( 'stm_ccb_form_settings_' . $calculator->ID );
			$woo_checkout                    = $calc_settings['woo_checkout'];
			$woo_checkout['replace_product'] = isset( $woo_checkout['replace_product'] ) ? $woo_checkout['replace_product'] : true;
			$calc_settings['woo_checkout']   = $woo_checkout;

			update_option( 'stm_ccb_form_settings_' . sanitize_text_field( $calculator->ID ), apply_filters( 'stm_ccb_sanitize_array', $calc_settings ) );
		}
	}

	public static function calculator_add_templates() {
		CCBCalculatorTemplates::render_templates();
		CCBCalculators::create_sample_calculator();
		ccb_set_admin_url();
	}

	public static function calculator_add_email_templates_setting() {
		$general_settings = get_option( 'ccb_general_settings' );
		if ( empty( $general_settings['email_templates'] ) ) {
			$general_settings['email_templates'] = array(
				'title'           => 'Calculation result',
				'description'     => 'This email is automatically generated and does not require a response. If you have a question, please contact: support@example.com',
				'logo'            => '',
				'footer'          => true,
				'template_color'  => array(
					'value'   => '#EEF1F7',
					'type'    => 'color',
					'default' => '#EEF1F7',
				),
				'content_bg'      => array(
					'value'   => '#FFFFFF',
					'type'    => 'color',
					'default' => '#FFFFFF',
				),
				'main_text_color' => array(
					'value'   => '#001931',
					'type'    => 'color',
					'default' => '#001931',
				),
				'border_color'    => array(
					'value'   => '#ddd',
					'type'    => 'color',
					'default' => '#ddd',
				),
				'button_color'    => array(
					'value'   => '#00B163',
					'type'    => 'color',
					'default' => '#00B163',
				),
			);

			update_option( 'ccb_general_settings', apply_filters( 'calc_update_options', $general_settings ) );
		}
	}

	public static function calculator_email_templates_footer_toggle() {
		$general_settings = get_option( 'ccb_general_settings' );

		if ( isset( $general_settings['email_templates'] ) ) {
			if ( ! isset( $general_settings['email_templates']['footer'] ) ) {
				$general_settings['email_templates']['footer'] = true;

				update_option( 'ccb_general_settings', apply_filters( 'calc_update_options', $general_settings ) );
			}
		}
	}

	public static function calculator_add_styles() {
		$general_settings = get_option( 'ccb_general_settings', \cBuilder\Classes\CCBSettingsData::general_settings_data() );
		if ( isset( $general_settings['general'] ) && empty( $general_settings['general']['styles'] ) ) {
			$general_settings['styles'] = array(
				'radio'             => '',
				'checkbox'          => '',
				'toggle'            => '',
				'radio_with_img'    => '',
				'checkbox_with_img' => '',
			);
		}
	}
}
