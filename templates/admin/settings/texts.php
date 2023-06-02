<div class="ccb-tab-container">
	<div class="ccb-grid-box">
		<div class="container">
			<div class="row">
				<div class="col">
					<span class="ccb-tab-title"><?php esc_html_e( 'Notifications', 'cost-calculator-builder' ); ?></span>
				</div>
			</div>
			<?php if ( defined( 'CCB_PRO_VERSION' ) ) : ?>
				<div class="row ccb-p-t-15">
					<div class="col col-6">
						<div class="ccb-input-wrapper">
							<span class="ccb-input-label"><?php esc_html_e( 'Title', 'cost-calculator-builder' ); ?></span>
							<input type="text" placeholder="<?php esc_attr_e( 'Enter title', 'cost-calculator-builder' ); ?>" v-model="settingsField.texts.title">
						</div>
					</div>
				</div>
				<div class="row ccb-p-t-15">
					<div class="col col-6">
						<div class="ccb-input-wrapper">
							<span class="ccb-input-label"><?php esc_html_e( 'Message', 'cost-calculator-builder' ); ?></span>
							<input type="text" placeholder="<?php esc_attr_e( 'Enter Description', 'cost-calculator-builder' ); ?>" v-model="settingsField.texts.description">
						</div>
					</div>
				</div>
				<div class="row ccb-p-t-15">
					<div class="col col-3">
						<div class="ccb-input-wrapper">
							<span class="ccb-input-label"><?php esc_html_e( 'Label', 'cost-calculator-builder' ); ?></span>
							<input type="text" placeholder="<?php esc_attr_e( 'Enter Issued on', 'cost-calculator-builder' ); ?>" v-model="settingsField.texts.issued_on">
						</div>
					</div>
					<div class="col col-3">
						<div class="ccb-input-wrapper">
							<span class="ccb-input-label"><?php esc_html_e( 'New calculation button', 'cost-calculator-builder' ); ?></span>
							<input type="text" placeholder="<?php esc_attr_e( 'Enter Description', 'cost-calculator-builder' ); ?>" v-model="settingsField.texts.reset_btn">
						</div>
					</div>
				</div>
			<?php endif; ?>
			<div class="row <?php echo esc_attr( defined( 'CCB_PRO_VERSION' ) ? 'ccb-p-t-15' : '' ); ?>">
				<div class="col col-6">
					<div class="ccb-input-wrapper">
						<span class="ccb-input-label"><?php esc_html_e( 'Required field notice', 'cost-calculator-builder' ); ?></span>
						<input type="text" placeholder="<?php esc_attr_e( 'Enter notice', 'cost-calculator-builder' ); ?>" v-model="settingsField.texts.required_msg">
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
