<?php if ( ccb_pro_active() ) :
	do_action( 'render-multi-range' ); // phpcs:ignore
	?>
<?php else : ?>
	<div style="position: relative; width: 100%; height: 100%">
		<div class="ccb-edit-info" style="position: relative">
			<div class="ccb-edit-header" style="position: absolute; right: 0; z-index: 999;" @click="$emit( 'cancel' )">
				<span class="ccb-edit-close">
					<i class="ccb-icon-close"></i>
				</span>
			</div>
		</div>
		<div class="ccb-pro-feature-wrapper">
			<span class="ccb-pro-feature-wrapper--icon-box">
				<i  class="ccb-icon-Union-33"></i>
			</span>
			<span class="ccb-pro-feature-wrapper--label ccb-heading-3 ccb-bold"><?php esc_html_e( 'Available in PRO version', 'cost-calculator-builder' ); ?></span>
			<a href="https://stylemixthemes.com/cost-calculator-plugin/pricing/?utm_source=wpadmin&utm_medium=promo_calc&utm_campaign=2020" target="_blank" class="ccb-button ccb-href success"><?php esc_html_e( 'Upgrade Now', 'cost-calculator-builder' ); ?></a>
		</div>
	</div>
<?php endif; ?>
