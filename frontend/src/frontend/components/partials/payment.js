import Helpers from "../../../utils/helpers";
import fieldsMixin from "../fields/fieldsMixin";

export default {
	mixins: [fieldsMixin],
	props: {
		form: {
			default: false,
		},

		after: {
			default: '',
		}
	},

	data: () => ({
		nonces: window.ccb_nonces,
		loader: false,
		payments: [
			{slug: 'paypal', name: 'PayPal', requiredSettingFields: []},
			{slug: 'stripe', name: 'Stripe', requiredSettingFields: ['publishKey']},
			{slug: 'woo_checkout', name: 'Woo Checkout', requiredSettingFields: ['product_id']},
		],
		stripe: {
			stripe: '',
			stripeCard: '',
			stripeComplete: '',
			stripeClientSecret: '',
		},
		paymentForm: {
			status: false,
			access: true,
			orderId: null,
			sendFields: [
				{name: 'name', required: true, value: ''},
				{name: 'email', required: true, value: ''},
				{name: 'phone', required: true, value: ''},
				{name: 'message', required: false, value: ''},
			],
			errorCaptcha: false,
			errorMessage: false,
			successMessage: false,

			requires: [
				{required: false},
				{required: false},
				{required: false},
				{required: false},
			],
		},
		payment: {
			status: '',
			message: '',
		},
	}),

	computed: {
		appearance() {
			return this.$store.getters.getAppearance;
		},

		btnStyles() {
			const btnAppearance = this.getElementAppearanceStyleByPath(this.appearance, 'elements.primary_button.data');
			let result = {};

			result['padding'] = [0, btnAppearance['field_side_indents']].join('px ');
			Object.keys(btnAppearance).forEach((key) => {
				if (key === 'background') {
					result = {...result, ...btnAppearance[key]};
				} else if (key === 'shadow') {
					result['box-shadow'] = btnAppearance[key];
				} else {
					result[key] = btnAppearance[key];
				}
			});

			return result;
		},

		getHideCalc: {
			get() {
				return this.$store.getters.getHideCalc;
			},

			set(val) {
				this.$store.commit('updateHideCalc', val);
			}
		},

		getMethod: {
			get() {
				return this.$store.getters.getMethod;
			},

			set(value) {

				this.payment.status = '';
				this.payment.message = '';

				if (value === 'stripe')
					this.generateStripe();

				this.$store.dispatch('updateMethodAction', value);
			},
		},

		getStripeSettings() {
			return this.getSettings
				? Object.assign({}, this.getSettings.stripe)
				: {}
		},

		getPayPalSettings() {
			return this.getSettings
				? this.getSettings.paypal
				: {}
		},

		getWooCheckoutSettings() {
			return this.getSettings.woo_checkout || {};
		},

		getSettings() {
			return this.$store.getters.getSettings
		},

		purchaseBtnClass() {
			if (!this.getMethod || this.$store.getters.getUnusedFields.length > 0) {
				return 'disabled';
			}
			return '';
		},
	},

	created() {
		if (this.after && this.after === 'stripe') {
			this.getMethod = this.after;
			this.getHideCalc = true;
		}
	},

	methods: {

		isPaymentEnabled(paymentSlug) {

			let payment = this.payments.filter(p => (p.slug === paymentSlug));
			let isDisabled = true;

			if (payment.length <= 0) {
				return false;
			}

			/** is all payment settings exist **/
			if (this.getSettings.hasOwnProperty(paymentSlug) && this.getSettings[paymentSlug].enable) {
				isDisabled = payment[0].requiredSettingFields.some(requiredField =>
					(!this.getSettings[paymentSlug].hasOwnProperty(requiredField)
						|| this.getSettings[paymentSlug][requiredField] == ""));
			}

			/** if form enabled and payment enabled, check is in the payment list **/
			if (this.form && !isDisabled) {
				return this.getSettings.formFields.paymentMethods.includes(paymentSlug);
			}

			return !isDisabled;
		},

		formState() {
			const vm = this;
			let status = true;
			vm.paymentForm.sendFields.forEach((element, index) => {
				if (element.required && !(element.value.length > 0)) {
					vm.paymentForm.requires[index].required = true;
					status = false;
				} else
					vm.paymentForm.requires[index].required = false;
			});

			if (!status) {
				vm.paymentForm.errorMessage = true;
				vm.paymentForm.errorCaptcha = false;
				vm.paymentForm.successMessage = false;
			}

			return status;
		},

		getOrderFiles(arg) {
			const files = [];
			const data = Object.values(arg).filter(field => ['file_upload'].includes(field.alias.replace(/\_field_id.*/, '')));
			data.forEach(item => {
				files.push({'alias': item.alias, 'files': item.options.value});
			});

			return files;
		},

		parseSubtotal(data) {
			const exceptions = ['total', 'html', 'line'];
			let result = [];

			data.forEach(item => {
				const fieldName = item.alias.replace(/\_field_id.*/, '');

				if (!exceptions.includes(fieldName) && item.hidden !== true) {
					if (item.checked) {
						let res = {
							alias: item.alias,
							title: item.label,
							value: item.value
						}

						if (item.hasOwnProperty('options') && item.options.length > 0) {
							res.options = item.options.map(option => {
								return {
									label: option.label,
									value: option.value,
								}
							})
						}

						if (item.summary_view) {
							res.summary_value = item.summary_value
							res.summary_view = item.summary_view
							res.extraView = item.extraView
						}

						result.push(res)
					}
				}
			})

			return result
		},

		async sendData() {
			const vm = this;
			vm.loader = true;

			const orderDetails = {
				id: this.$store.getters.getCalcId,
				orderId: this.paymentForm.orderId,
				calcName: this.$store.getters.getSettings.title,
				total: this.$store.getters.getFormula[0].total,
				currency: this.$store.getters.getSettings.currency.currency,
				orderDetails: this.parseSubtotal(this.$store.getters.getDescriptions()),
				paymentMethod: vm.getMethod,
				formDetails: {
					form: 'Default Contact Form',
					fields: vm.paymentForm.sendFields
				},
				files: this.getOrderFiles(this.$store.getters.getDescriptions()),
			}
			this.$store.commit('setFormFields', vm.paymentForm.sendFields);

			if (this.paymentForm.status)
				orderDetails.status = 'complete'

			const response = await this.$store.dispatch('addOrder', orderDetails)
			if (response.success) {
				this.$store.commit('setOrderId', response.data.order_id);
				vm.loader = false;
				vm.paymentForm.successMessage = true;
			}

			return response;
		},

		resetFields() {
			let vm = this;

			vm.paymentForm.orderId = null;
			vm.paymentForm.sendFields.forEach(function (element) {
				element.value = '';
			});
		},

		async OrderPayment() {
			/** IF demo or live site ( demonstration only ) **/
			if (this.$store.getters.getIsLiveDemoLocation) {
				const demoModeDiv = this.getDemoModeNotice();
				const purchaseBtn = this.$el.querySelector('.ccb-btn-container button');
				purchaseBtn.parentNode.parentNode.after(demoModeDiv);
				return;
			}

			const formState = this.formState();

			if (formState) {
				const response = await this.sendData();
				if (response && response.data.status === 'success') {
					this.paymentForm.orderId = response.data.order_id;
					const paymentResponse = await this.applyPayment();
					if (paymentResponse && paymentResponse.status === 200)
						this.getMethod = null;

					if (this.stripe.stripeClientSecret)
						this.paymentForm.status = true;
				}
			}
		},

		async applyWoo(post_id) {
			/** IF demo or live site ( demonstration only ) **/
			if (this.$store.getters.getIsLiveDemoLocation) {
				const demoModeDiv = this.getDemoModeNotice();
				const purchaseBtn = this.$el.querySelector('.ccb-btn-container button');
				purchaseBtn.parentNode.parentNode.after(demoModeDiv);
				return;
			}
			/** END| IF demo or live site ( demonstration only ) **/
			if (this.$store.getters.hasUnusedFields)
				return;

			const orderFiles = this.getOrderFiles(this.$store.getters.getDescriptions());
			this.loader = true;
			const params = {
				post_id,
				files: orderFiles,
				callback: () => {},
			}
			this.loader = await this.$store.dispatch('applyWoo', params);
		},

		async applyPayment() {
			this.getStep = ''

			/** IF demo or live site ( demonstration only ) **/
			if (this.$store.getters.getIsLiveDemoLocation) {
				const demoModeDiv = this.getDemoModeNotice();
				const purchaseBtn = this.$el.querySelector('.ccb-btn-container button');
				purchaseBtn.parentNode.parentNode.after(demoModeDiv);
				return;
			}
			/** END| IF demo or live site ( demonstration only ) **/

			if (this.$store.getters.hasUnusedFields) {
				this.loader = false
				return
			}

			this.loader = true;
			const descriptions = this.$store.getters.getDescriptions()
			const data = {
				descriptions,
				item_name: this.getSettings.title,
				method: this.getMethod,
				calcTotals: this.$store.getters.getFormula,
				order_id: this.paymentForm.orderId,
				calc_id: this.getSettings.calc_id,
			};



			if (this.getMethod === 'stripe') {
				let result = null
				await this.stripe.stripe.createPaymentMethod('card', this.stripe.stripeCard)
					.then(async (cardResult) => {

						if (cardResult.error !== undefined && cardResult.error.message !== undefined) {
							this.getStep = 'notice'
							this.noticeData = {
								type: 'error',
								title: cardResult.error.message
							}
							this.showPaymentNotice('danger', cardResult.error.message);
						} else {
							let payment_data = {
								action: 'calc_stripe_intent_payment',
								method: this.getMethod,
								calc_id: this.getSettings.calc_id,
								order_id: this.paymentForm.orderId,
								calcTotals: this.$store.getters.getFormula,
								paymentMethodId: cardResult.paymentMethod.id,
								nonce: this.nonces.ccb_stripe
							};

							 await this.$store.dispatch('fetchPayment', payment_data)
								.then(async (response) => {
									result = response
									if (response.status === 'success') {
										if (response.requiresAction) {
											// Card requires Auhentication
											await this.handleStripeCard(response);
										} else {
											// Order Complete
											this.$store.dispatch('completeOrder', this.$store.getters.getOrderId)
											this.stripe.stripeClientSecret = response.clientSecret;
										}
									} else {
										this.getStep = 'notice';
										this.noticeData = {
											type: 'error',
											title: result.message,
										}
										this.stripe.stripeClientSecret = false;
									}

									this.loader = false
								});

							if (this.stripe.stripeClientSecret) {
								return await this.stripe.stripe.retrievePaymentIntent(this.stripe.stripeClientSecret)
									.then((retrieve_result) => {
										data.action = 'ccb_stripe_payment';
										data.tokencalc_stripe_intent_payment_id = retrieve_result.paymentIntent.id;
										data.nonce = this.nonces.ccb_stripe;
										this.getStep = 'finish'

										this.$store.commit('setPaymentType', this.getMethod);
										this.$store.commit('setIssuedOn', this.paymentForm.sendFields[0].value)
									});
							}
						}
					});
				return result
			} else if (this.getMethod === 'paypal') {
				data.action = 'ccb_paypal_payment'
				data.nonce = this.nonces.ccb_paypal;

				const result = await this.$store.dispatch('fetchPayment', data);
				setTimeout(() => {
					if (result) {
						this.getMethod = null;
						this.resetFields();
						this.showPaymentNotice(result.status, result.message);
					}
				}, 500);

				if ( result && result.success === false ) {
					this.getStep = 'notice';
					this.noticeData = {
						type: 'error',
						title: result.message,
					}
				}

				return result;
			}
		},

		generateStripe(access = true) {
			let vm = this;
			this.$nextTick(() => {
				const stripe_id = this.getStripeSettings.publishKey;
				if (!stripe_id.length && access) {

					vm.payment.status = 'danger';
					vm.payment.message = 'Something went wrong';
					return false;

				} else if (access) {

					vm.payment.status = '';
					vm.payment.message = '';

				}

				vm.stripe.stripe = Stripe(stripe_id);
				let elements = vm.stripe.stripe.elements();

				vm.stripe.stripeCard = elements.create('card');
				vm.stripe.stripeCard.mount('#ccb_stripe_' + vm.getSettings.calc_id);
				vm.stripe.stripeCard.addEventListener('change', event => {
					vm.stripe.stripeComplete = event.complete;
				});
			});
		},

		async handleStripeCard(data) {
			await this.stripe.stripe.handleCardAction(data.clientSecret)
				.then(async (card_action_result) => {
					if (card_action_result.error) {
						this.showPaymentNotice('danger', 'Your card was not authenticated!');
					} else if (card_action_result.paymentIntent.status === 'requires_confirmation') {
						let retrieve_data = {
							action: 'calc_stripe_intent_payment',
							calc_id: this.getSettings.calc_id,
							calcTotals: this.$store.getters.getFormula,
							paymentIntentId: data.paymentIntentId,
							nonce: this.nonces.ccb_stripe
						};

						// Retrieve Payment
						await this.$store.dispatch('fetchPayment', retrieve_data)
							.then((intent) => {
								if (intent.status === 'success') {
									// Order Complete
									this.stripe.stripeClientSecret = intent.clientSecret;
								} else {
									this.showPaymentNotice(intent.status, intent.message);
								}
							});
					}
				});
		},

		showPaymentNotice(status, message) {
			this.loader = false;
			this.payment.status = status;
			this.payment.message = message;
		},

		...Helpers,
	},

	watch: {
		getMethod() {
			this.$store.getters.hasUnusedFields;
		},
	},
}
