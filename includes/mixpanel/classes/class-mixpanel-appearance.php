<?php

namespace CCB\Includes;

use cBuilder\Classes\Appearance\Presets\CCBPresetGenerator;

class Mixpanel_Appearance extends Mixpanel {

	public static function register_data() {
		self::add_data( 'Presets Count', self::get_presets_count() );
		self::add_data( 'Single Accent Color', self::get_accent_color() );
		self::add_data( 'Single Checkbox Horizontal View', self::get_appearance_field_view( 'checkbox' ) );
		self::add_data( 'Single Radio Horizontal View', self::get_appearance_field_view( 'radio' ) );
		self::add_data( 'Single Toggle Horizontal View', self::get_appearance_field_view( 'toggle' ) );
		self::add_data( 'Appearance Container Border', self::get_appearance_borders_difference( 'container_border' ) );
		self::add_data( 'Appearance Fields Border', self::get_appearance_borders_difference( 'fields_border' ) );
		self::add_data( 'Appearance Buttons Border', self::get_appearance_borders_difference( 'button_border' ) );
		self::add_data( 'Appearance Shadows', self::get_appearance_shadows_difference() );
		self::add_data( 'Appearance Spacing & Positions', self::get_appearance_spacing_difference() );

		$colors_diff = self::get_appearance_difference( 'colors' );
		if ( ! empty( $colors_diff ) ) {
			foreach ( $colors_diff as $key => $value ) {
				self::add_data( $key, $value );
			}
		}
		$typography_diff = self::get_appearance_difference( 'typography' );
		if ( ! empty( $typography_diff ) ) {
			foreach ( $typography_diff as $key => $value ) {
				self::add_data( $key, $value );
			}
		}
		$elements_sizes_diff = self::get_appearance_difference( 'elements_sizes' );
		if ( ! empty( $elements_sizes_diff ) ) {
			foreach ( $elements_sizes_diff as $key => $value ) {
				self::add_data( $key, $value );
			}
		}
		$spacing_diff = self::get_appearance_difference( 'spacing_and_positions' );
		if ( ! empty( $spacing_diff ) ) {
			foreach ( $spacing_diff as $key => $value ) {
				self::add_data( $key, $value );
			}
		}
		$others_diff = self::get_appearance_difference( 'others' );
		if ( ! empty( $others_diff ) ) {
			foreach ( $others_diff as $key => $value ) {
				self::add_data( $key, $value );
			}
		}
	}

	public static function get_presets_count() {
		return count( get_option( 'ccb_appearance_presets' ) );
	}

	public static function get_accent_color() {
		$accent_colors = array();
		foreach ( self::$calculators_id as $calculator_id ) {
			$settings        = get_option( 'ccb_appearance_presets' );
			$selected_preset = get_post_meta( $calculator_id, 'ccb_calc_preset_idx', true );
			$accent_colors[] = $settings[ $selected_preset ]['desktop']['colors']['accent_color'];
		}

		return implode( ', ', $accent_colors );
	}

	public static function get_appearance_field_view( $field_name ) {
		$horizontal_count = 0;
		foreach ( self::$calculators_id as $calculator_id ) {
			$settings        = get_option( 'ccb_appearance_presets' );
			$selected_preset = get_post_meta( $calculator_id, 'ccb_calc_preset_idx', true );

			if ( true === $settings[ $selected_preset ]['desktop']['others'][ $field_name . '_horizontal_view' ] ) {
				$horizontal_count ++;
			}
		}

		return $horizontal_count;
	}

	public static function get_appearance_difference( $field_category ) {
		$difference     = array();
		$user_preset    = get_option( 'ccb_appearance_presets' );
		$default_preset = CCBPresetGenerator::default_presets();

		foreach ( self::$calculators_id as $calculator_id ) {
			$selected_preset[] = get_post_meta( $calculator_id, 'ccb_calc_preset_idx', true );
		}

		if ( isset( $selected_preset ) ) {
			foreach ( $selected_preset as $preset ) {
				$preset       = intval( $preset );
				$difference[] = array_keys( self::array_diff_multi( $user_preset[ $preset ]['desktop'][ $field_category ], $default_preset[ $preset ]['desktop'][ $field_category ] ) );
			}
		}

		$difference = array_merge( self::array_flatten( $difference ) );

		return ! empty( $difference ) ? array_fill_keys( $difference, 'Changed' ) : false;
	}

	public static function get_appearance_borders_difference( $border ) {
		$difference     = array();
		$user_preset    = get_option( 'ccb_appearance_presets' );
		$default_preset = CCBPresetGenerator::default_presets();
		foreach ( self::$calculators_id as $calculator_id ) {
			$selected_preset[] = get_post_meta( $calculator_id, 'ccb_calc_preset_idx', true );
		}
		if ( isset( $selected_preset ) ) {
			foreach ( $selected_preset as $preset ) {
				$preset = intval( $preset );
				if ( is_array( $user_preset[ $preset ]['desktop']['borders'][ $border ] ) && is_array( $default_preset[ $preset ]['desktop']['borders'][ $border ] ) ) {
					$difference[] = array_diff( $user_preset[ $preset ]['desktop']['borders'][ $border ], $default_preset[ $preset ]['desktop']['borders'][ $border ] );
				}
			}
		}

		return ! empty( $difference ) ? 'Changed' : false;
	}

	public static function get_appearance_shadows_difference() {
		$difference     = array();
		$user_preset    = get_option( 'ccb_appearance_presets' );
		$default_preset = CCBPresetGenerator::default_presets();
		foreach ( self::$calculators_id as $calculator_id ) {
			$selected_preset[] = get_post_meta( $calculator_id, 'ccb_calc_preset_idx', true );
		}
		if ( isset( $selected_preset ) ) {
			foreach ( $selected_preset as $preset ) {
				$preset = intval( $preset );
				if ( is_array( $user_preset[ $preset ]['desktop']['shadows']['container_shadow'] ) && is_array( $default_preset[ $preset ]['desktop']['shadows']['container_shadow'] ) ) {
					$difference[] = array_diff( $user_preset[ $preset ]['desktop']['shadows']['container_shadow'], $default_preset[ $preset ]['desktop']['shadows']['container_shadow'] );
				}
			}
		}

		return ! empty( $difference ) ? 'Changed' : false;
	}

	public static function get_appearance_spacing_difference() {
		$difference     = array();
		$user_preset    = get_option( 'ccb_appearance_presets' );
		$default_preset = CCBPresetGenerator::default_presets();

		foreach ( self::$calculators_id as $calculator_id ) {
			$selected_preset[] = get_post_meta( $calculator_id, 'ccb_calc_preset_idx', true );
		}

		if ( isset( $selected_preset ) ) {
			foreach ( $selected_preset as $preset ) {
				$preset = intval( $preset );
				if ( is_array( $default_preset[ $preset ]['desktop']['spacing_and_positions']['container_padding'] ) && is_array( $default_preset[ $preset ]['desktop']['spacing_and_positions']['container_margin'] ) ) {
					$difference[] = array_diff( $user_preset[ $preset ]['desktop']['spacing_and_positions']['container_margin'], $default_preset[ $preset ]['desktop']['spacing_and_positions']['container_margin'] );
					$difference[] = array_diff( $user_preset[ $preset ]['desktop']['spacing_and_positions']['container_padding'], $default_preset[ $preset ]['desktop']['spacing_and_positions']['container_padding'] );
				}
			}
		}

		return ! empty( $difference ) ? 'Changed' : false;
	}
}
