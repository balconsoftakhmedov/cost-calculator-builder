<div class="ccb-tab-container">
	<div class="ccb-grid-box">
		<div class="container">
			<div class="row">
				<div class="col">
					<span class="ccb-tab-title"><?php esc_html_e( 'Currency', 'cost-calculator-builder' ); ?></span>
				</div>
			</div>
			<div class="row ccb-p-t-15" v-if="extended">
				<div class="col-12">
					<div class="ccb-extended-general">
						<span class="ccb-heading-4 ccb-bold"><?php esc_html_e( 'Global settings applied', 'cost-calculator-builder' ); ?></span>
						<span class="ccb-extended-general-description ccb-default-title ccb-light"><?php esc_html_e( 'If you want to set up a specific calculator, please go to', 'cost-calculator-builder' ); ?> <b> <?php esc_html_e( 'Settings → Currency', 'cost-calculator-builder' ); ?> </b> <?php esc_html_e( ' and turn off the setting', 'cost-calculator-builder' ); ?> <b><?php esc_html_e( '“Apply for all calculators”' ); ?></b> </span>
						<span class="ccb-extended-general-action">
							<a href="<?php echo esc_url( get_admin_url() . 'admin.php?page=cost_calculator_builder&tab=settings' ); ?>" class="ccb-button ccb-href success"><?php esc_html_e( 'Go to Settings', 'cost-calculator-builder' ); ?></a>
						</span>
					</div>
				</div>
			</div>
			<div class="row ccb-p-t-15" :class="{disabled: extended}">
				<div class="col col-3">
					<div class="ccb-input-wrapper">
						<span class="ccb-input-label"><?php esc_html_e( 'Currency Sign', 'cost-calculator-builder' ); ?></span>
						<input type="text" v-model="settingsField.currency.currency" placeholder="<?php esc_attr_e( 'Enter currency sign', 'cost-calculator-builder' ); ?>">
					</div>
				</div>
				<div class="col col-3">
					<div class="ccb-select-box">
						<span class="ccb-select-label"><?php esc_html_e( 'Currency Position', 'cost-calculator-builder' ); ?></span>
						<div class="ccb-select-wrapper">
							<i class="ccb-icon-Path-3485 ccb-select-arrow"></i>
							<select class="ccb-select" v-model="settingsField.currency.currencyPosition">
								<option value="left"><?php esc_html_e( 'Left', 'cost-calculator-builder' ); ?></option>
								<option value="right"><?php esc_html_e( 'Right', 'cost-calculator-builder' ); ?></option>
								<option value="left_with_space"><?php esc_html_e( 'Left with space', 'cost-calculator-builder' ); ?></option>
								<option value="right_with_space"><?php esc_html_e( 'Right with space', 'cost-calculator-builder' ); ?></option>
							</select>
						</div>
					</div>
				</div>
				<div class="col col-3">
					<div class="ccb-select-box">
						<span class="ccb-select-label"><?php esc_html_e( 'Thousands Separator', 'cost-calculator-builder' ); ?></span>
						<div class="ccb-select-wrapper">
							<i class="ccb-icon-Path-3485 ccb-select-arrow"></i>
							<select class="ccb-select" v-model="settingsField.currency.thousands_separator">
								<option value=","><?php esc_html_e( 'Comma', 'cost-calculator-builder' ); ?></option>
								<option value="."><?php esc_html_e( 'Dot', 'cost-calculator-builder' ); ?></option>
								<option value="'"><?php esc_html_e( 'Apostrophe', 'cost-calculator-builder' ); ?></option>
								<option value=" "><?php esc_html_e( 'Space', 'cost-calculator-builder' ); ?></option>
							</select>
						</div>
					</div>
				</div>
			</div>
			<div class="row ccb-p-t-15" :class="{disabled: extended}">
				<div class="col col-3">
					<div class="ccb-input-wrapper number">
						<span class="ccb-input-label"><?php esc_html_e( 'Number of Decimals', 'cost-calculator-builder' ); ?></span>
						<div class="ccb-input-box">
							<input type="number" v-model="settingsField.currency.num_after_integer" min="0" max="8" placeholder="<?php esc_attr_e( 'Enter decimals count', 'cost-calculator-builder' ); ?>">
							<span class="input-number-counter up"></span>
							<span class="input-number-counter down"></span>
						</div>
					</div>
				</div>
				<div class="col col-3">
					<div class="ccb-select-box">
						<span class="ccb-select-label"><?php esc_html_e( 'Decimal Separator', 'cost-calculator-builder' ); ?></span>
						<div class="ccb-select-wrapper">
							<i class="ccb-icon-Path-3485 ccb-select-arrow"></i>
							<select class="ccb-select" v-model="settingsField.currency.decimal_separator">
								<option value=","><?php esc_html_e( 'Comma', 'cost-calculator-builder' ); ?></option>
								<option value="."><?php esc_html_e( 'Dot', 'cost-calculator-builder' ); ?></option>
							</select>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
