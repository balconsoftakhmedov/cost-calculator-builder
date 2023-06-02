import {deleteOrder, updateOrder} from '../api'
import { toast } from '../../../utils/toast'
import moment from 'moment-timezone'

export default {
    template: `
        <div :class="['list-item', 'ccb-allowed', 'orders', detail ? 'active' : '']" @click="showDetails">
            <div class="list-title check ccb-allowed">
                <input type="checkbox" class="ccb-custom-checkbox ccb-allowed" @change="selectOrder" :checked="selected">
            </div>
            <div class="list-title id ccb-allowed">
                <span class="ccb-default-title ccb-allowed">{{ order.id }}</span>
            </div>
            <div class="list-title email">
                <span class="ccb-default-title ccb-allowed">{{ userEmail }}</span>
            </div>
            <div class="list-title title ccb-allowed">
                <span class="ccb-title ccb-allowed">
                    <span class="ccb-default-title ccb-allowed">
                         {{ order.calc_title }}
                         <i class="ccb-icon-Layer-2 ccb-allowed" v-if="fileFields.length > 0"></i>
                    </span>
                    <span class="order-deleted ccb-allowed" v-if="order.calc_deleted">Deleted</span>
                </span>
                <i v-if="fileFields.length > 0" class="ccb-clip-icon"></i>
            </div>
            <div class="list-title payment ccb-allowed">
                <span class="ccb-default-title ccb-allowed">{{ paymentMethod }}</span>
            </div>
            <div class="list-title total ccb-allowed">
                <span class="ccb-default-title ccb-allowed">{{ total }}</span>
            </div>
            <div class="list-title created_at ccb-allowed">
                <span class="ccb-default-title ccb-allowed">{{ order.date_formatted }}</span>
            </div>
            <div class="list-title status ccb-allowed">
                <div class="ccb-select-box ccb-allowed">
                    <div class="ccb-bulk-actions ccb-allowed">
                        <div class="ccb-select-wrapper ccb-allowed">
                            <i class="ccb-icon-Path-3485 ccb-select-arrow ccb-allowed"></i>
                            <select class="ccb-select ccb-allowed" v-model="status">
                                <option v-for="s in statusList" :key="s.value" :value="s.value" :selected="s.selected">
                                    {{ s.label }}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="list-title actions ccb-allowed">
                <i @click="generatePdf" class="ccb-icon-pdf ccb-allowed"></i>
                <i @click="deleteOrder(order.id)" class="ccb-icon-Path-3503 ccb-allowed"></i>
            </div>
        </div>
    `,

    props: {
        order: {
            type: Object,
        },
        detail: {
            type: Boolean
        },
        selected: {
            type: Boolean
        }
    },

    data() {
        return {
            status: 'pending',
            statusList: [
                {
                    value: 'complete',
                    label: 'Complete'
                },
                {
                    value: 'pending',
                    label: 'Pending'
                }
            ]
        }
    },

    methods: {
        generatePdf() {
            this.$emit('generate-pdf', this.order)
        },
        async deleteOrder(id){
            const ids = [id];
            if (confirm(this.translations.delete_order_info)) {
                await deleteOrder({ ids });
                toast(this.translations.success_deleted, 'success');
                this.$emit('fetch-data');
            }
        },

        async updateStatus(status) {
            if (status) {
                await updateOrder({
                    ids: this.order.id,
                    status: status
                });
                toast('Status successfuly updated', 'success');
            }
        },

        selectOrder() {
            this.$emit('order-selected', this.order.id);
        },

        showDetails(e) {
            const classNames = ['ccb-icon-pdf', 'ccb-icon-Path-3503', 'ccb-custom-checkbox', 'ccb-icon-Path-3485', 'ccb-select'];
            const [className, ] = e.target.className.split(' ');

            if (classNames.includes(className))
                return;
            const pm = this.order.paymentMethod || 'woocommerce'
            if ( pm === 'woocommerce' && this.order.hasOwnProperty('wc_link') && this.order.wc_link.length > 0 ) {
                const url = this.order.wc_link.replace(/&amp;/g, "&");
                window.open(url, '_blank');
            } else {
                const classList = ['ccb-select', 'ccb-custom-checkbox'];
                if ( !classList.includes(e.target.className) )
                    this.$emit('set-details', this.order);
            }

        },
    },

    computed: {
        fileFields() {
            return this.order.order_details.filter( field => field.alias.replace(/\_field_id.*/,'') === 'file_upload' );
        },

        formatTotal(  ) {
            let decimalCount = this.order.num_after_integer ? this.order.num_after_integer : 2;
            let decimal      = this.order.decimal_separator ? this.order.decimal_separator : '.';
            let thousands    = this.order.thousands_separator ? this.order.thousands_separator : ',';

            decimalCount = Math.abs(decimalCount);
            decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

            const negativeSign = this.order.total < 0 ? "-" : "";
            let total = parseFloat(this.order.total);

            let i = parseInt(total = Math.abs(Number(total) || 0).toFixed(decimalCount)).toString();
            let j = (i.length > 3) ? i.length % 3 : 0;

            total = negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(total - i).toFixed(decimalCount).slice(2) : "");
            return total;
        },

        paymentMethod() {
            const pm = this.order.paymentMethod || 'no_payments';
            return pm === 'no_payments' ? 'No payment' : pm;
        },

        total() {
            if (this.order.total) {
                return this.order.paymentCurrency + ' ' + this.formatTotal;
            }

            return 'Unknown error'
        },

        translations () {
            return ajax_window.translations;
        },

        userEmail() {
            return this.order.user_email.length < 16 ? this.order.user_email : this.order.user_email.substr(0,16) + '...';
        },
    },

    mounted() {
        if (this.order.status && this.order.status !== "undefined")
            this.status = this.order.status;

        this.$watch('status', this.updateStatus);
    },
}
