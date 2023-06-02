import settingsMixin from './settingsMixin';

export default {
	mixins: [settingsMixin],

	data: () => ({
		formulas: [],
		defaultFormula: [],
	}),

	mounted() {
		if ( this.settingsField?.woo_checkout && typeof this.settingsField.woo_checkout.formulas === 'object' )
			this.formulas = this.settingsField.woo_checkout.formulas;

		this.clear()
	},

	updated() {
		this.updateFormulas()
		this.settingsField.woo_checkout.formulas = this.formulas;
	},
}
