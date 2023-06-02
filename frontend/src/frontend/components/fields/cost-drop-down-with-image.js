import fieldsMixin from "./fieldsMixin";

export default {
	mixins: [fieldsMixin],
	props: {
		field: [Object, String],
		disabled: {
			type: Boolean,
			default: false
		},
		currencyFormat: {
			type: Function,
			default: () => {
			},
		},
		value: {
			default: '',
		},
	},

	data: () => ({
		dropDownField: {},
		current: null,
		openList: false,
	}),

	created() {
		this.dropDownField = this.parseComponentData();
		this.selectValue = this.value;
		const option = this.getOptions.find(o => o.value === this.value)
		this.selectOption(option, false);
	},

	mounted() {
		this.initListeners();
	},

	watch: {
		value(val) {
			if (val && val.toString().indexOf('_') === -1) {
				Array
					.from(this.dropDownField.options)
					.forEach((element, index) => element.optionValue === val ? this.selectValue = val + '_' + index : null);
			} else if (val.length === 0) {
				this.selectValue = '0';
			} else {
				this.selectValue = val;
			}
		}
	},

	methods: {
		openListHandler() {
			this.openList = !this.openList;
		},

		initListeners() {
			window.removeEventListener('click', this.listenerHandler);
			window.addEventListener('click', this.listenerHandler)
		},

		listenerHandler(e) {
			const $target = e.target;
			if (!Array.from($target.classList).includes('calc-dd-img-toggle'))
				this.openList = false;
		},

		selectOption(element, toggle = true) {
			this.openList = toggle ? !this.openList : this.openList;
			if (element) {
				const {src, label, value} = element;
				this.current = {src, label, value};
				this.selectValue = value;
			} else {
				this.current = null;
				this.selectValue = 0;
			}
		}
	},

	computed: {
		getDefaultImg() {
			return this.$store.getters.getDefaultImg
		},

		getCurrent: {
			get() {
				return this.current;
			},

			set(src, label, value) {
				this.current = {src, label, value};
			}
		},

		additionalCss() {
			return this.$store.getters.getCalcStore.hasOwnProperty(this.dropDownField.alias) && this.$store.getters.getCalcStore[this.dropDownField.alias].hidden === true
				? 'display: none;'
				: '';
		},

		getOptions() {
			let result = [];
			if (this.dropDownField.options)
				result = Array
					.from(this.dropDownField.options)
					.map((element, index) => ({
						label: element.optionText,
						src: element.src || this.getDefaultImg,
						value: `${element.optionValue}_${index}`,
						converted: this.currencyFormat(this.dropDownField.allowRound ? Math.round(element.optionValue) : element.optionValue, {currency: true}, this.currencySettings),
					}));

			return result;
		},

		selectValue: {
			get() {
				return this.value;
			},

			set(value) {
				if (value === 0) {
					this.$emit(this.dropDownField._event, 0, this.dropDownField.alias, '');
					this.$emit('condition-apply', this.dropDownField.alias);
				}

				if (!value)
					return;

				let [, index] = value.split('_');
				let option = null;
				this.getOptions
					.forEach((element, key) => {
						if (!option && element.value == value && index == key)
							option = JSON.parse(JSON.stringify(element));
					});

				setTimeout(() => {
					this.$emit(this.dropDownField._event, value, this.dropDownField.alias, option ? option.label : '');
					this.$emit('condition-apply', this.dropDownField.alias)
				});
			}
		},
	},
}