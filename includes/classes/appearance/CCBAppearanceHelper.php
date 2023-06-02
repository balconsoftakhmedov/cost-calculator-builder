<?php

namespace cBuilder\Classes\Appearance;

use cBuilder\Classes\Appearance\Presets\CCBPresets;

/**
 * Class CCBAppearanceHelper
 * @package cBuilder\Classes\Appearance
 */

class CCBAppearanceHelper {
	/**
	 * @param $preset_key
	 * @return array
	 */
	public static function get_appearance_data( $preset_key ): array {
		$preset = new CCBPresets( $preset_key );
		return array(
			'list' => $preset->calc_presets_list(),
			'data' => $preset->calc_preset_data(),
		);
	}
}
