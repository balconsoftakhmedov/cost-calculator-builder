<?php

namespace cBuilder\Classes\Appearance\Presets;

/**
 * Class CCBPresets
 * @package cBuilder\Classes\Appearance\Presets
 */
class CCBPresets {
	private $field;

	/**
	 * CCBPresets constructor.
	 * @param mixed $preset_key
	 */
	public function __construct( $preset_key ) {
		$this->field = new CCBPresetGenerator( $preset_key );
	}

	/**
	 * @return array[]
	 */
	public function calc_preset_data(): array {
		return array(
			'desktop' => $this->field->generate_desktop_data(),
			'mobile'  => $this->field->generate_mobile_data(),
		);
	}

	/**
	 * @return array
	 */
	public function calc_presets_list(): array {
		$result  = array();
		$presets = $this->field->get_preset_from_db();

		foreach ( $presets as $preset ) {
			if ( ! empty( $preset['desktop'] ) ) {
				$desktop_colors = $preset['desktop']['colors'];
				$result[]       = array(
					'top_left'     => $desktop_colors['container'],
					'top_right'    => $desktop_colors['primary_color'],
					'bottom_left'  => $desktop_colors['secondary_color'],
					'bottom_right' => $desktop_colors['accent_color'],
				);
			}
		}

		return $result;
	}
}
