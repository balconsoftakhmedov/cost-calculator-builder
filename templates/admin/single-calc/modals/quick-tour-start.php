<ccb-quick-tour
	@start-quick-tour="startQuickTour"
	inline-template
>
	<div class="modal-body ccb-quick-tour-start">
		<div class="ccb-demo-import-container">
			<div class="ccb-demo-import-content">
				<div class="ccb-demo-import-icon-wrap">
					<img class="calc-logo" src="<?php echo esc_url( CALC_URL . '/frontend/dist/img/calc.png' ); ?>" alt="">
				</div>
				<div class="ccb-demo-import-title">
					<span><?php esc_html_e( 'Welcome to Cost Calculator!', 'cost-calculator-builder' ); ?></span>
				</div>
				<div class="ccb-demo-import-description" style="margin-bottom: 30px">
					<span style="opacity: 0.8"><?php esc_html_e( 'Create your own custom calculator and add it to your website.', 'cost-calculator-builder' ); ?></span>
				</div>
				<div class="ccb-demo-import-action">
					<button class="ccb-button success" @click="quickTourNextStep">
						<?php esc_html_e( 'Start Quick Tour', 'cost-calculator-builder' ); ?>
					</button>
				</div>
			</div>
		</div>
		<button class="ccb-button skip" @click="skipAndClose">
			<?php esc_html_e( "Skip this and don't show again", 'cost-calculator-builder' ); ?>
		</button>
	</div>
</ccb-quick-tour>
