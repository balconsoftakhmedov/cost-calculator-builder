<?php

namespace cBuilder\Classes;

class CCBCalculatorTemplates {

	const CALC_TEMPLATES_POST_TYPE = 'cost-calc-templates';

	const CALC_TEMPLATES_PATH = CALC_PATH . '/demo-sample/templates.txt'; //phpcs:ignore

	public static function render_templates() {
		if ( empty( get_option( 'calc_render_templates', '' ) ) ) {
			update_option( 'calc_render_templates', true );

			if ( file_exists( self::CALC_TEMPLATES_PATH ) ) { //phpcs:ignore
				$contents = file_get_contents( self::CALC_TEMPLATES_PATH ); //phpcs:ignore
				$contents = json_decode( $contents, true );
				$contents = json_decode( wp_json_encode( $contents ), true );

				if ( isset( $contents['calculators'] ) ) {
					foreach ( $contents['calculators'] as $calculator ) {
						if ( isset( $calculator['ccb_fields'] ) ) {
							$res = null;
							CCBExportImport::addCalculatorData( $calculator, $res, false, 'draft' );
						}
					}
				}

				if ( isset( $contents['categories'] ) ) {
					foreach ( $contents['categories'] as $category ) {
						CCBCategory::add_new_category( $category );
					}
				}
			}
		}
	}

	public static function calc_save_as_template() {
		check_ajax_referer( 'ccb_save_as_template', 'nonce' );

		if ( ! current_user_can( 'publish_posts' ) ) {
			wp_send_json_error( __( 'You are not allowed to run this action', 'cost-calculator-builder' ) );
		}

		$result = array(
			'success' => false,
			'message' => 'Something went wrong',
		);

		$request_body = file_get_contents( 'php://input' );
		$request_data = json_decode( $request_body, true );
		$data         = apply_filters( 'stm_ccb_sanitize_array', $request_data );

		if ( ! empty( $data['calc_id'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
			$title   = ! isset( $data['title'] ) ? '' : $data['title'];
			$calc_id = sanitize_text_field( $data['calc_id'] );

			if ( ! empty( $title ) && ! empty( $calc_id ) ) {
				$temp_data = array(
					'calc_id'     => $calc_id,
					'title'       => $title,
					'type'        => 'default',
					'category'    => 'custom_templates',
					'description' => '',
					'icon'        => '',
					'link'        => '',
					'info'        => '',
				);
				self::create_and_save_template( $temp_data );

				$result['success'] = true;
				$result['message'] = 'Template saved successfully';
			}
		}

		wp_send_json( $result );
	}

	public static function create_and_save_template( $data ) {
		$id = wp_insert_post(
			array(
				'post_type'   => self::CALC_TEMPLATES_POST_TYPE,
				'post_status' => 'publish',
			)
		);
		update_post_meta( $id, 'calc_id', apply_filters( 'calc_id', $data['calc_id'] ) );
		update_post_meta( $data['calc_id'], 'plugin_type', $data['type'] );
		update_post_meta( $data['calc_id'], 'icon', $data['icon'] );
		update_post_meta( $data['calc_id'], 'category', $data['category'] );
		update_post_meta( $data['calc_id'], 'title', apply_filters( 'ccb_sanitize_text', $data['title'] ) );
		update_post_meta( $data['calc_id'], 'description', $data['description'] );
		update_post_meta( $data['calc_id'], 'calc_link', $data['link'] );
		update_post_meta( $data['calc_id'], 'info', $data['info'] );
	}

	public static function calc_get_all_templates() {
		check_ajax_referer( 'ccb_get_templates', 'nonce' );
		if ( ! current_user_can( 'publish_posts' ) ) {
			wp_send_json_error( __( 'You are not allowed to run this action', 'cost-calculator-builder' ) );
		}

		$result = array(
			'success'     => false,
			'templates'   => array(),
			'categories'  => array(),
			'favorites'   => array(),
			'admin_email' => '',
			'pro_active'  => defined( 'CCB_PRO_VERSION' ),
			'unlock'      => get_option( 'ccb_lock_templates', false ),
		);

		$categories = CCBCategory::calc_categories_list();
		$templates  = self::calc_templates_list();
		if ( is_array( $templates ) ) {
			$result['success']     = true;
			$result['categories']  = $categories;
			$result['templates']   = $templates;
			$result['favorites']   = get_option( 'calc_templates_favorites', array() );
			$result['admin_email'] = get_option( 'ccb_lock_templates_email' );
		}

		wp_send_json( $result );
	}

	public static function calc_delete_template() {
		check_ajax_referer( 'ccb_delete_template', 'nonce' );

		if ( ! current_user_can( 'publish_posts' ) ) {
			wp_send_json_error( __( 'You are not allowed to run this action', 'cost-calculator-builder' ) );
		}

		$result = array(
			'success'   => false,
			'templates' => array(),
			'message'   => __( 'Could not delete template, please try again!', 'cost-calculator-builder' ),
		);

		if ( isset( $_GET['template_id'] ) ) {
			$template_id = (int) sanitize_text_field( $_GET['template_id'] );
			$calc_id     = (int) get_post_meta( $template_id, 'calc_id', true );

			wp_delete_post( $template_id );
			clearTemplatesMetaData( $template_id );

			wp_delete_post( $calc_id );
			clearMetaData( $calc_id );
			ccb_update_woocommerce_calcs( $calc_id, true );

			$result['success']   = true;
			$result['templates'] = self::calc_templates_list();
			$result['message']   = __( 'Template deleted successfully', 'cost-calculator-builder' );
		}

		wp_send_json( $result );
	}

	public static function calc_toggle_favorite() {
		check_ajax_referer( 'ccb_toggle_favorite', 'nonce' );

		if ( ! current_user_can( 'publish_posts' ) ) {
			wp_send_json_error( __( 'You are not allowed to run this action', 'cost-calculator-builder' ) );
		}

		$result = array(
			'success'   => true,
			'favorites' => array(),
			'message'   => __( 'Could not toggle favorite, please try again!', 'cost-calculator-builder' ),
		);

		$request_body = file_get_contents( 'php://input' );
		$request_data = json_decode( $request_body, true );
		$data         = apply_filters( 'stm_ccb_sanitize_array', $request_data );

		if ( ! empty( $data['template_id'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
			$template_id = sanitize_text_field( $data['template_id'] );
			$favorites   = get_option( 'calc_templates_favorites', array() );
			if ( in_array( $template_id, $favorites, true ) ) {
				$pos = array_search( $template_id, $favorites, true );
				if ( false !== $pos ) {
					unset( $favorites[ $pos ] );
				}

				$result['message'] = 'Removed from favorites';
				$result['success'] = true;
			} else {
				$favorites[]       = $template_id;
				$result['message'] = 'Added to favorites';
			}

			update_option( 'calc_templates_favorites', $favorites );
			$result['favorites'] = $favorites;
		}

		wp_send_json( $result );
	}

	public static function calc_get_code() {
		check_ajax_referer( 'ccb_get_code', 'nonce' );

		if ( ! current_user_can( 'publish_posts' ) ) {
			wp_send_json_error( __( 'You are not allowed to run this action', 'cost-calculator-builder' ) );
		}

		$result = array(
			'success' => false,
			'message' => __( 'Could not send code to email!', 'cost-calculator-builder' ),
		);

		if ( isset( $_GET['email'] ) ) {
			$email = sanitize_text_field( $_GET['email'] );
			update_option( 'ccb_lock_templates_email', $email );

			$headers       = array( 'Content-Type: text/html; charset=UTF-8' );
			$body          = \cBuilder\Classes\CCBTemplate::load( '/admin/email-templates/free-code-template' ); //phpcs:ignore
			$to_user_email = wp_mail( $email, 'Cost Calculator Builder Team', $body, $headers );

			if ( $to_user_email ) {
				$result['message'] = 'Code send successfully';
				$result['success'] = true;
			}
		}

		wp_send_json( $result );
	}

	public static function calc_send_code() {
		check_ajax_referer( 'ccb_send_code', 'nonce' );

		if ( ! current_user_can( 'publish_posts' ) ) {
			wp_send_json_error( __( 'You are not allowed to run this action', 'cost-calculator-builder' ) );
		}

		$result = array(
			'success' => false,
			'message' => __( 'Could not lock templates', 'cost-calculator-builder' ),
		);

		$email = get_option( 'ccb_lock_templates_email' );
		$url   = 'https://ccb-emailmanager.stylemixthemes.com/api/v1/save_data';
		$body  = array( 'email' => $email );
		$args  = array(
			'method'    => 'POST',
			'timeout'   => 45,
			'sslverify' => false,
			'headers'   => array(
				'Content-Type' => 'application/json',
			),
			'body'      => wp_json_encode( $body ),
		);

		$request = wp_remote_post( $url, $args );
		if ( ! is_wp_error( $request ) && 200 === wp_remote_retrieve_response_code( $request ) ) {
			update_option( 'ccb_lock_templates', true );
			$result['success'] = true;
			$result['message'] = 'Templates locked successfully';
		}

		wp_send_json( $result );
	}

	public static function calc_templates_list() {
		$args = array(
			'offset'         => 1,
			'posts_per_page' => -1,
			'post_type'      => self::CALC_TEMPLATES_POST_TYPE,
			'post_status'    => array( 'publish' ),
		);

		$resources      = new \WP_Query( $args );
		$resources_json = array();

		if ( $resources->have_posts() ) {
			foreach ( $resources->get_posts() as $post ) {
				$id          = $post->ID;
				$calc_id     = get_post_meta( $id, 'calc_id', true );
				$title       = get_post_meta( $calc_id, 'title', true );
				$type        = get_post_meta( $calc_id, 'plugin_type', true );
				$category    = get_post_meta( $calc_id, 'category', true );
				$icon        = get_post_meta( $calc_id, 'icon', true );
				$description = get_post_meta( $calc_id, 'description', true );
				$link        = get_post_meta( $calc_id, 'calc_link', true );
				$info        = get_post_meta( $calc_id, 'info', true );

				$resources_json[] = array(
					'type'        => $type,
					'title'       => $title,
					'calc_id'     => $calc_id,
					'category'    => $category,
					'template_id' => $id,
					'icon'        => $icon,
					'link'        => $link,
					'info'        => $info,
					'description' => $description,
					'action'      => 'use_template',
				);
			}
		}

		return $resources_json;
	}

	public static function calc_template_icons() {
		return array(
			'ccb-icon-Weight'                            => array(
				'icon' => 'ccb-icon-Weight',
			),
			'ccb-icon-Wedding-Planner'                   => array(
				'icon' => 'ccb-icon-Wedding-Planner',
			),
			'ccb-icon-Venue-Rental'                      => array(
				'icon' => 'ccb-icon-Venue-Rental',
			),
			'ccb-icon-Trucking'                          => array(
				'icon' => 'ccb-icon-Trucking',
			),
			'ccb-icon-Renovation'                        => array(
				'icon' => 'ccb-icon-Renovation',
			),
			'ccb-icon-Medical'                           => array(
				'icon' => 'ccb-icon-Medical',
			),
			'ccb-icon-Magister-Hat'                      => array(
				'icon' => 'ccb-icon-Magister-Hat',
			),
			'ccb-icon-Horn'                              => array(
				'icon' => 'ccb-icon-Horn',
			),
			'ccb-icon-Globe'                             => array(
				'icon' => 'ccb-icon-Globe',
			),
			'ccb-icon-Flash-On-filled'                   => array(
				'icon' => 'ccb-icon-Flash-On-filled',
			),
			'ccb-icon-Fabric-Company'                    => array(
				'icon' => 'ccb-icon-Fabric-Company',
			),
			'ccb-icon-Dental'                            => array(
				'icon' => 'ccb-icon-Dental',
			),
			'ccb-icon-Color-Palette-filled'              => array(
				'icon' => 'ccb-icon-Color-Palette-filled',
			),
			'ccb-icon-Coins'                             => array(
				'icon' => 'ccb-icon-Coins',
			),
			'ccb-icon-Car-Wash'                          => array(
				'icon' => 'ccb-icon-Car-Wash',
			),
			'ccb-icon-Car-Rental'                        => array(
				'icon' => 'ccb-icon-Car-Rental',
			),
			'ccb-icon-Calculators-filled'                => array(
				'icon' => 'ccb-icon-Calculators-filled',
			),
			'ccb-icon-Bulb'                              => array(
				'icon' => 'ccb-icon-Bulb',
			),
			'ccb-icon-Beauty'                            => array(
				'icon' => 'ccb-icon-Beauty',
			),
			'ccb-icon-Yearbook-Order'                    => array(
				'icon' => 'ccb-icon-Yearbook-Order',
			),
			'ccb-icon-Wholesale-Order'                   => array(
				'icon' => 'ccb-icon-Wholesale-Order',
			),
			'ccb-icon-Wedding-Planner-Booking'           => array(
				'icon' => 'ccb-icon-Wedding-Planner-Booking',
			),
			'ccb-icon-Village-Hall-Room-Booking'         => array(
				'icon' => 'ccb-icon-Village-Hall-Room-Booking',
			),
			'ccb-icon-Veterinary-Appointment-Booking'    => array(
				'icon' => 'ccb-icon-Veterinary-Appointment-Booking',
			),
			'ccb-icon-Venue-Rental1'                     => array(
				'icon' => 'ccb-icon-Venue-Rental1',
			),
			'ccb-icon-VAT-Calculator'                    => array(
				'icon' => 'ccb-icon-VAT-Calculator',
			),
			'ccb-icon-Vaccination-Service'               => array(
				'icon' => 'ccb-icon-Vaccination-Service',
			),
			'ccb-icon-Tuition-Fee'                       => array(
				'icon' => 'ccb-icon-Tuition-Fee',
			),
			'ccb-icon-Tour-Booking'                      => array(
				'icon' => 'ccb-icon-Tour-Booking',
			),
			'ccb-icon-Tip-Calculator'                    => array(
				'icon' => 'ccb-icon-Tip-Calculator',
			),
			'ccb-icon-Ticket-Order-Form'                 => array(
				'icon' => 'ccb-icon-Ticket-Order-Form',
			),
			'ccb-icon-Taxi-Booking-Form'                 => array(
				'icon' => 'ccb-icon-Taxi-Booking-Form',
			),
			'ccb-icon-Tax-Calculator'                    => array(
				'icon' => 'ccb-icon-Tax-Calculator',
			),
			'ccb-icon-Takeout-Order-Form'                => array(
				'icon' => 'ccb-icon-Takeout-Order-Form',
			),
			'ccb-icon-T-Shirt-Order-Form'                => array(
				'icon' => 'ccb-icon-T-Shirt-Order-Form',
			),
			'ccb-icon-Spa-Booking'                       => array(
				'icon' => 'ccb-icon-Spa-Booking',
			),
			'ccb-icon-Social-Media-Management'           => array(
				'icon' => 'ccb-icon-Social-Media-Management',
			),
			'ccb-icon-School-Uniform-Order'              => array(
				'icon' => 'ccb-icon-School-Uniform-Order',
			),
			'ccb-icon-School-Trip-PayPal-Payment'        => array(
				'icon' => 'ccb-icon-School-Trip-PayPal-Payment',
			),
			'ccb-icon-School-Residential-Payment'        => array(
				'icon' => 'ccb-icon-School-Residential-Payment',
			),
			'ccb-icon-Savings-and-Investment-Calculator' => array(
				'icon' => 'ccb-icon-Savings-and-Investment-Calculator',
			),
			'ccb-icon-Sample-Size-Calculator'            => array(
				'icon' => 'ccb-icon-Sample-Size-Calculator',
			),
			'ccb-icon-Sales-Call-Booking'                => array(
				'icon' => 'ccb-icon-Sales-Call-Booking',
			),
			'ccb-icon-ROS-Calculator'                    => array(
				'icon' => 'ccb-icon-ROS-Calculator',
			),
			'ccb-icon-ROI-Calculator'                    => array(
				'icon' => 'ccb-icon-ROI-Calculator',
			),
			'ccb-icon-Reset-Value'                       => array(
				'icon' => 'ccb-icon-Reset-Value',
			),
			'ccb-icon-Renovation1'                       => array(
				'icon' => 'ccb-icon-Renovation1',
			),
			'ccb-icon-Psychologist-Advice-Booking'       => array(
				'icon' => 'ccb-icon-Psychologist-Advice-Booking',
			),
			'ccb-icon-Promotional-Items-Order'           => array(
				'icon' => 'ccb-icon-Promotional-Items-Order',
			),
			'ccb-icon-Printing-Service'                  => array(
				'icon' => 'ccb-icon-Printing-Service',
			),
			'ccb-icon-Photography-Booking'               => array(
				'icon' => 'ccb-icon-Photography-Booking',
			),
			'ccb-icon-Photo-Upload'                      => array(
				'icon' => 'ccb-icon-Photo-Upload',
			),
			'ccb-icon-Personal-Trainer-Booking'          => array(
				'icon' => 'ccb-icon-Personal-Trainer-Booking',
			),
			'ccb-icon-Percentage-Calculator'             => array(
				'icon' => 'ccb-icon-Percentage-Calculator',
			),
			'ccb-icon-Paycheck-Calculator'               => array(
				'icon' => 'ccb-icon-Paycheck-Calculator',
			),
			'ccb-icon-Party-Planner'                     => array(
				'icon' => 'ccb-icon-Party-Planner',
			),
			'ccb-icon-Paid-Blog-Post-Submission'         => array(
				'icon' => 'ccb-icon-Paid-Blog-Post-Submission',
			),
			'ccb-icon-Medicine-Order'                    => array(
				'icon' => 'ccb-icon-Medicine-Order',
			),
			'ccb-icon-Marketing-Advice-Booking'          => array(
				'icon' => 'ccb-icon-Marketing-Advice-Booking',
			),
			'ccb-icon-Maintenance-Service'               => array(
				'icon' => 'ccb-icon-Maintenance-Service',
			),
			'ccb-icon-Loan-Calculator'                   => array(
				'icon' => 'ccb-icon-Loan-Calculator',
			),
			'ccb-icon-Laboratory-Diagnosis'              => array(
				'icon' => 'ccb-icon-Laboratory-Diagnosis',
			),
			'ccb-icon-Kitchen-Renovations'               => array(
				'icon' => 'ccb-icon-Kitchen-Renovations',
			),
			'ccb-icon-Jewelry-Order-Form'                => array(
				'icon' => 'ccb-icon-Jewelry-Order-Form',
			),
			'ccb-icon-Internet-Marketing'                => array(
				'icon' => 'ccb-icon-Internet-Marketing',
			),
			'ccb-icon-Interior-Design-Booking'           => array(
				'icon' => 'ccb-icon-Interior-Design-Booking',
			),
			'ccb-icon-Insurance-Booking'                 => array(
				'icon' => 'ccb-icon-Insurance-Booking',
			),
			'ccb-icon-Ideal-Weight-Calculator'           => array(
				'icon' => 'ccb-icon-Ideal-Weight-Calculator',
			),
			'ccb-icon-Hotel-Reservation'                 => array(
				'icon' => 'ccb-icon-Hotel-Reservation',
			),
			'ccb-icon-Hosting'                           => array(
				'icon' => 'ccb-icon-Hosting',
			),
			'ccb-icon-High-School-Reunion-Registration'  => array(
				'icon' => 'ccb-icon-High-School-Reunion-Registration',
			),
			'ccb-icon-High-School-Calculator'            => array(
				'icon' => 'ccb-icon-High-School-Calculator',
			),
			'ccb-icon-Golf-Tournament-Entry'             => array(
				'icon' => 'ccb-icon-Golf-Tournament-Entry',
			),
			'ccb-icon-Gift-Card-Order-Form'              => array(
				'icon' => 'ccb-icon-Gift-Card-Order-Form',
			),
			'ccb-icon-Funeral-Home-Company'              => array(
				'icon' => 'ccb-icon-Funeral-Home-Company',
			),
			'ccb-icon-Fundraiser-Order'                  => array(
				'icon' => 'ccb-icon-Fundraiser-Order',
			),
			'ccb-icon-Fuel-Cost-Calculator'              => array(
				'icon' => 'ccb-icon-Fuel-Cost-Calculator',
			),
			'ccb-icon-Football-League-Entry'             => array(
				'icon' => 'ccb-icon-Football-League-Entry',
			),
			'ccb-icon-Food-Catering'                     => array(
				'icon' => 'ccb-icon-Food-Catering',
			),
			'ccb-icon-Flower-Order-Form'                 => array(
				'icon' => 'ccb-icon-Flower-Order-Form',
			),
			'ccb-icon-Facial-Booking'                    => array(
				'icon' => 'ccb-icon-Facial-Booking',
			),
			'ccb-icon-Fabric-Company1'                   => array(
				'icon' => 'ccb-icon-Fabric-Company1',
			),
			'ccb-icon-Exhibition-Booking'                => array(
				'icon' => 'ccb-icon-Exhibition-Booking',
			),
			'ccb-icon-Energy-Consumption'                => array(
				'icon' => 'ccb-icon-Energy-Consumption',
			),
			'ccb-icon-Discount-Calculator'               => array(
				'icon' => 'ccb-icon-Discount-Calculator',
			),
			'ccb-icon-Dinner-Reservation'                => array(
				'icon' => 'ccb-icon-Dinner-Reservation',
			),
			'ccb-icon-Dental-Supply-Order'               => array(
				'icon' => 'ccb-icon-Dental-Supply-Order',
			),
			'ccb-icon-Dental-Service'                    => array(
				'icon' => 'ccb-icon-Dental-Service',
			),
			'ccb-icon-Delivery-Service'                  => array(
				'icon' => 'ccb-icon-Delivery-Service',
			),
			'ccb-icon-Daily-Calorie-Intake-Calculator'   => array(
				'icon' => 'ccb-icon-Daily-Calorie-Intake-Calculator',
			),
			'ccb-icon-Custom-Totals'                     => array(
				'icon' => 'ccb-icon-Custom-Totals',
			),
			'ccb-icon-Conversion-Calculator'             => array(
				'icon' => 'ccb-icon-Conversion-Calculator',
			),
			'ccb-icon-Content-Writing-Agency'            => array(
				'icon' => 'ccb-icon-Content-Writing-Agency',
			),
			'ccb-icon-Conference-Registration'           => array(
				'icon' => 'ccb-icon-Conference-Registration',
			),
			'ccb-icon-Condition'                         => array(
				'icon' => 'ccb-icon-Condition',
			),
			'ccb-icon-Compound-Interest-Calculator'      => array(
				'icon' => 'ccb-icon-Compound-Interest-Calculator',
			),
			'ccb-icon-Clinic-Booking'                    => array(
				'icon' => 'ccb-icon-Clinic-Booking',
			),
			'ccb-icon-Cleaning-Company'                  => array(
				'icon' => 'ccb-icon-Cleaning-Company',
			),
			'ccb-icon-Chess-Club-Application'            => array(
				'icon' => 'ccb-icon-Chess-Club-Application',
			),
			'ccb-icon-Charity-Donation'                  => array(
				'icon' => 'ccb-icon-Charity-Donation',
			),
			'ccb-icon-Car-Rental-Booking'                => array(
				'icon' => 'ccb-icon-Car-Rental-Booking',
			),
			'ccb-icon-Business-Coaching-Booking'         => array(
				'icon' => 'ccb-icon-Business-Coaching-Booking',
			),
			'ccb-icon-BMI-Calculator'                    => array(
				'icon' => 'ccb-icon-BMI-Calculator',
			),
			'ccb-icon-Beauty-Salon-Booking'              => array(
				'icon' => 'ccb-icon-Beauty-Salon-Booking',
			),
			'ccb-icon-Barber-Shop'                       => array(
				'icon' => 'ccb-icon-Barber-Shop',
			),
			'ccb-icon-Attorney-Appointment-Booking'      => array(
				'icon' => 'ccb-icon-Attorney-Appointment-Booking',
			),
			'ccb-icon-Agency-Booking'                    => array(
				'icon' => 'ccb-icon-Agency-Booking',
			),
			'ccb-icon-After-School-Club-Registration'    => array(
				'icon' => 'ccb-icon-After-School-Club-Registration',
			),
			'ccb-icon-Advanced-Mortgage-Calculator'      => array(
				'icon' => 'ccb-icon-Advanced-Mortgage-Calculator',
			),
			'ccb-icon-Graphic-Designing'                 => array(
				'icon' => 'ccb-icon-Graphic-Designing',
			),
		);
	}
}
