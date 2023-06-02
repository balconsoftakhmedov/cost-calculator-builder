<?php
$ccb_pages   = \cBuilder\Classes\CCBSettingsData::get_settings_pages();
$modal_types = array(
	'preview' => array(
		'type' => 'preview',
		'path' => CALC_PATH . '/templates/admin/single-calc/modals/modal-preview.php',
	),
);

?>

<div class="ccb-settings-tab ccb-inner-settings calc-quick-tour-settings" :style="remove_quick_tour_css">
	<div class="ccb-settings-tab-sidebar">
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
					:key="$store.getters.getFieldsKey"
					v-if="tab === '<?php echo esc_attr( $ccb_page['slug'] ); ?>'"
			>
				<?php require_once CALC_PATH . '/templates/admin/settings/' . $ccb_page['slug'] . '.php'; //phpcs:ignore ?>
			</component>
		<?php endforeach; ?>
	</div>
	<ccb-modal-window>
		<template v-slot:content>
			<?php foreach ( $modal_types as $m_type ) : ?>
				<template v-if="$store.getters.getModalType === '<?php echo esc_attr( $m_type['type'] ); ?>'">
					<?php require $m_type['path']; ?>
				</template>
			<?php endforeach; ?>
		</template>
	</ccb-modal-window>
</div>
