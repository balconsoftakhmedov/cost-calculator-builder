<div class="ccb-tab-sections">
	<calculators-list
		inline-template
		v-if="step === 'list'"
		@edit-calc="editCalc"
		@embed-calc="showEmbed"
	>
		<?php require_once CALC_PATH . '/templates/admin/single-calc/calculator-list.php'; ?>
	</calculators-list>
	<calculators-tab
			inline-template
			:key="calcId"
			:id="calcId"
			v-if="step === 'create'"
			@edit-calc="editCalc"
			@embed-calc="showEmbed"
	>
		<?php require_once CALC_PATH . '/templates/admin/single-calc/tab.php'; ?>
	</calculators-tab>
	<templates-container
			inline-template
			:key="calcId"
			:id="calcId"
			v-if="step === 'templates'"
			@edit-calc="editCalc"
	>
		<?php require_once CALC_PATH . '/templates/admin/single-calc/templates.php'; ?>
	</templates-container>
	<ccb-demo-import
			inline-template
			v-if="step === 'demo-import'"
			@edit-calc="editCalc"
	>
		<?php require_once CALC_PATH . '/templates/admin/components/demo-import.php'; ?>
	</ccb-demo-import>
	<ccb-embed
		embed-text="<?php esc_attr_e( json_encode( ccb_embed_popup_text() ) ); //phpcs:ignore ?>"
		ref="embedCalc"
	>
	</ccb-embed>

</div>
