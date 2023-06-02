<?php
// TODO mv all logic to controller
use cBuilder\Classes\Appearance\CCBAppearanceHelper;

if ( ! isset( $calc_id ) ) {
	return;
}

/** if language not set, use en as default */
if ( ! isset( $language ) ) {
	$language = 'en';
}

if ( ! isset( $translations ) ) {
	$translations = array();
}

$container_style  = 'v-container';
$settings         = get_option( 'stm_ccb_form_settings_' . $calc_id );
$general_settings = get_option( 'ccb_general_settings' );

$ccb_sync         = ccb_sync_settings_from_general_settings( $settings, $general_settings, true );
$settings         = $ccb_sync['settings'];
$general_settings = $ccb_sync['general_settings'];

if ( ! empty( $settings ) && isset( $settings[0] ) && isset( $settings[0]['general'] ) ) {
	$settings = $settings[0];
}

if ( empty( $settings['general'] ) ) {
	$settings = \cBuilder\Classes\CCBSettingsData::settings_data();
}

$settings['calc_id'] = $calc_id;
$settings['title']   = get_post_meta( $calc_id, 'stm-name', true );

if ( ! empty( $settings['formFields']['body'] ) ) {
	$settings['formFields']['body'] = str_replace( '<br>', PHP_EOL, $settings['formFields']['body'] );
}


$preset_key = get_post_meta( $calc_id, 'ccb_calc_preset_idx', true );
$preset_key = empty( $preset_key ) ? 0 : $preset_key;
$appearance = CCBAppearanceHelper::get_appearance_data( $preset_key );
$loader_idx = 0;

if ( ! empty( $appearance ) ) {
	$appearance = $appearance['data'];

	if ( isset( $appearance['desktop']['others']['data']['calc_preloader']['value'] ) ) {
		$loader_idx = $appearance['desktop']['others']['data']['calc_preloader']['value'];
	}
}

$fields = get_post_meta( $calc_id, 'stm-fields', true ) ?? array();
if ( ! empty( $fields ) ) {
	array_walk(
		$fields,
		function ( &$field_value, $k ) {
			if ( array_key_exists( 'required', $field_value ) ) {
				$field_value['required'] = $field_value['required'] ? 'true' : 'false';
			}
		}
	);
}

$data = array(
	'id'           => $calc_id,
	'settings'     => $settings,
	'currency'     => ccb_parse_settings( $settings ),
	'fields'       => $fields,
	'formula'      => get_post_meta( $calc_id, 'stm-formula', true ),
	'conditions'   => apply_filters( 'calc-render-conditions', array(), $calc_id ), // phpcs:ignore WordPress.NamingConventions.ValidHookName.UseUnderscores
	'language'     => $language,
	'appearance'   => $appearance,
	'dateFormat'   => get_option( 'date_format' ),
	'pro_active'   => ccb_pro_active(),
	'default_img'  => CALC_URL . '/frontend/dist/img/default.png',
	'error_img'    => CALC_URL . '/frontend/dist/img/error.png',
	'success_img'  => CALC_URL . '/frontend/dist/img/success.png',
	'translations' => $translations,
);

$custom_defined = false;
if ( isset( $is_preview ) ) {
	$custom_defined = true;
}

$styles = array(
	array(
		'label' => __( 'Two columns', 'cost-calculator-builder' ),
		'icon'  => 'ccb-icon-Union-27',
		'key'   => 'two_column',
	),
	array(
		'label' => __( 'Vertical', 'cost-calculator-builder' ),
		'icon'  => 'ccb-icon-Union-26',
		'key'   => 'vertical',
	),
	array(
		'label' => __( 'Horizontal', 'cost-calculator-builder' ),
		'icon'  => 'ccb-icon-Union-25',
		'key'   => 'horizontal',
	),
);

$invoice_texts = array(
	'order'          => esc_html__( 'Order', 'cost-calculator-builder' ),
	'total_title'    => esc_html__( 'Total Summary', 'cost-calculator-builder' ),
	'payment_method' => esc_html__( 'Payment method:', 'cost-calculator-builder' ),
	'contact_title'  => esc_html__( 'Contact Information', 'cost-calculator-builder' ),
	'contact_form'   => array(
		'name'    => esc_html__( 'Name', 'cost-calculator-builder' ),
		'email'   => esc_html__( 'Email', 'cost-calculator-builder' ),
		'phone'   => esc_html__( 'Phone', 'cost-calculator-builder' ),
		'message' => esc_html__( 'Message', 'cost-calculator-builder' ),
	),
);

$send_pdf_texts = array(
	'title'          => esc_html__( 'Email Quote', 'cost-calculator-builder' ),
	'name'           => esc_html__( 'Name', 'cost-calculator-builder' ),
	'name_holder'    => esc_html__( 'Enter name', 'cost-calculator-builder' ),
	'email'          => esc_html__( 'Email', 'cost-calculator-builder' ),
	'email_holder'   => esc_html__( 'Enter Email', 'cost-calculator-builder' ),
	'message'        => esc_html__( 'Message', 'cost-calculator-builder' ),
	'message_holder' => esc_html__( 'Enter message', 'cost-calculator-builder' ),
	'submit'         => isset( $general_settings['invoice']['submitBtnText'] ) ? $general_settings['invoice']['submitBtnText'] : esc_html__( 'Send', 'cost-calculator-builder' ),
	'close'          => esc_html__( 'Close', 'cost-calculator-builder' ),
	'success_text'   => esc_html__( 'Email Quote Successfully Sent!', 'cost-calculator-builder' ),
	'error_message'  => esc_html__( 'Fill in the required fields correctly.', 'cost-calculator-builder' ),
);

if ( ! empty( $general_settings['stripe']['use_in_all'] ) || ! empty( $settings['stripe']['enable'] ) ) {
	wp_enqueue_script( 'calc-stripe', 'https://js.stripe.com/v3/', array(), CALC_VERSION, false );
}

wp_localize_script( 'calc-builder-main-js', 'calc_data_' . $calc_id, $data );
$get_date_format = get_option( 'date_format' );
?>
<?php if ( ! isset( $is_preview ) ) : ?>
<div class="calculator-settings ccb-front ccb-wrapper-<?php echo esc_attr( $calc_id ); ?>">
	<?php endif; ?>
	<calc-builder-front custom="<?php echo esc_attr( $custom_defined ); ?>" :content="<?php echo esc_attr( wp_json_encode( $data, 0, JSON_UNESCAPED_UNICODE ) ); ?>" inline-template :id="<?php echo esc_attr( $calc_id ); ?>">
		<div ref="calc" class="calc-container" data-calc-id="<?php echo esc_attr( $calc_id ); ?>" :class="[boxStyle, {demoSite: showDemoBoxStyle}]">
			<loader-wrapper v-if="loader" idx="<?php echo esc_attr( $loader_idx ); ?>" width="60px" height="60px" scale="0.9" :front="true"></loader-wrapper>
			<div class="ccb-demo-box-styles" :class="{active: showDemoBoxStyle}">
				<div class="ccb-box-styles">
					<?php foreach ( $styles as $style ) : ?>
						<div class="ccb-box-style-inner" :class="{'ccb-style-active': boxStyle === '<?php echo esc_attr( $style['key'] ); ?>'}" @click="changeBoxStyle('<?php echo esc_html( $style['key'] ); ?>')">
							<i class="<?php echo esc_attr( $style['icon'] ); ?>"></i>
							<span><?php echo esc_html( $style['label'] ); ?></span>
						</div>
					<?php endforeach; ?>
				</div>
			</div>
			<div class="calc-fields calc-list calc-list__indexed" :class="{loaded: !loader, 'payment' : getHideCalc}">
				<div class="calc-list-inner">
					<div class="calc-item-title">
						<h2><?php echo esc_attr( $settings['title'] ); ?></h2>
					</div>
					<div v-if="calc_data" class="calc-fields-container">
						<template v-for="field in calc_data.fields">
							<template v-if="field && field.alias && field.type !== 'Total'">
								<component
										format="<?php esc_attr( $get_date_format ); ?>"
										text-days="<?php esc_attr_e( 'days', 'cost-calculator-builder' ); ?>"
										v-if="fields[field.alias]"
										:is="field._tag"
										:id="calc_data.id"
										:field="field"
										:converter="currencyFormat"
										:disabled="fields[field.alias].disabled"
										v-model="fields[field.alias].value"
										v-on:change="change"
										v-on:[field._event]="change"
										v-on:condition-apply="renderCondition"
										:key="!field.hasNextTick ? field.alias : field.alias + '_' + fields[field.alias].nextTickCount"
								>
								</component>
							</template>
							<template v-else-if="field && !field.alias && field.type !== 'Total'">
								<component
										:id="calc_data.id"
										style="boxStyle"
										:is="field._tag"
										:field="field"
								>
								</component>
							</template>
						</template>
					</div>
				</div>
			</div>

			<div class="calc-subtotal calc-list" :id="getTotalStickyId" :class="{loaded: !loader}">
				<div class="calc-subtotal-wrapper">
					<div class="calc-list-inner" v-show="getStep !== 'finish'">
						<div class="calc-item-title calc-accordion">
							<h2><?php echo isset( $settings['general']['header_title'] ) ? esc_html( $settings['general']['header_title'] ) : ''; ?></h2>
							<?php if ( isset( $settings['general']['descriptions'] ) ? esc_html( $settings['general']['descriptions'] ) : '' ) : ?>
								<span class="calc-accordion-btn" ref="calcAccordionToggle" @click="toggleAccordion">
									<i class="ccb-icon-Path-3485" :style="{top: '1px', transform: currentAccordionHeight === '0px' ? 'rotate(0)' : 'rotate(180deg)'}"></i>
								</span>
							<?php endif; ?>
						</div>
						<div class="calc-subtotal-list">
							<div class="calc-subtotal-list-accordion" ref="calcAccordion" :style="{maxHeight: currentAccordionHeight}">
								<template v-for="field in getTotalSummaryFields" v-if="field.alias.indexOf('total') === -1 && settings && settings.general.descriptions">
									<div :class="[field.alias, 'sub-list-item']" :style="{display: field.hidden ? 'none' : 'flex'}">
										<span class="sub-item-title"> {{ field.label }} </span>
										<span class="sub-item-space"></span>
										<span class="sub-item-value" v-if="!field.summary_view || field.summary_view === 'show_value'"> {{  field.converted }} </span>
										<span class="sub-item-value" v-if="field.summary_view !== 'show_value' && field.extraView"> {{  field.extraView }} </span>
										<span class="sub-item-value" v-if="field.summary_view !== 'show_value' && !field.extraView"> </span>
									</div>
									<div :class="[field.alias, 'sub-list-item inner']" v-if="['checkbox', 'toggle', 'checkbox_with_img'].includes(field.alias.replace(/\_field_id.*/,'')) && field.options && field.options.length">
										<div class="sub-inner" v-for="option in field.options" :style="{display: field.hidden ? 'none' : 'flex'}">
											<span class="sub-item-title"> {{ option.label }} </span>
											<span class="sub-item-space"></span>
											<span class="sub-item-value"> {{  option.converted }} </span>
										</div>
									</div>
								</template>
							</div>
						</div>

						<div class="calc-subtotal-list" style="margin-top: 20px; padding-top: 10px;" ref="calcTotals">
							<template v-for="item in formulaConst">
								<div v-if="formulaConst.length === 1 && typeof formulaConst[0].alias === 'undefined'" style="display: flex" class="sub-list-item total">
									<span class="sub-item-title"><?php esc_html_e( 'Total', 'cost-calculator-builder' ); ?></span>
									<span class="sub-item-value">{{ item.data.converted }}</span>
								</div>
								<cost-total v-else :value="item.total" :field="item.data" :id="calc_data.id" v-on:condition-apply="renderCondition"></cost-total>
							</template>
						</div>

						<div class="calc-subtotal-list" v-if="getWooProductName">
							<div class="calc-woo-product">
								<div class="calc-woo-product__info">
									"{{getWooProductName}}"<?php echo esc_html__( ' has been added to your cart', 'cost-calculator-builder' ); ?>
								</div>
								<?php if ( function_exists( 'wc_get_cart_url' ) ) : ?>
									<button class="calc-woo-product__btn">
										<a href="<?php echo esc_url( wc_get_cart_url() ); ?>"><span><?php echo esc_html__( 'View cart', 'cost-calculator-builder' ); ?></span></a>
									</button>
								<?php endif; ?>
							</div>
						</div>

						<div class="calc-subtotal-list calc-buttons">
							<?php if ( ccb_pro_active() ) : ?>
								<cost-pro-features inline-template :settings="content.settings">
									<?php echo \cBuilder\Classes\CCBProTemplate::load( 'frontend/pro-features', array( 'settings' => $settings, 'general_settings' => $general_settings, 'invoice' => $general_settings['invoice'] ) ); // phpcs:ignore ?>
								</cost-pro-features>
							<?php endif; ?>
						</div>
					</div>

					<div class="calc-list-inner" v-show="getStep === 'finish'">
						<div class="calc-item-title">
							<h2><?php echo isset( $settings['texts']['title'] ) ? esc_html( $settings['texts']['title'] ) : ''; ?></h2>
							<span class="calc-item-title-description"><?php echo isset( $settings['texts']['description'] ) ? esc_html( $settings['texts']['description'] ) : ''; ?></span>
						</div>
						<div class="calc-subtotal-list">
							<div class="sub-list-item">
								<span class="sub-item-title"> <?php echo isset( $settings['texts']['issued_on'] ) ? esc_html( $settings['texts']['issued_on'] ) : ''; ?>: </span>
								<span class="sub-item-space"></span>
								<span class="sub-item-value"> {{ $store.getters.getIssuedOn }} </span>
							</div>
							<div class="sub-list-item" v-if="$store.getters.getPaymentType !== $store.getters.getTranslations.form_no_payment">
								<span class="sub-item-title"> <?php esc_html_e( 'Payment method', 'cost-calculator-builder' ); ?>: </span>
								<span class="sub-item-space"></span>
								<span class="sub-item-value"> {{ $store.getters.getPaymentType }} </span>
							</div>
							<div class="sub-list-item" v-for="item in $store.getters.getFinalSummaryList">
								<span class="sub-item-title"> {{ item.title }}: </span>
								<span class="sub-item-space"></span>
								<span class="sub-item-value"> {{ item.value }} </span>
							</div>
						</div>
						<div class="calc-item">
							<div class="ccb-btn-wrap ccb-finish <?php echo $general_settings['invoice']['use_in_all'] && $general_settings['invoice']['emailButton'] ? 'pdf-enable' : ''; ?>" style="margin-top: 20px">
								<div class="ccb-btn-container calc-buttons">
									<?php if ( ! empty( $general_settings['invoice']['use_in_all'] ) && $general_settings['invoice']['use_in_all'] ) : ?>
										<button class="calc-btn-action invoice-button success" @click="getInvoice">
											<span><?php echo isset( $general_settings['invoice']['buttonText'] ) ? esc_html( $general_settings['invoice']['buttonText'] ) : ''; ?></span>
											<div class="invoice-btn-loader"></div>
										</button>
										<?php if ( $general_settings['invoice']['emailButton'] ) : ?>
											<button class="calc-btn-action" @click="showSendPdf">
												<span><?php echo isset( $general_settings['invoice']['btnText'] ) ? esc_html( $general_settings['invoice']['btnText'] ) : esc_html__( 'Send Quote', 'cost-calculator-builder' ); ?></span>
												<span class="is-pro">
														<span class="pro-tooltip">
															pro
														<span style="visibility: hidden;" class="pro-tooltiptext">Feature Available <br> in Pro Version</span>
													</span>
												</span>
											</button>
										<?php endif; ?>
									<?php endif; ?>
									<button class="calc-btn-action" @click="resetCalc">
										{{ $store.getters.getSettings.texts.reset_btn }}
									</button>
								</div>
							</div>
						</div>
					</div>
					<div class="calc-list-inner calc-notice" :class="noticeData.type" v-show="getStep === 'notice'">
						<calc-notices :notice="noticeData"/>
					</div>
				</div>
				<calc-invoice
					ref="invoice"
					company-name="<?php echo isset( $general_settings['invoice']['companyName'] ) ? esc_attr( $general_settings['invoice']['companyName'] ) : ''; ?>"
					company-info="<?php echo isset( $general_settings['invoice']['companyInfo'] ) ? esc_attr( $general_settings['invoice']['companyInfo'] ) : ''; ?>"
					company-logo='<?php echo esc_attr( $general_settings['invoice']['companyLogo'] ); ?>'
					date-format="<?php echo isset( $general_settings['invoice']['dateFormat'] ) ? esc_attr( $general_settings['invoice']['dateFormat'] ) : ''; ?>"
					static-texts='<?php echo wp_json_encode( $invoice_texts ); ?>'
					send-email-texts='<?php echo wp_json_encode( $send_pdf_texts ); ?>'
					send-pdf-from="<?php echo isset( $general_settings['invoice']['fromEmail'] ) ? esc_attr( $general_settings['invoice']['fromEmail'] ) : ''; ?>"
					send-pdf-fromname="<?php echo isset( $general_settings['invoice']['fromName'] ) ? esc_attr( $general_settings['invoice']['fromName'] ) : ''; ?>"
					:summary-fields="getTotalSummaryFields"
					site-lang="<?php echo esc_attr( get_bloginfo( 'language' ) ); ?>"
				/>
			</div>
		</div>
	</calc-builder-front>
	<?php if ( ! isset( $is_preview ) ) : ?>
</div>
<?php endif; ?>
