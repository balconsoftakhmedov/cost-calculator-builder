import defaultStyle from './styles/default'
import boxedStyle from './styles/box'
import boxedWithRadio from './styles/box-with-radio'
import fieldsMixin from "../fieldsMixin";

export default {
    mixins: [fieldsMixin],
    props: {
        field: [Object, String],
        value: {
            default: '',
        },
    },

    components: {
        'default-style': defaultStyle,
        'box-style': boxedStyle,
        'box-with-radio-style': boxedWithRadio,
    },

    data: () => ({
        radioField: {},
        updateChild: 0,
        radioValue: null,
    }),

    created() {
        this.radioField = this.parseComponentData();
    },

    methods: {
        updateValue(value, label) {
            this.$emit(this.radioField._event, value, this.radioField.alias, label)
            this.$emit('condition-apply', this.radioField.alias)
        }
    },

    computed: {
        additionalCss() {
            return this.$store.getters.getCalcStore.hasOwnProperty(this.radioField.alias) && this.$store.getters.getCalcStore[this.radioField.alias].hidden === true
                ? 'display: none;'
                : '';
        },

        getStyle() {
            const settings = this.$store.getters.getSettings

            if ( !!+this.getProStatus === true && settings.general && settings.general.styles && settings.general.styles.radio ) {
                let styles = this.radioField.styles
                if (this.radioField.alias !== settings.general.styles.radio && typeof this.$store.getters.getCalcStore[settings.general.styles.radio] !== "undefined") {
                    styles = this.$store.getters.getCalcStore[settings.general.styles.radio].styles
                }
                if (styles) {
                    return `${styles.style}-style`
                }
            } else if (!!+this.getProStatus === true && this.radioField.styles) {
                return `${this.radioField.styles.style}-style`
            }

            return `default-style`
        }
    },
}
