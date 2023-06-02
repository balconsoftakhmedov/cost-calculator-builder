import loaderWrapper from "../../../../../frontend/components/partials/loaderWrapper";

export default {
	components: {
		'loader-wrapper': loaderWrapper,
	},
	props: {
		element: {
			type: Object,
			default: {},
		},
		name: '',
	},
	data: () => ({
		value: 0,
		loaders: [0, 1, 2, 3, 4]
	}),
	created() {
		this.value = this.element.value;
	},
	watch: {
		value: function () {
			this.element.value = this.value;
			this.$emit('change');
		}
	},
	template: `
		<div class="calc-preloader-box">
			<div class="calc-preloader-item" v-for="idx in loaders" @click="value = +idx" :class="{'ccb-preloader-selected': +idx === +value}">
				<loader-wrapper :idx="idx" width="28px" height="28px" scale="0.4"></loader-wrapper>
			</div>
		</div>
	`,
}
