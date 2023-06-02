<?php

namespace cBuilder\Classes;

class CCBSettingsData {
	public static function get_tab_pages() {
		return array( 'calculator', 'conditions', 'settings', 'customize' );
	}

	public static function settings_data() {
		return array(
			'general'        => array(
				'header_title'           => 'Summary',
				'descriptions'           => true,
				'hide_empty'             => true,
				'sticky'                 => false,
				'show_details_accordion' => true,
				'boxStyle'               => 'vertical',
				'styles'                 => array(
					'radio'             => '',
					'checkbox'          => '',
					'toggle'            => '',
					'radio_with_img'    => '',
					'checkbox_with_img' => '',
				),
			),
			'currency'       => array(
				'currency'            => '$',
				'num_after_integer'   => 2,
				'decimal_separator'   => '.',
				'thousands_separator' => ',',
				'currencyPosition'    => 'left_with_space',
			),
			'texts'          => array(
				'title'        => 'Your service request has been completed!',
				'description'  => 'We have sent your request information to your email.',
				'issued_on'    => 'Issued on',
				'reset_btn'    => 'Create new calculation',
				'invoice_btn'  => 'Get invoice',
				'required_msg' => 'This field is required',
			),
			'formFields'     => array(
				'fields'            => array(),
				'emailSubject'      => '',
				'contactFormId'     => '',
				'accessEmail'       => false,
				'adminEmailAddress' => '',
				'submitBtnText'     => 'Submit',
				'allowContactForm'  => false,
				'body'              => 'Dear sir/madam\n' .
					'We would be very grateful to you if you could provide us the quotation of the following=>\n' .
					'\nTotal Summary\n' .
					'[ccb-subtotal]\n' .
					'Total: [ccb-total-0]\n' .
					'Looking forward to hearing back from you.\n' .
					'Thanks in advance',
				'payment'           => false,
				'paymentMethod'     => '',
			),
			'paypal'         => array(
				'enable'        => false,
				'description'   => '[ccb-total-0]',
				'paypal_email'  => '',
				'currency_code' => '',
				'paypal_mode'   => 'sandbox',
				'formulas'      => array(),
			),
			'woo_products'   => array(
				'enable'        => false,
				'category_id'   => '',
				'hook_to_show'  => 'woocommerce_after_single_product_summary',
				'hide_woo_cart' => false,
				'meta_links'    => array(),
			),
			'woo_checkout'   => array(
				'enable'      => false,
				'product_id'  => '',
				'redirect_to' => 'cart',
				'description' => '[ccb-total-0]',
				'formulas'    => array(),
			),
			'stripe'         => array(
				'enable'      => false,
				'secretKey'   => '',
				'publishKey'  => '',
				'currency'    => 'usd',
				'description' => '[ccb-total-0]',
				'formulas'    => array(),
			),
			'recaptcha_type' => array(
				'v2' => 'Google reCAPTCHA v2',
				'v3' => 'Google reCAPTCHA v3',
			),
			'recaptcha_v3'   => array(
				'siteKey'   => '',
				'secretKey' => '',
			),
			'recaptcha'      => array(
				'enable'  => false,
				'type'    => 'v2',
				'options' => array(
					'v2' => 'Google reCAPTCHA v2',
					'v3' => 'Google reCAPTCHA v3',
				),
				'v2'      => array(
					'siteKey'   => '',
					'secretKey' => '',
				),
				'v3'      => array(
					'siteKey'   => '',
					'secretKey' => '',
				),
			),
			'notice'         => array(
				'requiredField' => 'This field is required',
			),
			'icon'           => 'fas fa-cogs',
			'type'           => 'Cost Calculator Settings',
		);
	}

	public static function general_settings_data() {
		return array(
			'currency'        => array(
				'use_in_all'          => false,
				'currency'            => '$',
				'num_after_integer'   => 2,
				'decimal_separator'   => '.',
				'thousands_separator' => ',',
				'currencyPosition'    => 'left_with_space',
			),
			'invoice'         => array(
				'use_in_all'       => false,
				'companyName'      => '',
				'companyInfo'      => '',
				'companyLogo'      => '',
				'showAfterPayment' => true,
				'fromEmail'        => '',
				'fromName'         => '',
				'emailButton'      => false,
				'submitBtnText'    => 'Send',
				'btnText'          => 'Send Quote',
				'buttonText'       => 'PDF Download',
				'dateFormat'       => 'MM/DD/YYYY HH:mm',
			),
			'email_templates' => array(
				'title'           => 'Calculation result',
				'description'     => 'This email is automatically generated and does not require a response. If you have a question, please contact: support@example.com',
				'logo'            => '',
				'footer'          => true,
				'template_color'  => array(
					'value'   => '#EEF1F7',
					'type'    => 'color',
					'default' => '#EEF1F7',
				),
				'content_bg'      => array(
					'value'   => '#FFFFFF',
					'type'    => 'color',
					'default' => '#FFFFFF',
				),
				'main_text_color' => array(
					'value'   => '#001931',
					'type'    => 'color',
					'default' => '#001931',
				),
				'border_color'    => array(
					'value'   => '#ddd',
					'type'    => 'color',
					'default' => '#ddd',
				),
				'button_color'    => array(
					'value'   => '#00B163',
					'type'    => 'color',
					'default' => '#00B163',
				),
			),
			'form_fields'     => array(
				'use_in_all'        => false,
				'emailSubject'      => '',
				'adminEmailAddress' => '',
				'submitBtnText'     => 'Submit',
			),
			'recaptcha'       => array(
				'use_in_all' => false,
				'enable'     => false,
				'type'       => 'v2',
				'v3'         => array(
					'siteKey'   => '',
					'secretKey' => '',
				),
				'v2'         => array(
					'siteKey'   => '',
					'secretKey' => '',
				),
				'options'    => array(
					'v2' => 'Google reCAPTCHA v2',
					'v3' => 'Google reCAPTCHA v3',
				),
			),
			'stripe'          => array(
				'use_in_all' => false,
				'secretKey'  => '',
				'publishKey' => '',
				'currency'   => 'USD',
			),
			'paypal'          => array(
				'use_in_all'    => false,
				'paypal_email'  => '',
				'currency_code' => '',
				'paypal_mode'   => 'sandbox',
			),
		);
	}

	public static function get_settings_pages() {
		return array(
			array(
				'type'  => 'basic',
				'title' => __( 'Grand Total', 'cost-calculator-builder' ),
				'slug'  => 'total-summary',
				'icon'  => 'ccb-icon-Union-28',
			),

			array(
				'type'  => 'basic',
				'title' => __( 'Currency', 'cost-calculator-builder' ),
				'slug'  => 'currency',
				'icon'  => 'ccb-icon-Union-23',
			),

			array(
				'type'  => 'basic',
				'title' => __( 'Notifications', 'cost-calculator-builder' ),
				'slug'  => 'texts',
				'icon'  => 'ccb-icon-Path-3601',
			),

			array(
				'type'  => 'pro',
				'title' => __( 'Send Form', 'cost-calculator-builder' ),
				'slug'  => 'send-form',
				'icon'  => 'ccb-icon-XMLID_426',
			),

			array(
				'type'  => 'pro',
				'title' => __( 'Woo Products', 'cost-calculator-builder' ),
				'slug'  => 'woo-products',
				'icon'  => 'ccb-icon-Union-17',
			),

			array(
				'type'  => 'pro',
				'title' => __( 'Woo Checkout', 'cost-calculator-builder' ),
				'slug'  => 'woo-checkout',
				'icon'  => 'ccb-icon-Path-3498',
			),

			array(
				'type'  => 'pro',
				'title' => __( 'Stripe', 'cost-calculator-builder' ),
				'slug'  => 'stripe',
				'icon'  => 'ccb-icon-Path-3499',
			),

			array(
				'type'  => 'pro',
				'title' => __( 'PayPal', 'cost-calculator-builder' ),
				'slug'  => 'paypal',
				'icon'  => 'ccb-icon-Path-3500',
			),
		);
	}

	public static function get_general_settings_pages() {
		return array(
			array(
				'type'  => 'basic',
				'title' => __( 'Currency', 'cost-calculator-builder' ),
				'slug'  => 'currency',
				'icon'  => 'ccb-icon-Union-23',
			),

			array(
				'type'  => 'basic',
				'title' => __( 'PDF Entries', 'cost-calculator-builder' ),
				'slug'  => 'invoice',
				'icon'  => 'ccb-icon-Path-3494',
			),

			array(
				'type'  => 'basic',
				'title' => __( 'Email', 'cost-calculator-builder' ),
				'slug'  => 'email',
				'icon'  => 'ccb-icon-XMLID_426',
			),

			array(
				'type'  => 'basic',
				'title' => __( 'Email Template', 'cost-calculator-builder' ),
				'slug'  => 'email-template',
				'icon'  => 'ccb-icon-email-template',
			),

			array(
				'type'  => 'pro',
				'title' => __( 'Captcha', 'cost-calculator-builder' ),
				'slug'  => 'captcha',
				'icon'  => 'ccb-icon-Path-3468',
			),

			array(
				'type'  => 'pro',
				'title' => __( 'Stripe', 'cost-calculator-builder' ),
				'slug'  => 'stripe',
				'icon'  => 'ccb-icon-Path-3499',
			),

			array(
				'type'  => 'pro',
				'title' => __( 'PayPal', 'cost-calculator-builder' ),
				'slug'  => 'paypal',
				'icon'  => 'ccb-icon-Path-3500',
			),
		);
	}

	public static function get_tab_data() {
		return array(
			'calculators' => array(
				'icon'      => 'ccb-icon-Path-3516',
				'label'     => __( 'Calculator fields', 'cost-calculator-builder' ),
				'component' => 'ccb-calculator-tab',
			),
			'conditions'  => array(
				'icon'      => 'ccb-icon-path3745',
				'label'     => __( 'Conditions', 'cost-calculator-builder' ),
				'component' => '',
			),
			'settings'    => array(
				'icon'      => 'ccb-icon-Union-28',
				'label'     => __( 'Settings', 'cost-calculator-builder' ),
				'component' => '',
			),
			'appearances' => array(
				'icon'      => 'ccb-icon-Union-20',
				'label'     => __( 'Appearance', 'cost-calculator-builder' ),
				'component' => '',
			),
		);
	}

	public static function stm_calc_created_set_option( $post_id, $post, $update ) {
		if ( ! $update ) {
			return;
		}

		$created = get_option( 'stm_calc_created', false );
		if ( ! $created ) {
			$data = array(
				'show_time'   => time(),
				'step'        => 0,
				'prev_action' => '',
			);
			set_transient( 'stm_cost-calculator-builder_single_notice_setting', $data );
			update_option( 'stm_calc_created', true );
		}
	}

	public static function stm_admin_notice_rate_calc( $data ) {
		if ( is_array( $data ) ) {
			$data['title']   = 'Well done!';
			$data['content'] = 'You have built your first calculator up. Now please help us by rating <strong>Cost Calculator 5 Stars!</strong>';
		}

		return $data;
	}
}
