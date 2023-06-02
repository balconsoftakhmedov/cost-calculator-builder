export default {
	state: {
	    paymentStep: '',
		paymentMethod: '',
	},

	mutations: {
		updateMethodCommit(state, val) {
			state.paymentMethod = val;
		},

        updateStep(state, val) {
		    state.paymentStep = val;
        }
	},

	actions: {
		async fetchPayment({state, getters, commit}, data) {
			const action = data.action;
			if (action) {
				const encoded = encodeURIComponent(JSON.stringify(data));
				const response = await fetch(ajax_window.ajax_url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
					},
					body: `action=${action}&data=` + encoded,
				});

				const resJson = await response.json();
				if (state.paymentMethod === 'paypal' && resJson.success) {
					window.location.assign(resJson.url);
					setTimeout(() => {
						this.$store.commit('setLoader', false);
					}, 4000);
				}

				if (state.paymentMethod === 'stripe') {
					commit('updateHideCalc', false);
				}

				return resJson;
			}

			return {success: false, status: 'error'}
		},

		updateMethodAction({commit}, val) {
			commit('updateMethodCommit', val);
		},

		updateApiDataAction({commit}, data) {
			commit('updateApiData', data);
		}
	},

	getters: {
		getMethod: state => state.paymentMethod,
		getStep: state => state.paymentStep,
	}
}
