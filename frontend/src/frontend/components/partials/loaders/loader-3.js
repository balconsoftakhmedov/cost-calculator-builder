export default {
	props: ['scale'],

	computed: {
		getScale() {
			return {
				transform: `scale(${this.scale || 1})`
			}
		}
	},

	template: `
		<div class="ccb-loader-3" :style="getScale"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
	`
}
