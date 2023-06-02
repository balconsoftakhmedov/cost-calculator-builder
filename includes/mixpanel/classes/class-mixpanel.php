<?php

namespace CCB\Includes;

class Mixpanel {
	private $token = 'YmQ5YzY3Njk5YzY3MmQwNDFmYzUzZTllMDAwNjk0ZDg=';

	private $url = 'https://api.mixpanel.com/engage';

	protected $classes = array();

	protected static $data = array();

	public static $calculators_id = array();

	public function __construct( $classes = array() ) {
		$this->classes = $classes;
		Mixpanel_Single_Calculator::prepare_ids();
	}

	public static function prepare_ids() {
		self::$calculators_id = array_column( \cBuilder\Classes\CCBUpdatesCallbacks::get_calculators(), 'ID' );
	}

	public static function array_flatten( $array ) {
		if ( ! is_array( $array ) ) {
			return false;
		}
		$result = array();
		foreach ( $array as $key => $value ) {
			if ( is_array( $value ) ) {
				$result = array_merge( $result, self::array_flatten( $value ) );
			} else {
				$result[ $key ] = $value;
			}
		}

		return $result;
	}

	public static function array_diff_multi( $array1, $array2 ) {
		$result = array();

		foreach ( $array1 as $key => $val ) {
			if ( is_array( $val ) && isset( $array2[ $key ] ) ) {
				$tmp = self::array_diff_multi( $val, $array2[ $key ] );
				if ( $tmp ) {
					$result[ $key ] = $tmp;
				}
			} elseif ( ! isset( $array2[ $key ] ) ) {
				$result[ $key ] = null;
			} elseif ( $val !== $array2[ $key ] ) {
				$result[ $key ] = $array2[ $key ];
			}

			if ( isset( $array2[ $key ] ) ) {
				unset( $array2[ $key ] );
			}
		}

		$result = array_merge( $result, $array2 );

		return $result;
	}

	public static function is_dev( $domain ) {
		$devs = array( '.loc', '.local', 'stylemix', 'localhost', 'stm' );
		foreach ( $devs as $dev ) {
			if ( false !== stripos( $domain, $dev ) ) {
				return true;
			}
		}
		return false;
	}

	public static function add_data( $key, $data ) {
		self::$data[ $key ] = $data;
	}

	public function collect_data() {
		foreach ( $this->classes as $class ) {
			call_user_func( array( $class, 'register_data' ) );
		}
	}

	public function execute() {
		$this->collect_data();
		if ( ! empty( self::$data ) && true !== self::is_dev( home_url() ) ) {
			$args = array(
				'method'  => 'POST',
				'headers' => array(
					'accept'       => 'text/plain',
					'content-type' => 'application/json',
				),
				'body'    => wp_json_encode(
					array(
						array(
							'$token'       => base64_decode( $this->token ), // phpcs:ignore
							'$distinct_id' => home_url(),
							'$set'         => self::$data,
						),
					),
				),
			);
			wp_remote_post( $this->url, $args );
		}
	}
}
