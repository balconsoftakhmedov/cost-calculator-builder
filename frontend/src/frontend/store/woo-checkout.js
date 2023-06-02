export default {
    state: {
        productName: false,
    },
    actions: {
        async applyWoo({getters, commit, state}, params) {
            const getSettings = getters.getSettings;
            const action = 'calc_woo_redirect';
            const nonce = window.ccb_nonces.ccb_woo_checkout;

            const descriptions = getters.getSettings.general.hide_empty ? getters.getDescriptions('showZero') : getters.getDescriptions()

            let wooData = {
                descriptions,
                woo_info: getSettings.woo_checkout,
                item_name: getSettings.title,
                calcTotals: getters.getFormula,
                calcId: getSettings.calc_id,
                orderId: getters.getOrderId,
            };

            if ( getSettings.woo_products.enable && getSettings.woo_checkout.product_id === 'current_product' ) {
                wooData.woo_info.product_id = params.post_id;
            }

            const formData = new FormData();
            formData.append('action', action);
            formData.append('data', JSON.stringify(wooData));
            formData.append('nonce', nonce);

            /** get files **/
            if (typeof params.files !== "undefined") {
                params.files.forEach(fileItem => {
                    for (const file of fileItem.files ) {
                        formData.append([fileItem.alias, file.name].join('_ccb_'), file);
                    }
                });
            }
            /** get files | End **/

            const response = await fetch(ajax_window.ajax_url, {
                method: 'POST',
                body: formData,
            })

            const resJson = await response.json();
            if ( resJson.success ) {
                if (params.callback)
                    params.callback()

                if (resJson.page === 'stayOnPage') {
                    state.productName = resJson.product_name;
                    return false;
                } else {
                    location.href = resJson.page;
                }
            }

            return true;
        }
    },

    getters: {
        getProductName: s => s.productName
    },

    mutations: {
        setProductName(state, name) {
            state.productName = name
        }
    }
}