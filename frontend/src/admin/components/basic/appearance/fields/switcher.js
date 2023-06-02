export default {
	props: {
		element: {
			type: Object,
			default: {},
		},
		name: '',
	},

	data: () => ({
		value: null,
	}),
	computed: {
		// todo for now use static
		options() {
			// if ( this.isObjectHasPath(this.element, ['data', 'options']) ) {
			//     return this.element.data.options;
			// }
			return {
				'horizontal': "Horizontal",
				'vertical': "Vertical",
			};
		}
	},
	created() {
		this.value = this.element.value;
	},

	methods: {
		updateField: function (newValue) {
			this.value = newValue;
		}
	},
	watch: {
		value: function (val) {
			this.element.value = this.value;
			this.$emit('change');
		}
	},
	template: `
    <div class="ccb-appearance-field switcher">
        <div @click.prevent="updateField(option_key)" v-for="(option, option_key) in options"  :class="['ccb-switch-option', {'active' : (option_key == value )}]"  >
            <input type="radio" :value="option_key" v-model="value" :name="'radio-' + name" :id="[name, option_key].join('_')"  />
            <label>{{ option }}</label>
        </div>
    </div>`,
}