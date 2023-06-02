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
    },

    data: () => ({
        errorsCount: 0,
        errors: {
            minValue: false,
            maxValue: false,
            step: false,
            unit: false,
        },
        rangeField: {},
        tab: 'main',
    }),
    computed: {
        getDescOptions() {
            return this.$store.getters.getDescOptions
        },
        translations () {
            return this.$store.getters.getTranslations;
        },
    },

    mounted() {
        this.field = this.field.hasOwnProperty('_id') ? this.field : {};
        this.rangeField = { ...this.resetValue(), ...this.field };
        if (this.rangeField._id === null) {
            this.rangeField._id = this.order;
            this.rangeField.alias = this.rangeField.alias + this.rangeField._id;
        }
    },

    methods: {
        numberCounterAction( modelKey, action = '+' ){
            const input = document.querySelector('input[name='+modelKey+']');
            let step  = 1;
            let value = this.rangeField[modelKey];

            if (!this.rangeField.hasOwnProperty(modelKey) || input === null)
                return;

            if (input.step.length !== 0)
                step = input.step;

            value = action === '-'
                ? parseFloat(value) - parseFloat(input.step)
                : parseFloat(value) + parseFloat(input.step)

            if (input.min.length !== 0 && value < input.min)
                return;

            value = parseInt(step) === parseFloat(step)
                ? value.toFixed()
                : value.toFixed(2);

            this.rangeField[modelKey] = value;
        },

        save(rangeField, id, index) {
            this.errorsCount = 0;
            if (this.rangeField.minValue.toString().length === 0) {
                this.errorsCount++;
                this.errors.minValue = this.translations.required_field;
            }

            if (this.rangeField.maxValue.toString().length === 0) {
                this.errorsCount++;
                this.errors.maxValue = this.translations.required_field;
            }

            if (this.rangeField.step.toString().length === 0) {
                this.errorsCount++;
                this.errors.step = this.translations.required_field;
            }

            if (this.rangeField.unit.toString().length === 0) {
                this.errorsCount++;
                this.errors.unit = this.translations.required_field;
            }

            if (Object.values(this.errors).every(item => item === false) && this.errorsCount === 0)
                this.$emit('save', rangeField, id, index);
        },

        resetValue: function () {
            return {
                step: 1,
                unit: 1,
                sign: '',
                label: '',
                _id:  null,
                default: '',
                minValue: 0,
                maxValue: 100,
                description: '',
                _event: 'change',
                additionalCss: '',
                allowRound: false,
                _tag: 'cost-range',
                additionalStyles: '',
                addToSummary: true,
                allowCurrency: false,
                type: 'Range Button',
                icon: 'ccb-icon-Union-5',
                alias: 'range_field_id_',
                desc_option: 'after',
            }
        },
    },
}
