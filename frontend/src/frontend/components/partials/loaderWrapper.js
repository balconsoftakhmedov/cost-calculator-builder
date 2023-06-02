import loader0 from './loaders/loader-0'
import loader1 from './loaders/loader-1'
import loader2 from './loaders/loader-2'
import loader3 from './loaders/loader-3'
import loader4 from './loaders/loader-4'

export default {
	props: ['idx', 'width', 'height', 'scale', 'front', 'form'],
	mounted() {
		if ( ! this.idx ) {
			this.idx = 0
		}
	},
	components: {
		'loader-0': loader0,
		'loader-1': loader1,
		'loader-2': loader2,
		'loader-3': loader3,
		'loader-4': loader4,
	},
	computed: {
		getFrontStyles() {
			if ( ! this.front ) {
				return {}
			}
			return {
				position: 'absolute',
				left: '0',
				right: '0',
				top: this.form ? 0 : '40%',
				margin: '0 auto !important',
			}
		}
	},
	template: `
		<component :is="'loader-' + idx" :width="width" :height="height" :scale="scale" :style="getFrontStyles"></component>
	`
}
