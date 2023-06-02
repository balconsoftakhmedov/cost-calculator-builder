import copyText from "../utility/copyText";

export default {
	computed: {
		generalSettings: {
			get() {
				return this.$store.getters.getGeneralSettings;
			},

			set(value) {
				this.$store.commit('updateGeneralSettings', value);
			}
		},
	},

	data: () => ({
		dataLoaded: false,
		shortCode: {
			className: '',
			text: 'Copy'
		},
	}),

	methods: {
		async saveGeneralSettings() {
			await this.$store.dispatch('saveGeneralSettings');
		},

		resetCopy() {
			this.shortCode = {
				className: '',
				text: 'Copy'
			};
		},

		copyShortCode(id) {
			copyText(id);
			this.shortCode.className = 'copied';
			this.shortCode.text = 'Copied!';
		},
	}
}