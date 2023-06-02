const getUnusedElements = elements => {

    /** Validation rules for required fields
     *  quantity must be higher than 0
     *  checkbox, toggle must have at least one selected element even if its value is 0
     *  dropDown, radio a value must be selected even if its value is 0
     *  datePicker must be choosen
     * **/

    return elements.filter(element => (
        (element.alias.indexOf('quantity') !== -1 && element.value <= 0)
        || ( ( element.alias.indexOf('file_upload') !== -1 && !element.checked ) )
        || ((element.alias.indexOf('checkbox') !== -1 || element.alias.indexOf('toggle') !== -1) && element.options.length <= 0)
        || (element.alias.indexOf('checkbox') !== -1 && element.options.length < element.minChecked)
        || ((element.alias.indexOf('dropDown') !== -1 || element.alias.indexOf('radio') !== -1) && (!element.options[0].temp || element.options[0].temp.length === 0))
        || (element.alias.indexOf('dropDown') !== -1 && !element.checked)
        || (element.alias.indexOf('datePicker') !== -1 && element.value <= 0)
        || (element.alias.indexOf('text_field') !== -1 && ( element.value.length <= 0 || element.value === 0 ) )
        || (element.alias.indexOf('multi_range_field') !== -1 && element.value === 0 )
        || (element.alias.indexOf('range_field') !== -1 && element.value === 0 )
        || element.value < 0)
    );
}

const notExist = (elements, element) => {
    return (elements.filter(e => e.alias === element.alias)).length === 0
}

export default {
    state: {
        paymentType: '',
        issuedOn: '',
        notices: {},
        $current: null,
        errorImg: null,
        successImg: null,
        activeConditions: [],
        calcStore: [],
        conditionBlocked: [],
        formula: [],
        open: false,
        subtotal: [],
        unusedFields: [],
        defaultImg: null,
        currentLocation: '',
        language: '',
        translations: {},
        dateFormat: '',
        appearance: {},
        proActive: false,
        loader: true,
        finalSummaryList: [],
        liveDemolocations: [
            'https://stylemixthemes.com',
        ],
    },

    getters: {
        getProActive: s => s.proActive,
        getOpen: s => s.open,
        getFormula: s => s.formula,
        getNotices: s => s.notices,
        getIssuedOn: s => s.issuedOn,
        getCurrent: s => s.$current,
        getErrorImg: s => s.errorImg,
        getDefaultImg: s => s.defaultImg,
        getSuccessImg: s => s.successImg,
        getPaymentType: s => s.paymentType,
        getUnusedFields: s => s.unusedFields,
        conditionBlocked: s => s.conditionBlocked,
        activeConditions: s => s.activeConditions,
        getCalcStore: s => s.calcStore,
        getSubtotal: s => JSON.parse(JSON.stringify(s.subtotal || [])),
        getCurrentLocation: state => state.currentLocation,
        getLanguage: state => state.language,
        getTranslations: state => state.translations,
        getDateFormat: state => state.dateFormat,
        getAppearance: state => state.appearance,
        getMainLoader: state => state.loader,
        getFinalSummaryList: state => state.finalSummaryList,

        getIsLiveDemoLocation(state) {
            return state.liveDemolocations.includes(state.currentLocation);
        },

        getDescriptions: (s , a, b) =>  (type = 'default') => {
            /** null for if field alias is false value **/
            const inCalculable = ['total', 'html', 'line', null];

            if (type === "default" || type === 'showZero') {
                inCalculable.push('text')
            }

            let descriptions = s.subtotal ?
                s.subtotal.filter(item => {
                    const fieldName = item.alias.replace(/\_field_id.*/, '');
                    return item.alias && !inCalculable.includes(fieldName);
                }) : [];

            if (type === 'showZero') {
                return descriptions.filter(f => f.addToSummary)
            }

            /** Remove empty fields from subtotal **/
            descriptions = descriptions.filter(d => {
                const fieldName = d.alias.replace(/\_field_id.*/, '');

                if ( d.summary_view === 'show_label_not_calculable' && !d.empty )
                    return true

                if ( fieldName === 'file_upload' && d.checked )
                    return true

                if ( fieldName === 'checkbox' && d.options.length ) {
                    return true
                }

                if ( fieldName === 'checkbox_with_img' && d.options.length ) {
                    return true
                }

                return d.value
            });

            return descriptions.filter(f => f.addToSummary)
        },

        isUnused: state => item => {
            const fields = state.unusedFields.filter(field => field.alias === item.alias)
            return fields.length > 0
        },

        hasUnusedFields: state => {
            const requiredFields = Object
                .values(state.calcStore)
                .filter(field => field.required)
                .filter(field => notExist(state.conditionBlocked, field))

            state.unusedFields = getUnusedElements(requiredFields);
            return state.unusedFields.length && state.unusedFields.length > 0
        },

        filterUnused: state => element => {
            state.unusedFields = state.unusedFields.filter(e => element && element.alias && e.alias !== element.alias)
        },
    },

    mutations: {
        setFinalSummaryList(state, value) {
            state.finalSummaryList = value
        },
        updateMainLoader(state, value) {
            state.loader = value;
        },

        setNotices(state, notices) {
            state.notices = notices || {};
        },

        setPaymentType(state, pType) {
            state.paymentType = pType || null;
        },

        setIssuedOn(state, issuedOn) {
            state.issuedOn = issuedOn || '';
        },

        removeActiveCondition(state, condition) {
            let index = state.activeConditions.findIndex(c => (c.optionFrom == condition.optionFrom
                && c.optionTo == condition.optionTo
                && c.sort == condition.sort
                && c.action == condition.action));

            if (index >= 0) {
                state.activeConditions = [
                    ...state.activeConditions.slice(0, index),
                    ...state.activeConditions.slice(index + 1)
                ]
            }
        },

        addActiveCondition(state, condition) {
            if (state.activeConditions.filter(c =>
                (c.optionFrom == condition.optionFrom && c.optionTo == condition.optionTo && c.sort == condition.sort
                    && c.action === condition.action)).length == 0) {
                state.activeConditions.push(condition);
            }
        },

        removeFromConditionBlocked(state, element) {
            state.conditionBlocked = state.conditionBlocked.filter(field => field.alias !== element.alias)
        },

        addConditionBlocked(state, element) {
            if (notExist(state.conditionBlocked, element)) {
                state.conditionBlocked.push(element)
            }
        },

        setUnusedFields(state, unusedFields) {
            state.unusedFields = unusedFields;
        },

        setCalcStore(state, calcStore) {
            state.calcStore = calcStore;
        },

        updateSubtotal(state, subtotal) {
            state.subtotal = subtotal;
        },

        updateFormula(state, formula) {
            state.formula = formula;
        },

        updateOpen(state, val) {
            state.open = val;
        },

        updateCurrent(state, val) {
            state.$current = val;
        },

        setDefaultImg(state, value) {
            state.defaultImg = value;
        },

        setErrorImg(state, value) {
            state.errorImg = value;
        },

        setSuccessImg(state, value) {
            state.successImg = value;
        },

        setProActive(state, value) {
            state.proActive = value
        },

        setCurrentLocation(state, currentHostName) {
            state.currentLocation = currentHostName;
        },

        setLanguage(state, language) {
            state.language = language;
        },

        setDateFormat(state, dateFormat) {
            state.dateFormat = dateFormat;
        },

        setTranslations(state, translations) {
            state.translations = translations;
        },

        setAppearance(state, appearance) {
            state.appearance = appearance;
        },
    },

    actions: {
        updateOpenAction({commit}, val) {
            commit('updateOpen', val);
        },

        updateCurrentAction({commit}, val) {
            commit('updateCurrent', val);
        }
    },
};
