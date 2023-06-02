<?php
/**
 * @file
 * Cost-toggle component's template
 */
?>

<div :style="additionalCss" class="calc-item ccb-field" :class="{required: $store.getters.isUnused(toggleField), [toggleField.additionalStyles]: toggleField.additionalStyles}" :data-id="toggleField.alias">
	<component :is="getStyle" :field="toggleField" @update="updateValue" :value="value"></component>
</div>
