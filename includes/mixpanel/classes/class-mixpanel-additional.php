<?php

namespace CCB\Includes;

class Mixpanel_Additional extends Mixpanel {

	public static function register_data() {
		foreach ( get_option( 'active_plugins', array() ) as $plugin ) {
			self::add_data( 'plugin-' . strstr( $plugin, '/', true ), true );
		}
		self::add_data( 'Active theme', self::get_active_theme() );
		self::add_data( 'Calculator Used in Front-Page', self::used_in_frontpage() );
		self::add_data( 'Admin Email', get_bloginfo( 'admin_email' ) );
		self::add_data( 'Free Plugin Version', CALC_VERSION );
		if ( defined( 'CCB_PRO_VERSION' ) ) {
			self::add_data( 'Pro Plugin Version', CCB_PRO_VERSION );
			self::add_data( 'Freemius Email', self::get_freemius_email() );
		}
		self::add_data( 'Site Language', get_locale() );
	}

	public static function get_active_theme() {
		$theme_obj = wp_get_theme();
		if ( ! empty( $theme_obj->parent() ) ) {
			$theme_obj = $theme_obj->parent();

			return $theme_obj->name;
		}

		return wp_get_theme()->name;
	}

	public static function used_in_frontpage() {
		$page_id      = get_option( 'page_on_front' );
		$page_content = ! empty( $page_id ) ? get_post( $page_id )->post_content : '';

		if ( ! empty( get_post_meta( $page_id, '_elementor_edit_mode' ) ) ) {
			return stripos( implode( ', ', get_post_meta( $page_id, '_elementor_data' ) ), 'ccb_calculator' ) !== false;
		} elseif ( ! empty( $page_content ) ) {
			return stripos( $page_content, 'stm-calc' ) !== false;
		} else {
			return false;
		}
	}

	public static function get_freemius_email() {
		$fs_user_object = get_option( 'fs_accounts' )['users'];
		return ! empty( $fs_user_object ) ? current( $fs_user_object )->email : null;
	}
}
