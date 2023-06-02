import Vue from '@libs/vue/vue.min'
import loader from "../loader";
import store from './store/templates';
import Vuex from '@libs/vue/vuex';
import templateContainer from './components/templates/template-container'

document.addEventListener("DOMContentLoaded", function () {
    Vue.use(Vuex)
    new Vue({
        el: "#cost_calculator_templates",
        components: {
            loader,
            'template-container': templateContainer,
        },
        beforeCreate() {
            this.$store = new Vuex.Store(store);
        },
    })
})
