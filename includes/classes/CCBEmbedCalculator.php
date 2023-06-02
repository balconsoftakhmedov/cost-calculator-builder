<?php

namespace cBuilder\Classes;

class CCBEmbedCalculator {
	public static function create_page() {
		check_ajax_referer( 'embed_create_page', 'nonce' );
		$data          = json_decode( stripslashes( $_POST['data'] ) );
		$page_name     = filter_var( $data->page_name, FILTER_SANITIZE_STRING );
		$calculator_id = filter_var( $data->calculator_id, FILTER_SANITIZE_STRING );

		$PageGuid = site_url() . '/' . $page_name;
		$my_post  = array(
			'post_title'     => $page_name,
			'post_type'      => 'page',
			'post_name'      => $page_name,
			'post_content'   => '[stm-calc id="' . $calculator_id . '"]',
			'post_status'    => 'publish',
			'comment_status' => 'closed',
			'ping_status'    => 'closed',
			'post_author'    => get_current_user_id(),
			'menu_order'     => 0,
			'guid'           => $PageGuid,
		);

		$page_id  = wp_insert_post( $my_post, false );
		$page_url = get_page_link( $page_id );

		if ( $page_id ) {
			wp_send_json(
				array(
					'url' => $page_url,
				)
			);
		}

	}

	public static function get_all_pages() {
		check_ajax_referer( 'embed_get_pages', 'nonce' );

		$args = array(
			'sort_order'   => 'asc',
			'sort_column'  => 'post_title',
			'hierarchical' => 1,
			'exclude'      => '',
			'include'      => '',
			'meta_key'     => '',
			'meta_value'   => '',
			'authors'      => '',
			'child_of'     => 0,
			'parent'       => -1,
			'exclude_tree' => '',
			'number'       => '',
			'offset'       => 0,
			'post_type'    => 'page',
			'post_status'  => 'publish',
		);

		$pages  = get_pages( $args );
		$result = array_map(
			function ( $page ) {
				return array(
					'id'    => $page->ID,
					'title' => $page->post_title,
				);
			},
			$pages
		);

		wp_send_json(
			array(
				'pages' => $result,
			)
		);
	}

	public static function insert_pages() {
		check_ajax_referer( 'embed_insert_pages', 'nonce' );

		$data          = json_decode( stripslashes( $_POST['data'] ) );
		$calculator_id = filter_var( $data->calculator_id, FILTER_SANITIZE_STRING );
		$ids           = array_column( $data->pages, 'id' );

		$test = array(
			'post_type' => 'page',
			'post__in'  => $ids,
		);

		$pages = get_posts( $test );

		foreach ( $pages as $page ) {
			$args               = $page;
			$args->post_content = $page->post_content . '[stm-calc id="' . $calculator_id . '"]';

			$post_id = wp_insert_post( $args );
		}

		wp_send_json_success(
			array(
				'success_message' => __( 'Success', 'cost-calculator-builder' ),
			)
		);
	}
}


