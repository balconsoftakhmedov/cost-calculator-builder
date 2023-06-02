<div class="ccb-demo-import-container">
	<div class="ccb-demo-import-header" v-show="!demoImport.progress_load">
		<span class="ccb-back-wrap" @click="back"><i class="ccb-icon-Path-3398"></i></span>
		<span class="ccb-back-label" @click="back"><?php esc_html_e( 'Back', 'cost-calculator-builder' ); ?></span>
	</div>
	<div class="ccb-demo-import-content">
		<template v-if="loader">
			<loader></loader>
		</template>
		<template v-else>
			<div class="ccb-demo-import-icon-wrap">
				<i class="ccb-icon-Union-34"></i>
			</div>
			<div class="ccb-demo-import-title">
				<span v-if="!demoImport.load && !demoImport.progress_load"><?php esc_html_e( 'Import Calculators', 'cost-calculator-builder' ); ?></span>
				<span v-else><?php esc_html_e( 'Import in progress', 'cost-calculator-builder' ); ?></span>
			</div>
			<div class="ccb-demo-import-description" v-if="demoImport.finish">
				<span><?php esc_html_e( 'Demo import completed!', 'cost-calculator-builder' ); ?></span>
			</div>
			<div class="ccb-demo-import-description" v-else>
				<span v-if="!demoImport.load && !demoImport.progress_load"><?php esc_html_e( 'Import prebuilt calculators or upload exported calculator file', 'cost-calculator-builder' ); ?></span>
				<span v-else><?php esc_html_e( 'It will take some time', 'cost-calculator-builder' ); ?></span>
			</div>
			<div class="ccb-demo-import-action" v-if="!demoImport.load && !demoImport.progress_load && !demoImport.finish">
				<button class="ccb-button success" @click="applyImporter"><?php esc_html_e( 'Select File', 'cost-calculator-builder' ); ?></button>
				<input v-model="demoImport.image['file']" type="file" id="ccb-file" hidden="hidden" accept=".txt" @change="loadImage()" ref="image-file"/>
			</div>
			<div class="ccb-progress-container" v-if="demoImport.progress_load">
				<div class="progress">
					<div class="progress-bar progress-bar-animated bg-success" role="progressbar" :aria-valuenow="demoImport.progress" aria-valuemin="0" aria-valuemax="100" :style="'width: '+demoImport.progress+'%'"></div>
				</div>
				<div class="progress-bar-value">{{ demoImport.progress }}%</div>
			</div>
		</template>
	</div>
</div>
