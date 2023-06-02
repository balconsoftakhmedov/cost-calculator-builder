import {toast} from "../../../utils/toast";

export default {
    props: ['item'],

    methods: {
        applyAction(item) {
            let action = item.action || item
            switch (action) {
                case 'blank':
                    this.createBlank()
                    break
                case 'use_template':
                    this.useTemplate(item.template_id)
                    break
                case 'unlock_free_form':
                    this.$store.commit('setTemplateModalType', 'free-template')
                    this.$store.commit('setOpenTemplateModal', true);
                    break
                case 'unlock_pro_form':
                    this.$store.commit('setTemplateModalType', 'pro-template')
                    this.$store.commit('setOpenTemplateModal', true);
                    break
            }
        },

        async createBlank() {
            await this.$store.dispatch('createBlankAction')
        },

        async useTemplate(template_id) {
            await this.$store.dispatch('useTemplateAction', {template_id})
        },

        async deleteTemplate(id) {
            if ( confirm('Are you sure to delete this Calculator?') ) {
                await this.$store.dispatch('deleteTemplateAction', {id});
                toast('Template Deleted', 'success');
            }
        },

        async toggleFavorite(template_id) {
            this.$store.dispatch('toggleFavorite', {template_id})
        }
    },

    computed: {
        getBtnMessage() {
            if (this.item.type === 'blank')
                return 'Create Blank Form'
            return 'Use Template'
        },

        favoriteStatus() {
            const favorites = this.$store.getters.getFavorites
            return favorites.includes(this.item.template_id)
        },

        getBadgeIcon() {
            if (this.item.type === "pro")
                return ""

            if (this.item.type === "free")
                return ""

            return ""
        }
    },

    template: `
            <div class="custom-col col-4">
                <div class="ccb-templates-item">
                    <div v-if="!$store.getters.getProActiveTemplate && (item.type === 'free' && !$store.getters.getUnlock)" :class="['ccb-templates-item-badge', item.type]">
                        <span>{{ item.type }}</span>
                    </div>
                    <div v-if="item.type === 'pro' && !$store.getters.getProActiveTemplate" :class="['ccb-templates-item-badge', item.type]">
                        <i class="ccb-icon-Lock-filled"></i>
                        <span>{{ item.type }}</span>
                    </div>
                    <div class="ccb-templates-item-icon-box create-blank" :class="{template: item.icon.color}" v-if="'custom_templates' !== item.category && item.icon" :style="{backgroundColor: item.icon.color}">
                        <i :class="item.icon.icon" v-if="item.icon.icon"></i>
                        <i :class="item.icon" v-else></i>
                    </div>
                    <div class="ccb-templates-item-title-box">
                        <span class="ccb-templates-item-title ccb-default-title large ccb-bold">
                            <span>{{ item.title }}</span>
                            <i class="ccb-icon-Lock-filled" style="font-size: 16px; margin-left: 5px; color: #969AA5;" v-if="item.type === 'pro' && !$store.getters.getProActiveTemplate"></i>
                            <i class="ccb-icon-Lock-filled" style="font-size: 16px; margin-left: 5px; color: #969AA5;" v-if="item.type === 'free' && !($store.getters.getProActiveTemplate || $store.getters.getUnlock)"></i>
                        </span>
                        <span class="ccb-templates-item-description ccb-heading-5 ccb-light" :class="{temp: item.action !== 'blank'}">{{ item.description }}</span>
                        <span class="ccb-templates-item-action-box">
                            <button class="ccb-button success" @click.prevent="() => applyAction(item)" v-if="'custom_templates' === item.category || (item.type === 'pro' && $store.getters.getProActiveTemplate) || item.type === 'free' && ($store.getters.getProActive || $store.getters.getUnlock)">Use Template</button>
                            <button class="ccb-button success" @click.prevent="() => applyAction('unlock_pro_form')" v-else-if="item.type === 'pro'">Use Template</button>
                            <button class="ccb-button success" @click.prevent="() => applyAction('unlock_free_form')" v-else-if="item.type === 'free'">Unlock Form</button>
                            <button class="ccb-button success" @click.prevent="() => applyAction(item)" v-else>Create Blank</button>
                            <a :href="item.link" style="justify-content: center" target="_blank" class="ccb-href ccb-button default" v-if="!['custom_templates', 'blank'].includes(item.category)">View Demo</a>
                            <span v-if="'custom_templates' === item.category && !favoriteStatus" class="ccb-template-icon" @click="() => deleteTemplate(item.template_id)">
                              <i class="ccb-icon-Path-3503 ccb-template-delete"></i>
                            </span>
                            <span v-if="!['custom_templates', 'blank'].includes(item.category) || favoriteStatus" class="ccb-template-icon" @click="() => toggleFavorite(item.template_id)">
                              <i class="ccb-icon-heart-filled ccb-template-favorite" v-if="favoriteStatus"></i>
                              <i class="ccb-icon-Heart-outlined ccb-template-favorite" v-else></i>
                            </span>
                        </span>
                    </div>
                    <div class="ccb-templates-item-badge-box"></div>
                </div>
            </div>
    `
}