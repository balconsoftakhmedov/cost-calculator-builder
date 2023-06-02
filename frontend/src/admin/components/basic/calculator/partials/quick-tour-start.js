export default {
	computed: {
		hide: {
			get() {
				return this.$store.getters.getModalHide;
			},

			set(value) {
				this.$store.commit('setModalHide', value)
			}
		}
	},

	methods: {
		quickTourNextStep() {
			this.$store.commit('setQuickTourStep', '.calc-quick-tour-title-box')
			this.$emit('start-quick-tour')
			this.closeModal();
		},

		closeModal() {
			this.hide = true;
			this.$store.commit('setOpenModal', false);

			setTimeout(() => {
				this.hide = false;
				this.$store.commit('setModalType', '');
			}, 200)
		},

		skipAndClose() {
			this.$store.dispatch('skipCalcQuickTour')
			this.$store.commit('setQuickTourStarted', false)
			this.$store.commit('setQuickTourStep', 'done')
			this.closeModal();
		}
	},
}
