<?php
/**
 * @file
 * Cost-html component's template
 */
?>

<div :style="additionalCss" class="calc-item html" :data-id="htmlField.alias" v-html="htmlContent" :class="htmlField.additionalStyles"></div>
