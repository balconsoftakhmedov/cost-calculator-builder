export default {
	props: {
		element: {
			type: Object,
			default: {},
		},
		name: '',
	},

	data: () => ({
		fieldIcon: false,
		prefix: null,
		max: 100,
		min: 1,
		showLabel: false,
		step: 1,
		value: null,
	}),

	computed: {
		countStepDecimal() {
			const stepStr = String(this.element.data.step);
			if (stepStr.includes('.'))
				return stepStr.split('.')[1].length;
			return 0;
		},

		getClasses() {
			return {
				'ccb-no-indent': (this.prefix || this.fieldIcon),
				'ccb-long': (this.prefix && this.prefix === 'Radius'),
				'ccb-short': (this.prefix && ['X', 'Y'].includes(this.prefix)),
				'ccb-is-blur': (this.prefix && this.prefix === 'Blur'),
			}
		}
	},

	mounted() {
		this.setData();
	},

	methods: {
		setData() {
			this.value = parseInt(this.element.value);

			if (this.isObjectHasPath(this.element, ['data', 'step']))
				this.step = this.element.data.step;

			if (this.isObjectHasPath(this.element, ['data', 'min']))
				this.min = this.element.data.min;

			if (this.isObjectHasPath(this.element, ['data', 'max']))
				this.max = this.element.data.max;

			if (this.element.hasOwnProperty('additional')) {
				const {icon, prefix} = this.element.additional
				this.fieldIcon = icon || false
				this.prefix = prefix || null
			}

			if (this.element.hasOwnProperty('showLabel'))
				this.showLabel = this.element.showLabel;

		},

		numberCounterAction(action = '+') {
			let input = document.querySelector(`input[name="${this.name}"]`);
			let step = 1;
			let value = this.value;

			if (input.step.length !== 0)
				step = input.step;

			value = action === '-'
				? parseFloat(value) - parseFloat(input.step)
				: parseFloat(value) + parseFloat(input.step);

			if (input.min.length !== 0 && value < input.min)
				return;

			if (input.max.length && value > input.max)
				return;

			value = this.countStepDecimal > 0
				? value.toFixed(this.countStepDecimal)
				: value.toFixed();

			this.value = value;
		}
	},

	watch: {
		value: function () {
			this.element.value = this.value;
			this.$emit('change');
		}
	},

	template: `
            <div class="ccb-input-wrapper number">
                <div class="ccb-input-box" :class="getClasses">
                    <span v-if="prefix" class="ccb-prefix">{{ prefix }}</span>
                    <i v-if="fieldIcon" :class="['ccb-prefix', 'ccb-number-icon', fieldIcon]"></i>
                    <input type="number" :class="['ccb-heading-5', 'ccb-light']" :name="name" v-model="value" :step="this.step" :min="this.min" :max="this.max">
                    <span @click="numberCounterAction()" class="input-number-counter up"></span>
                    <span @click="numberCounterAction('-')" class="input-number-counter down"></span>
                </div>
            </div>
    `,
}