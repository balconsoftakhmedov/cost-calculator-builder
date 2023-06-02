import CBuilderFront from '../../../../frontend/components/cost-calc' // main-component front

import preview from '../calculator/partials/preview'
import ccbModalWindow from '../../utility/modal';
import appearanceRow from './appearance-row'
import loader from "../../../../loader";
import {toast} from "../../../../utils/toast";
import quickTourMixin from "../quick-tour/quickTourMixin";

export default {
	mixins: [quickTourMixin],
	components: {
		'calc-builder-front': CBuilderFront, // Front main component and Preview
		'preview': preview,
		'ccb-modal-window': ccbModalWindow,
		'appearance-row': appearanceRow,
		loader,
	},

	data: () => ({
		tab: 'desktop',
		settings: {},
		preloader: false,

	}),

	async mounted() {
		this.settings = this.$store.getters.getSettings;
	},

	computed: {
		appearance: {
			get() {
				return this.$store.getters.getAppearance;
			},

			set(value) {
				this.$store.commit('setAppearance', value);
			}
		},

		presets: {
			get() {
				return this.$store.getters.getPresets
			},

			set(value) {
				this.$store.commit('setPresets', value);
			}
		},

		presetIdx: {
			get() {
				return +this.$store.getters.getPresetIdx || 0;
			},

			set(value) {
				this.$store.commit('setPresetIdx', value);
			}
		},

		getContainerId() {
			return this.preview === 'mobile' ? 'ccb-mobile-preview' : 'ccb-desktop-preview';
		},

		settingsField: {
			get() {
				return this.$store.getters.getSettings;
			},

			set(value) {
				this.$store.commit('updateSettings', value);
			}
		},

		box_style: {
			get() {
				return this.settingsField.general?.boxStyle || 'vertical'
			},

			set(value) {
				const settingsField = this.settingsField
				settingsField.general.boxStyle = value
				this.settingsField = settingsField
			}
		},

		fields() {
			const fields = this.appearance[this.tab]
			return fields || [];
		},

		get_styles() {
			if (this.presets.length === 1)
				return {
					opacity: 0.7,
					pointerEvents: 'none',
				}

			return {}
		}
	},

	methods: {
		updatePresetColors() {
			const desktopColors = this.getElementAppearanceStyleByPath(this.appearance, 'desktop.colors.data');
			const presets = JSON.parse(JSON.stringify(this.presets));
			const currentPreset = presets[this.presetIdx]

			if ( currentPreset && desktopColors ) {
				currentPreset.bottom_left = desktopColors.secondary_color;
				currentPreset.bottom_right = desktopColors.accent_color
				currentPreset.top_left = desktopColors.container
				currentPreset.top_right = desktopColors.primary_color
				presets[this.presetIdx] = currentPreset;
				this.presets = presets;
			}
		},

		async selectPreset(idx) {

			if ( this.getStep !== 'done' ) {
				this.quickTourNextStep('.calc-quick-tour-appearance-presets', window.$calcGlobalTour)
				return
			}

			if (this.presetIdx === idx)
				return;

			this.presetIdx = idx;
			this.preloader = true

			const data = await fetch(`${window.ajaxurl}?` + new URLSearchParams({
				action: 'ccb_update_preset',
				calc_id: this.$store.getters.getId,
				nonce: window.ccb_nonces.ccb_update_preset,
				selectedIdx: idx,
			}));

			const response = await data.json();
			if ( response && response.success ) {
				this.presets = response.list;
				this.appearance = response.data;
			}

			setTimeout(() => this.preloader = false, 500)
		},

		async addPreset() {
			this.preloader = true;

			const data = await fetch(`${window.ajaxurl}?` + new URLSearchParams({
				action: 'ccb_add_preset',
				calc_id: this.$store.getters.getId,
				nonce: window.ccb_nonces.ccb_add_preset,
				selectedIdx: this.presets.length,
			}));

			const response = await data.json();
			if ( response && response.success ) {
				this.presets = response.list;
				this.appearance = response.data;
				this.presetIdx = this.presets.length - 1;
			}

			setTimeout(() => {
				this.preloader = false;
				toast('Preset added successfully', 'success');
			}, 500)
		},

		async removePreset(idx) {
			if ( ! confirm( 'Are you sure to delete this preset?' ) )
				return

			this.preloader = true;

			if (this.presets.length === this.presetIdx)
				this.presetIdx = this.presets.length - 1;
			else if (this.presetIdx > idx)
				this.presetIdx = this.presetIdx - 1;
			else if (this.presetIdx === idx || this.presets.length < this.presetIdx)
				this.presetIdx = 0;

			const data = await fetch(`${window.ajaxurl}?` + new URLSearchParams({
				action: 'ccb_delete_preset',
				calc_id: this.$store.getters.getId,
				nonce: window.ccb_nonces.ccb_delete_preset,
				selectedIdx: this.presetIdx,
				idx: idx,
			}));

			const response = await data.json();
			if ( response && response.success ) {
				this.presets = response.list;
				this.appearance = response.data;
			}

			setTimeout(() => {
				this.preloader = false;
				toast('Preset deleted successfully', 'success');
			}, 500)
		}
	}
}