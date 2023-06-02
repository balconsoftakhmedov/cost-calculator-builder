const $ = require('jquery');
import fieldsMixin from "../fieldsMixin";

export default {
    mixins: [fieldsMixin],
    props: {
        field: [Object, String],
        value: {
            default: null,
        },
    },

    data: () => ({
        temp: [],
        radioLabel: '',
        toggleField: {},
        toggleValue: [],
    }),

    created() {
        this.toggleField = this.field;
        this.toggleLabel = 'toggle_' + this.randomID();
    },

    computed: {
        boxStyle() {
            const settings = this.$store.getters.getSettings
            if ( !!+this.getProStatus === true && settings.general && settings.general.styles && settings.general.styles.toggle ) {
                let styles = this.toggleField.styles
                if (this.toggleField.alias !== settings.general.styles.toggle && typeof this.$store.getters.getCalcStore[settings.general.styles.toggle] !== "undefined") {
                    styles = this.$store.getters.getCalcStore[settings.general.styles.toggle].styles
                }
                if (styles) {
                    return styles.box_style === 'vertical' ? 'calc-is-vertical' : ''
                }
            } else if (!!+this.getProStatus === true && this.toggleField.styles) {
                return this.toggleField.styles.box_style === 'vertical' ? 'calc-is-vertical' : ''
            }

            return ''
        },

        getOptions() {
            let result = [];
            if (this.toggleField.options) {

                result = Array.from(this.toggleField.options).map((element, index) => {
                    let checkElementType = false;
                    if (Array.isArray(this.toggleValue)) {
                        checkElementType = this.toggleValue.some(checkedEl => checkedEl.temp == element.optionValue + '_' + index);
                    }

                    return {
                        id: index,
                        label: element.optionText,
                        value: `${element.optionValue}_${index}`,
                        hint: element.optionHint ?? '',
                        isChecked: checkElementType,
                    }
                })
            }
            this.temp = Object.assign([], this.temp, result);
            return result;
        },
    },

    watch: {
        value(val) {
            if (this.toggleField.checkedLength && val.length > this.toggleField.checkedLength ) {
                val.shift();
            }

            if (typeof val === 'string' && val.toString().indexOf('_') === -1) {
                this.temp.forEach(element => {

                    const chValue = val + '_' + element.id;
                    const found = this.toggleValue.find(e => e.temp === chValue)

                    if (chValue === element.value && typeof found === "undefined") {
                        $('#' + this.toggleField.alias).find('input').each((e, i) => {
                            i.checked = i.value === chValue
                        });
                        this.toggleValue.push({value: +val, label: element.label, temp: chValue});
                    }
                });
            } else {
                this.toggleValue = val;
            }
            this.change({}, {}, false);
        }
    },

    methods: {
        change(event, label, def = true) {
            const vm = this;

            if (!Array.isArray(this.toggleValue)) {
                vm.toggleValue = [];
            }

            if (def && event.target.checked) {
                vm.toggleValue.push({value: parseFloat(event.target.value), temp: event.target.value, label});
            } else if (def) {
                if (vm.toggleValue.length === 1)
                    vm.toggleValue = [];
                else
                    vm.toggleValue = vm.toggleValue.filter(e => e.temp !== event.target.value);
            }
            this.$emit('update', vm.toggleValue, vm.toggleField.alias)
        },

        toggle(selector, label) {
            const element = document.querySelector('#' + selector);
            if (element) {
                element.checked = !element.checked;

                this.change({target: element}, label);
            }
        },

        toggleTrigger(index) {
            if (this.$refs[this.toggleLabel] && this.$refs[this.toggleLabel].length > 0) {
                this.$refs[this.toggleLabel][index].click()
            }
        }
    },
}
