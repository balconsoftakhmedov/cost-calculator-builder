import fieldsMixin from "./fieldsMixin";

export default {
	mixins: [fieldsMixin],
	props: {
		field: [Object, String],
		value: {
			default: '',
		},
	},
	data: () => ({
		dropDownField: {},
		selectOpen: false,
	}),

	created() {
		this.dropDownField = this.parseComponentData();
		this.selectValue = this.value;
	},

	methods: {
		toggleSelect() {
			this.selectOpen = !this.selectOpen
		}
	},

	watch: {
		value(val) {
			if (val && val.toString().indexOf('_') === -1) {
				Array.from(this.dropDownField.options).forEach((element, index) => {
					if (element.optionValue === val) {
						this.selectValue = val + '_' + index;
					}
				})
			} else if (val.length === 0) {
				this.selectValue = '0';
			} else {
				this.selectValue = val;
			}
		}
	},

	computed: {
		additionalCss() {
		    return this.$store.getters.getCalcStore.hasOwnProperty(this.dropDownField.alias) && this.$store.getters.getCalcStore[this.dropDownField.alias].hidden === true
                ? 'display: none;'
                : '';
		},

		getOptions() {
			let result = [];
			if (this.dropDownField.options) {
				result = Array.from(this.dropDownField.options).map((element, index) => {
					return {
						label: element.optionText,
						value: `${element.optionValue}_${index}`,
					}
				})
			}

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
						if (!option && element.value == value && index == key) {
							option = JSON.parse(JSON.stringify(element));
						}
					});

				setTimeout(() => {
					this.$emit(this.dropDownField._event, value, this.dropDownField.alias, option ? option.label : '');
					this.$emit('condition-apply', this.dropDownField.alias)
				})
			}
		},
	}
}