const ToolTip = {}

ToolTip.initListeners = function() {
	this.closeSliderToolTip()
	window.addEventListener('scroll', () => this.toolTipHandler())
	// if is admin page and preview mode
	const preview = document.querySelector('.modal-window-content')
	if ( preview )
		preview.addEventListener('scroll', () => this.toolTipHandler())
}

ToolTip.closeSliderToolTip = function() {
	const handles = this.arrayFrom(document.querySelectorAll('.e-handle'))
	handles.forEach(h => h.addEventListener('mouseup', () => this.toolTipHandler()))
}

ToolTip.toolTipHandler = function() {
	let toolTipActiveOpen = this.arrayFrom(document.querySelectorAll('.e-material-tooltip-open'))
	toolTipActiveOpen.forEach(e => e.style.zIndex = -1000)
}

export default ToolTip