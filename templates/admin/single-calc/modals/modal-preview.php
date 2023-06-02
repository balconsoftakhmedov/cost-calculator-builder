<div class="modal-header preview">
	<div class="modal-header__title">
		<h4 v-if="preview_tab === 'desktop'"><?php esc_html_e( 'Desktop Preview', 'cost-calculator-builder' ); ?></h4>
		<h4 v-else><?php esc_html_e( 'Mobile Preview', 'cost-calculator-builder' ); ?></h4>
	</div>
	<div class="modal-header__switch">
		<span class="ccb-switcher" :class="{active: preview_tab === 'desktop'}" @click="preview_tab = 'desktop'">
			<i class="ccb-icon-Path-3501"></i>
		</span>
		<span class="ccb-switcher" :class="{active: preview_tab === 'mobile'}" @click="preview_tab = 'mobile'">
			<i class="ccb-icon-Path-3502"></i>
		</span>
	</div>
</div>
<loader v-if="loader"></loader>

<?php require CALC_PATH . '/templates/admin/components/preview/index.php'; ?>
