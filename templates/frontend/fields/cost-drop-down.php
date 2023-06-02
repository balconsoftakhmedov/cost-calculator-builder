<div :style="additionalCss" class="calc-item ccb-field" :class="{required: $store.getters.isUnused(dropDownField), [dropDownField.additionalStyles]: dropDownField.additionalStyles}" :data-id="dropDownField.alias">
	<div class="calc-item__title">
		<span>{{ dropDownField.label }}</span>
		<span class="ccb-required-mark" v-if="dropDownField.required">*</span>
	</div>

	<div class="calc-item__description before">
		<span>{{ dropDownField.description }}</span>
	</div>

	<div :class="['calc_' + dropDownField.alias, {'calc-field-disabled': getStep === 'finish'}]" class="calc-drop-down-box" @click="toggleSelect">
		<i class="ccb-icon-Path-3485 ccb-select-arrow" :class="{ active: selectOpen }"></i>
		<select class="calc-drop-down ccb-field ccb-appearance-field" v-model="selectValue">
			<option value="0" selected><?php esc_html_e( 'Select value', 'cost-calculator-builder' ); ?></option>
			<option v-for="element in getOptions" :key="element.value" :value="element.value">
				{{element.label}}
			</option>
		</select>
		<span v-if="dropDownField.required" :class="{active: $store.getters.isUnused(dropDownField)}" class="ccb-error-tip front default">{{ $store.getters.getSettings.texts.required_msg }}</span>
	</div>

	<div class="calc-item__description after">
		<span>{{ dropDownField.description }}</span>
	</div>

</div>
