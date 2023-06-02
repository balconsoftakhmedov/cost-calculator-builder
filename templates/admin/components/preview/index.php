<?php
$default_img = CALC_URL . '/frontend/dist/img/default.png';
?>
<preview inline-template :preview="preview_tab">
	<div class="modal-body preview ccb-custom-scrollbar">
		<div :id="getContainerId">
			<div class="calc-appearance-preview-wrapper">
				<img class="ccb-mobile-frame" src="<?php echo esc_url( CALC_URL . '/frontend/dist/img/mobile_frame.png' ); ?>" alt="frame image" v-if="preview === 'mobile'"/>
				<?php require CALC_PATH . '/templates/admin/components/preview/preview-content.php'; ?>
			</div>
		</div>
	</div>
</preview>
