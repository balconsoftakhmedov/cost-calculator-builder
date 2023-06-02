const WooLinks = {};
const $ = require('jquery');

WooLinks.initLinks = function () {
	const settings = this.$store.getters.getSettings;

	if ( settings.woo_products?.enable ) {
		const links  = settings.woo_products.meta_links;
		const calcId = this.$store.getters.getSettings.calc_id || this.id;

		setTimeout(() => {
			this.$calc = $(`*[data-calc-id="${calcId}"]`);
			links.forEach((link) => {
				const setValue = $(`#woo_${link.woo_meta}`).data('value');

				switch (link.action) {
					case 'set_value': {
						Object.values(this.calcStore).forEach( calc => {
							if ( calc.alias === link.calc_field ) {
								this.fields[calc.alias].value = setValue;
								
								if ( calc.alias.indexOf('checkbox') !== -1 ) {
									this.fields[calc.alias].value = [
										{converted: setValue, label: setValue, temp: setValue, value: setValue}
									];
								}
								
								if ( calc.alias.indexOf('toggle') !== -1 ) {
									this.fields[calc.alias].value = [
										{converted: setValue, label: setValue, temp: setValue, value: setValue}
									];
								}
								
								if ( calc.alias.indexOf('range') !== -1 ) {
									this.$calc.find('.calc_' + calc.alias + ' input').each((i, e) => {
										if (i !== 0)  e.disabled = true
									});
								}

								if ( calc.alias.indexOf('multi') !== -1 ) {
									this.$calc.find('.calc_' + calc.alias + ' input').each((i, e) => e.disabled = true);
									this.fields[calc.alias].value = {
										end: setValue,
										start: 0,
										value: setValue
									};
								}

							}
						});
						break;
					}

					case 'set_value_disable': {
						Object.values(this.calcStore).forEach( calc => {
							if ( calc.alias === link.calc_field ) {
								this.$store.getters.filterUnused(calc);
								this.fields[calc.alias].value = setValue;
								this.$calc.find('.calc_' + calc.alias).addClass('calc-field-disabled');
								
								if ( calc.alias.indexOf('checkbox') !== -1 ) {
									this.fields[calc.alias].value = [
										{converted: setValue, label: setValue, temp: setValue, value: setValue}
									];
								}
								
								if ( calc.alias.indexOf('toggle') !== -1 ) {
									this.fields[calc.alias].value = [
										{converted: setValue, label: setValue, temp: setValue, value: setValue}
									];
								}

								if ( calc.alias.indexOf('range') !== -1 ) {
									this.$calc.find('.calc_' + calc.alias + ' input').each((i, e) => {
										if (i !== 0)  e.disabled = true
									});
								}

								if ( calc.alias.indexOf('multi') !== -1 ) {
									this.$calc.find('.calc_' + calc.alias + ' input').each((i, e) => e.disabled = true);
									this.fields[calc.alias].value = {
										end: setValue,
										start: 0,
										value: setValue
									};
								}
							}
						});
						break;
					}
				}

			});
			this.apply();
		});
	}
};

export default WooLinks;
