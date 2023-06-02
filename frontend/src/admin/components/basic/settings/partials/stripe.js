import settingsMixin from './settingsMixin';

export default {
	mixins: [settingsMixin],

	data: () => ({
		formulas: [],
		extended: false,
		defaultFormula: [],
	}),

	mounted() {
		if ( this.generalSettings?.stripe.use_in_all )
			this.extended = true;

		if ( this.settingsField?.stripe && typeof this.settingsField.stripe.formulas === 'object' )
			this.formulas = this.settingsField.stripe.formulas;

		this.clear()
	},

	updated() {
		this.updateFormulas()
		this.settingsField.stripe.formulas = this.formulas;
	},
}