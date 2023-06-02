const $ = require('jquery')
export default {
    install(Vue) {
        Vue.prototype.$getRequest = (url, data, callback) => {
            $.ajax({
                url,
                data,
                type : "get",
                dataType : "json",
                success: callback
            })
        }
    }
}