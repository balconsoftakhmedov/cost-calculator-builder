<div class="ccb-tab-container">
	<div class="ccb-grid-box currency">
		<div class="container">
			<div class="row ccb-p-t-15">
				<div class="col">
					<span class="ccb-tab-title"><?php esc_html_e( 'Currency', 'cost-calculator-builder' ); ?></span>
				</div>
			</div>
		</div>
		<div class="container">
			<div class="row ccb-p-t-20">
				<div class="col">
					<div class="list-header">
						<div class="ccb-switch">
							<input type="checkbox" v-model="generalSettings.currency.use_in_all"/>
							<label></label>
						</div>
						<h6 class="ccb-heading-5"><?php esc_html_e( 'Apply for all calculators', 'cost-calculator-builder' ); ?></h6>
					</div>
				</div>
			</div>
			<div class="ccb-settings-property" :class="{'ccb-settings-disabled': !generalSettings.currency.use_in_all}">
				<div class="row ccb-p-t-20">
					<div class="col col-3">
						<div class="ccb-input-wrapper">
							<span class="ccb-input-label"><?php esc_html_e( 'Currency Sign', 'cost-calculator-builder' ); ?></span>
							<input type="text" v-model="generalSettings.currency.currency" placeholder="<?php esc_attr_e( 'Enter currency sign', 'cost-calculator-builder' ); ?>">
						</div>
					</div>
					<div class="col col-3">
						<div class="ccb-select-box">
							<span class="ccb-select-label"><?php esc_html_e( 'Currency Position', 'cost-calculator-builder' ); ?></span>
							<div class="ccb-select-wrapper">
								<i class="ccb-icon-Path-3485 ccb-select-arrow"></i>
								<select class="ccb-select" v-model="generalSettings.currency.currencyPosition">
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
								<select class="ccb-select" v-model="generalSettings.currency.thousands_separator">
									<option value=","><?php esc_html_e( ' Comma ', 'cost-calculator-builder' ); ?></option>
									<option value="."><?php esc_html_e( ' Dot ', 'cost-calculator-builder' ); ?></option>
									<option value="'"><?php esc_html_e( ' Apostrophe ', 'cost-calculator-builder' ); ?></option>
									<option value=" "><?php esc_html_e( ' Space ', 'cost-calculator-builder' ); ?></option>
								</select>
							</div>
						</div>
					</div>
				</div>
				<div class="row ccb-p-t-15">
					<div class="col col-3">
						<div class="ccb-input-wrapper number">
							<span class="ccb-input-label"><?php esc_html_e( 'Number of Decimals', 'cost-calculator-builder' ); ?></span>
							<div class="ccb-input-box">
								<input type="number" name="num_after_integer" v-model="generalSettings.currency.num_after_integer" placeholder="<?php esc_attr_e( 'Enter decimals', 'cost-calculator-builder' ); ?>">
								<!-- @click="numberCounterAction('step')" @click="numberCounterAction('step', '-')"-->
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
								<select class="ccb-select" v-model="generalSettings.currency.decimal_separator">
									<option value=","><?php esc_html_e( ' Comma ', 'cost-calculator-builder' ); ?></option>
									<option value="."><?php esc_html_e( ' Dot ', 'cost-calculator-builder' ); ?></option>
								</select>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="row ccb-p-t-20">
				<div class="col-3">
					<button class="ccb-button success ccb-settings" @click="saveGeneralSettings"><?php esc_html_e( 'Save', 'cost-calculator-builder' ); ?></button>
				</div>
			</div>
		</div>
	</div>
</div>
