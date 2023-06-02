import main from './main'
import payments from './payments'
import wooCheckout from "./woo-checkout";
import calcForm from "./calc-form";
import settingsStore from '../../admin/store/settings'
import orderStore from './orders'
export default {
    modules: {
        main,
        payments,
        wooCheckout,
        calcForm,

        settingsStore,
        orderStore
    },
};
