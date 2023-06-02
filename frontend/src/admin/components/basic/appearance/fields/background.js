import color from './color'

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
	},

	data: () => ({
		backgroundType: 'solid',
		gradientTypeFromElement: {},
		gradientTypeToElement: {},
		solidTypeElement: {},
		value: null,
	}),

	created() {
		this.setData();
	},

	methods: {
		getBackgroundType() {
			if (this.isObjectHasPath(this.element, ['data', 'bg_type'])) {
				return this.element.data.bg_type;
			}
			return 'solid';
		},

		getGradientValue() {
			return 'linear-gradient(to right, ' + this.gradientTypeFromElement.value + ', ' + this.gradientTypeToElement.value + ')';
		},

		setData() {
			this.value = this.element.value;
			this.backgroundType = this.getBackgroundType();

			if (this.isObjectHasPath(this.element, ['data', 'solid'])) {
				this.solidTypeElement = this.element.data.solid;

				this.solidTypeElement.showLabel = false;
				this.solidTypeElement.name = [this.name, 'data', 'solid'].join('.');
			}

			if (this.isObjectHasPath(this.element, ['data', 'gradient'])) {

				this.gradientTypeFromElement = this.element.data.gradient[0];
				this.gradientTypeFromElement.name = [this.name, 'data', 'gradient', 'from'].join('.');

				this.gradientTypeToElement = this.element.data.gradient[1];
				this.gradientTypeToElement.name = [this.name, 'data', 'gradient', 'to'].join('.');
			}
		},

		updateBgType() {
			let value = this.solidTypeElement.value;
			this.element.data.bg_type = this.backgroundType;
			if ('gradient' === this.backgroundType)
				value = this.getGradientValue();
			this.element.value = value;
		},
	},
	watch: {
		'solidTypeElement.value': function () {
			this.element.value = this.solidTypeElement.value;
			this.element.data.solid.value = this.solidTypeElement.value;
			this.$emit('change');
		},
		'gradientTypeFromElement.value': function (value) {
			this.element.data.gradient[0].value = this.gradientTypeFromElement.value;
			this.element.data.gradient[1].value = this.gradientTypeToElement.value;

			if ('gradient' === this.backgroundType)
				this.element.value = this.getGradientValue();
			this.$emit('change');
		},
		'gradientTypeToElement.value': function () {
			this.element.data.gradient[0].value = this.gradientTypeFromElement.value;
			this.element.data.gradient[1].value = this.gradientTypeToElement.value;

			if ('gradient' === this.backgroundType)
				this.element.value = this.getGradientValue();
			this.$emit('change');
		}
	},
	template: `
                <div class="ccb-background-field">
                     <div class="ccb-select-box">
                        <div class="ccb-select-wrapper">
                            <i class="ccb-icon-Path-3485 ccb-select-arrow"></i>
                            <select class="ccb-select" v-model="backgroundType" @change="updateBgType" :name="'select-' + name" style="border: none;">
                                <option v-for="(bgType, bgName) in element.data.bg_types" :key="bgName" :value="bgName">
                                    {{ bgType }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <template v-if="backgroundType === 'solid'">
                        <div style="width: 66.66%;">
                            <color-field :element="solidTypeElement" :name="solidTypeElement.name"></color-field>
                        </div>
                    </template>
                    <template v-if="backgroundType === 'gradient'">
                        <color-field :element="gradientTypeFromElement" :name="gradientTypeFromElement.name"></color-field>
                        <color-field :element="gradientTypeToElement" :name="gradientTypeToElement.name"></color-field>
                    </template>
                </div>
   
    `,
}