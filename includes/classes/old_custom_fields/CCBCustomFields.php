<?php

namespace cBuilder\Classes\CustomFields;

class  CCBCustomFields {

	public static function custom_fields() {
		$data = array(
			'v-container'   => array(
				'name'   => 'v-container',
				'fields' => array(
					self::generate_width( 'Width', 'width', 0, 100, 1, 47.5, '%' ),
					self::generate_bg_color( 'Container-background', 'background-color', '#eff4f4', '#eff4f4', '#eff4f4' ),
					self::generate_border( 0, 100, 1, 0, 0, 0, 0, 0, '0', '#ffffff', 'px' ),
					self::generate_border_radius( 0, 100, 1, 8, 8, 8, 8, 8, null, null, 'px' ),
					self::generate_box_shadow( self::container_box_shadow() ),
					self::generate_indentations( 'Margin', 'margin', '0px', '0px', '0px', '0px' ),
					self::generate_indentations( 'Padding', 'padding', '50px', '50px', '50px', '50px' ),
				),
			),

			'h-container'   => array(
				'name'   => 'h-container',
				'fields' => array(
					self::generate_width( 'Width', 'width', 0, 100, 1, 100, '%' ),
					self::generate_bg_color( 'Container-background', 'background-color', '#eff4f4', '#eff4f4', '#eff4f4' ),
					self::generate_border( 0, 100, 1, 0, 0, 0, 0, 0, '0', '#ffffff', 'px' ),
					self::generate_border_radius( 0, 100, 1, 8, 8, 8, 8, 8, null, null, 'px' ),
					self::generate_box_shadow( self::container_box_shadow() ),
					self::generate_indentations( 'Margin', 'margin', '0px', '0px', '0px', '0px' ),
					self::generate_indentations( 'Padding', 'padding', '50px', '50px', '50px', '50px' ),
				),
			),

			'headers'       => array(
				'name'   => 'headers',
				'fields' => array(
					self::generate_text_settings(
						array(
							'label' => 'Text-color',
							'value' => '#000000',
						),
						array(
							'label'     => 'Font-size',
							'min'       => 0,
							'max'       => 100,
							'step'      => 1,
							'value'     => 22,
							'dimension' => 'px',
						),
						array(
							'label'     => 'Letter-spacing',
							'min'       => 0,
							'max'       => 100,
							'step'      => 1,
							'value'     => 0,
							'dimension' => 'px',
						),
						array(
							'blur'        => array(
								'min'       => 0,
								'max'       => 20,
								'step'      => 1,
								'value'     => 0,
								'dimension' => 'px',
							),
							'opacity'     => array(
								'min'       => 0,
								'max'       => 1,
								'step'      => 0.01,
								'value'     => 0,
								'dimension' => 'px',
							),
							'shift_right' => array(
								'min'       => -40,
								'max'       => 40,
								'step'      => 1,
								'value'     => 0,
								'dimension' => 'px',
							),
							'shift_down'  => array(
								'min'       => -40,
								'max'       => 40,
								'step'      => 1,
								'value'     => 0,
								'dimension' => 'px',
							),
							'color'       => '#ffffff',
						),
						array(
							'value' => '700',
						),
						array(
							'value' => 'normal',
						)
					),
				),
			),

			'labels'        => array(
				'name'   => 'labels',
				'fields' => array(
					self::generate_text_settings(
						array(
							'label' => 'Text-color',
							'value' => '#000000',
						),
						array(
							'label'     => 'Font-size',
							'min'       => 0,
							'max'       => 100,
							'step'      => 1,
							'value'     => 14,
							'dimension' => 'px',
						),
						array(
							'label'     => 'Letter-spacing',
							'min'       => 0,
							'max'       => 100,
							'step'      => 1,
							'value'     => 0,
							'dimension' => 'px',
						),
						array(
							'blur'        => array(
								'min'       => 0,
								'max'       => 20,
								'step'      => 1,
								'value'     => 0,
								'dimension' => 'px',
							),
							'opacity'     => array(
								'min'       => 0,
								'max'       => 1,
								'step'      => 0.01,
								'value'     => 0,
								'dimension' => 'px',
							),
							'shift_right' => array(
								'min'       => -40,
								'max'       => 40,
								'step'      => 1,
								'value'     => 0,
								'dimension' => 'px',
							),
							'shift_down'  => array(
								'min'       => -40,
								'max'       => 40,
								'step'      => 1,
								'value'     => 0,
								'dimension' => 'px',
							),
							'color'       => '#ffffff',
						),
						array(
							'value' => '400',
						),
						array(
							'value' => 'normal',
						)
					),
					self::generate_indentations( 'Margin', 'margin', '0px', '0px', '8px', '0px' ),
					self::generate_indentations( 'Padding', 'padding', '0px', '0px', '0px', '0px' ),
				),

			),

			'descriptions'  => array(
				'name'   => 'descriptions',
				'fields' => array(
					self::generate_text_settings(
						array(
							'label' => 'Text-color',
							'value' => '#a29f9f',
						),
						array(
							'label'     => 'Font-size',
							'min'       => 0,
							'max'       => 100,
							'step'      => 1,
							'value'     => 12,
							'dimension' => 'px',
						),
						array(
							'label'     => 'Letter-spacing',
							'min'       => 0,
							'max'       => 100,
							'step'      => 1,
							'value'     => 0,
							'dimension' => 'px',
						),
						array(
							'blur'        => array(
								'min'       => 0,
								'max'       => 20,
								'step'      => 1,
								'value'     => 0,
								'dimension' => 'px',
							),
							'opacity'     => array(
								'min'       => 0,
								'max'       => 1,
								'step'      => 0.01,
								'value'     => 0,
								'dimension' => 'px',
							),
							'shift_right' => array(
								'min'       => -40,
								'max'       => 40,
								'step'      => 1,
								'value'     => 0,
								'dimension' => 'px',
							),
							'shift_down'  => array(
								'min'       => -40,
								'max'       => 40,
								'step'      => 1,
								'value'     => 0,
								'dimension' => 'px',
							),
							'color'       => '#ffffff',
						),
						array(
							'value' => '400',
						),
						array(
							'value' => 'normal',
						)
					),
					self::generate_indentations( 'Margin', 'margin', '3px', '0px', '3px', '0px' ),
					self::generate_indentations( 'Padding', 'padding', '0px', '0px', '0px', '0px' ),
				),

			),

			'total-summary' => array(
				'name'   => 'total-summary',
				'fields' => array(
					self::generate_text_settings(
						array(
							'label' => 'Text-color',
							'value' => '#000000',
						),
						array(
							'label'     => 'Font-size',
							'min'       => 0,
							'max'       => 100,
							'step'      => 1,
							'value'     => 16,
							'dimension' => 'px',
						),
						array(
							'label'     => 'Letter-spacing',
							'min'       => 0,
							'max'       => 100,
							'step'      => 1,
							'value'     => 0,
							'dimension' => 'px',
						),
						array(
							'blur'        => array(
								'min'       => 0,
								'max'       => 20,
								'step'      => 1,
								'value'     => 0,
								'dimension' => 'px',
							),
							'opacity'     => array(
								'min'       => 0,
								'max'       => 1,
								'step'      => 0.01,
								'value'     => 0,
								'dimension' => 'px',
							),
							'shift_right' => array(
								'min'       => -40,
								'max'       => 40,
								'step'      => 1,
								'value'     => 0,
								'dimension' => 'px',
							),
							'shift_down'  => array(
								'min'       => -40,
								'max'       => 40,
								'step'      => 1,
								'value'     => 0,
								'dimension' => 'px',
							),
							'color'       => '#ffffff',
						),
						array(
							'value' => '400',
						),
						array(
							'value' => 'normal',
						)
					),
				),
			),

			'total'         => array(
				'name'   => 'total',
				'fields' => array(
					self::generate_text_settings(
						array(
							'label' => 'Text-color',
							'value' => '#000000',
						),
						array(
							'label'     => 'Font-size',
							'min'       => 0,
							'max'       => 100,
							'step'      => 1,
							'value'     => 16,
							'dimension' => 'px',
						),
						array(
							'label'     => 'Letter-spacing',
							'min'       => 0,
							'max'       => 100,
							'step'      => 1,
							'value'     => 0,
							'dimension' => 'px',
						),
						array(
							'blur'        => array(
								'min'       => 0,
								'max'       => 20,
								'step'      => 1,
								'value'     => 0,
								'dimension' => 'px',
							),
							'opacity'     => array(
								'min'       => 0,
								'max'       => 1,
								'step'      => 0.01,
								'value'     => 0,
								'dimension' => 'px',
							),
							'shift_right' => array(
								'min'       => -40,
								'max'       => 40,
								'step'      => 1,
								'value'     => 0,
								'dimension' => 'px',
							),
							'shift_down'  => array(
								'min'       => -40,
								'max'       => 40,
								'step'      => 1,
								'value'     => 0,
								'dimension' => 'px',
							),
							'color'       => '#000000',
						),
						array(
							'value' => '700',
						),
						array(
							'value' => 'normal',
						),
						array(
							'name'  => 'text-align',
							'value' => '',
						)
					),
				),
			),

			'buttons'       => array(
				'name'   => 'buttons',
				'fields' => array(
					self::generate_text_settings(
						array(
							'label' => 'Text-color',
							'value' => '#fff',
						),
						array(
							'label'     => 'Font-size',
							'min'       => 0,
							'max'       => 100,
							'step'      => 1,
							'value'     => 13,
							'dimension' => 'px',
						),
						array(
							'label'     => 'Letter-spacing',
							'min'       => 0,
							'max'       => 100,
							'step'      => 1,
							'value'     => 0,
							'dimension' => 'px',
						),
						array(
							'blur'        => array(
								'min'       => 0,
								'max'       => 20,
								'step'      => 1,
								'value'     => 0,
								'dimension' => 'px',
							),
							'opacity'     => array(
								'min'       => 0,
								'max'       => 1,
								'step'      => 0.01,
								'value'     => 0,
								'dimension' => 'px',
							),
							'shift_right' => array(
								'min'       => -40,
								'max'       => 40,
								'step'      => 1,
								'value'     => 0,
								'dimension' => 'px',
							),
							'shift_down'  => array(
								'min'       => -40,
								'max'       => 40,
								'step'      => 1,
								'value'     => 0,
								'dimension' => 'px',
							),
							'color'       => '#000000',
						),
						array(
							'value' => '400',
						),
						array(
							'value' => 'normal',
						),
						array(
							'name'  => 'text-align',
							'value' => '',
						)
					),
					self::generate_indentations( 'Margin', 'margin', '0px', '0px', '8px', '0px' ),
					self::generate_indentations( 'Padding', 'padding', '20px', '40px', '20px', '40px' ),
					self::generate_border( 0, 100, 1, 1, 1, 1, 1, 1, '1', '#00b163', 'px' ),
					self::generate_border_radius( 0, 100, 1, 4, 4, 4, 4, 4, null, null, 'px' ),
					self::generate_bg_color( 'Background-color', 'background-color', '#00b163', '#00b163', '#00b163' ),

					self::generate_effects(
						array(
							'name'        => 'submit-hover-effects',
							'label'       => 'Hover-effects',
							'data'        => array(
								array(
									'label'   => 'Background-color',
									'name'    => 'background-color',
									'type'    => 'effects',
									'default' => '#047b47',
									'value'   => '#047b47',

								),
								array(
									'label'   => 'Border-color',
									'name'    => 'border-color',
									'type'    => 'effects',
									'default' => '#bdc9ca',
									'value'   => '#bdc9ca',

								),
								array(
									'label'   => 'Font-color',
									'name'    => 'font-color',
									'type'    => 'effects',
									'default' => '#fff',
									'value'   => '#fff',
								),
							),
							'effect_type' => 'hover',
						)
					),
				),
			),

			'input-fields'  => array(
				'name'   => 'input-fields',
				'fields' => array(
					self::generate_text_settings(
						array(
							'label' => 'Text-color',
							'value' => '#000000',
						),
						array(
							'label'     => 'Font-size',
							'min'       => 0,
							'max'       => 100,
							'step'      => 1,
							'value'     => 14,
							'dimension' => 'px',
						),
						array(
							'label'     => 'Letter-spacing',
							'min'       => 0,
							'max'       => 100,
							'step'      => 1,
							'value'     => 0,
							'dimension' => 'px',
						),
						array(
							'blur'        => array(
								'min'       => 0,
								'max'       => 20,
								'step'      => 1,
								'value'     => 0,
								'dimension' => 'px',
							),
							'opacity'     => array(
								'min'       => 0,
								'max'       => 1,
								'step'      => 0.01,
								'value'     => 0,
								'dimension' => 'px',
							),
							'shift_right' => array(
								'min'       => -40,
								'max'       => 40,
								'step'      => 1,
								'value'     => 0,
								'dimension' => 'px',
							),
							'shift_down'  => array(
								'min'       => -40,
								'max'       => 40,
								'step'      => 1,
								'value'     => 0,
								'dimension' => 'px',
							),
							'color'       => '#ffffff',
						),
						array(
							'value' => '400',
						),
						array(
							'value' => 'normal',
						)
					),
					self::generate_width( 'Width', 'width', 0, 100, 1, 100, '%' ),
					self::generate_bg_color( 'Input-color', 'background-color', '#fff', '#fff', '#fff' ),
					self::generate_border( 0, 100, 1, 1, 1, 1, 1, 1, '1', '#d0d0d0', 'px' ),
					self::generate_border_radius( 0, 100, 1, 0, 0, 0, 0, 0, null, null, 'px' ),
					self::generate_indentations( 'Margin', 'margin', '0px', '0px', '0px', '0px' ),
					self::generate_indentations( 'Padding', 'padding', '17px', '15px', '17px', '15px' ),
					self::generate_effects(
						array(
							'name'        => 'input-active-effects',
							'label'       => 'Active-effects',
							'data'        => array(
								array(
									'label'   => 'Background-color',
									'name'    => 'background-color',
									'type'    => 'effects',
									'default' => '#fff',
									'value'   => '#fff',

								),
								array(
									'label'   => 'Border-color',
									'name'    => 'border-color',
									'type'    => 'effects',
									'default' => '#00b163',
									'value'   => '#00b163',

								),
								array(
									'label'   => 'Font-color',
									'name'    => 'font-color',
									'type'    => 'effects',
									'default' => '#000',
									'value'   => '#000',
								),
							),
							'effect_type' => 'active',
						)
					),
				),
			),

			'drop-down'     => array(
				'name'   => 'drop-down',
				'fields' => array(
					self::generate_text_settings(
						array(
							'label' => 'Text-color',
							'value' => '#000000',
						),
						array(
							'label'     => 'Font-size',
							'min'       => 0,
							'max'       => 100,
							'step'      => 1,
							'value'     => 14,
							'dimension' => 'px',
						),
						array(
							'label'     => 'Letter-spacing',
							'min'       => 0,
							'max'       => 100,
							'step'      => 1,
							'value'     => 0,
							'dimension' => 'px',
						),
						array(
							'blur'        => array(
								'min'       => 0,
								'max'       => 20,
								'step'      => 1,
								'value'     => 0,
								'dimension' => 'px',
							),
							'opacity'     => array(
								'min'       => 0,
								'max'       => 1,
								'step'      => 0.01,
								'value'     => 0,
								'dimension' => 'px',
							),
							'shift_right' => array(
								'min'       => -40,
								'max'       => 40,
								'step'      => 1,
								'value'     => 0,
								'dimension' => 'px',
							),
							'shift_down'  => array(
								'min'       => -40,
								'max'       => 40,
								'step'      => 1,
								'value'     => 0,
								'dimension' => 'px',
							),
							'color'       => '#ffffff',
						),
						array(
							'value' => '400',
						),
						array(
							'value' => 'normal',
						),
						array(
							'name'  => 'text-align-last',
							'value' => 'left',
						)
					),
					self::generate_border( 0, 100, 1, 0, 0, 0, 0, 0, '1', '#d0d0d0', 'px' ),
					self::generate_border_radius( 0, 100, 1, 0, 0, 0, 0, 0, null, null, 'px' ),
					self::generate_bg_color( 'Drop-down-background', 'background-color', '#fff', '#fff', '#fff' ),
					self::generate_indentations( 'Margin', 'margin', '0px', '0px', '0px', '0px' ),
					self::generate_indentations( 'Padding', 'padding', '15px', '20px', '16px', '20px' ),
				),

			),

			'radio-button'  => array(
				'name'   => 'radio-button',
				'fields' => array(
					self::generate_text_settings(
						array(
							'label' => 'Text-color',
							'value' => '#000000',
						),
						array(
							'label'     => 'Font-size',
							'min'       => 0,
							'max'       => 100,
							'step'      => 1,
							'value'     => 14,
							'dimension' => 'px',
						),
						array(
							'label'     => 'Letter-spacing',
							'min'       => 0,
							'max'       => 100,
							'step'      => 1,
							'value'     => 0,
							'dimension' => 'px',
						),
						array(
							'blur'        => array(
								'min'       => 0,
								'max'       => 20,
								'step'      => 1,
								'value'     => 0,
								'dimension' => 'px',
							),
							'opacity'     => array(
								'min'       => 0,
								'max'       => 1,
								'step'      => 0.01,
								'value'     => 0,
								'dimension' => 'px',
							),
							'shift_right' => array(
								'min'       => -40,
								'max'       => 40,
								'step'      => 1,
								'value'     => 0,
								'dimension' => 'px',
							),
							'shift_down'  => array(
								'min'       => -40,
								'max'       => 40,
								'step'      => 1,
								'value'     => 0,
								'dimension' => 'px',
							),
							'color'       => '#ffffff',
						),
						array(
							'value' => '400',
						),
						array(
							'value' => 'normal',
						)
					),
					self::generate_single_color( 'Radio-Border', 'radioBorder', '#bdc9ca' ),
					self::generate_single_color( 'Radio-Background', 'radioBackground', '#fff' ),
					self::generate_single_color( 'Radio-Checked-Background', 'radioChecked', '#00b163' ),
				),
			),

			'checkbox'      => array(
				'name'   => 'checkbox',
				'fields' => array(
					self::generate_text_settings(
						array(
							'label' => 'Text-color',
							'value' => '#000000',
						),
						array(
							'label'     => 'Font-size',
							'min'       => 0,
							'max'       => 100,
							'step'      => 1,
							'value'     => 14,
							'dimension' => 'px',
						),
						array(
							'label'     => 'Letter-spacing',
							'min'       => 0,
							'max'       => 100,
							'step'      => 1,
							'value'     => 0,
							'dimension' => 'px',
						),
						array(
							'blur'        => array(
								'min'       => 0,
								'max'       => 20,
								'step'      => 1,
								'value'     => 0,
								'dimension' => 'px',
							),
							'opacity'     => array(
								'min'       => 0,
								'max'       => 1,
								'step'      => 0.01,
								'value'     => 0,
								'dimension' => 'px',
							),
							'shift_right' => array(
								'min'       => -40,
								'max'       => 40,
								'step'      => 1,
								'value'     => 0,
								'dimension' => 'px',
							),
							'shift_down'  => array(
								'min'       => -40,
								'max'       => 40,
								'step'      => 1,
								'value'     => 0,
								'dimension' => 'px',
							),
							'color'       => '#ffffff',
						),
						array(
							'value' => '400',
						),
						array(
							'value' => 'normal',
						)
					),
					self::generate_single_color( 'Border-color', 'b_color', '#bdc9ca' ),
					self::generate_single_color( 'Background-color', 'bg_color', '#fff' ),
					self::generate_single_color( 'Checkbox-Checked-color', 'checkedColor', '#00b163' ),
					self::generate_single_color( 'Checkbox-color', 'checkbox_color', '#fff' ),
				),
			),

			'range-button'  => array(
				'name'   => 'range-button',
				'fields' => array(
					self::generate_single_color( 'Range-color', 'fColor', '#ccc' ),
					self::generate_single_color( 'Ranged-color', 'lineColor', '#00b163' ),
					self::generate_single_color( 'Circle-color', 'circleColor', '#00b163' ),
				),
			),

			'toggle'        => array(
				'name'   => 'toggle',
				'fields' => array(
					self::generate_text_settings(
						array(
							'label' => 'Text-color',
							'value' => '#000000',
						),
						array(
							'label'     => 'Font-size',
							'min'       => 0,
							'max'       => 100,
							'step'      => 1,
							'value'     => 14,
							'dimension' => 'px',
						),
						array(
							'label'     => 'Letter-spacing',
							'min'       => 0,
							'max'       => 100,
							'step'      => 1,
							'value'     => 0,
							'dimension' => 'px',
						),
						array(
							'blur'        => array(
								'min'       => 0,
								'max'       => 20,
								'step'      => 1,
								'value'     => 0,
								'dimension' => 'px',
							),
							'opacity'     => array(
								'min'       => 0,
								'max'       => 1,
								'step'      => 0.01,
								'value'     => 0,
								'dimension' => 'px',
							),
							'shift_right' => array(
								'min'       => -40,
								'max'       => 40,
								'step'      => 1,
								'value'     => 0,
								'dimension' => 'px',
							),
							'shift_down'  => array(
								'min'       => -40,
								'max'       => 40,
								'step'      => 1,
								'value'     => 0,
								'dimension' => 'px',
							),
							'color'       => '#ffffff',
						),
						array(
							'value' => '400',
						),
						array(
							'value' => 'normal',
						)
					),
					self::generate_single_color( 'Circle-color', 'circleColor', '#ffff' ),
					self::generate_single_color( 'Background-color', 'bg_color', '#ccc' ),
					self::generate_single_color( 'Background-checked-color', 'checkedColor', '#00b163' ),
				),
			),

			'text-area'     => array(
				'name'   => 'text-area',
				'fields' => array(
					self::generate_text_settings(
						array(
							'label' => 'Text-color',
							'value' => '#000000',
						),
						array(
							'label'     => 'Font-size',
							'min'       => 0,
							'max'       => 100,
							'step'      => 1,
							'value'     => 16,
							'dimension' => 'px',
						),
						array(
							'label'     => 'Letter-spacing',
							'min'       => 0,
							'max'       => 100,
							'step'      => 1,
							'value'     => 0,
							'dimension' => 'px',
						),
						array(
							'blur'        => array(
								'min'       => 0,
								'max'       => 20,
								'step'      => 1,
								'value'     => 0,
								'dimension' => 'px',
							),
							'opacity'     => array(
								'min'       => 0,
								'max'       => 1,
								'step'      => 0.01,
								'value'     => 0,
								'dimension' => 'px',
							),
							'shift_right' => array(
								'min'       => -40,
								'max'       => 40,
								'step'      => 1,
								'value'     => 0,
								'dimension' => 'px',
							),
							'shift_down'  => array(
								'min'       => -40,
								'max'       => 40,
								'step'      => 1,
								'value'     => 0,
								'dimension' => 'px',
							),
							'color'       => '#ffffff',
						),
						array(
							'value' => '400',
						),
						array(
							'value' => 'normal',
						)
					),
					self::generate_width( 'Width', 'width', 0, 100, 1, 100, '%' ),
					self::generate_bg_color( 'Background-color', 'background-color', '#fff', '#fff', '#fff' ),
					self::generate_border( 0, 100, 1, 1, 1, 1, 1, 1, 1, '#d0d0d0', 'px' ),
					self::generate_border_radius( 0, 100, 1, 0, 0, 0, 0, 0, null, null, 'px' ),
					self::generate_indentations( 'Margin', 'margin', '0px', '0px', '0px', '0px' ),
					self::generate_indentations( 'Padding', 'padding', '10px', '10px', '10px', '10px' ),
					self::generate_effects(
						array(
							'name'        => 'text-area-active-effects',
							'label'       => 'Active-effects',
							'data'        => array(
								array(
									'label'   => 'Background-color',
									'name'    => 'background-color',
									'type'    => 'effects',
									'default' => '#fff',
									'value'   => '#fff',

								),
								array(
									'label'   => 'Border-color',
									'name'    => 'border-color',
									'type'    => 'effects',
									'default' => '#00b163',
									'value'   => '#00b163',

								),
								array(
									'label'   => 'Font-color',
									'name'    => 'font-color',
									'type'    => 'effects',
									'default' => '#000',
									'value'   => '#000',
								),
							),
							'effect_type' => 'active',
						)
					),
				),
			),

			'hr-line'       => array(
				'name'   => 'hr-line',
				'fields' => array(
					self::generate_single_color( 'Color', 'border-bottom-color', '#bdc9ca' ),
					self::generate_indentations( 'Margin', 'margin', '0px', '0px', '0px', '0px' ),
					self::generate_indentations( 'Padding', 'padding', '0px', '0px', '0px', '0px' ),
				),
			),

			'date-picker'   => array(
				'name'   => 'date-picker',
				'fields' => array(
					self::generate_text_settings(
						array(
							'label' => 'Text-color',
							'value' => '#333',
						),
						array(
							'label'     => 'Font-size',
							'min'       => 0,
							'max'       => 100,
							'step'      => 1,
							'value'     => 14,
							'dimension' => 'px',
						),
						array(
							'label'     => 'Letter-spacing',
							'min'       => 0,
							'max'       => 100,
							'step'      => 1,
							'value'     => 0,
							'dimension' => 'px',
						),
						array(
							'blur'        => array(
								'min'       => 0,
								'max'       => 20,
								'step'      => 1,
								'value'     => 0,
								'dimension' => 'px',
							),
							'opacity'     => array(
								'min'       => 0,
								'max'       => 1,
								'step'      => 0.01,
								'value'     => 0,
								'dimension' => 'px',
							),
							'shift_right' => array(
								'min'       => -40,
								'max'       => 40,
								'step'      => 1,
								'value'     => 0,
								'dimension' => 'px',
							),
							'shift_down'  => array(
								'min'       => -40,
								'max'       => 40,
								'step'      => 1,
								'value'     => 0,
								'dimension' => 'px',
							),
							'color'       => '#000000',
						),
						array(
							'value' => '400',
						),
						array(
							'value' => 'normal',
						),
						array(
							'name'  => 'text-align',
							'value' => '',
						)
					),
					self::generate_border( 0, 100, 1, 1, 1, 1, 1, 1, '1', '#ccc', 'px' ),
					self::generate_border_radius( 0, 100, 1, 4, 4, 4, 4, 4, null, null, 'px' ),
					self::generate_width( __( 'Width', 'cost-calculator-builder' ), 'width', 0, 100, 1, 100, '%' ),
					self::generate_single_color( __( 'Main Color', 'cost-calculator-builder' ), 'main_color', '#00b163' ),
					self::generate_single_color( __( 'Highlight Color', 'cost-calculator-builder' ), 'highlight_color', '#ffc000' ),
					self::generate_single_color( __( 'Calendar background color', 'cost-calculator-builder' ), 'calendar_bg_color', '#fff' ),
					self::generate_single_color( __( 'Days Background Color', 'cost-calculator-builder' ), 'day_bg_color', '#f0f8f8' ),
					self::generate_single_color( __( 'Active Days Background Color', 'cost-calculator-builder' ), 'highlight_bg_color', '#ffffff' ),
					self::generate_indentations( __( 'Margin', 'cost-calculator-builder' ), 'margin', '0px', '0px', '8px', '0px' ),
					self::generate_indentations( __( 'Padding', 'cost-calculator-builder' ), 'padding', '20px', '40px', '20px', '40px' ),
				),
			),

			'file-upload'   => array(
				'name'   => 'file-upload',
				'fields' => array(
					self::generate_single_color( __( 'Background color for uploaded file name', 'cost-calculator-builder' ), 'file_name_bg_color', '#73c73b33' ),
				),
			),
		);

		return $data;
	}

	public static function generate_single_color( $label, $name, $color ) {
		return array(
			'label'   => $label,
			'name'    => $name,
			'type'    => 'single-color',
			'value'   => $color,
			'default' => $color,
		);
	}

	public static function generate_bg_color( $label, $name, $default_1, $default_2, $default_3, $alias = '' ) {
		if ( empty( $_name ) ) {
			$alias = $name;
		}

		return array(
			'label'    => $label,
			'name'     => $name,
			'alias'    => $alias,
			'default'  => 'solid',
			'type'     => 'background-color',
			'solid'    => array(
				'label'   => $label,
				'value'   => $default_1,
				'default' => $default_1,
				'alias'   => 'backgroundColor',
			),
			'gradient' => array(
				array(
					'label'   => 'Gradient From',
					'value'   => $default_2,
					'default' => $default_2,
					'alias'   => 'backgroundImage',
				),
				array(
					'label'   => 'Gradient To',
					'value'   => $default_3,
					'default' => $default_3,
					'alias'   => 'backgroundImage',
				),
			),
		);
	}

	public static function generate_border( $min, $max, $step, $g_v, $t_l, $t_r, $b_l, $b_r, $width, $color, $dimension, $name = null, $label = null ) {
		return array(
			'label'     => null === $label ? 'Border' : $label,
			'type'      => 'border',
			'name'      => null === $name ? 'border' : $name,
			'default'   => array(
				'label' => 'All Corners Width',
				'value' => $g_v,
				'min'   => $min,
				'max'   => $max,
				'step'  => $step,
				'width' => array(
					'value'   => $width,
					'label'   => 'Border Width',
					'name'    => 'border-width',
					'options' => array(
						'top_left'     => array(
							'value' => $t_l,
							'label' => 'Top',
						),
						'top_right'    => array(
							'value' => $t_r,
							'label' => 'Right',
						),
						'bottom_left'  => array(
							'value' => $b_l,
							'label' => 'Bottom',
						),
						'bottom_right' => array(
							'value' => $b_r,
							'label' => 'Left',
						),
					),
				),
				'style' => array(
					'value'   => 'solid',
					'name'    => 'border-style',
					'label'   => 'Border Style',
					'options' => array( 'solid', 'dotted', 'dashed', 'double', 'groove', 'ridge', 'inset', 'outset', 'inherit', 'hidden', 'none' ),
				),
				'color' => array(
					'label'   => 'Border Color',
					'name'    => 'border-color',
					'value'   => $color,
					'default' => $color,
				),
			),
			'dimension' => $dimension,
		);
	}

	public static function generate_border_radius( $min, $max, $step, $g_v, $t_l, $t_r, $b_l, $b_r, $width, $color, $dimension, $name = null, $label = null ) {
		return array(
			'label'     => null === $label ? 'Border-radius' : $label,
			'type'      => 'border-radius',
			'name'      => null === $name ? 'border-radius' : $name,
			'default'   => array(
				'label'  => 'All Corners Radius',
				'value'  => $g_v,
				'min'    => $min,
				'max'    => $max,
				'step'   => $step,
				'radius' => array(
					'value'   => $width,
					'label'   => 'Border Radius',
					'name'    => 'border-radius',
					'options' => array(
						'top_left'     => array(
							'value' => $t_l,
							'label' => 'Top Left',
						),
						'top_right'    => array(
							'value' => $t_r,
							'label' => 'Top Right',
						),
						'bottom_left'  => array(
							'value' => $b_l,
							'label' => 'Bottom Left',
						),
						'bottom_right' => array(
							'value' => $b_r,
							'label' => 'Bottom Right',
						),
					),
				),
			),
			'dimension' => $dimension,
		);
	}

	public static function generate_width( $label, $name, $min, $max, $step, $value, $dimension ) {
		return array(
			'name'      => $name,
			'label'     => $label,
			'type'      => 'width',
			'dimension' => $dimension,
			'default'   => array(
				'min'   => $min,
				'max'   => $max,
				'step'  => $step,
				'value' => $value,
			),
		);
	}

	public static function generate_text_color( $label, $default ) {
		return array(
			'label'   => $label,
			'name'    => 'color',
			'type'    => 'text-color',
			'default' => $default,
			'value'   => '',
		);
	}

	public static function generate_text_settings( $text_color, $font_size, $letter_spacing, $text_shadow, $font_weight, $font_style, $position = array(
		'name'  => 'text-align',
		'value' => 'left',
	) ) {
		return array(
			'label'       => 'Font settings',
			'name'        => 'text-settings',
			'type'        => 'text-settings',
			'color'       => self::generate_text_color( $text_color['label'], $text_color['value'] ),
			'drop_down'   => array(
				'font_wight' => array(
					'name'    => 'font-weight',
					'value'   => $font_weight['value'],
					'label'   => 'Font-Weight',
					'options' => array( 'inherit', '100', '200', '300', '400', '500', '600', '700', '800', '900', 'bold', 'bolder' ),
				),
				'font_style' => array(
					'name'    => 'font-style',
					'value'   => $font_style['value'],
					'label'   => 'Font-Style',
					'options' => array( 'inherit', 'normal', 'italic', 'oblique', 'inherit' ),
				),
				'position'   => array(
					'name'    => $position['name'],
					'label'   => 'Text position',
					'value'   => $position['value'],
					'options' => array( 'left', 'center', 'right' ),
				),
			),

			'range'       => array(
				'font_size'      => self::generate_width( $font_size['label'], 'font-size', $font_size['min'], $font_size['max'], $font_size['step'], $font_size['value'], $font_size['dimension'] ),
				'letter_spacing' => self::generate_width( $letter_spacing['label'], 'letter-spacing', $letter_spacing['min'], $letter_spacing['max'], $letter_spacing['step'], $letter_spacing['value'], $letter_spacing['dimension'] ),
			),

			'text_shadow' => array(
				'label'   => 'Text Shadow',
				'name'    => 'text-shadow',
				'options' => array(
					'shift_right' => array(
						'label'     => 'Shift Right',
						'min'       => $text_shadow['shift_right']['min'],
						'max'       => $text_shadow['shift_right']['max'],
						'step'      => $text_shadow['shift_right']['step'],
						'value'     => $text_shadow['shift_right']['value'],
						'dimension' => $text_shadow['shift_right']['dimension'],
					),
					'shift_down'  => array(
						'label'     => 'Shift Down',
						'min'       => $text_shadow['shift_down']['min'],
						'max'       => $text_shadow['shift_down']['max'],
						'step'      => $text_shadow['shift_down']['step'],
						'value'     => $text_shadow['shift_down']['value'],
						'dimension' => $text_shadow['shift_down']['dimension'],
					),
					'blur'        => array(
						'label'     => 'Blur',
						'min'       => $text_shadow['blur']['min'],
						'max'       => $text_shadow['blur']['max'],
						'step'      => $text_shadow['blur']['step'],
						'value'     => $text_shadow['blur']['value'],
						'dimension' => $text_shadow['blur']['dimension'],
					),
				),

				'opacity' => array(
					'label' => 'Opacity',
					'min'   => $text_shadow['opacity']['min'],
					'max'   => $text_shadow['opacity']['max'],
					'step'  => $text_shadow['opacity']['step'],
					'value' => $text_shadow['opacity']['value'],
				),

				'color'   => array(
					'name'    => 'color',
					'label'   => 'Color',
					'value'   => $text_shadow['color'],
					'default' => $text_shadow['color'],
				),
			),
		);
	}

	/**
	 * @param $args array
	 * @return array
	 */
	public static function generate_effects( $args ) {
		return array(
			'label'   => $args['label'],
			'name'    => $args['name'],
			'default' => 'solid',
			'effect'  => $args['effect_type'],
			'type'    => 'effects',
			'data'    => $args['data'],
		);
	}

	public static function generate_focus_effects() {

	}

	public static function generate_indentations( $label, $name, $t_l, $t_r, $b_l, $b_r ) {
		return array(
			'label'   => $label,
			'name'    => $name,
			'type'    => 'indentation',
			'default' => array(
				'label'   => 'All Corners',
				'options' => array(
					'top_left'     => array(
						'label' => 'Top',
						'value' => $t_l,
					),
					'top_right'    => array(
						'label' => 'Right',
						'value' => $t_r,
					),
					'bottom_left'  => array(
						'label' => 'Bottom',
						'value' => $b_l,
					),
					'bottom_right' => array(
						'label' => 'Left',
						'value' => $b_r,
					),
				),
			),
		);
	}

	public static function generate_box_shadow( $args ) {
		return array(
			'label'   => 'box-shadow',
			'type'    => 'box-shadow',
			'name'    => 'box-shadow',
			'range'   => array(
				'vertical_length'   => array(
					'label'     => 'Vertical Length',
					'min'       => $args['vertical_length']['min'],
					'max'       => $args['vertical_length']['max'],
					'step'      => $args['vertical_length']['step'],
					'value'     => $args['vertical_length']['value'],
					'dimension' => $args['vertical_length']['dimension'],
				),
				'horizontal_length' => array(
					'label'     => 'Horizontal Length',
					'min'       => $args['horizontal_length']['min'],
					'max'       => $args['horizontal_length']['max'],
					'step'      => $args['horizontal_length']['step'],
					'value'     => $args['horizontal_length']['value'],
					'dimension' => $args['horizontal_length']['dimension'],
				),
				'blur_radius'       => array(
					'label'     => 'Blur Radius',
					'min'       => $args['blur_radius']['min'],
					'max'       => $args['blur_radius']['max'],
					'step'      => $args['blur_radius']['step'],
					'value'     => $args['blur_radius']['value'],
					'dimension' => $args['blur_radius']['dimension'],
				),
				'spread_radius'     => array(
					'label'     => 'Spread Radius',
					'min'       => $args['spread_radius']['min'],
					'max'       => $args['spread_radius']['max'],
					'step'      => $args['spread_radius']['step'],
					'value'     => $args['spread_radius']['value'],
					'dimension' => $args['spread_radius']['dimension'],
				),
			),

			'opacity' => array(
				'label'     => 'Opacity',
				'min'       => $args['opacity']['min'],
				'max'       => $args['opacity']['max'],
				'step'      => $args['opacity']['step'],
				'value'     => $args['opacity']['value'],
				'dimension' => $args['opacity']['dimension'],
			),

			'color'   => array(
				'shadow_color' => array(
					'label'   => 'Shadow Color',
					'value'   => '#542554',
					'default' => $args['shadow_color']['color'],
				),
			),

			'line'    => array(
				'value'   => '',
				'options' => array(
					'outline' => array(
						'label' => 'Outline',
						'value' => 'outline',
					),
					'inset'   => array(
						'label' => 'Inset',
						'value' => 'inset',
					),
				),
			),
		);
	}

	public static function container_box_shadow() {
		return array(
			'vertical_length'   => array(
				'min'       => -200,
				'max'       => 200,
				'step'      => 1,
				'value'     => 0,
				'dimension' => 'px',
			),

			'horizontal_length' => array(
				'min'       => -200,
				'max'       => 200,
				'step'      => 1,
				'value'     => 0,
				'dimension' => 'px',
			),

			'blur_radius'       => array(
				'min'       => 0,
				'max'       => 300,
				'step'      => 1,
				'value'     => 0,
				'dimension' => 'px',
			),

			'spread_radius'     => array(
				'min'       => -200,
				'max'       => 200,
				'step'      => 1,
				'value'     => 0,
				'dimension' => 'px',
			),

			'opacity'           => array(
				'min'       => 0,
				'max'       => 1,
				'step'      => 0.01,
				'value'     => 0,
				'dimension' => '',
			),

			'shadow_color'      => array(
				'color' => '#ffffff',
			),
		);
	}

	public static function custom_default_styles() {
		$data = array(
			'v-container'   => array(
				'width'            => '47.5%',
				'margin'           => '0px 0px 0px 0px',
				'padding'          => '50px 50px 50px 50px',
				'box-shadow'       => '0px 0px 0px 0px rgba(255,255,255,0)',
				'border-width'     => '0px 0px 0px 0px',
				'border-style'     => 'solid',
				'border-color'     => '#ffffff',
				'border-radius'    => '10px 10px 10px 10px',
				'background-color' => '#eff4f4',
				'background-image' => '',
			),

			'h-container'   => array(
				'width'            => '100%',
				'margin'           => '0px 0px 0px 0px',
				'padding'          => '50px 50px 50px 50px',
				'box-shadow'       => '0px 0px 0px 0px rgba(255,255,255,0)',
				'border-width'     => '0px 0px 0px 0px',
				'border-style'     => 'solid',
				'border-color'     => '#ffffff',
				'border-radius'    => '10px 10px 10px 10px',
				'background-color' => '#eff4f4',
				'background-image' => '',
			),

			'headers'       => array(
				'color'          => '#000000',
				'font-size'      => '22px',
				'font-style'     => 'normal',
				'text-align'     => ' ',
				'font-weight'    => '700',
				'text-shadow'    => '0px 0px 0px rgba(255,255,255,0)',
				'letter-spacing' => '0px',
			),

			'labels'        => array(
				'color'          => '#000000',
				'margin'         => '0px 0px 8px 0px',
				'padding'        => '0px 0px 0px 0px',
				'font-size'      => '14px',
				'text-align'     => 'left',
				'font-style'     => 'normal',
				'font-weight'    => '400',
				'text-shadow'    => '0px 0px 0px rgba(255,255,255,0)',
				'letter-spacing' => '0px',
			),

			'descriptions'  => array(
				'color'          => '#a29f9f',
				'margin'         => '3px 0px 3px 0px',
				'padding'        => '0px 0px 0px 0px',
				'font-size'      => '12px',
				'text-align'     => 'left',
				'font-style'     => 'normal',
				'font-weight'    => '400',
				'text-shadow'    => '0px 0px 0px rgba(255,255,255,0)',
				'letter-spacing' => '0px',
			),

			'total-summary' => array(
				'color'          => '#000000',
				'font-style'     => 'normal',
				'font-size'      => '16px',
				'text-align'     => 'left',
				'font-weight'    => '400',
				'text-shadow'    => '0px 0px 0px rgba(255,255,255,0)',
				'letter-spacing' => '0px',
			),

			'total'         => array(
				'color'          => '#000000',
				'font-size'      => '16px',
				'font-style'     => 'normal',
				'text-align'     => '',
				'font-weight'    => '700',
				'text-shadow'    => '0px 0px 0px rgba(255,255,255,0)',
				'letter-spacing' => '0px',
			),

			'drop-down'     => array(
				'color'            => '#000000',
				'margin'           => '0px 0px 0px 0px',
				'padding'          => '15px 20px 15px 20px',
				'font-size'        => '14px',
				'text-align-last'  => 'left',
				'box-shadow'       => '0px 0px 0px 0px rgba(255,255,255,0)',
				'font-style'       => 'normal',
				'font-weight'      => '400 ',
				'text-shadow'      => '0px 0px 0px rgba(255,255,255,0) ',
				'border-width'     => '1px 1px 1px 1px',
				'border-style'     => 'solid',
				'letter-spacing'   => '0px',
				'background-color' => '#fff',
			),

			'radio-button'  => array(
				'color'          => '#000000',
				'font-size'      => '14px',
				'text-align'     => 'left',
				'font-style'     => 'normal',
				'font-weight'    => '400 ',
				'text-shadow'    => '0px 0px 0px rgba(255,255,255,0)',
				'letter-spacing' => '0px',
				'radioColor'     => '#fff',
				'radioBorder'    => '#bdc9ca',
				'radioChecked'   => '#00b163',
			),

			'checkbox'      => array(
				'color'          => '#000000',
				'font-size'      => '14px',
				'text-align'     => 'left',
				'font-style'     => 'normal',
				'font-weight'    => '400 ',
				'text-shadow'    => '0px 0px 0px rgba(255,255,255,0)',
				'letter-spacing' => '0px',
				'b_color'        => '#bdc9ca',
				'bg_color'       => '#fff',
				'checkedColor'   => '#00b163',
				'checkbox_color' => '#fff',
			),

			'range-button'  => array(
				'fColor'      => '#ccc',
				'circleColor' => '#00b163',
				'lineColor'   => '#00b163',
			),

			'toggle'        => array(
				'color'          => '#000000',
				'font-size'      => '14px',
				'text-align'     => 'left',
				'font-style'     => 'normal',
				'font-weight'    => '400',
				'text-shadow'    => '0px 0px 0px rgba(255,255,255,0)',
				'letter-spacing' => '0px',
				'circleColor'    => '#ffff',
				'bg_color'       => '#ccc',
				'checkedColor'   => '#00b163',
			),

			'text-area'     => array(
				'color'            => '#000000',
				'width'            => '100%',
				'margin'           => '0px 0px 0px 0px',
				'padding'          => '10px 10px 10px 10px',
				'font-size'        => '14px',
				'text-align'       => 'left',
				'font-style'       => 'normal',
				'font-weight'      => '400 ',
				'text-shadow'      => '0px 0px 0px rgba(255,255,255,0)',
				'border-style'     => 'solid',
				'border-width'     => '1px 1px 1px 1px',
				'border-color'     => '#d0d0d0',
				'border-radius'    => '0px 0px 0px 0px',
				'letter-spacing'   => '0px',
				'background-color' => '#fff',
			),

			'hr-line'       => array(
				'margin'              => '0px 0px 0px 0px',
				'padding'             => '0px 0px 0px 0px',
				'border-bottom-color' => '#bdc9ca',
			),

			'buttons'       => array(
				'color'            => '#fff',
				'margin'           => '0px 0px 0px 0px',
				'padding'          => '20px 40px 20px 40px',
				'font-size'        => '13px',
				'font-style'       => 'normal ',
				'text-align'       => '',
				'font-weight'      => '400',
				'text-shadow'      => '0px 0px 0px rgba(255,255,255,0) ',
				'letter-spacing'   => '0px',
				'border-radius'    => '4px 4px 4px 4px',
				'border-width'     => '1px 1px 1px 1px',
				'border-style'     => 'solid',
				'border-color'     => '#00b163',
				'background-color' => '#00b163',
			),

			'input-fields'  => array(
				'color'            => '#000000',
				'width'            => '100%',
				'margin'           => '0px 0px 0px 0px',
				'padding'          => '17px 15px 17px 15px',
				'font-size'        => '14px',
				'text-align'       => 'left',
				'font-style'       => 'normal',
				'font-weight'      => '400',
				'text-shadow'      => '0px 0px 0px rgba(255,255,255,0)',
				'border-width'     => '1px 1px 1px 1px',
				'border-style'     => 'solid',
				'border-color'     => '#d0d0d0',
				'border-radius'    => '0px 0px 0px 0px',
				'letter-spacing'   => '0px',
				'background-color' => '#fff',
			),

			'date-picker'   => array(
				'color'              => '#333',
				'margin'             => '0px 0px 0px 0px',
				'padding'            => '20px 40px 20px 40px',
				'font-size'          => '14px',
				'font-style'         => 'normal ',
				'text-align'         => '',
				'font-weight'        => '400',
				'text-shadow'        => '0px 0px 0px rgba(255,255,255,0) ',
				'letter-spacing'     => '0px',
				'border-width'       => '1px 1px 1px 1px',
				'border-style'       => 'solid',
				'border-color'       => '#ccc',
				'border-radius'      => '4px 4px 4px 4px',
				'main_color'         => '#00b163',
				'calendar_bg_color'  => '#ffffff',
				'day_bg_color'       => '#f0f8f8',
				'highlight_color'    => '#ffc000',
				'highlight_bg_color' => '#ffffff',
			),

			'file-upload'   => array(
				'file_name_bg_color' => '#73c73b33',
			),
		);

		return $data;
	}
}
