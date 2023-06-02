import settingsMixin from "./settingsMixin";
import paymentDto from "../../../dtos/paymentDto";

export default {
	mixins: [settingsMixin],

	data: () => ({
		payments: paymentDto,
		extended: false,
	}),

	mounted() {
		this.initExtend();
	},

	computed: {
		getPayments() {
			const settings = {}
			Object.keys(this.settingsField).forEach(settingsKey => {
				const settingsPayment = this.settingsField[settingsKey];
				const generalPayment = this.generalSettings[settingsKey];
				if (generalPayment && generalPayment.use_in_all) {
					delete generalPayment.enable
					settings[settingsKey] = {...settingsPayment, ...generalPayment}
				} else {
					settings[settingsKey] = this.settingsField[settingsKey]
				}
			});

			this.payments.forEach((paymentType, paymentIndex) => {
				if ( settings[paymentType.slug].enable ) {
					paymentType.requiredSettingFields.forEach(requiredField => {
						if (settings[paymentType.slug].hasOwnProperty(requiredField) && settings[paymentType.slug][requiredField] !== "")
							this.payments[paymentIndex].disabled = false;
					});
				} else {
					this.payments[paymentIndex].disabled = true;
					this.settingsField.formFields.paymentMethods = this.settingsField.formFields.paymentMethods.filter(e => e !== paymentType.slug)
				}
			});

			return this.payments;
		},
	},

	methods: {
		initExtend() {
			if ( this.generalSettings?.form_fields.use_in_all )
				this.extended = true;
		},

		checkPaymentStatus() {

		},

	},

	updated() {
		const vm = this;
		vm.settingsField.formFields.allowContactForm = parseInt( vm.settingsField.formFields.contactFormId ) || false;
		if ( !vm.settingsField.formFields.allowContactForm ) {
			this.initExtend();
		} else {
			this.extended = false;
		}
	},
}
