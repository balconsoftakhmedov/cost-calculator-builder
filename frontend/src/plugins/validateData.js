export default {
    install(Vue) {
        Vue.prototype.$validateData = (data, type = 'settings') => {
            if (type === 'settings') {
                for (let prop in data) {
                    const innerSettings = data[prop]
                    if (typeof innerSettings === 'object')
                        for (let innerProp in innerSettings) {
                            let keys = ['accessEmail', 'allowContactForm', 'enable', 'payment', 'hide_woo_cart']
                            let values = [0, '0', false, 'false', '']
                            if ( keys.indexOf(innerProp) !== -1 && values.indexOf(innerSettings[innerProp]) !== -1 )  {
                                data[prop][innerProp] = ''
                            }
                        }
                }
            }

            if (type === 'builder') {
                data.forEach((element, key) => {
                    if (typeof data[key] === "object") {
                        let keys = ['allowCurrency', 'allowRound']
                        let values = [0, '0', false, 'false', '']
                        for ( let innerKey in element ) {
                            if ( keys.indexOf(innerKey) !== -1 && values.indexOf(element[innerKey]) !== -1 ) {
                                data[key][innerKey] = ''
                            }
                        }
                    }
                })
            }

            return data
        }
    }
}