import VueHtml2pdf from 'vue-html2pdf'
import moment from "moment";


export default {
    data() {
        return {
            formFields: this.$store.getters.getFormFields,
            download: false
        }
    },

    props: ['order', 'invoiceDetail', 'invoiceTexts'],

    components: {
        'vue-html2pdf': VueHtml2pdf
    },

    methods: {
        async beforeDownload ({ html2pdf, options, pdfContent }) {
            let conf = options
            conf.enableLinks = true
            await html2pdf().set(conf).from(pdfContent).toPdf().get('pdf').output('datauristring').then( pdfAsString => {
                this.$store.commit('setPdfString', pdfAsString.split(',')[1] )
                })
            }
        ,
        generateReport(download) {
            this.download = download
            setTimeout(() => {
                this.$refs.html2Pdf.generatePdf()
            }, 100)
        }
    },

    computed: {
        getText() {
            return JSON.parse(this.invoiceTexts)
        },
        fileFields() {
            return this.order.order_details.filter(field => field.alias.replace(/\_field_id.*/, '') == 'file_upload');
        },
        invoiceSettings() {
            return JSON.parse(this.invoiceDetail)
        },
        orderMethod() {
            return this.order.paymentMethod === 'no_payments' ? 'No Payments' : this.order.paymentMethod;
        },
        orderDetails() {
            const list = [];
            const withOptions = ['dropDown', 'radio', 'checkbox', 'toggle'];
            if (this.order && this.order.order_details.length > 0) {
                this.order.order_details.forEach(detail => {
                    const inOption = withOptions.find(wO => detail.alias.indexOf(wO) !== -1);
                    list.push({
                        label: detail.title,
                        value: detail.value,
                        options: inOption ? detail.options : null,
                    })
                });
            }
            return list;
        },
        getCurrentDate() {
            return moment().format(this.invoiceSettings.dateFormat);
        },
        orderId() {
            return this.order.id
        },
        orderTotal() {
            return this.order.total
        },
        forFields() {
            if (this.order.form_details.form !== 'Contact Form 7') {
                return this.order.form_details.fields.map(field => {
                    return {
                        name: this.getText.contact_form[field.name],
                        value: field.value
                    }
                })
            }
            return this.order.form_details.fields
        }
    },

    template: `
 
    <template>
        <div>
            <vue-html2pdf
            :show-layout="false"
            :float-layout="true"
            :enable-download="download"
            :preview-modal="false"
            filename="order-pdf"
            :pdf-quality="2"
            :manual-pagination="true"
            pdf-format="a4"
            pdf-orientation="portrait"
            pdf-content-width="800px"
            @beforeDownload="beforeDownload($event)"
            ref="html2Pdf"
            >
                <section slot="pdf-content">
                    <div class="ccb-invoice">
                        <div class="ccb-invoice-container">
                            <div class="ccb-invoice-header">
                                <div class="ccb-invoice-logo">
                                    <span v-if="!this.invoiceSettings.companyLogo">{{ this.invoiceSettings.companyName }}</span>
                                    <img v-if="this.invoiceSettings.companyLogo" :src="this.invoiceSettings.companyLogo" alt="Invoice logo">
                                </div>
                                <div class="ccb-invoice-date">
                                    <span>{{ this.getCurrentDate }}</span>
                                </div>
                            </div>
                            <div class="ccb-invoice-company">
                                <span>
                                    {{ this.invoiceSettings.companyInfo }}
                                </span>
                            </div>
                            <div class="ccb-invoice-table">
                                <div class="ccb-invoice-table__header">
                                    <span>{{ getText.Order }} № </span>
                                    <span>{{ orderId }}</span>
                                </div>
                                <div class="ccb-invoice-table__body">
                                    <div class="ccb-invoice-table__summary">
                                        <span class="ccb-invoice-table__title">{{ getText.total_title }}</span>
                                        <ul>
                                           <li v-for="item in orderDetails">
                                                <span class="ccb-invoice-row">
                                                    <span>{{ item.label }}</span>
                                                        <span class="ccb-invoice-space"></span>
                                                    <span>{{ item.value }}</span>
                                                </span>
                                                <span v-for="subItem in item.options" class="ccb-invoice-row ccb-invoice-sub-item">
                                                    <span>{{ subItem.label }}</span>
                                                        <span class="ccb-invoice-space"></span>
                                                    <span>{{ subItem.value }}</span>
                                                </span>
                                           </li>
                                        </ul>
                                        <ul class="ccb-invoice-files">
                                            <li v-for="fileField in fileFields">
                                                <span class="ccb-invoice-file" v-if="file.hasOwnProperty('file') && file.file.length > 0" v-for="file in fileField.options">
                                                    <a :href="file.url" :download="file.file.split('/').pop()">
                                                        <i class="ccb-icon-Path-3494"></i>
                                                        <span class="ccb-invoice-title">{{ file.file.split('/').pop() }}</span>
                                                    </a>
                                                </span>
                                            </li>
                                        </ul>
                                        <span class="ccb-invoice-table__total">
                                            <span>{{ getText.total }}: </span>
                                            <span>{{ orderTotal }}</span>
                                        </span>
                                        <span class="ccb-invoice-table__payment">
                                            <span>{{ getText.payment_method }}:</span>
                                            <span>{{ orderMethod }}</span>
                                        </span>
                                    </div>
                                    <div class="ccb-invoice-table__contact">
                                        <span class="ccb-invoice-table__title">{{ getText.contact_title }}</span>
                                        <ul>
                                           <li v-for="formItem in forFields">
                                                <span>{{ formItem.name }}</span>
                                                <span>{{ formItem.value }}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </vue-html2pdf>
        </div>
    </template>

    `
}
