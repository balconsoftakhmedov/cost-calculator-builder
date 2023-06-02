import fieldsMixin from "../fieldsMixin"
import defaultStyle from './styles/default'
import withIcon from './styles/with-icon'

export default {
    mixins: [ fieldsMixin ],
    props: {
        field: [ Object, String ],
        value: {
            default: '',
        },
        currencyFormat: {
            type: Function,
            default: () => {
            },
        },
    },

    components: {
        'default-style': defaultStyle,
        'with-icon-style': withIcon,
    },

    data: () => ({
        checkboxField: {},
    }),

    created() {
        this.checkboxField = this.parseComponentData();
        this.$emit('condition-apply', this.checkboxField.alias)
    },

    computed: {
        additionalCss() {
            return this.$store.getters.getCalcStore.hasOwnProperty(this.field.alias) && this.$store.getters.getCalcStore[this.field.alias].hidden === true
                ? 'display: none;'
                : '';
        },

        getStyle() {
            const settings = this.$store.getters.getSettings
            if ( !!+this.getProStatus === true && settings.general && settings.general.styles && settings.general.styles.checkbox_with_img ) {
                let styles = this.checkboxField.styles
                if (this.checkboxField.alias !== settings.general.styles.checkbox_with_img && typeof this.$store.getters.getCalcStore[settings.general.styles.checkbox_with_img] !== "undefined") {
                    styles = this.$store.getters.getCalcStore[settings.general.styles.checkbox_with_img].styles
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

    methods: {
        updateValue(value, alias) {
            this.$emit(this.checkboxField._event, value, alias );
            this.$emit('condition-apply', alias)
        },
    }
}
