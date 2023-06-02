import settingsMixin from './settingsMixin';

export default {
	mixins: [settingsMixin],
	data: () => ({}),
	created() {
	    if ( !this.settingsField.general.hasOwnProperty('show_details_accordion') ) {
            this.settingsField.general.show_details_accordion = true;
        }
    },
}