<?php

namespace cBuilder\Classes;

class CCBUpdates {

	private static $updates = array(
		'2.1.0'  => array(
			'update_condition_data',
		),
		'2.1.1'  => array(
			'condition_restructure',
		),
		'2.1.6'  => array(
			'rename_woocommerce_settings',
		),
		'2.2.4'  => array(
			'cc_update_all_calculators_conditions_coordinates',
		),
		'2.2.6'  => array(
			'cc_create_orders_table',
		),
		'2.2.7'  => array(
			'cc_or_and_conditions',
		),
		'2.3.0'  => array(
			'ccb_add_payments_table',
			'move_from_order_to_payment_table',
		),
		'2.3.2'  => array(
			'ccb_update_payments_table_total_column',
		),
		'3.0.0'  => array(
			'calculator_version_control',
		),
		'3.0.1'  => array(
			'calculator_add_preloader_appearance',
		),
		'3.0.2'  => array(
			'calculator_add_box_shadows_appearance',
		),
		'3.0.4'  => array(
			'calculator_add_quick_tour_options',
		),
		'3.0.8'  => array(
			'calculator_add_invoice_options_and_remove_version_control',
		),
		'3.1.1'  => array(
			'calculator_add_invoice_send_email',
		),
		'3.1.2'  => array(
			'calculator_edit_woo_product_add_to_cart',
		),
		'3.1.7'  => array(
			'calculator_add_container_blur',
			'calculator_edit_woo_checkout',
		),
		'3.1.14' => array(
			'calculator_add_templates',
		),
		'3.1.19' => array(
			'calculator_add_email_templates_setting',
		),
		'3.1.20' => array(
			'calculator_email_templates_footer_toggle',
		),
		'3.1.21' => array(
			'calculator_add_styles',
		),
		'3.1.23' => array(
			'ccb_make_woo_product_category_id_multiple',
			'ccb_add_show_details_accordion_option_to_settings',
		),
	);

	public static function init() {
		if ( version_compare( get_option( 'ccb_version' ), CALC_VERSION, '<' ) ) {
			self::update_version();
		}
	}

	public static function get_updates() {
		return self::$updates;
	}

	public static function needs_to_update() {
		$update_versions    = array_keys( self::get_updates() );
		$current_db_version = get_option( 'calc_db_updates', 1 );
		usort( $update_versions, 'version_compare' );

		return ! is_null( $current_db_version ) && version_compare( $current_db_version, end( $update_versions ), '<' );
	}

	private static function maybe_update_db_version() {
		if ( self::needs_to_update() ) {
			$updates         = self::get_updates();
			$calc_db_version = get_option( 'calc_db_updates' );

			foreach ( $updates as $version => $callback_arr ) {
				if ( version_compare( $calc_db_version, $version, '<' ) ) {
					foreach ( $callback_arr as $callback ) {
						call_user_func( array( '\\cBuilder\\Classes\\CCBUpdatesCallbacks', $callback ) );
					}
				}
			}
		}
		update_option( 'calc_db_updates', sanitize_text_field( CALC_DB_VERSION ), true );
	}

	public static function update_version() {
		update_option( 'ccb_version_from', get_option( 'ccb_version' ) );
		update_option( 'ccb_version', sanitize_text_field( CALC_VERSION ), true );
		self::maybe_update_db_version();
	}

	/**
	 * Run calc updates after import old calculators
	 * @return void
	 */
	public static function run_calc_updates() {
		check_ajax_referer( 'ccb_run_calc_updates', 'nonce' );

		$updates = self::get_updates();

		if ( current_user_can( 'publish_posts' ) && 'calc-run-calc-updates' === $_POST['action'] && ! empty( $_POST['access'] ) ) {
			foreach ( $updates as $version => $callback_arr ) {
				foreach ( $callback_arr as $callback ) {
					call_user_func( array( '\\cBuilder\\Classes\\CCBUpdatesCallbacks', $callback ) );
				}
			}
		}
	}
}
