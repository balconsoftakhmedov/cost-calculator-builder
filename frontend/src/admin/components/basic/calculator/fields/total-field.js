export default {
    props: {
        available: {
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

        field: {}
    },

    data: () => ({
        totalField: {},
        available_fields: [],
    }),

    mounted() {
        this.field = this.field.hasOwnProperty('_id') ? this.field : {};
        this.totalField = {...this.resetValue(), ...this.field};
        if (this.totalField._id === null) {
            this.totalField._id = this.order;
            this.totalField.alias = this.totalField.alias + this.totalField._id;
        }

        this.totalField.icon = this.resetValue().icon;
        if (!this.totalField.default)
            this.totalField.default = '';

        const currentTotalId = this.totalField.alias.replace(/[^0-9]/g,'');
        const exceptions     = ['text', 'html', 'line', 'total'];
        this.available?.forEach(av => {
            const fieldName = av.alias?.replace(/\_field_id.*/,'');
            if ( av.alias && !exceptions.includes( fieldName ) ) {
                this.available_fields.push(av)
            }

            const totalFieldId = av.alias?.replace(/[^0-9]/g,'');
            if ( av.alias && fieldName === 'total' && av.alias !== 'total'
                && parseInt(totalFieldId) < parseInt(currentTotalId) ) {
                this.available_fields.push(av)
            }
        })
    },

    methods: {
        resetValue() {
            return {
                _id: null,
                currency: '$',
                type: 'Total',
                additionalCss: '',
                _tag: 'cost-total',
                costCalcFormula: '',
                additionalStyles: '',
                alias: 'total_field_id_',
                icon: 'ccb-icon-Path-3516',
                label: '',
                totalSymbol: '',
                totalSymbolSign:'',
            };
        },

        insertAtCursor: function (myValue) {
            const myField = this.$refs['ccb-formula-' + this.totalField._id];
            if (myField && myField.selectionStart || myField.selectionStart === 0) {
                let startPos = myField.selectionStart;
                let endPos = myField.selectionEnd;
                myField.value = myField.value.substring(0, startPos)
                    + ' ' + myValue + ' '
                    + myField.value.substring(endPos, myField.value.length);
            } else {
                myField.value += ' ' + myValue;
            }
            this.totalField.costCalcFormula = myField.value;
        },
    },
}
