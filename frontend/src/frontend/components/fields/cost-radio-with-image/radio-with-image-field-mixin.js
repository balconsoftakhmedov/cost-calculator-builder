import fieldsMixin from "../fieldsMixin";

export default {
    mixins: [ fieldsMixin ],
    props: {
        field: [ Object, String ],
        value: {
            default: null,
        },
        currencyFormat: {
            type: Function,
            default: () => {
            },
        },
    },

    data: () => ({
        radioField: {},
        radioLabel: '',
        selectedIdx: null,
    }),

    created() {
        this.radioField = this.field;
        this.radioLabel = this.randomID();
        this.radioValue = this.value;
        this.selectedIdx = this.radioValue ? +this.radioValue.split('_')[1] : null
    },

    methods: {
        selectedRadio(val, index) {
            if ( val && val.toString().indexOf('_') === -1 ) {
                Array.from(this.radioField.options).forEach((element, index) => {
                    if ( element.optionValue === val ) {
                        this.radioValue = val + '_' + index;
                        this.selectedIdx = index
                    }
                })
            } else {
                this.radioValue = val;
                this.selectedIdx = index
            }
        },
    },

    watch: {
        value(val) {
            this.selectedIdx = val === 0 ? null : this.selectedIdx
            if ( typeof val === "string" ) {
                this.selectedRadio(val, +val.split("_")[1])
            }
        },
    },

    computed: {
        boxStyle() {
            const settings = this.$store.getters.getSettings
            if ( !!+this.getProStatus === true && settings.general && settings.general.styles && settings.general.styles.radio_with_img ) {
                let styles = this.radioField.styles
                if (this.radioField.alias !== settings.general.styles.radio_with_img && typeof this.$store.getters.getCalcStore[settings.general.styles.radio_with_img] !== "undefined") {
                    styles = this.$store.getters.getCalcStore[settings.general.styles.radio_with_img].styles
                }
                if (styles) {
                    return styles.box_style === 'vertical' ? 'calc-is-vertical' : ''
                }
            } else if (!!+this.getProStatus === true && this.radioField.styles) {
                return this.radioField.styles.box_style === 'vertical' ? 'calc-is-vertical' : ''
            }

            return ''
        },

        getDefaultImg() {
            return this.$store.getters.getDefaultImg
        },

        radioValue: {
            get() {
                return this.value;
            },

            set(value) {
                if ( value === 0 ) {
                    this.$emit('update', 0, '')
                }

                if ( ! value ) {
                    return;
                }

                let [ , index ] = value.split('_');
                let option = null;

                this.getOptions
                    .forEach((element, key) => {
                        if ( ! option && element.value === value && index == key ) {
                            option = JSON.parse(JSON.stringify(element));
                        }
                    });

                const val = option ? value : '';
                const label = option ? option.label : '';

                this.$emit('update', val, label)
            }
        },

        getOptions() {
            let result = [];
            if ( this.radioField.options ) {
                result = Array.from(this.radioField.options).map((element, index) => ({
                    src: element.src,
                    icon: element.icon,
                    label: element.optionText,
                    value: `${ element.optionValue }_${ index }`,
                    converted: this.currencyFormat(this.radioField.allowRound ? Math.round(element.optionValue) : element.optionValue, { currency: true }, this.currencySettings),
                }))
            }
            return result;
        },
    },
}
