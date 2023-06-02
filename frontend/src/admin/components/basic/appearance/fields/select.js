export default {
    props: {
        element: {
            type: Object,
            default: {},
        },
        name: '',
    },

    data: () => ({
        options: {},
        showLabel: false,
        value: null,
    }),

    created(){
        this.setData();
    },

    methods: {
        setData() {
            this.value = this.element.value;

            if (this.isObjectHasPath(this.element, ['data', 'options']))
                this.options = this.element.data.options;

            if ( this.element.hasOwnProperty('showLabel') )
                this.showLabel = this.element.showLabel;
        },

        updateField: function () {
            this.element.value = this.value;
            this.$emit('change');
        }
    },

    template: `
                <div class="ccb-select-box">
                    <div class="ccb-select-wrapper">
                        <i class="ccb-icon-Path-3485 ccb-select-arrow"></i>
                        <select class="ccb-select" v-model="value" @change="updateField">
                            <option v-for="(option, option_key) in options" :key="option_key" :value="option_key">
                                {{ option }}
                            </option>
                        </select>
                    </div>
                </div>
        `,
}