import fieldsMixin from "./fieldsMixin";

export default {
	mixins: [fieldsMixin],
	props: {
		value: {
			default: 0,
			type: [Number, String]
		},
		field: [Object, String],
	},

	data: () => ({
		clearValue: 0,
		quantityField: null,
		quantityValue: 0,
		step: 1,
	}),

	watch: {
		/** set value from store **/
		calcStore: {
			handler: function (calcStore) {
				if (calcStore.hasOwnProperty(this.quantityField.alias) && +this.calcStore[this.quantityField.alias].original !== this.clearValue) {
					let value = +calcStore[this.quantityField.alias].original;
					if (this.clearValue !== value) {
						this.quantityValue = this.parseQuantityValue(value);
					}
				}
			},
			deep: true
		},

		quantityValue(value) {
			if ( value === '' || value.length <= 0 || value < 0 ){
				value           = 0;
				this.clearValue = 0;
			}

			/** rm not digits,dot,comma from quantityValue **/
			const regWithoutCurrencySettings = new RegExp('^[0-9 ]*(.|,)?[0-9 ]*$');
			if (!this.currencySettingsEnabled && !regWithoutCurrencySettings.test(value.toString())) {
				/** leave only numbers **/
				this.quantityValue = value.replace(/[^\d-]/g, '');
				return;
			}

			const regWithCurrencySettings = new RegExp('^[+-]?(?:\\d+|\\d{1,3}(?:(,|s|\'|.)\\d{3})*)(?:(\\.|,)\\d*)?$');
			if (this.currencySettingsEnabled && !regWithCurrencySettings.test(value.toString())) {
				this.quantityValue = value.replace(/[^\d-]/g, '');
				return;
			}

			if (this.numAfterInteger > 0) {
				/** clear from decimal part firstly **/
				let intValue = value.split(this.decimalSeparator);
				let decimals = '';
				if (intValue.length > 1) {
					decimals = intValue.slice(-1);
					intValue.pop();
				}

				intValue = intValue.join('').split(this.thousandsSeparator);
				this.clearValue = parseFloat(intValue.join('') + '.' + decimals[0]);
			} else {
				const intValue = value.split(this.thousandsSeparator);
				this.clearValue = parseFloat(intValue.join(''));
			}

			this.change();
			return false;
		}
	},

	computed: {
		additionalCss() {
			return this.$store.getters.getCalcStore.hasOwnProperty(this.quantityField.alias) && this.$store.getters.getCalcStore[this.quantityField.alias].hidden === true
				? 'display: none;'
				: '';
		},

		currencySettingsEnabled() {
			return (this.quantityField.hasOwnProperty('enabled_currency_settings') && this.quantityField.enabled_currency_settings);
		},

		decimalSeparator() {
			let decimal_separator = ','; // by default use comma
			if (Object.keys(this.settings.currency).length && this.isObjectHasPath(this.settings, ['currency', 'decimal_separator']))
				decimal_separator = this.settings.currency.decimal_separator;
			return decimal_separator;
		},

		settings() {
			return this.$store.getters.getSettings;
		},

		thousandsSeparator() {
			let separator = ','; // by default use comma
			if (Object.keys(this.settings.currency).length && this.isObjectHasPath(this.settings, ['currency', 'thousands_separator']))
				separator = this.settings.currency.thousands_separator;
			return separator;
		},

		numAfterInteger() {
			if (Object.keys(this.settings.currency).length && this.isObjectHasPath(this.settings, ['currency', 'num_after_integer']))
				return this.settings.currency.num_after_integer || 0;
			return 0;
		}
	},

	created() {
		this.clearValue = this.value;
		this.quantityField = this.parseComponentData();
		this.quantityValue = this.parseQuantityValue(this.value);
		this.change();

		if (this.quantityField.hasOwnProperty('step')) {
			this.step = this.quantityField.step;
		}
	},

	methods: {
		intValueFilter($event) {
			let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
			let separatorCode = 46;
			if ( this.decimalSeparator === ',' ) {
				separatorCode = 44
			}

			if ((keyCode < 48 || keyCode > 57) && keyCode !== separatorCode) { // 46 is dot 44 is comma
				$event.preventDefault();
			}
		},

		change() {
			this.$emit(this.quantityField._event, this.clearValue, this.quantityField.alias);
			this.$emit('condition-apply', this.quantityField.alias);
		},

		decrement() {
			if ( this.clearValue !== 0 ) {
				this.clearValue    = parseFloat(this.clearValue) - parseFloat(this.step);
				this.quantityValue = this.parseQuantityValue(this.clearValue);
			}
		},

		increment() {
			this.clearValue = parseFloat(this.clearValue) + parseFloat(this.step);
			this.quantityValue = this.parseQuantityValue(this.clearValue);
		},

		parseField() {
			this.quantityValue = this.parseQuantityValue(this.clearValue);
		},

		parseQuantityValue(value) {
			value = value.toString().replace(',', '.');
			if (!this.currencySettingsEnabled) {
				value = parseFloat(value).toFixed(0);
				return value;
			}

			if (isNaN(value) || value.length === 0)
				value = 0;

			if (this.numAfterInteger > 0) {
				/** set num_after_integer **/
				value = parseFloat(value).toFixed(parseInt(this.numAfterInteger));

				/** set decimal separator **/
				value = value.toString().replace(/\.|,/, this.decimalSeparator);

				/** set thousand separator **/
				const intValue = value.split(this.decimalSeparator);
				value = intValue[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, this.thousandsSeparator);
				value += this.decimalSeparator + intValue[1];
			} else {
				value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, this.thousandsSeparator);
			}

			return value;
		},
	}
}
