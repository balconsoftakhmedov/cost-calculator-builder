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
        dropField: {},
        errors: {},
        tab: 'main',
        errorsCount: 0,
    }),

    computed: {
        getDescOptions() {
            return this.$store.getters.getDescOptions
        },
    },

    mounted() {
        this.field = this.field.hasOwnProperty('_id') ? this.field : {};
        this.dropField = {...this.resetValue(), ...this.field};
        if (this.dropField._id === null) {
            this.dropField._id       = this.order;
            this.dropField.alias     = this.dropField.alias + this.dropField._id;
        }

        this.dropField.required  = this.dropField.hasOwnProperty('required') ? JSON.parse(this.dropField.required) : false
        if (!this.dropField.default)  this.dropField.default = '';
    },

    methods: {
        numberCounterActionForOption( optionIndex, action = '+' ){
            let input = document.querySelector('input[name=option_'+optionIndex+']');
            let step  = 1;
            let value = 0;

            if (!this.dropField.options.hasOwnProperty(optionIndex) || input === null)
                return;

            if (input.step.length !== 0)
                step = input.step;


            if (this.dropField.options[optionIndex].optionValue.length > 0)
                value = this.dropField.options[optionIndex].optionValue;

            value = action === '-'
                ? parseFloat(value) - parseFloat(input.step)
                : parseFloat(value) + parseFloat(input.step);

            if (input.min.length !== 0 && value < input.min)
                return;

            value = parseInt(step) === parseFloat(step)
                ? value.toFixed()
                : value.toFixed(2)

            this.removeErrorTip('errorOptionValue' + optionIndex);
            this.dropField.options[optionIndex].optionValue = value;
        },

        resetValue() {
            return {
                label: '',
                _id: null,
                default: '',
                description: '',
                required: false,
                _event: 'change',
                type: 'Drop Down',
                allowRound: false,
                additionalCss: '',
                additionalStyles: '',
                allowCurrency: false,
                addToSummary: true,
                _tag: 'cost-drop-down',
                icon: 'ccb-icon-Path-3514',
                alias: 'dropDown_field_id_',
                desc_option: 'after',
                summary_view: 'show_value',
                options: [
                    {
                        optionText: '',
                        optionValue: '',
                    },
                ],
            };
        },

        save(dropField, id, index) {
            this.validate(dropField);
            if (Object.keys(this.errors).length > 0)
                return;
            this.$emit('save', dropField, id, index)
        },

        validate(dropField) {
            delete this.errors.dropField;
            this.errorsCount = 0;
            if (dropField.options) {
                Array.from(this.dropField.options).map((element, index) => {
                    document.getElementById('errorOptionValue' + index).innerHTML = "";
                    if (element.optionValue.length === 0) {
                        this.errorsCount++;
                        this.errors.dropField = true;
                        this.$store.commit('setEditFieldError', true)
                        document.getElementById('errorOptionValue' + index).innerHTML = `<span class="ccb-error-tip default">this is required field</span>`;
                    }
                })
            }
        },

        checkRequired(alias) {
            this.removeErrorTip(alias);
            this.errorsCount--;
        },

        changeDefault(event, val, index) {
            const vm = this;
            let [,indexValue] = vm.dropField.default.split('_');
            if (+indexValue === +index) vm.dropField.default = val + '_' + index;
        },

        removeErrorTip(index) {
            const errorClass = document.getElementById(index)
            while(errorClass.firstChild) errorClass.removeChild(errorClass.firstChild)
        },

        removeOption(index, optionValue) {
            if (this.dropField.default === optionValue + '_' + index)
                this.dropField.default = '';
            this.dropField.options.splice(index, 1)
        },

        addOption: function () {
            this.dropField.options.push({optionText: '', optionValue: '',});
        },
    },

    destroyed() {
        this.$store.commit('setEditFieldError', false)
    },

    watch: {
        '$store.getters.getEditFieldError': function (value) {
            if ( value === 'save_field' ) {
                this.save(this.dropField, this.id, this.index)
            }
        }
    }
}