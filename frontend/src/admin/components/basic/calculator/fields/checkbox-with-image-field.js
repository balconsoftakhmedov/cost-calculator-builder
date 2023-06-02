import imgSelector from "../../../utility/imgSelector";

export default {
	props: {
		field: {
			type: Object,
			default: {},
		},

		id: {
			default: null,
		},

		order: {
			default: 0,
		},

		index: {
			default: null,
		},
	},

	components: {
		'img-selector': imgSelector,
	},

	data: () => ({
		checkboxField: {},
		errors: {},
		tab: 'main',
		errorsCount: 0,
		selectedIdx: null,
	}),

	computed: {
		options() {
			let options = [];
			if ( this.checkboxField && this.checkboxField.options )
				options = Array.from(this.checkboxField.options).filter(e => e.optionText);

			if ( ! this.checkboxField.default )
				this.checkboxField.default = '';

			return options;
		},

		getDescOptions() {
			return this.$store.getters.getDescOptions
		},

		translations() {
			return this.$store.getters.getTranslations;
		},

		getCheckboxStyles() {
			return [
				{
					label: 'Default',
					value: 'default',
					img: {
						vertical: `${window.ajax_window.plugin_url}/frontend/dist/img/styles/checkbox/image_default.png`,
						horizontal: `${window.ajax_window.plugin_url}/frontend/dist/img/styles/checkbox/image_default.png`,
					},
				},
				{
					label: 'Box with icon',
					value: 'with-icon',
					img: {
						vertical: `${window.ajax_window.plugin_url}/frontend/dist/img/styles/checkbox/style_6_vertical.png`,
						horizontal: `${window.ajax_window.plugin_url}/frontend/dist/img/styles/checkbox/style_6_horizontal.png`,
					}
				},
			]
		},

		getCurrentImage() {
			if (this.checkboxField.styles) {
				const current = this.getCheckboxStyles.find(s => s.value === this.checkboxField.styles.style)
				if ( current ) {
					return current.img[this.checkboxField.styles.box_style]
				}
			}

			return `${window.ajax_window.plugin_url}/frontend/dist/img/styles/checkbox/image_default.png`
		},

		settings: {
			get() {
				return this.$store.getters.getSettings
			},

			set(value) {
				this.$store.commit('updateSettings', value)
			}
		}
	},

	mounted() {
		this.field = this.field.hasOwnProperty('_id') ? this.field : {};
		this.checkboxField = { ...this.resetValue(), ...this.field };
		if ( this.checkboxField._id === null ) {
			this.checkboxField._id = this.order;
			this.checkboxField.alias = this.checkboxField.alias + this.checkboxField._id;
		}
		this.checkboxField.required = this.checkboxField.hasOwnProperty('required') ? JSON.parse(this.checkboxField.required) : false

		this.checkboxField.apply_style_for_all = false
		setTimeout(() => {
			if ( this.settings.general.styles && this.settings.general.styles.checkbox_with_img ) {
				this.checkboxField.apply_style_for_all = true
				if (this.checkboxField.styles) {
					const fields = this.$store.getters.getBuilder
					const field = fields.find(f => f.alias === this.settings.general.styles.checkbox_with_img )
					if (field) {
						this.checkboxField.styles = JSON.parse(JSON.stringify(field.styles))
					}
				}
			}
		})
	},

	methods: {
		addOption() {
			this.checkboxField.options.push({ optionText: '', optionValue: '', src: null, icon: null });
		},

		numberCounterActionForOption(optionIndex, action = '+') {
			let input = document.querySelector('input[name=option_' + optionIndex + ']');
			let step = 1;
			let value = 0;

			if ( ! this.checkboxField.options.hasOwnProperty(optionIndex) || input === null )
				return;

			if ( input.step.length !== 0 )
				step = input.step;

			if ( this.checkboxField.options[optionIndex].optionValue.length > 0 )
				value = this.checkboxField.options[optionIndex].optionValue;

			value = action === '-'
				? parseFloat(value) - parseFloat(input.step)
				: parseFloat(value) + parseFloat(input.step);

			if ( input.min.length !== 0 && value < input.min )
				return;

			value = parseInt(step) === parseFloat(step)
				? value.toFixed()
				: value.toFixed(2);

			this.removeErrorTip('errorOptionValue' + optionIndex);
			this.checkboxField.options[optionIndex].optionValue = value;
		},

		removeErrorTip(index) {
			const errorClass = document.getElementById(index);
			while ( errorClass.firstChild ) errorClass.removeChild(errorClass.firstChild);
		},

		removeOption(index, optionValue) {
			if ( this.checkboxField.default === optionValue + '_' + index )
				this.checkboxField.default = '';
			this.checkboxField.options.splice(index, 1);
		},

		resetValue() {
			return {
				_id: null,
				label: '',
				description: '',
				required: false,
				_event: 'change',
				type: 'Checkbox With Image',
				allowRound: false,
				checkedLength: 0,
				additionalCss: '',
				additionalStyles: '',
				addToSummary: true,
				allowCurrency: false,
				_tag: 'cost-checkbox-with-image',
				icon: 'ccb-icon-Path-3512',
				alias: 'checkbox_with_img_field_id_',
				desc_option: 'after',
				styles: {
					box_style: 'vertical',
					style: 'default',
				},
				options: [
					{
						optionText: '',
						optionValue: '',
						optionHint: '',
					}
				],
				apply_style_for_all: false,
			};
		},

		save(checkboxField, id, index) {
			this.validate(checkboxField);
			if ( Object.keys(this.errors).length > 0 )
				return;

			const settings = this.settings
			if (this.checkboxField.apply_style_for_all === true) {
				settings.general.styles.checkbox_with_img = this.checkboxField.alias
				this.settings = settings
			} else {
				settings.general.styles.checkbox_with_img = ''
				this.settings = settings
			}

			this.$emit('save', checkboxField, id, index);
		},

		checkRequired(alias) {
			this.removeErrorTip(alias);
			this.errorsCount--;
		},

		validate(checkboxField, saveAction = true, idx) {
			delete this.errors.checkbox;
			this.errorsCount = 0;

			if ( checkboxField.options ) {
				let invalidOptionId = null;
				Array.from(this.checkboxField.options).map((element, index) => {
					const $option = document.getElementById(`errorOptionValue${ index }`);
					$option ? $option.innerHTML = "" : null;

					const $optionImg = document.getElementById(`errorOptionImage${ index }`);
					$optionImg ? $optionImg.innerHTML = "" : null;

					/** display tooltip error if format does not match (JPG, PNG) **/
					const imageOrIcon = this.checkboxField.styles && this.checkboxField.styles.style === 'with-icon' ? element.icon : element.src
					if ( ! imageOrIcon && saveAction ) {
						invalidOptionId = element.id;
						this.errorsCount++;
						this.errors.checkbox = true;
						this.$store.commit('setEditFieldError', true)
						$optionImg.innerHTML = `<span class="ccb-error-tip default">this is required field</span>`;
					}

					/** display tooltip error if there are empty option value **/
					if ( $option && element.optionValue.length === 0 && saveAction ) {
						this.errorsCount++;
						this.errors.checkbox = true;
						this.$store.commit('setEditFieldError', true)
						$option.innerHTML = `<span class="ccb-error-tip default">this is required field</span>`;
					}
				});

				/** reset error content **/
				const errors = document.querySelectorAll('.invalid-format-fields');
				errors?.forEach(e => e ? e.innerHTML = "" : null);

				const $errorImage = document.getElementById(`errorImage_${ invalidOptionId }`);
				if ( typeof idx === "number" && invalidOptionId && $errorImage ) {
					this.errors.checkbox = true;
					$errorImage.innerHTML = `<span class="error-tip" style="max-width: unset; top: -45px">${ this.translations?.format_error }</span>`
				}
			}
		},

		setThumbnail(src, index, actionClear = false) {
			if ( this.checkboxField.options[index] ) {
				if ( this.checkboxField.styles && this.checkboxField.styles.style === 'with-icon' ) {
					this.checkboxField.options[index].icon = src;
				} else {
					this.checkboxField.options[index].src = src;
				}
			}

			if ( ! actionClear )
				this.validate(this.checkboxField, false, +index);
		},
	},

	destroyed() {
		this.$store.commit('setEditFieldError', false)
	},

	watch: {
		'$store.getters.getEditFieldError': function (value) {
			if ( value === 'save_field' ) {
				this.save(this.checkboxField, this.id, this.index)
			}
		},
	}
}
