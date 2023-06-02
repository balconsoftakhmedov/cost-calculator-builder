import number from "./number";
import select from "./select";

export default {
	props: {
		element: {
			type: Object,
			default: {},
		},
		name: '',
	},

	components: {
		'number-field': number,
		'select-field': select,
	},

	data: () => ({
		value: '',
		borderType: {
			showLabel: true,
		},
		borderWidth: {
			showLabel: true,
			data: {
				min: 1,
				max: 100,
				step: 1,
				dimension: 'px',
			}
		},
		borderRadius: {
			showLabel: true,
			data: {
				min: 1,
				max: 100,
				step: 1,
				dimension: 'px',
			}
		},

		ready: false,
	}),

	created() {
		this.setData();
	},

	methods: {
		setData() {
			this.value = this.element.value;

			if (this.isObjectHasPath(this.element, ['data', 'border_width'])) {
				this.borderWidth = {
					...this.borderWidth,
					...this.element.data.border_width,
					value: parseInt(this.element.data.border_width.value),
				};
				this.borderWidth.name = [this.name, 'data', 'border_width'].join('.');
			}

			if (this.isObjectHasPath(this.element, ['data', 'border_radius'])) {
				this.borderRadius = {
					...this.borderRadius,
					...this.element.data.border_radius,
					value: parseInt(this.element.data.border_radius.value),
				};
				this.borderRadius.name = [this.name, 'data', 'border_radius'].join('.');
			}

			if (this.isObjectHasPath(this.element, ['data', 'border_type'])) {
				this.borderType = {
					...this.borderType,
					...this.element.data.border_type
				};
				this.borderType.name = [this.name, 'data', 'border_type'].join('.');
			}

			this.ready = true
		},

		generateValue() {
			let type = this.borderType.value
			let width = this.borderWidth.value
			let radius = this.borderRadius.value

			return {type, width, radius}
		}
	},

	watch: {
		'borderType.value': function (newValue) {
			this.element.value = this.generateValue();
			this.element.data.border_type.value = newValue;
			this.$emit('change');
		},
		'borderRadius.value': function (newValue) {
			this.element.value = this.generateValue();
			this.element.data.border_radius.value = newValue;
			this.$emit('change');
		},
		'borderWidth.value': function (newValue) {
			this.element.value = this.generateValue();
			this.element.data.border_width.value = newValue;
			this.$emit('change');
		},
	},

	template: `
                <div class="ccb-background-field">
                	<template v-if="ready">
						<select-field :element="borderType" :name="borderType.name" :key="borderType.name"></select-field>
						<number-field :element="borderWidth" :name="borderWidth.name" :key="borderWidth.name"></number-field>
						<number-field :element="borderRadius" :name="borderRadius.name" :key="borderWidth.name"></number-field>
					</template>
                </div>
    `,
}