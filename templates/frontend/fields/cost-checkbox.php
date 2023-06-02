<?php
/**
 * @file
 * Cost-checkbox component's template
 */
?>
<div :style="additionalCss" class="calc-item ccb-field" :class="{required: $store.getters.isUnused(checkboxField), [checkboxField.additionalStyles]: checkboxField.additionalStyles}" :data-id="checkboxField.alias">
	<component :is="getStyle" :field="checkboxField" @update="updateValue" :value="value"></component>
</div>
