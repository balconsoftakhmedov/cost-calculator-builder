export default {
	props: ['embedText'],
	data() {
		return {
			calculatorId: 0,
			multiSelect: false,
			status: false,
			popupStatus: false,
			newPageName: '',
			accStatus: {
				select: false,
				create: false,
				insert: false
			},
			pages: [],
			selectedPages: []
		}
	},
	
	mounted() {
		this.getPages();
	},
	
	computed: {
		getText() {
			return JSON.parse(this.embedText)
		},
		shortCode() {
			return `[stm-calc id="${this.calculatorId}"]`
		}
	},
	
	methods: {
		async createPage() {
			let formData = new FormData();
			let data = {
				page_name: this.newPageName,
				calculator_id: this.calculatorId
			}
			formData.append('action', 'embed-create-page');
			formData.append('nonce', window.ccb_nonces.embed_create_page);
			formData.append('data', JSON.stringify(data));
			
			let response = await fetch(ajax_window.ajax_url, {
				method: 'POST',
				body: formData,
			}).then(response => response.json())
			
			window.location.href = response.url
			
		},
		
		async getPages() {
			let formData = new FormData();
			formData.append('action', 'embed-get-pages');
			formData.append('nonce', window.ccb_nonces.embed_get_pages);
			
			let response = await fetch(ajax_window.ajax_url, {
				method: 'POST',
				body: formData,
			}).then(response => response.json())
			
			this.pages = response.pages.map(page => {
				return {
					id: page.id,
					title: page.title.length < 8 ? page.title : page.title.substr(0, 8) + '...'
				}
			})
		},
		
		async insertPages() {
			let formData = new FormData();
			let data = {
				pages: this.selectedPages,
				calculator_id: this.calculatorId
			}
			formData.append('action', 'embed-insert-pages');
			formData.append('nonce', window.ccb_nonces.embed_insert_pages);
			formData.append('data', JSON.stringify(data));
			
			let response = await fetch(ajax_window.ajax_url, {
				method: 'POST',
				body: formData,
			}).then(response => response.json()).then((success) => {
				this.closePopup();
				this.selectedPages = []
			})
			
		},
		
		showEmbedPopup(id) {
			this.calculatorId = id;
			this.status = true
			
			setTimeout(() => {
				this.popupStatus = true
			}, 50)
			
		},
		closePopup() {
			this.status = false
			this.popupStatus = false
			this.multiSelect = false
		},
		toggleAccordion(name) {
			this.accStatus[name] = !this.accStatus[name]
		},

		multiselectShow( event ) {
			this.multiSelect = !this.multiSelect
		},

		multiselectChooseTotals(page) {
			const inArray = this.selectedPages.find(f => f.id === page.id);
			if (inArray)
				return this.removePage(page);
			
			this.selectedPages.push(page);
		},
		
		removeId(page) {
			this.selectedPages = this.selectedPages.filter(f => f.id !== page.id);
		},
		
		copyText() {
			const element = this.$refs.shortcode;
			element.select();
			element.setSelectionRange(0, 99999);
			document.execCommand('copy');
			alert(this.getText.copyText);
		},
		
		removePage(page) {
			const existIndex = this.selectedPages.indexOf(page);
			if (existIndex !== -1)
				this.selectedPages.splice(existIndex, 1);
		},
	},

	template:
			`
				<div class="ccb-embed" :class="{active: status}">
					<div class="ccb-embed-overlay">
						<div class="ccb-embed-popup" :class="{active: popupStatus}">

							<div class="ccb-embed-popup__header">
								<div class="ccb-embed-popup__title">
									{{ getText.title }}
								</div>
								<div class="ccb-embed-popup-subtitle">
									{{ getText.subtitle }}
								</div>
								<div class="ccb-embed-popup__close" @click="closePopup">
									<span class="ccb-icon-close"></span>
								</div>
							</div>
							<div class="ccb-embed-popup__body">
							<div class="ccb-embed-popup-accordion" :class="{active: accStatus.insert}">
									<div class="ccb-embed-popup-accordion__body">
										<div class="ccb-embed-popup-accordion__info">
											<div class="ccb-embed-popup-accordion__icon">
												<div>
													<span class="ccb-icon-Path-3494"></span>
												</div>
											</div>
											<div class="ccb-embed-popup-accordion__main">
												<div class="ccb-embed-popup-accordion__title">
													{{ getText.insert }}
												</div>
												<div class="ccb-embed-popup-accordion__subtitle">
													{{ getText.insert_subtitle }}
												</div>
											</div>
										</div>
										<div class="ccb-embed-popup-accordion__close" @click="toggleAccordion('insert')">
											<div>
												<span class="ccb-icon-Path-3485"></span>
											</div>
										</div>
									</div>
									<div class="ccb-embed-popup-accordion__footer">
										<div class="ccb-embed-popup-clipboard">
											<label for="shortcode">
												{{ getText.shortcode }}:
											</label>
											<div class="input-wrapper">
												<input id="shortcode" ref="shortcode" type="text" :value="shortCode"/>
												<span class="input-copy" @click="copyText">
													<span class="ccb-icon-Path-3400"></span>
												</span>
											</div>
										</div>
									</div>
								</div>
								<div class="ccb-embed-popup-accordion" :class="{active: accStatus.select}">
									<div class="ccb-embed-popup-accordion__body">
										<div class="ccb-embed-popup-accordion__info">
											<div class="ccb-embed-popup-accordion__icon">
												<div>
													<span class="ccb-icon-circle-plus"></span>
												</div>
											</div>
											<div class="ccb-embed-popup-accordion__main">
												<div class="ccb-embed-popup-accordion__title">
													{{ getText.select_page }}
												</div>
												<div class="ccb-embed-popup-accordion__subtitle">
													{{ getText.select_page_subtitle }}
												</div>
											</div>
										</div>
										<div class="ccb-embed-popup-accordion__close" @click="toggleAccordion('select')">
											<div>
												<span class="ccb-icon-Path-3485"></span>
											</div>
										</div>
									</div>
									<div class="ccb-embed-popup-accordion__footer">
										<div class="ccb-embed-popup-accordion-select">
											<div class="ccb-select-box">
												<div class="multiselect" :class="{'visible': this.multiSelect}">
												<span v-if="selectedPages.length > 0 && selectedPages.length <= 3" class="anchor ccb-heading-5 ccb-light-3 ccb-selected" @click.prevent="multiselectShow(event)">
													<span class="selected-payment" v-for="page in selectedPages">
														{{ page.title }}
														<i class="ccb-icon-close" @click="removePage(page)"></i>
													</span>
												</span>
												<span v-else-if="selectedPages.length > 0 && selectedPages.length > 3" class="anchor ccb-heading-5 ccb-light ccb-selected" @click.prevent="multiselectShow(event)">
													{{ selectedPages.length }} {{ getText.pages_selected }}
												</span>
												<span v-else class="anchor ccb-heading-5 ccb-light-3" @click.prevent="multiselectShow(event)">
													{{ getText.page_select }}
												</span>
												<ul class="items row-list settings-list totals">
													<li class="option-item settings-item" v-for="page in pages" @click="multiselectChooseTotals(page)">
														<input :id="page.id" name="paypalTotals" class="index" type="checkbox" :checked="selectedPages.includes(page)" @change="multiselectChooseTotals(page)"/>
														<label :for="page.id" class="ccb-heading-5">{{ page.title | to-short }}</label>
													</li>
												</ul>
												<input name="options" type="hidden" />
											</div>
											</div>
											<button @click="insertPages" :class="{'active': selectedPages.length > 0}"> {{ getText.apply }} </button>
										</div>
									</div>
								</div>
								<div class="ccb-embed-popup-accordion" :class="{active: accStatus.create}">
									<div class="ccb-embed-popup-accordion__body">
										<div class="ccb-embed-popup-accordion__info">
											<div class="ccb-embed-popup-accordion__icon">
												<div>
													<span class="ccb-icon-radius"></span>
												</div>
											</div>
											<div class="ccb-embed-popup-accordion__main">
												<div class="ccb-embed-popup-accordion__title">
													{{ getText.create_page }}
												</div>
												<div class="ccb-embed-popup-accordion__subtitle">
													{{ getText.create_page_subtitle }}
												</div>
											</div>
										</div>
										<div class="ccb-embed-popup-accordion__close" @click="toggleAccordion('create')">
											<div>
												<span class="ccb-icon-Path-3485"></span>
											</div>
										</div>
									</div>
									<div class="ccb-embed-popup-accordion__footer">
										<div class="ccb-embed-popup-create">
											<input :placeholder="getText.create_placeholder" v-model="newPageName" />
											<button @click="createPage">{{ getText.create_button }}</button>
										</div>
									</div>
								</div>
							</div>

						</div>
					</div>
				</div>
			`
}
