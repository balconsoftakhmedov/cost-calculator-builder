import CBuilderFront from '../../../../../frontend/components/cost-calc' // main-component front

export default {
	props: [ 'preview' ],
	components: {  // init components
		'calc-builder-front': CBuilderFront, // Front main component and Preview
	},

	data: () => ({
		defaultBoxStyle: 'vertical',
		defaultContainerWidthStyle: '100%',
	}),

	computed: {
		appearance() {
			// return this.getElementAppearanceStyleByPath( this.appearance, 'elements.headers.data');
			return this.$store.getters.getAppearance;
		},

		boxStyle() {
			if ( this.preview !== 'mobile' && this.isObjectHasPath(this.appearance, [ 'container', 'box-style', 'value' ]) )
				return this.appearance.container['box-style'].value;
			return this.defaultBoxStyle;
		},

		containerAppearanceStyles() {
			return this.getElementAppearanceStyleByPath(this.appearance, 'container');
		},

		preview_data() {
			const fields = this.$validateData(this.getFields, 'builder')
			return {
				id: this.getId,
				title: this.getTitle,
				fields: this.$validateData(this.getFields, 'builder'),
				formula: this.getFormula,
				settings: this.$validateData(this.getSettings),
				currency: this.$currencyData(this.getSettings),
				conditions: this.$store.getters.getConditions,
				appearance: this.appearance,
				box_style: this.boxStyle,
				sticky: true,
			}
		},

		getStickyData() {
			if ( this.getSettings.general.sticky !== true || this.boxStyle === 'horizontal' || ajax_window.pro_active !== '1')
				return ''
			return 'ccb_summary_sticky'
		},

		getFields() {
			return this.$store.getters.getBuilder;
		},

		getId() {
			return this.$store.getters.getId
		},

		getFieldsKey() {
			return this.$store.getters.getFieldsKey
		},

		getTitle() {
			return this.$store.getters.getTitle
		},

		getHeaderTitle() {
			return this.getSettings.general.header_title
		},

		getFormula() {
			return this.$store.getters.getFormulas
		},

		getSettings() {
			return this.$store.getters.getSettings
		},

		getContainerId() {
			return this.preview === 'mobile' ? 'ccb-mobile-preview' : 'ccb-desktop-preview';
		},
	},

	methods: {
		getTotalFieldStyles(isHidden) {
			if ( isHidden === true ) {
				return { 'display': 'none' };
			}
			return this.totalFieldsStyles;
		}
	},

	destroyed() {
		window.$calcGlobalHiddens = undefined
	}
}
