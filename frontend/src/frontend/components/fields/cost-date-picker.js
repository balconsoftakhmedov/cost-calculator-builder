import customDateCalendarField from "./cost-custom-date-calendar"
import fieldsMixin from "./fieldsMixin";

export default  {
    mixins: [fieldsMixin],
    props: {
        field: [Object, String],
    },
    components: {
        customDateCalendarField,
    },
    data: () => ({
        dateField: {},
    }),

    created() {
        this.dateField       = this.parseComponentData();
        this.dateField.range = parseInt(this.dateField.range)
    },
    computed: {
        additionalCss() {
            return this.$store.getters.getCalcStore.hasOwnProperty(this.dateField.alias) && this.$store.getters.getCalcStore[this.dateField.alias].hidden === true
                ? 'display: none;'
                : '';
        },

        translations () {
            return this.$store.getters.getTranslations;
        },
    },
    methods: {
       /** set datePicker field data **/
       setDatetimeField( dateValue ) {
           if (typeof dateValue !== "undefined") {

               this.$emit(this.dateField._event, dateValue, this.dateField.alias, this.dateField.label);
               this.$emit('condition-apply', this.dateField.alias);
           }
       },
   }
}