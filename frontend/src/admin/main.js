import Vue from '@libs/vue/vue.min'
import mixin from '../mixins/index' // mixin/
import CBuilder from './components/index' // main-component admin
import loader from '../loader' // pre-loader
import loaderWrapper from "../frontend/components/partials/loaderWrapper";
import vSelect from 'vue-select'
import frontend_fields from '../frontend/components/fields'

/****************** Plugins ******************/
import uriPlugin from '@plugins/checkUri' // uri plugin
import getRequest from '@plugins/getRequest' // getRequest plugin
import postRequest from '@plugins/postRequest' // postRequest plugin
import validateData from '@plugins/validateData' // Validate data plugin
import deepMerge from '@plugins/deepMerge' // Merge data plugin
import currencyData from '@plugins/currencyData' // currency data plugin
/****************** Plugins end ******************/
import 'vue-select/dist/vue-select.css';

/****************** Fields start ******************/
import draggable from '@libs/vue/draggable'
import Vuex from '@libs/vue/vuex'
import store from './store/index' // vuex

// register helper function globally
Vue.use(uriPlugin)
Vue.use(getRequest)
Vue.use(postRequest)
Vue.use(validateData)
Vue.use(deepMerge)
Vue.use(currencyData)

/**
 * Init Moment
 */

Vue.use(Vuex)
document.addEventListener("DOMContentLoaded", function() {
    Vue.mixin(mixin) // register global mixin for all fields components
    Vue.component('draggable', draggable)
    Vue.component('loader', loader)
    Vue.component('loader-wrapper', loaderWrapper)
    Vue.component('ccb-v-select', vSelect)

    if (ajax_window.templates) {
        frontend_fields.forEach(field => {
            field.content.template = ajax_window.templates[field.template_name]
            Vue.component(field.component_name, field.content) // register field component globally
        })
    }

    new Vue({
        el: "#cost_calculator_main_page",

        beforeCreate() {
            this.$store = new Vuex.Store(store);
        },
        components: {
            'calc-builder': CBuilder, // Main component for admin Builder
        },
        data: {
            active_content: 'general',
        },
    })
});