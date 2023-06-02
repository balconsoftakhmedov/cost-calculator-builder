import defaultStyle from './styles/default'
import boxedStyle from './styles/box'
import boxedWithCheckbox from './styles/box-with-checkbox'
import boxedWithDescription from './styles/box-with-checkbox-and-description'
import boxedWithCheckboxAndDescription from './styles/box-with-heading-checkbox-and-description'
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
        'box-with-checkbox-style': boxedWithCheckbox,
        'box-with-checkbox-and-description-style': boxedWithDescription,
        'box-with-heading-checkbox-and-description-style': boxedWithCheckboxAndDescription,
    },

    data: () => ({
        checkboxField: {},
    }),

    created() {
        this.checkboxField = this.parseComponentData();
        this.$emit('condition-apply', this.checkboxField.alias)
    },

    methods: {
        updateValue(value, alias) {
            this.$emit(this.checkboxField._event, value, alias);
            this.$emit('condition-apply', alias)
        },
    },

    computed: {
        additionalCss() {
            return this.$store.getters.getCalcStore.hasOwnProperty(this.field.alias) && this.$store.getters.getCalcStore[this.field.alias].hidden === true
                ? 'display: none;'
                : '';
        },

        getStyle() {
            const settings = this.$store.getters.getSettings
            if ( !!+this.getProStatus === true && settings.general && settings.general.styles && settings.general.styles.checkbox ) {
                let styles = this.checkboxField.styles
                if (this.checkboxField.alias !== settings.general.styles.checkbox && typeof this.$store.getters.getCalcStore[settings.general.styles.checkbox] !== "undefined") {
                    styles = this.$store.getters.getCalcStore[settings.general.styles.checkbox].styles
                }
                if (styles) {
                    return `${styles.style}-style`
                }
            } else if (!!+this.getProStatus === true && this.checkboxField.styles) {
                return `${this.checkboxField.styles.style}-style`
            }

            return `default-style`
        }
    },
}
