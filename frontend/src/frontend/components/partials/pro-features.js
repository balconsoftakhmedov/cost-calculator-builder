import payment from "./payment";
import wooCheckout from "./woo-checkout";
import calcForm from "./calc-form";
import invoiceBtn from "./invoice-btn"
import fieldsMixin from "../fields/fieldsMixin";

export default  {
    mixins: [fieldsMixin],
    props: {
        settings: {
            default: {}
        }
    },

    data: () =>  ({
        type: '',
    }),

    created() {
        const settings = this.settings;
        const email = settings.formFields.accessEmail || false;
        const use_payment = ( settings.formFields.payment && email ) || false;
        const woo_checkout   = settings.woo_checkout.enable || false;

        var all_payments = [
            { 'payment': 'woo_checkout', 'enabled': settings.woo_checkout.enable || false },
            { 'payment': 'paypal', 'enabled': settings.paypal.enable || false },
            { 'payment': 'stripe', 'enabled': settings.stripe.enable || false },
        ];
        var enabled_payments = all_payments.filter((payment) => payment.enabled === true );

        if ( use_payment ) {
            this.type = 'form'
        } else {
            if ( woo_checkout && enabled_payments.length == 1 ) {
                this.type = 'woo_checkout'
            } else {
                this.type = ( email ) ? 'form' : enabled_payments.length ? 'payment' : 'invoiceBtn';
            }
        }
    },

    components: {
        'calc-form': calcForm,
        'calc-payments': payment,
        'calc-woo-checkout' : wooCheckout,
        'invoice-btn': invoiceBtn
    },
}