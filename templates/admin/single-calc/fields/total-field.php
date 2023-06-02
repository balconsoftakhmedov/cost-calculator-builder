<div class="cbb-edit-field-container">
	<div class="ccb-edit-field-header">
		<span class="ccb-edit-field-title ccb-heading-3 ccb-bold"><?php esc_html_e( 'Formula', 'cost-calculator-builder' ); ?></span>
		<div class="ccb-field-actions">
			<button class="ccb-button default" @click="$emit( 'cancel' )"><?php esc_html_e( 'Cancel', 'cost-calculator-builder' ); ?></button>
			<button class="ccb-button success" @click.prevent="$emit( 'save', totalField, id, index)"><?php esc_html_e( 'Save', 'cost-calculator-builder' ); ?></button>
		</div>
	</div>
	<div class="ccb-grid-box">
		<div class="container">
			<div class="row">
				<div class="col-12">
					<div class="ccb-input-wrapper">
						<span class="ccb-input-label"><?php esc_html_e( 'Name', 'cost-calculator-builder' ); ?></span>
						<input type="text" class="ccb-heading-5 ccb-light" v-model.trim="totalField.label" placeholder="<?php esc_attr_e( 'Enter field name', 'cost-calculator-builder' ); ?>">
					</div>
				</div>
			</div>
			<div class="row ccb-p-t-15">
				<div class="col-12">
					<div class="ccb-edit-field-aliases">
						<template v-if="available.length">
							<div class="ccb-edit-field-alias" v-for="(item, index) in available_fields" @click="insertAtCursor(item.type === 'Total' ? '(' + item.alias + ')' : item.alias)" v-if="item.alias != 'total'">
								{{ item.alias }}
							</div>
						</template>
						<template v-else>
							<p><?php esc_html_e( 'No Available fields yet!', 'cost-calculator-builder' ); ?></p>
						</template>
					</div>
				</div>
			</div>
			<div class="row ccb-p-t-10">
				<div class="col-12">
					<div class="ccb-edit-field-formula">
						<div class="ccb-formula-content">
							<div class="ccb-input-wrapper">
								<textarea class="ccb-heading-5 ccb-light" v-model="totalField.costCalcFormula" :ref="'ccb-formula-' + totalField._id" placeholder="<?php esc_attr_e( 'Set Additional Classes', 'cost-calculator-builder' ); ?>"></textarea>
							</div>
						</div>
						<div class="ccb-formula-tools">
							<span class="ccb-formula-tool" title="Addition (+)" @click="insertAtCursor('+')">
								<span class="plus">+</span>
							</span>
							<span class="ccb-formula-tool" title="Subtraction (-)" @click="insertAtCursor('-')">-</span>
							<span class="ccb-formula-tool" title="Division (/)" @click="insertAtCursor('/')">/</span>
							<span class="ccb-formula-tool" title="Remainder (%)" @click="insertAtCursor('%')">%</span>
							<span class="ccb-formula-tool" title="Multiplication (*)" @click="insertAtCursor('*')">
								<span class="multiple">*</span>
							</span>
							<span class="ccb-formula-tool" title="Open bracket '('" @click="insertAtCursor('(')">(</span>
							<span class="ccb-formula-tool" title="Close bracket ')'" @click="insertAtCursor(')')">)</span>
							<span class="ccb-formula-tool" title="Math.round(x) returns the value of x rounded to its nearest integer:" @click="insertAtCursor('Math.round(')">round</span>
							<span class="ccb-formula-tool" title="Math.pow(x, y) returns the value of x to the power of y:" @click="insertAtCursor('Math.pow(')">pow</span>
							<span class="ccb-formula-tool" title="Math.sqrt(x) returns the square root of x:" @click="insertAtCursor('Math.sqrt(')">sqrt</span>
							<span class="ccb-formula-tool" title="Math.abs(x) returns the absolute (positive) value of x:" @click="insertAtCursor('Math.abs(')">abs</span>
							<span class="ccb-formula-tool" title="Math.ceil(x) returns the value of x rounded up to its nearest integer:" @click="insertAtCursor('Math.ceil(')">ceil</span>
							<span class="ccb-formula-tool" title="Math.floor(x) returns the value of x rounded down to its nearest integer:" @click="insertAtCursor('Math.floor(')">floor</span>
						</div>
					</div>
				</div>
			</div>
			<div class="row ccb-p-t-15">
				<div class="col-6">
					<div class="list-header">
						<div class="ccb-switch">
							<input type="checkbox" v-model="totalField.totalSymbol"/>
							<label></label>
						</div>
						<h6 class="ccb-heading-5"><?php esc_html_e( 'Show Alternative Symbol', 'cost-calculator-builder' ); ?></h6>
					</div>
				</div>
				<div class="col-6">
					<div class="list-header">
						<div class="ccb-switch">
							<input type="checkbox"  v-model="totalField.hidden"/>
							<label></label>
						</div>
						<h6 class="ccb-heading-5"><?php esc_html_e( 'Hidden by Default', 'cost-calculator-builder' ); ?></h6>
					</div>
				</div>
			</div>
			<div class="row ccb-p-t-15" v-if="totalField.totalSymbol">
				<div class="col-12">
					<div class="ccb-input-wrapper">
						<span class="ccb-input-label"><?php esc_html_e( 'Alternative Symbol', 'cost-calculator-builder' ); ?></span>
						<input type="text" class="ccb-heading-5 ccb-light" v-model="totalField.totalSymbolSign" placeholder="<?php esc_attr_e( 'Set Alternative Symbol...', 'cost-calculator-builder' ); ?>">
					</div>
				</div>
			</div>
			<div class="row ccb-p-t-15">
				<div class="col-12">
					<div class="ccb-input-wrapper">
						<span class="ccb-input-label"><?php esc_html_e( 'Additional Classes', 'cost-calculator-builder' ); ?></span>
						<textarea class="ccb-heading-5 ccb-light" v-model="totalField.additionalStyles" placeholder="<?php esc_attr_e( 'Set Additional Classes', 'cost-calculator-builder' ); ?>"></textarea>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
