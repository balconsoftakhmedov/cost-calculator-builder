import templateItem from './template-item'

export default {
    props: ['items'],
    components: {
        'template-item': templateItem
    },

    created() {
        this.items = this.items || []
    },

    template: `
        <div class="ccb-templates-wrapper ccb-grid-box">
            <div class="ccb-templates-container container">
                <div class="ccb-templates ccb-custom-row row">
                  <template-item 
                    v-for="(item, index) in items"
                    :key="index.id"
                    :item="item"
                  />
                </div>
            </div>
        </div>
    `
}