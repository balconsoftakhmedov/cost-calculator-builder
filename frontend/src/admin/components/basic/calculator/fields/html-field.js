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
        htmlField: {},
    }),

    mounted() {
        this.field = this.field.hasOwnProperty('_id') ? this.field : {};
        this.htmlField = { ...this.resetValue(), ...this.field };
        if (this.htmlField._id === null) {
            this.htmlField._id = this.order;
            this.htmlField.label = this.htmlField.label || `HTML (${this.htmlField._id})`;
            this.htmlField.alias = this.htmlField.alias + this.htmlField._id;
        }
    },

    methods: {
        resetValue() {
            return {
                label: '',
                _id: null,
                _event: '',
                type: 'Html',
                htmlContent: '',
                placeholder: '',
                hidden: false,
                _tag: 'cost-html',
                additionalCss: '',
                additionalStyles: '',
                icon: 'ccb-icon-Path-3517',
                alias: 'html_field_id_'
            };
        },
    },
}
