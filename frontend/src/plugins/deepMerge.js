export default {
	install(Vue) {
		Vue.prototype.$deepMerge = (leftData, rightData) => {
			const readyData = {}
			for (let leftInner in leftData) {
				let data = rightData[leftInner]
				if ( typeof leftData[leftInner] === "object" )
					data = {...leftData[leftInner], ...rightData[leftInner]}
				readyData[leftInner] = data
			}

			return readyData
		}
	}
}