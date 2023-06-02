<?php

namespace cBuilder\Classes\Appearance;

/**
 * Class CCBAppearanceDataStore
 * @package cBuilder\Classes\Appearance
 */
class CCBAppearanceDataStore {
	public function get_font_weight_options(): array {
		return array(
			'normal'  => __( 'Normal', 'cost-calculator-builder' ),
			'inherit' => __( 'Inherit', 'cost-calculator-builder' ),
			'100'     => __( '100', 'cost-calculator-builder' ),
			'200'     => __( '200', 'cost-calculator-builder' ),
			'300'     => __( '300', 'cost-calculator-builder' ),
			'400'     => __( '400', 'cost-calculator-builder' ),
			'500'     => __( '500', 'cost-calculator-builder' ),
			'600'     => __( '600', 'cost-calculator-builder' ),
			'700'     => __( '700', 'cost-calculator-builder' ),
			'800'     => __( '800', 'cost-calculator-builder' ),
			'900'     => __( '900', 'cost-calculator-builder' ),
			'bold'    => __( 'Bold', 'cost-calculator-builder' ),
			'bolder'  => __( 'Bolder', 'cost-calculator-builder' ),
		);
	}

	public function get_border_style_options(): array {
		return array(
			'dotted' => __( 'Dotted', 'cost-calculator-builder' ),
			'dashed' => __( 'Dashed', 'cost-calculator-builder' ),
			'solid'  => __( 'Solid', 'cost-calculator-builder' ),
			'double' => __( 'Double', 'cost-calculator-builder' ),
			'groove' => __( 'Groove', 'cost-calculator-builder' ),
			'ridge'  => __( 'Ridge', 'cost-calculator-builder' ),
			'inset'  => __( 'Inset', 'cost-calculator-builder' ),
			'outset' => __( 'Outset', 'cost-calculator-builder' ),
			'none'   => __( 'None', 'cost-calculator-builder' ),
			'hidden' => __( 'Hidden', 'cost-calculator-builder' ),
		);
	}

	public function get_description_position(): array {
		return array(
			'before' => __( 'Before field', 'cost-calculator-builder' ),
			'after'  => __( 'After field', 'cost-calculator-builder' ),
		);
	}
}
