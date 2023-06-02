import fieldsMixin from "../fields/fieldsMixin";

export default {
	mixins: [fieldsMixin],
	mounted() {

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

		orderId() {
			return this.$store.getters.getOrderId;
		},

		paymentMethod: {
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

		settings() {
			return this.$store.getters.getSettings
		},

		showStripeCard: {
			get() {
				return this.$store.getters.getHideCalc;
			},

			set(val) {
				this.$store.commit('updateHideCalc', val);
			}
		},

		stripeSettings() {
			return this.settings
				? Object.assign({}, this.settings.stripe)
				: {}
		},
	},

	methods: {
		async applyPayment() {
			if (this.$store.getters.hasUnusedFields) {
				this.loader = false
				return
			}

			this.loader = true;
			const descriptions = this.$store.getters.getDescriptions()
			const data = {
				descriptions,
				item_name: this.settings.title,
				method: this.paymentMethod,
				calcTotals: this.$store.getters.getFormula,
				order_id: this.orderId,
				calc_id: this.settings.calc_id,
			};

			if (this.paymentMethod === 'paypal') {

				data.action = 'ccb_paypal_payment',
					data.nonce = this.nonces.ccb_paypal;

			} else if (this.paymentMethod === 'stripe') {
				await this.stripe.stripe.createPaymentMethod('card', this.stripe.stripeCard)
					.then(async (cardResult) => {
						if (cardResult.error !== undefined && cardResult.error.message !== undefined) {
							this.showPaymentNotice('error', cardResult.error.message);
						} else {
							let payment_data = {
								action: 'calc_stripe_intent_payment',
								method: this.paymentMethod,
								calc_id: this.settings.calc_id,
								order_id: this.orderId,
								calcTotals: this.$store.getters.getFormula,
								paymentMethodId: cardResult.paymentMethod.id,
								nonce: this.nonces.ccb_stripe
							};

							await this.$store.dispatch('fetchPayment', payment_data)
								.then(async (response) => {
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
										this.showPaymentNotice(response.status, response.message);
										this.stripe.stripeClientSecret = false;
									}
								});

							if (this.stripe.stripeClientSecret) {
								await this.stripe.stripe.retrievePaymentIntent(this.stripe.stripeClientSecret)
									.then((retrieve_result) => {
										data.action = 'ccb_stripe_payment';
										data.token_id = retrieve_result.paymentIntent.id;
										data.nonce = this.nonces.ccb_stripe;
										this.getStep = 'finish';
										this.$store.commit('setPaymentType', this.paymentMethod);
									});
							}
						}
					});
			}

			if (data.action) {
				const result = await this.$store.dispatch('fetchPayment', data);
				setTimeout(() => {
					if (result) {
						if (this.paymentMethod !== 'paypal') {

							this.showPaymentNotice(result.status, result.message);
						}
					}
				}, 500);
				return result;
			}
		},

		async applyWoo(post_id) {
			if (this.$store.getters.hasUnusedFields)
				return
			this.loader = true;
			const params = {
				post_id,
				files,
				callback: () => {
					this.loader = false
				},
			}
			this.loader = await this.$store.dispatch('applyWoo', params);
		},

		async handleStripeCard(data) {
			await this.stripe.stripe.handleCardAction(data.clientSecret)
				.then(async (card_action_result) => {
					if (card_action_result.error) {
						this.showPaymentNotice('danger', 'Your card was not authenticated!');
					} else if (card_action_result.paymentIntent.status === 'requires_confirmation') {
						let retrieve_data = {
							action: 'calc_stripe_intent_payment',
							stripe_info: this.stripeSettings,
							calcTotals: this.$store.getters.getFormula,
							paymentIntentId: data.paymentIntentId,
							nonce: this.nonces.ccb_stripe
						};

						// Retrieve Payment
						retrieve_data.calc_id = this.settings.calc_id
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

		generateStripe(access = true) {
			let vm = this;
			this.$nextTick(() => {
				const stripe_id = this.stripeSettings.publishKey;
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
				vm.stripe.stripeCard.mount('#ccb_stripe_' + vm.settings.calc_id);
				vm.stripe.stripeCard.addEventListener('change', event => {
					vm.stripe.stripeComplete = event.complete;
				});
			});
		},

		isPaymentEnabled(paymentSlug) {
			let payment = this.payments.filter(p => (p.slug === paymentSlug));
			if (payment.length <= 0 || !this.settings.formFields.paymentMethods.includes(paymentSlug)
				|| (this.settings.hasOwnProperty(paymentSlug) && !this.settings[paymentSlug].enable)
			) {
				return false;
			}

			/** is all payment settings exist **/
			return payment[0].requiredSettingFields.some(requiredField => (
					this.settings[paymentSlug].hasOwnProperty(requiredField)
					&& this.settings[paymentSlug][requiredField] != ""
				)
			);
		},

		showPaymentNotice(status, message) {
			this.loader = false;
			if ( this.getStep !== 'finish' ) {
				this.getStep = 'notice';
				this.noticeData = {
					type: status,
					title: message,
				};
			}
		}
	},
}
