import currencyDto from "../dtos/currencyDto";
import {currency, stripe, paypal, email, captcha, invoice, emailTemplate} from '../general-settings';
import loader from "../../../loader";

export default {
	props: [],
	components: {
		loader,
		'ccb-general-settings-currency': currency,
		'ccb-general-settings-invoice': invoice,
		'ccb-general-settings-stripe': stripe,
		'ccb-general-settings-paypal': paypal,
		'ccb-general-settings-email': email,
		'ccb-general-settings-email-template': emailTemplate,
		'ccb-general-settings-captcha': captcha,
	},

	data: () => ({
		tab: 'currency',
		currencies: currencyDto,
		preloader: true,
	}),

	async mounted() {
		if ( this.getParameterByName('option') !== null ) {
			this.tab = this.getParameterByName('option')
		}

		if ( !this.$store.getters.getDataLoaded ) {
			await this.$store.dispatch('getGeneralSettings');
			setTimeout(() => this.preloader = false, 200);
		}
	},

	computed: {
		getComponent() {
			return `ccb-general-settings-${this.tab}`;
		}
	},
}
