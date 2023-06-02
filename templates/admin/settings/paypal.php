<div class="ccb-tab-container">
	<?php if ( ! defined( 'CCB_PRO' ) ) : ?>
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
	<?php else : ?>
		<?php do_action( 'render-paypal' ); //phpcs:ignore ?>
	<?php endif; ?>
</div>
