import VueColor from '@libs/vue/vue-color.min'

export default {
    components: {
        'sketch-picker': VueColor.Chrome
    },
    props: [],
    data: () => ({
        defaultColor: '#fff',
        colors: {
            hex: '#000000',
        },
        displayPicker: false,
    }),

    created() {
        this.setColor(this.value)
    },

    computed: {
        value: {
            get() {
                return this.calcIcons.color
            },

            set(value) {
                const iconData = this.calcIcons
                iconData.color = value
                this.calcIcons = iconData
            }
        },

        calcIconType: {
            get() {
                return this.calcIcons.icon
            },

            set(value) {
                const iconData = this.calcIcons
                iconData.icon = value
                this.calcIcons = iconData
            }
        },

        calcCategory: {
            get() {
                return this.$store.getters.getCat
            },

            set(value) {
                this.$store.commit('setCat', value)
            }
        },

        calcDescription: {
            get() {
                return this.$store.getters.getCalcDescription
            },

            set(value) {
                this.$store.commit('setCalcDescription', value)
            }
        },

        calcIcons: {
            get() {
                return this.$store.getters.getIcon
            },

            set(value) {
                this.$store.commit('setIcon', value)
            }
        },

        calcType: {
            get() {
                return this.$store.getters.getPluginType
            },

            set(value) {
                this.$store.commit('setPluginType', value)
            }
        },

        calcInfo: {
            get() {
                return this.$store.getters.getCalcInfo
            },

            set(value) {
                this.$store.commit('setCalcInfo', value)
            }
        },

        calcLink: {
            get() {
                return this.$store.getters.getCalcLink
            },

            set(value) {
                this.$store.commit('setCalcLink', value)
            }
        },
    },

    methods: {
        setColor(color) {
            this.updateColors(color);
            this.value = color;
        },

        updateColors(color) {
            if (color.slice(0, 1) === '#') {
                this.colors = {hex: color};
            } else if (color.slice(0, 4) === 'rgba') {
                const rgba = color.replace(/^rgba?\(|\s+|\)$/g, '').split(',');
                const hex = '#' + ((1 << 24) + (parseInt(rgba[0]) << 16) + (parseInt(rgba[1]) << 8) + parseInt(rgba[2])).toString(16).slice(1);
                this.colors = {hex: hex, a: rgba[3]};
            }
        },

        showPicker() {
            document.addEventListener('click', this.documentClick);
            this.displayPicker = true;
        },

        hidePicker() {
            document.removeEventListener('click', this.documentClick);
            this.displayPicker = false;
        },

        togglePicker() {
            this.displayPicker ? this.hidePicker() : this.showPicker();
        },

        updateFromInput() {
            this.updateColors(this.value);
        },

        updateFromPicker(color) {
            this.colors = color;
            if (color.rgba.a === 1) {
                this.value = color.hex;
            } else {
                this.value = color.hex8;
            }
        },

        documentClick(e) {
            let el = this.$refs.colorpicker;
            let target = e.target;

            if ((el && el !== target && !el.contains(target)) || (target && target.classList.contains('sticky-cover')))
                this.hidePicker();

        },

        clear: function () {
            this.updateColors(this.defaultColor);
            this.value = "";
        },
    },

    template: `
        <div class="modal-body condition ccb-custom-scrollbar">
            <div class="cbb-edit-field-container">
                <div class="ccb-grid-box" style="background: transparent">
                    <div class="container">
                        <div class="row">
                            <div class="col-6">
                                <div class="ccb-select-box">
                                    <span class="ccb-select-label">Select category</span>
                                    <div class="ccb-select-wrapper">
                                        <i class="ccb-icon-Path-3485 ccb-select-arrow"></i>
                                        <select style="min-width: unset" class="ccb-select big" v-model="calcCategory">
                                            <option value="">Select Category</option>
                                            <option :value="cat.slug" v-for="cat in $store.getters.getCats">{{ cat.title }}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="ccb-select-box">
                                    <span class="ccb-select-label">Select calc type</span>
                                    <div class="ccb-select-wrapper">
                                        <i class="ccb-icon-Path-3485 ccb-select-arrow"></i>
                                        <select style="min-width: unset" class="ccb-select big" v-model="calcType">
                                            <option value="default">Default</option>
                                            <option value="free">Free</option>
                                            <option value="pro">Pro</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row ccb-p-t-15">
                            <div class="col-6">
                                <div class="ccb-input-wrapper">
                                    <span class="ccb-input-label">Calc link</span>
                                    <input type="text" class="ccb-heading-5 ccb-light" placeholder="Enter calc link" v-model="calcLink">
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="ccb-input-wrapper">
                                    <span class="ccb-input-label">Icon background</span>
                                    <div class="ccb-icon-color-box ccb-color-box">
                                        <div class="ccb-color-picker" @click="showPicker">
                                            <span class="color" @click="togglePicker" :style="{backgroundColor: value}"></span>
                                            <span class="color-value ccb-heading-5">{{ value }}</span>
                                            <div class="sticky-popover" v-if="displayPicker">
                                                <div class="sticky-cover" @click="togglePicker"></div>
                                                <sketch-picker :value="colors" @input="updateFromPicker"></sketch-picker>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row ccb-p-t-15">
                            <div class="col-12">
                                <div class="ccb-input-wrapper">
                                    <span class="ccb-input-label">Descriptions</span>
                                    <textarea class="ccb-heading-5 ccb-light" v-model="calcDescription" placeholder="Descriptions"></textarea>
                                </div>
                            </div>
                        </div>
                        <div class="row ccb-p-t-15">
                            <div class="col-12">
                                <div class="ccb-input-wrapper">
                                    <span class="ccb-input-label">Info Content</span>
                                    <textarea class="ccb-heading-5 ccb-light" v-model="calcInfo" placeholder="Info content"></textarea>
                                </div>
                            </div>
                        </div>
                        <div class="row ccb-p-t-15">
                            <div class="col-12">
                                <div class="ccb-input-wrapper">
                                    <span class="ccb-input-label">Icons</span>
                                </div>
                                <div class="calc-preloader-box" style="flex-wrap: wrap; row-gap: 10px">
                                    <div class="calc-preloader-item" style="min-width: 50px" @click="calcIconType = icon.icon" :class="{'ccb-preloader-selected': calcIconType === icon.icon}" v-for="icon in $store.getters.getIcons">
                                        <div :class="['calc-template-icon-wrapper', icon.wrapper]">
                                            <i :class="icon.icon" style="display: flex; font-size: 22px; align-items: center; justify-content: center"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
}