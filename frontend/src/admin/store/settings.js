export default {
	state: {
		tab: 'total-summary',
		forms: [],
		products: [],
		categories: [],
		desc_options: {},
		woo_meta_links: [],
		woo_meta_fields: ['price'],
		woo_actions: {
			set_value: 'Set value',
			set_value_disable: 'Set value and disable'
		},
		settings: {
			general: {
				tour_title: 'Grand Total',
				tour_description: 'Edit the default view of the Total summary.',
				header_title: 'Summary',
				descriptions: true,
				hide_empty: true,
				sticky: false,
				boxStyle: 'vertical',
				in_pro: false,
				icons: 'ccb-icon-Union-28',
				slug: 'total-summary',
				styles: {
					toggle: '',
					checkbox: '',
					radio: '',
					checkbox_with_img: '',
					radio_with_img: '',
				},
			},
			currency: {
				tour_title: 'Currency',
				tour_description: 'Set the currency sign and edit its default appearance.',
				currency: '$',
				num_after_integer: 2,
				decimal_separator: '.',
				thousands_separator: ',',
				currencyPosition: 'left_with_space',
				in_pro: false,
				icons: 'ccb-icon-Union-23',
				slug: 'currency',
			},
			texts: {
				tour_title: 'Notifications',
				tour_description: 'Manage notifications of Calculator forms.',
				title: 'Your service request has been completed!',
				description: 'We have sent your request information to your email.',
				issued_on: 'Issued on',
				reset_btn: 'Create new calculation',
				invoice_btn: 'Get invoice',
				required_msg: 'This field is required',
				in_pro: false,
				icons: 'ccb-icon-Path-3601',
				slug: 'texts',
			},
			formFields: {
				tour_title: 'Send Form',
				tour_description: 'Choose contact form type and fill out settings.',
				fields: [],
				emailSubject: '',
				contactFormId: '',
				accessEmail: false,
				adminEmailAddress: '',
				submitBtnText: 'Submit',
				allowContactForm: false,
				body: 'Dear sir/madam\n' +
					'We would be very grateful to you if you could provide us the quotation of the following:\n' +
					'\nTotal Summary\n' +
					'[ccb-subtotal]\n' +
					'Total: [ccb-total-0]\n' +
					'Looking forward to hearing back from you.\n' +
					'Thanks in advance',
				payment: false,
				paymentMethod: '',
				paymentMethods: [],
				in_pro: true,
				icons: 'ccb-icon-XMLID_426',
				slug: 'send-form',
			},
			woo_products: {
				tour_title: 'Woo Products',
				tour_description: 'Enables Calculator on the product page.',
				enable: false,
				category_id: '',
				category_ids: [],
				hook_to_show: 'woocommerce_after_single_product_summary',
				hide_woo_cart: false,
				meta_links: [],
				in_pro: true,
				icons: 'ccb-icon-Union-17',
				slug: 'woo-products',
			},

			woo_checkout: {
				tour_title: 'Woo Checkout',
				tour_description: 'Enables WooCommerce Checkout.',
				enable: false,
				product_id: '',
				redirect_to: 'cart',
				description: '[ccb-total-0]',
				formulas: [],
				in_pro: true,
				icons: 'ccb-icon-Path-3498',
				slug: 'woo-checkout',
				replace_product: true,
			},

			stripe: {
				tour_title: 'Stripe',
				tour_description: 'Enables Stripe payment gateway.',
				enable: false,
				secretKey: '',
				publishKey: '',
				currency: 'usd',
				description: '[ccb-total-0]',
				formulas: [],
				in_pro: true,
				icons: 'ccb-icon-Path-3499',
				slug: 'stripe',
			},

			paypal: {
				tour_title: 'PayPal',
				tour_description: 'Enables PayPal payment gateway.',
				enable: false,
				description: '[ccb-total-0]',
				paypal_email: '',
				currency_code: '',
				paypal_mode: 'sandbox',
				formulas: [],
				in_pro: true,
				icons: 'ccb-icon-Path-3500',
				slug: 'paypal',
			},

			recaptcha: {
				enable: false,
				type: 'v2',
				v2: {
					siteKey: '',
					secretKey: '',
				},

				v3: {
					siteKey: '',
					secretKey: '',
				},

				options: {
					v2: 'Google reCAPTCHA v2',
					v3: 'Google reCAPTCHA v3',
				},
			},
			notice: {
				requiredField: 'This field is required',
			},
			title: 'Untitled',
			icon: 'fas fa-cogs',
			type: 'Cost Calculator Settings',
		}
	},
	mutations: {
		setDescOptions(state, options) {
			state.desc_options = options || {};
		},
		updateAll(state, response) {
			state.desc_options = response.desc_options;
			state.forms = response.forms;
			state.products = response.products;
			state.categories = response.categories;
			state.woo_meta_links = typeof response.settings?.woo_products?.meta_links !== 'undefined' ?
				response.settings.woo_products.meta_links :
				[];

			if (response.settings && response.settings.general)
				state.settings = this._vm.$validateData(this._vm.$deepMerge(state.settings, response.settings));

		},

		updateSettings(state, settings) {
			if (settings?.hasOwnProperty('general'))
				state.settings = this._vm.$validateData(this._vm.$deepMerge(state.settings, settings))
		},

		updateCalcId(state, id) {
			state.settings.calc_id = id
		},

		addWooMetaLink(state) {
			const defaultLink = {
				woo_meta: '',
				action: '',
				calc_field: '',
			};
			state.woo_meta_links.push(defaultLink);
			state.settings.woo_products.meta_links = [...state.woo_meta_links];
		},

		updateWooMetaLinks(state, links) {
			state.woo_meta_links = links;
			state.settings.woo_products.meta_links = [...state.woo_meta_links];
		},
		updateWooCategoryIds(state, ids) {
			state.settings.woo_products.category_ids = ids;
		},

		updateTab(state, tab) {
			state.tab = tab
		}
	},
	getters: {
		getTab: state => state.tab,
		getForms: state => state.forms,
		getSettings: state => state.settings,
		getProducts: state => state.products,
		getCategories: state => state.categories,
		getCalcId: state => state.settings.calc_id,
		getDescOptions: state => state.desc_options,
		getWooMetaLinks: state => state.woo_meta_links,
		getWooMetaFields: state => state.woo_meta_fields,
		getWooActions: state => state.woo_actions
	},
};
