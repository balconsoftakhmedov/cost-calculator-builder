<?php
$is_settings = isset( $_GET['tab'] ) && sanitize_text_field( $_GET['tab'] ) === 'settings'; // phpcs:ignore WordPress.Security.NonceVerification
wp_enqueue_script( 'cbb-bundle-js', CALC_URL . '/frontend/dist/admin.js', array(), CALC_VERSION, true );
wp_localize_script(
	'cbb-bundle-js',
	'ajax_window',
	array(
		'ajax_url'          => admin_url( 'admin-ajax.php' ),
		'condition_actions' => \cBuilder\Helpers\CCBConditionsHelper::getActions(),
		'condition_states'  => \cBuilder\Helpers\CCBConditionsHelper::getConditionStates(),
		'dateFormat'        => get_option( 'date_format' ),
		'language'          => substr( get_bloginfo( 'language' ), 0, 2 ),
		'plugin_url'        => CALC_URL,
		'templates'         => \cBuilder\Helpers\CCBFieldsHelper::get_fields_templates(),
		'translations'      => array_merge( \cBuilder\Classes\CCBTranslations::get_frontend_translations(), \cBuilder\Classes\CCBTranslations::get_backend_translations() ),
		'pro_active'        => ccb_pro_active(),
	)
);
?>

<div class="ccb-settings-wrapper calculator-settings" id="cost_calculator_main_page">
	<calc-builder inline-template>
		<div class="ccb-main-container">
			<template v-if="!$store.getters.getHideHeader">
				<?php require_once CALC_PATH . '/templates/admin/components/header.php'; ?>
			</template>
			<div class="ccb-tab-content">
				<div class="ccb-tab-sections ccb-loader-section" v-if="loader">
					<loader></loader>
				</div>
				<template v-else>
					<?php if ( $is_settings ) : ?>
						<general-settings inline-template>
							<?php require_once CALC_PATH . '/templates/admin/pages/settings.php'; ?>
						</general-settings>
					<?php else : ?>
						<calculators-page inline-template>
							<?php require_once CALC_PATH . '/templates/admin/pages/calculator.php'; ?>
						</calculators-page>
					<?php endif; ?>
				</template>
			</div>
		</div>
	</calc-builder>
</div>
