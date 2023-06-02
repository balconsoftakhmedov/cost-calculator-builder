<?php
$calc_tabs = \cBuilder\Classes\CCBSettingsData::get_tab_data();
?>

<div class="ccb-tab-sections" :class="{'ccb-loader-inner-section': preloader}">
	<div class="ccb-calculator-tab" v-if="preloader">
		<loader></loader>
	</div>
	<div class="ccb-calculator-tab ccb-tab-section-content" :class="{'ccb-show-content': !preloader}">
		<div class="ccb-tab-sections-header">
			<div style="width: 100%; display: flex; justify-content: space-between">
				<div class="ccb-header-left">
					<span class="ccb-back-container">
						<span class="ccb-back-wrap" @click="back">
							<i class="ccb-icon-Path-3398"></i>
						</span>
						<span class="ccb-back-to-text" @click="back">
							<span><?php esc_html_e( 'Back to calculators', 'cost-calculator-builder' ); ?></span>
						</span>
					</span>
					<span class="ccb-calc-title" v-if="!getEditVal">
						<span class="ccb-title" @click="getEditVal = true">{{ title | to-short }}</span>
						<i class="ccb-title-edit ccb-icon-Path-3483" @click="getEditVal = true"></i>
					</span>
					<span class="ccb-calc-title calc-quick-tour-title-box" v-else>
						<input type="text" class="ccb-title" v-model="title" @blur="editTitle">
						<i class="ccb-title-approve ccb-icon-Path-3484" @click="() => edit_title(false)"></i>
					</span>
				</div>
				<div class="ccb-header-right" style="position: relative">
					<button class="ccb-button default" v-if="currentTab !== 'appearances'" @click="previewMode"><?php esc_html_e( 'Preview', 'cost-calculator-builder' ); ?></button>
					<button class="ccb-button embed" @click="showEmbed"><span class="ccb-icon-html"></span><span><?php esc_html_e( 'Embed', 'cost-calculator-builder' ); ?></span></button>
					<button class="ccb-button ccb-save-settings success calc-quick-tour-ccb-button">
						<span @click="saveSettings" class="calc-save-btn-txt" style="font-size: 14px !important;">
							<?php esc_html_e( 'Save', 'cost-calculator-builder' ); ?>
						</span>
						<label class="ccb-btn-dropdown ccb-btn-save-as-template">
							<span class="ccb-btn-dropdown-content">
								<i class="ccb-icon-Path-3398"></i>
							</span>
							<input type="checkbox" class="ccb-btn-dropdown-input">
							<ul class="ccb-btn-dropdown-list">
								<li class="ccb-default-title ccb-bold" @click="() => saveSettings('template')"><?php esc_html_e( 'Save as Template', 'cost-calculator-builder' ); ?></li>
							</ul>
						</label>
					</button>
				</div>
			</div>
		</div>
		<div class="ccb-calculator-tab-header">
			<?php foreach ( $calc_tabs as $c_file => $c_tab ) : ?>
				<span class="ccb-calculator-tab-header-label" :class="{active: '<?php echo esc_attr( $c_file ); ?>' === currentTab}" @click="setTab('<?php echo esc_attr( $c_file ); ?>')">
					<i class="<?php echo esc_attr( $c_tab['icon'] ); ?>"></i>
					<span class="ccb-heading-5" style="display: flex; align-items: center;">
						<?php echo esc_html( $c_tab['label'] ); ?>
						<span class="ccb-fields-required" v-if="'<?php echo esc_attr( $c_tab['component'] ); ?>' === 'ccb-calculator-tab' && $store.getters.getGlobalErrors.length > 0">{{ $store.getters.getGlobalErrors.length }}</span>
					</span>
				</span>
			<?php endforeach; ?>
		</div>
		<div class="ccb-calculator-tab-content">
			<?php foreach ( $calc_tabs as $c_file => $c_tab ) : ?>
				<div class="ccb-calculator-tab-page">
					<keep-alive>
						<component
								@edit-title="edit_title"
								inline-template
								:type="currentTab"
								@set-step="setTab"
								ref="<?php echo esc_attr( $c_file ); ?>"
								:is="getActiveTab"
								v-if="'<?php echo esc_attr( $c_file ); ?>' === currentTab"
						>
							<?php require_once CALC_PATH . '/templates/admin/single-calc/' . $c_file . '.php'; ?>
						</component>
					</keep-alive>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</div>
