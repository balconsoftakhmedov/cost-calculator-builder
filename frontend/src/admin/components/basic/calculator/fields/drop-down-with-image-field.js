import imgSelector from "../../../utility/imgSelector";

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

    components: {
        'img-selector': imgSelector,
    },

    data: () => ({
        dropField: {},
        errors: {},
        tab: 'main',
        errorsCount: 0,
    }),

    computed: {
        getDescOptions() {
            return this.$store.getters.getDescOptions;
        },

        translations() {
            return this.$store.getters.getTranslations;
        }
    },

    mounted() {
        this.field = this.field.hasOwnProperty('_id') ? this.field : {};
        this.dropField = {...this.resetValue(), ...this.field};
        if (this.dropField._id === null) {
            this.dropField._id       = this.order;
            this.dropField.alias     = this.dropField.alias + this.dropField._id;
        }

        this.dropField.required  = this.dropField.hasOwnProperty('required') ? JSON.parse(this.dropField.required) : false
        if (!this.dropField.default)
            this.dropField.default = '';
    },

    methods: {
        numberCounterActionForOption( optionIndex, action = '+' ) {
            let step = 1, value = 0;
            const $input = document.querySelector('input[name=option_'+optionIndex+']');
            if ( !this.dropField.options.hasOwnProperty(optionIndex) || $input === null )
                return;

            if ( $input.step.length !== 0 )
                step = $input.step;

            if ( this.dropField.options[optionIndex].optionValue.length > 0 )
                value = this.dropField.options[optionIndex].optionValue;

            value = action === '-'
                ? parseFloat(value) - parseFloat($input.step)
                : parseFloat(value) + parseFloat($input.step)

            if ( $input.min.length !== 0 && value < $input.min)
                return;

            value = parseInt(step) === parseFloat(step)
                ? value.toFixed()
                : value.toFixed(2);

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
                nextTickCount: 0,
                hasNextTick: true,
                fieldDisabled: false,
                _event: 'change',
                allowRound: false,
                additionalCss: '',
                additionalStyles: '',
                addToSummary: true,
                allowCurrency: false,
                type: 'Drop Down With Image',
                _tag: 'cost-drop-down-with-image',
                icon: 'ccb-icon-Union-30',
                alias: 'dropDown_with_img_field_id_',
                desc_option: 'after',
                summary_view: 'show_value',
                options: [
                    {
                        src: null,
                        optionText: '',
                        optionValue: '',
                        id: `option_${this.randomID()}`,
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

        validate(dropField, saveAction = true, idx) {
            delete this.errors.dropField;
            this.errorsCount = 0;
            if (dropField.options) {
                let invalidOptionId = null;
                Array.from(this.dropField.options).map((element, index) => {
                    const $option = document.getElementById(`errorOptionValue${index}`);
                    $option ? $option.innerHTML = "" : null;

                    /** display tooltip error if format does not match (JPG, PNG) **/
                    if ( idx === index && !element.src && !saveAction )
                        invalidOptionId = element.id;

                    /** display tooltip error if there are empty option value **/
                    if ($option && element.optionValue.length === 0 && saveAction) {
                        this.errorsCount++;
                        this.errors.dropField = true;
                        this.$store.commit('setEditFieldError', true)
                        $option.innerHTML = `<span class="ccb-error-tip default">this is required field</span>`;
                    }
                });

                /** reset error content **/
                const errors = document.querySelectorAll('.invalid-format-fields');
                errors?.forEach(e => e ? e.innerHTML = "" : null);

                const $errorImage = document.getElementById(`errorImage_${invalidOptionId}`);
                if ( typeof idx === "number" && invalidOptionId && $errorImage ) {
                    this.errors.dropField = true;
                    $errorImage.innerHTML = `<span class="error-tip" style="max-width: unset; top: -45px">${this.translations?.format_error}</span>`
                }
            }
        },

        checkRequired(alias) {
            this.removeErrorTip(alias);
            this.errorsCount--;
        },

        changeDefault(event, val, index) {
            const vm = this;
            let [_, indexValue] = vm.dropField.default.split('_');
            if ((+indexValue) === (+index))
                vm.dropField.default = val + '_' + index;
        },

        removeErrorTip(index) {
            const errorClass = document.getElementById(index);
            while (errorClass.firstChild)
                errorClass.removeChild(errorClass.firstChild);
        },

        removeOption(index, optionValue) {
            if (this.dropField.default === (optionValue + '_' + index))
                this.dropField.default = '';
            this.dropField.options.splice(index, 1);
        },

        addOption() {
            this.dropField.options.push({src: null, optionText: '', optionValue: '', id: `option_${this.randomID()}`});
        },

        setThumbnail(src, index, actionClear = false) {
            if ( this.dropField.options[index] )
                this.dropField.options[index].src = src;

            if ( !actionClear )
                this.validate(this.dropField, false, +index);
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