// Admin store
import general from './general'
import condition from './condition'
import calculator from './calculator'
import settingsStore from './settings'
import templatesStore from './templates'

import main from '../../frontend/store/main'
import payments from '../../frontend/store/payments'
import wooCheckout from "../../frontend/store/woo-checkout";
import calcForm from "../../frontend/store/calc-form";

import fetchRequest from "@plugins/fetchRequest"
import {toast} from "../../utils/toast";

export default {
    state: {
        globalErrors: [],
        createNew: false,
        createUrl: '',
        isExisting: true,
        modalType: '',
        openModal: false,
        modalHide: false,
        errors: {},
        cat: '',
        icon: {
            color: '#000000',
            icon: '',
        },
        pluginType: 'default',
        calcLink: '',
        calcDescription: '',
        info: '',
    },

    getters: {
        getCat: s => s.cat,
        getIcon: s => s.icon,
        getCalcInfo: s => s.info,
        getPluginType: s => s.pluginType,
        getCalcLink: s => s.calcLink,
        getCreateUrl: s => s.createUrl,
        getOpenModal: s => s.openModal,
        getModalType: s => s.modalType,
        getCreateNew: s => s.createNew,
        getModalHide: s => s.modalHide,
        getIsExisting: s => s.isExisting,
        getGlobalErrors: s => s.globalErrors,
        getErrors: s => s.errors,
        getCalcDescription: s => s.calcDescription,
    },

    mutations: {
        setCalcInfo(state, info) {
            state.info = info
        },
        setCat(state, cat) {
            state.cat = cat
        },
        setIcon(state, icon) {
            state.icon = icon || state.icon
        },
        setPluginType(state, type) {
            state.pluginType = type
        },
        setCalcLink(state, link) {
            state.calcLink = link
        },

        setGlobalErrors(state, errors) {
            state.globalErrors = errors
        },

        setCreateNew(state, val) {
            state.createNew = val;
        },

        setModalHide(state, val) {
            state.modalHide = val;
        },


        setErrors(state, errors) {
            state.errors = errors;
        },

        setOpenModal(state, val) {
            state.openModal = val
        },

        setModalType(state, type) {
            if (type !== '')
                state.openModal = true
            state.modalType = type;
        },

        setCreateUrl(state, url) {
            state.createUrl = url;
        },

        updateIsExisting(state, val) {
            state.isExisting = val;
        },

        setCalcDescription(state, desc) {
            state.calcDescription = desc
        }
    },

    actions: {
        async saveSettings({getters, commit}, {type}) {
            const data = {
                id: getters.getId,
                title: getters.getTitle,
                formula: getters.getFormulas,
                conditions: getters.getConditions,
                status: type === 'template' ? 'draft' : 'publish',
                settings: this._vm.$validateData(getters.getSettings),
                builder: this._vm.$validateData(getters.getBuilder, 'builder'),
                nonce: window.ccb_nonces.ccb_save_settings,
                appearance: getters.getAppearance,
                category: getters.getCat,
            }

            fetchRequest(`${window.ajaxurl}?action=calc_save_settings`, 'POST', data)
                .then(response => response.json())
                .then(response => {
                    if ( response.success )
                        commit('setResponseData', response.calculators);
                })
        },

        async saveTemplate({getters, commit}) {
            const data = {
                calc_id: getters.getId,
                title: getters.getTitle,
                category: getters.getCat,
            }

            fetchRequest(`${window.ajaxurl}?action=calc_save_as_template&nonce=${window.ccb_nonces.ccb_save_as_template}`, 'POST', data)
                .then(response => response.json())
                .then(response => {
                    if ( response.success )
                        commit('setResponseData', response.calculators);
                })
        },

        async saveCalcConfigSettings({getters, commit}) {
            const data = {
                calc_id: getters.getId,
                category: getters.getCat,
                icon: getters.getIcon,
                type: getters.getPluginType,
                link: getters.getCalcLink,
                description: getters.getCalcDescription,
            }

            fetchRequest(`${window.ajaxurl}?action=calc_config_settings&nonce=${window.ccb_nonces.ccb_save_config}`, 'POST', data)
                .then(response => response.json())
                .then(response => {
                    if ( response.success ) {
                        toast("Configs saved", "success")
                    }
                })
        },
    },

    modules: {
        /** admin **/
        condition,
        calculator,
        general,
        settingsStore,

        /** front **/
        main,
        payments,
        wooCheckout,
        calcForm,
        templatesStore
    },
};
