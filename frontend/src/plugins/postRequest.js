const $ = require('jquery')
export default {
    install(Vue) {
        Vue.prototype.$postRequest = (url, data, callback) => {
            $.ajax({
                url,
                data,
                type : "post",
                dataType : "json",
                success: callback
            })
        }
    }
}