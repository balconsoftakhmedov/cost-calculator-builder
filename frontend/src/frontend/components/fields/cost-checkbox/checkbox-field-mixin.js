import fieldsMixin from "../fieldsMixin";
export default {
    mixins: [fieldsMixin],
    props: {
        field: [Object],
        value: {
            default: null,
        },
    },
    data: () => ({
        temp: [],
        radioLabel: '',
        checkboxField: {},
        checkboxValue: [],
        checkboxLabel: null,
    }),

    created() {
        this.checkboxField = this.field;
        this.checkboxLabel = 'option_' + this.randomID();
    },

    watch: {
        value(val) {
            if (Number(this.checkboxField.checkedLength) && val.length > this.checkboxField.checkedLength ) {
                val.shift();
            }

            if (typeof val === 'string' && val.toString().indexOf('_') === -1) {
                this.temp
                    .forEach(element => {
                        const chValue = val + '_' + element.id;
                        const found = this.checkboxValue.find(e => e.temp === chValue)
                        if (chValue === element.value && typeof found === "undefined") {
                            jQuery('#' + this.checkboxField.alias).find('input').each((e, i) => i.checked = i.value === chValue);
                            this.checkboxValue.push({value: +val, label: element.label, temp: chValue});
                        }
                    });
            } else {
                this.checkboxValue = val;
            }
            this.change({}, {}, false);
        },
    },

    computed: {
        boxStyle() {
            const settings = this.$store.getters.getSettings
            if ( !!+this.getProStatus === true && settings.general && settings.general.styles && settings.general.styles.checkbox ) {
                let styles = this.checkboxField.styles
                if (this.checkboxField.alias !== settings.general.styles.checkbox && typeof this.$store.getters.getCalcStore[settings.general.styles.checkbox] !== "undefined") {
                    styles = this.$store.getters.getCalcStore[settings.general.styles.checkbox].styles
                }
                if (styles) {
                    return styles.box_style === 'vertical' ? 'calc-is-vertical' : ''
                }
            } else if (!!+this.getProStatus === true && this.checkboxField.styles) {
                return this.checkboxField.styles.box_style === 'vertical' ? 'calc-is-vertical' : ''
            }

            return ''
        },

        getOptions() {
            let result = [];
            if (this.checkboxField.options) {
                result = Array.from(this.checkboxField.options)
                    .map((element, index) => {
                        let checkElementType = false;
                        if (Array.isArray(this.checkboxValue))
                            checkElementType = this.checkboxValue.some(checkedEl => checkedEl.temp == element.optionValue + '_' + index);

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

    methods: {
        change(event, label, def = true) {
            const vm = this;

            if (!Array.isArray(this.checkboxValue)) {
                vm.checkboxValue = [];
            }

            if (def && event.target.checked) {
                vm.checkboxValue.push({value: parseFloat(event.target.value), label, temp: event.target.value});
            } else if (def) {
                if (vm.checkboxValue.length === 1)
                    vm.checkboxValue = [];
                else
                    vm.checkboxValue = vm.checkboxValue.filter(e => e.temp !== event.target.value);
            }

            this.$emit('update', vm.checkboxValue, vm.checkboxField.alias)
        }
    }
}