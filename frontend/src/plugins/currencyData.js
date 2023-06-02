export default {
    install(Vue) {
        Vue.prototype.$currencyData = settings => {
            if ( typeof settings !== 'object' )
                return null;

            const currency = settings.currency || {}
            return {
                currency: currency && currency.currency ? currency.currency : '$',
                num_after_integer: currency && currency.num_after_integer ? currency.num_after_integer : 2,
                decimal_separator: currency && currency.decimal_separator ? currency.decimal_separator : '.',
                thousands_separator: currency && currency.thousands_separator ? currency.thousands_separator : ',',
                currency_position: currency && currency.currencyPosition ? currency.currencyPosition : 'left_with_space',
            }
        }
    }
}