<div class="ccb-tab-container">
	<div class="ccb-grid-box">
		<div class="container">
			<div class="row ccb-p-t-15 ccb-p-b-15">
				<div class="col-12">
					<span class="ccb-tab-title"><?php esc_html_e( 'Grand Total', 'cost-calculator-builder' ); ?></span>
				</div>
				<div class="col-12">
					<span class="ccb-tab-description"><?php esc_html_e( 'In this section, you can set up the Grand Total and choose which additional values to display.', 'cost-calculator-builder' ); ?></span>
				</div>
			</div>
			<div class="row">
				<div class="col">
					<div class="list-header">
						<div class="ccb-switch">
							<input type="checkbox" v-model="settingsField.general.descriptions"/>
							<label></label>
						</div>
						<h6 class="ccb-heading-5"><?php esc_html_e( 'Grand Total', 'cost-calculator-builder' ); ?></h6>
					</div>
				</div>
			</div>
			<div class="row ccb-p-t-10">
				<div class="col">
					<div class="list-header">
						<div class="ccb-switch">
							<input type="checkbox" v-model="settingsField.general.hide_empty"/>
							<label></label>
						</div>
						<h6 class="ccb-heading-5"><?php esc_html_e( 'Zero Values in Grand Total', 'cost-calculator-builder' ); ?></h6>
					</div>
				</div>
			</div>
			<?php if ( ccb_pro_active() ) : ?>
				<div class="row ccb-p-t-10">
					<div class="col">
						<div class="list-header">
							<div class="ccb-switch">
								<input type="checkbox" v-model="settingsField.general.sticky"/>
								<label></label>
							</div>
							<h6 class="ccb-heading-5"><?php esc_html_e( 'Grand Total Sticky', 'cost-calculator-builder' ); ?></h6>
							<span class="ccb-help-tip-block" style="margin-top: 2px;">
								<span class="ccb-help-label" ><?php esc_html_e( 'Preview', 'cost-calculator-builder' ); ?></span>
								<span class="ccb-help ccb-help-settings">
									<span class="ccb-help-content">
										<img src="<?php echo esc_url( CALC_URL . '/frontend/dist/img/sticky.gif' ); ?>" alt="woo logo">
									</span>
								</span>
							</span>
						</div>
					</div>
				</div>
			<?php else : ?>
				<div class="row ccb-p-t-10">
					<div class="col">
						<div class="list-header ccb-settings-in-pro">
							<div class="ccb-settings-in-pro-container">
								<div class="ccb-switch">
									<input type="checkbox"/>
									<label></label>
								</div>
								<h6 class="ccb-heading-5" style="margin-bottom: 0;line-height: 1.7; font-size: 15px"><?php esc_html_e( 'Grand Total Sticky', 'cost-calculator-builder' ); ?></h6>
							</div>
							<span class="ccb-help-tip-block" style="margin-top: 2px;">
								<span class="ccb-help-label" style="color: #001931cc"><?php esc_html_e( 'Preview', 'cost-calculator-builder' ); ?></span>
								<span class="ccb-help ccb-help-settings">
									<span class="ccb-help-content">
										<img src="<?php echo esc_url( CALC_URL . '/frontend/dist/img/sticky.gif' ); ?>" alt="woo logo">
									</span>
								</span>
							</span>
							<a class="ccb-settings-in-pro-lock" target="_blank" href="https://stylemixthemes.com/cost-calculator-plugin/pricing/?utm_source=wpadmin&utm_medium=promo_calc&utm_campaign=2020">
								<i class="ccb-icon-Path-3482"></i>
								<span>Pro</span>
							</a>
						</div>
					</div>
				</div>
			<?php endif; ?>
			<div class="row ccb-p-t-10">
				<div class="col">
					<div class="list-header">
						<div class="ccb-switch">
							<input type="checkbox" v-model="settingsField.general.show_details_accordion"/>
							<label></label>
						</div>
						<h6 class="ccb-heading-5"><?php esc_html_e( 'Grand Total Details', 'cost-calculator-builder' ); ?></h6>
						<span class="ccb-help-tip-block" style="margin-top: 2px;">
							<span class="ccb-help-label" ><?php esc_html_e( 'Preview', 'cost-calculator-builder' ); ?></span>
							<span class="ccb-help ccb-help-settings">
								<span class="ccb-help-content">
									<img src="<?php echo esc_url( CALC_URL . '/frontend/dist/img/total_summary.gif' ); ?>" alt="woo logo">
								</span>
							</span>
						</span>
					</div>
				</div>
			</div>
			<div class="row ccb-p-t-15">
				<div class="col col-3">
					<div class="ccb-input-wrapper">
						<span class="ccb-input-label"><?php esc_html_e( 'Grand Total Title', 'cost-calculator-builder' ); ?></span>
						<input type="text" v-model.trim="settingsField.general.header_title" placeholder="<?php esc_attr_e( 'Summary', 'cost-calculator-builder' ); ?>">
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
