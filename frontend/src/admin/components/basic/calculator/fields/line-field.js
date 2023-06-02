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
        lineField: {},
    }),

    mounted() {
        this.field = this.field.hasOwnProperty('_id') ? this.field : {};
        this.lineField = { ...this.resetValue(), ...this.field };

        if (this.lineField._id === null) {
            this.lineField._id = this.order;
            this.lineField.label = this.lineField.label || `Line (${this.lineField._id})`;
            this.lineField.alias = this.lineField.alias + this.lineField._id;
        }
    },

    methods: {
        resetValue() {
            return {
                label: '',
                _event: '',
                _id: null,
                len: '25%',
                size: '1px',
                type: 'Line',
                style: 'solid',
                description: '',
                placeholder: '',
                _tag: 'cost-line',
                additionalCss: '',
                additionalStyles: '',
                icon: 'ccb-icon-Path-3518',
                alias: 'line_field_id_'
            };
        },
    },
}