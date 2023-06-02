export default {
    template: `
        <div class="ccb-modal-wrapper" :class="modalClass">
           <div class="modal-overlay">
                <div class="modal-window order-modal">
                    <div class="modal-window-content order-modal__content" v-if="order">
                        <span @click="close()" class="close"><span class="close-icon"></span></span>
                        <div class="modal-header order-modal__header">
                            <div class="modal-title ccb-order">
                                <div class="ccb-order-data-title main ">
                                    {{ order.id }}. {{ order.calc_title }}
                                </div>
                                <div class="ccb-order-data-title contact-info">
                                    Contact Information
                                </div>
                            </div>
                        </div>
                        <div class="modal-body order-modal__body">
                            <div class="ccb-order-data-details main">
                                <div class="ccb-order-info" v-for="detail in order.order_details">
                                    <div class="ccb-field">
                                        <div class="ccb-field-title">{{ detail.title }}</div>
                                        <div class="ccb-field-value">{{ order.currency }}  {{ detail.value }}</div>
                                    </div>
                                    <div class="ccb-field options" v-if="detail.options && detail.alias.replace(/\\_field_id.*/,'') !== 'file_upload' " v-for="option in detail.options">
                                        <div class="ccb-field-title">{{ option.label }}</div>
                                        <div class="ccb-field-value">{{ order.currency }}  {{ option.value }}</div>
                                    </div>
                                </div>
                                <div class="ccb-order-total">
                                    <div class="ccb-total-title">Total</div>
                                    <div class="ccb-total-value">{{ order.paymentCurrency }} {{ formatTotal }}</div>
                                </div>
                                <div class="ccb-order-payment">
                                    Payment Method:
                                    <i v-if="order.paymentMethod !== 'no_payments'" :class="['ccb-payment-icon', paymentMethod]"></i> 
                                    <span class="ccb-no-payment" v-else >
                                        {{ paymentMethod }}
                                    </span> 
                                </div>
                                <div class="ccb-order-files" v-if="fileFields.length > 0">
                                    <div v-for="fileField in fileFields">
                                        <div class="ccb-file" v-if="file.hasOwnProperty('file') && file.file.length > 0" v-for="file in fileField.options">
                                            <div class="ccb-file-icon"><i></i></div>
                                            <div class="ccb-file-details">
                                                <div class="ccb-file-label">{{ fileField.title }}</div>
                                                <div :title="file.file.split('/').pop()" class="ccb-file-name">
                                                    {{ file.file.split('/').pop() }}
                                                </div>
                                            </div>
                                             <a :href="file.url" :download="file.file.split('/').pop()">
                                                <button class="btn-white">Download</button>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="ccb-order-data-details contact-info">
                            <div class="ccb-contact-fixed">
                                <div class="ccb-contact" v-for="field in formFields">
                                    <div class="ccb-contact-title">{{ field.name }}</div>
                                    <div :class="[field.name, 'ccb-contact-value']">{{ field.value }}</div>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            fileFields: [],
            order: null,
            show: false,
        }
    },

    methods: {
        getFileFields(){
            return this.order.order_details.filter( field =>
                field.alias.replace(/\_field_id.*/,'') == 'file_upload'
            )
        },
        open(order) {
            this.order      = Object.assign({}, order);
            this.fileFields = this.getFileFields();
            this.show       = true
        },
        close() {
            this.show = false
        }
    },

    computed: {
        fileFields() {
            return this.order.order_details.filter( field =>
                field.alias.replace(/\_field_id.*/,'') == 'file_upload' );
        },

        formatTotal(  ) {
            var decimalCount = this.order.num_after_integer ? this.order.num_after_integer : 2;
            var decimal      = this.order.decimal_separator ? this.order.decimal_separator : '.';
            var thousands    = this.order.thousands_separator ? this.order.thousands_separator : ',';

            decimalCount = Math.abs(decimalCount);
            decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

            const negativeSign = this.order.total < 0 ? "-" : "";
            var total = parseFloat(this.order.total);

            let i = parseInt(total = Math.abs(Number(total) || 0).toFixed(decimalCount)).toString();
            let j = (i.length > 3) ? i.length % 3 : 0;

            total = negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(total - i).toFixed(decimalCount).slice(2) : "");
            return total;
        },

        formFields() {
            const result = this.order.form_details.fields.map(item => {
                return {
                    name: item.name.replace('-', ' '),
                    value: item.value
                }
            })

            return result
        },

        modalClass() {
            return {
                open: this.show,
            }
        },

        paymentMethod() {
            return this.order.paymentMethod === 'no_payments' ? 'No payment' : this.order.paymentMethod
        },
    }
}

