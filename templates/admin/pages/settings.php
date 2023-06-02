<?php
$ccb_pages = \cBuilder\Classes\CCBSettingsData::get_general_settings_pages();
?>
<div class="ccb-tab-sections" style="overflow: hidden">
	<loader v-if="preloader"></loader>
	<div class="ccb-settings-tab" style="overflow: hidden; height: calc(100vh - 195px)" v-else>
		<div class="ccb-settings-tab-sidebar" style="height: 100vh">
			<div class="ccb-settings-tab-wrapper">
				<span class="ccb-settings-tab-header"><?php esc_html_e( 'Basic', 'cost-calculator-builder' ); ?></span>
				<span class="ccb-settings-tab-list">
					<?php foreach ( $ccb_pages as $ccb_page ) : ?>
						<?php if ( isset( $ccb_page['type'] ) && sanitize_text_field( $ccb_page['type'] ) === 'basic' ) : ?>
							<span class="ccb-settings-tab-list-item" :class="{active: tab === '<?php echo esc_attr( $ccb_page['slug'] ); ?>'}" @click="tab = '<?php echo esc_attr( $ccb_page['slug'] ); ?>'">
							<i class="<?php echo esc_attr( $ccb_page['icon'] ); ?>"></i>
							<span><?php echo esc_html( $ccb_page['title'] ); ?></span>
						</span>
						<?php endif; ?>
					<?php endforeach; ?>
				</span>
			</div>
			<div class="ccb-settings-tab-wrapper" style="margin-top: 10px">
				<span class="ccb-settings-tab-header"><?php esc_html_e( 'Integrations', 'cost-calculator-builder' ); ?></span>
				<span class="ccb-settings-tab-list">
					<?php foreach ( $ccb_pages as $ccb_page ) : ?>
						<?php if ( isset( $ccb_page['type'] ) && sanitize_text_field( $ccb_page['type'] ) === 'pro' ) : ?>
							<span class="ccb-settings-tab-list-item" :class="{active: tab === '<?php echo esc_attr( $ccb_page['slug'] ); ?>'}" @click="tab = '<?php echo esc_attr( $ccb_page['slug'] ); ?>'">
								<i class="<?php echo esc_attr( $ccb_page['icon'] ); ?>"></i>
								<span><?php echo esc_html( $ccb_page['title'] ); ?></span>
							</span>
						<?php endif; ?>
					<?php endforeach; ?>
				</span>
			</div>
		</div>
		<div class="ccb-settings-tab-content">
			<?php foreach ( $ccb_pages as $ccb_page ) : ?>
				<component
						inline-template
						:is="getComponent"
						v-if="tab === '<?php echo esc_attr( $ccb_page['slug'] ); ?>'"
				>
					<?php require_once CALC_PATH . '/templates/admin/general-settings/' . $ccb_page['slug'] . '.php'; //phpcs:ignore ?>
				</component>
			<?php endforeach; ?>
		</div>
	</div>
</div>
