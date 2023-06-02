<?php

namespace cBuilder\Classes;

class CCBAjaxCallbacks {

	public static function register_calc_hooks() {
		add_action( 'ccb_custom_importer', array( self::class, 'ccb_custom_importer' ) );
	}

	/**
	 * This function needs to be called after loading the plugin
	 *
	 * @param $file_name
	 *
	 * @return void|boolean
	 */
	public static function ccb_custom_importer( $file_name ) {

		if ( ! file_exists( $file_name ) && ! function_exists( 'is_user_logged_in' ) ) {
			return false;
		}

		$contents    = file_get_contents( $file_name ); // phpcs:ignore
		$calculators = json_decode( $contents, true );

		if ( is_array( $calculators ) ) {
			foreach ( $calculators as $calculator ) {
				$my_post = array(
					'post_type'   => 'cost-calc',
					'post_status' => 'publish',
				);
				// get id
				$id = wp_insert_post( $my_post );

				$data = array(
					'id'         => $id,
					'title'      => isset( $calculator['stm-name'] ) ? $calculator['stm-name'] : '',
					'formula'    => isset( $calculator['stm-formula'] ) ? $calculator['stm-formula'] : array(),
					'settings'   => isset( $calculator['stm_ccb_form_settings'] ) ? $calculator['stm_ccb_form_settings'] : array(),
					'builder'    => isset( $calculator['stm-fields'] ) ? $calculator['stm-fields'] : array(),
					'conditions' => isset( $calculator['stm-conditions'] ) ? $calculator['stm-conditions'] : array(),
					'appearance' => isset( $calculator['ccb-appearance'] ) ? $calculator['ccb-appearance'] : array(),
				);

				ccb_update_calc_values( $data );
			}
		}
	}
}
