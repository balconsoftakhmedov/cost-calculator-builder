import VueColor from '@libs/vue/vue-color.min'

export default {
	components: {
		'sketch-picker': VueColor.Chrome
	},
	props: {
		element: {
			type: Object,
			default: {},
		},
		name: '',
	},

	data: () => ({
		defaultColor: '#fff',
		colors: {
			hex: '#000000',
		},
		displayPicker: false,
		showLabel: false,
		value: null,
	}),

	created() {
		this.value = this.element.value;
		this.setShowLabel();
		this.setColor(this.value)
	},

	methods: {
		setShowLabel() {
			if (this.element.hasOwnProperty('showLabel')) {
				this.showLabel = this.element.showLabel;
			}
		},

		setColor(color) {
			this.updateColors(color);
			this.value = color;
		},

		updateColors(color) {
			if (color.slice(0, 1) === '#') {
				this.colors = {hex: color};
			} else if (color.slice(0, 4) === 'rgba') {
				const rgba = color.replace(/^rgba?\(|\s+|\)$/g, '').split(',');
				const hex = '#' + ((1 << 24) + (parseInt(rgba[0]) << 16) + (parseInt(rgba[1]) << 8) + parseInt(rgba[2])).toString(16).slice(1);
				this.colors = {hex: hex, a: rgba[3]};
			}
		},

		showPicker() {
			document.addEventListener('click', this.documentClick);
			this.displayPicker = true;
		},

		hidePicker() {
			document.removeEventListener('click', this.documentClick);
			this.displayPicker = false;
		},

		togglePicker() {
			this.displayPicker ? this.hidePicker() : this.showPicker();
		},

		updateFromInput() {
			this.updateColors(this.value);
		},

		updateFromPicker(color) {
			this.colors = color;
			if (color.rgba.a === 1) {
				this.value = color.hex;
			} else {
				this.value = color.hex8;
			}
		},

		documentClick(e) {
			let el = this.$refs.colorpicker;
			let target = e.target;

			if ((el && el !== target && !el.contains(target)) || (target && target.classList.contains('sticky-cover')))
				this.hidePicker();

		},

		clear: function () {
			this.updateColors(this.defaultColor);
			this.value = "";
		},
	},
	watch: {
		value(value) {
			this.element.value = value;
			this.$emit('change');
		}
	},

	template: `
            <div class="ccb-color-box">
                <div class="ccb-color-picker" @click="showPicker">
                    <div class="color" @click="togglePicker" :style="{backgroundColor: value}"/>
                    <span class="color-value ccb-heading-5">{{ value }}</span>
                    <div class="sticky-popover" v-if="displayPicker">
                        <div class="sticky-cover" @click="togglePicker"></div>
                        <sketch-picker :value="colors" @input="updateFromPicker"></sketch-picker>
                    </div>
                </div>
            </div>
	`,
}