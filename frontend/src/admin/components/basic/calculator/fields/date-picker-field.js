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
        dateField: {},
        errors: {},
        showHelp: {
            'min_date': false,
            'min_date_days': false,
        },
    }),

    computed: {
        getDescOptions() {
            return this.$store.getters.getDescOptions
        }
    },

    mounted() {
        this.field = this.field.hasOwnProperty('_id') ? this.field : {};
        this.dateField = {...this.resetValue(), ...this.field};
        if (this.dateField._id === null) {
            this.dateField._id = this.order;
            this.dateField.alias = this.dateField.alias + this.dateField._id;
        }
    },

    methods: {
        numberCounterAction( modelKey, action = '+' ){
            var input = document.querySelector('input[name='+modelKey+']');
            var step  = 1;
            if ( !this.dateField.hasOwnProperty(modelKey) || input === null ){
                return;
            }
            if( input.step.length !== 0 ){
                step = input.step;
            }

            var value = this.dateField[modelKey];
            if ( action === '-'){
                value = parseFloat(value) - parseFloat(input.step);
            }else{
                value = parseFloat(value) + parseFloat(input.step);
            }

            if( input.min.length != 0 && value < input.min){
                return;
            }
            if ( parseInt(step) === parseFloat(step) ){
                value = value.toFixed();
            }else{
                value = value.toFixed(2);
            }

            this.dateField[modelKey] = value;
        },

        validate() {
          delete this.errors.min_date_days;
          const days = this.dateField.min_date_days;
          if ( (this.dateField.min_date && parseInt(days, 10) < 0) || isNaN(parseInt(days, 10))) {
              this.errors.min_date_days = true;
              this.$store.commit('setEditFieldError', true)
              return;
          }
        },

        resetValue() {
            return {
                _id: null,
                label: '',
                range: '0',
                description: '',
                placeholder: '',
                _event: 'click',
                type: 'Date Picker',
                _tag: 'date-picker',
                addToSummary: true,
                additionalStyles: '',
                icon: 'ccb-icon-Path-3513',
                alias: 'datePicker_field_id_',
                desc_option: 'after',
                min_date: false,
                min_date_days: 0,// current date plus min_date_days days
            };
        },

        saveField() {
          this.validate();

          if ( Object.keys(this.errors).length > 0 ) {
              return;
          }
          this.$emit('save', this.dateField, this.id, this.index);
        }
    },

    destroyed() {
        this.$store.commit('setEditFieldError', false)
    },

    watch: {
        '$store.getters.getEditFieldError': function (value) {
            if ( value === 'save_field' ) {
                this.saveField()
            }
        }
    }
}