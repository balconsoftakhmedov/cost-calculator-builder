export default {
	props: ['notice'],
	mounted() {

	},
	template: `
		<div class="calc-notice-wrap">
			<div class="calc-notice-icon">
				<img :src="notice.image" alt="notice img">
			</div>
			<div class="calc-notice-content">
				<span class="calc-notice-title">{{ notice.title }}</span>
				<span class="calc-notice-description" v-if="notice.description" v-html="notice.description"></span>
			</div>
		</div>
	`
}