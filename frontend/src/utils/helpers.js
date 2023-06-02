import ToolTip from "./toolTip";

const Helpers = {}

Helpers.getFieldByAlias = function (alias) {
	let result = {}
	if ( Array.isArray(this.calc_data.fields) )
		result = this.calc_data.fields.find(e => e.alias === alias) || {}
	return result
}

Helpers.splitIndex = function(optionIndex) {
	const split  = optionIndex.split('_')
	const len    = split.length
	return +(split[len -1])
},

Helpers.hasOptions = function(found) {
	return (found.hasOwnProperty('options') || found.hasOwnProperty('params')) && ( this.indexOf(found.alias, 'dropDown') || this.indexOf(found.alias, 'toggle') || this.indexOf(found.alias, 'checkbox') || this.indexOf(found.alias, 'radio') )
}

Helpers.indexOf = function(text, search) {
	return text.indexOf(search) !== -1
}

Helpers.filterUnused = function(extra, element) {
	setTimeout(() => {
		if (typeof extra !== 'undefined' || (element.alias.indexOf('quantity') !== -1 && element.value > 0)
            || ( element.alias.indexOf('text_field') !== -1 && element.value.length > 0 && element.value !== 0 )
            || ( element.alias.indexOf('range_field') !== -1 && element.value !== 0 ) ){
		    this.$store.getters.filterUnused(element);
        }
	}, 100)
}

Helpers.validateUnit = function(value, len = 2) {
	return +value.toFixed(len)
}

Helpers.getDemoModeNotice = function() {
	/** firstly remove all demo blocks **/
	document.querySelectorAll('.ccb-demo-mode-attention').forEach(function (elem) {
		elem.remove();
	});

	var demoModeDiv = document.createElement('div');
	demoModeDiv.classList.add('ccb-demo-mode-attention');
	demoModeDiv.innerText = 'Sorry, this site is only for demo purposes.';
	demoModeDiv.onclick = () => { demoModeDiv.remove();};

	return demoModeDiv;
}

ToolTip.arrayFrom = function(data) {
	data = data || []
	return Array.from(data)
}


export default Helpers
