import fieldsMixin from "../fieldsMixin";
import defaultStyle from './styles/default'
import boxedWithToggleAndDescription from './styles/box-with-toggle-and-description'
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
        'box-with-toggle-and-description-style': boxedWithToggleAndDescription,
    },

    data: () => ({
        toggleField: {},
    }),

    created() {
        this.toggleField = this.parseComponentData();
        this.$emit('condition-apply', this.toggleField.alias)
    },

    methods: {
        updateValue(value, alias) {
            this.$emit(this.toggleField._event, value, alias);
            this.$emit('condition-apply', alias)
        }
    },

    computed: {
        getStyle() {
            const settings = this.$store.getters.getSettings
            if ( !!+this.getProStatus === true && settings.general && settings.general.styles && settings.general.styles.toggle ) {
                let styles = this.toggleField.styles
                if (this.toggleField.alias !== settings.general.styles.toggle && typeof this.$store.getters.getCalcStore[settings.general.styles.toggle] !== "undefined") {
                    styles = this.$store.getters.getCalcStore[settings.general.styles.toggle].styles
                }
                if (styles) {
                    return `${styles.style}-style`
                }
            } else if (!!+this.getProStatus === true && this.toggleField.styles) {
                return `${this.toggleField.styles.style}-style`
            }

            return `default-style`
        },

        additionalCss() {
            return this.$store.getters.getCalcStore.hasOwnProperty(this.toggleField.alias) && this.$store.getters.getCalcStore[this.toggleField.alias].hidden === true
                ? 'display: none;'
                : '';
        },
    }
}
