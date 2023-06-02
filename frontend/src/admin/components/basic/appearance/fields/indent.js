import number from "./number";

export default {
    props: {
        element: {
            type: Object,
            default: {},
        },
        name: '',
    },
    components: {
        'number-field': number,
    },
    data: () => ({
        indentTopElement: {},
        indentBottomElement: {},
        indentRightElement: {},
        indentLeftElement: {},
        indentDefaultElement: {
            data: {
                min: 0,
                max: 100,
                step: 1,
                dimension: 'px',
            }
        },
        value: '',
    }),
    created() {
        this.setData();
    },
    methods: {
        setData(){
            this.value = this.element.value.join('px ',) + 'px'
            /** Number Elements **/
            if ( this.isObjectHasPath(this.element, ['data', 'top']) ) {
                this.indentTopElement = {
                    ...this.indentDefaultElement,
                    ...this.element.data.top,
                    additional: {icon: 'ccb-icon-Path-3489'}
                };
                this.indentTopElement.name = [this.name, 'data', 'top'].join('.');
            }

            if ( this.isObjectHasPath(this.element, ['data', 'bottom']) ) {
                this.indentBottomElement = {
                    ...this.indentDefaultElement,
                    ...this.element.data.bottom,
                    additional: {icon: 'ccb-icon-Path-3492'}
                };
                this.indentBottomElement.name = [this.name, 'data', 'bottom'].join('.');
            }

            if ( this.isObjectHasPath(this.element, ['data', 'left']) ) {
                this.indentLeftElement = {
                    ...this.indentDefaultElement,
                    ...this.element.data.left,
                    additional: {icon: 'ccb-icon-Path-3491'}
                };
                this.indentLeftElement.name = [this.name, 'data', 'left'].join('.');
            }

            if ( this.isObjectHasPath(this.element, ['data', 'right']) ) {
                this.indentRightElement = {
                    ...this.indentDefaultElement,
                    ...this.element.data.right,
                    additional: {icon: 'ccb-icon-Path-3490'}
                };
                this.indentRightElement.name = [this.name, 'data', 'right'].join('.');
            }
            /** Number Elements | End **/
        },

        generateValue(){
            let top = 0, left = 0, bottom = 0, right = 0

            if ( this.indentTopElement.value > 0 )
                top = parseInt(this.indentTopElement.value)

            if ( this.indentRightElement.value > 0 )
                right = parseInt(this.indentRightElement.value)

            if ( this.indentBottomElement.value > 0 )
                bottom = parseInt(this.indentBottomElement.value)

            if ( this.indentLeftElement.value > 0 )
                left = parseInt(this.indentLeftElement.value)

            return [top, right, bottom, left];
        },
    },

    watch: {
        'indentTopElement.value': function () {
            this.element.value          = this.generateValue();
            this.element.data.top.value = `${parseInt(this.indentTopElement.value)}px`;
            this.$emit('change');
        },
        'indentBottomElement.value': function () {
            this.element.value             = this.generateValue();
            this.element.data.bottom.value = `${parseInt(this.indentBottomElement.value)}px`;
            this.$emit('change');
        },
        'indentLeftElement.value': function () {
            this.element.value           = this.generateValue();
            this.element.data.left.value = `${parseInt(this.indentLeftElement.value)}px`;
            this.$emit('change');
        },
        'indentRightElement.value': function () {
            this.element.value            = this.generateValue();
            this.element.data.right.value = `${parseInt(this.indentRightElement.value)}px`;
            this.$emit('change');
        },
    },
    template: `
            <div class="ccb-indention-wrapper">
                <number-field :element="indentTopElement" :name="indentTopElement.name"></number-field>
                <number-field :element="indentRightElement" :name="indentRightElement.name"></number-field>
                <number-field :element="indentBottomElement" :name="indentBottomElement.name"></number-field>
                <number-field :element="indentLeftElement" :name="indentLeftElement.name"></number-field>
            </div>
    `,
}