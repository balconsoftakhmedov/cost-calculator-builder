<?php

namespace CCB\Includes;

use cBuilder\Classes\Appearance\Presets\CCBPresets;
use cBuilder\Helpers\CCBFieldsHelper;

class Mixpanel_Single_Calculator extends Mixpanel {

	private static $chosen_settings = array(
		'Single Grand Total Used'          => array(
			'general' => 'descriptions',
		),
		'Single Grand Sticky Used'         => array(
			'general' => 'sticky',
		),
		'Single Woo Products Enabled'      => array(
			'woo_products' => 'enable',
		),
		'Single Woo Checkout Enabled'      => array(
			'woo_checkout' => 'enable',
		),
		'Single Most Used Currency Symbol' => array(
			'currency' => 'currency',
		),
	);

	public static function register_data() {
		self::add_data( 'Calculators Count', count( \cBuilder\Classes\CCBUpdatesCallbacks::get_calculators() ) );
		foreach ( CCBFieldsHelper::fields() as $field ) {
			self::add_data( 'Field ' . $field['alias'], self::get_calculators_field_count( $field['tag'] ) );
			self::add_data( 'Field Options ' . $field['alias'], self::get_calculators_field_option_count( $field['tag'] ) );
		}
		if ( defined( 'CCB_PRO' ) ) {
			self::add_data( 'Conditions Are Used', self::conditions_used() );
			self::add_data( 'Conditions Count', self::conditions_count() );
			foreach ( self::$chosen_settings as $label => $setting ) {
				self::add_data( $label, self::get_settings( $setting ) );
			}
		}
		self::add_data( 'Single PayPal Enabled', self::get_payment_methods( 'paypal' ) );
		self::add_data( 'Single Stripe Enabled', self::get_payment_methods( 'stripe' ) );
		self::add_data( 'Single Woo Checkout Payment Enabled', self::get_payment_methods( 'woo_checkout' ) );
		self::add_data( 'Single Default Form Used', self::get_default_form_count() );
		self::add_data( 'Single CF7 Used', self::get_cf7_count() );
		self::add_data( 'Calculator Horizontal Style', self::get_horizontal_style_count() );
		self::add_data( 'Calculator Vertical Style', self::get_vertical_style_count() );
		self::add_data( 'Calculator Two Column Style', self::get_column_style_count() );
		self::add_data( 'If/else Used Calculators Count', self::total_with_conditions() );
		self::add_data( 'Text Field Names', self::get_text_field_names() );
	}

	public static function get_calculators_field_count( $field_name ) {
		$fields_array = array();
		foreach ( self::$calculators_id as $calculator_id ) {
			$fields = get_post_meta( $calculator_id, 'stm-fields', true );

			foreach ( $fields as $field ) {
				$fields_array[] = $field['_tag'];
			}
		}
		$fields_count = array_count_values( $fields_array );

		return $fields_count[ $field_name ] ?? 0;
	}

	public static function conditions_used() {
		$conditions_array = array();
		foreach ( self::$calculators_id as $calculator_id ) {
			$conditions         = get_post_meta( $calculator_id, 'stm-conditions', true );
			$conditions_array[] = ( ! empty( $conditions['links'] ) ) ? 'true' : 'false';
		}

		return in_array( 'true', $conditions_array, true );
	}

	public static function conditions_count() {
		$conditions_count = 0;
		foreach ( self::$calculators_id as $calculator_id ) {
			$conditions        = get_post_meta( $calculator_id, 'stm-conditions', true );
			$conditions_count += count( $conditions['links'] );
		}

		return $conditions_count;
	}

	public static function get_settings( $query_settings ) {
		$settings_array  = array();
		$chosen_settings = array();

		foreach ( self::$calculators_id as $calculator_id ) {
			$settings         = get_option( 'stm_ccb_form_settings_' . $calculator_id );
			$settings_array[] = $settings[ key( $query_settings ) ];
		}

		if ( ! empty( $settings_array ) ) {
			foreach ( $settings_array as $setting_array ) {
				if ( 'woo_checkout' === key( $query_settings ) ) {
					$chosen_settings[] = ( ! empty( $setting_array['product_id'] ) && ! empty( $setting_array[ current( $query_settings ) ] ) && false !== $setting_array[ current( $query_settings ) ] && '' !== $setting_array[ current( $query_settings ) ] ) ? 'true' : 'false';
				} elseif ( 'currency' === key( $query_settings ) && false === get_option( 'ccb_general_settings' )['currency']['use_in_all'] ) {
					$chosen_settings['currency'][] = $setting_array[ key( $query_settings ) ];
				} else {
					$chosen_settings[] = ( ! empty( $setting_array[ current( $query_settings ) ] ) && false !== $setting_array[ current( $query_settings ) ] && '' !== $setting_array[ current( $query_settings ) ] ) ? 'true' : 'false';
				}
			}
		}

		return ( ! empty( $chosen_settings['currency'] ) ) ? key( self::most_common_item_in_array( $chosen_settings['currency'] ) ) : in_array( 'true', $chosen_settings, true );
	}

	public static function most_common_item_in_array( $array ) {
		$counted = array_count_values( $array );
		arsort( $counted );
		$most_common = array_slice( $counted, 0, 1 );

		return ( $most_common );
	}

	public static function get_payment_methods( $payment ) {
		$payment_methods = array();
		foreach ( self::$calculators_id as $calculator_id ) {
			$settings          = get_option( 'stm_ccb_form_settings_' . $calculator_id )['formFields'];
			$payment_methods[] = $settings['paymentMethods'];
		}
		foreach ( $payment_methods as $payment_method ) {
			return is_array( $payment_method ) && in_array( $payment, $payment_method, true );
		}
	}

	public static function get_default_form_count() {
		$default_form_count = 0;
		foreach ( self::$calculators_id as $calculator_id ) {
			$settings = get_option( 'stm_ccb_form_settings_' . $calculator_id )['formFields'];
			if ( '' === $settings['allowContactForm'] ) {
				$default_form_count ++;
			}
		}

		return $default_form_count;
	}

	public static function get_cf7_count() {
		$cf7_count = 0;
		foreach ( self::$calculators_id as $calculator_id ) {
			$settings = get_option( 'stm_ccb_form_settings_' . $calculator_id )['formFields'];
			if ( '' !== $settings['allowContactForm'] ) {
				$cf7_count ++;
			}
		}

		return $cf7_count;
	}

	public static function get_horizontal_style_count() {
		$horizontal_count = 0;
		foreach ( self::$calculators_id as $calculator_id ) {
			$settings = get_option( 'stm_ccb_form_settings_' . $calculator_id )['general'];
			if ( 'horizontal' === $settings['boxStyle'] ) {
				$horizontal_count ++;
			}
		}

		return $horizontal_count;
	}

	public static function get_vertical_style_count() {
		$vertical_count = 0;
		foreach ( self::$calculators_id as $calculator_id ) {
			$settings = get_option( 'stm_ccb_form_settings_' . $calculator_id )['general'];
			if ( 'vertical' === $settings['boxStyle'] ) {
				$vertical_count ++;
			}
		}

		return $vertical_count;
	}

	public static function get_column_style_count() {
		$column_count = 0;
		foreach ( self::$calculators_id as $calculator_id ) {
			$settings = get_option( 'stm_ccb_form_settings_' . $calculator_id )['general'];
			if ( 'two_column' === $settings['boxStyle'] ) {
				$column_count ++;
			}
		}

		return $column_count;
	}


	public static function get_calculators_field_option_count( $field_name ) {
		$field_options = array();
		$field_count   = 0;

		foreach ( self::$calculators_id as $calculator_id ) {
			$fields = get_post_meta( $calculator_id, 'stm-fields', true );

			foreach ( $fields as $field ) {
				if ( array_key_exists( 'options', $field ) ) {
					$field_options[] = array( $field['_tag'] => $field['options'] );
				}
			}
		}

		foreach ( $field_options as $field ) {
			if ( array_key_exists( $field_name, $field ) ) {
				$field_count += count( $field[ $field_name ] );
			}
		}

		return 0 !== $field_count ? $field_count : false;
	}

	public static function total_with_conditions() {
		$count = 0;
		foreach ( self::$calculators_id as $calculator_id ) {
			$fields = get_post_meta( $calculator_id, 'stm-fields', true );
			foreach ( $fields as $field ) {
				if ( array_key_exists( 'costCalcFormula', $field ) && false !== stripos( $field['costCalcFormula'], 'if' ) ) {
					$count ++;
				}
			}
		}

		return $count;
	}

	public static function get_text_field_names() {
		$text_field_names = array();
		foreach ( self::$calculators_id as $calculator_id ) {
			$fields = get_post_meta( $calculator_id, 'stm-fields', true );
			foreach ( $fields as $field ) {
				if ( 'cost-text' === $field['_tag'] ) {
					$text_field_names[] = $field['label'];
				}
			}
		}

		return ! empty( $text_field_names ) ? implode( ', ', $text_field_names ) : '';
	}
}
