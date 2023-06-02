export default {
    data() {
        return {
            modalStatus: false,
            name: '',
            email: '',
            message: '',
            notice: false,
            sended: false,
            order: ''
        }
    },

    props: ['staticTexts', 'sendFrom', 'adminEmail', 'calcName'],

    computed: {
        getText() {
            return JSON.parse(this.staticTexts)
        },
        getValidEmail() {
            return this.adminEmail
        },
        calcName() {
            return this.order ? this.order.calc_title : ''
        }
    },

    methods: {
        closeModal() {
            document.body.classList.remove('ccb-send-mail')
            this.modalStatus = false
            this.sended = false
            this.clearState()
        },

        showModal(order) {
            this.order = order
            setTimeout(() => {
                document.body.classList.add('ccb-send-mail')
                this.modalStatus = true
            }, 100)
        },

        sendPdf() {
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/.test(this.email) && this.name.length) {
                const formData = new FormData();
                let data = {
                    name: this.name,
                    email: this.email,
                    message: this.message,
                    fileName: this.calcName,
                    pdfString: this.$store.getters.getPdfString,
                    emailFrom: this.getValidEmail,
                    fromName: 'Admin'
                }

                formData.append('action', 'ccb_send_pdf');
                formData.append('nonce', window.ccb_nonces.ccb_send_quote);
                formData.append('data', JSON.stringify(data));

                fetch(ajax_window.ajax_url, {
                    method: 'POST',
                    body: formData,
                })
                this.sended = true;
                this.clearState();

            } else {
                this.notice = 'Email not correct'
            }
        },

        clearState() {
            this.name = ''
            this.email = ''
            this.message = ''
            this.notice = false
        }
    },

    template: `
    
         <template>
        <div>
            <div class="ccb-send-quote" :class="{active: modalStatus}">
                <div class="ccb-send-quote__overlay">
                    <div class="ccb-send-quote__wrapper">
                        <div class="ccb-send-quote__form" v-if="!sended">
                            <div class="ccb-send-quote__header">
                                <div class="ccb-send-quote__title">{{ getText.title }}</div>
                                <div class="ccb-send-quote__close" @click="closeModal">
                                    <i class="ccb-icon-close"></i>
                                </div>
                            </div>
                            <div class="ccb-send-quote__body">
                            <div class="ccb-send-quote__input">
                                <label for="username" class="required">{{ getText.name }}</label>
                                <input type="text" :placeholder="getText.name_holder" id="username" v-model="name">
                            </div>
                            <div class="ccb-send-quote__input">
                                <label for="useremail" class="required">{{ getText.email }}</label>
                                <input type="text" :placeholder="getText.email_holder" id="useremail" v-model="email">
                            </div>
                            <div class="ccb-send-quote__textarea">
                                <label for="usermessage">{{ getText.message }}</label>
                                <textarea name="message" id="usermessage" cols="30" rows="10" :placeholder="getText.message_holder" v-model="message"></textarea>
                            </div>
                            <div class="ccb-send-quote__file">
                                <i class="ccb-icon-pdf"></i>
                                <span>
                                    {{ calcName }}.pdf
                                </span>
                            </div>
                            <div class="ccb-send-quote__submit" >
                                <button @click="sendPdf">{{ getText.submit }}</button>
                            </div>
                            <div class="ccb-send-quote__notice" v-if="notice">
                                <span>
                                    <i class="ccb-icon-Path-3367"></i>
                                </span>
                                <span>
                                    {{ getText.error_message }}
                                </span>
                            </div>
                         </div>
                        </div>
                        <div class="ccb-send-quote__success" v-else>
                            <div class="ccb-send-quote__success-icon">
                                <i class="ccb-icon-Octicons"></i>
                            </div>
                            <div class="ccb-send-quote__success-text">
                                {{ getText.success_text }}
                            </div>
                            <div class="ccb-send-quote__submit">
                                <button class="ccb-send-quote__success-btn" @click="closeModal">
                                    {{ getText.close }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </template>
    
    `
}