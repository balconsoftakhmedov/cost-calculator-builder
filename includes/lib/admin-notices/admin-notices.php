<?php

if ( ! defined( 'ABSPATH' ) ) exit;

if ( ! function_exists( 'stm_admin_notices_init' ) ) {
	define( 'STM_ADMIN_NOTICES_VERSION', '1.0' );
	define( 'STM_ADMIN_NOTICES_PATH', dirname( __FILE__ ) );
	define( 'STM_ADMIN_NOTICES_URL', plugin_dir_url( __FILE__ ) );

	function stm_admin_notices_init( $plugin_data ) {
		if ( ! is_admin() ) {
			return;
		}

		if ( ! class_exists( 'STMNotices' ) ) {
			require_once __DIR__ . '/classes/STMNotices.php';
		}

		STMNotices::init( $plugin_data );
	}

}