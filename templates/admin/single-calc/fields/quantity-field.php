<div class="cbb-edit-field-container">
	<div class="ccb-edit-field-header">
		<span class="ccb-edit-field-title ccb-heading-3 ccb-bold"><?php esc_html_e( 'Quantity', 'cost-calculator-builder' ); ?></span>
		<div class="ccb-field-actions">
			<button class="ccb-button default" @click="$emit( 'cancel' )"><?php esc_html_e( 'Cancel', 'cost-calculator-builder' ); ?></button>
			<button class="ccb-button success" @click.prevent="save(quantityField, id, index)"><?php esc_html_e( 'Save', 'cost-calculator-builder' ); ?></button>
		</div>
	</div>
	<div class="ccb-grid-box ccb-vertical">
		<div class="container">
			<div class="row">
				<div class="col">
					<div class="ccb-input-wrapper">
						<span class="ccb-input-label"><?php esc_html_e( 'Name', 'cost-calculator-builder' ); ?></span>
						<input type="text" class="ccb-heading-5 ccb-light" placeholder="<?php esc_attr_e( 'Enter field name', 'cost-calculator-builder' ); ?>" v-model.trim="quantityField.label">
					</div>
				</div>
				<div class="col">
					<div class="ccb-input-wrapper">
						<span class="ccb-input-label"><?php esc_html_e( 'Placeholder', 'cost-calculator-builder' ); ?></span>
						<input type="text" class="ccb-heading-5 ccb-light" placeholder="<?php esc_attr_e( 'Enter field placeholder', 'cost-calculator-builder' ); ?>" v-model.trim="quantityField.placeholder">
					</div>
				</div>
			</div>
			<div class="row ccb-p-t-15">
				<div class="col-12">
					<div class="ccb-input-wrapper">
						<span class="ccb-input-label"><?php esc_html_e( 'Description', 'cost-calculator-builder' ); ?></span>
						<input type="text" class="ccb-heading-5 ccb-light" placeholder="<?php esc_attr_e( 'Enter field description', 'cost-calculator-builder' ); ?>" v-model.trim="quantityField.description">
					</div>
				</div>
			</div>
			<div class="row ccb-p-t-15">
				<div class="col-6">
					<div class="ccb-input-wrapper number">
						<span class="ccb-input-label"><?php esc_html_e( 'Step', 'cost-calculator-builder' ); ?></span>
						<div class="ccb-input-box">
							<input type="number" class="ccb-heading-5 ccb-light" name="step" min="0" step="1" @input="errors.step=false" v-model="quantityField.step" placeholder="<?php esc_attr_e( 'Enter field step', 'cost-calculator-builder' ); ?>">
							<span @click="numberCounterAction('step')" class="input-number-counter up"></span>
							<span @click="numberCounterAction('step', '-')" class="input-number-counter down"></span>
						</div>
						<span class="ccb-error-tip default" v-if="isObjectHasPath(errors, ['step'] ) && errors.step" v-html="errors.step"></span>
					</div>
				</div>
				<div class="col-6">
					<div class="ccb-input-wrapper number">
						<span class="ccb-input-label"><?php esc_html_e( 'Default Value', 'cost-calculator-builder' ); ?></span>
						<div class="ccb-input-box">
							<input type="number" class="ccb-heading-5 ccb-light" name="default" min="0" step="1" v-model="quantityField.default" placeholder="<?php esc_attr_e( 'Enter field default value', 'cost-calculator-builder' ); ?>">
							<span @click="numberCounterAction('default')" class="input-number-counter up"></span>
							<span @click="numberCounterAction('default', '-')" class="input-number-counter down"></span>
						</div>
					</div>
				</div>
			</div>
			<div class="row ccb-p-t-15">
				<div class="col-6">
					<div class="ccb-input-wrapper number">
						<span class="ccb-input-label"><?php esc_html_e( 'Quantity unit', 'cost-calculator-builder' ); ?></span>
						<div class="ccb-input-box">
							<input type="number" class="ccb-heading-5 ccb-light" name="unit" min="0" step="1" @input="errors.unit=false" v-model="quantityField.unit" placeholder="<?php esc_attr_e( 'Enter field unit', 'cost-calculator-builder' ); ?>">
							<span @click="numberCounterAction('unit')" class="input-number-counter up"></span>
							<span @click="numberCounterAction('unit', '-')" class="input-number-counter down"></span>
						</div>
						<span class="ccb-error-tip default" v-if="isObjectHasPath(errors, ['unit'] ) && errors.unit" v-html="errors.unit"></span>
					</div>
				</div>
			</div>
			<div class="row ccb-p-t-20">
				<div class="col-6">
					<div class="list-header">
						<div class="ccb-switch">
							<input type="checkbox" v-model="quantityField.allowCurrency"/>
							<label></label>
						</div>
						<h6 class="ccb-heading-5"><?php esc_html_e( 'Currency Sign', 'cost-calculator-builder' ); ?></h6>
					</div>
				</div>
				<div class="col-6">
					<div class="list-header">
						<div class="ccb-switch">
							<input type="checkbox" v-model="quantityField.enabled_currency_settings"/>
							<label></label>
						</div>
						<h6 class="ccb-heading-5"><?php esc_html_e( 'Currency Settings', 'cost-calculator-builder' ); ?></h6>
					</div>
				</div>
				<div class="col-6 ccb-p-t-10">
					<div class="list-header">
						<div class="ccb-switch">
							<input type="checkbox" v-model="quantityField.allowRound"/>
							<label></label>
						</div>
						<h6 class="ccb-heading-5"><?php esc_html_e( 'Round Value', 'cost-calculator-builder' ); ?></h6>
					</div>
				</div>
				<div class="col-6 ccb-p-t-10">
					<div class="list-header">
						<div class="ccb-switch">
							<input type="checkbox" v-model="quantityField.required"/>
							<label></label>
						</div>
						<h6 class="ccb-heading-5"><?php esc_html_e( 'Required', 'cost-calculator-builder' ); ?></h6>
					</div>
				</div>
				<div class="col-6 ccb-p-t-10">
					<div class="list-header">
						<div class="ccb-switch">
							<input type="checkbox" v-model="quantityField.hidden"/>
							<label></label>
						</div>
						<h6 class="ccb-heading-5"><?php esc_html_e( 'Hidden by Default', 'cost-calculator-builder' ); ?></h6>
					</div>
				</div>
				<div class="col-6 ccb-p-t-10">
					<div class="list-header">
						<div class="ccb-switch">
							<input type="checkbox" v-model="quantityField.addToSummary"/>
							<label></label>
						</div>
						<h6 class="ccb-heading-5"><?php esc_html_e( 'Show in Grand Total', 'cost-calculator-builder' ); ?></h6>
					</div>
				</div>
			</div>
			<div class="row ccb-p-t-15">
				<div class="col-12">
					<div class="ccb-input-wrapper">
						<span class="ccb-input-label"><?php esc_html_e( 'Additional Classes', 'cost-calculator-builder' ); ?></span>
						<textarea class="ccb-heading-5 ccb-light" v-model="quantityField.additionalStyles" placeholder="<?php esc_attr_e( 'Set Additional Classes', 'cost-calculator-builder' ); ?>"></textarea>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
