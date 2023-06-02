<?php

namespace cBuilder\Helpers;

/**
 * CCB Clean Helper
 */
class CCBCleanHelper {

	/**
	 * @param array $data
	 * @return array|null[]
	 */
	public static function cleanData( array $data ) {

		foreach ( $data as $key => $value ) {
			if ( 'object' === gettype( $value ) || 'array' === gettype( $value ) ) {
				$data[ $key ] = self::cleanData( (array) $value );
			} elseif ( 'null' === $value ) {
				$data[ $key ] = null;
			} else {
				$data[ $key ] = sanitize_text_field( $value );
			}
		}

		return $data;
	}

	protected static function custom_sanitize_json( string $json ) {
		return json_decode( stripslashes( $json ), true );
	}
}
