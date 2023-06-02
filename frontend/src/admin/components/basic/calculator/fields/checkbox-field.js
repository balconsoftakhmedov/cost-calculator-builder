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
        checkboxField: {},
        errors: {},
        tab: 'main',
        errorsCount: 0,
    }),

    computed: {
        getDescOptions() {
            return this.$store.getters.getDescOptions
        },

        getCheckboxStyles() {
            return [
                {
                    label: 'Default',
                    value: 'default',
                    img: {
                        vertical: `${window.ajax_window.plugin_url}/frontend/dist/img/styles/checkbox/default.png`,
                        horizontal: `${window.ajax_window.plugin_url}/frontend/dist/img/styles/checkbox/default.png`,
                    },
                },
                {
                    label: 'Box',
                    value: 'box',
                    img: {
                        vertical: `${window.ajax_window.plugin_url}/frontend/dist/img/styles/checkbox/style_5_vertical.png`,
                        horizontal: `${window.ajax_window.plugin_url}/frontend/dist/img/styles/checkbox/style_5_horizontal.png`,
                    },
                },
                {
                    label: 'Box with checkbox',
                    value: 'box-with-checkbox',
                    img: {
                        vertical: `${window.ajax_window.plugin_url}/frontend/dist/img/styles/checkbox/style_2_vertical.png`,
                        horizontal: `${window.ajax_window.plugin_url}/frontend/dist/img/styles/checkbox/style_2_horizontal.png`,
                    },
                },
                {
                    label: 'Box with checkbox and description',
                    value: 'box-with-checkbox-and-description',
                    img: {
                        vertical: `${window.ajax_window.plugin_url}/frontend/dist/img/styles/checkbox/style_3_horizontal.png`,
                        horizontal: `${window.ajax_window.plugin_url}/frontend/dist/img/styles/checkbox/style_3_horizontal.png`,
                    },
                },
                {
                    label: 'Box with heading checkbox and description',
                    value: 'box-with-heading-checkbox-and-description',
                    img: {
                        vertical: `${window.ajax_window.plugin_url}/frontend/dist/img/styles/checkbox/style_1_vertical.png`,
                        horizontal: `${window.ajax_window.plugin_url}/frontend/dist/img/styles/checkbox/style_1_horizontal.png`,
                    },
                },
            ]
        },

        getCurrentImage() {
            if (this.checkboxField.styles) {
                const current = this.getCheckboxStyles.find(s => s.value === this.checkboxField.styles.style)
                if ( current ) {
                    return current.img[this.checkboxField.styles.box_style]
                }
            }

            return `${window.ajax_window.plugin_url}/frontend/dist/img/styles/checkbox/default.png`
        },

        settings: {
            get() {
                return this.$store.getters.getSettings
            },

            set(value) {
                this.$store.commit('updateSettings', value)
            }
        }
    },

    mounted() {
        this.field = this.field.hasOwnProperty('_id') ? this.field : {};
        this.checkboxField = {...this.resetValue(), ...this.field};
        if (this.checkboxField._id === null) {
            this.checkboxField._id = this.order;
            this.checkboxField.alias = this.checkboxField.alias + this.checkboxField._id;
        }
        this.checkboxField.required  = this.checkboxField.hasOwnProperty('required') ? JSON.parse(this.checkboxField.required) : false

        this.checkboxField.apply_style_for_all = false
        setTimeout(() => {
            if ( this.settings.general.styles && this.settings.general.styles.checkbox ) {
                this.checkboxField.apply_style_for_all = true
                if (this.checkboxField.styles) {
                    const fields = this.$store.getters.getBuilder
                    const field = fields.find(f => f.alias === this.settings.general.styles.checkbox )
                    if (field) {
                        this.checkboxField.styles = JSON.parse(JSON.stringify(field.styles))
                    }
                }
            }
        })
    },

    methods: {
        addOption: function () {
            this.checkboxField.options.push({optionText: '', optionValue: '', optionHint: ''});
        },

        numberCounterActionForOption( optionIndex, action = '+' ) {
            let input = document.querySelector('input[name=option_'+optionIndex+']');
            let step  = 1;
            let value = 0;

            if (!this.checkboxField.options.hasOwnProperty(optionIndex) || input === null)
                return;

            if (input.step.length !== 0)
                step = input.step;

            if ( this.checkboxField.options[optionIndex].optionValue.length > 0 )
                value = this.checkboxField.options[optionIndex].optionValue;

            value = action === '-'
                ? parseFloat(value) - parseFloat(input.step)
                : parseFloat(value) + parseFloat(input.step);

            if (input.min.length !== 0 && value < input.min)
                return;

            value = parseInt(step) === parseFloat(step)
                ? value.toFixed()
                : value.toFixed(2);

            this.removeErrorTip('errorOptionValue' + optionIndex);
            this.checkboxField.options[optionIndex].optionValue = value;
        },

        removeErrorTip(index) {
            const errorClass = document.getElementById(index);
            while(errorClass.firstChild) errorClass.removeChild(errorClass.firstChild);
        },

        removeOption(index, optionValue) {
            if (this.checkboxField.default === optionValue + '_' + index)
                this.checkboxField.default = '';
            this.checkboxField.options.splice(index, 1);
        },

        resetValue() {
            return {
                _id: null,
                label: '',
                description: '',
                required: false,
                _event: 'change',
                type: 'Checkbox',
                allowRound: false,
                additionalCss: '',
                additionalStyles: '',
                addToSummary: true,
                allowCurrency: false,
                checkedLength: 0,
                minChecked: 0,
                _tag: 'cost-checkbox',
                icon: 'ccb-icon-Path-3512',
                alias: 'checkbox_field_id_',
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

        save(checkboxField, id, index) {
            this.validate(checkboxField);
            if (Object.keys(this.errors).length > 0)
                return;

            const settings = this.settings
            if (this.checkboxField.apply_style_for_all === true) {
                settings.general.styles.checkbox = this.checkboxField.alias
                this.settings = settings
            } else {
                settings.general.styles.checkbox = ''
                this.settings = settings
            }

            this.$emit('save', checkboxField, id, index);
        },

        checkRequired(alias) {
            this.removeErrorTip(alias);
            this.errorsCount--;
        },

        validate(checkboxField) {
            this.errorsCount = 0;
            delete this.errors.checkbox;
            if (checkboxField.options) {
                Array.from(this.checkboxField.options).map((element, index) => {
                    document.getElementById('errorOptionValue' + index).innerHTML = "";
                    if (element.optionValue.length === 0) {
                        this.errorsCount++;
                        this.errors.checkbox = true;
                        this.$store.commit('setEditFieldError', true)
                        document.getElementById('errorOptionValue' + index).innerHTML = `<span class="ccb-error-tip default">this is required field</span>`;
                    }
                })
            }
        },
    },

    destroyed() {
        this.$store.commit('setEditFieldError', false)
    },

    watch: {
        '$store.getters.getEditFieldError': function (value) {
            if ( value === 'save_field' ) {
                this.save(this.checkboxField, this.id, this.index)
            }
        }
    }
}
