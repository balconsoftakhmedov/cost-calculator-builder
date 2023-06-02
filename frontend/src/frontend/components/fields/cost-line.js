import fieldsMixin from "./fieldsMixin";

export default {
	mixins: [fieldsMixin],
	props: {
		field: [Object, String],
	},

	data: () => ({
		lineField: null,
	}),

	created() {
		this.lineField = this.parseComponentData();
	},
	
	methods: {
		getPrimaryColor() {
			if ( this.appearance.desktop.colors.data.primary_color.value.length !== 0 ){
				return this.appearance.desktop.colors.data.primary_color.value;
			} else {
				return '#ccc'
			}
			
		}
	},

	computed: {
		appearance() {
			return this.$store.getters.getAppearance;
		},
		
		additionalCss() {
		    return this.$store.getters.getCalcStore.hasOwnProperty(this.lineField.alias) && this.$store.getters.getCalcStore[this.lineField.alias].hidden === true
                ? 'display: none;'
                : '';
		},

		getLine() {
			let result = {};
			const generate_color = (color, alpha) => color.length <= 7 ? `${color + alpha}` : color
			if (typeof this.lineField !== "undefined" && this.lineField.size) {
				const {size, style, len} = this.lineField
				result.width = len;
				result.borderBottom = `${size} ${style} ${generate_color(this.getPrimaryColor(), '4D')}`
			}
			return result
		},
	}

}
