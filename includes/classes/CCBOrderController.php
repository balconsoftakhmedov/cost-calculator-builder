<?php

namespace cBuilder\Classes;

use cBuilder\Classes\Database\Orders;
use cBuilder\Classes\Database\Payments;
use cBuilder\Helpers\CCBCleanHelper;

class CCBOrderController {

	public static $numAfterInteger = 2;
	protected static $errors       = array();

	/**
	 * Validation
	 * @param $data
	 */
	public static function validate( $data ) {
		if ( ! array_key_exists( 'id', $data ) || ! $data['id'] || empty( $data['id'] ) ) {
			self::$errors['id'] = __( 'No calculator id' );
		}
	}

	protected static function validateFile( $file, $field_id, $calc_id ) {
		if ( empty( $file ) ) {
			return false;
		}

		$calc_fields = get_post_meta( $calc_id, 'stm-fields', true );
		/** get file field settings */
		$file_field_index = array_search( $field_id, array_column( $calc_fields, 'alias' ), true );

		$extension       = pathinfo( $file['name'], PATHINFO_EXTENSION );
		$allowed_formats = array();
		foreach ( $calc_fields[ $file_field_index ]['fileFormats'] as $format ) {
			$allowed_formats = array_merge( $allowed_formats, explode( '/', $format ) );
		}

		/** check file extension */
		if ( ! in_array( $extension, $allowed_formats, true ) ) {
			return false;
		}

		/** check file size */
		if ( $calc_fields[ $file_field_index ]['max_file_size'] < round( $file['size'] / 1024 / 1024, 1 ) ) {
			return false;
		}

		return true;
	}


	public static function create() {
		check_ajax_referer( 'ccb_add_order', 'nonce' );

		/**  sanitize POST data  */
		$data = CCBCleanHelper::cleanData( (array) json_decode( stripslashes( $_POST['data'] ) ) );
		self::validate( $data );

		/**
		 *  if  order Id exist not create new one.
		 *  Used just for stripe if card error was found
		 **/
		if ( ! empty( $data['orderId'] ) ) {
			$order = Orders::get( 'id', $data['orderId'] );
			if ( null !== $order ) {
				wp_send_json_success(
					array(
						'status'   => 'success',
						'order_id' => $data['orderId'],
					)
				);
				die();
			}
		}

		if ( empty( self::$errors ) && 'POST' === $_SERVER['REQUEST_METHOD'] ) {

			$settings = get_option( 'stm_ccb_form_settings_' . $data['id'] );
			if ( array_key_exists( 'num_after_integer', $settings['currency'] ) ) {
				self::$numAfterInteger = (int) $settings['currency']['num_after_integer'];
			}

			/** upload files if exist */
			if ( is_array( $_FILES ) ) {

				if ( ! function_exists( 'wp_handle_upload' ) ) {
					require_once ABSPATH . 'wp-admin/includes/file.php';
				}

				$order_details = $data['orderDetails'];
				$file_url      = array();

				/** upload all files, create array for fields */
				foreach ( $_FILES as $file_key => $file ) {
					$field_id    = preg_replace( '/_ccb_.*/', '', $file_key );
					$field_index = array_search( $field_id, array_column( $order_details, 'alias' ), true );

					/** if field not found continue */
					if ( false === $field_index ) {
						continue;
					}

					/** validate file by settings */
					$is_valid = self::validateFile( $file, $field_id, $data['id'] );

					if ( ! $is_valid ) {
						continue;
					}

					if ( ! array_key_exists( $field_id, $file_url ) ) {
						$file_url[ $field_id ] = array();
					}

					$file_info = wp_handle_upload( $file, array( 'test_form' => false ) );
					if ( $file_info && empty( $file_info['error'] ) ) {
						array_push( $file_url[ $field_id ], $file_info );
					}
				}

				foreach ( $order_details as $field_key => $field ) {
					if ( preg_replace( '/_field_id.*/', '', $field['alias'] ) === 'file_upload' ) {
						$order_details[ $field_key ]['options'] = wp_json_encode( $file_url[ $field['alias'] ] );
					}
				}
				$data['orderDetails'] = $order_details;
			}

			$order_data = array(
				'calc_id'       => $data['id'],
				'calc_title'    => get_post_meta( $data['id'], 'stm-name', true ),
				'status'        => ! empty( $data['status'] ) ? $data['status'] : Orders::$pending,
				'order_details' => wp_json_encode( $data['orderDetails'] ),
				'form_details'  => wp_json_encode( $data['formDetails'] ),
				'created_at'    => wp_date( 'Y-m-d H:i:s' ),
				'updated_at'    => wp_date( 'Y-m-d H:i:s' ),
			);

			$total = number_format( (float) $data['total'], self::$numAfterInteger, '.', '' );

			$payment_data = array(
				'type'       => ! empty( $data['paymentMethod'] ) ? $data['paymentMethod'] : Payments::$defaultType,
				'currency'   => array_key_exists( 'currency', $settings['currency'] ) ? $settings['currency']['currency'] : null,
				'status'     => Payments::$defaultStatus,
				'total'      => $total,
				'created_at' => wp_date( 'Y-m-d H:i:s' ),
				'updated_at' => wp_date( 'Y-m-d H:i:s' ),
			);

			$id = Orders::create_order( $order_data, $payment_data );

			wp_send_json_success(
				array(
					'status'   => 'success',
					'order_id' => $id,
				)
			);
		}
	}

	public static function update() {
		check_ajax_referer( 'ccb_update_order', 'nonce' );

		if ( ! empty( $_POST['ids'] ) ) {
			$ids    = sanitize_text_field( $_POST['ids'] );
			$status = ! empty( $_POST['status'] ) ? sanitize_text_field( $_POST['status'] ) : null;

			$ids  = explode( ',', $ids );
			$d    = implode( ',', array_fill( 0, count( $ids ), '%d' ) );
			$args = $ids;
			array_unshift( $args, $status );

			try {
				Orders::update_orders( $d, $args );
				Payments::update_payment_status_by_order_ids( $ids, $status );

				wp_send_json(
					array(
						'status'  => 200,
						'message' => 'Success',
					)
				);
				throw new Exception( 'Error' );
			} catch ( Exception $e ) {
				header( 'Status: 500 Server Error' );
			}
		}
	}

	protected static function deleteOrdersFiles( $ids ) {

		$orders = Orders::get_by_ids( $ids );

		foreach ( $orders as $order ) {
			$details = json_decode( $order['order_details'] );
			foreach ( $details as $detail ) {
				if ( preg_replace( '/_field_id.*/', '', $detail->alias ) === 'file_upload' ) {
					$file_list      = json_decode( $detail->options );
					$file_path_list = array_column( $file_list, 'file' );
					array_walk(
						$file_path_list,
						function ( $path ) {
							wp_delete_file( $path );
						}
					);
				}
			}
		}
	}

	public static function delete() {
		check_ajax_referer( 'ccb_delete_order', 'nonce' );

		if ( ! current_user_can( 'manage_options' ) ) {
			return false;
		}

		$ids = ! empty( $_POST['ids'] ) ? sanitize_text_field( $_POST['ids'] ) : null;
		$ids = explode( ',', $ids );
		$d   = implode( ',', array_fill( 0, count( $ids ), '%d' ) );

		try {
			/** Delete order files if exist */
			self::deleteOrdersFiles( $ids );

			/** Delete orders */
			Orders::delete_orders( $d, $ids );
			Payments::delete_payments_by_order_ids( $ids );

			wp_send_json(
				array(
					'status'  => 200,
					'message' => 'success',
				)
			);
			throw new Exception( 'Error' );
		} catch ( Exception $e ) {
			header( 'Status: 500 Server Error' );
		}
	}

	public static function completeOrderById( $id ) {
		$id = sanitize_text_field( $id );

		try {
			Orders::complete_order_by_id( $id );
			wp_send_json(
				array(
					'status'  => 200,
					'message' => 'Success',
				)
			);
			throw new Exception( 'Error' );
		} catch ( Exception $e ) {
			header( 'Status: 500 Server Error' );
		}
	}

	public static function orders() {
		check_ajax_referer( 'ccb_orders', 'nonce' );

		$calc_list = CCBCalculators::get_calculator_list();

		$calc_id_list = array_map(
			function ( $item ) {
				return $item['id'];
			},
			$calc_list['existing']
		);

		$calculators = Orders::existing_calcs();

		if ( empty( $calculators ) ) {
			wp_send_json(
				array(
					'data'        => array(),
					'total_count' => 0,
					'calc_list'   => $calculators,
				)
			);
			exit();
		}

		$default_payment_types  = '';
		$default_payment_status = array();
		$default_calc_ids       = array_map(
			function ( $cal ) {
				return $cal['calc_id'];
			},
			$calculators
		);

		if ( ! empty( $_GET['status'] ) && 'all' !== $_GET['status'] ) {
			$default_payment_status = sanitize_text_field( $_GET['status'] );
		}

		if ( ! empty( $_GET['calc_id'] ) && 'all' !== $_GET['calc_id'] ) {
			$default_calc_ids = (int) $_GET['calc_id'];
		}

		if ( ! empty( $_GET['payment'] ) && 'all' !== $_GET['payment'] ) {
			$default_payment_types = sanitize_text_field( $_GET['payment'] );
		}

		$page     = ! empty( $_GET['page'] ) ? (int) sanitize_text_field( $_GET['page'] ) : 1;
		$limit    = ! empty( $_GET['limit'] ) ? sanitize_text_field( $_GET['limit'] ) : 5;
		$order_by = ! empty( $_GET['sortBy'] ) ? sanitize_sql_orderby( $_GET['sortBy'] ) : sanitize_sql_orderby( 'total' );
		$sorting  = ! empty( $_GET['direction'] ) ? sanitize_sql_orderby( strtoupper( $_GET['direction'] ) ) : sanitize_sql_orderby( 'ASC' );
		$offset   = 1 === $page ? 0 : ( $page - 1 ) * $limit;

		$total = Orders::get_total_orders( $default_calc_ids, $default_payment_types, $default_payment_status );

		try {
			$orders = Orders::get_all_orders(
				array(
					'payment_method' => $default_payment_types,
					'payment_status' => $default_payment_status,
					'calc_ids'       => $default_calc_ids,
					'orderBy'        => $order_by,
					'sorting'        => $sorting,
					'limit'          => (int) $limit,
					'offset'         => (int) $offset,
				)
			);

			$result = array();
			foreach ( $orders as $order ) {
				$form_details          = json_decode( $order['form_details'] )->fields;
				$order['calc_deleted'] = false;

				if ( ! in_array( $order['calc_id'], $calc_id_list ) ) { //phpcs:ignore
					$order['calc_deleted'] = true;
				}

				foreach ( $form_details as $detail ) {
					if ( 'email' === $detail->name || 'your-email' === $detail->name ) {
						$order['user_email'] = $detail->value;
					}
				}

				$order['order_details'] = json_decode( $order['order_details'] );
				$order['order_details'] = array_map(
					function( $detail ) {
						if ( preg_replace( '/_field_id.*/', '', $detail->alias ) === 'file_upload' ) {
							$detail->options = json_decode( $detail->options );
						}
						return $detail;
					},
					$order['order_details']
				);

				$order['decimal_separator']   = '';
				$order['thousands_separator'] = '';
				$order['num_after_integer']   = '';

				$order['wc_link']           = '';
				$order['paymentMethodType'] = 'No Payment';

				if ( 'stripe' === $order['paymentMethod'] ) {
					$order['paymentMethodType'] = '<img class="ccb-logo ccb-logo-stripe" src="' . esc_url( CALC_URL . '/frontend/dist/img/stripe.svg' ) . '">';
				}

				if ( 'paypal' === $order['paymentMethod'] ) {
					$order['paymentMethodType'] = '<img class="ccb-logo ccb-logo-paypal" src="' . esc_url( CALC_URL . '/frontend/dist/img/paypal.svg' ) . '">';
				}

				if ( 'woocommerce' === $order['paymentMethod'] && ! empty( $order['transaction'] ) ) {
					$order['wc_link'] = get_edit_post_link( $order['transaction'] );
				}

				$settings = get_option( 'stm_ccb_form_settings_' . $order['calc_id'] );
				if ( array_key_exists( 'decimal_separator', $settings['currency'] ) ) {
					$order['decimal_separator'] = $settings['currency']['decimal_separator'];
				}
				if ( array_key_exists( 'thousands_separator', $settings['currency'] ) ) {
					$order['thousands_separator'] = $settings['currency']['thousands_separator'];
				}
				if ( array_key_exists( 'num_after_integer', $settings['currency'] ) ) {
					$order['num_after_integer'] = $settings['currency']['num_after_integer'];
				}

				$order['date_formatted'] = wp_date( get_option( 'date_format' ) . ' - ' . get_option( 'time_format' ), strtotime( $order['created_at'] ) );

				$order['form_details'] = json_decode( $order['form_details'] );
				$result[]              = $order;

			}

			wp_send_json(
				array(
					'data'        => $result,
					'total_count' => $total,
					'calc_list'   => $calculators,
				)
			);

			throw new Exception( 'Error' );
		} catch ( Exception $e ) {
			header( 'Status: 500 Server Error' );
		}
	}
}
