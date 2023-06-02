import Vue from '@libs/vue/vue.min'
import loader from "../loader";
import fetchRequest from "@plugins/fetchRequest"
import {toast} from "../utils/toast";

String.prototype.slugify = function (separator = "_") {
    return this
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9 ]/g, '')
        .replace(/\s+/g, separator);
};

document.addEventListener("DOMContentLoaded", function () {
    new Vue({
        el: "#cost_calculator_categories",
        components: {
            loader,
        },

        data() {
            return {
                preloader: true,
                categories: [],
                currentCategory: null,

                sidebar: false,
                type: 'create',
                disableSlug: false,
            }
        },

        async mounted() {
            await this.getCategoriesList()
            setTimeout(() => {
                this.preloader = false
            }, 300)
        },

        methods: {
            async getCategoriesList() {
                const data = await fetch(`${window.ajaxurl}?action=calc_get_category&nonce=${window.ccb_nonces.ccb_get_categories}`);
                const response = await data.json();

                if (response && response.categories) {
                    this.categories = response.categories
                }

                setTimeout(() => {
                    this.preloader = false
                }, 300)
            },

            async deleteCategory(id) {
                this.preloader = true

                const data = await fetch(`${window.ajaxurl}?category_id=${id}&action=calc_delete_category&nonce=${window.ccb_nonces.ccb_delete_category}`);
                const response = await data.json();

                if (response && response.categories) {
                    this.categories = response.categories
                }

                setTimeout(() => {
                    this.preloader = false
                }, 300)
            },

            async addCategory() {
                if ( !this.currentCategory )
                    return

                this.preloader = true
                const data = {...this.currentCategory}

                fetchRequest(`${window.ajaxurl}?action=calc_add_category&nonce=${window.ccb_nonces.ccb_add_category}`, 'POST', data)
                    .then(response => response.json())
                    .then(response => {
                        if (response && response.categories) {
                            this.categories = response.categories
                        }

                        setTimeout(() => {
                            this.preloader = false
                            this.sidebar = false
                            this.currentCategory = null
                            toast('Category added', 'success')
                        }, 300)
                    })
            },

            async updateCategory() {
                if ( !this.currentCategory )
                    return

                this.preloader = true
                const data = {...this.currentCategory}

                fetchRequest(`${window.ajaxurl}?action=calc_update_category&nonce=${window.ccb_nonces.ccb_update_category}`, 'POST', data)
                    .then(response => response.json())
                    .then(response => {
                        if (response && response.categories) {
                            this.categories = response.categories
                        }

                        setTimeout(() => {
                            this.preloader = false
                            this.sidebar = false
                            this.disableSlug = false
                            this.currentCategory = null
                            toast('Category updated', 'success')
                        }, 300)
                    })
            },

            async createNew() {
                this.currentCategory = this.tempCategory()
                this.sidebar = true
                this.type = 'create'
            },

            cancel() {
                this.currentCategory = null
                this.sidebar = false
                this.disableSlug = false
            },

            editCategory(e, id) {
                this.disableSlug = true

                if (e.target.classList.contains('ccb-cat-delete') === true)
                    return

                const category = this.categories.find(c => c.id === id)
                if (category) {
                    this.currentCategory = category
                    this.sidebar = true
                    this.type = 'edit'
                }
            },

            applyAction() {
                switch (this.type) {
                    case 'create':
                        this.addCategory()
                        break
                    case 'edit':
                        this.updateCategory()
                        break
                }
            },

            tempCategory() {
                return {
                    title: '',
                    slug: '',
                }
            },
        },
    })
})
