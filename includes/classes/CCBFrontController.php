<?php

namespace cBuilder\Classes;

use cBuilder\Helpers\CCBFieldsHelper;

class CCBFrontController {
	public static function init() {
		add_action(
			'wp_enqueue_scripts',
			function () {
				wp_enqueue_script( 'jquery' );
			}
		);
		add_shortcode( 'stm-calc', array( self::class, 'render_calculator' ) );
	}

	/**
	 * todo all template params must be here in controller
	 */
	public static function render_calculator( $attr ) {

		wp_enqueue_script( 'cbb-resize-sensor-js', CALC_URL . '/frontend/dist/sticky/ResizeSensor.js', array(), CALC_VERSION, true );
		wp_enqueue_script( 'cbb-sticky-sidebar-js', CALC_URL . '/frontend/dist//sticky/sticky-sidebar.js', array( 'cbb-resize-sensor-js' ), CALC_VERSION, true );

		wp_enqueue_style( 'ccb-icons-list', CALC_URL . '/frontend/dist/css/icon/style.css', array(), CALC_VERSION );
		wp_enqueue_style( 'calc-builder-app', CALC_URL . '/frontend/dist/css/style.css', array(), CALC_VERSION );
		wp_enqueue_style( 'ccb-material', CALC_URL . '/frontend/dist/css/material.css', array(), CALC_VERSION );
		wp_enqueue_style( 'ccb-material-style', CALC_URL . '/frontend/dist/css/material-styles.css', array(), CALC_VERSION );
		wp_enqueue_script( 'ccb-lodash-js', 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js', array(), CALC_VERSION, true );
		wp_add_inline_script( 'ccb-lodash-js', 'window.ccb_lodash = window.ccb_lodash ? window.ccb_lodash : _.noConflict();' );

		$params   = shortcode_atts( array( 'id' => null ), $attr );
		$language = substr( get_bloginfo( 'language' ), 0, 2 );

		if ( ! is_admin() || ! empty( $_GET['page'] ) && 'cost_calculator_builder' === $_GET['action'] ) {  // phpcs:ignore WordPress.Security.NonceVerification
			wp_enqueue_script( 'calc-builder-main-js', CALC_URL . '/frontend/dist/bundle.js', array( 'ccb-lodash-js', 'cbb-sticky-sidebar-js' ), CALC_VERSION, true );
			wp_localize_script(
				'calc-builder-main-js',
				'ajax_window',
				array(
					'ajax_url'   => admin_url( 'admin-ajax.php' ),
					'language'   => $language,
					'templates'  => CCBFieldsHelper::get_fields_templates(),
					'pro_active' => ccb_pro_active(),
				)
			);
		}

		if ( isset( $params['id'] ) && get_post( $params['id'] ) ) {
			$calc_id = $params['id'];
			$id      = apply_filters( 'wpml_object_id', $calc_id, 'cost-calc', true );

			return \cBuilder\Classes\CCBTemplate::load(
				'/frontend/render',
				array(
					'calc_id'      => $id,
					'language'     => $language,
					'translations' => CCBTranslations::get_frontend_translations(),
				)
			);
		}
		return '<p style="text-align: center">' . __( 'No selected calculator', 'cost-calculator-builder' ) . '</p>';
	}
}
