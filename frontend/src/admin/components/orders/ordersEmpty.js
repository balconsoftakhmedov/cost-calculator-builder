export default {
	props: ['label', 'description'],
	template:
		`<div class="ccb-table-body--no-content">
			<span  class="ccb-table-body--no-content-icon-wrap">
				<i  class="ccb-icon-Box-open-2"></i>
			</span>
			<span class="ccb-table-body--no-content-label">{{ label }}</span>
			<span class="ccb-table-body--no-content-description">{{ description }}</span>
		</div>`
}