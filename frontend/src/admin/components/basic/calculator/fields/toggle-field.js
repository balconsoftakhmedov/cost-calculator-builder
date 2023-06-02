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
        toggleField: {},
        errors: {},
        tab: 'main',
        errorsCount: 0,
    }),

    computed: {
        getDescOptions() {
            return this.$store.getters.getDescOptions
        },

        getToggleStyles() {
            return [
                {
                    label: 'Default',
                    value: 'default',
                    img: `${window.ajax_window.plugin_url}/frontend/dist/img/styles/toggle/default.png`,
                },
                {
                    label: 'Box with toggle and description',
                    value: 'box-with-toggle-and-description',
                    img: `${window.ajax_window.plugin_url}/frontend/dist/img/styles/toggle/style_1.png`,
                }
            ]
        },

        getCurrentImage() {
            if (this.toggleField.styles) {
                const current = this.getToggleStyles.find(s => s.value === this.toggleField.styles.style)
                if ( current ) {
                    return current.img
                }
            }

            return `${window.ajax_window.plugin_url}/frontend/dist/img/styles/toggle/default.png`
        },

        settings: {
            get() {
                return this.$store.getters.getSettings
            },

            set(value) {
                this.$store.commit('updateSettings', value)
            }
        },
    },

    mounted() {
        this.field = this.field.hasOwnProperty('_id') ? this.field : {};
        this.toggleField = { ...this.resetValue(), ...this.field };
        if (this.toggleField._id === null) {
            this.toggleField._id = this.order;
            this.toggleField.alias = this.toggleField.alias + this.toggleField._id;
        }
        this.toggleField.required  = this.toggleField.hasOwnProperty('required') ? JSON.parse(this.toggleField.required) : false

        this.toggleField.apply_style_for_all = false
        setTimeout(() => {
            if ( this.settings.general.styles && this.settings.general.styles.toggle ) {
                this.toggleField.apply_style_for_all = true
                if (this.toggleField.styles) {
                    const fields = this.$store.getters.getBuilder
                    const field = fields.find(f => f.alias === this.settings.general.styles.toggle )
                    if (field) {
                        this.toggleField.styles = JSON.parse(JSON.stringify(field.styles))
                    }
                }
            }
        })
    },

    methods: {
        addOption: function () {
            this.toggleField.options.push({optionText: '', optionValue: '', optionHint: ''});
        },

        numberCounterActionForOption( optionIndex, action = '+' ){
            let input = document.querySelector('input[name=option_'+optionIndex+']');
            let step  = 1;
            let value = 0;

            if (!this.toggleField.options.hasOwnProperty(optionIndex) || input === null)
                return;

            if (input.step.length !== 0 )
                step = input.step;

            if (this.toggleField.options[optionIndex].optionValue.length > 0)
                value = this.toggleField.options[optionIndex].optionValue;

            value = action === '-'
                ? parseFloat(value) - parseFloat(input.step)
                : parseFloat(value) + parseFloat(input.step)

            if (input.min.length !== 0 && value < input.min)
                return;

            value = parseInt(step) === parseFloat(step)
                ? value.toFixed()
                : value.toFixed(2);

            this.removeErrorTip('errorOptionValue' + optionIndex);
            this.toggleField.options[optionIndex].optionValue = value;
        },

        removeErrorTip(index) {
            const errorClass = document.getElementById(index)
            while(errorClass.firstChild) errorClass.removeChild(errorClass.firstChild)
        },

        removeOption(index, optionValue) {
            if (this.toggleField.default === optionValue + '_' + index)
                this.toggleField.default = '';
            this.toggleField.options.splice(index, 1)
        },

        resetValue() {
            return {
                _id: null,
                label: '',
                type: 'Toggle',
                description: '',
                required: false,
                _event: 'change',
                allowRound: false,
                additionalCss: '',
                additionalStyles: '',
                addToSummary: true,
                allowCurrency: false,
                checkedLength: 0,
                _tag: 'cost-toggle',
                icon: 'ccb-icon-Path-3515',
                alias: 'toggle_field_id_',
                desc_option: 'after',
                summary_view: 'show_value',
                styles: {
                    box_style: 'vertical',
                    style: 'default',
                },
                options: [
                    {
                        optionText: '',
                        optionValue: '',
                        optionHint: '',
                    }
                ],
                apply_style_for_all: false,
            };
        },

        save(toggleField, id, index) {
            this.validate(toggleField, id, index);
            if (Object.keys(this.errors).length > 0)
                return;

            const settings = this.settings
            if (this.toggleField.apply_style_for_all === true) {
                settings.general.styles.toggle = this.toggleField.alias
                this.settings = settings
            } else {
                settings.general.styles.toggle = ''
                this.settings = settings
            }
            
            this.$emit('save', toggleField, id, index)
        },

        validate(toggleField) {
            delete this.errors.toggle;
            this.errorsCount = 0;
            if (toggleField.options) {
                Array.from(this.toggleField.options).map((element, index) => {
                    document.getElementById('errorOptionValue' + index).innerHTML = "";
                    if (element.optionValue.length === 0) {
                        this.errorsCount++;
                        this.errors.toggle = true;
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
    },

    destroyed() {
        this.$store.commit('setEditFieldError', false)
    },

    watch: {
        '$store.getters.getEditFieldError': function (value) {
            if ( value === 'save_field' ) {
                this.save(this.toggleField, this.id, this.index)
            }
        },
    }
}
