<?php
/**
 * Silence is golden
 */
?>
<calc-config></calc-config>
<div class="modal-footer">
	<div class="condition">
		<div class="left"></div>
		<div class="right">
			<button type="button" class="modal-btn ccb-default-description ccb-normal delete dark" @click.prevent="closeCalcSettings">
				<span>Cancel</span>
			</button>
			<button type="button" class="modal-btn ccb-default-description ccb-normal green" @click.prevent="saveCalcSettings">
				<span>Save</span>
			</button>
		</div>
	</div>
</div>
