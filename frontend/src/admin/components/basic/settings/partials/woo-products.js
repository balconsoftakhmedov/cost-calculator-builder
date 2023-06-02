import settingsMixin from './settingsMixin';

export default {
	mixins: [settingsMixin],
	data: () => ({
		woo_category_id_all: false,
	}),
	computed: {
		exist_woo_product_category_ids() {
			return this.$store.getters.getCategories.map( category => {
				return category.term_id;
			});
		}
	},
	mounted() {
	    // hotfix , need to check why empty string is created as array item
        this.settingsField.woo_products.category_ids = this.settingsField.woo_products.category_ids.filter(item => item);

		/* set woo_category_id_all to true if all categories choosen i*/
		if ( Array.isArray( this.settingsField.woo_products.category_ids )
			&& Array.isArray( this.exist_woo_product_category_ids ) ) {
			this.woo_category_id_all = (
				this.settingsField.woo_products.category_ids.length === this.exist_woo_product_category_ids.length
				&&
				this.settingsField.woo_products.category_ids.every((v, i) => v === this.exist_woo_product_category_ids[i])
			);
		}
	},
	methods: {
		addWooMetaLink() {
			this.$store.commit('addWooMetaLink');
		},
		/**
		 * get woocommerce category name by term id
		 */
		getWooCategoryNameById( id ) {
			var woo_category = this.$store.getters.getCategories.find(c => c.term_id === id);
			if ( typeof woo_category !== 'undefined' ){
				return woo_category.name;
			}
		},

		/**
		 * check/uncheck category id from multiselect
		 * @param category_id - woocommerce category id
		 */
		multiselectChooseWooCategories( category_id ) {
			let category_ids = this.settingsField.woo_products.category_ids;
			if ( 'all' === category_id ) {
				this.woo_category_id_all = !this.woo_category_id_all;
				if ( this.woo_category_id_all ) {
					category_ids = this.exist_woo_product_category_ids.concat();
				}else{
					category_ids = [];
				}
				this.$store.commit('updateWooCategoryIds', category_ids);
				return;
			}

			this.woo_category_id_all = false;
			var index = category_ids.indexOf(category_id);
			if (index !== -1) {
				category_ids.splice(index, 1);
				return;
			}
			category_ids.push(category_id);
			this.$store.commit('updateWooCategoryIds', category_ids);
		},
		removeWooMetaLink(index) {
			let links = this.$store.getters.getWooMetaLinks.filter((e, i) => i !== index);
			this.$store.commit('updateWooMetaLinks', links);
		},
	}
}