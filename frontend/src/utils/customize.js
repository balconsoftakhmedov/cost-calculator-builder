import pSBC from "../libs/color-converter";
import colorFilter from "../libs/color-filter";

const Customize = {}
const $ = require('jquery')

Customize.initEffects = function () {
	const calcId = this.$store.getters.getSettings.calc_id;

	const desktopColors = this.getElementAppearanceStyleByPath(this.appearance, 'desktop.colors.data');
	const desktopBorders = this.getElementAppearanceStyleByPath(this.appearance, 'desktop.borders.data');
	const desktopTypography = this.getElementAppearanceStyleByPath(this.appearance, 'desktop.typography.data');
	const desktopSizes = this.getElementAppearanceStyleByPath(this.appearance, 'desktop.elements_sizes.data');
	const desktopSpacing = this.getElementAppearanceStyleByPath(this.appearance, 'desktop.spacing_and_positions.data');
	const desktopShadow = this.getElementAppearanceStyleByPath(this.appearance, 'desktop.shadows.data');

	const mobileTypography = this.getElementAppearanceStyleByPath(this.appearance, 'mobile.typography.data');
	const mobileSizes = this.getElementAppearanceStyleByPath(this.appearance, 'mobile.elements_sizes.data');
	const mobileSpacing = this.getElementAppearanceStyleByPath(this.appearance, 'mobile.spacing_and_positions.data');

	const prefix = `.ccb-wrapper-${calcId}`;
	const generate_color = (color, alpha) => color.length <= 7 && alpha !== 0 ? `${color + alpha}` : color
	const from_percent = value => value < 7 ? `0${Math.round(value * 255 / 100).toString(16).toUpperCase()}` : Math.round(value * 255 / 100).toString(16).toUpperCase()

	let styles = '';

	const responsive = ['#ccb-mobile-preview', 'mobile']
	if (Object.values(desktopColors).length) {
		const getBorderData = data => {
			return (idx, key) => {
				if (!!(data[idx])) {
					const {type, width, radius} = data[idx]
					const result = {
						type,
						width: `${width}px`,
						radius: `${radius}px`
					}
					return result[key]
				}
				return null
			}
		}

		const shadowGenerator = data => {
			const {x, y, blur, color} = data
			return `${x}px ${y}px ${blur}px ${color}`
		}

		const desktopBorder = getBorderData(desktopBorders)
		const {field_and_buttons_height, container_vertical_max_width, container_horizontal_max_width, container_two_column_max_width } = desktopSizes;
		const {container_shadow} = desktopShadow
		const {accent_color, container, error_color, primary_color, secondary_color} = desktopColors;
		const {
			container_margin,
			container_padding,
			description_position,
			field_side_indents,
			field_spacing
		} = desktopSpacing;

		const {
			description_font_size,
			description_font_weight,
			fields_btn_font_size,
			fields_btn_font_weight,
			header_font_size,
			header_font_weight,
			label_font_size,
			label_font_weight,
			total_field_font_size,
			total_field_font_weight,
			total_font_size,
			total_font_weight
		} = desktopTypography;

		styles += `
			  ${prefix} .calc-container .calc-list .calc-subtotal-list .calc-subtotal-list-accordion,
			  ${prefix} .calc-container .calc-list .calc-subtotal-list {
			  	row-gap: calc(${field_spacing} / 2) !important;
			  }
			  
			  ${prefix} .calc-container .calc-list .calc-fields-container {
			  	row-gap: ${field_spacing} !important;
			  }
			  
			  ${prefix} .calc-container.vertical {
			  	max-width: ${container_vertical_max_width} !important;
			  }
			  
			  ${prefix} .calc-container.horizontal {
			  	max-width: ${container_horizontal_max_width} !important;
			  }
			  
			  ${prefix} .calc-container.two_column {
				max-width: ${container_two_column_max_width} !important;
			  }
			  
			  #ccb-desktop-preview .calc-container.two_column {
				max-width: calc(${container_two_column_max_width} - 176px) !important;
			  }
		
			  ${prefix} .calc-list-inner {
			  	 padding: ${container_padding.join('px ')}px !important;
			  	 margin: ${container_margin.join('px ')}px !important;
			   	 border-radius: ${desktopBorder('container_border', 'radius')} !important;
			   	 border: ${desktopBorder('container_border', 'width')} ${desktopBorder('container_border', 'type')}  ${generate_color(primary_color, '1A')} !important;
			   	 
			   	 -webkit-box-shadow: ${shadowGenerator(container_shadow)};
 				 -moz-box-shadow: ${shadowGenerator(container_shadow)} !important;
				  box-shadow: ${shadowGenerator(container_shadow)} !important;
				  
				   -webkit-backdrop-filter: blur(${container.blur}px);
				  backdrop-filter: blur(${container.blur}px);
				  background-color: ${generate_color(container.color, from_percent( parseInt(container.opacity) ))} !important;
			  }
			  
			  ${prefix} .ccb-datetime div .calc-date-picker-select,
			  ${prefix} .calc-drop-down-with-image-list > ul,
			  ${prefix} .calc-toggle-item .calc-toggle-wrapper label:after,
			  ${prefix} .calc-checkbox-item label::before,
			  ${prefix} .ccb-appearance-field {
			  	 background: ${secondary_color} !important;
			  	 border-color: ${generate_color(primary_color, '1A')} !important;
			  	 color: ${primary_color} !important;
				 font-size: ${fields_btn_font_size} !important;
				 font-weight: ${fields_btn_font_weight} !important;
			  }
			  
			  ${prefix} .calc-item .calc-file-upload .calc-uploaded-files .ccb-uploaded-file-list-info > i:first-child {
				color: ${accent_color} !important;
			  }
			  
			  
			  ${prefix} .calc-buttons .calc-btn-action,
			  ${prefix} .ccb-appearance-field:not(textarea) {
				 min-height: ${field_and_buttons_height} !important;
			  	 height: ${field_and_buttons_height} !important;
			  }
			  
			  ${prefix} .ccb-datetime div .calc-date-picker-select {
				 min-height: ${field_and_buttons_height} !important;
			  }

			  ${prefix} .ccb-datetime div .calc-date-picker-select,
			  ${prefix} .ccb-appearance-field {
			     padding: 12px ${field_side_indents} !important;
				 border-radius: ${desktopBorder('fields_border', 'radius')} !important;
			   	 border: ${desktopBorder('fields_border', 'width')} ${desktopBorder('fields_border', 'type')}  ${generate_color(primary_color, '1A')} !important;
			  }
			  
			  ${prefix} .ccb-appearance-field.calc-drop-down {
				 padding: 12px ${parseInt(field_side_indents) + 10}px 12px ${field_side_indents} !important;
			  }
			  
			  ${prefix} textarea {
			  	height: ${field_side_indents};
			  }
			  
			  ${prefix} .calc-input-wrapper .input-number-counter {
			  	right: ${parseInt(desktopBorder('fields_border', 'radius')) > 11 ? parseInt(desktopBorder('fields_border', 'radius')) > 20 ? '15px' : '10px' : '5px'} !important;
			  	border-radius: ${desktopBorder('fields_border', 'radius')} !important;
			  }
			  
			  
			  ${prefix} .calc-checkbox .calc-checkbox-item label::after {
			    border-left-color: ${secondary_color} !important;
			    border-bottom-color: ${secondary_color} !important;
			  }
			  
			  ${prefix} .calc-radio-wrapper input[type=radio] {
			  	 background: ${secondary_color} !important;
			  	 border-color: ${generate_color(primary_color, '1A')} !important;
			  }
			  
			  .calc-radio-wrapper input[type=radio]:checked:before {
				 background: ${secondary_color} !important;
			  }
			  
			  ${prefix} .ccb-datetime div .calc-date-picker-select i,
			  ${prefix} .calc-drop-down-with-image .ccb-select-arrow,
			  ${prefix} .calc-item .calc-drop-down-box .ccb-select-arrow {
			  	color: ${generate_color(primary_color, 'B3')} !important;
			  }
			  
			  ${prefix} .calc-item textarea:focus,
			  ${prefix} .calc-item .calc-drop-down-with-image-current.calc-dd-selected,
			  ${prefix} .calc-item .ccb-datetime div .calc-date-picker-select.open,
			  ${prefix} .calc-item .calc-input-wrapper .calc-input:focus,
			  ${prefix} .calc-item .calc-drop-down-box .calc-drop-down:focus {
			  	border-color: ${accent_color} !important;
			  }
			  
			  ${prefix} .calc-drop-down-with-image-list-items li span.calc-list-wrapper .calc-list-price,
			  ${prefix} .calc-drop-down-with-image-list-items li span.calc-list-wrapper .calc-list-title {
			  	 color: ${primary_color} !important;
				 font-weight: ${fields_btn_font_weight} !important;
			  }
			  
			  ${prefix} .calc-item .calc-checkbox-item input[type=checkbox]:checked ~ label:before {
				 border-color: ${accent_color} !important;
				 background-color: ${accent_color} !important;
			  }
			  
			  ${prefix} .calc-toggle-wrapper label {
			  	background: ${generate_color(primary_color, '33')} !important;
			  }
			  
			  ${prefix} .calc-toggle-wrapper input:checked + label,
			  ${prefix} .calc-item .calc-radio-wrapper input[type=radio]:checked {
			  	background: ${accent_color} !important;
			  }
			  
			  ${prefix} .calc-item .calc-radio-wrapper input[type=radio]:checked {
			  	border-color: ${accent_color} !important;
			  }
			  
			  ${prefix} .calc-range-slider__progress {
			  	 background: ${primary_color}40 !important;
			  }
			  
			  ${prefix} .calc-range-slider > input:nth-of-type(2) + output,
			  ${prefix} .calc-range-slider > input:nth-of-type(1) + output {
			     color: ${secondary_color} !important;
			  }
			  
			  ${prefix} .calc-checkbox.calc-checkbox-image .calc-checkbox-info .calc-checkbox-label,
			  ${prefix} .calc-radio-wrapper.calc-radio-image .calc-radio-info .calc-radio-label {
				font-size: ${fields_btn_font_size} !important;
				font-weight: ${fields_btn_font_weight} !important;
				color: ${primary_color} !important;
			  }
			  
			  ${prefix} .calc-checkbox.calc-checkbox-image .calc-checkbox-info .calc-checkbox-price,
			  ${prefix} .calc-radio-wrapper.calc-radio-image .calc-radio-info .calc-radio-price {
			  	color: ${primary_color} !important;
				font-size: calc(${total_field_font_size} - 2px) !important;
			    color: ${generate_color(primary_color, '80')} !important;
			  }
			  
			  ${prefix} .calc-range-slider::before,
			  ${prefix} .calc-range-slider::after {
			     opacity: 0 !important;
			  }
			  
			  ${prefix} .calc-range-slider-min-max span {
			  	 color: ${generate_color(primary_color, '80')} !important;
			  }
			  
			  ${prefix} .e-control-wrapper.e-slider-container.e-material-slider .e-slider .e-handle.e-handle-first,
			  ${prefix} .e-slider-tooltip.e-tooltip-wrap.e-popup,
			  ${prefix} .e-control-wrapper.e-slider-container .e-slider .e-handle,
			  ${prefix} .e-control-wrapper.e-slider-container .e-slider .e-range {
			    background: ${accent_color} !important;
			  }
			  
			  ${prefix} .e-slider-tooltip.e-tooltip-wrap.e-popup:after {
			  	border-color: ${accent_color} transparent transparent transparent !important;
			  }
			  
			  ${prefix} .calc-checkbox.calc-checkbox-image .calc-checkbox-image-wrapper,
			  ${prefix} .calc-radio-wrapper.calc-radio-image .calc-radio-image-wrapper {
			  	border-color: ${generate_color(primary_color, '1A')} !important;
			  }
			  
			  ${prefix} .calc-checkbox.calc-checkbox-image .calc-checkbox-image-wrapper.calc-checkbox-image-selected,
			  ${prefix} .calc-radio-wrapper.calc-radio-image .calc-radio-image-wrapper.calc-radio-image-selected {
			  	border-color: ${accent_color} !important;
			  }
			  
			  .e-slider-tooltip.e-tooltip-wrap.e-popup.calc_id_${calcId}:after {
			  	  border-color: ${accent_color} transparent transparent transparent !important;
			  }
			  
			  .e-slider-tooltip.e-tooltip-wrap.e-popup.calc_id_${calcId} {
			    background: ${accent_color} !important;
			  }
			  
			  ${prefix} .calc-list .calc-item-title {
 				 margin-bottom: 20px;
			  }
			  
			  ${prefix} .calc-list .calc-item-title h2 {
			  	font-size: ${header_font_size} !important;
			  	font-weight: ${header_font_weight} !important;
			  	color: ${primary_color} !important;
			  }
			  
			  ${prefix} .calc-item__title {
			  	font-size: ${label_font_size} !important;
			  	font-weight: ${label_font_weight} !important;
			  	color: ${primary_color} !important;
			  	margin-bottom: 4px;
			  }
			  
			  ${prefix} .calc-toggle-container .calc-toggle-item .calc-toggle-label-wrap .calc-toggle-label,
			  ${prefix} .calc-item .calc-radio-wrapper label .calc-radio-label,
			  ${prefix} .calc-item .calc-checkbox-item label .calc-checkbox-title {
				font-size: ${fields_btn_font_size} !important;
				font-weight: ${fields_btn_font_weight} !important;
				color: ${primary_color} !important;
			  }
			  
			  ${prefix} .calc-buttons .calc-btn-action {
				background: ${generate_color(primary_color, '0D')} !important;
				color: ${primary_color} !important;
				font-weight: ${fields_btn_font_weight} !important;
				font-size: calc(${fields_btn_font_size} - 2px) !important;
			  	border-radius: ${desktopBorder('button_border', 'radius')} !important;
			  	border: ${desktopBorder('button_border', 'width')} ${desktopBorder('button_border', 'type')} ${generate_color(primary_color, '0D')} !important;
			  }
			  
			  ${prefix} .calc-buttons .calc-btn-action:hover {
			  	background: ${pSBC(-0.4, generate_color(primary_color, '26'))} !important;
			  }
			  
			  ${prefix} .calc-buttons .calc-btn-action.success {
			  	background: ${accent_color} !important;
				color: ${secondary_color} !important;
			  }
			  
			  ${prefix} .calc-buttons .calc-btn-action.success:hover {
			  	background: ${pSBC(-0.15, accent_color)} !important;
			  }
			  
			  ${prefix} .calc-item .calc-input-wrapper .input-number-counter {
			  	background: ${generate_color(primary_color, '1D')} !important;
			  	color: ${primary_color} !important;
			  	transition: 200ms ease-in-out;
			  }
			  
			  ${prefix} .calc-stripe-wrapper {
 				 border-radius: ${desktopBorder('fields_border', 'radius')} !important;
			   	 border: ${desktopBorder('fields_border', 'width')} ${desktopBorder('fields_border', 'type')}  ${generate_color(primary_color, '1A')} !important;
			  	 padding: calc((${field_and_buttons_height} - 16.8px) / 2) 10px !important;
			  }
			  
			  ${prefix} .calc-container .calc-list .calc-accordion-btn {
			  	 background: ${generate_color(primary_color, '1a')} !important;
			  }
			  
			  ${prefix} .calc-container .calc-list .calc-accordion-btn > i {
			  	 color: ${primary_color} !important;
			  }
			  
			  ${prefix} .calc-item .calc-input-wrapper .input-number-counter:hover {
			  	background: ${generate_color(primary_color, '1A')} !important;
			  }
			  
			  ${prefix} .calc-container .calc-list .calc-subtotal-list .sub-list-item {
			  	color: ${primary_color} !important;
				font-size: ${total_field_font_size} !important;
				font-weight: ${total_field_font_weight} !important;
			  }
			  
			  ${prefix} .calc-container .calc-list .calc-subtotal-list .sub-list-item.total {
				color: ${primary_color} !important;
				font-size: ${total_font_size} !important;
				font-weight: ${total_font_weight} !important;
			  }
			  
			  ${prefix} .calc-container .calc-list .calc-subtotal-list .sub-list-item.total:first-child {
			  	border-top: 1px solid ${generate_color(primary_color, '1A')} !important;
			  }
			  
			  ${prefix} .ccb-datetime div.date .calendar-select {
			  	background: ${secondary_color} !important;
			  }
			  
			  ${prefix} .ccb-datetime div.date .calendar-select .day-list .week .day {
			  	background: ${generate_color(primary_color, '0D')} !important;
			  	color: ${primary_color} !important;
			  }
			  
			  ${prefix} .ccb-datetime div.date .calendar-select .month-slide-control > div {
				background: ${generate_color(primary_color, '0D')} !important;
			  }
			  
			  ${prefix} .ccb-datetime div.date .calendar-select .month-slide-control div i,
			  ${prefix} .ccb-datetime div.date .calendar-select .day-list .week-titles .title {
			  	color: ${primary_color} !important;
			  }
			  
			  ${prefix} .ccb-datetime div.date .calendar-select .day-list .week .day:hover,
			  ${prefix} .ccb-datetime div.date .calendar-select .day-list .week .day.today {
			  	background: ${generate_color(accent_color, '26')} !important;
			  	color: ${accent_color} !important;
			  }
			  
			  ${prefix} .ccb-datetime div.date .calendar-select .day-list .week .day:hover {
			  	border: 2px solid ${accent_color} !important;
			  }
			  
			  ${prefix} .ccb-datetime div.date .calendar-select .day-list .week .day.selected {
			  	background: ${accent_color} !important;
			  	color: ${primary_color} !important;
			  	border: 2px solid ${accent_color} !important;
			  }
			  
			  ${prefix} .ccb-datetime div.date .calendar-select .month-slide-control div.slider-title {
			  	background: ${generate_color(primary_color, '0D')} !important;
			  	color: ${primary_color} !important;
			  }
			  
			  ${prefix} .calc-drop-down-with-image-list-items li {
			    background: ${secondary_color} !important;
			  	border-bottom: 1px solid ${generate_color(primary_color, '1A')} !important;
			  }
			  
			  ${prefix} .calc-drop-down-with-image-list-items li:hover {
			  	background: ${generate_color(primary_color, '1a')} !important;
			  }
			  
			  ${prefix} .calc-drop-down-with-image-list-items li:last-child {
			  	border-bottom: none !important;
			  }
			  
			  ${prefix} .calc-item .calc-file-upload .calc-uploaded-files .file-name {
			  	background: ${generate_color(primary_color, '1A')} !important;
			  	color: ${primary_color} !important;
			  }
			  
			  ${prefix} .calc-item__description span {
			    font-size: ${description_font_size} !important;
			    font-weight: ${description_font_weight} !important;
			    color: ${generate_color(primary_color, '80')} !important;
			  }
			  
			  ${prefix} .calc-item__description.${description_position} {
			  	display: block !important;
			  }
			  
			  ${prefix} .ccb-field.required .calc-required-field .ccb-field-required-tooltip,
			  ${prefix} .ccb-error-tip.front {
				 color: #ffffff !important;
			  	 background: ${error_color} !important;
			  }
			  
			  ${prefix} .ccb-field.required .calc-required-field .ccb-field-required-tooltip-text::after {
			  	border: 7px solid ${error_color} !important;
			  	border-color: transparent ${error_color} transparent transparent !important;
			  }
			  
			  ${prefix} .ccb-error-tip.front::after {
			  	border-top: 10px solid ${error_color} !important;
			  }
			  
			  ${prefix} .ccb-loader {
			    border: 6px solid ${generate_color(secondary_color, '26')} !important;
			  	border-top: 6px solid ${accent_color} !important;
			  }
			  
			  ${prefix} .ccb-loader-1 div {
			   	background: ${accent_color} !important;
			  }
			  
			  ${prefix} .ccb-loader-3 div:after,
			  ${prefix} .ccb-loader-2 div:after {
			    background: ${accent_color} !important;
			  }
			  
			  ${prefix} .ccb-loader-4 circle,
			  ${prefix} .ccb-loader-4 path {
			  	fill: ${accent_color} !important;
			  }
			  
			  ${prefix} .ccb-checkbox-hint {
			  	color: ${primary_color} !important
			  }
			  
			  ${prefix} .calc-item .calc-file-upload .info-tip-block .info-icon {
			  	color: ${primary_color} !important;
			  }
			  
			  ${prefix} .calc-container .calc-list .calc-list-inner .calc-item-title-description {
			  	color: ${generate_color(primary_color, '80')} !important;
				font-size: calc(${fields_btn_font_size} - 2px) !important;
			  }
			  
			  
			  ${prefix} .ccb-field.required .ccb-datetime div .calc-date-picker-select,
			  ${prefix} .ccb-field.required .calc-drop-down-with-image-list > ul,
			  ${prefix} .ccb-field.required .calc-toggle-item .calc-toggle-wrapper label:after,
			  ${prefix} .ccb-field.required .calc-checkbox-item label::before,
			  ${prefix} .ccb-field.required .ccb-appearance-field,
			  ${prefix} .ccb-field.required .ccb-appearance-field:hover,
			  ${prefix} .ccb-field.required .ccb-appearance-field:focus,
			  ${prefix} .ccb-field.required .ccb-appearance-field:active,
			  ${prefix} .ccb-field.required .calc-drop-down-with-image-current,
			  ${prefix} .ccb-field.required input[type=text],
			  ${prefix} .ccb-field.required input[type=number],
			  ${prefix} .ccb-field.required textarea,
			  ${prefix} .ccb-field.required select {
			  	 border-color: ${error_color} !important;
			  }
			  
			  ${prefix} .calc-container .calc-list .calc-item.required .ccb-required-mark,
			  ${prefix} .calc-container .calc-list .calc-item.required .calc-item__title {
			  	 color: ${error_color} !important;
			  }
			  
			  ${prefix} .calc-item .calc-file-upload .calc-uploaded-files .ccb-uploaded-file-list-info .ccb-select-anchor,
			  ${prefix} .calc-item .calc-file-upload .calc-uploaded-files .ccb-uploaded-file-list-info span {
			  	color: ${primary_color} !important;
			  }
			  
			  ${prefix} .calc-container .ccb-cf-wrap .wpcf7-submit {
			  	background-color: ${accent_color} !important;
			  	color: ${secondary_color} !important;
			  }

			  ${prefix} .calc-list-inner .calc-subtotal-list .calc-woo-product {
				border-color: ${accent_color};
				background-color: ${generate_color(accent_color, '0d')};
				color: ${primary_color};
			  }
				
			  ${prefix} .calc-list-inner .calc-subtotal-list .calc-woo-product .calc-woo-product__btn a {
				border-radius: ${desktopBorder('button_border', 'radius')} !important;
				background-color: ${accent_color};
				color: ${secondary_color} !important;
				font-size: calc(${fields_btn_font_size} - 2px) !important;
				font-weight: ${fields_btn_font_weight} !important;
				min-height: ${field_and_buttons_height} !important;
			  }
			  
			  ${prefix} .calc-checkbox.boxed-with-checkbox-and-description .calc-checkbox-item label,
			  ${prefix} .calc-checkbox.boxed-with-description .calc-checkbox-item label,
			  ${prefix} .calc-checkbox.boxed-with-checkbox .calc-checkbox-item label,
			  ${prefix} .calc-checkbox.boxed .calc-checkbox-item label {
				background: ${secondary_color} !important;
				border: 1px solid ${generate_color(primary_color, '33')} !important;
				border-radius: ${desktopBorder('fields_border', 'radius')} !important;
			  }
			  
			  ${prefix} .calc-checkbox.boxed-with-checkbox-and-description .calc-checkbox-item input:checked + label,
			  ${prefix} .calc-checkbox.boxed-with-description .calc-checkbox-item input:checked + label,
			  ${prefix} .calc-checkbox.boxed-with-checkbox .calc-checkbox-item input:checked + label,
			  ${prefix} .calc-checkbox.boxed .calc-checkbox-item input:checked + label {
				 background: ${accent_color} !important;
				 border: 1px solid ${accent_color} !important;
			  }
			  
			  ${prefix} .calc-checkbox.boxed-with-checkbox-and-description .calc-checkbox-item input:checked + label .calc-checkbox-title,
			  ${prefix} .calc-checkbox.boxed-with-description .calc-checkbox-item input:checked + label .calc-checkbox-title,
			  ${prefix} .calc-checkbox.boxed-with-checkbox .calc-checkbox-item input:checked + label .calc-checkbox-title,
			  ${prefix} .calc-checkbox.boxed .calc-checkbox-item input:checked + label .calc-checkbox-title {
			 	 color: ${secondary_color};
			  }
			  
			  ${prefix} .calc-checkbox.boxed-with-checkbox-and-description .calc-checkbox-item input:checked ~ label:before,
			  ${prefix} .calc-checkbox.boxed-with-description .calc-checkbox-item input:checked ~ label:before,
			  ${prefix} .calc-checkbox.boxed-with-checkbox .calc-checkbox-item input:checked ~ label:before,
			  ${prefix} .calc-checkbox.boxed .calc-checkbox-item input:checked ~ label:before {
			 	 border: 1px solid ${accent_color} !important;
      			 background-color: ${accent_color} !important;
			  }
			  
			  ${prefix} .calc-checkbox.boxed-with-checkbox-and-description .calc-checkbox-item input:checked + label,
			  ${prefix} .calc-checkbox.boxed-with-description .calc-checkbox-item input:checked + label,
			  ${prefix} .calc-checkbox.boxed-with-checkbox .calc-checkbox-item input:checked + label {
				background: ${generate_color(accent_color, '1A')} !important;
				border: 1px solid ${accent_color};
			  }
			  
			  ${prefix} .calc-checkbox.boxed-with-checkbox-and-description .calc-checkbox-item input:checked + label .calc-checkbox-title,
			  ${prefix} .calc-checkbox.boxed-with-description .calc-checkbox-item input:checked + label .calc-checkbox-title,
			  ${prefix} .calc-checkbox.boxed-with-checkbox .calc-checkbox-item input:checked + label .calc-checkbox-title {
				color: ${primary_color} !important;
			  }
			  			  
			  ${prefix} .calc-checkbox.boxed-with-checkbox-and-description .calc-checkbox-item .calc-checkbox-description,
			  ${prefix} .calc-checkbox.boxed-with-description .calc-checkbox-item .calc-checkbox-description,
			  ${prefix} .calc-checkbox.boxed-with-checkbox .calc-checkbox-item .calc-checkbox-description {
				color: ${generate_color(primary_color, 'B3')} !important;
				font-size: calc(${total_field_font_size} - 2px) !important;
			  }
			  
			  ${prefix} .calc-radio-wrapper.boxed-with-radio .calc-radio-item label,
			  ${prefix} .calc-radio-wrapper.boxed .calc-radio-item label {
				 background: ${secondary_color} !important;
				 border: 1px solid ${generate_color(primary_color, '33')} !important;
				 border-radius: ${desktopBorder('fields_border', 'radius')} !important;
			  }
			   
			  ${prefix} .calc-radio-wrapper.boxed-with-radio .calc-radio-item input:checked + label,
			  ${prefix} .calc-radio-wrapper.boxed .calc-radio-item input:checked + label {
			      background: ${accent_color} !important;
				  border: 1px solid ${accent_color} !important;
			  }
			  
			  ${prefix} .calc-radio-wrapper.boxed .calc-radio-item input:checked + label {
			      background: ${accent_color} !important;
				  border: 1px solid ${accent_color} !important;
			  }
			  
			  ${prefix} .calc-radio-wrapper.boxed-with-radio .calc-radio-item input:checked + label {
			     background: ${generate_color(accent_color, '1A')} !important;
				 border: 1px solid ${accent_color} !important;
			  }
			  
			  ${prefix} .calc-radio-wrapper.boxed-with-radio .calc-radio-item input:checked + label .calc-radio-label {
			     color: ${primary_color} !important;
			  }
			  
			  ${prefix} .calc-toggle-container.boxed-with-toggle-and-description .calc-toggle-item {
				 background: ${secondary_color} !important;
				 border: 1px solid ${generate_color(primary_color, '33')} !important;
				 border-radius: ${desktopBorder('fields_border', 'radius')} !important;
			  }
			  
			  {prefix} .calc-toggle-container.boxed-with-toggle-and-description .calc-toggle-item.calc-is-checked {
			   	border: 1px solid ${accent_color} !important;
				background: ${generate_color(accent_color, '1A')} !important;
			  }
			  
			  ${prefix} .calc-toggle-container.boxed-with-toggle-and-description .calc-toggle-item .calc-toggle-label-wrap .calc-toggle-description {
				 color: ${generate_color(primary_color, 'B3')} !important;
				 font-size: calc(${total_field_font_size} - 2px) !important;
			  }

			  ${prefix} .calc-checkbox.calc-checkbox-image.with-icon .calc-checkbox-image-wrapper img,
			  ${prefix} .calc-radio-wrapper.calc-radio-image.with-icon .calc-radio-image-wrapper img {
			    ${colorFilter(accent_color)}
			  }
			    
			  ${prefix} .calc-radio-wrapper.calc-radio-image.with-icon .calc-radio-image-wrapper,
			  ${prefix} .calc-checkbox.calc-checkbox-image.with-icon .calc-checkbox-image-wrapper { 
				  background: ${secondary_color} !important;
				  border: 1px solid ${generate_color(primary_color, '33')} !important;
				  border-radius: ${desktopBorder('fields_border', 'radius')} !important;
			  }
			
			  ${prefix} .calc-radio-wrapper.calc-radio-image.with-icon .calc-radio-image-wrapper.calc-radio-image-selected,
			  ${prefix} .calc-checkbox.calc-checkbox-image.with-icon .calc-checkbox-image-wrapper.calc-checkbox-image-selected { 
				  border: 1px solid ${accent_color} !important;
				  background: ${generate_color(accent_color, '1A')} !important;
			  }
		`

		const generateResponsiveStyles = type => `
				${type} ${prefix} .calc-list-inner {
			  	   padding: ${mobileSpacing.container_padding.join('px ')}px !important;
			  	   margin: ${mobileSpacing.container_margin.join('px ')}px !important;
			    }
			    
			    ${type} ${prefix} .calc-buttons .calc-btn-action,
			    ${type} ${prefix} .ccb-appearance-field:not(textarea) {
				   min-height: ${mobileSizes.field_and_buttons_height} !important;
				   height: ${mobileSizes.field_and_buttons_height} !important;
			    }
			    
			    ${type} ${prefix} .ccb-datetime div .calc-date-picker-select {
				   min-height: ${mobileSizes.field_and_buttons_height} !important;
			    }
			    
				${type} ${prefix} .calc-buttons .calc-btn-action,
			    ${type} ${prefix} .ccb-datetime div .calc-date-picker-select,
			    ${type} ${prefix} .ccb-appearance-field {
				   padding: 12px ${mobileSpacing.field_side_indents} !important;
			    }
			    
			    ${type} ${prefix} .calc-buttons .calc-file-upload-actions .calc-btn-action {
			    	padding: 12px 0 !important;
			    }
			    
			    ${type} ${prefix} textarea {
				   height: ${mobileSpacing.field_side_indents};
				}
			  
			    ${type} ${prefix} .calc-container .calc-list .calc-subtotal-list .calc-subtotal-list-accordion,
			    ${type} ${prefix} .calc-container .calc-list .calc-subtotal-list {
				  row-gap: calc(${mobileSpacing.field_spacing} / 2) !important;
			    }
				  
			    ${type} ${prefix} .calc-container .calc-list .calc-fields-container {
				  row-gap: ${mobileSpacing.field_spacing} !important;
			    }
			    
			    ${type} ${prefix} .ccb-datetime div .calc-date-picker-select,
			    ${type} ${prefix} calc-drop-down-with-image-list > ul,
			    ${type} ${prefix} .calc-toggle-item .calc-toggle-wrapper label:after,
			    ${type} ${prefix} .calc-checkbox-item label::before,
			    ${type} ${prefix} .ccb-appearance-field {
				   font-size: ${mobileTypography.fields_btn_font_size} !important;
				   font-weight: ${mobileTypography.fields_btn_font_weight} !important;
			    }
			    
			    ${type} ${prefix} .calc-item__description span {
					font-size: ${mobileTypography.description_font_size} !important;
					font-weight: ${mobileTypography.description_font_weight} !important;
				 }
			  
			  
			    ${type} ${prefix} .calc-toggle-container .calc-toggle-item .calc-toggle-label-wrap .calc-toggle-label,
			    ${type} ${prefix} .calc-item .calc-radio-wrapper label .calc-radio-label,
			    ${type} ${prefix} .calc-item .calc-checkbox-item label .calc-checkbox-title {
				  font-size: ${mobileTypography.fields_btn_font_size} !important;
				  font-weight: ${mobileTypography.fields_btn_font_weight} !important;
			    }
			  
			    ${type} ${prefix} .calc-buttons .calc-btn-action {
				  font-weight: ${mobileTypography.fields_btn_font_weight} !important;
				  font-size: calc(${mobileTypography.fields_btn_font_size} - 2px) !important;
			    }
			  
				${type} ${prefix} .calc-list .calc-item-title h2 {
			      font-size: ${mobileTypography.header_font_size} !important;
				  font-weight: ${mobileTypography.header_font_weight} !important;
				}
				
			    ${type} ${prefix} .calc-item__title {
			  	  font-size: ${mobileTypography.label_font_size} !important;
			  	  font-weight: ${mobileTypography.label_font_weight} !important;
			    }
			    
			    ${type} ${prefix} .calc-container .calc-list .calc-subtotal-list .sub-list-item {
				  font-size: ${mobileTypography.total_field_font_size} !important;
				  font-weight: ${mobileTypography.total_field_font_weight} !important;
			    }
			    
			    ${type} ${prefix} .calc-container .calc-list .calc-subtotal-list .sub-list-item.total {
				  color: ${primary_color} !important;
				  font-size: ${mobileTypography.total_font_size} !important;
				  font-weight: ${mobileTypography.total_font_weight} !important;
			    }
			    
			    ${prefix} .ccb-send-quote__wrapper {
			    	background-color: ${container.color} !important;
			    }
			    
			    ${prefix} .ccb-send-quote__wrapper .ccb-send-quote__title,
			    ${prefix} .ccb-send-quote__wrapper label {
			    	color: ${primary_color} !important;
			    }

			    ${prefix} .ccb-send-quote__wrapper .ccb-send-quote__submit button,
			    ${prefix} .ccb-send-quote__success .ccb-send-quote__success-btn {
			    	background: ${accent_color} !important;
					color: ${secondary_color} !important;
					border-radius: ${desktopBorder('fields_border', 'radius')} !important;
			    }
			    
			    ${prefix} .ccb-send-quote__success .ccb-send-quote__success-icon {
			    	color: ${accent_color} !important;
			    	background: ${generate_color(accent_color, '1A')} !important;
			    }
			    
			    ${prefix} .ccb-send-quote__success .ccb-send-quote__success-text {
			    	color: ${primary_color} !important;
			    }
			    
			    ${prefix} .ccb-send-quote__wrapper .ccb-send-quote__file {
			    	border-radius: ${desktopBorder('fields_border', 'radius')} !important;
			    }

			    ${prefix} .ccb-send-quote__wrapper .ccb-send-quote__input input,
			    ${prefix} .ccb-send-quote__wrapper .ccb-send-quote__textarea textarea {
			    	border-radius: ${desktopBorder('fields_border', 'radius')} !important;
			    	border: ${desktopBorder('fields_border', 'width')} ${desktopBorder('fields_border', 'type')}  ${generate_color(primary_color, '1A')} !important;
			    	background: ${secondary_color} !important;
			    	color: ${primary_color} !important;
			    }
			   
		`

		responsive.forEach(type => {
			if (type === 'mobile') {
				styles += `
				 	@media only screen and (max-width: 480px) {
			    		${generateResponsiveStyles('')}
			 		}
				`;
			} else {
				styles += generateResponsiveStyles(type)
			}
		})
	}

	setTimeout(() => {
		const selector = $('#calc_appearance_' + calcId)
		if (selector.length)
			$(selector).remove();
		$('head').append(`<style id="calc_appearance_${calcId}">${styles}</style>`);
	}, 0)
}

export default Customize
