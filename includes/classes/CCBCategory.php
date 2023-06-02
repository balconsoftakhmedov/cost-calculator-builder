<?php

namespace cBuilder\Classes;

class CCBCategory {
	const CALC_CATEGORIES_POST_TYPE = 'cost-calc-categories';
	public static function calc_add_category() {
		check_ajax_referer( 'ccb_add_category', 'nonce' );

		if ( ! current_user_can( 'publish_posts' ) ) {
			wp_send_json_error( __( 'You are not allowed to run this action', 'cost-calculator-builder' ) );
		}

		$result = array(
			'success'    => false,
			'message'    => 'Something went wrong',
			'categories' => array(),
		);

		$request_body = file_get_contents( 'php://input' );
		$request_data = json_decode( $request_body, true );
		$data         = apply_filters( 'stm_ccb_sanitize_array', $request_data );

		if ( ! empty( $data ) ) { // phpcs:ignore WordPress.Security.NonceVerification
				self::add_new_category( $data );

				$result['success']    = true;
				$result['message']    = 'Category created successfully';
				$result['categories'] = self::calc_categories_list();
		}

		wp_send_json( $result );
	}

	public static function add_new_category( $data ) {
		$title = ! isset( $data['title'] ) ? '' : $data['title'];
		$slug  = ! isset( $data['slug'] ) ? '' : $data['slug'];

		if ( ! empty( $title ) && ! empty( $slug ) ) {
			$id = wp_insert_post(
				array(
					'post_type'   => self::CALC_CATEGORIES_POST_TYPE,
					'post_status' => 'publish',
				)
			);

			update_post_meta( $id, 'slug', sanitize_text_field( $slug ) );
			update_post_meta( $id, 'title', sanitize_text_field( $title ) );
		}
	}

	public static function calc_delete_category() {
		check_ajax_referer( 'ccb_delete_category', 'nonce' );

		if ( ! current_user_can( 'publish_posts' ) ) {
			wp_send_json_error( __( 'You are not allowed to run this action', 'cost-calculator-builder' ) );
		}

		$result = array(
			'success'    => false,
			'categories' => array(),
			'message'    => __( 'Could not delete category, please try again!', 'cost-calculator-builder' ),
		);

		if ( isset( $_GET['category_id'] ) ) {
			$cat_id = (int) sanitize_text_field( $_GET['category_id'] );
			wp_delete_post( $cat_id );
			clearCategoriesMetaData( $cat_id );

			$result['success']    = true;
			$result['categories'] = self::calc_categories_list();
			$result['message']    = __( 'Category deleted successfully', 'cost-calculator-builder' );
		}

		wp_send_json( $result );
	}

	public static function calc_get_categories() {
		check_ajax_referer( 'ccb_get_categories', 'nonce' );

		if ( ! current_user_can( 'publish_posts' ) ) {
			wp_send_json_error( __( 'You are not allowed to run this action', 'cost-calculator-builder' ) );
		}

		$result = array(
			'success'    => false,
			'categories' => array(),
		);

		$categories = self::calc_categories_list();
		if ( is_array( $categories ) ) {
			$result['success']    = true;
			$result['categories'] = $categories;
		}

		wp_send_json( $result );
	}

	public static function calc_update_categories() {
		check_ajax_referer( 'ccb_update_category', 'nonce' );

		if ( ! current_user_can( 'publish_posts' ) ) {
			wp_send_json_error( __( 'You are not allowed to run this action', 'cost-calculator-builder' ) );
		}

		$result = array(
			'success'    => false,
			'message'    => 'Something went wrong',
			'categories' => array(),
		);

		$request_body = file_get_contents( 'php://input' );
		$request_data = json_decode( $request_body, true );
		$data         = apply_filters( 'stm_ccb_sanitize_array', $request_data );

		if ( ! empty( $data['id'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
			$title = ! isset( $data['title'] ) ? '' : $data['title'];
			$slug  = ! isset( $data['slug'] ) ? '' : $data['slug'];
			$id    = (int) sanitize_text_field( $data['id'] );

			if ( ! empty( $title ) && ! empty( $id ) ) {
				update_post_meta( $id, 'slug', sanitize_text_field( $slug ) );
				update_post_meta( $id, 'title', sanitize_text_field( $title ) );

				$result['success']    = true;
				$result['message']    = 'Category updated successfully';
				$result['categories'] = self::calc_categories_list();
			}
		}

		wp_send_json( $result );
	}

	public static function calc_categories_list() {
		$args = array(
			'offset'         => 1,
			'posts_per_page' => -1,
			'post_type'      => self::CALC_CATEGORIES_POST_TYPE,
			'post_status'    => array( 'publish' ),
		);

		$resources      = new \WP_Query( $args );
		$resources_json = array();

		if ( $resources->have_posts() ) {
			foreach ( $resources->get_posts() as $post ) {
				$id    = $post->ID;
				$title = get_post_meta( $id, 'title', true );
				$slug  = get_post_meta( $id, 'slug', true );

				$resources_json[] = array(
					'id'    => $id,
					'slug'  => $slug,
					'title' => $title,
				);
			}
		}

		return $resources_json;
	}
}
