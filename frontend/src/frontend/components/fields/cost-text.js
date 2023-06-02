import fieldsMixin from "./fieldsMixin";
export default {
    mixins: [fieldsMixin],
	props: {
		field: [Object, String],
	},

	data: () => ({
		textareaValue: '',
		labelId: '',
		textField: null,
	}),

	created() {
		this.textField = this.parseComponentData();
		this.labelId = 'text_area_'
	},

	computed: {
		additionalCss() {
		    return this.$store.getters.getCalcStore.hasOwnProperty(this.textField.alias) && this.$store.getters.getCalcStore[this.textField.alias].hidden === true
                ? 'display: none;'
                : '';
		},

		fieldsStyles() {
			return this.getElementAppearanceStyleByPath(this.appearance, 'elements.fields.data');
		},

		textAreaStyles() {
			let result = {};
			Object.keys(this.fieldsStyles).forEach((key) => {
				result[key] = this.fieldsStyles[key];
				if (key === 'background')
					result = {...result, ...this.fieldsStyles[key]};
			});
			result.padding = `12px ${result.field_side_indents}`;
			delete result.height;
			return result;
		},
	},
    watch: {
        textareaValue( value ) {
            this.$emit('change', value, this.textField.alias);
        }
    },
	methods: {
		onChange() {
			this.$emit('change', this.textareaValue, this.textField.alias)
		}
	},
}