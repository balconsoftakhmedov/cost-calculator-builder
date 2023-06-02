export default {
    mounted() {

    },

    methods: {
        closeModal() {
            this.hide = true;
            this.$store.commit('setOpenTemplateModal', false);
            setTimeout(() => {
                this.hide = false;
                this.$store.commit('setTemplateModalType', '');
            }, 200)
        }
    },

    computed: {
        modal() {
            return {
                isOpen: this.$store.getters.getOpenTemplateModal,
            };
        },

        getTemplateModalType() {
            return this.$store.getters.getTemplateModalType;
        },

        hide: {
            get() {
                return this.$store.getters.getTemplateModalHide;
            },

            set(value) {
                this.$store.commit('setTemplateModalHide', value)
            }
        }
    },

    template: `
        <div class="ccb-modal-wrapper" :class="{open: modal.isOpen, hide: $store.getters.getTemplateModalHide}">
            <div class="modal-overlay" v-if="getTemplateModalType">
                <div class="modal-window" :class="getTemplateModalType">
                    <div class="modal-window-content">
                        <span @click="closeModal" class="close">
                            <span class="close-icon"></span>
                        </span>
                        <slot name="content"></slot>
                    </div>
                </div>
            </div>
        </div>
    `,
}

