<?php
/**
 * @file
 * Cost-text component's template
 */
?>

<div :style="additionalCss" class="calc-item" :class="{required: $store.getters.isUnused(textField), [textField.additionalStyles]: textField.additionalStyles}" :data-id="textField.alias">
	<div class="calc-item__title">
		<span>{{ textField.label }}</span>
		<span class="ccb-required-mark" v-if="textField.required">*</span>
	</div>

	<div class="calc-item__description before">
		<span>{{ textField.description }}</span>
	</div>
	<div class="calc-textarea-box">
		<textarea v-model="textareaValue" @change="onChange" :id="labelId" :placeholder="textField.placeholder" :class="['calc-textarea ccb-appearance-field calc-item', {'calc-field-disabled': getStep === 'finish'}]"></textarea>
		<span v-if="textField.required" :class="{active: $store.getters.isUnused(textField)}" class="ccb-error-tip front textarea">{{ $store.getters.getSettings.texts.required_msg }}</span>
	</div>

	<div class="calc-item__description after">
		<span>{{ textField.description }}</span>
	</div>
</div>
