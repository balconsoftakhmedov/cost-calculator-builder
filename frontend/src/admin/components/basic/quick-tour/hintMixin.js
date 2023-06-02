export default {
	props: ['type'],
	data: () => ({
		firstLoad: true,
		calcHint: null,
		settings_hint_slug: 'send-form',
		tab_list: ['calculators', 'conditions', 'settings'],
	}),

	mounted() {
		if ( this.firstLoad ) {
			this.startHint()
			this.firstLoad = false
		}
	},

	methods: {
		startHint() {
			if ( ! (Array.isArray(this.getHint) && this.getHint.includes(this.type)) && this.getStep === 'done' && this.hintProActive )
				setTimeout(() => this.renderHint(), 100)
		},

		renderHint() {
			const tourData = this.getHintStorage()
			if ( tourData ) {
				this.calcHint = new CalcQuickTour(tourData)
				this.calcHint.show();
			}
		},

		getHintStorage() {
			const vm = this;
			const data = {
				calculators: [
					{
						hint: true,
						target: '.ccb-hint-fields-container',
						type: 'big settings default-cursor ccb-hint-calculators',
						documentation: 'https://docs.stylemixthemes.com/cost-calculator-builder/',
						title: 'There are now four Pro elements available to you.',
						content: 'The Pro version has the following elements and many features are available that can improve your calculator: ',
						content_html: `
							<div class="calc-quick-tour-settings-container">
								${ vm.getHintProFields().map(field => {
									return `
											<div class="calc-quick-tour-settings-item">
												<span>${ field.title }</span>
												<span class="calc-q-t-settings-icon-box">
													<i class="${ field.icon }"></i>
												</span>
												<span>${ field.description }</span>
											</div>
									`
								}).join('') }
							</div>
						`,
						position: {
							bottom: '10px',
							left: '10px'
						},
						arrowPosition: 'none',
						buttons: [
							{
								text: 'Got it',
								type: 'success',
								click(calcQuickTour) {
									vm.skipHintStep(vm.type)
									calcQuickTour.hide()
								},
							}
						]
					},
				],
				conditions: [
					{
						hint: true,
						target: `.calc-quick-tour-flowchart-no-elements`,
						type: 'big default-cursor ccb-hint-conditions',
						documentation: 'https://docs.stylemixthemes.com/cost-calculator-builder/',
						title: `<span class="ccb-quick-tour-title-inner">Conditions</span>`,
						content: 'Drag-drop elements to the workplace and make connections between them. Then, add conditions by clicking on the circle button in the chain between elements.',
						content_html: '<p class="calc-quick-tour-content-html-text">You can create single or many conditions for one connection, but they should be logically correct and used for proper elements.</p>',
						position: {
							bottom: '10px',
							right: '10px'
						},
						arrowPosition: 'none',
						buttons: [
							{
								text: 'Got it',
								type: 'success',
								click(calcQuickTour) {
									vm.skipHintStep(vm.type)
									calcQuickTour.hide()
								},
							}
						]
					},
				],
				settings: [
					{
						hint: true,
						target: '.ccb-settings-tab-content',
						type: 'big default-cursor settings ccb-hint-settings',
						documentation: 'https://docs.stylemixthemes.com/cost-calculator-builder/',
						title: 'Settings',
						content: 'The Pro version has the following settings available for your business needs.',
						content_html: `
							<div class="calc-quick-tour-settings-container">
									${ vm.getCalcSettings.filter(settings => typeof settings === "object" && settings.in_pro).map(settings => {
									return `
											<div class="calc-quick-tour-settings-item${ vm.settings_slug === settings.slug ? ' ccb-active' : '' }" data-slug="${ settings.slug }">
												<span>${ settings.tour_title }</span>
												<span class="calc-q-t-settings-icon-box">
													<i class="${ settings.icons }"></i>
												</span>
												<span>${ settings.tour_description }</span>
											</div>
										`
								}).join('') }
							</div>
						`,
						position: {
							bottom: '10px',
							right: '10px'
						},
						arrowPosition: 'none',
						buttons: [
							{
								text: 'Got it',
								type: 'success',
								click(calcQuickTour) {
									vm.skipHintStep(vm.type)
									calcQuickTour.hide()
								},
							}
						]
					}
				]
			}
			return data[this.type] || null
		},

		getHintProFields() {
			return [
				{
					title: 'File Upload',
					description: 'Allows users to upload files in different sizes, quantities, and formats.',
					icon: 'ccb-icon-Path-2572',
				},
				{
					title: 'Multi-range Slider',
					description: 'Lets the user swiftly slide through possible values spread over the desired range.',
					icon: 'ccb-icon-Union-6',
				},
				{
					title: 'Date Picker',
					description: 'Allows the user to select a date or date ranges from a calendar.',
					icon: 'ccb-icon-Path-3513',
				},
				{
					title: 'Image Dropdown',
					description: 'You can include a set of images for customers to choose from in the drop-down list.\n',
					icon: 'ccb-icon-Union-30',
				},
				{
					title: 'Image Checkbox',
					description: 'Allows the users to select several options with an image among a set of pictures.\n',
					icon: 'ccb-icon-image-checkbox',
				},
				{
					title: 'Image Radio',
					description: 'Lets the user choose one option with an image among a set of pictures.\n',
					icon: 'ccb-icon-image-radio',
				},
			];
		},

		skipHintStep(hint) {
			const hints = this.getHint
			if ( ! hints.includes(hint) )
				hints.push(hint)

			this.$store.dispatch('skipHint', {hints})
		}
	},

	computed: {
		hintProActive() {
			if ( typeof ajax_window !== "undefined" && ajax_window.hasOwnProperty('pro_active') )
				return !! ajax_window.pro_active
			return false
		},

		getStep: {
			get() {
				return this.$store.getters.getQuickTourStep
			},

			set(value) {
				this.$store.commit('setQuickTourStep', value)
			}
		},

		getHint() {
			return this.$store.getters.getHints
		}
	},

	watch: {
		'$store.getters.getQuickTourStep': function (value) {
			if ( value === 'done' )
				this.startHint()
		},

		'$store.getters.getCurrentTab': function (value) {
			const hint = document.querySelector(`.calc-quick-tour.ccb-hint-${value}`)
			if ( ! this.firstLoad && ! hint ) {
				this.startHint()
			}
		}
	},
}
