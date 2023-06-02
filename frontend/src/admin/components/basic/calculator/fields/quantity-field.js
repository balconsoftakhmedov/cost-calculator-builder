export default {
    props: {
        field: {
            type: Object,
            default: {},
        },

        id: {
            default: null,
        },

        order: {
            default: 0,
        },

        index: {
            default: null,
        },

        available: {
            default: [],
        }
    },

    data: () => ({
        errors: { unit: false },
        quantityField: {},
    }),

    mounted() {
        this.field = this.field.hasOwnProperty('_id') ? this.field : {};
        this.quantityField = { ...this.resetValue(), ...this.field };

        if (this.quantityField._id === null) {
            this.quantityField._id = this.order;
            this.quantityField.alias = this.quantityField.alias + this.quantityField._id;
        }

        this.quantityField.required  = this.quantityField.hasOwnProperty('required')
            ? JSON.parse(this.quantityField.required)
            : false;
    },

    computed: {
        getDescOptions() {
            return this.$store.getters.getDescOptions
        },
        translations () {
            return this.$store.getters.getTranslations;
        },
    },

    methods: {
        numberCounterAction( modelKey, action = '+' ){
            let input = document.querySelector('input[name='+modelKey+']');
            let step  = 1;

            if ( !this.quantityField.hasOwnProperty(modelKey) || input === null )
                return;

            if ( input.step.length !== 0 )
                step = input.step;

            let value = this.quantityField[modelKey];
            value = action === '-'
                ? parseFloat(value) - parseFloat(input.step)
                : parseFloat(value) + parseFloat(input.step);

            if ( input.min.length !== 0 && value < input.min)
                return;

            value = parseInt(step) === parseFloat(step)
                ? value.toFixed()
                : value.toFixed(2);

            this.quantityField[modelKey] = value;
        },

        close() {
            this.$emit('cancel');
        },

        save(quantityField, id, index) {
            let valid = true;

            if (!this.quantityField.unit) {
                this.errors.unit = this.translations.required_field;
                valid = false;
            }

            if (!this.quantityField.step) {
                this.errors.step = this.translations.required_field;
                valid = false;
            }

            if (!valid)
                return;
            this.$emit('save', quantityField, id, index)
        },

        resetValue() {
            return {
                unit: 1,
                label: '',
                _id:  null,
                default: '',
                description: '',
                placeholder: '',
                required: false,
                _event: 'keyup',
                type: 'Quantity',
                allowRound: false,
                additionalCss: '',
                additionalStyles: '',
                addToSummary: true,
                allowCurrency: false,
                enabled_currency_settings: false,
                _tag: 'cost-quantity',
                icon: 'ccb-icon-Subtraction-6',
                alias: 'quantity_field_id_',
                desc_option: 'after',
                step: 1,
            };
        },
    },
}
