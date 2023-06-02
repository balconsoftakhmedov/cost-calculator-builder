import Helpers from "../../../utils/helpers";
import fieldsMixin from "../fields/fieldsMixin";
export default {
    mixins: [fieldsMixin],
    data: () =>  ({
        loader: false,
        message: false,
    }),

    methods: {
        async applyWoo(post_id) {
            /** IF demo or live site ( demonstration only ) **/
            if ( this.$store.getters.getIsLiveDemoLocation ) {
                let demoModeDiv = this.getDemoModeNotice();
                let purchaseBtn = this.$el.querySelector('button');
                purchaseBtn.parentNode.after(demoModeDiv);
                return;
            }
            /** END| IF demo or live site ( demonstration only ) **/

            if ( this.$store.getters.hasUnusedFields )
                return

            const descriptions = this.$store.getters.getDescriptions('woo')
            const files = this.getOrderFiles(descriptions)
            this.loader = true;

            const vm = this;
            const params = {
                post_id,
                files,
                callback: () => {
                    vm.loader = false
                },
            }
            this.loader = await this.$store.dispatch('applyWoo', params);
        },

        getOrderFiles(data) {
            let files = [];
            data = Object.values(data).filter(field => ['file_upload'].includes(field.alias.replace(/\_field_id.*/, '')));
            data.forEach(item => {
                files.push({'alias': item.alias, 'files': item.options.value});
            });

            return files;
        },

        ...Helpers,
    },

    computed: {
        btnStyles() {
            const appearance    = this.$store.getters.getAppearance;
            const btnAppearance = this.getElementAppearanceStyleByPath( appearance, 'elements.primary_button.data');

            let result = {};

            result['padding'] = [0, btnAppearance['field_side_indents']].join('px ') ;

            Object.keys(btnAppearance).forEach((key) => {
                if ( key === 'background' ){
                    result = {...result, ...btnAppearance[key]};
                }else if( key === 'shadow' ) {
                    result['box-shadow'] = btnAppearance[key];
                } else {
                    result[key] = btnAppearance[key];
                }
            });

            return result;
        },

        getSettings() {
            return this.$store.getters.getSettings
        },

        getWooCheckoutSettings() {
            return this.getSettings.woo_checkout
        }
    },
}