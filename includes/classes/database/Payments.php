<?php

namespace cBuilder\Classes\Database;

use cBuilder\Classes\Vendor\DataBaseModel;

class Payments extends DataBaseModel {

	public static $defaultStatus  = 'pending';
	public static $completeStatus = 'complete';
	public static $rejectedStatus = 'rejected';
	public static $statusList     = array( 'pending', 'complete' );

	public static $defaultType = 'no_payments';
	public static $typeList    = array( 'paypal', 'stripe', 'no_payments' );

	/**
	 * Create Table
	 */
	public static function create_table() {
		global $wpdb;

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';

		$table_name  = self::_table();
		$primary_key = self::$primary_key;

		$sql = "CREATE TABLE IF NOT EXISTS  {$table_name} (
            `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
            `order_id` INT UNSIGNED NOT NULL,
            `type` ENUM('paypal', 'stripe', 'woocommerce', 'no_payments') NOT NULL DEFAULT 'no_payments',
            `currency` CHAR(20) NOT NULL DEFAULT '$',
            `status` ENUM('pending', 'cancelled', 'rejected', 'complete') NOT NULL DEFAULT 'pending',
            `total`   DOUBLE NOT NULL DEFAULT 0.00,
            `tax`       DECIMAL(10,2) DEFAULT 0.00,
            `transaction`     VARCHAR(255) DEFAULT NULL,
            `notes` longtext DEFAULT NULL,
            `created_at` DATETIME NOT NULL,
            `updated_at` DATETIME NOT NULL,
            `paid_at` DATETIME,
            PRIMARY KEY ({$primary_key}),
            INDEX `idx_order_id` (`order_id`),
            INDEX `idx_status` (`status`)
        ) {$wpdb->get_charset_collate()};";

		maybe_create_table( $table_name, $sql );
	}

	/**
	 * Update payments
	 */
	public static function update_payment_status_by_order_ids( $order_ids, $status = '' ) {
		global $wpdb;

		return $wpdb->query(
			$wpdb->prepare(
				'UPDATE `%1s` SET `status` = "%2s", `updated_at` = "%3s" WHERE order_id IN (%4s)', //phpcs:ignore
				self::_table(),
				$status,
				wp_date( 'Y-m-d H:i:s' ),
				implode( ',', $order_ids )
			)
		);
	}

	/**
	 * Delete payments
	 */
	public static function delete_payments_by_order_ids( $order_ids ) {
		global $wpdb;

		// delete staff connection
		if ( ! empty( $order_ids ) ) {
			return $wpdb->query( $wpdb->prepare( 'DELETE FROM `%1s` WHERE order_id IN (%s)', self::_table(), implode( ',', $order_ids ) ) ); //phpcs:ignore
		}
	}

	/**
	 * Create Payment
	 */
	public static function create_new_payment( $data, $order_id ) {

		$paymentType = ( $data['type'] && in_array( $data['type'], self::$typeList, true ) )
			? $data['type'] : self::$defaultType;

		$exist = self::payment_by_order_id_exist( $order_id );
		if ( empty( $exist ) ) {
			$payment_data = array(
				'order_id'   => $order_id,
				'type'       => $paymentType,
				'currency'   => ! isset( $data['currency'] ) ? '$' : $data['currency'],
				'status'     => self::$defaultStatus,
				'total'      => $data['total'],
				'created_at' => wp_date( 'Y-m-d H:i:s' ),
				'updated_at' => wp_date( 'Y-m-d H:i:s' ),
			);
			self::insert( $payment_data );
		}

		return $order_id;
	}

	/**
	 * Change Payment Status
	 * @param $id
	 * @param $payment_status
	 */
	public static function update_payment_status_by_order_id( $order_id, $payment_status ) {
		$data  = array( 'status' => $payment_status );
		$where = array( 'order_id' => $order_id );

		if ( self::$completeStatus == $payment_status ) { //phpcs:ignore
			$data['paid_at'] = wp_date( 'Y-m-d H:i:s' );
		}
		self::update( $data, $where );
	}

	/**
	 * Change Payment Status
	 * @param $id
	 * @param $payment_status
	 */
	public static function update_payment_total_by_order_id( $order_id, $total ) {
		$data  = array( 'total' => $total );
		$where = array( 'order_id' => $order_id );

		self::update( $data, $where );
	}

	public static function payment_by_order_id_exist( $order_id ) {
		return self::get( 'order_id', $order_id );
	}
}
