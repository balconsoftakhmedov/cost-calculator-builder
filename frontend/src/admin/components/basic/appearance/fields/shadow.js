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
		xPosElement: {},
		yPosElement: {},
		value: '',

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

			if (this.isObjectHasPath(this.element, ['data', 'x'])) {
				this.xPosElement = this.element.data.x;
				this.xPosElement.name = [this.name, 'data', 'x'].join('.');
			}

			if (this.isObjectHasPath(this.element, ['data', 'y'])) {
				this.yPosElement = this.element.data.y;
				this.yPosElement.name = [this.name, 'data', 'y'].join('.');
			}

		},
		generateValue() {
			let xPos = 0;
			let yPos = 0;
			let blur = 0;

			let color = this.colorElement.value;

			if (this.xPosElement.value > 0) {
				xPos = this.xPosElement.value;
			}
			if (this.yPosElement.value > 0) {
				yPos = this.yPosElement.value;
			}
			if (this.blurElement.value > 0) {
				blur = this.blurElement.value;
			}

			return {
				color,
				blur,
				x: xPos,
				y: yPos
			};
		}
	},
	watch: {
		'xPosElement.value': function (newValue) {
			this.element.value = this.generateValue();
			this.element.data.x.value = newValue;
			this.$emit('change');
		},
		'yPosElement.value': function (newValue) {
			this.element.value = this.generateValue();
			this.element.data.y.value = newValue;
			this.$emit('change');

		},
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
	},
	template: `
		<div class="ccb-appearance-shadow">
		   <div class="ccb-appearance-shadow-inner">
			  <color-field :element="colorElement" :name="colorElement.name" :key="colorElement.name"></color-field>
			  <number-field :element="blurElement" :name="blurElement.name" :key="blurElement.name"></number-field>
		   </div>
		   <div class="ccb-appearance-shadow-inner">
			  <number-field :element="xPosElement" :name="xPosElement.name" :key="xPosElement.name"></number-field>
			  <number-field :element="yPosElement" :name="yPosElement.name" :key="yPosElement.name"></number-field>
		   </div>
		</div>
    `,
}