<div class="ccb-main-container">
	<?php require_once CALC_PATH . '/templates/admin/components/header.php'; ?>
	<div class="ccb-tab-content">
		<div class="ccb-tab-sections" v-if="preloader">
			<div class="ccb-table-body">
				<loader></loader>
			</div>
		</div>
		<div class="ccb-tab-sections" v-else>
			<div class="ccb-table-body ccb-templates-content">
				<div class="ccb-templates-main-header">
					<div class="ccb-templates-main-header-title-box">
						<span class="ccb-heading-1 ccb-bold"><?php esc_html_e( 'Select a Template', 'cost-calculator-builder' ); ?></span>
						<span class="ccb-heading-5 ccb-light"><?php esc_html_e( 'To speed up the process you can select from one of our pre-made templates, start with a blank form and create your own.', 'cost-calculator-builder' ); ?></span>
					</div>
					<div class="ccb-templates-main-header-filters">
						<div class="ccb-templates-main-header-filters-sort-box">
							<div class="ccb-select-box">
								<div class="ccb-select-wrapper" style="max-height: 40px;">
									<i class="ccb-icon-Path-3485 ccb-select-arrow" style="top: 55%"></i>
									<select class="ccb-select" style="padding-top: 4px" v-model="category">
										<option value="all"><?php esc_html_e( 'All Categories', 'cost-calculator-builder-pro' ); ?></option>
										<option :value="cat.slug" v-for="cat in $store.getters.getTempCategories">{{ cat.title }}</option>
									</select>
								</div>
							</div>
						</div>
						<div class="ccb-templates-main-header-filters-search-box">
							<div class="ccb-templates-search-box">
								<input type="text" class="ccb-title" v-model="search" placeholder="<?php esc_attr_e( 'Search templates', 'cost-calculator-builder' ); ?>">
								<i class="ccb-icon-Search-Magnifier"></i>
							</div>
						</div>
					</div>
				</div>
				<div class="ccb-templates-main-body">
					<div class="ccb-templates-section">
						<span class="ccb-heading-3 ccb-bold"><?php esc_html_e( 'Basic', 'cost-calculator-builder' ); ?></span>
						<template-list :items="createNewList"/>
					</div>

					<div class="ccb-templates-section" v-if="favoriteTemplates.length > 0">
						<span class="ccb-heading-3 ccb-bold"><?php esc_html_e( 'Favorite Templates', 'cost-calculator-builder' ); ?></span>
						<template-list :items="favoriteTemplates"/>
					</div>

					<div class="ccb-templates-section" v-if="tempCustomTemplates.length > 0">
						<span class="ccb-heading-3 ccb-bold"><?php esc_html_e( 'Custom Templates', 'cost-calculator-builder' ); ?></span>
						<template-list :items="tempCustomTemplates"/>
					</div>

					<template v-if="beforeTemplates.length > 0" v-for="t in beforeTemplates">
						<div class="ccb-templates-section" v-if="t && t.templates.length > 0">
							<span class="ccb-heading-3 ccb-bold">{{ t.title }}</span>
							<template-list :items="t.templates"/>
						</div>
					</template>

					<?php if ( ! defined( 'CCB_PRO_VERSION' ) ) : ?>
					<template v-if="search.trim() === ''">
						<div class="ccb-templates-section">
							<div class="ccb-info-container">
								<div class="ccb-info-title-box">
									<span class="ccb-info-title-box-header">Get full access</span>
									<span class="ccb-info-title-box-description">Upgrade your account to get full access to all powerful features of Cost Calculator.</span>
								</div>
								<div class="ccb-info-action">
									<a href="https://stylemixthemes.com/cost-calculator-pricing/?utm_source=wpadmin&utm_medium=buynow&utm_campaign=cost-calculator-plugin&licenses=1&billing_cycle=annual" target="_blank" class="btn-upgrade">
										<i class="ccb-icon-icon-Unlock-filled" style="margin-right: 8px"></i>
										<?php esc_html_e( 'Unlock now', 'cost-calculator-builder' ); ?>
									</a>
								</div>
							</div>
						</div>
					</template>
					<?php endif; ?>

					<template v-if="afterTemplates.length > 0" v-for="t in afterTemplates">
						<div class="ccb-templates-section" v-if="t && t.templates.length > 0">
							<span class="ccb-heading-3 ccb-bold">{{ t.title }}</span>
							<template-list :items="t.templates"/>
						</div>
					</template>
				</div>
			</div>
		</div>
	</div>
	<template-modal-window>
		<template v-slot:content>
			<template-free-content v-if="$store.getters.getTemplateModalType === 'free-template'"></template-free-content>
			<template-pro-content v-if="$store.getters.getTemplateModalType === 'pro-template'"></template-pro-content>
		</template>
	</template-modal-window>
</div>
