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

	created() {
		this.value = this.element.value;
	},

    watch: {
		value: function () {
			this.element.value = this.value;
			this.$emit('change');
		}
	},

    template: `
            <div class="list-header">
                <div class="ccb-switch">
                    <input type="checkbox" v-model="value"/>
                    <label></label>
                </div>
                <h6 class="ccb-heading-5" v-if="element.label">{{ element.label }}</h6>
            </div>
    `,
}