<?php
wp_enqueue_script( 'cbb-feedback', CALC_URL . '/frontend/dist/feedback.js', array(), CALC_VERSION, true );
wp_enqueue_style( 'ccb-bootstrap-css', CALC_URL . '/frontend/dist/css/bootstrap.min.css', array(), CALC_VERSION );
wp_enqueue_style( 'ccb-calc-font', CALC_URL . '/frontend/dist/css/font/font.css', array(), CALC_VERSION );
wp_enqueue_style( 'ccb-admin-app-css', CALC_URL . '/frontend/dist/css/admin.css', array(), CALC_VERSION );
wp_enqueue_script( 'cbb-order-js', CALC_URL . '/frontend/dist/order.js', array(), CALC_VERSION, true );
wp_localize_script(
	'cbb-order-js',
	'ajax_window',
	array(
		'ajax_url'     => admin_url( 'admin-ajax.php' ),
		'dateFormat'   => get_option( 'date_format' ),
		'language'     => substr( get_bloginfo( 'language' ), 0, 2 ),
		'plugin_url'   => CALC_URL,
		'translations' => array_merge( \cBuilder\Classes\CCBTranslations::get_frontend_translations(), \cBuilder\Classes\CCBTranslations::get_backend_translations() ),
		'pro_active'   => ccb_pro_active(),
	)
);
?>
<div class="ccb-settings-wrapper calculator-orders" id="calculator_orders">
	<div class="ccb-main-container">
		<?php require_once CALC_PATH . '/templates/admin/components/header.php'; ?>
		<div class="ccb-tab-content">
			<div class="ccb-tab-sections">
				<div class="ccb-table-body ccb-orders-page">
					<div class="ccb-grid-box">
						<div class="container">
							<div class="row ccb-p-t-15 ccb-p-b-15" style="height: 400px; position: relative">
								<div class="ccb-pro-feature-wrapper">
									<span class="ccb-pro-feature-wrapper--icon-box">
										<i  class="ccb-icon-Union-33"></i>
									</span>
									<span class="ccb-pro-feature-wrapper--label ccb-heading-3 ccb-bold"><?php esc_html_e( 'Available in PRO version', 'cost-calculator-builder' ); ?></span>
									<a href="https://stylemixthemes.com/cost-calculator-plugin/pricing/?utm_source=wpadmin&utm_medium=promo_calc&utm_campaign=2020" target="_blank" class="ccb-button ccb-href success"><?php esc_html_e( 'Upgrade Now', 'cost-calculator-builder' ); ?></a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
