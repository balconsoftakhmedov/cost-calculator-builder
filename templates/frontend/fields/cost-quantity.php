<?php
/**
 * @file
 * Cost-quantity component's template
 */
?>

<div :style="additionalCss" class="calc-item ccb-field ccb-field-quantity" :class="{required: $store.getters.isUnused(quantityField), [quantityField.additionalStyles]: quantityField.additionalStyles}" :data-id="quantityField.alias">
	<div class="calc-item__title">
		<span> {{ quantityField.label }} </span>
		<span class="ccb-required-mark" v-if="quantityField.required">*</span>
	</div>

	<div class="calc-item__description before">
		<span>{{ quantityField.description }}</span>
	</div>

	<div :class="['calc-input-wrapper ccb-field', 'calc_' + quantityField.alias, {'calc-field-disabled': getStep === 'finish'}]">
		<input @focusout="parseField" @keypress="intValueFilter($event)" name="quantityField" type="text" v-model="quantityValue" :placeholder="quantityField.placeholder" class="calc-input number ccb-field ccb-appearance-field">
		<span @click="increment" class="input-number-counter up">
			<i class="ccb-icon-Path-3486"></i>
		</span>
		<span @click="decrement" class="input-number-counter down">
			<i class="ccb-icon-Path-3485"></i>
		</span>
		<span v-if="quantityField.required" :class="{active: $store.getters.isUnused(quantityField)}" class="ccb-error-tip front default">{{ $store.getters.getSettings.texts.required_msg }}</span>
	</div>

	<div class="calc-item__description after">
		<span>{{ quantityField.description }}</span>
	</div>
</div>
