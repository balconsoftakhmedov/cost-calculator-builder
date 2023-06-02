import DateFormatter from "php-date-formatter";

const Condition = {}
const $ = require('jquery')

Condition.triggerCondition = function () {
	this.calc_data.fields.forEach(field => {
		if ( typeof field._event !== "undefined" )
			this.renderCondition(field.alias)
	})
}

Condition.renderCondition = function ( alias ) {
	const vm = this;

	/** get element connected fields by alias **/
	const links = vm.sortChanged(alias);
	if (links.length <= 0 ) {
		return;
	}

	const calcId = this.$store.getters.getSettings.calc_id || this.id
	setTimeout(() => {
		this.$calc = $(`*[data-calc-id="${calcId}"]`);

		links.forEach((element, eIndex) => {
			const optionsTo   = this.getFieldByAlias(element.options_to)
			const optionsFrom = this.getFieldByAlias(element.options_from)
			if (element && typeof element.condition !== "undefined" && typeof optionsFrom !== "undefined") {
				element.condition.forEach((condition, index) => {
					const fromElement = Object.values(vm.calcStore).find(e => e && e.alias === optionsFrom.alias);
					const key         = 'element_' + eIndex + index;

					const fieldName = optionsFrom.alias.replace(/\_field_id.*/,'');
					if ( fieldName === 'total' ) {
						const totalField = this.formulaConst.find(f => f.alias === alias)
						fromElement.value = totalField ? totalField.data.total : 0
					}

					vm.valuesStore[key] = typeof vm.valuesStore[key] !== "undefined" ? vm.valuesStore[key] : {};

					/** append value by key (option key) for condition, from field from options ( for select type )**/
					condition.conditions.forEach( ( conditionItem ) => {
						;(optionsFrom.options || []).forEach( (e, i) => {
							if (i === +conditionItem.key) {
								conditionItem.originalValue = conditionItem.originalValue ? conditionItem.originalValue : +conditionItem.value
								if ( ['!=', '=='].includes(conditionItem.condition) ) {
									conditionItem.value = +e.optionValue
								}
							}
						});
					});

					if ( typeof fromElement !== "undefined" ) {
						vm.valuesStore[key][fromElement.alias] = JSON.parse(JSON.stringify(fromElement.value));
						vm.conditionInit( optionsTo, condition, fromElement );
					}
				})
			}
		});

		setTimeout(() => {
			this.apply(false);
		}, 0);
	});
}

/**
 * Init condition
 * @param {object} condition (action, condition, hide, index, key, optionFrom, optionTo, type, value, setVal etc)
 */
Condition.conditionInit = function ( optionsTo, condition, fromElement ) {
	const vm = this;
	const conditionResult = vm.conditionResult( fromElement, condition );
	if (typeof vm[condition.action] === "function") {
		vm[condition.action](optionsTo, conditionResult, condition);
	}
}

Condition.getElementObject = function ( optionsTo ) {
	let elementRightWrap = this.$calc.find(`[data-id='${optionsTo?.alias}']`);

	if ( optionsTo.alias.replace(/\_field_id.*/,'') === 'total' ){
		elementRightWrap = this.$calc.find(`#${optionsTo.alias}`);
	}
	/** if is not calculable **/
	if ( ( !optionsTo.hasOwnProperty('alias') && elementRightWrap.length === 0 ) ) {
		elementRightWrap = this.$calc.find(`[data-id="${'id_for_label_' + optionsTo._id}"]`);
	}

	return elementRightWrap;
}

/** check is condition true **/
Condition.conditionResult = function (fromElement, condition) {
	let result = false;

	let fieldNameFrom = condition.optionFrom.replace(/\_field_id.*/, '');
	let fieldNameTo = condition.optionTo.replace(/\_field_id.*/, '');
	if ( condition.hasOwnProperty('conditions') === false || condition.conditions.length <= 0 ) {
		return false;
	}

	let conditionStr = '';

	/**
	 * FILE UPLOAD CHECK
	 * IF NO UPLOADED FILES
	 * RESULT ALWAYS FALSE
	 */
	if ( fieldNameTo === 'file_upload' ) {
		const fileUploadData = Object.values(this.calcStore).find(e => e && e.alias === condition.optionTo);
		if ( condition.action === 'set_value' && (! this.isObjectHasPath(fileUploadData, [ 'options', 'value' ])


			// if ( !this.isObjectHasPath(fileUploadData, ['options', 'value'])
			||
			(this.isObjectHasPath(fileUploadData, [ 'options', 'value' ]) && fileUploadData.options.value.length <= 0)) ) {
			// ( this.isObjectHasPath(fileUploadData, ['options', 'value']) && fileUploadData.options.value.length <=0 ) ) {
			return false;
		}
	}

	condition.conditions.forEach((conditionItem, conditionIndex) => {
		if ( conditionIndex > 0 ) {
			conditionStr += ' ' + condition.conditions[conditionIndex - 1].logicalOperator + ' ';
		}

		/** if not set condition value or condition **/
		if ( conditionItem.condition.length === 0 || conditionItem.value.length === 0 ) {
			return;
		}

		if ( fieldNameFrom === 'total' ) {
			let formulaItem = this.formulaConst.find(f => f.alias === fromElement.alias)
			if (!formulaItem) {
				formulaItem = {data: {total: 0}}
			}

			conditionStr += eval(formulaItem.data.total + conditionItem.condition + (+conditionItem.value) + '');
		} else if ( [ 'toggle', 'checkbox', 'checkbox_with_img' ].includes(fieldNameFrom) && '==' === conditionItem.condition ) {
			/** for checkbox and toggle
			 * is selected and is different than condition compare with choosen value
			 * is inferior to and is superior to compare with total sum of choosen options
			 * **/
			result = fromElement.options.some(function (option) {
				const valueKey = option.temp.split('_');
				return (+valueKey[0] === +conditionItem.value && +valueKey[1] === +conditionItem.key)
			});

			if ( ['!=', '=='].includes(conditionItem.condition) ) {
				conditionStr += '!=' === conditionItem.condition ? ! result : result;
			} else if ( ['>=', '<='].includes(conditionItem.condition) ) {
				result = +fromElement.value >= +conditionItem.originalValue
				conditionStr += '>=' === conditionItem.condition ? result : !result;
			}

		} else if ( [ 'toggle', 'checkbox', 'checkbox_with_img' ].includes(fieldNameFrom) && Object.keys(fromElement.options).length === 0 && ['!=', '=='].includes(conditionItem.condition) ) {
			/** if no options selected, rm all conditions **/
			conditionStr += false;
		} else if ( [ 'radio', 'radio_with_img', 'dropDown', 'dropDown_with_img' ].includes(fieldNameFrom) ) {
			let conditionListForCurrentField = this.conditions.links.filter(c => (c.options_from === condition.optionFrom && c.options_to == condition.optionTo))[0];
			conditionListForCurrentField = conditionListForCurrentField.condition.filter(c => (c.setVal == condition.setVal && c.action == condition.action));

			if ( ['!=', '=='].includes(conditionItem.condition) ) {
				if ( conditionListForCurrentField.length > 1 ) {
					result = conditionListForCurrentField.some(c => eval(fromElement.summary_value + c.condition + (+c.value) + ''));
					conditionStr += result;
				} else {
					result = fromElement.options.some((option) => {
						const valueKey = option.temp.split('_');
						return (+valueKey[0] === +conditionItem.value && +valueKey[1] === +conditionItem.key)
					});

					conditionStr += '!=' === conditionItem.condition && fromElement.checked ? ! result : result;
				}
			} else {
				if ( conditionListForCurrentField.length > 1 ) {
					result = conditionListForCurrentField.some(c => eval(fromElement.summary_value + c.condition + (+c.value) + ''));
					conditionStr += result;
				} else {
					result = fromElement.options.some((option) => {
						const valueKey = option.temp.split('_');
						return (+valueKey[0] >= +conditionItem.originalValue)
					});

					conditionStr += '>=' === conditionItem.condition ? result : ! result;
				}
			}
		} else {
			/** for all other elements **/
			conditionStr += eval(fromElement.value + conditionItem.condition + (+conditionItem.value) + '');
		}
	});

	return eval(conditionStr);
}

Condition.get_default_value = function (optionsTo) {
	const fieldName = optionsTo.alias.replace(/\_field_id.*/,'');
	const fieldToData = this.calc_data.fields.filter(field => ( field.alias === optionsTo.alias ))[0];

	if ( fieldName === 'multi_range' ) {
		const maxValue = (+fieldToData.maxValue) > (+fieldToData.default_right) ? (+fieldToData.default_right) : (+fieldToData.maxValue);
		const minValue = (+fieldToData.minValue) < (+fieldToData.default_left) ? (+fieldToData.default_left) : (+fieldToData.minValue);

		return {
			value: maxValue - minValue,
			start: minValue,
			end: maxValue,
		}
	}

	if ( fieldName === 'range' ) {
		return (+fieldToData.minValue) > (+fieldToData.default) ? (+fieldToData.minValue) : (+fieldToData.default || 0);
	}

	/** if not set default value **/
	if ( (fieldName !== 'multi_range' && (! fieldToData.hasOwnProperty('default') || fieldToData.default.length === 0))
		|| (fieldName === 'multi_range' && ! fieldToData.hasOwnProperty('default_right')
			&& ! fieldToData.hasOwnProperty('default_left')) ) {
		return 0;
	}

	return fieldToData.default;
}

Condition.show = function ( optionsTo, conditionResult, condition ) {
	const vm = this;
	let elementRightWrap = this.getElementObject(optionsTo);

	/** for fields with not setted 'default hidden' option **/
	if ( this.fields[optionsTo.alias].hidden === null ) { return; }

	/** get exist conditions with same action to same field **/
	let appliedConditions  = this.$store.getters.activeConditions.filter(c => ( c.optionTo === condition.optionTo && c.action === condition.action ));

	/** if condition result is true show element **/
	if ( conditionResult ) {
		/** add condition to active condition list **/
		this.$store.commit('addActiveCondition', condition);

		let val = 0
		if ( this.fields[optionsTo.alias].value ) {
			val = JSON.parse(JSON.stringify(this.fields[optionsTo.alias].value))
		}
		const defaultValue = vm.get_default_value(optionsTo);
		Object.values(vm.calcStore).forEach( ( calc ) => {
			if ( calc.alias === optionsTo.alias  ) {
				this.$store.commit('removeFromConditionBlocked', calc);
				this.fields[calc.alias].hidden = false;
				this.fields[calc.alias].value = val || defaultValue || 0;

				/** if current field is <dropDownWithImg> update 'key' for re-rendering component with new 'value' **/
				if (this.fields[calc.alias]?.hasNextTick) {
					this.fields[calc.alias].nextTickCount++;
				}

				elementRightWrap.fadeIn();
				this.$calc.find('.' + optionsTo.alias).fadeIn();
			}
		});
	}

	/** if condition result is true show element **/
	if ( !conditionResult && elementRightWrap.is(':visible')
		&& appliedConditions.filter( c => ( c.optionFrom == condition.optionFrom && c.value == condition.value )).length > 0 ) {

		/** remove condition from active condition list **/
		this.$store.commit('removeActiveCondition', condition);

		appliedConditions = this.$store.getters.activeConditions.filter(c => ( c.optionTo === condition.optionTo && c.action === condition.action ));

		/** if have other conditions enabled not show **/
		if ( appliedConditions.length > 0 ){
			return;
		}

		Object.values(vm.calcStore).forEach( calc => {
			if ( calc.alias === optionsTo.alias ) {
				this.$store.commit('addConditionBlocked', calc);
				elementRightWrap.fadeOut();
				this.$calc.find('.' + optionsTo.alias).fadeOut();

				this.fields[calc.alias].value  = 0;
				this.fields[calc.alias].hidden = true;
			}
		});
	}
}

Condition.hide = function ( optionsTo, conditionResult, condition ) {
	const vm = this;
	let elementRightWrap = this.getElementObject(optionsTo);

	/** get exist conditions with same action to same field **/
	let appliedConditions  = this.$store.getters.activeConditions.filter(c => ( c.optionTo === condition.optionTo && c.action === condition.action ));

	/** if condition result is true hide element **/
	if ( conditionResult ) {
		/** add condition to active condition list **/
		this.$store.commit('addActiveCondition', condition);

		Object.values(vm.calcStore).forEach( calc => {
			if ( calc.alias === optionsTo.alias ) {
				this.$store.commit('addConditionBlocked', calc);
				elementRightWrap.fadeOut();

				this.$calc.find('.' + optionsTo.alias).fadeOut();
				this.fields[calc.alias].value = 0;
			}
		});
	}

	/** if condition result is false show element **/
	if ( !conditionResult && appliedConditions.filter( c => ( c.optionFrom == condition.optionFrom && c.sort == condition.sort)).length > 0 ) {

		/** remove condition from active condition list **/
		this.$store.commit('removeActiveCondition', condition);

		appliedConditions = this.$store.getters.activeConditions.filter(c => ( c.optionTo === condition.optionTo && c.action === condition.action ));
		/** if have other conditions enabled not show **/
		if ( appliedConditions.length > 0 ){
			return;
		}

		elementRightWrap.fadeIn();
		this.$calc.find('.' + optionsTo.alias).fadeIn();

		Object.values(vm.calcStore).forEach( calc => {
			if ( calc.alias === optionsTo.alias ) {
				this.$store.commit('removeFromConditionBlocked', calc);
				this.$calc.find('.' + optionsTo.alias).fadeIn();
				this.fields[calc.alias].value = 0;

				/** if current field is <dropDownWithImg> update 'key' for re-rendering component with new 'value' **/
				if (this.fields[calc.alias]?.hasNextTick) {
					this.fields[calc.alias].nextTickCount++;
				}
			}
		});
	}
}

Condition.hide_leave_in_total = function ( optionsTo, conditionResult, condition ) {
	const vm = this;
	let elementRightWrap = this.getElementObject(optionsTo);

	/** get exist conditions with same action to same field **/
	let appliedConditions  = this.$store.getters.activeConditions.filter(c => ( c.optionTo === condition.optionTo && c.action === condition.action ));

	/** if condition result is false show element **/
	if ( !conditionResult && appliedConditions.filter( c => ( c.optionFrom == condition.optionFrom && c.sort == condition.sort)).length > 0 ) {

		/** remove condition from active condition list **/
		this.$store.commit('removeActiveCondition', condition);

		appliedConditions = this.$store.getters.activeConditions.filter(c => ( c.optionTo === condition.optionTo && c.action === condition.action ));
		/** if have other conditions enabled not show **/
		if ( appliedConditions.length > 0 ){
			return;
		}

		elementRightWrap.fadeIn();
		/** Only for Total Description */
		if ( optionsTo._tag === 'cost-total' ) {
			this.$calc.find('#' + optionsTo.alias).fadeIn();
		}
	}

	/** if condition result is true hide element from form **/
	if ( conditionResult ) {
		/** add condition to active condition list **/
		this.$store.commit('addActiveCondition', condition);

		elementRightWrap.fadeOut();
		this.$calc.find('.' + optionsTo.alias).fadeIn();

		/** Only for Total Description */
		if ( optionsTo._tag === 'cost-total' ) {
			this.$calc.find('#' + optionsTo.alias).fadeOut();
		}
		Object.values(vm.calcStore).forEach( calc => {
			if ( calc.alias === optionsTo.alias && typeof this.tempVal[calc.alias] !== "undefined") {
				this.fields[calc.alias].value = JSON.parse(JSON.stringify(this.tempVal[calc.alias]));
			}
		});
	}
}

Condition.disable = function ( optionsTo, conditionResult, condition ) {

	let elementRightWrap = this.getElementObject(optionsTo);
	let fieldName        = optionsTo.alias.replace(/\_field_id.*/,'');

	/** get exist conditions with same action to same field **/
	let appliedConditions  = this.$store.getters.activeConditions.filter(c => ( c.optionTo === condition.optionTo && c.action === condition.action ));

	/** if condition result is true disable element **/
	if ( conditionResult ) {
		/** add condition to active condition list **/
		this.$store.commit('addActiveCondition', condition);

		if ( fieldName === 'datePicker' ) {
			elementRightWrap.find('.' + optionsTo.alias).each((i, element) => {
				element.classList.add("calc-field-disabled-condition");
			});
			return;
		} else {
			elementRightWrap.find('.calc_' + optionsTo.alias).each((i, element) => {
				element.classList.add("calc-field-disabled-condition");

				if( element.getElementsByTagName('input').length ) {
					element.getElementsByTagName('input')[0].disabled = true;
				}

				if( element.getElementsByTagName('select').length ) {
					element.getElementsByTagName('select')[0].disabled = true;
				}
			});
		}
	}

	/** if condition result is false enable element **/
	if ( !conditionResult && appliedConditions.filter( c => ( c.optionFrom == condition.optionFrom && c.sort == condition.sort)).length > 0 ) {

		/** remove condition from active condition list **/
		this.$store.commit('removeActiveCondition', condition);

		appliedConditions = this.$store.getters.activeConditions.filter(c => ( c.optionTo === condition.optionTo && c.action === condition.action ));
		/** if have other conditions enabled not show **/
		if ( appliedConditions.length > 0 ){
			return;
		}

		if ( fieldName === 'datePicker' ) {
			elementRightWrap.find('.' + optionsTo.alias).each((i, element) => {
				element.classList.remove("calc-field-disabled-condition");
			});
		} else {
			elementRightWrap.find('.calc_' + optionsTo.alias).each((i, element) => {
				element.classList.remove("calc-field-disabled-condition");

				if( element.getElementsByTagName('input').length ) {
					element.getElementsByTagName('input')[0].disabled = false;
				}

				if( element.getElementsByTagName('select').length ) {
					element.getElementsByTagName('select')[0].disabled = false;
				}

			});
		}
	}
}

Condition.unset = function ( optionsTo, conditionResult, condition ) {
	const vm = this;
	/** if condition result is true unset element value **/
	if ( conditionResult ) {
		Object.values(vm.calcStore).forEach( calc => {
			if ( calc.alias === optionsTo.alias) {
				this.fields[calc.alias].value = 0;

				/** if current field is <dropDownWithImg> update 'key' for re-rendering component with new 'value' **/
				if (this.fields[calc.alias]?.hasNextTick) {
					this.fields[calc.alias].nextTickCount++;
				}
			}
		});
	}
}

Condition.set_value = function ( optionsTo, conditionResult, condition ) {
	const vm = this;
	/** if condition result is true set element value **/
	if ( conditionResult ) {
		/** add condition to active condition list **/
		this.$store.commit('addActiveCondition', condition);

		Object.values(vm.calcStore).forEach( calc => {
			if (calc.alias === optionsTo.alias) {
				this.fields[calc.alias].value = parseFloat(condition.setVal);
			}
		});
		return;
	}

	/**
	 * just for FILE UPLOAD
	 * if condition result is false and field is file upload,
	 * return file upload price as value
	 **/
	const fieldName = optionsTo.alias.replace(/\_field_id.*/,'');

	if ( !conditionResult && fieldName === 'file_upload' ) {
		/** remove condition from active condition list **/
		this.$store.commit('removeActiveCondition', condition);

		/** get exist conditions with same action to same field **/
		let appliedConditions  = this.$store.getters.activeConditions.filter(c => ( c.optionTo === condition.optionTo && ( c.action === condition.action) ));

		if ( appliedConditions.length === 0 ) {
			const fieldToData = this.calc_data.fields.filter(field => ( field.alias === optionsTo.alias ))[0];
			Object.values(vm.calcStore).forEach( calc => {
				if (calc.alias === optionsTo.alias
					&& this.isObjectHasPath(calc, ['options', 'value']) && calc.options.value.length > 0 ) {
					this.fields[calc.alias].value = isNaN(parseFloat(fieldToData.price)) ? 0: parseFloat(fieldToData.price);
				}
			});
		}
	}
}

Condition.set_value_and_disable = function ( optionsTo, conditionResult, condition ) {
	const vm = this;
	/** set data **/
	vm.set_value( optionsTo, conditionResult, condition );

	let elementRightWrap = this.getElementObject(optionsTo);

	/** get exist conditions with same action to same field **/
	let appliedConditions  = this.$store.getters.activeConditions.filter(c => ( c.optionTo === condition.optionTo && ( c.action === condition.action || c.action === 'disable') ));

	/** if condition result is true set element value and disable **/
	if ( conditionResult ) {
		/** add condition to active condition list **/
		this.$store.commit('addActiveCondition', condition);

		elementRightWrap.find('.calc_' + optionsTo.alias).each((i, element) => {
			element.classList.add("calc-field-disabled-condition");

			if( element.getElementsByTagName('input').length ) {
				element.getElementsByTagName('input')[0].disabled = true;
			}

			if( element.getElementsByTagName('select').length ) {
				element.getElementsByTagName('select')[0].disabled = true;
			}
		});
	}

	/** if condition result is false, enable field  **/
	if ( !conditionResult && appliedConditions.filter( c => ( c.optionFrom == condition.optionFrom && c.sort == condition.sort)).length > 0 ) {

		/** remove condition from active condition list **/
		this.$store.commit('removeActiveCondition', condition);

		appliedConditions = this.$store.getters.activeConditions.filter(c =>
			( c.optionTo === condition.optionTo && ( c.action === condition.action || c.action === 'disable' )));
		/** if have other conditions enabled not show **/
		if ( appliedConditions.length > 0 ) {
			return;
		}

		elementRightWrap.find('.calc_' + optionsTo.alias).each((i, element) => {
			element.classList.remove("calc-field-disabled-condition");
			if( element.getElementsByTagName('input').length ) {
				element.getElementsByTagName('input')[0].disabled = false;
			}

			if( element.getElementsByTagName('select').length ) {
				element.getElementsByTagName('select')[0].disabled = false;
			}
		});
	}
}

Condition.select_option = function ( optionsTo, conditionResult, condition ) {
	const vm = this;
	let fieldNameTo = optionsTo.alias.replace(/\_field_id.*/,'');

	/** if condition result is true set element value **/
	if ( conditionResult ) {
		let newValue = '';

		/** create value for checkbox and toggle **/
		if ( ['checkbox', 'toggle', 'checkbox_with_img'].includes( fieldNameTo )) {
			const arrayValues = condition.setVal.length > 0 ? condition.setVal.split(',').map(Number) : [];
			const fieldToData = vm.calc_data.fields.filter(function(item) { return item.alias === optionsTo.alias })[0];
			newValue = [];

			arrayValues.forEach( optionIndex => {
				newValue.push({
					'label': fieldToData.options[optionIndex].optionText,
					'temp': [fieldToData.options[optionIndex].optionValue, optionIndex].join('_'),
					'value': fieldToData.options[optionIndex].optionValue
				});
			});

		} else {
			/** value for dropDown and radio **/
			if ( this.isObjectHasPath(optionsTo.options, [condition.setVal, 'optionValue'] ) ) {
				newValue = optionsTo.options[condition.setVal].optionValue + '_' + condition.setVal;
			}
		}

		Object.values(vm.calcStore).forEach( calc => {
			if (calc.alias === optionsTo.alias) {
				const current = this.fields[calc.alias];
				current.value = newValue;

				/** if current field is <dropDownWithImg> update 'key' for re-rendering component with new 'value' **/
				if ( current.hasNextTick ) {
					current.nextTickCount++;
				}
			}
		});
	}
}

Condition.select_option_and_disable = function ( optionsTo, conditionResult, condition ) {
	const vm = this;
	/** set data **/
	vm.select_option( optionsTo, conditionResult, condition );

	let elementRightWrap = this.getElementObject(optionsTo);

	/** get exist conditions with same action to same field **/
	let appliedConditions  = this.$store.getters.activeConditions.filter(c => ( c.optionTo === condition.optionTo && ( c.action === condition.action || c.action === 'disable' ) ));

	/** if condition result is true set element value **/
	if ( conditionResult ) {
		/** add condition to active condition list **/
		this.$store.commit('addActiveCondition', condition);

		/** disable field **/
		elementRightWrap.find('.calc_' + optionsTo.alias).each((i, element) => {
			element.classList.add("calc-field-disabled-condition");
			if( element.getElementsByTagName('input').length ) {
				element.getElementsByTagName('input')[0].disabled = true;
			}

			if( element.getElementsByTagName('select').length ) {
				element.getElementsByTagName('select')[0].disabled = true;
			}

			/** if current field is <dropDownWithImg> update 'disabled' option for re-rendering component with new option value **/
			if ( optionsTo.hasNextTick ) {
				this.fields[optionsTo.alias].disabled = true;
			}
		});
	}

	/** if condition result is false, enable field  **/

	if ( !conditionResult && appliedConditions.filter( c => ( c.optionFrom == condition.optionFrom && c.sort == condition.sort)).length > 0 ) {

		/** remove condition from active condition list **/
		this.$store.commit('removeActiveCondition', condition);

		appliedConditions = this.$store.getters.activeConditions.filter(c => ( c.optionTo === condition.optionTo && ( c.action === condition.action || c.action === 'disable' ) ));

		/** if have other conditions enabled not show **/
		if ( appliedConditions.length > 0 ){
			return;
		}

		elementRightWrap.find('.calc_' + optionsTo.alias).each((i, element) => {
			element.classList.remove("calc-field-disabled-condition");
			if( element.getElementsByTagName('input').length ) {
				element.getElementsByTagName('input')[0].disabled = false;
			}

			if( element.getElementsByTagName('select').length ) {
				element.getElementsByTagName('select')[0].disabled = false;
			}

			/** if current field is <dropDownWithImg> update 'disabled' option for re-rendering component with new option value **/
			if ( optionsTo.hasNextTick ) {
				this.fields[optionsTo.alias].disabled = false;
			}
		});
	}
}

Condition.set_date = function ( optionsTo, conditionResult, condition ) {
	const vm = this;

	const dateFormat    = this.$store.getters.getDateFormat; // wp date format
	const dateFormatter = new DateFormatter();
	const dateObj       = this.moment(condition.setVal, "DD/MM/YYYY");
	const viewValue     = dateFormatter.formatDate(dateObj.toDate(), dateFormat);

	/** if condition result is true **/
	if ( conditionResult ) {
		Object.values(vm.calcStore).forEach( calc => {
			if (calc.alias === optionsTo.alias) {
				this.fields[calc.alias].value     = 1; // always one ( 1 day )
				this.fields[calc.alias].viewValue = viewValue;
			}
		});
	}
}

Condition.set_date_and_disable = function ( optionsTo, conditionResult, condition ) {
	const vm = this;
	/** set data **/
	vm.set_date( optionsTo, conditionResult, condition );

	let elementRightWrap = this.getElementObject(optionsTo);

	/** get exist conditions with same action to same field **/
	let appliedConditions  = this.$store.getters.activeConditions.filter(c => ( c.optionTo === condition.optionTo && ( c.action === condition.action || c.action === 'disable' )));

	/** if condition result is true **/
	if ( conditionResult ) {
		/** add condition to active condition list **/
		this.$store.commit('addActiveCondition', condition);

		/** disable field **/
		elementRightWrap.find('.' + optionsTo.alias).each((i, element) => {
			element.classList.add("calc-field-disabled-condition");
		});
	}

	/** if condition result is false show element **/
	if ( !conditionResult && appliedConditions.filter( c => ( c.optionFrom == condition.optionFrom && c.sort == condition.sort)).length > 0 ) {

		/** remove condition from active condition list **/
		this.$store.commit('removeActiveCondition', condition);

		appliedConditions = this.$store.getters.activeConditions.filter(c =>
			( c.optionTo === condition.optionTo && ( c.action === condition.action || c.action === 'disable' ) ));
		/** if have other conditions enabled not show **/
		if ( appliedConditions.length > 0 ){
			return;
		}

		elementRightWrap.find('.' + optionsTo.alias).each((i, element) => {
			element.classList.remove("calc-field-disabled-condition");
		});
	}
}

Condition.set_period = function ( optionsTo, conditionResult, condition ) {
	const vm = this;

	let value;
	let fieldName  = optionsTo.alias.replace(/\_field_id.*/,'');
	let viewValue  = '';
	let rangeValue = condition.setVal.length > 0 ? JSON.parse(condition.setVal): {'start': '', 'end': ''};

	if ( fieldName === 'datePicker' ) {
		const dataFormat    = this.$store.getters.getDateFormat; // wp date format
		const dateFormatter = new DateFormatter();

		const endDateObject   = this.moment(rangeValue['end'], 'DD/MM/YYYY');
		const startDateObject = this.moment(rangeValue['start'], 'DD/MM/YYYY');

		viewValue  = dateFormatter.formatDate(startDateObject.toDate(), dataFormat) + ' - ';
		viewValue += ( endDateObject != null ) ? dateFormatter.formatDate(endDateObject.toDate(), dataFormat) : '';

		const days = endDateObject.endOf('date').diff( startDateObject, 'days', true );
		value = Math.round(days);
	}

	if( fieldName === 'multi_range') {
		value = {
			value: (parseInt(rangeValue['end']) - parseInt(rangeValue['start'])),
			start: parseInt(rangeValue['start']),
			end: parseInt(rangeValue['end']),
		};
	}

	/** if condition result is true **/
	if ( conditionResult ) {
		Object.values(vm.calcStore).forEach( calc => {
			if (calc.alias === optionsTo.alias) {
				this.fields[calc.alias].value     = value;
				this.fields[calc.alias].viewValue = viewValue;
			}
		});
	}
}

Condition.set_period_and_disable = function ( optionsTo, conditionResult, condition ) {
	const vm = this;

	/** set data **/
	vm.set_period( optionsTo, conditionResult, condition );

	/** appearance part **/
	let elementRightWrap = this.getElementObject(optionsTo);
	let fieldName        = optionsTo.alias.replace(/\_field_id.*/,'');

	/** get exist conditions with same action to same field **/
	let appliedConditions  = this.$store.getters.activeConditions.filter(c => ( c.optionTo === condition.optionTo && ( c.action === condition.action || c.action === 'disable' ) ));

	/** if condition result is true **/
	if ( conditionResult ) {
		/** add condition to active condition list **/
		this.$store.commit('addActiveCondition', condition);

		/** disable field **/
		if ( fieldName === 'datePicker' ) {
			elementRightWrap.find('.' + optionsTo.alias).each((i, element) => {
				element.classList.add("calc-field-disabled-condition");
			});
		} else {
			/** for all other fields **/
			elementRightWrap.find('.calc_' + optionsTo.alias).each((i, element) => {
				element.classList.add("calc-field-disabled-condition");

				if( element.getElementsByTagName('input').length ) {
					element.getElementsByTagName('input')[0].disabled = true;
				}
				if( element.getElementsByTagName('select').length ) {
					element.getElementsByTagName('select')[0].disabled = true;
				}
			});
		}
		return;
	}

	/** if condition result is false show element **/
	if ( !conditionResult && appliedConditions.filter( c => ( c.optionFrom == condition.optionFrom && c.sort == condition.sort)).length > 0 ) {

		/** remove condition from active condition list **/
		this.$store.commit('removeActiveCondition', condition);

		appliedConditions = this.$store.getters.activeConditions.filter(c =>
			( c.optionTo === condition.optionTo && ( c.action === condition.action || c.action === 'disable' ) ));
		/** if have other conditions enabled not show **/
		if ( appliedConditions.length > 0 ){
			return;
		}

		if ( fieldName === 'datePicker' ) {
			elementRightWrap.find('.' + optionsTo.alias).each((i, element) => {
				element.classList.remove("calc-field-disabled-condition");
			});
		} else {
			elementRightWrap.find('.calc_' + optionsTo.alias).each((i, element) => {
				element.classList.remove("calc-field-disabled-condition");
				if( element.getElementsByTagName('input').length ) {
					element.getElementsByTagName('input')[0].disabled = false;
				}

				if( element.getElementsByTagName('select').length ) {
					element.getElementsByTagName('select')[0].disabled = false;
				}
			});
		}
	}
}

Condition.sortChanged = function(alias) {
	const  links = (this.conditions && this.conditions.links) || [];
	/**
	 * if FILE UPLOAD
	 * get also by option to
	 */
	if (alias && alias.replace(/\_field_id.*/, '') === 'file_upload') {
		return links.filter(condition => condition.options_from === alias || condition.options_to === alias);
	} else {
		return links.filter(condition => condition.options_from === alias);
	}

}

export default Condition