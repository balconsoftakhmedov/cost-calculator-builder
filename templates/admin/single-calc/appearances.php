<?php
$modal_types = array(
	'preview' => array(
		'type' => 'preview',
		'path' => CALC_PATH . '/templates/admin/single-calc/modals/modal-preview.php',
	),
);

$tabs = array(
	array(
		'type'  => 'desktop',
		'label' => __( 'Desktop', 'cost-calculator-builder' ),
		'icon'  => 'ccb-icon-Path-3501',
	),
	array(
		'type'  => 'mobile',
		'label' => __( 'Mobile', 'cost-calculator-builder' ),
		'icon'  => 'ccb-icon-Path-3502',
	),
);

$styles = array(
	array(
		'label' => __( 'Vertical', 'cost-calculator-builder' ),
		'icon'  => 'ccb-icon-Union-26',
		'key'   => 'vertical',
	),
	array(
		'label' => __( 'Horizontal', 'cost-calculator-builder' ),
		'icon'  => 'ccb-icon-Union-25',
		'key'   => 'horizontal',
	),
	array(
		'label' => __( 'Two columns', 'cost-calculator-builder' ),
		'icon'  => 'ccb-icon-Union-27',
		'key'   => 'two_column',
	),
);

?>
<div class="ccb-settings-tab ccb-inner-settings" :class="{'calc-quick-tour-appearance': $store.getters.getQuickTourStep === '.ccb-box-styles-container-inner'}">
	<loader v-if="preloader"></loader>
	<div class="ccb-appearance-container" v-else>
		<div class="ccb-appearance-content ccb-custom-scrollbar">
			<div class="ccb-appearance-presets calc-quick-tour-appearance-presets" :class="{'disable-presets': quickTourStarted}">
				<div class="ccb-appearance-presets-item-wrapper" v-for="(preset, idx) in presets" :class="{'ccb-selected': idx === presetIdx}">
					<div class="ccb-appearance-presets-item" @click="selectPreset(idx)">
						<div class="ccb-appearance-presets-item-color" :style="{background: preset.top_right}"></div>
						<div class="ccb-appearance-presets-item-color" :style="{background: preset.top_left?.color}"></div>
						<div class="ccb-appearance-presets-item-color" :style="{background: preset.bottom_left}"></div>
						<div class="ccb-appearance-presets-item-color" :style="{background: preset.bottom_right}"></div>
					</div>
					<button class="ccb-button danger" @click="removePreset(idx)" :style="get_styles">
						<i class="ccb-icon-Path-3503"></i>
					</button>
				</div>
				<div class="ccb-appearance-add-preset" @click="addPreset">
					<i class="ccb-icon-Path-3493"></i>
				</div>
			</div>
			<div class="ccb-box-styles-container" v-if="tab !== 'mobile'">
				<div class="ccb-box-styles-container-inner">
					<template v-if="tab !== 'mobile'">
						<span class="ccb-box-styles-title-box">
							<span><?php esc_html_e( 'Box style', 'cost-calculator-builder' ); ?></span>
						</span>
						<div class="ccb-box-styles calc-quick-tour-box-styles">
							<?php foreach ( $styles as $style ) : ?>
								<div class="ccb-box-style-inner" :class="{'ccb-style-active': box_style === '<?php echo esc_attr( $style['key'] ); ?>'}" @click="box_style = '<?php echo esc_attr( $style['key'] ); ?>'">
									<i class="<?php echo esc_attr( $style['icon'] ); ?>"></i>
									<span><?php echo esc_html( $style['label'] ); ?></span>
								</div>
							<?php endforeach; ?>
						</div>
					</template>
				</div>
			</div>
			<preview inline-template :preview="tab" :key="presetIdx + $store.getters.getFieldsKey">
				<div :id="getContainerId">
					<div class="calc-appearance-preview-wrapper">
						<img class="ccb-mobile-frame" src="<?php echo esc_url( CALC_URL . '/frontend/dist/img/mobile_frame.png' ); ?>" alt="frame image" v-if="preview === 'mobile'"/>
						<?php require CALC_PATH . '/templates/admin/components/preview/preview-content.php'; ?>
					</div>
				</div>
			</preview>
		</div>
		<div class="ccb-appearance-property-container calc-quick-tour-property-container">
			<div class="ccb-appearance-property-switch">
				<div class="ccb-appearance-property-switch-header">
					<div class="ccb-appearance-property-switch-header-inner">
						<?php foreach ( $tabs as $tab ) : ?>
							<span class="ccb-appearance-title-box" :class="{'ccb-container-active': tab === '<?php echo esc_attr( $tab['type'] ); ?>'}" @click="tab = '<?php echo esc_attr( $tab['type'] ); ?>'">
								<i class="<?php echo esc_attr( $tab['icon'] ); ?>"></i>
								<span class="ccb-default-title ccb-light"><?php echo esc_html( $tab['label'] ); ?></span>
							</span>
						<?php endforeach; ?>
					</div>
				</div>
				<div class="ccb-appearance-container-wrapper ccb-custom-scrollbar">
					<div class="ccb-appearance-container-properties">
						<div class="ccb-grid-box ccb-appearance">
							<appearance-row :type="tab" @updated="updatePresetColors" :key="tab + presetIdx"/>
						</div>
					</div>
				</div>
			</div>
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
</div>
