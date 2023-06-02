import {toast} from "../../../utils/toast";

export default {
    data: () => ({
        error: false,
        errorMsg: 'Invalid email address',
        step: 'get_code',
        codeError: false,
    }),

    methods: {
        getCode() {
            if ( this.validateEmail(this.email) ) {
                this.step = 'send_code'
                this.getCodeHandler()
            } else {
                this.error = true
            }
        },

        getCodeHandler() {
            this.$store.dispatch('getCodeAction')
        },

        changeEmailAddress() {
            this.error = false
            this.codeError = false
            this.code = ''
            this.step = 'get_code'
        },

        resendCode() {
            this.error = false
            this.codeError = false
            this.code = ''
            this.getCodeHandler()
        },

        saveCode() {
            if ( this.code === 'FREECALCS!' ) {
                this.codeError = false
                this.$store.dispatch('unlockTemplates')
                toast('Templates unlocked', 'success')
                this.close()
            } else {
                this.codeError = true
            }
        },

        close() {
            this.step = 'get_code'
            this.code = ''
            this.hide = true;
            this.$store.commit('setOpenTemplateModal', false);
            setTimeout(() => {
                this.hide = false;
                this.$store.commit('setTemplateModalType', '');
            }, 200)
        },

        validateEmail(email) {
            return String(email)
                .toLowerCase()
                .match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                );
        }
    },

    computed: {
        email: {
            get() {
                return this.$store.getters.getAdminEmail
            },

            set(value) {
                this.error = false
                this.$store.commit('setAdminEmail', value)
            }
        },

        code: {
            get() {
                return this.$store.getters.getCode
            },

            set(value) {
                this.codeError = false
                this.$store.commit('setCode', value)
            }
        },

        hide: {
            get() {
                return this.$store.getters.getTemplateModalHide;
            },

            set(value) {
                this.$store.commit('setTemplateModalType', value)
            }
        },

        getIconRequired() {
            if (this.error) {
                return {color: '#D94141'}
            }
            return {color: '#1AB163'}
        },

        getInputRequired() {
            if (this.error || this.codeError) {
                return {border: '1px solid #D94141', position: 'relative'}
            }

            return {position: 'relative'}
        }
    },

    template: `
        <div class="modal-body ccb-quick-tour-start free-template-wrap" style="overflow: hidden">
            <div class="ccb-demo-import-container">
                <div class="ccb-demo-import-content">
                    <div class="ccb-demo-import-icon-wrap">
                        <i class="ccb-icon-Lock"></i>
                    </div>
                    <template v-if="'get_code' === step">
                        <div class="ccb-demo-import-title">
                            <span>Leave your email address</span>
                        </div>
                        <div class="ccb-demo-import-description">
                            <span>Just add your email address and you'll get a code for 6 free form templates.</span>
                        </div>
                        <div class="ccb-templates-email-input-box" :style="getInputRequired">
                            <i class="ccb-icon-Envelope" :style="getIconRequired"></i>
                            <input type="text" class="ccb-title" placeholder="Your email address" v-model="email">
                            <span class="ccb-error-tip default" style="bottom: 46px" v-if="error">{{ errorMsg }}</span>
                        </div>
                        <div class="ccb-demo-import-action">
                            <button class="ccb-button success" @click="getCode">Get code</button>
                            <button class="ccb-button default" @click="close">Cancel</button>
                        </div>
                    </template>
                    <template v-if="'send_code' === step">
                        <div class="ccb-demo-import-title">
                            <span>Check your inbox</span>
                        </div>
                        <div class="ccb-demo-import-description">
                            <span>Enter code that we've sent to your email address.</span>
                        </div>
                        <div class="ccb-templates-email-input-box" style="margin-bottom: 15px" :style="getInputRequired">
                            <input type="text" class="ccb-title" placeholder="Code from email" v-model="code">
                            <span class="ccb-error-tip default" style="bottom: 46px" v-if="codeError">Code does not match</span>
                        </div>
                        <div class="ccb-demo-import-action" style="margin: 0 0 30px 0 !important; height: 12px; display: flex; align-items: center">
                           <span class="ccb-send-code-action" @click="changeEmailAddress">Change email address</span>
                           <span style="color: #001931; opacity: 0.3">|</span>
                           <span class="ccb-send-code-action" @click="resendCode">Resend Code</span>
                        </div>
                        <div class="ccb-demo-import-action">
                            <button class="ccb-button success" @click.prevent="saveCode">Save code</button>
                            <button class="ccb-button default" @click="close">Cancel</button>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    
    `
}