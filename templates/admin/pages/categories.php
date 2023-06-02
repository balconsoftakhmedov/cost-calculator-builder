<?php
wp_enqueue_style( 'ccb-bootstrap-css', CALC_URL . '/frontend/dist/css/bootstrap.min.css', array(), CALC_VERSION );
wp_enqueue_style( 'ccb-calc-font', CALC_URL . '/frontend/dist/css/font/font.css', array(), CALC_VERSION );
wp_enqueue_style( 'ccb-admin-app-css', CALC_URL . '/frontend/dist/css/admin.css', array(), CALC_VERSION );
wp_enqueue_script( 'cbb-category-js', CALC_URL . '/frontend/dist/category.js', array(), CALC_VERSION, true );
wp_localize_script(
	'cbb-category-js',
	'ajax_window',
	array(
		'ajax_url'   => admin_url( 'admin-ajax.php' ),
		'plugin_url' => CALC_URL,
	)
);
?>
<div class="ccb-settings-wrapper calculator-orders" id="cost_calculator_categories">
	<div class="ccb-main-container">
		<?php require_once CALC_PATH . '/templates/admin/components/header.php'; ?>
		<div class="ccb-tab-content">
			<div class="ccb-tab-sections">
				<div class="ccb-table-body" v-if="preloader">
					<loader></loader>
				</div>
				<div class="ccb-table-body ccb-orders-page">
					<div class="ccb-table-body--card">
						<div class="table-display" style="position: relative; justify-content: flex-end; align-items: center; padding: 0 20px">
							<button class="ccb-button success" style="min-height: 40px" @click="createNew">
								<i class="ccb-icon-Path-3453" style="margin-right: 3px"></i>
								<?php esc_html_e( 'Create new', 'cost-calculator-builder' ); ?>
							</button>
						</div>
						<div class="table-concept ccb-custom-scrollbar">
							<div class="list-item orders-header">
								<div class="list-title check"></div>
								<div class="list-title id categories">
									<span class="ccb-default-title ccb-light"><?php esc_html_e( 'ID', 'cost-calculator-builder' ); ?></span>
								</div>
								<div class="list-title title">
									<span class="ccb-default-title ccb-light"><?php esc_html_e( 'Title', 'cost-calculator-builder' ); ?></span>
								</div>
								<div class="list-title status categories">
									<span class="ccb-default-title ccb-light"><?php esc_html_e( 'Slug', 'cost-calculator-builder' ); ?></span>
								</div>
								<div class="list-title status categories">
									<span class="ccb-default-title ccb-light"><?php esc_html_e( 'Type', 'cost-calculator-builder' ); ?></span>
								</div>
								<div class="list-title actions categories" style="text-align: center">
									<span class="ccb-default-title ccb-light"><?php esc_html_e( 'Actions', 'cost-calculator-builder' ); ?></span>
								</div>
							</div>
							<div class="list-item" style="cursor:pointer;" @click="e => editCategory(e, cat.id)" v-for="cat in categories">
								<div class="list-title check"></div>
								<div class="list-title id categories">
									<span class="ccb-default-title">{{ cat.id }}</span>
								</div>
								<div class="list-title title">
									<span class="ccb-default-title">{{ cat.title }}</span>
								</div>
								<div class="list-title status categories">
									<span class="ccb-default-title">{{ cat.slug }}</span>
								</div>
								<div class="list-title status categories">
									<span class="ccb-default-title">Default</span>
								</div>
								<div class="list-title actions ccb-cat-delete">
									<i @click="() => deleteCategory(cat.id)" class="ccb-icon-Path-3503 ccb-cat-delete"></i>
								</div>
							</div>
						</div>
					</div>
					<div class="ccb-table-body--content ccb-custom-scrollbar" :class="{'no-content': sidebar === false}">
						<div class="ccb-edit-info">
							<div class="ccb-edit-header">
								<span class="ccb-edit-title">Category</span>
								<span class="ccb-field-actions" @click.prevent="cancel">
									<button class="ccb-button default" @click.prevent="cancel"><?php esc_html_e( 'Cancel', 'cost-calculator-builder' ); ?></button>
									<button class="ccb-button success" @click.prevent="applyAction"><?php esc_html_e( 'Save', 'cost-calculator-builder' ); ?></button>
								</span>
							</div>
							<div class="ccb-grid-box" style="padding: 0" v-if="currentCategory">
								<div class="container" style="padding: 0">
									<div class="row ccb-p-t-15">
										<div class="col-6">
											<div class="ccb-input-wrapper">
												<span class="ccb-input-label"><?php esc_html_e( 'Title', 'cost-calculator-builder' ); ?></span>
												<input type="text" class="ccb-heading-5 ccb-light" v-model.trim="currentCategory.title" placeholder="<?php echo esc_attr( 'Enter category title' ); ?>">
											</div>
										</div>
										<div class="col-6">
											<div class="ccb-input-wrapper" :class="{disabled: disableSlug}">
												<span class="ccb-input-label"><?php esc_html_e( 'Slug', 'cost-calculator-builder' ); ?></span>
												<input type="text" class="ccb-heading-5 ccb-light" v-model.trim="currentCategory.slug" placeholder="<?php echo esc_attr( 'Enter Category slug' ); ?>">
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
