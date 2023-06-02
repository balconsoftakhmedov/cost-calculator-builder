export default {
	computed: {
		settingsField: {
			get() {
				return this.$store.getters.getSettings;
			},

			set(value) {
				this.$store.commit('updateSettings', value);
			}
		},

		generalSettings() {
			return this.$store.getters.getGeneralSettings;
		},

		getFormulaFields() {
			const fields = this.$store.getters.getBuilder.filter(f => f._tag === 'cost-total');
			if ( fields && fields.length > 0 ) {
				return fields.map((f, idx) => ({idx, title: f.label}));
			} else {
				this.defaultFormula = [{idx: 0, title: 'Total description'}]
				this.formulas = [{idx: 0, title: 'Total description'}]
				return this.defaultFormula;
			}
		},

		getTotalsIdx() {
			return this.formulas.map(f => f.idx)
		}
	},

	methods: {
		multiselectChooseTotals(formula) {
			const inArray = this.formulas.find(f => f.idx === formula.idx);
			if (inArray)
				return this.removeIdx(formula);

			this.formulas.push(formula);
		},

		removeIdx(formula) {
			this.formulas = this.formulas.filter(f => f.idx !== formula.idx);
		},

		updateFormulas() {
			const formulas = this.getFormulaFields;
			if ( this.formulas.length === 0 && Array.isArray( formulas ) && typeof formulas[0] !== "undefined" ) {
				this.formulas.push(formulas[0])
			}
		},

		clear() {
			const formulas = this.getFormulaFields;
			if ( this.formulas.length > 0 ) {
				this.formulas = this.formulas.filter(f => {
					const fInFormulas = formulas.find(innerF => innerF.idx === f.idx && f.title === innerF.title)
					return !!fInFormulas
				})
			}
		},
	},

	filters: {
		'to-short': (value) => {
			if (value && value.length >= 20) {
				return value.substring(0, 17) + '...'
			}
			return value || ''
		},
		'to-short-input': (value) => {
			const available = window.screen.width > 1440 ? 23 : 19
			if (value && value.length >= available) {
				return value.substring(0, (available - 3)) + '...'
			}
			return value || ''
		},

		'to-short-description': (value) => {
			if (value && value.length >= 88) {
				return value.substring(0, 85) + '...'
			}
			return value || ''
		},
	},

}