export default {
	state: {
		pdfString: '',
		fieldsKey: 0,
		currentTab: 'calculators',
		errorIdx: [],
		access: false,
		hideHeader: false,
		allowStripe: false,
		presets: {},
		builder: [],
		count: 0,
		disableInput: false,
		existing: [],
		fields: [],
		formula: [],
		getFieldId: 0,
		editID: null,
		id: null,
		index: null,
		title: '',
		type: '',
		preset_idx: 0,
		hints: [],
		quickTourStarted: false,
		quickTourStep: 'quick_tour_start',
		quick_tour_data: null,
		editFieldError: false,
		cats: [],
		icons: [],

		calculators_count: 0,
		calculatorList: {
			limit: 15,
			page: 1,
			sortBy: 'id',
			status: 'all',
			direction: 'desc',
		},
		calculatorListDefault: {
			limit: 15,
			page: 1,
			sortBy: 'id',
			status: 'all',
			direction: 'desc',
		},
	},

	actions: {
		setFieldId({commit, getters}) {
			commit('setFieldId', getters.generateId)
		},

		updateStripeAction({commit}, val) {
			commit('updateStripeCommit', val)
		},

		async edit_calc({commit, state, getters}, {id}) {
			const request = new Promise((resolve) => {
				const data = {calc_id: id, action: 'calc_edit_calc', nonce: window.ccb_nonces.ccb_edit_calc}
				this._vm.$getRequest(window.ajaxurl, data, response => {
					resolve(response);
				})
			});

			request.then(response => {
				if (response.success) {
					if (response.cat) {
						commit('setIcons', Object.values(response.icons));
						commit('setCats', response.cats);
						commit('setCat', response.cat);
						commit('setIcon', response.icon);
						commit('setPluginType', response.pluginType);
						commit('setCalcLink', response.calcLink);
						commit('setCalcInfo', response.info);
						commit('setCalcDescription', response.calcDescription);
					}
					commit('setResponseData', response);
					commit('updateSettings', response.settings);
					commit('changeAccess', true);
					commit('setDisabledInput', true);
					commit('setAppearance', response.appearance);

					// pro-features
					commit('updateAll', state);
					commit('setConditions', state.conditions)
					commit('setResponseData', response.calculators);
				}
			})

			return await request;
		},

		async createId({commit, getters}) {
			if (!getters.getCreateNew) {
				commit('setCreateNew', true);
				const data = await fetch(`${window.ajaxurl}?action=calc_create_id&nonce=${window.ccb_nonces.ccb_create_id}`);
				const response = await data.json();
				commit('setResponseData', response);
				await commit('setCreateNew', false);
				commit('updateAll', response);
			}
		},

		async fetchExisting({state, commit, getters}) {
			const data = await fetch(`${window.ajaxurl}?` + new URLSearchParams({
				action: 'calc_get_existing',
				calc_id:  this._vm.$checkUri('id'),
				nonce: window.ccb_nonces.ccb_get_existing,
				...state.calculatorList,
			}));
			const response = await data.json();
			const {calculators, quick_tour_data, quick_tour_step, calc_hint_skipped } = response;
			let quickTourStep = quick_tour_step === 'skip' ? 'done' : quick_tour_step
			if (quickTourStep !== 'done') {
				commit('setQuickTourStarted', true)
			}

			commit('setQuickTourStep', quickTourStep)
			commit('setQuickTourData', quick_tour_data)
			commit('setHints', calc_hint_skipped)

			if (calculators.calculators_count === 0) {
				state.calculatorList = state.calculatorListDefault
				localStorage.setItem('ccb_list_filter', JSON.stringify(state.calculatorList));
			}

			if (calculators.existing.length === 0 && calculators.calculators_count > 0) {
				const page = state.calculatorList.page - 1
				commit('setCalculatorList', {...state.calculatorList, page})
				await this.dispatch('fetchExisting');
				return
			}
			commit('setResponseData', response.calculators);
		},

		async duplicateCalc({state, commit}, id) {
			const data = await fetch(`${window.ajaxurl}?` + new URLSearchParams({
				action: 'calc_duplicate_calc',
				calc_id: id,
				nonce: window.ccb_nonces.ccb_duplicate_calc,
				...state.calculatorList,
			}));
			const response = await data.json();
			commit('setResponseData', response.calculators);
			return response?.duplicated_id;
		},

		async duplicateBulkCalculator({state, commit}, ids) {
			const data = await fetch(`${window.ajaxurl}?` + new URLSearchParams({
				action: 'calc_duplicate_calc',
				calculator_ids: ids,
				nonce: window.ccb_nonces.ccb_duplicate_calc,
				...state.calculatorList,
			}));
			const response = await data.json();
			commit('setResponseData', response.calculators);
			return response;
		},

		async deleteCalc({state, commit}, id) {
			const data = await fetch(`${window.ajaxurl}?` + new URLSearchParams({
				action: 'calc_delete_calc',
				calc_id: id,
				nonce: window.ccb_nonces.ccb_delete_calc,
				...state.calculatorList,
			}));
			const response = await data.json();
			const {calculators} = response;

			if (calculators.calculators_count === 0) {
				state.calculatorList = state.calculatorListDefault
				localStorage.setItem('ccb_list_filter', JSON.stringify(state.calculatorList));
			}

			if (calculators.existing.length === 0 && calculators.calculators_count > 0 && state.calculatorList.page > 1) {
				const page = state.calculatorList.page - 1
				commit('setCalculatorList', {...state.calculatorList, page})
				await this.dispatch('fetchExisting');
				return
			}
			commit('setResponseData', response.calculators);
		},

		async deleteBulkCalculator({state, commit}, ids) {
			const limit = state.calculatorList.limit
			if (ids && ids.length > limit)
				ids = ids.filter((_, idx) => idx < limit)
			const data = await fetch(`${window.ajaxurl}?` + new URLSearchParams({
				action: 'calc_delete_calc',
				calculator_ids: ids,
				nonce: window.ccb_nonces.ccb_delete_calc,
				...state.calculatorList,
			}));
			const response = await data.json();
			const {calculators} = response;

			if (calculators.calculators_count === 0) {
				state.calculatorList = state.calculatorListDefault
				localStorage.setItem('ccb_list_filter', JSON.stringify(state.calculatorList));
			}

			if (calculators.existing.length === 0 && calculators.calculators_count > 0 && state.calculatorList.page > 1) {
				const page = state.calculatorList.page - 1
				commit('setCalculatorList', {...state.calculatorList, page})
				await this.dispatch('fetchExisting');
				return response
			}

			commit('setResponseData', response.calculators);
			return response;
		},

		async saveCalc() {
			const data = await fetch(window.ajaxurl + `?action=save_calc`);
			const response = await data.json();
			if (response.success)
				return true;
		},

		async updateStyles({commit, getters}) {
			commit('updateMainLoader', true);
			const data = {
				id: getters.getId,
				action: 'calc_save_custom',
				selectedIdx: getters.getPresetIdx,
				nonce: window.ccb_nonces.ccb_save_custom,
				content: JSON.stringify({appearance: getters.getAppearance})
			}

			this._vm.$postRequest(window.ajaxurl, data, response => {
				if (response && response.success) {
					commit('updateMainLoader', false);
				}
			})
		},

		skipCalcQuickTour() {
			const data = {
				action: 'calc_skip_quick_tour',
				nonce: window.ccb_nonces.calc_skip_quick_tour,
			}

			this._vm.$postRequest(window.ajaxurl, data, response => {
				if (response && response.success) {
					console.log(response)
				}
			})
		},

		skipHint({commit, getters}, {hints}) {
			const data = {
				hints,
				action: 'calc_skip_hint',
				nonce: window.ccb_nonces.calc_skip_hint,
			}

			this._vm.$postRequest(window.ajaxurl, data, response => {
				if (response && response.success) {
					commit('setHints', hints)
				}
			})
		}
	},

	mutations: {
		setIcons(state, icons) {
			state.icons = icons
		},

		setCats(state, cats) {
			state.cats = cats
		},

		setPdfString(state, value) {
			state.pdfString = value
		},
		setEditFieldError(state, value) {
			state.editFieldError = value
		},

		setQuickTourStarted(state, val) {
			state.quickTourStarted = val
		},

		setQuickTourData(state, data) {
			state.quick_tour_data = data;
		},

		setHints(state, idx) {
			state.hints = idx;
		},

		setQuickTourStep(state, step) {
			const stepVariant = localStorage.getItem('ccb_quick_tour_step') || 'quick_tour_start';
			if ( ['.calc-quick-tour-title-box', 'quick_tour_start'].includes(step) )
				localStorage.setItem('ccb_quick_tour_step', step || stepVariant);
			state.quickTourStep = step || stepVariant;
		},

		setPresets(state, presets) {
			state.presets = presets;
		},

		setErrorIdx(state, ids) {
			state.errorIdx = ids;
		},

		changeAccess(state, val) {
			state.access = val;
		},

		setCalculatorList(state, calculatorList) {
			state.calculatorList = calculatorList;
		},

		setCalculatorsCount(state, calculators_count) {
			state.calculators_count = calculators_count;
		},

		setHideHeader(state, val) {
			state.hideHeader = val;
		},

		setType(state, type) {
			state.type = type;
		},

		setId(state, id) {
			state.id = id;
		},

		setEditID(state, editID) {
			state.editID = editID;
		},

		setFields(state, fields) {
			state.fields = fields;
		},

		setTitle(state, title) {
			state.title = title;
		},

		setIndex(state, index) {
			state.index = index;
		},

		setFieldsKey(state, key) {
			state.fieldsKey = key
		},

		setCurrentTab(state, value) {
			state.currentTab = value
		},

		setBuilder(state, builder) {
			state.builder = builder;
		},

		setExisting(state, existing) {
			state.existing = existing;
		},

		updateStripeCommit(state, val) {
			state.allowStripe = val;
		},

		addBuilder(state, value, index) {
			if (typeof index !== "undefined")
				state.builder[index] = value
			else
				state.builder.push(value)
		},

		setFieldId(state, id) {
			state.getFieldId = id;
		},

		setDisabledInput(state, val) {
			state.disableInput = val;
		},

		setResponseData(state, response) {
			if ( response ) {
				for ( let [ key, value ] of Object.entries(response) ) {
					if ( key === "builder" )
						value = this._vm.$validateData(response.builder, 'builder')

					if ( typeof value !== "undefined" )
						state[key] = value;
				}
			}
		},

		checkAvailable(state) {
			if (typeof state.builder !== "undefined")
				state.builder.forEach((value, index) => {
					if (typeof value === "undefined" || !value.hasOwnProperty('_id')) {
						state.builder.splice(index, 1);
					}
				});
		},

		addToBuilder(state, fieldData) {
			if (fieldData.id === null) {
				if (fieldData.index || fieldData.index === 0) {

					const len = state.builder.length + 1;
					fieldData.index = (parseInt(fieldData.index) > state.builder.length)
						? state.builder.length
						: fieldData.index;

					let current = state.builder[fieldData.index];
					for (let i = fieldData.index; i < len; i++) {
						let next = state.builder[i + 1];
						state.builder[i + 1] = current;
						current = next;
					}

					state.builder.splice(fieldData.index, 1, fieldData.data);
				} else {
					state.builder.push(fieldData.data);
				}
			} else {
				state.builder.splice(fieldData.id, 1, fieldData.data);
			}
		},

		removeFromBuilder(state, id) {
			state.builder = state.builder.filter(field => field && field._id !== id);
		},

		removeFromBuilderByIdx(state, idx) {
			state.builder = state.builder.filter((_, fieldIdx) => fieldIdx !== idx);
		},

		setPresetIdx(state, idx) {
			state.preset_idx = idx;
		}
	},

	getters: {
		getIcons: state => state.icons,

		getCats: state => state.cats,

		getPdfString: state => state.pdfString,

		getEditFieldError: state => state.editFieldError,

		getHints: state => state.hints,

		getQuickTourStarted: state => state.quickTourStarted,

		getQuickTourData: state => state.quick_tour_data,

		getPresets: state => state.presets,

		getPresetIdx: state => state.preset_idx,

		getErrorIdx: state => state.errorIdx,

		getHideHeader: state => state.hideHeader,

		getCalculatorList: state => state.calculatorList,

		getCalculatorsCount: state => state.calculators_count,

		getId: state => state.id,

		getQuickTourStep: state => {
			const step = state.quickTourStep || localStorage.getItem('ccb_quick_tour_step')
			return step || 'quick_tour_start'
		},

		getType: state => state.type,

		getIndex: state => state.index,

		getCount: state => state.count,

		getTitle: state => state.title,

		getAccess: state => state.access,

		getEditID: state => state.editID,

		getExisting: state => state.existing,

		getFields: state => state.fields || [],

		getAllowStripe: state => state.allowStripe,

		getBuilder: state => state.builder || [],

		getFieldId: state => state.getFieldId || 0,

		getDisableInput: state => state.disableInput,

		updateCount: state => value => state.count += value,

		getFieldsKey: state => state.fieldsKey,

		getCurrentTab: state => state.currentTab,

		getFieldData: state => id => {
			return state.builder.find((e, i) => i === id) || {};
		},

		getFieldByAlias: state => alias => state.builder.find(e => e.alias === alias) || {},

		generateId(state) {
			let id = 0;
			let hasAccess = true;

			const ids = [];
			state.builder.forEach(e => ids.push(parseInt(e._id)));

			for (let i = 0; i < ids.length; i++)
				if (!ids.includes(i) && hasAccess) {
					hasAccess = false;
					id = i;
				}

			if (hasAccess) id = state.builder.length;
			return id;
		},

		getFormulas: function (state) {
			let _formula = '';
			const data = [];
			state.builder.forEach(function (element) {
				if (element.type === 'Total') {
					data.push({
						id: element._id,
						alias: element.alias,
						label: element.label,
						hidden: (element.hasOwnProperty('hidden')) ? element.hidden : null,
						formula: element.costCalcFormula,
						additionalStyles: element.additionalStyles,
						totalSymbol: element.totalSymbol,
						totalSymbolSign: element.totalSymbolSign
					});
				}
			});


			if (!data.length) {
				state.builder.forEach((element) => {
					if (element.alias && element.alias.indexOf('text_field') === -1)
						_formula += element.alias + ' + ';
				});

				let last = _formula.lastIndexOf(" ") - 1;
				_formula = _formula.substring(0, last);
				data.push({label: 'Total', formula: _formula, symbol: ''});
			}

			state.formula = data;
			return data;
		},
	}
}
