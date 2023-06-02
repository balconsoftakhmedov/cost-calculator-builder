import Vue from '@libs/vue/vue.min'
import moment from 'moment-timezone'

import CBuilderFront from './components/cost-calc'
import loader from '../loader'
import loaderWrapper from "./components/partials/loaderWrapper";
import frontend_fields from './components/fields/index'

import Vuex from '@libs/vue/vuex'
import store from './store/index' // vuex
import mixin from '../mixins/index'

import validateData from '@plugins/validateData'
import deepMerge from '@plugins/deepMerge' // Merge data plugin

const {cloneDeep} = ccb_lodash;
const $ = require('jquery');


jQuery.noConflict();
jQuery(document).ready(() => {

	/** if elementor page **/
	if ( window.elementorFrontend ) {

		/** for elementor popups **/
		jQuery(document).on('elementor/popup/show', () => {
			$('.calculator-settings').each(function () {
				var el = $(this)[0];
				/** create instance if inside popup calculators **/
				if ( null !== el.closest(".elementor-location-popup") ){
					createVueInstance( el );
				}
			})
		});
		/** create instance if for page calculators **/
		if ( $('.calculator-settings').length > 0 ) {
			initCCB();
		}

	} else {
		initCCB();
	}
});
/**
 * Init Moment
 */
// moment.tz.setDefault('GMT'); need to remove
Vue.prototype.moment = moment;
Vue.filter('moment', function ( date, format ) {
	return moment( date ).format( format );
});

Vue.use( Vuex );
Vue.use( validateData );
Vue.use( deepMerge );

Vue.mixin( mixin ); // register global mixin for all fields components
Vue.component( 'loader', loader );
Vue.component( 'loader-wrapper', loaderWrapper );

if (ajax_window.templates) {
	frontend_fields.forEach(field => {
		field.content.template = ajax_window.templates[field.template_name]
		Vue.component(field.component_name, field.content) // register field component globally
	})
}

function initCCB(){
	jQuery(document).ready(() => {
	   $('.calculator-settings').each(function () {
			var el = $(this)[0];
		   /** create instance for all calculators exept inside popup **/
			if ( null === el.closest(".elementor-location-popup") ){
				createVueInstance( el );
			}
		})
	});
}

function createVueInstance( el ){
	new Vue({
		el: el,
		beforeCreate() {
			this.$store = createStore(cloneDeep(store));
			this.$store.commit('setCurrentLocation', window.location.origin);

			/** set language **/
			if (ajax_window.hasOwnProperty('language')) {
				this.$store.commit('setLanguage', ajax_window.language);
			}

			/** set date format **/
			if (ajax_window.hasOwnProperty('dateFormat')) {
				this.$store.commit('setDateFormat', ajax_window.dateFormat);
			}

			/** load translations globally **/
			if (ajax_window.hasOwnProperty('translations')) {
				this.$store.commit('setTranslations', ajax_window.translations);
			}

			/** use wordpress language **/
			this.moment.updateLocale(ajax_window.language, {
				week: {
					dow: 1
				}
			});
		},
		components: {
			'calc-builder-front': CBuilderFront, // Front main component and Preview
		},
	})
}

function createStore(store) {
	return new Vuex.Store(store);
}