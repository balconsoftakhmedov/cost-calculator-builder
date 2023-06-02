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
        radioField: {},
        radioLabel: '',
    }),

    created() {
        this.radioField = this.field
        this.radioLabel = this.randomID();
        this.radioValue = this.value;
    },

    watch: {
        value(val) {
            if (val && val.toString().indexOf('_') === -1) {
                Array.from(this.radioField.options).forEach((element, index) => {
                    if (element.optionValue === val) {
                        this.radioValue = val + '_' + index;
                    }
                })
            } else {
                this.radioValue = val;
            }
        },
    },

    computed: {
        boxStyle() {
            const settings = this.$store.getters.getSettings
            if ( !!+this.getProStatus === true && settings.general && settings.general.styles && settings.general.styles.radio ) {
                let styles = this.radioField.styles
                if (this.radioField.alias !== settings.general.styles.radio && typeof this.$store.getters.getCalcStore[settings.general.styles.radio] !== "undefined") {
                    styles = this.$store.getters.getCalcStore[settings.general.styles.radio].styles
                }
                if (styles) {
                    return styles.box_style === 'vertical' ? 'calc-is-vertical' : ''
                }
            } else if (!!+this.getProStatus === true && this.radioField.styles) {
                return this.radioField.styles.box_style === 'vertical' ? 'calc-is-vertical' : ''
            }

            return ''
        },

        radioValue: {
            get() {
                return this.value;
            },

            set(value) {
                if (value === 0) {
                    this.$emit('update', 0, '')
                }

                if (!value) {
                    return;
                }

                let [, index] = value.split('_');
                let option = null;

                this.getOptions
                    .forEach((element, key) => {
                        if (!option && element.value === value && index == key) {
                            option = JSON.parse(JSON.stringify(element));
                        }
                    });

                const val = option ? value : '';
                const label = option ? option.label : '';

                this.$emit('update', val, label )
            }
        },

        getOptions() {
            let result = [];
            if (this.radioField.options) {
                result = Array.from(this.radioField.options).map((element, index) => {
                    return {
                        label: element.optionText,
                        value: `${element.optionValue}_${index}`,
                    }
                })
            }

            return result;
        },
    },
}
