<?php
$modal_types = array(
	'preview'   => array(
		'type' => 'preview',
		'path' => CALC_PATH . '/templates/admin/single-calc/modals/modal-preview.php',
	),
	'condition' => array(
		'type' => 'condition',
		'path' => CALC_PATH . '/templates/admin/single-calc/modals/condition.php',
	),
);
?>

<div class="ccb-create-calc ccb-condition-container calc-quick-tour-conditions">
	<template v-if="$store.getters.getQuickTourStep !== 'done' && $store.getters.getQuickTourStep !== '.calc-quick-tour-title-box'">
		<div class="ccb-condition-content">
			<flow-chart v-if="open" @update="change" :scene.sync="scene" @linkEdit="linkEdit" :height="height"/>
		</div>
		<div class="ccb-condition-elements ccb-create-calc-sidebar ccb-custom-scrollbar">
			<div class="ccb-sidebar-header">
				<span class="ccb-heading-4 ccb-bold"><?php esc_html_e( 'Elements', 'cost-calculator-builder-pro' ); ?></span>
				<span class="ccb-default-description ccb-light"><?php esc_html_e( 'Add elements by clicking', 'cost-calculator-builder-pro' ); ?></span>
			</div>
			<div class="ccb-sidebar-item-list">
				<template v-for="( field, index ) in getElements">
					<div class="ccb-sidebar-item" v-if="field.label && field.label.length" @click.prevent="newNode(field)">
				<span class="ccb-sidebar-item-icon">
					<i :class="field.icon"></i>
				</span>
						<span class="ccb-sidebar-item-box">
					<span class="ccb-default-title ccb-bold">{{ field.label | to-short }}</span>
					<span class="ccb-default-description">{{ field.text }}</span>
				</span>
					</div>
				</template>
				<div class="ccb-sidebar-item-empty"></div>
			</div>
		</div>
	</template>
	<template v-else>
		<?php if ( ! defined( 'CCB_PRO' ) ) : ?>
			<div class="ccb-pro-feature-wrapper" v-if="$store.getters.getQuickTourStep === 'done' || $store.getters.getQuickTourStep === '.calc-quick-tour-title-box'">
			<span class="ccb-pro-feature-wrapper--icon-box">
				<i  class="ccb-icon-Union-33"></i>
			</span>
				<span class="ccb-pro-feature-wrapper--label ccb-heading-3 ccb-bold"><?php esc_html_e( 'Available in PRO version', 'cost-calculator-builder' ); ?></span>
				<a href="https://stylemixthemes.com/cost-calculator-plugin/pricing/?utm_source=wpadmin&utm_medium=promo_calc&utm_campaign=2020" target="_blank" class="ccb-button ccb-href success"><?php esc_html_e( 'Upgrade Now', 'cost-calculator-builder' ); ?></a>
			</div>
		<?php else : ?>
			<?php do_action( 'render-condition' ); //phpcs:ignore ?>
		<?php endif; ?>
		<ccb-modal-window>
			<template v-slot:content>
				<?php foreach ( $modal_types as $m_type ) : ?>
					<template v-if="$store.getters.getModalType === '<?php echo esc_attr( $m_type['type'] ); ?>'">
						<?php require $m_type['path']; ?>
					</template>
				<?php endforeach; ?>
			</template>
		</ccb-modal-window>
	</template>
</div>
