const $ = require('jquery')
import fieldsMixin from "./fieldsMixin";
import {enableRipple} from '@syncfusion/ej2-base';

enableRipple(true);

export default {
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
		min: 0,
		step: 1,
		max: 100,
		leftVal: 0,
		rightVal: 0,
		rangeSlider: {},
		multiRange: null,
		multiRangeValue: 0,
		storedValues: null
	}),

	created() {
		this.multiRange = this.parseComponentData();
		if (this.multiRange.alias) {
			this.min = this.multiRange.minValue;
			this.max = this.multiRange.maxValue
			this.step = this.multiRange.step;

			if (this.multiRange.hidden !== true) {
				this.leftVal = this.initValue(this.multiRange.default_left, this.min);
				this.rightVal = this.initValue(this.multiRange.default_right, this.max, true);
			}
		}
	},

	mounted() {
		this.change();
	},

	computed: {
		additionalCss() {
		    return this.$store.getters.getCalcStore.hasOwnProperty(this.field.alias) && this.$store.getters.getCalcStore[this.field.alias].hidden === true
                ? 'display: none;'
                : '';
		},

		getStyles() {
			return {
				'--min': +this.min,
				'--max': +this.max,
				'--step': +this.step,
				'--value-a': this.leftVal,
				'--value-b': this.rightVal,
				'--text-value-a': `'${this.leftVal} '`,
				'--text-value-b': `'${this.rightVal} '`,
				'--suffix': `'${this.multiRange.sign || ''}'`,
				'--primary-color': this.getAccentColor
			}
		},
	},

	watch: {
		value(val) {
			if (val.hasOwnProperty('start') && val.hasOwnProperty('end') && (+val.start !== +this.leftVal || +val.end !== +this.rightVal)) {
				this.leftVal = this.initValue(val.start, this.min);
				this.rightVal = this.initValue(+val.end, this.max, true);
				this.rangeSlider.value = [this.leftVal, this.rightVal];
				this.change();
			}
			if (+val === 0) {
				this.leftVal = 0;
				this.rightVal = 0;
				this.rangeSlider.value = [this.leftVal, this.rightVal];
				this.change();
			}
		},

		leftVal(val) {
			if (+val > this.rightVal)
				this.leftVal = this.rightVal
		},

		rightVal(val) {
			if (+val < this.leftVal)
				this.rightVal = this.leftVal
		},
	},
	methods: {
		initValue(value, secondVal, isMax) {
			let defaultVal = value ? value : 0
			if (isMax)
				return defaultVal > secondVal ? secondVal : defaultVal
			return defaultVal < secondVal ? secondVal : defaultVal
		},

		change() {
			if ( !this.storedValues || +this.rightVal >= +this.leftVal ) {
				this.storedValues = {
					right: +this.rightVal,
					left: +this.leftVal,
				}
			}

			const value = {
				'value': +this.rightVal > +this.leftVal ? +this.rightVal - +this.leftVal : 0,
				'start': +this.rightVal > +this.leftVal ? +this.leftVal : this.storedValues.left,
				'end': +this.rightVal === +this.leftVal ? +this.leftVal : this.storedValues.right
			};

			this.$emit(this.multiRange._event, value, this.multiRange.alias);
			this.$emit('condition-apply', this.multiRange.alias)
		},
	}
}
