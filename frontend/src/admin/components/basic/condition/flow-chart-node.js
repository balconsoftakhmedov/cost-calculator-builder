window.ccbNodeStore = {};
export default {
    props: {
        id: {
            type: Number,
            default: 1000,
            validator(val) {
                return typeof val === 'number'
            }
        },
        node: {
            type: Object,
            required:true
        },
        nodes: {
            type: Object,
            required:true
        },
        elements: {
            default: [],
        },
        nodeOptions: {
            type: Object,
            default() {
                return {
                    centerX: 1024,
                    scale: 1,
                    centerY: 140,
                }
            }
        },
        x: {
            type: Number,
            default: 0,
            validator(val) {
                return typeof val === 'number'
            }
        },
        y: {
            type: Number,
            default: 0,
            validator(val) {
                return typeof val === 'number'
            }
        },
    },

    created() {
        const fields = this.$store.getters.getBuilder.map(b => {
            const field = this.$store.getters.getFields.find(f => f.tag === b._tag);
            if (field) {
                b.icon = field.icon;
                b.text = field.description;
            }
            return b;
        });

        const field = fields.find(f => f.alias === this.node.options);
        if (field)
            this.node.description = field.text;

        setTimeout(() => {
            if (this.$refs.node) {
                this.$refs.node.addEventListener('mousedown', () => {
                    if ( !window.ccbNodeStore[this.id] ) {
                        window.ccbNodeStore[this.id] = true;
                        this.disableClick = true;
                    }
                });

                this.$refs.node.addEventListener('mouseup', e => this.disableClick = false);
            }
        })
    },

    data() {
        return {
            disable: false,
            responsive: {
                1920: 1150,
                1600: 837,
                1440: 717,
                1220: 505,
            },
            show: {
                delete: false,
            }
        }
    },
    computed: {
        disableClick: {
            get() {
                return this.disable;
            },

            set(value) {
                this.disable = value;
            }
        },

        getCursor() {
            return {
                pointerEvents: this.disableClick ? 'none !important' : 'all !important',
            }
        },

        nodeStyle() {
            this.$emit('update');
            // todo check is width correct (if created on other screen size )
            return {
                top: this.node.y + 'px',
                left: this.node.x + 'px',
            }
        },

        getNodeIcon() {
            const field = this.$store.getters.getFields.find(f => f.description === this.node.description)
            if ( field )
                return field.icon
            return this.node.icon
        },
    },

    methods: {
        handleMousedown( e ) {
            this.nodes.forEach(innerNode => {
                if (parseInt(innerNode.id) !== parseInt(this.id))
                    window.ccbNodeStore[innerNode.id] = null;
            });

            this.clientX = null;
            if ( e ) {
                const target = e.target || e.srcElement;
                if (target.className.indexOf('no-draggable') === -1 && target.className.indexOf('node-input') < 0 && target.className.indexOf('node-output') < 0) {
                    this.$emit('nodeSelected', e);
                }
            }
            e.preventDefault();
        },

        startLinkMouseDown(e) {
            this.$emit('linkingStart', this.node.id,  e.target, {x: e.clientX - 200, y: e.clientY - 200} );
            e.preventDefault();
        },

        stopLinkMouseUp(e) {
            this.$emit('linkingStop', this.node.id );
            e.preventDefault();
        },
    },
    filters: {
        'to-short': (value) => {
            if(value.length >= 33) {
                return value.substring(0, 30) + '...';
            }
            return value;
        },
    },

    template: `
       <div class="ccb-c-rectangle" :style="nodeStyle" @mouseup="stopLinkMouseUp" @mousedown="handleMousedown" v-bind:class="{selected: nodeOptions.selected === id}" ref="node">
            
            <i class="node-output-point top left" v-if="node.calculable" @mousedown="startLinkMouseDown"></i>
            <i class="node-output-point top center" v-if="node.calculable" @mousedown="startLinkMouseDown"></i>
            <i class="node-output-point top right" v-if="node.calculable" @mousedown="startLinkMouseDown"></i>
            
            <div class="ccb-c-rectangle-item">
                <i class="node-output-point left side" v-if="node.calculable" @mousedown="startLinkMouseDown" ></i>
                <span :class="getNodeIcon"></span>
                <div class="ccb-c-title-box">
                    <div class="ccb-c-title-box-inner">
                        <div class="title">
                            {{node.label | to-short}}                            
                        </div>
                        <div class="description">
                            {{ node.description }}                            
                        </div>      
                    </div>
                    <div class="ccb-c-title-box-delete node-delete ccb-delete" :style="getCursor">
                        <span class="close-icon node-delete ccb-delete" :style="getCursor"></span>
                    </div>
               </div>
                <i class="node-output-point right side" v-if="node.calculable" @mousedown="startLinkMouseDown"></i>
            </div>
            <i class="node-output-point bottom left" v-if="node.calculable" @mousedown="startLinkMouseDown"></i>
            <i class="node-output-point bottom center" v-if="node.calculable" @mousedown="startLinkMouseDown"></i>
            <i class="node-output-point bottom right" v-if="node.calculable" @mousedown="startLinkMouseDown"></i>
        </div>
    `
}