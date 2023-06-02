<?php
wp_enqueue_style( 'ccb-bootstrap-css', CALC_URL . '/frontend/dist/css/bootstrap.min.css', array(), CALC_VERSION );
wp_enqueue_style( 'ccb-front-app-css', CALC_URL . '/frontend/dist/css/templates.css', array(), CALC_VERSION );
wp_enqueue_style( 'ccb-front-app-css', CALC_URL . '/frontend/dist/css/style.css', array(), CALC_VERSION );
wp_enqueue_style( 'ccb-admin-app-css', CALC_URL . '/frontend/dist/css/admin.css', array(), CALC_VERSION );
wp_enqueue_style( 'ccb-material-css', CALC_URL . '/frontend/dist/css/material.css', array(), CALC_VERSION );
wp_enqueue_style( 'ccb-material-style-css', CALC_URL . '/frontend/dist/css/material-styles.css', array(), CALC_VERSION );
wp_enqueue_script( 'cbb-templates-js', CALC_URL . '/frontend/dist/templates.js', array(), CALC_VERSION, true );
wp_localize_script(
	'cbb-templates-js',
	'ajax_window',
	array(
		'ajax_url'     => admin_url( 'admin-ajax.php' ),
		'language'     => substr( get_bloginfo( 'language' ), 0, 2 ),
		'plugin_url'   => CALC_URL,
		'translations' => array_merge( \cBuilder\Classes\CCBTranslations::get_frontend_translations(), \cBuilder\Classes\CCBTranslations::get_backend_translations() ),
		'pro_active'   => ccb_pro_active(),
	)
);
?>
<div class="ccb-settings-wrapper calculator-templates" id="cost_calculator_templates">
	<template-container inline-template>
		<?php require_once CALC_PATH . '/templates/admin/single-calc/templates.php'; ?>
	</template-container>
</div>
