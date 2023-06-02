import flowChart from './flow-chart'
import ccbModalWindow from '../../utility/modal';
import preview from '../calculator/partials/preview';
import quickTourMixin from '../quick-tour/quickTourMixin'
import hintMixin from "../quick-tour/hintMixin";

export default {
	mixins: [quickTourMixin, hintMixin],
	components: {
		preview,
		'flow-chart': flowChart,
		'ccb-modal-window': ccbModalWindow,
	},
	props: ['available', 'conditions'],
	data() {
		return {
			open: false,
			once: false,
			height: 762,
			width: 1386,
			elements: [],
			tempModel: [],
			newNodeLabel: '',
			currentId: null,
			scene: {
				centerX: 1024,
				centerY: 140,
				scale: 1,
				nodes: [],
				links: [],
				/** node css width in px **/
				nodeDefaultWidth: 200,
				/** node css height in px **/
				nodeDefaultHeight: 60,
			},
			condition: {
				hide: false,
				open: false,
			},
			conditionData: {},
			nodeCount: 0,
			inputTypeFields: [ // Set value for condition
				'cost-range',
				'cost-quantity',
				'cost-multi-range',
				'date-picker',
				'cost-total',
				'cost-file-upload'
			],
			isDefaultPosition: true,
			startFromNodeKey: 0,
			nodeInterval: 10, /** in px **/
		}
	},

	computed: {
		getters() {
			return this.$store.getters;
		},

		getElements() {
			return this.getters.getBuilder.map(b => {
				const field = this.getters.getFields.find(f => f.tag === b._tag);
				if (field) {
					b.icon = field.icon;
					b.text = field.description;
				}
				return b;
			});
		},

		rootDiv() {
			const clientRect = document.getElementsByClassName('flowchart-container')[0].getBoundingClientRect();
			if (clientRect)
				clientRect.height = this.height;
			return clientRect;
		},

		centerTopPostion() {
			return (parseInt(this.rootDiv.height)/2) - (this.scene.nodeDefaultHeight/2);
		},

		centerLeftPostion() {
			return (parseInt(this.rootDiv.width)/2) - (this.scene.nodeDefaultWidth/2);
		},

		/**
		 * node can't be beyond the parent div borders
		 * 5 is little padding buffer
		 **/
		nodeStyleMaxPossibleTop() {
			return this.rootDiv.height - this.scene.nodeDefaultHeight - 5;
		},

		/**
		 * node can't be beyond the parent div borders
		 * 5 is little padding buffer
		 **/
		nodeStyleMaxPossibleLeft() {
			return this.rootDiv.width - this.scene.nodeDefaultWidth - 5;
		},
	},

	methods: {
		initResponsive() {
			const maxWidth = window.innerWidth;
			const conditionContent = document.querySelector('.ccb-condition-content');
			if ( conditionContent )
				this.height = conditionContent.offsetHeight - 4

			if (maxWidth <= 1600 && maxWidth > 1440) {
				this.width = 1076;
			} else if (maxWidth <= 1440 && maxWidth > 1366) {
				this.width = 946;
			} else if (maxWidth <= 1366 && maxWidth > 1280) {
				this.width = 872;
			} else if (maxWidth < 1300) {
				this.width = 786;
			}

			this.open = true
		},

		refreshAvailable() {
			this.$store.commit('updateAvailableFields', this.$store.getters.getBuilder);
			this.conditions  = this.$store.getters.getConditions || {};
			this.scene.nodes = this.conditions.nodes;
			this.scene.links = this.conditions.links;
		},

		refreshResponsive() {
			let {nodes, links} = this.$store.getters.getConditions;
			if (links) {
				links = links.map(link => {
					const {target} = link;
					if (target) {
						link.input_coordinates.x = target.x;
						link.input_coordinates.y = target.y;
					}
					return link;
				});
			}

			this.$store.commit('setConditions', {links: links || [], nodes: nodes || []});
		},

		addNode(element) {
			if ( !element ) { return; }

			let maxID      = Math.max(0, ...this.scene.nodes.map(link => link.id));
			let calculable = (['cost-html', 'cost-line', 'cost-text'].indexOf(element._tag)) === -1;
			if ( element._tag === 'date-picker' && parseInt(element.range) === 0 )
				calculable = false;

			if ( element._tag === 'cost-file-upload' && parseInt(element.price) <= 0 )
				calculable = false;

			let y  = this.centerTopPostion;
			let x  = this.centerLeftPostion;

			if ( this.scene.nodes.length > 0 ) {
				this.nodeCount = this.nodeCount + 1;

				/**  Get index of last centered node if exist **/
				const lastCenterNodeIndex = parseInt( this.scene.nodes.map(
					node => ( this.centerLeftPostion === node.x && this.centerTopPostion === node.y ))
					.lastIndexOf(true)
				);
				this.startFromNodeKey = lastCenterNodeIndex === -1 ? 0 : lastCenterNodeIndex ;

				for ( let i = 0; i < this.nodeCount; i++ ) {
					const defaultXPosition = x + (i * this.nodeInterval);
					const defaultYPosition = y + (i * this.nodeInterval);
					if ( ( typeof this.scene.nodes[i+this.startFromNodeKey] === "object" && ( defaultXPosition !== this.scene.nodes[i+this.startFromNodeKey].x || defaultYPosition !== this.scene.nodes[i+this.startFromNodeKey].y ) )
						|| typeof this.scene.nodes[i+this.startFromNodeKey] === "undefined") {
						this.isDefaultPosition = false;
					}
				}

				if ( !this.isDefaultPosition ) {
					this.nodeCount         = 0;
					this.isDefaultPosition = true;
				}

				y = y + ( this.nodeCount * this.nodeInterval);
				x = x + ( this.nodeCount * this.nodeInterval);
			}

			// check is inside parent here
			if ( y > this.nodeStyleMaxPossibleTop ) { y = this.nodeStyleMaxPossibleTop;}
			if ( x > this.nodeStyleMaxPossibleLeft ) { x = this.nodeStyleMaxPossibleLeft;}

			this.scene.nodes.push({
				calculable,
				y       : y,
				x       : x,
				id      : maxID + 1,
				icon    : element.icon,
				label   : element.label,
				options : element.alias || `id_for_label_${element._id}`,
			})
			this.change();
		},

		saveConditionSettings() {
			const data = {
				nodes: this.scene.nodes,
				links: this.scene.links,
			}

			this.$emit('save', data)
		},

		newNode(field) {
			this.addNode(field)
		},

		getByAlias(alias) {
			return this.$store.getters.getFieldByAlias(alias)
		},

		linkEdit(event, data) {
			const vm   = this
			const link = document.querySelector(`[data-link='${data.id}']`)

			if (typeof link !== "undefined") link.classList.add('ccb-link-active')

			this.$store.commit('updateConditionData', {})
			this.$store.commit('updateConditionModel', [])

			const optionsTo   = vm.getByAlias(data.options_to)
			const optionsFrom = vm.getByAlias(data.options_from)

			vm.conditionData.id         = data.id
			vm.conditionData.optionTo   = optionsTo.alias
			vm.conditionData.optionFrom = optionsFrom.alias
			vm.conditionData.type       = (this.inputTypeFields.indexOf( optionsFrom._tag)) !== -1 ? 'input' : 'select'
			vm.conditionData.actionType = (['cost-html', 'cost-line', 'cost-text', 'cost-total'].indexOf(optionsTo._tag)) !== -1 ? 'simple' : 'calc'
			vm.conditionData.actionType = (['cost-multi-range', 'date-picker', 'cost-drop-down-with-image'].indexOf(optionsTo._tag)) !== -1 ? 'pro' : vm.conditionData.actionType

			const params = optionsFrom.options || [];
			if (vm.conditionData.type === 'select')
				this.$store.commit('updateConditionOptions', params);

			if (data.condition)
				this.$store.commit('updateConditionModel', JSON.parse(JSON.stringify(data.condition)));

			this.$store.commit('updateConditionData', vm.conditionData)
			this.$store.commit('setModalType', 'condition')
		},

		removeCondition(index) {
			this.tempModel.splice(index, 1)
		},

		saveCondition() {
			const vm = this
			vm.scene.links.forEach(element => {
				if (element.id === vm.conditionData.id)
					element.condition = vm.tempModel
			})

			jQuery('.ccb-link-active').removeClass('ccb-link-active')
			vm.clearValues()
		},

		clearValues() {
			const vm          = this
			vm.tempModel      = []
			vm.currentId      = null
			vm.conditionData  = {}
			vm.condition.open = false
			vm.condition.hide = true

			setTimeout(() => vm.condition.hide = false, 130)
		},

		change() {
			const vm = this
			vm.$nextTick(() => {
				const data = {
					nodes: vm.scene.nodes,
					links: vm.scene.links,
				}
				vm.$emit('save', data)
			})
		},
	},

	filters: {
		'to-short': (value) => {
			if (value.length >= 23) {
				return value.substring(0, 20) + '...'
			}
			return value
		},
	},

	created() {
		//
		/** set static conditions data **/
		const conditions = { 'actions': [], 'states': [] };
		if ( ajax_window.hasOwnProperty('condition_actions') )
			conditions.actions = ajax_window.condition_actions;

		if ( ajax_window.hasOwnProperty('condition_states') )
			conditions.states = ajax_window.condition_states;

		this.$store.commit('setStaticConditionData', conditions);
		setTimeout(() => this.initResponsive(), 40);
		if (!this.once) {
			this.once = true;
		}
		this.refreshAvailable();
	},
}
