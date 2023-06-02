export async function fetchOrdersList(params) {
    const response = await fetch(ajax_window.ajax_url + '?' + new URLSearchParams({
        action: 'get_cc_orders',
        nonce: window.ccb_nonces.ccb_orders,
        ...params,
    }));

    return response.json()
}

export async function updateOrder(params) {
    const response = await fetch(ajax_window.ajax_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
        },
        body:  new URLSearchParams({
            'action': 'update_order_status',
            'nonce': window.ccb_nonces.ccb_update_order,
            ...params
        })
    });

    return response.json()
}

export async function deleteOrder(params) {
    const response = await fetch(ajax_window.ajax_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
        },
        body:  new URLSearchParams({
            'action': 'delete_cc_orders',
            'nonce': window.ccb_nonces.ccb_delete_order,
            ...params
        })
    });

    return response.json()
}