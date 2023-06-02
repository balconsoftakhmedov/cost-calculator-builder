import calculatorList from '../basic';
import calculatorTab from '../basic/tab';
import demoImport from '../basic/calculator/partials/demo-import';
import templatesContainer from '../templates/template-container'
import ccbEmbed from '../embed/embed'

export default {
	components: {
		'templates-container': templatesContainer,
		'calculators-list': calculatorList,
		'calculators-tab': calculatorTab,
		'ccb-demo-import': demoImport,
		'ccb-embed': ccbEmbed
	},

	data: () => ({
		calcId: null,
		step: 'list',
		preloader: false,
		calcQuickTourStarted: false
	}),

	created() {
		if (this.$checkUri('action') === 'edit' && this.$checkUri('id')) {
			if (this.getTourStep !== 'done')
				this.getTourStep = '.calc-quick-tour-title-box'
			this.editCalc({ id: this.$checkUri('id'), step: 'create' });
		} else {
			if (this.getTourStep !== 'done')
				this.getTourStep = 'quick_tour_start'
		}
	},

	methods: {
		showEmbed(id) {
			this.$refs.embedCalc.showEmbedPopup(id)
		},
		editCalc({id, step}) {
			const isCreate = step === 'create';
			this.$store.commit('setHideHeader', step === 'demo-import' ? false : isCreate);
			this.calcId = id;
			this.step = step;
		},
	},

	computed: {
		getTourStep: {
			get() {
				return this.$store.getters.getQuickTourStep
			},

			set(value) {
				this.$store.commit('setQuickTourStep', value)
			}
		},
	}
};
