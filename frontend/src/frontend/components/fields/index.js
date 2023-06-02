/****************** Fields ******************/
import total 		    from './cost-total' // main-component front
import checkbox 		from './cost-checkbox' // main-component front
import date_picker 		from './cost-date-picker' // main-component front
import drop_down 		from './cost-drop-down' // main-component front
import dropDownImg 		from './cost-drop-down-with-image' // main-component front
import html 			from './cost-html' // main-component front
import line 			from './cost-line' // main-component front
import multi_range 		from './cost-multi-range' // main-component front
import radio 			from './cost-radio' // main-component front
import range 			from './cost-range' // main-component front
import text 			from './cost-text' // main-component front
import toggle 			from './cost-toggle' // main-component front
import quantity 		from './cost-quantity' // main-component front
import file_upload 		from './cost-file-upload' // main-component front
import radioWithImg 	from './cost-radio-with-image' // main-component front
import checkboxWithImg 	from './cost-checkbox-with-image' // main-component front


export default [
	{ content: total, 		    template_name: 'total', 				component_name: 'cost-total' },
	{ content: quantity, 		template_name: 'quantity', 				component_name: 'cost-quantity' },
	{ content: checkbox, 		template_name: 'checkbox', 				component_name: 'cost-checkbox' },
	{ content: date_picker, 	template_name: 'date-picker', 			component_name: 'date-picker' },
	{ content: drop_down, 		template_name: 'drop-down', 			component_name: 'cost-drop-down' },
	{ content: dropDownImg, 	template_name: 'drop-down-with-image',	component_name: 'cost-drop-down-with-image'},
	{ content: html, 			template_name: 'html', 					component_name: 'cost-html' },
	{ content: line, 			template_name: 'line', 					component_name: 'cost-line' },
	{ content: multi_range, 	template_name: 'multi-range', 			component_name: 'cost-multi-range' },
	{ content: radio, 			template_name: 'radio-button', 			component_name: 'cost-radio' },
	{ content: range, 			template_name: 'range-button', 			component_name: 'cost-range' },
	{ content: text, 			template_name: 'text-area', 			component_name: 'cost-text' },
	{ content: toggle, 			template_name: 'toggle', 				component_name: 'cost-toggle' },
	{ content: file_upload, 	template_name: 'file-upload', 			component_name: 'cost-file-upload' },
	{ content: radioWithImg, 	template_name: 'radio-with-image', 		component_name: 'cost-radio-with-image' },
	{ content: checkboxWithImg, template_name: 'checkbox-with-image', 	component_name: 'cost-checkbox-with-image' },
]