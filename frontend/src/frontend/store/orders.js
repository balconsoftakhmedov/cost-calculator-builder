export default {
    state: {
        orderId: null,
        orderFiles: [],
    },

    getters: {
        getOrderFiles: s => s.orderFiles,
        getOrderId: s => s.orderId,
    },

    mutations: {
        addOrderFiles(state, orderFiles) {
            let fieldExist = state.orderFiles.findIndex(file => file.alias === orderFiles.alias);
            if (fieldExist !== -1) {
                state.orderFiles.splice(fieldExist, 1, orderFiles);
            }else{
                state.orderFiles.push(orderFiles);
            }
        },

        setOrderId(state, id) {
            state.orderId = id;
        }
    },

    actions: {
        async completeOrder({commit}, id) {
            const response = await fetch(ajax_window.ajax_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
                },
                body:  new URLSearchParams({
                    'action': 'update_order_status',
                    'ids': id,
                    'status': 'complete',
                    'nonce': window.ccb_nonces.ccb_update_order
                })
            });

            return await response.json()

        },

        async addOrder({commit}, data ) {
            let files = [];
            if ( data.hasOwnProperty('files') ){
                files    = [...data.files];
                delete data.files;
            }

            if ( window.ccbResetOrderId ) {
                data.orderId = null
                data.status = "pending"
                window.ccbResetOrderId = false
            }

            const formData = new FormData();
            formData.append('action', 'create_cc_order');
            formData.append('data', JSON.stringify(data));
            formData.append('nonce', window.ccb_nonces.ccb_add_order);

            files.forEach(fileItem => {
                for (const file of fileItem.files ) {
                    formData.append([fileItem.alias, file.name].join('_ccb_'), file);
                }
            });

            const response = await fetch(ajax_window.ajax_url, {
                method: 'POST',
                body: formData,
            })

            return await response.json();
        }
    }
}