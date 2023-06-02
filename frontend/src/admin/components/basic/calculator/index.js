import {toast} from "../../../../utils/toast";
import ccbModalWindow from '../../utility/modal';
import preview from './partials/preview';
import {
	checkbox, text, toggle, quantity, total, fileUpload, html, dropDown, dropDownWithImg,
	line, datePicker, multiRange, range, radio, radioWithImage, checkboxWithImage
} from './fields';

import quickTourMixin from '../quick-tour/quickTourMixin';
import hintMixin from "../quick-tour/hintMixin";
import calcConfig from './partials/config'
import quickTourModal from "./partials/quick-tour-start"


export default {
	mixins: [quickTourMixin, hintMixin],
	components: {
		preview,
		'html-field': html,
		'line-field': line,
		'total-field': total,
		'toggle-field': toggle,
		'text-area-field': text,
		'checkbox-field': checkbox,
		'quantity-field': quantity,
		'range-button-field': range,
		'drop-down-field': dropDown,
		'radio-button-field': radio,
		'multi-range-field': multiRange,
		'date-picker-field': datePicker,
		'file-upload-field': fileUpload,
		'drop-down-with-image-field': dropDownWithImg,
		'radio-with-image-field': radioWithImage,
		'checkbox-with-image-field': checkboxWithImage,
		'ccb-modal-window': ccbModalWindow,
		'calc-config': calcConfig,
		'ccb-quick-tour': quickTourModal,
	},

	data: () => ({
		fieldData: {},
		newCalc: false,
		updateEditKey: 0,
		currentField: null,
		draggableBorder: false,
		showElements: false,
	}),

	created() {
		if ( this.getTourStep !== 'done' ) {
			this.$store.commit('setModalType', 'quick-tour');
			this.$store.commit('setOpenModal', true);
		}
	},

	mounted() {
		this.initListeners()
	},

	computed: {
		getProFields() {
			return ['cost-multi-range', 'date-picker', 'cost-file-upload', 'cost-drop-down-with-image', 'cost-checkbox-with-image', 'cost-radio-with-image'];
		},

		duplicateNotAllowed() {
			return !(this.getFields || []).every(e => !e.hasOwnProperty('tag'));
		},

		draggableKey() {
			return this.getters.getCount;
		},

		getErrorIdx() {
			return this.getters.getErrorIdx || [];
		},

		getFields() {
			return this.getters.getBuilder.map(b => {
				const field = this.getters.getFields.find(f => f.tag === b._tag);
				if (field) {
					b.icon = field.icon;
					b.text = field.description;
				}
				return b;
			});
		},

		getIndex() {
			return this.getters.getIndex;
		},

		editId: {
			get() {
				return this.$store.getters.getEditID
			},

			set(value) {
				this.updateEditKey++;
				this.$store.commit('setEditID', value);
			}
		},

		getOrderId() {
			this.$store.dispatch('setFieldId');
			return this.getters.getFieldId;
		},

		getType() {
			this.updateEditKey++;
			const type = this.$store.getters.getType || null;
			this.fieldData = this.getters.getFieldData(this.editId);
			return type;
		},

		access() {
			return this.$store.getters.getAccess;
		},

		dragOptions() {
			return {
				animation: 200,
				group: "description",
				disabled: false,
				ghostClass: "ghost",
			};
		},

		getTitle: {
			get() {
				return this.$store.getters.getTitle
			},

			set(newValue) {
				this.$store.commit('setTitle', newValue);
			},
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

		getTourStep: {
			get() {
				return this.$store.getters.getQuickTourStep
			},

			set(value) {
				this.$store.commit('setQuickTourStep', value)
			},
		},

		quickTourStarted: {
			get() {
				return this.getters.getQuickTourStarted
			},

			set(value) {
				this.$store.commit('setQuickTourStarted', value)
			}
		},
	},

	methods: {
		startQuickTour() {
			this.editable = true
			if ( this.getTourStep === '.calc-quick-tour-title-box' ) {
				this.$nextTick(() => {
					setTimeout(() => {
						this.renderQuickTour()
					}, 200)
				})
			}
		},

		initListeners() {
			document.body.addEventListener('click', e => {
				if (this.getType && e.target.classList.contains('ccb-not-allowed') === true) {
					this.closeOrCancelField()
				}
			})

			document.body.addEventListener('keydown', e => {
				if (e.keyCode === 27 && this.getType) {
					this.closeOrCancelField()
				}
			})
		},

		closeOrCancelField(nextStep = true) {
			this.$store.commit('setType', '');
			this.$store.commit('setIndex', null);

			this.editId = null;
			this.$store.commit('setFieldId', null);
			if (nextStep)
				this.quickTourNext('.calc-quick-tour-edit-field')
		},

		saveTitle() {
			if (this.$store.getters.getDisableInput === false && this.$store.getters.getTitle !== '')
				this.$store.commit('setDisabledInput', true);
		},

		enableInput() {
			this.$refs.title.focus();
			if (this.$store.getters.getDisableInput === true)
				this.$store.commit('setDisabledInput', false);
		},

		removeFromBuilder(idx) {
			this.clearErrors(idx);
			this.$store.commit('removeFromBuilderByIdx', idx);
			this.$store.commit('updateAvailableFields', this.$store.getters.getBuilder);
			this.closeOrCancelField();
			this.initErrors(idx);
		},

		async duplicateField(field_id, notAllowed) {
			if (notAllowed)
				return;

			const field = Object.values(this.getFields).find(field => parseInt(field._id) === parseInt(field_id));
			if (typeof field !== "undefined") {
				/** create element from first found by id **/
				/** ps: cause wrong logic was earlier and there ara maybe fields with same ids **/
				let newField = Object.assign({}, field);

				let maxId = Math.max.apply(null, this.getFields.map(item => parseInt(item._id)));
				let id = parseInt(maxId) + 1;
				let cleanFieldAlias = newField.alias.replace(/\_\d+/, '');
				let duplicatedCount = this.getFields
					.filter(function (row) {
						return row.stm_dublicate_field_id == field_id
					})
					.length;

				newField._id = id;
				newField.stm_dublicate_field_id = field_id;
				newField.label = newField.label + ' (copy ' + (parseInt(duplicatedCount) + 1) + ')';
				newField.alias = cleanFieldAlias + '_' + id;

				if (field.hasOwnProperty('options')) {
					newField.options =  JSON.parse(JSON.stringify(field.options));
				}

				if (field.hasOwnProperty('styles')) {
					newField.styles =  JSON.parse(JSON.stringify(field.styles));
				}

				this.$store.commit('addToBuilder', {data: newField, id: id, index: null});
				this.$store.commit('updateAvailableFields', this.$store.getters.getBuilder);
				this.$store.getters.updateCount(1);

				this.$store.commit('setType', field.type);
				toast('Field Duplicated', 'success');
				this.editField(null, field.type, id);
			}
		},

		addOrSaveField(data, id, index) {
			this.clearErrors(id);
			this.$store.commit('addToBuilder', {data, id, index});
			this.$store.commit('updateAvailableFields', this.$store.getters.getBuilder);
			this.$store.commit('setFieldsKey', this.$store.getters.getFieldsKey + 1)
			this.$store.getters.updateCount(1);
			this.closeOrCancelField();
			toast('Element Settings Saved', 'success')
		},

		clearErrors(id) {
			if (this.getErrorIdx.includes(id))
				this.$store.commit('setErrorIdx', this.getErrorIdx.filter(e => e !== id));
		},

		initErrors(idx) {
			if (!this.getErrorIdx.length && typeof idx !== "undefined")
				return true;

			this.$store.commit('setErrorIdx', []);
			const builders = this.$store.getters.getBuilder;
			const errorIdx = [];
			builders.forEach((b, idx) => {
				if (b._id === undefined)
					errorIdx.push(idx);
			});
			this.$store.commit('setErrorIdx', errorIdx);
		},

		editField(event, type, id) {
			if (event) {
				const classNames = ['ccb-icon-Path-3505', 'ccb-duplicate', 'ccb-icon-Path-3503'];
				const [className,] = event.target.className.split(' ');
				if (classNames.includes(className))
					return;
			}

			if (typeof type === 'string')
				type = type.toLowerCase().split(' ').join('-');
			this.editId = id;
			this.$store.commit('setType', type);
		},

		allowAccess() {
			if (this.$store.getters.getTitle !== '') {
				this.$store.commit('changeAccess', true);
				this.$store.commit('setDisabledInput', true);
			}
		},

		addField(field) {
			if (typeof field.type !== 'undefined') {
				const builders = this.$store.getters.getBuilder;
				this.$store.dispatch('setFieldId');
				this.$store.commit('setIndex', builders.length);
				this.$store.commit('setType', field.type);
				field.text = field.description;
				builders.push(field);
				this.$store.commit('setBuilder', builders);
				this.editField(null, field.type, builders.length - 1);
			}

			this.quickTourNext('.calc-quick-tour-elements')
		},

		log(event) {
			const moved = event.moved;
			const current = event.added;

			if (current) {
				const builders = this.$store.getters.getBuilder;
				const validIdx = (current.newIndex === builders.length) ? current.newIndex - 1 : current.newIndex;
				this.$store.commit('setIndex', validIdx);
				this.$store.commit('setType', current.element.type);
				this.editField(null, current.element.type, validIdx);
				const currentField = builders[validIdx];
				if (currentField) {
					currentField.text = currentField.description;
					builders[validIdx] = currentField;
					this.$store.commit('setBuilder', builders);
				}
			} else if (moved && this.editId !== null) {
				this.editField(null, moved.element.type, moved.newIndex);
			}

			this.quickTourNext('.calc-quick-tour-elements')
		},

		openTemplateSettings() {
			this.$store.commit('setModalType', 'calc-settings')
		},

		start() {
			const body = document.querySelector('body');
			if (body && !body.classList.contains('ccb-border-wrap'))
				body.classList.add('ccb-border-wrap')
		},

		clear() {
			const builders = this.$store.getters.getBuilder;
			this.$store.commit('setBuilder', builders.filter(builder => builder.alias && builder._id !== null && builder._id !== undefined))
		},

		end() {
			const body = document.querySelector('body.ccb-border-wrap');
			if (body && !this.quickTourStarted)
				body.classList.remove('ccb-border-wrap');
		},

		quickTourNext(target) {
			if (this.quickTourStarted)
				this.quickTourNextStep(target, this.calcQuickTour)
		}
	},

	watch: {
		'$store.getters.getQuickTourStep': function (value) {
			if ( value === '.calc-quick-tour-conditions' )
				this.closeOrCancelField(false)
		}
	},

	filters: {
		'to-short': (value) => {
			if (value && value.length >= 18) {
				return value.substring(0, 15) + '...'
			}
			return value || ''
		},
	},

	destroyed() {
		this.closeOrCancelField()
	}
};
