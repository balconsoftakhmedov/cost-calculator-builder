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
		'number-field': number,
	},
	data: () => ({
		allCornerElement: {},
		topRightCornerElement: {},
		topLeftCornerElement: {},
		bottomRightCornerElement: {},
		bottomLeftCornerElement: {},
		cornerDefaultElement: {
			data: {
				min: 0,
				max: 100,
				step: 1,
				dimension: 'px',
			}
		},
		corners: {
			top_left: 2,
			top_right: 2,
			bottom_left: 2,
			bottom_right: 2,
		},
		radiusType: 'all',
		value: '',
	}),
	created() {
		this.setData();
	},
	watch: {
		'allCornerElement.value': function () {
			this.allCornerElementUpdate();
			this.$emit('change');
		},
		'topLeftCornerElement.value': function () {
			this.topLeftCornerElementUpdate();
			this.$emit('change');
		},
		'topRightCornerElement.value': function () {
			this.topRightCornerElementUpdate();
			this.$emit('change');
		},
		'bottomRightCornerElement.value': function () {
			this.bottomRightCornerElementUpdate();
			this.$emit('change');
		},
		'bottomLeftCornerElement.value': function () {
			this.bottomLeftCornerElementUpdate();
			this.$emit('change');
		},
	},
	methods: {
		generateValue() {
			let value = this.allCornerElement.value;

			if ('part' === this.radiusType) {
				let topLeft = 0;
				let topRight = 0;
				let bottomRight = 0;
				let bottomLeft = 0;

				if (this.topLeftCornerElement.value > 0)
					topLeft = this.topLeftCornerElement.value;

				if (this.topRightCornerElement.value > 0)
					topRight = this.topRightCornerElement.value;

				if (this.bottomRightCornerElement.value > 0)
					bottomRight = this.bottomRightCornerElement.value;

				if (this.bottomLeftCornerElement.value > 0)
					bottomLeft = this.bottomLeftCornerElement.value;

				value = [topLeft, topRight, bottomRight, bottomLeft].join('px ');
			}
			return [value, 'px'].join('');
		},

		setData() {
			this.value = this.element.value;

			if (this.isObjectHasPath(this.element, ['data', 'radius_type']))
				this.radiusType = this.element.data.radius_type;

			/** Number Elements **/
			if (this.isObjectHasPath(this.element, ['data', 'all'])) {
				this.allCornerElement = {
					...this.cornerDefaultElement,
					...this.element.data.all
				};
				this.allCornerElement.name = [this.name, 'data', 'all'].join('.');
			}

			if (this.isObjectHasPath(this.element, ['data', 'part', 'top_left'])) {
				this.topLeftCornerElement = {
					...this.cornerDefaultElement,
					...this.element.data.part.top_left
				};
				this.topLeftCornerElement.name = [this.name, 'data', 'part', 'top_left'].join('.');
			}

			if (this.isObjectHasPath(this.element, ['data', 'part', 'top_right'])) {
				this.topRightCornerElement = {
					...this.cornerDefaultElement,
					...this.element.data.part.top_right
				};
				this.topRightCornerElement.name = [this.name, 'data', 'part', 'top_right'].join('.');
			}

			if (this.isObjectHasPath(this.element, ['data', 'part', 'bottom_right'])) {
				this.bottomRightCornerElement = {
					...this.cornerDefaultElement,
					...this.element.data.part.bottom_right
				};
				this.bottomRightCornerElement.name = [this.name, 'data', 'part', 'bottom_right'].join('.');
			}

			if (this.isObjectHasPath(this.element, ['data', 'part', 'bottom_left'])) {
				this.bottomLeftCornerElement = {
					...this.cornerDefaultElement,
					...this.element.data.part.bottom_left
				};
				this.bottomLeftCornerElement.name = [this.name, 'data', 'part', 'bottom_left'].join('.');
			}
			/** Number Elements | End **/
		},
		updateRadiusType(type) {
			this.radiusType = type;
			this.element.data.radius_type = type;
			if (type === 'all') {
				this.allCornerElementUpdate()
			} else {
				this.updateAll();
			}
		},

		allCornerElementUpdate() {
			this.element.value = this.generateValue();
			this.element.data.all.value = this.allCornerElement.value;
		},

		topLeftCornerElementUpdate() {
			this.element.value = this.generateValue();
			this.element.data.part.top_left.value = this.topLeftCornerElement.value;
		},

		topRightCornerElementUpdate() {
			this.element.value = this.generateValue();
			this.element.data.part.top_right.value = this.topRightCornerElement.value;
		},

		bottomRightCornerElementUpdate() {
			this.element.value = this.generateValue();
			this.element.data.part.bottom_right.value = this.bottomRightCornerElement.value;
		},

		bottomLeftCornerElementUpdate() {
			this.element.value = this.generateValue();
			this.element.data.part.bottom_left.value = this.bottomLeftCornerElement.value;
		},

		updateAll() {
			this.element.value = this.generateValue();
			this.element.data.part.top_left.value = this.topLeftCornerElement.value;
			this.element.data.part.top_right.value = this.topRightCornerElement.value;
			this.element.data.part.top_left.value = this.topLeftCornerElement.value;
			this.element.data.part.bottom_right.value = this.bottomRightCornerElement.value;
		}
	},

	template: `
                <div class="ccb-b-radius-wrapper">
                    <div class="ccb-b-radius-tab">
                        <span class="ccb-b-radius-tab-type" @click="updateRadiusType('all')" :class="{'ccb-b-active': this.radiusType === 'all'}">
                            <i class="ccb-icon-Path-3440---Outline"></i>
                        </span>
                        <span class="ccb-b-radius-tab-type" @click="updateRadiusType('part')" :class="{'ccb-b-active': this.radiusType === 'part'}">
                            <i class="ccb-icon-Subtraction-8"></i>
                        </span>
                    </div>
                    <div class="ccb-b-radius-content">
                        <template v-if="radiusType === 'all'">
                            <div style="width: 100%">
                                <number-field :element="allCornerElement" :name="allCornerElement.name" :key="allCornerElement.name"></number-field>
                            </div>
                        </template>
                        <template v-if="radiusType === 'part'">
                            <number-field :element="topLeftCornerElement" :name="topLeftCornerElement.name" :key="topLeftCornerElement.name"></number-field>
                            <number-field :element="topRightCornerElement" :name="topRightCornerElement.name" :key="topLeftCornerElement.name"></number-field>
                            <number-field :element="bottomLeftCornerElement" :name="bottomLeftCornerElement.name" :key="topLeftCornerElement.name"></number-field>
                            <number-field :element="bottomRightCornerElement" :name="bottomRightCornerElement.name" :key="topLeftCornerElement.name"></number-field>
                        </template>
                    </div>
                </div>
    `,
}