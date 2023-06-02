<?php

namespace cBuilder\Classes;

class CCBTranslations {

	/**
	 * Frontend Translation Data
	 * @return array
	 */
	public static function get_frontend_translations() {

		$translations = array(
			'empty_end_date_error' => esc_html__( 'Please select the second date', 'cost-calculator-builder' ),
			'required_field'       => esc_html__( 'This field is required', 'cost-calculator-builder' ),
			'select_date_range'    => esc_html__( 'Select Date Range', 'cost-calculator-builder' ),
			'select_date'          => esc_html__( 'Select Date', 'cost-calculator-builder' ),
			'high_end_date_error'  => esc_html__( 'To date must be greater than from date', 'cost-calculator-builder' ),
			'high_end_multi_range' => esc_html__( 'To value must be greater than from value', 'cost-calculator-builder' ),
			'wrong_file_url'       => esc_html__( 'Wrong file url', 'cost-calculator-builder' ),
			'big_file_size'        => esc_html__( 'File size is too big', 'cost-calculator-builder' ),
			'wrong_file_format'    => esc_html__( 'Wrong file format', 'cost-calculator-builder' ),
			'form_no_payment'      => esc_html__( 'No Payment', 'cost-calculator-builder' ),
		);

		return $translations;
	}

	public static function get_backend_translations() {
		$translations = array(
			'bulk_action_attention'    => esc_html__( 'Are you sure to "%s" choosen Calculators?', 'cost-calculator-builder' ),
			'copied'                   => esc_html__( 'Copied', 'cost-calculator-builder' ),
			'not_selected_calculators' => esc_html__( 'No calculators were selected', 'cost-calculator-builder' ),
			'select_bulk'              => esc_html__( 'Select bulk action', 'cost-calculator-builder' ),
			'changes_saved'            => esc_html__( 'Changes Saved', 'cost-calculator-builder' ),
			'calculator_deleted'       => esc_html__( 'Calculator Deleted', 'cost-calculator-builder' ),
			'calculator_duplicated'    => esc_html__( 'Calculator Duplicated', 'cost-calculator-builder' ),
			'condition_link_saved'     => esc_html__( 'Condition Link Saved', 'cost-calculator-builder' ),
			'required_field'           => esc_html__( 'This field is required', 'cost-calculator-builder' ),
			'delete_order_info'        => esc_html__( 'You are going to delete order', 'cost-calculator-builder' ),
			'success_deleted'          => esc_html__( 'Items successfully deleted', 'cost-calculator-builder' ),
			'not_selected'             => esc_html__( 'Please choose at least one value', 'cost-calculator-builder' ),
			'select_image'             => esc_html__( 'Select Image', 'cost-calculator-builder' ),
			'format_error'             => sprintf( '%s <br> %s', __( 'File format is not supported.', 'cost-calculator-builder' ), __( 'Supported file formats: JPG, PNG', 'cost-calculator-builder' ) ),
		);

		return $translations;
	}
}
