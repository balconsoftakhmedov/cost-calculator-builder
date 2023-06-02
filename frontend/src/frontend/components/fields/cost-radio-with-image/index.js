import fieldsMixin from "../fieldsMixin";
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
        radioField: {},
    }),

    created() {
        this.radioField = this.parseComponentData();
    },

    computed: {
        additionalCss() {
            return this.$store.getters.getCalcStore.hasOwnProperty(this.radioField.alias) && this.$store.getters.getCalcStore[this.radioField.alias].hidden === true
                ? 'display: none;'
                : '';
        },

        getStyle() {
            const settings = this.$store.getters.getSettings
            if ( !!+this.getProStatus === true && settings.general && settings.general.styles && settings.general.styles.radio_with_img ) {
                let styles = this.radioField.styles
                if (this.radioField.alias !== settings.general.styles.radio_with_img && typeof this.$store.getters.getCalcStore[settings.general.styles.radio_with_img] !== "undefined") {
                    styles = this.$store.getters.getCalcStore[settings.general.styles.radio_with_img].styles
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

    methods: {
        updateValue(value, label) {
            this.$emit(this.radioField._event, value, this.radioField.alias, label);
            this.$emit('condition-apply', this.radioField.alias);
        }
    }
}
