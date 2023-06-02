export default {
	data: () => ({
		calcQuickTour: null,
		settings_slug: 'total-summary',
	}),

	methods: {
		renderQuickTour() {
			const tourData = this.getQuickTourStorage()
			const fields = this.$store.getters.getBuilder;

			if ( fields.length === 0 ) {
				this.$store.commit('setTitle', this.getQuickTourData.title);
				const quickTourFields = this.getQuickTourData.fields;

				if ( quickTourFields && quickTourFields.length > 0 ) {
					quickTourFields.forEach(f => fields.push(f))
				}
			}

			this.calcQuickTour = new CalcQuickTour(tourData)
			this.calcQuickTour.show();

			setTimeout(() => this.initListeners(), 300)
		},

		quickTourNextStep(target, chain = null) {
			if ( chain && chain._chainNext ) {
				if ( target === chain.target ) {
					chain.buttons[0].click(chain, null, target === '.calc-quick-tour-edit-field')
				} else {
					this.quickTourNextStep(target, chain._chainNext)
				}
			}
		},

		initListeners() {
			if ( this.getStep === '.calc-quick-tour-title-box' ) {
				const $approveBtn = document.querySelector('.ccb-title-approve.ccb-icon-Path-3484')
				if ( $approveBtn )
					$approveBtn.addEventListener('click', this.titleBoxNextHandler)
			}
		},

		titleBoxNextHandler() {
			const $nextTipBtn = document.querySelector('.ccb-q-t-btn-container-inner > button.success')
			if ($nextTipBtn)
				$nextTipBtn.click()

			const $approveBtn = document.querySelector('.ccb-title-approve.ccb-icon-Path-3484')
			$approveBtn.removeEventListener('click', this.titleBoxNextHandler)
		},

		settingsItemClickToggle(e) {
			e.stopPropagation()
			this.settingsItemClick(e.target.classList.contains('calc-quick-tour-settings-item') ? e.target : e.target.parentNode)
		},

		settingsItemClick(target) {
			target = target || { dataset: null }
			if ( target.dataset.slug ) {
				this.settings_slug = target.dataset.slug;
				const settings = this.getCalcSettings.find(s => s.slug === this.settings_slug)
				if ( ! this.proActive && settings && settings.in_pro )
					return

				this.$store.commit('updateTab', target.dataset.slug)
				this.getTab = target.dataset.slug
				document.querySelector('.calc-quick-tour-settings-item.ccb-active').classList.remove('ccb-active')
				target.classList.add('ccb-active')
			}
		},

		getQuickTourStorage() {
			const vm = this;
			return [
				{
					target: '.calc-quick-tour-title-box',
					title: 'Name your calculator',
					position: 'bottom',
					buttons: [
						{
							text: 'Next tip',
							type: 'success',
							click(calcQuickTour) {
								vm.$emit('edit-title', false);
								vm.showElements = true
								if ( calcQuickTour._chainNext && calcQuickTour._chainNext.target ) {
									const body = document.querySelector('body');
									if (body && ! body.classList.contains('ccb-border-wrap'))
										body.classList.add('ccb-border-wrap')

									vm.getStep = calcQuickTour._chainNext.target
									calcQuickTour.switchToChainNext()
									window.$calcGlobalTour = calcQuickTour._chainNext
								}
							},
						},
						{
							text: 'Skip all',
							className: '',
							type: 'info',
							click(calcQuickTour) {
								vm.$emit('edit-title', false);
								vm.skipQuickTour(calcQuickTour)
							}
						}
					]
				},
				{
					target: '.calc-quick-tour-elements',
					type: 'medium m-b-10',
					title: 'Drag and drop the elements',
					content: 'Move the custom elements to builder’s workplace to create the calculator.',
					position: 'right',
					documentation: 'https://docs.stylemixthemes.com/cost-calculator-builder/calculator-elements/general-overview',
					buttons: [
						{
							text: 'Next tip',
							type: 'success',
							click(calcQuickTour) {
								vm.showElements = false;
								const field = vm.getFields.length > 0 ? vm.getFields[vm.getFields.length - 1] : vm.getters.getFields[0]
								vm.editField(null, field.type, vm.getFields.length - 1);
								vm.removeBorderClassList()
								setTimeout(() => {
									if ( calcQuickTour._chainNext && calcQuickTour._chainNext.target ) {
										vm.getStep = calcQuickTour._chainNext.target
										calcQuickTour.switchToChainNext()
										window.$calcGlobalTour = calcQuickTour._chainNext
									}
								}, 250)
							},
						},
						{
							text: 'Skip all',
							className: '',
							click: function (calcQuickTour) {
								vm.showElements = false;
								vm.skipQuickTour(calcQuickTour)
							},
							type: 'info',
						}
					]
				},
				{
					target: '.calc-quick-tour-edit-field',
					type: 'medium m-b-10',
					title: 'Set-up fields of custom element',
					content: 'Enter the name of the element and set the parameters, then  click “Save” button',
					position: 'center-left',
					documentation: 'https://docs.stylemixthemes.com/cost-calculator-builder/calculator-elements/general-overview',
					buttons: [
						{
							text: 'Next tip',
							type: 'success',
							click(calcQuickTour) {
								vm.$store.commit('setEditFieldError', 'save_field')
								setTimeout(() => {
									if ( vm.$store.getters.getEditFieldError === true )
										return

									const { conditions } = vm.getQuickTourData;
									vm.$store.commit('setConditions', conditions);
									vm.$emit('set-step', 'conditions');

									setTimeout(() => {
										if ( calcQuickTour._chainNext && calcQuickTour._chainNext.target ) {
											vm.getStep = calcQuickTour._chainNext.target
											vm.$store.commit('setEditFieldError', false)
											calcQuickTour.switchToChainNext()
										}
									}, 200)
								})
							},
						},
						{
							text: 'Skip all',
							className: '',
							click: function (calcQuickTour) {
								vm.skipQuickTour(calcQuickTour)
							},
							type: 'info',
						}
					]
				},
				{
					target: `.calc-quick-tour-conditions`,
					arrowTarget: '.calc-quick-tour-flowchart-no-elements',
					type: 'big',
					documentation: 'https://docs.stylemixthemes.com/cost-calculator-builder/pro-plugin-features/conditional-system',
					title: `<span class="ccb-quick-tour-title-inner">Conditions</span>${ vm.proActive ? `` : `<span class="ccb-quick-tour-pro-badge"><span class="ccb-icon-Path_3615"></span><span>PRO</span></span>` }`,
					content: 'Drag-drop elements to the workplace and make connections between them. Then, add conditions by clicking on the circle button in the chain between elements.',
					content_html: '<p class="calc-quick-tour-content-html-text">You can create single or many conditions for one connection, but they should be logically correct and used for proper elements.</p>',
					position: {
						bottom: '10px',
						right: '10px'
					},
					arrowPosition: 'none',
					buttons: [
						{
							text: 'Next tip',
							type: 'success',
							click(calcQuickTour) {
								vm.$emit('set-step', 'settings');
								setTimeout(() => {
									if ( calcQuickTour._chainNext && calcQuickTour._chainNext.target ) {
										vm.getStep = calcQuickTour._chainNext.target
										calcQuickTour.switchToChainNext()
										window.$calcGlobalTour = calcQuickTour._chainNext
									}
									const $settings_item = document.querySelectorAll('.calc-quick-tour-settings-item');
									if ( $settings_item.length > 0 ) {
										$settings_item.forEach($s_i => $s_i.addEventListener('click', vm.settingsItemClickToggle))
									}
								}, 200)
							},
						},
						{
							text: 'Skip all',
							className: '',
							click: function (calcQuickTour) {
								vm.skipQuickTour(calcQuickTour)
							},
							type: 'info',
						}
					]
				},
				{
					target: '.calc-quick-tour-settings',
					type: 'big settings',
					documentation: 'https://docs.stylemixthemes.com/cost-calculator-builder/plugin-features/cost-calculator-settings#individual-settings',
					title: 'Settings',
					content: `<b>The Settings</b> option gives you the opportunity to change default settings.`,
					content_html: `
						<div class="calc-quick-tour-settings-container">
							${ vm.getCalcSettings.filter(settings => typeof settings === "object" && settings.hasOwnProperty('tour_title')).map(settings => {
								return `
										<div class="calc-quick-tour-settings-item${ vm.settings_slug === settings.slug ? ' ccb-active' : '' }" data-slug="${ settings.slug }">
											<span>${ settings.tour_title }${ (! vm.proActive && settings.in_pro) ? `<span class="ccb-quick-tour-pro-badge small"><span class="ccb-icon-Path_3615"></span><span>PRO</span></span>` : `` }</span>
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
							text: 'Next tip',
							type: 'success',
							click(calcQuickTour) {
								vm.$emit('set-step', 'appearances');
								setTimeout(() => {
									if ( calcQuickTour._chainNext && calcQuickTour._chainNext.target ) {
										vm.getStep = calcQuickTour._chainNext.target
										calcQuickTour.switchToChainNext()
										window.$calcGlobalTour = calcQuickTour._chainNext
									}
								}, 200)
							},
						},
						{
							text: 'Skip all',
							className: '',
							click: function (calcQuickTour) {
								vm.skipQuickTour(calcQuickTour)
							},
							type: 'info',
						}
					]
				},
				{
					target: '.calc-quick-tour-box-styles',
					type: 'medium box-style m-b-10',
					title: 'Choose box style',
					content: `You can select the orientation of your calculator.`,
					position: 'bottom',
					documentation: 'https://docs.stylemixthemes.com/cost-calculator-builder/plugin-features/calculator-customization#box-style',
					buttons: [
						{
							text: 'Next tip',
							type: 'success',
							click(calcQuickTour) {
								if ( calcQuickTour._chainNext && calcQuickTour._chainNext.target ) {
									vm.getStep = calcQuickTour._chainNext.target
									calcQuickTour.switchToChainNext()
									window.$calcGlobalTour = calcQuickTour._chainNext
								}
							},
						},
						{
							text: 'Skip all',
							className: '',
							click: function (calcQuickTour) {
								vm.skipQuickTour(calcQuickTour)
							},
							type: 'info',
						}
					]
				},
				{
					target: '.calc-quick-tour-appearance-presets',
					type: 'medium m-b-10',
					title: 'Style Presets',
					content: `Choose the Presets of the color options to change the global appearance of the Calculator.`,
					documentation: 'https://docs.stylemixthemes.com/cost-calculator-builder/plugin-features/calculator-customization#colors',
					position: {
						top: '75px',
						right: '77px'
					},
					arrowPosition: 'center-right',
					buttons: [
						{
							text: 'Next tip',
							type: 'success',
							click(calcQuickTour) {
								if ( calcQuickTour._chainNext && calcQuickTour._chainNext.target ) {
									vm.getStep = calcQuickTour._chainNext.target
									calcQuickTour.switchToChainNext()
									window.$calcGlobalTour = calcQuickTour._chainNext
								}
							},
						},
						{
							text: 'Skip all',
							className: '',
							click: function (calcQuickTour) {
								vm.skipQuickTour(calcQuickTour)
							},
							type: 'info',
						}
					]
				},
				{
					target: '.calc-quick-tour-property-container',
					type: 'medium m-b-10',
					title: 'Customize the styles for Desktop and Mobile',
					content: `Adjust settings of Colors, Typography, Spacing & Positions to make the calculator responsive.`,
					position: 'center-right',
					documentation: 'https://docs.stylemixthemes.com/cost-calculator-builder/plugin-features/calculator-customization#colors',
					buttons: [
						{
							text: 'Next tip',
							type: 'success',
							click(calcQuickTour) {
								if ( calcQuickTour._chainNext && calcQuickTour._chainNext.target ) {
									this.quickTourStarted = false
									vm.getStep = calcQuickTour._chainNext.target
									calcQuickTour.switchToChainNext()
									window.$calcGlobalTour = calcQuickTour._chainNext
								}
							},
						}
					]
				},
				{
					target: '.calc-quick-tour-ccb-button',
					type: 'small',
					title: 'Save calculator',
					position: {
						top: '-10px',
						right: '105px'
					},
					arrowPosition: 'center-right',
					buttons: []
				},
			]
		},

		skipQuickTour(calcQuickTour) {
			this.getStep = 'done'
			calcQuickTour.hide()
			this.removeBorderClassList()
			this.quickTourStarted = false
			this.$store.dispatch('skipCalcQuickTour')
		},

		removeBorderClassList() {
			const body = document.querySelector('body.ccb-border-wrap');
			if (body)
				body.classList.remove('ccb-border-wrap')
		}
	},

	computed: {
		proActive() {
			if ( typeof ajax_window !== "undefined" && ajax_window.hasOwnProperty('pro_active') )
				return !! ajax_window.pro_active
			return false
		},

		getters() {
			return this.$store.getters;
		},

		getCalcSettings() {
			return Object.entries((this.getters.getSettings || {})).map(([ key, value ]) => ({ key, ...value }))
		},

		getStep: {
			get() {
				return this.getters.getQuickTourStep
			},

			set(value) {
				this.$store.commit('setQuickTourStep', value)
			}
		},

		quickTourStarted: {
			get() {
				return this.getters.getQuickTourStarted
			},

			set(value) {
				this.$store.commit('setQuickTourStarted', value)
			}
		},

		getQuickTourData() {
			return this.getters.getQuickTourData
		},
	},
}