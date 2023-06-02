import fieldsMixin from "./fieldsMixin";

export default  {
	mixins: [fieldsMixin],
	props: {
		id: {
			default: null,
		},
		value: {
			default: 0,
			type: [Number, String]
		},
		field: [Object, String],
	},

	data: () => ({
		$calc: null,
		totalField: null,
		firstLoad: true,
	}),

	watch: {
		value() {
			this.change()
		},
	},

	computed: {
		additionalCss() {
			return this.$store.getters.getCalcStore.hasOwnProperty(this.rangeField.alias) && this.$store.getters.getCalcStore[this.rangeField.alias].hidden === true
				? 'display: none;'
				: '';
		},
	},

	mounted() {
		if (this.firstLoad && this.totalField) {
			this.change();
			this.firstLoad = false
		}
	},

	created() {
		this.totalField = this.parseComponentData();
	},

	methods: {
		change() {
			this.$emit('condition-apply', this.totalField.alias);
		},
	},
}