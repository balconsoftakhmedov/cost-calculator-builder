import {currency, totalSummary, paypal, sendForm, wooProducts, stripe, wooCheckout} from "./partials";
import preview from '../calculator/partials/preview';
import ccbModalWindow from "../../utility/modal";
import quickTourMixin from "../quick-tour/quickTourMixin";
import hintMixin from "../quick-tour/hintMixin";

export default {
	mixins: [quickTourMixin, hintMixin],
	props: {
		settings: {},
	},

	components: {
		preview,
		'ccb-settings-stripe': stripe,
		'ccb-settings-paypal': paypal,
		'ccb-settings-currency': currency,
		'ccb-settings-send-form': sendForm,
		'ccb-settings-woo-checkout': wooCheckout,
		'ccb-settings-woo-products': wooProducts,
		'ccb-settings-total-summary': totalSummary,
		'ccb-settings-texts': totalSummary,
		'ccb-modal-window': ccbModalWindow,
	},

	data: () => ({
		id: null,
	}),

	async mounted() {
		await this.$store.dispatch('getGeneralSettings');
	},

	created() {
		this.id = this.$store.getters.getId;
	},

	computed: {
		getComponent() {
			return `ccb-settings-${this.tab}`
		},

		tab: {
			get() {
				return this.$store.getters.getTab
			},

			set(value) {
				this.$store.commit('updateTab', value)
			}
		},

		remove_quick_tour_css() {
			if ( this.getStep === '.calc-quick-tour-settings' ||  this.getStep === '.calc-quick-tour-conditions' ) {
				return {
					zIndex: 1001,
					position: 'relative',
				}
			}
		}
	},

	methods: {
		updateTab(value) {
			this.getTab = value
		}
	},

	destroyed() {
		const $settings_item = document.querySelectorAll('.calc-quick-tour-settings-item');
		if ( $settings_item.length > 0 ) {
			$settings_item.forEach($s_i => $s_i.removeEventListener('click', this.settingsItemClickToggle))
		}
	},
}
