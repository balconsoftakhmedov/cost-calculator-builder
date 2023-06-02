import color from './color';
import number from "./number";

export default {
	props: {
		element: {
			type: Object,
			default: {},
		},
		name: '',
	},
	components: {
		'color-field': color,
		'number-field': number,
	},
	data: () => ({
		blurElement: {},
		colorElement: {},
		opacityElement: {},
	}),

	created() {
		this.setData();
	},

	methods: {
		setData() {
			this.value = this.element.value;

			if (this.isObjectHasPath(this.element, ['data', 'color'])) {
				this.colorElement = this.element.data.color;
				this.colorElement.name = [this.name, 'data', 'color'].join('.');
			}

			if (this.isObjectHasPath(this.element, ['data', 'blur'])) {
				this.blurElement = this.element.data.blur;
				this.blurElement.name = [this.name, 'data', 'blur'].join('.');
			}

			if (this.isObjectHasPath(this.element, ['data', 'blur'])) {
				this.opacityElement = this.element.data.opacity;
				this.opacityElement.name = [this.name, 'data', 'opacity'].join('.');
			}

		},
		generateValue() {
			let blur = 0;
			let opacity = 0
			let color = this.colorElement.value;

			if (this.blurElement.value > 0) {
				blur = this.blurElement.value;
			}

			if (this.opacityElement.value > 0) {
				opacity = this.opacityElement.value;
			}

			return {
				color,
				blur,
				opacity
			};
		}
	},

	watch: {
		'colorElement.value': function (newValue) {
			this.element.value = this.generateValue();
			this.element.data.color.value = newValue;
			this.$emit('change');
		},
		'blurElement.value': function (newValue) {
			this.element.value = this.generateValue();
			this.element.data.blur.value = newValue;
			this.$emit('change');
		},
		'opacityElement.value': function (newValue) {
			this.element.value = this.generateValue();
			this.element.data.opacity.value = newValue;
			this.$emit('change');
		},
	},
	template: `
       <div class="ccb-background-field container">
		  <color-field :element="colorElement" :name="colorElement.name" :key="colorElement.name"></color-field>
          <number-field :element="opacityElement" :name="opacityElement.name" :key="opacityElement.name"></number-field>
          <number-field  :element="blurElement" :name="blurElement.name" :key="blurElement.name"></number-field>
		</div>
	`,
}