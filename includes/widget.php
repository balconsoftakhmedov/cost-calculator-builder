<?php
function ccb_widgets_load() {
	// Check required version
	if ( ! current_user_can( 'update_plugins' ) ) {
		return;
	}

	$elementor_version_required = '2.6.7';
	if ( function_exists( 'stm_admin_notices_init' ) && defined( 'ELEMENTOR_VERSION' ) && ! version_compare( ELEMENTOR_VERSION, $elementor_version_required, '>=' ) ) {

		$file_path = 'elementor/elementor.php';

		$upgrade_link = wp_nonce_url( self_admin_url( 'update.php?action=upgrade-plugin&plugin=' ) . $file_path, 'upgrade-plugin_' . $file_path );

		$init_data = array(
			'notice_type'          => 'elementor-update-notice',
			'notice_logo'          => 'elementor.svg',
			'notice_title'         => __( 'Elementor CCB Widgets is not working because you are using an old version of Elementor.', 'cost-calculator-builder-pro' ),
			'notice_btn_one'       => $upgrade_link,
			'notice_btn_one_title' => __( 'Update Elementor Now', 'cost-calculator-builder-pro' ),
		);

		stm_admin_notices_init( $init_data );
		return;
	}

	// Require the main plugin file
	require CALC_DIR . '/includes/classes/plugin.php';
}
