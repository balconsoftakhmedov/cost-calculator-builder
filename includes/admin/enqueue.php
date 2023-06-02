<?php

use cBuilder\Classes\CCBTranslations;
use cBuilder\Helpers\CCBConditionsHelper;
use cBuilder\Helpers\CCBFieldsHelper;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function cBuilder_admin_enqueue() {
	wp_enqueue_style( 'ccb-global-styles', CALC_URL . '/frontend/dist/css/global.css', array(), CALC_VERSION );
	wp_enqueue_style( 'ccb-icons-list', CALC_URL . '/frontend/dist/css/icon/style.css', array(), CALC_VERSION );

	/** Loading wp media libraries **/
	if ( isset( $_GET['page'] ) && ( $_GET['page'] === 'cost_calculator_builder' ) ) { //phpcs:ignore
		wp_enqueue_media();
		wp_enqueue_script( 'cbb-resize-sensor-js', CALC_URL . '/frontend/dist/sticky/ResizeSensor.js', array(), CALC_VERSION, true );
		wp_enqueue_script( 'cbb-sticky-sidebar-js', CALC_URL . '/frontend/dist//sticky/sticky-sidebar.js', array( 'cbb-resize-sensor-js' ), CALC_VERSION, true );

		wp_enqueue_style( 'ccb-calc-font', CALC_URL . '/frontend/dist/css/font/font.css', array(), CALC_VERSION );
		wp_enqueue_style( 'ccb-bootstrap-css', CALC_URL . '/frontend/dist/css/bootstrap.min.css', array(), CALC_VERSION );
		wp_enqueue_style( 'ccb-front-app-css', CALC_URL . '/frontend/dist/css/style.css', array(), CALC_VERSION );
		wp_enqueue_style( 'ccb-admin-app-css', CALC_URL . '/frontend/dist/css/admin.css', array(), CALC_VERSION );
		wp_enqueue_style( 'ccb-templates-css', CALC_URL . '/frontend/dist/css/templates.css', array(), CALC_VERSION );
		wp_enqueue_style( 'ccb-material-css', CALC_URL . '/frontend/dist/css/material.css', array(), CALC_VERSION );
		wp_enqueue_style( 'ccb-material-style-css', CALC_URL . '/frontend/dist/css/material-styles.css', array(), CALC_VERSION );

		wp_enqueue_script( 'ccb-quick-tour-core-js', CALC_URL . '/frontend/dist/quick-tour/quick-tour-core.js', array( 'cbb-bundle-js' ), CALC_VERSION, true );
		wp_enqueue_script( 'cbb-feedback', CALC_URL . '/frontend/dist/feedback.js', array(), CALC_VERSION, true );
	} elseif ( isset( $_GET['page'] ) && ( $_GET['page'] === 'cost_calculator_gopro' ) ) { //phpcs:ignore
		wp_enqueue_style( 'ccb-calc-font', CALC_URL . '/frontend/dist/css/font/font.css', array(), CALC_VERSION );
		wp_enqueue_style( 'ccb-admin-gopro-css', CALC_URL . '/frontend/dist/css/gopro.css', array(), CALC_VERSION );
	} elseif ( ( isset( $_GET['page'] ) && ( $_GET['page'] === 'cost_calculator_builder-affiliation' ) ) // phpcs:ignore
		|| ( isset( $_GET['page'] ) && ( $_GET['page'] === 'cost_calculator_builder-account' ) ) // phpcs:ignore
		|| ( isset( $_GET['page'] ) && ( $_GET['page'] === 'cost_calculator_builder-contact' ) ) // phpcs:ignore
	) {
		wp_enqueue_style( 'ccb-calc-font', CALC_URL . '/frontend/dist/css/font/font.css', array(), CALC_VERSION );
	}
}

add_action( 'admin_enqueue_scripts', 'cBuilder_admin_enqueue', 1 );
