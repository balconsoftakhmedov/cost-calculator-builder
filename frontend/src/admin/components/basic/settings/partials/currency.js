import settingsMixin from "./settingsMixin";

export default {
	mixins: [settingsMixin],
	data: () => ({
		extended: false,
	}),

	mounted() {
		if ( this.generalSettings?.currency.use_in_all )
			this.extended = true;
	},

	watch: {
		'settingsField.currency.num_after_integer': function ( newValue, oldValue ) {
			if ( newValue < 0 || newValue > 8 )
				this.settingsField.currency.num_after_integer = oldValue;
		}
	},
}