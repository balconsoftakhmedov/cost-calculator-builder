const $ = require('jquery')
import fieldsMixin from "./fieldsMixin";
import {enableRipple} from '@syncfusion/ej2-base';

enableRipple(true);

export default {
	mixins: [fieldsMixin],
	props: {
		id: {
			default: null,
		},
		value: {
			default: 0,
			type: [Number, String]
		},
		field: [Object, String],
	},

	data: () => ({
		errors: {fileUploadUrl: false},
		fileUpload: null,
		fileUploadPrice: 0,
		fileUploadUrl: '',
		openFileList: false,
		showInfo: false,
		uploadedFiles: [],
		uploadFromUrl: false,
	}),

	created() {
		this.fileUpload = this.parseComponentData();

		if (this.fileUpload.alias) {
			this.fileUploadPrice = isNaN(parseFloat(this.fileUpload.price)) ? 0 : parseFloat(this.fileUpload.price);
		}
	},

	mounted() {
		this.change();
	},

	computed: {
		additionalCss() {
			return this.$store.getters.getCalcStore.hasOwnProperty(this.field.alias) && this.$store.getters.getCalcStore[this.field.alias].hidden === true
				? 'display: none;'
				: '';
		},

		allowedFormats() {
			const allowedFormats = [];
			this.fileUpload.fileFormats.forEach((fileFormat) => {
				allowedFormats.push.apply(allowedFormats, fileFormat.split('/'));
			})
			return allowedFormats;
		},

		calculatorId() {
			return this.$store.getters.getSettings.calc_id || this.$store.getters.getId;
		},

		calcStore() {
			return this.$store.getters.getCalcStore;
		},

		translations() {
			return this.$store.getters.getTranslations;
		},
	},

	methods: {
		addFiles(event) {
			let vm = this;
			vm.errors.fileUploadUrl = false;
			let uploadedFiles = [...vm.uploadedFiles];
			uploadedFiles.push.apply(uploadedFiles, event.target.files);
			uploadedFiles = uploadedFiles.filter(file => vm.validateFile(file));

			if (vm.fileUpload.max_attached_files < parseInt(uploadedFiles.length)) {
				let amountToRemove = parseInt(uploadedFiles.length) - parseInt(vm.fileUpload.max_attached_files);
				uploadedFiles.splice(uploadedFiles.length - amountToRemove, amountToRemove);
			}

			this.uploadedFiles = uploadedFiles;
		},

		change() {
			const value = {
				price: this.uploadedFiles.length > 0 ? this.fileUploadPrice : 0,
				files: this.uploadedFiles,
			};

			/** update calc store data **/
			this.$emit(this.fileUpload._event, value, this.fileUpload.alias);
			/** apply conditions **/
			this.$emit('condition-apply', this.fileUpload.alias);
		},

		chooseFileBtn() {
			if (this.fileUpload.max_attached_files <= parseInt(this.uploadedFiles.length)) {
				return;
			}
			this.uploadFromUrl = false;
			this.$refs.file.click();
		},

		removeFile(fileIndex) {
			this.uploadedFiles.splice(fileIndex, 1);
			this.$refs.file.value = '';
		},

		async uploadFileFromUrl() {
			let vm = this;
			let uploadedFiles = [...vm.uploadedFiles];
			if (vm.fileUpload.max_attached_files < parseInt(uploadedFiles.length) + 1) {
				return;
			}
			let fileName = this.fileUploadUrl.split('/').pop().split('#')[0].split('?')[0];

			fetch(this.fileUploadUrl)
				.then(function (response) {
					if (response.ok) {
						return response.blob();
					} else {
						vm.errors.fileUploadUrl = this.translations.wrong_file_url;
						return false;
					}
				})
				.then(blob => {
					if (vm.errors.fileUploadUrl == false) {

						if (fileName.lastIndexOf(".") == -1) {
							let extension = blob.type.split('/')[1].toLowerCase();
							fileName = fileName + '.' + extension;
						}
						let file = new File([blob], fileName, {type: blob.type});
						if (vm.validateFile(file)) {
							vm.uploadedFiles.push(file);
						}
					}
				})
				.catch((err) => {
					vm.errors.fileUploadUrl = "Wrong file format";
				});

			this.fileUploadUrl = '';
		},

		validateFile(file) {
			/** check size **/
			let fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);

			if (+this.fileUpload.max_file_size < fileSizeInMB) {

				this.errors.fileUploadUrl = this.translations.big_file_size;
				return false;
			}

			/** check format **/
			if (!this.allowedFormats.includes(file.name.split(".").pop().toLowerCase())) {
				this.errors.fileUploadUrl = this.translations.wrong_file_format;
				return false;
			}
			return true;
		},

		uploadFromUrlBtn() {
			if (this.fileUpload.max_attached_files <= parseInt(this.uploadedFiles.length)) {
				return;
			}
			this.uploadFromUrl = !this.uploadFromUrl;
			this.fileUploadUrl = '';
			this.errors.fileUploadUrl = false;
		},
	},
	watch: {
		fileUploadUrl() {
			this.errors.fileUploadUrl = false;
		},
		uploadedFiles() {
			this.change();
		},
		value(value) {
			if (parseFloat(value) != parseFloat(value)) {
				this.fileUploadPrice = value;
			}
		},
	},
}
