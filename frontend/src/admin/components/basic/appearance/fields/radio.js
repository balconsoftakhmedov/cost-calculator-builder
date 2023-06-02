export default {
    props: {
        element: {
            type: Object,
            default: {},
        },
        name: '',
    },

    data: () => ({
        value: null,
    }),
    computed: {
        options() {
            if ( this.isObjectHasPath(this.element, ['data', 'options']) ) {
                return this.element.data.options;
            }
            return {};
        }
    },
    created(){
        this.value = this.element.value;
    },

    methods: {
        updateField: function ( newValue ) {
            this.value = newValue;
        }
    },
    watch: {
        value: function (val) {
            this.element.value = this.value;
            this.$emit('change');
        }
    },

    template: `
                <div class="ccb-radio-box">
                    <div class="ccb-radio-box-container">
                        <label :class="['ccb-radio', {'ccb-radio-active' : (option_key == value )}]" v-for="(option, option_key) in options" @click.prevent="updateField(option_key)">
                            <i class="ccb-icon-Path-36518"></i>
                            <span class="ccb-default-title">{{ option }}</span>
                            <span class="ccb-custom-radio">
                                <input type="radio":value="option_key" v-model="value" :name="'radio-' + name" :id="[name, option_key].join('_')"/>
                                <span></span>
                            </span>
                        </label>
                    </div>
                </div>
`,
}