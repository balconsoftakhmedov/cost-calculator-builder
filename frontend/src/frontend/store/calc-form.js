export default {
    state: {
        hideCalc: false,
        loader: false,
        showMessage: false,
        showPayments: false,
        formFields: []
    },

    getters: {
        getHideCalc: s => s.hideCalc,
        getLoader: s => s.loader,
        getShowPayments: s => s.showPayments,
        getShowMessage: s => s.showMessage,
        getFormFields: s => s.formFields
    },

    mutations: {
        updateHideCalc(state, val) {
            state.hideCalc = val;
        },
        setLoader(state, val) {
            state.loader = val;
        },
        setShowPayments(state, val) {
            state.showPayments = val;
        },
        setShowMessage(state, val) {
            state.showMessage = val;
        },
        setFormFields(state, val) {
            state.formFields = val
        }
     },

    actions: {
        async sendForm({commit}, data) {
            if( data.action ) {

                let files     = [];
                if ( data.hasOwnProperty('files') ){
                    files    = [...data.files];
                    delete data.files;
                }

                const formData = new FormData();
                formData.append('action', data.action);
                formData.append('data', JSON.stringify(data));

                files.forEach(fileItem => {
                    for (const file of fileItem.files ) {
                        formData.append([fileItem.alias, file.name].join('_ccb_'), file);
                    }
                });

                const response = await fetch(ajax_window.ajax_url, {
                    method: 'POST',
                    body: formData,
                })
                return  await response.json();
            }
        }
    },
}