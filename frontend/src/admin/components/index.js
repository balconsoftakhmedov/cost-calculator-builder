import calculatorsPage from './pages/calculator'
import generalSettings from './pages/settings'
import modal from './utility/modal';
import {toast} from '../../utils/toast'
import loader from '../../loader'

const CBuilder = {
    components: {
        loader,
        'calculators-page': calculatorsPage,
        'general-settings': generalSettings,
        'ccb-modal-window': modal,
    },

    data: () => ({
        preview_tab_inner: 'desktop',
        loader: true,
        active_tab: 'create',
        calc_list: false,
        checkedCalculatorIds: [],
        content: '',
        disabled: true,
        duplicated_id: null,
        hasAccess: false,
        id: null,
        isCheckedAll: false,
        load: true,
        type: 'existing',
        copy: {
            text: 'Copy',
            type: 'hidden',
        },
    }),

    computed: {
        errors() {
            return this.$store.getters.getErrors;
        },

        loader: {
            get() {
                return this.$store.getters.getMainLoader;
            },

            set(value) {
                this.$store.commit('updateMainLoader', value);
            }
        },

        view() {
            return this.active_tab;
        },

        getCalculatorsList: {
            get() {
                return this.$store.getters.getCalculatorList;
            }
        },

        preview_tab: {
            get() {
                return this.preview_tab_inner
            },

            set(value) {
                if (value === 'mobile') {
                    this.$store.commit('setFieldsKey', this.$store.getters.getFieldsKey + 1)
                }
                this.preview_tab_inner = value
            }
        },
    },

    async mounted() {
        /** save translations to store **/
        this.$store.commit('setTranslations', ajax_window.translations);

        /** set language **/
        if ( ajax_window.hasOwnProperty('language') )
            this.$store.commit('setLanguage', ajax_window.language);

        /** Show calculator list if no action var **/
        const ccbListFilter = localStorage.getItem('ccb_list_filter');
        if (ccbListFilter)
            this.$store.commit('setCalculatorList', JSON.parse(ccbListFilter));
        await this.$store.dispatch('fetchExisting');

        this.fields = this.$store.getters.getFields;
        this.toggleLoader();
    },

    methods: {
        removeConditionAction( conditionModelIndex, additionalConditionIndex ) {
            let conditionModel = this.$store.getters.getConditionModel.filter((e, i) => i == conditionModelIndex);
            if ( conditionModel.length <= 0 )
                return;

            if ( conditionModel[0].conditions.length === 1 )
                return this.removeRow(conditionModelIndex);

            conditionModel[0].conditions = conditionModel[0].conditions.filter((e, i) => i !== additionalConditionIndex);
            let allConditionModels = this.$store.getters.getConditionModel.filter((e, i) => i !== conditionModelIndex);
            allConditionModels.push(conditionModel[0]);
            this.$store.commit('updateConditionModel', allConditionModels);
        },

        addRowForOrAndCondition( conditionIndex ){
            let conditionModel = this.$store.getters.getConditionModel.filter((e, i) => i == conditionIndex);
            if ( conditionModel.length <= 0 ){
                return;
            }

            const emptyAdditionalCondition = {
                key: 0, // used for to store option key ( if select type )
                value: '',
                condition: '',
                logicalOperator: '&&',
                sort: conditionModel[0].conditions.length,
            };
            conditionModel[0].conditions.push(emptyAdditionalCondition);
            conditionModel[0].conditions.sort(function(a,b) {
                return a.sort - b.sort;
            });

            let allConditionModels = this.$store.getters.getConditionModel.filter((e, i) => i !== conditionIndex);
            allConditionModels.push(conditionModel[0]);
            this.$store.commit('updateConditionModel', allConditionModels);
        },

        /**
         * Replace all AND to OR
         * if not checkbox or toggle
         * and have 'is_selected' condition
         **/
        checkCorrectForAdditionalAnd( conditionIndex ) {
            let conditionModel = this.$store.getters.getConditionModel.filter((e, i) => i == conditionIndex);
            if ( conditionModel.length <= 0 ){
                return;
            }

            const fieldName = conditionModel[0].optionFrom.replace(/\_field_id.*/,'');
            if ( !['checkbox', 'toggle', 'checkbox_with_img'].includes(fieldName) ) {
                const isSelectedConditions = conditionModel[0].conditions.filter( c => ( c.condition === '==' ) );
                if ( isSelectedConditions.length > 0 ) {
                    conditionModel[0].conditions.forEach( (item) => item.logicalOperator = '||' );
                    let allConditionModels = this.$store.getters.getConditionModel.filter((e, i) => i !== conditionIndex);
                    allConditionModels.push(conditionModel[0]);
                    this.$store.commit('updateConditionModel', allConditionModels);
                }
            }

        },

        checkIsCanAddMultipleConditionInRow( fieldIdFrom, condition ) {
            const fieldName = fieldIdFrom.replace(/\_field_id.*/,'');
            if ( !['checkbox', 'toggle', 'checkbox_with_img'].includes(fieldName) &&  condition === '==') {
                return false;
            }
            return true;
        },

        copyIPN() {
            const ipn = document.querySelector('.paypal-ipn__input');
            ipn.setAttribute('type', 'text');
            ipn.select();
            document.execCommand("copy");
            ipn.setAttribute('type', 'hidden');
            this.copy.text = 'Copied'
        },

        openExisting() {
            this.$store.commit('setModalType', 'existing');
        },

        openPreview() {
            this.$store.commit('setModalType', 'preview');
        },

        toggleLoader(timeout = 300) {
            setTimeout(() => this.loader = false, timeout);
        },

        saveCondition(conditionData) {
            this.$store.commit('setConditions', conditionData);
        },

        addModel() {
            this.$store.commit('addConditionData');
        },

        saveLink() {
            this.$store.dispatch('updateLink');
            this.close();
            toast('Condition Link Saved', 'success');
        },

        removeRow(index) {
            let models = this.$store.getters.getConditionModel.filter((e, i) => i !== index);
            this.$store.commit('updateConditionModel', models);
        },

        removeLink() {
            this.$store.dispatch('removeLink');
            if (typeof window.ccb_refs !== "undefined") {
                const conditionRef = window.ccb_refs.conditions;
                conditionRef.refreshAvailable();
                this.$store.commit('updateConditionData', {});
                this.$store.commit('updateConditionModel', []);
            }
            this.close();
        },

        close() {
            this.$store.commit('setModalHide', true)
            this.$store.commit('setOpenModal', false);
            setTimeout(() => {
                this.$store.commit('setModalHide', false)
                this.$store.commit('setModalType', '');
            }, 200)
        },

        /** clean conditionModel.setVal
         *  used if action changed
         */
        cleanSetVal( conditionIndex ) {
            let conditionModel = this.$store.getters.getConditionModel.filter((e, i) => i == conditionIndex);
            if ( conditionModel.length <= 0 ){
                return;
            }
            conditionModel[0].setVal = '';

            let allConditionModels = this.$store.getters.getConditionModel.filter((e, i) => i !== conditionIndex);
            allConditionModels.push(conditionModel[0]);
            this.$store.commit('updateConditionModel', allConditionModels);
        },

        cleanDateRangeSetVal( conditionIndex, rangeKey ) {
            let conditionModel = this.$store.getters.getConditionModel.filter((e, i) => i == conditionIndex);
            if ( conditionModel.length <= 0 ){
                return;
            }
            const rangeValue = conditionModel[0].setVal.length > 0 ? JSON.parse(conditionModel[0].setVal): {'start': '', 'end': ''};
            rangeValue[rangeKey] = '';

            conditionModel[0].setVal = JSON.stringify(rangeValue);

            let allConditionModels = this.$store.getters.getConditionModel.filter((e, i) => i !== conditionIndex);
            allConditionModels.push(conditionModel[0]);
            this.$store.commit('updateConditionModel', allConditionModels);
        },

        setDate( event, conditionIndex ) {
            const dateObject = this.moment(event.target.value, "YYYY-MM-DD");

            let conditionModel = this.$store.getters.getConditionModel.filter((e, i) => i == conditionIndex);
            if ( conditionModel.length <= 0 ){
                return;
            }
            conditionModel[0].setVal = dateObject.format('DD/MM/YYYY');

            let allConditionModels = this.$store.getters.getConditionModel.filter((e, i) => i !== conditionIndex);
            allConditionModels.push(conditionModel[0]);
            this.$store.commit('updateConditionModel', allConditionModels);

        },

        setMultiRange( event, conditionIndex ) {
            const errors = Object.assign({}, this.errors);
            errors.multi_range_error = null;
            this.$store.commit('setErrors', errors);

            let conditionModel = this.$store.getters.getConditionModel.filter((e, i) => i == conditionIndex);
            if ( conditionModel.length <= 0 ){
                return;
            }

            const rangeValue = conditionModel[0].setVal.length > 0 ? JSON.parse(conditionModel[0].setVal): {'start': '', 'end': ''};
            rangeValue[event.target.name] = parseInt(event.target.value);

            //VALIDATE START AND END VALUES
            if ( rangeValue['end'] && rangeValue['start'] && rangeValue['end'] <= rangeValue['start'] ) {
                errors.multi_range_error   = this.$store.getters.getTranslations.high_end_multi_range;
                this.$store.commit('setErrors', errors);
                return;
            }
            conditionModel[0].setVal = JSON.stringify(rangeValue);

            let allConditionModels = this.$store.getters.getConditionModel.filter((e, i) => i !== conditionIndex);
            allConditionModels.push( conditionModel[0] );
            this.$store.commit('updateConditionModel', allConditionModels);
        },

        setRangeDate( event, conditionIndex ) {
            const errors = Object.assign({}, this.errors);
            errors.range_date_error = null;
            this.$store.commit('setErrors', errors);

            let conditionModel = this.$store.getters.getConditionModel.filter((e, i) => i == conditionIndex);
            if ( conditionModel.length <= 0 ){
                return;
            }

            const dateObject = this.moment(event.target.value, "YYYY-MM-DD");
            const rangeValue = conditionModel[0].setVal.length > 0 ? JSON.parse(conditionModel[0].setVal): {'start': '', 'end': ''};
            rangeValue[event.target.name] = dateObject.format('DD/MM/YYYY');

            if ( rangeValue['end'] && rangeValue['start'] ) {

                const endDateObject   = this.moment(rangeValue['end'], 'DD/MM/YYYY');
                const startDateObject = this.moment(rangeValue['start'], 'DD/MM/YYYY');

                //VALIDATE START AND END DATES
                if ( startDateObject.isAfter(endDateObject, 'day') ){
                    errors.range_date_error   = this.$store.getters.getTranslations.high_end_date_error;
                    this.$store.commit('setErrors', errors);
                    return;
                }
            }

            conditionModel[0].setVal = JSON.stringify(rangeValue);

            let allConditionModels = this.$store.getters.getConditionModel.filter((e, i) => i !== conditionIndex);
            allConditionModels.push( conditionModel[0] );
            this.$store.commit('updateConditionModel', allConditionModels);
        },

        /** MULTI SELECT **/
        multiselectShow( event ) {
            if ( event.target.parentNode.classList.contains('visible') ) {
                event.target.parentNode.classList.remove('visible');
                document.removeEventListener('click', this.closeMultiSelect);
            }else{
                event.target.parentNode.classList.add('visible');
                document.addEventListener('click', this.closeMultiSelect);
            }
        },

        multiselectChoose( event, optionIndex, conditionIndex ) {
            const input = event.target.querySelector('.index_' + optionIndex);

            let conditionModel = this.$store.getters.getConditionModel.filter((e, i) => i == conditionIndex);
            if ( conditionModel.length <= 0 ){
                return;
            }

            let newValue = conditionModel[0].setVal.length > 0 ? conditionModel[0].setVal.split (",").map( Number ) : [];
            if ( input.checked ) {
                input.checked = false;
                newValue = newValue.filter(function(f) { return f !== optionIndex });
            }else{
                input.checked = "checked";
                newValue.push(optionIndex);
            }

            newValue = Array.from(new Set(newValue));
            conditionModel[0].setVal = newValue.join(',');

            let allConditionModels = this.$store.getters.getConditionModel.filter((e, i) => i !== conditionIndex);

            allConditionModels.push(conditionModel[0]);
            this.$store.commit('updateConditionModel', allConditionModels);
        },

        /** event listener to close multiselect **/
        closeMultiSelect() {
            window.addEventListener('click', (e) => {
                if ( e.target.closest('.multiselect') !== null || e.target.closest('.ccb-multi-select') !== null) {
                    return;
                }
                document.querySelectorAll(".multiselect").forEach( obj => obj.classList.remove("visible"));
                document.querySelectorAll(".ccb-multi-select").forEach( obj => obj.classList.remove("visible"));
                document.removeEventListener('click', this.closeMultiSelect);
            })
        },
        /** MULTI SELECT | END **/

        async saveSettings() {
            this.loader = true;
            const isEdit = (this.$checkUri('action') === 'edit');
            await this.$store.dispatch('saveSettings', isEdit);
            await this.$store.dispatch('updateStyles');

            setTimeout(() => {
                this.loader = false;
                toast('Changes Saved', 'success');
            }, 1000);
        },

        async cancel() {
            if (this.$checkUri('action') !== 'edit')
                await this.$store.dispatch('deleteCalc', this.$store.getters.getId);
            location.reload();
        },

        async createId() {

            if (this.$checkUri('action') === 'edit' || this.$store.getters.getId) {
                this.$store.commit('setModalType', 'create-new');
                return;
            }

            this.loader = true;
            await this.$store.dispatch('createId');

            if (this.$store.getters.getId) {
                this.calc_list = false;
                this.disabled = false;
                this.id = this.$store.getters.getId;
            }

            this.toggleLoader();
        },

        closeCalcSettings() {
            this.$store.commit('setOpenModal', false);
            this.$store.commit('setModalType', '');
        },

        async saveCalcSettings() {
            this.$store.commit('setOpenModal', false);
            this.$store.commit('setModalType', '');
            await this.$store.dispatch('saveCalcConfigSettings');
            toast('Configs saved')
        }
    }
};

export default CBuilder;