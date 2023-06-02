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
        textField: {},
    }),

    computed: {
        getDescOptions() {
            return this.$store.getters.getDescOptions
        }
    },

    mounted() {
        this.field = this.field.hasOwnProperty('_id') ? this.field : {};
        this.textField = { ...this.resetValue(), ...this.field };
        if (this.textField._id === null) {
            this.textField._id = this.order;
            this.textField.alias = this.textField.alias + this.textField._id;
        }
    },

    methods: {
        resetValue() {
            return {
                label: '',
                _event: '',
                _id: null,
                description: '',
                placeholder: '',
                _tag: 'cost-text',
                type: 'Text Area',
                additionalCss: '',
                additionalStyles: '',
                icon: 'ccb-icon-Subtraction-7',
                desc_option: 'after',
                alias: 'text_field_id_'
            };
        },
    },
}
