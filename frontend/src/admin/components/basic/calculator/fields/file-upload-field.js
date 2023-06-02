export default {
	props: {
		field: {
			type: Object,
			default: {},
		},
		id: {
			default: null,
		},
		index: {
			default: null,
		},
		order: {
			default: 0,
		},
	},

	data: () => ({
		fieldGroupId: {},
		fileFormats: [
			//Images
			{name: 'png'}, {name: 'jpg/jpeg'}, {name: 'gif'}, {name: 'webp'}, {name: 'svg'},
			//Documents
			{name: 'pdf'}, {name: 'doc/docx'}, {name: 'ppt/pptx'}, {name: 'pps/ppsx'}, {name: 'odt'}, {name: 'xls/xlsx'}, {name: 'psd'}, {name: 'key'}, {name: 'ai'}, {name: 'cdr'},
			//Audio
			{name: 'mp3'}, {name: 'm4a'}, {name: 'ogg'}, {name: 'wav'},
			//Video
			{name: 'mp4'}, {name: 'mov'}, {name: 'avi'}, {name: 'mpg'}, {name: 'ogv'}, {name: '3gp'}, {name: '3g2'},
			//Compression
			{name: 'zip'}, {name: 'rar'},
		],
		fileUploadField: {},
		isCopied: false,
		showHelp: {
			'file_formats': false,
		},
		wpFileSizeLink: 'https://docs.stylemixthemes.com/cost-calculator-builder/calculator-elements/file-upload/how-to-increase-maximum-file-upload-size-in-wordpress',
		wpConfigLink: 'https://docs.stylemixthemes.com/cost-calculator-builder/calculator-elements/file-upload/how-to-allow-additional-file-types-in-wordpress'
	}),
	watch: {
		'$store.getters.getEditFieldError': function (value) {
			if ( value === 'save_field' )
				this.save()
		},

		'fileUploadField.max_file_size'() {
			const errors = Object.assign({}, this.errors);
			if (this.isObjectHasPath(errors, ['fileUploadField', 'max_file_size']) &&
				this.fileUploadField.max_file_size && this.fileUploadField.max_file_size.length > 0) {
				delete errors.fileUploadField.max_file_size;
				this.errors = errors;
			}
		},

		'fileUploadField.max_attached_files'() {
			const errors = Object.assign({}, this.errors);
			if (this.isObjectHasPath(errors, ['fileUploadField', 'max_attached_files'])) {
				delete errors.fileUploadField.max_attached_files;
				this.errors = errors;
			}
		},
	},
	computed: {
		allowedFileFormats() {
			const defaultFileField = this.$store.getters.getFields.filter((field) => field.alias == "file-upload");
			if (defaultFileField[0].hasOwnProperty('formats')) {
				return Object.values(defaultFileField[0].formats);
			}
			return [];
		},
		descOptions() {
			return this.$store.getters.getDescOptions
		},
		errors: {
			get() {
				return this.$store.getters.getErrors;
			},

			set(errors) {
				this.$store.commit('setErrors', errors)
			},
		},
		fieldErrors() {
			if (!this.errors.hasOwnProperty('fileUploadField')) {
				return {};
			}
			return this.errors.fileUploadField;
		},
		translations() {
			return this.$store.getters.getTranslations;
		},
	},

	mounted() {
		this.errors = {};
		this.field = this.field.hasOwnProperty('_id') ? this.field : {};
		this.fileUploadField = {...this.resetValue(), ...this.field};
		if (this.fileUploadField._id === null) {
			this.fileUploadField._id = this.order;
			this.fileUploadField.alias = this.fileUploadField.alias + this.fileUploadField._id;
		}

		// wp_max_upload_size
		if (this.$el.getElementsByClassName('wp_max_upload_size').length > 0 && this.fileUploadField.max_file_size === false) {
			this.fileUploadField.max_file_size = parseInt(this.$el.getElementsByClassName('wp_max_upload_size')[0].innerText);
		}
	},

	methods: {
		fileFormatsHandler() {
			if (this.fileUploadField.fileFormats.length > 0)
				delete this.errors.fileUploadField.fileFormats
			this.validate()
		},

		checkConditionNodesIfPriceWasChanged() {
			const conditions = this.$store.getters.getConditions;
			if (!conditions.hasOwnProperty('nodes') || conditions.nodes.length === 0)
				return;

			const fileFieldIndex = conditions.nodes.findIndex((obj => obj.options === this.fileUploadField.alias));
			if (fileFieldIndex === -1)
				return;

			let calculable = true;
			if (isNaN(parseFloat(this.fileUploadField.price)) || !this.fileUploadField.price) {
				calculable = false;
				conditions.links = conditions.links.filter(link => link.options_from !== this.fileUploadField.alias);
				this.$store.commit('updateConditionLinks', conditions.links);
			}

			conditions.nodes[fileFieldIndex]['calculable'] = calculable;
			this.$store.commit('updateConditionNodes', conditions.nodes);
		},

		copyRule() {
			const input = document.body.appendChild(document.createElement("input"));
			input.value = document.querySelector('#configCode').innerText;
			input.select();
			document.execCommand('copy');
			input.parentNode.removeChild(input);

			this.isCopied = true;
			setTimeout(() => {
				this.isCopied = false;
			}, 1000);
		},

		numberCounterAction(modelKey, action = '+') {
			let input = document.querySelector('input[name=' + modelKey + ']');
			let step = 1;
			let value = this.fileUploadField[modelKey];

			if (!this.fileUploadField.hasOwnProperty(modelKey) || input === null)
				return;

			if (input.step.length !== 0)
				step = input.step;

			value = action === '-'
				? parseFloat(value) - parseFloat(input.step)
				: parseFloat(value) + parseFloat(input.step)

			if (input.min.length !== 0 && value < input.min)
				return;

			value = parseInt(step) === parseFloat(step)
				? value.toFixed()
				: value.toFixed(2);

			this.fileUploadField[modelKey] = value;
		},

		multiselectChooseFileFormat(fileFormat) {
			const errors = Object.assign({}, this.errors);
			if (this.isObjectHasPath(errors, ['fileUploadField', 'fileFormats'])) {
				delete errors.fileUploadField.fileFormats;
				this.errors = errors;
			}

			const existIndex = this.fileUploadField.fileFormats.indexOf(fileFormat.name);

			/** disable **/
			if (existIndex !== -1) {
				this.fileUploadField.fileFormats.splice(existIndex, 1);
			} else {
				/** enable **/
				this.fileUploadField.fileFormats.push(fileFormat.name);
			}
		},

		removeFileFormat(fileFormatName) {
			const existIndex = this.fileUploadField.fileFormats.indexOf(fileFormatName);
			if (existIndex !== -1)
				this.fileUploadField.fileFormats.splice(existIndex, 1);
		},

		resetValue: function () {
			return {
				_id: null,
				_event: 'change',
				_tag: 'cost-file-upload',
				additionalCss: '',
				additionalStyles: '',
				alias: 'file_upload_field_id_',
				addToSummary: true,
				allowCurrency: false,
				description: '',
				desc_option: 'after',
				fileFormats: [],
				hidden: false,
				icon: 'ccb-icon-Path-2572',
				label: '',
				max_attached_files: 1,
				max_file_size: false,
				price: 0,
				required: false,
				type: 'File Upload',
			}
		},

		save() {
			this.validate();
			if (this.errors.hasOwnProperty('fileUploadField')
				&& Object.keys(this.errors.fileUploadField).length > 0) {
				this.$store.commit('setEditFieldError', true)
				return;
			}

			/** check price, based on it change condition calculable option **/
			this.checkConditionNodesIfPriceWasChanged();

			this.$emit('save', this.fileUploadField, this.id, this.index);
		},

		validate() {
			const errors = Object.assign({}, this.errors);
			if (!errors.hasOwnProperty('fileUploadField')) {
				errors.fileUploadField = {};
			}

			if (!this.fileUploadField.max_attached_files)
				errors.fileUploadField.max_attached_files = this.translations.required_field;

			if (!this.fileUploadField.fileFormats || this.fileUploadField.fileFormats.length <= 0)
				errors.fileUploadField.fileFormats = this.translations.not_selected;

			if (!this.fileUploadField.max_file_size || this.fileUploadField.max_file_size.length === 0 || parseInt(this.fileUploadField.max_file_size) === 0)
				errors.fileUploadField.max_file_size = this.translations.required_field;

			this.errors = errors;
		},
	},

	destroyed() {
		this.$store.commit('setEditFieldError', false)
	},
}
