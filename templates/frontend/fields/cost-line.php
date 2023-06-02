<?php
/**
 * @file
 * Cost-line component's template
 */
?>

<div :style="additionalCss" class="calc-item ccb-hr" :class="lineField.additionalStyles" :data-id="lineField.alias">
	<div class="ccb-line" :style="getLine"></div>
</div>
