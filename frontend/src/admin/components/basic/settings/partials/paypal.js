import settingsMixin from './settingsMixin';
import currencyDto from "../../../dtos/currencyDto";
import modeDto from '../../../dtos/modeDto';

export default {
	mixins: [settingsMixin],

	data: () => ({
		currencies: currencyDto,
		modes: modeDto,
		formulas: [],
		extended: false,
		defaultFormula: [],
	}),

	mounted() {
		if ( this.generalSettings?.paypal.use_in_all )
			this.extended = true;

		if ( this.settingsField?.paypal && typeof this.settingsField.paypal.formulas === 'object' ) {
			this.formulas = this.settingsField.paypal.formulas;
		}

		this.clear()
	},

	updated() {
		this.updateFormulas()
		this.settingsField.paypal.formulas = this.formulas;
	},
};