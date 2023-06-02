import {toast} from "../../../utils/toast";
import copyText from "../utility/copyText";
import {addParams, removeParams} from "../utility/addParams";

export default {
    props: [],
    data: () => ({
        checkedCalculatorIds: [],
        isCheckedAll: false,
        shortCode: {
            className: '',
            text: 'Copy'
        },
        limit: 15,
        preloader: true,
        currentPage: 1,
        maxPages: 0,
        allChecked: false,
        createFromMenu: false
    }),

    mounted() {
        let urlParams = new URLSearchParams(window.location.search);
    
        if (urlParams.has('create-calc-from-menu')) {
            this.createFromMenu = true
            this.createId()
            removeParams('create-calc-from-menu')
            return;
        }
        
        this.limit = this.calculatorsList.limit;
        this.preloader = false;

        this.initListeners()
    },

    computed: {
        getExisting() {
            return this.$store.getters.getExisting || []
        },

        calculatorsList() {
            return this.$store.getters.getCalculatorList
        },

        totalPages() {
            return Math.ceil(this.$store.getters.getCalculatorsCount / this.calculatorsList.limit);
        },
    },

    watch: {
        limit(value) {
            this.updateCalculatorsList('limit', +value);
            this.fetchData();
        }
    },

    methods: {
        initListeners() {
            window.addEventListener('click', (e) => {
                const list = ['ccb-button default ccb-btn-dropdown-btn', 'ccb-btn-dropdown-input', 'ccb-export-link', 'ccb-export-list ccb-default-title ccb-bold']
                if ( !list.includes(e.target.classList.value) ) {
                    document.querySelector('.ccb-btn-dropdown input').checked = false
                }
            })
        },

        reset() {
            this.preloader = true;
        },

        nextPage() {
            const {page} = this.calculatorsList
            this.updateCalculatorsList('page', page + 1);
            this.fetchData();
        },

        prevPage() {
            const {page} = this.calculatorsList
            this.updateCalculatorsList('page', page - 1);
            this.fetchData();
        },

        getPage(page) {
            this.updateCalculatorsList('page', page);
            this.fetchData();
        },

        resetPage() {
            this.updateCalculatorsList('page', 1);
        },

        changeUrlToEdit(id) {
            addParams('action', 'edit');
            addParams('id', id);
        },

        editCalc(id) {
            this.changeUrlToEdit(id);
            this.$emit('edit-calc', {id, step: 'create'})
        },

        openDemoImport() {
            this.$emit('edit-calc', {id: null, step: 'demo-import'})
        },

        updateCalculatorsList(key, value){
            this.$store.commit('setCalculatorList', {...this.calculatorsList, [key]: value});
        },

        saveListFilter() {
            localStorage.setItem('ccb_list_filter', JSON.stringify(this.calculatorsList));
        },

        async fetchData() {
            this.reset();
            this.saveListFilter();
            await this.$store.dispatch('fetchExisting');
            this.preloader = !!this.createFromMenu
        },

        async openTemplates() {
            this.$emit('edit-calc', {step: 'templates'})
        },

        async createId() {
            await this.$store.dispatch('createId');
            if (this.$store.getters.getId) {
                const id = this.$store.getters.getId;
                this.changeUrlToEdit(id);
                this.$emit('edit-calc', {id, step: 'create'})
            }
        },

        isActiveSort(sortKey) {
            const {sortBy, direction} = this.calculatorsList;
            const isActive = sortKey === sortBy
            let isAsc = isActive && direction === 'asc'
            let isDesc = isActive && direction === 'desc'

            if (!isAsc && !isDesc)
                isDesc = true;

            return {
                'sortable-asc':  isAsc,
                'sortable-desc': isDesc,
            }
        },

        setSort(key) {
            let {direction} = this.calculatorsList;
            this.updateCalculatorsList('sortBy', key);
            this.updateCalculatorsList('direction', direction === 'asc' ? 'desc' : 'asc');
            this.fetchData();
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

        async duplicateCalc(id) {
            this.duplicated_id = await this.$store.dispatch('duplicateCalc', id);
            toast('Calculator Duplicated', 'success');
            setTimeout(() => {
                this.duplicated_id = null;
            }, 1000);
        },

        async deleteCalc(id) {
            if ( confirm('Are you sure to delete this Calculator?') ) {
                await this.$store.dispatch('deleteCalc', id);
                toast('Calculator Deleted', 'success');
            }
        },
        
        embedCalc(id) {
            this.$emit('embed-calc', id);
        },

        checkAllCalculatorsAction(){
            const calculators = this.$store.getters.getExisting;
            const calculatorsIds =  calculators.map(value => value['id']);
            if ( this.isCheckedAll ) {
                this.checkedCalculatorIds = [];
            } else {
                this.checkedCalculatorIds = calculatorsIds;
            }

            this.isCheckedAll = !this.isCheckedAll;
        },

        checkCalculatorAction( id ) {
            const exist = this.checkedCalculatorIds.indexOf(id);
            if ( exist >= 0 ){
                this.checkedCalculatorIds.splice(exist, 1);
            } else {
                this.checkedCalculatorIds.push(id);
            }
        },

        cleanCheckedCalculator () {
            this.allChecked = false;
            this.checkedCalculatorIds = [];
            const calcCheckbox = document.getElementsByName('bulkCalculator');
            for ( let i = 0; i < calcCheckbox.length; i++ ) {
                calcCheckbox[i].checked = false;
                calcCheckbox[i].removeAttribute("checked");
            }
            const actionType = document.getElementById('actionType');
            if ( actionType )
                document.getElementById('actionType').value = -1;
            this.isCheckedAll = false;
        },

        async bulkAction() {
            const actionType = document.getElementById('actionType');
            const msg = `Are you sure to ${actionType.value} chosen Calculators?`;

            if ( this.checkedCalculatorIds.length <= 0 ) {
                toast('No calculators were selected ', 'error');
                return false;
            }

            if ( actionType.value === -1 ) {
                toast('Select bulk action ', 'error');
                return false;
            }

            if ( confirm( msg ) ) {
                let response;
                if ( actionType.value === 'delete' )
                    response = await this.$store.dispatch('deleteBulkCalculator', this.checkedCalculatorIds);

                if ( actionType.value === 'duplicate' )
                    response = await this.$store.dispatch('duplicateBulkCalculator', this.checkedCalculatorIds);

                toast (response.message, (response.success) ? 'success' : 'error' );
                this.cleanCheckedCalculator();
            }
        },
    },

    filters: {
        'to-short': (value) => {
            if (value.length >= 40) {
                return value.substring(0, 37) + '...'
            }
            return value
        },
    },
};
