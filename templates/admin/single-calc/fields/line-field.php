<div class="cbb-edit-field-container">
	<div class="ccb-edit-field-header">
		<span class="ccb-edit-field-title ccb-heading-3 ccb-bold"><?php esc_html_e( 'Line', 'cost-calculator-builder' ); ?></span>
		<div class="ccb-field-actions">
			<button class="ccb-button default" @click="$emit( 'cancel' )"><?php esc_html_e( 'Cancel', 'cost-calculator-builder' ); ?></button>
			<button class="ccb-button success" @click.prevent="$emit( 'save', lineField, id, index )"><?php esc_html_e( 'Save', 'cost-calculator-builder' ); ?></button>
		</div>
	</div>
	<div class="ccb-grid-box">
		<div class="container">
			<div class="row">
				<div class="col-6">
					<div class="ccb-select-box">
						<span class="ccb-select-label"><?php esc_html_e( 'Line Size', 'cost-calculator-builder-pro' ); ?></span>
						<div class="ccb-select-wrapper">
							<i class="ccb-icon-Path-3485 ccb-select-arrow"></i>
							<select class="ccb-select" v-model="lineField.size">
								<option value="" selected><?php esc_html_e( '- Select Size -', 'cost-calculator-builder' ); ?></option>
								<option value="1px"><?php esc_html_e( 'Small', 'cost-calculator-builder' ); ?></option>
								<option value="2px"><?php esc_html_e( 'Medium', 'cost-calculator-builder' ); ?></option>
								<option value="4px"><?php esc_html_e( 'Large', 'cost-calculator-builder' ); ?></option>
							</select>
						</div>
					</div>
				</div>
				<div class="col-6">
					<div class="ccb-select-box">
						<span class="ccb-select-label"><?php esc_html_e( 'Line Style', 'cost-calculator-builder-pro' ); ?></span>
						<div class="ccb-select-wrapper">
							<i class="ccb-icon-Path-3485 ccb-select-arrow"></i>
							<select class="ccb-select" v-model="lineField.style">
								<option value="" selected><?php esc_html_e( '- Select Style -', 'cost-calculator-builder' ); ?></option>
								<option value="solid"><?php esc_html_e( 'Solid', 'cost-calculator-builder' ); ?></option>
								<option value="dashed"><?php esc_html_e( 'Dashed', 'cost-calculator-builder' ); ?></option>
							</select>
						</div>
					</div>
				</div>
			</div>
			<div class="row ccb-p-t-15">
				<div class="col-6">
					<div class="ccb-select-box">
						<span class="ccb-select-label"><?php esc_html_e( 'Line Length', 'cost-calculator-builder-pro' ); ?></span>
						<div class="ccb-select-wrapper">
							<i class="ccb-icon-Path-3485 ccb-select-arrow"></i>
							<select class="ccb-select" v-model="lineField.len">
								<option value="" selected><?php esc_html_e( '- Select length -', 'cost-calculator-builder' ); ?></option>
								<option value="25%"><?php esc_html_e( 'Short', 'cost-calculator-builder' ); ?></option>
								<option value="50%"><?php esc_html_e( 'Medium', 'cost-calculator-builder' ); ?></option>
								<option value="100%"><?php esc_html_e( 'Long', 'cost-calculator-builder' ); ?></option>
							</select>
						</div>
					</div>
				</div>
			</div>
			<div class="row ccb-p-t-15">
				<div class="col-12">
					<div class="ccb-input-wrapper">
						<span class="ccb-input-label"><?php esc_html_e( 'Additional Classes', 'cost-calculator-builder' ); ?></span>
						<textarea class="ccb-heading-5 ccb-light" v-model="lineField.additionalStyles" placeholder="<?php esc_attr_e( 'Set Additional Classes', 'cost-calculator-builder' ); ?>"></textarea>
					</div>
				</div>
			</div>
			<div class="row ccb-p-t-15">
				<div class="col-6">
					<div class="list-header">
						<div class="ccb-switch">
							<input type="checkbox" v-model="lineField.hidden"/>
							<label></label>
						</div>
						<h6 class="ccb-heading-5"><?php esc_html_e( 'Hidden by Default', 'cost-calculator-builder' ); ?></h6>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
