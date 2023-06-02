<?php
// register activation hook
register_activation_hook(
	CALC_FILE,
	function () {
		if ( empty( get_option( 'ccb_installed' ) ) ) {
			add_option( 'ccb_installed', date( 'Y-m-d h:i:s' ) );
			add_option( 'ccb_canceled', 'no' );
			add_option( 'ccb_quick_tour_type', 'skip' );
			add_option( 'ccb_version_control', 'v2' );
			add_option( 'ccb_general_settings', \cBuilder\Classes\CCBSettingsData::general_settings_data() );

			ccb_set_admin_url();
			\cBuilder\Classes\CCBCalculatorTemplates::render_templates();
		}

		\cBuilder\Classes\CCBUpdates::init();
	}
);


add_action( 'plugins_loaded', 'ccb_widgets_load' );
add_action( 'init', 'ccb_calculator_type_init', 0 );
// init ajax actions ....

if ( is_admin() ) {
	\cBuilder\Classes\CCBBuilderAdminMenu::init();
	add_action(
		'init',
		function () {
			\cBuilder\Classes\CCBAjaxCallbacks::register_calc_hooks();
		}
	);

	require_once CALC_PATH . '/includes/lib/admin-notifications-popup/admin-notification-popup.php';

	if ( ! class_exists( 'RateNotification' ) ) {
		require_once CALC_PATH . '/includes/lib/admin-notifications-popup/classes/RateNotification.php';
	}

	$init_data = array(
		'plugin_title' => 'Cost Calculator Builder',
		'plugin_name'  => 'cost-calculator-builder',
		'plugin_file'  => CALC_FILE,
		'logo'         => CALC_URL . '/frontend/dist/img/calc.png', // phpcs:ignore
	);

	RateNotification::init( $init_data );

	add_action(
		'save_post_cost-calc',
		array(
			\cBuilder\Classes\CCBSettingsData::class,
			'stm_calc_created_set_option',
		),
		20,
		3
	);

	add_action(
		'stm_admin_notice_rate_cost-calculator-builder_single',
		array(
			\cBuilder\Classes\CCBSettingsData::class,
			'stm_admin_notice_rate_calc',
		),
		100
	);
}

/**
 * add ajax action
 */
add_action(
	'init',
	function () {
		if ( empty( get_option( 'ccb_appearance_presets' ) ) ) {
			update_option( 'ccb_appearance_presets', \cBuilder\Classes\Appearance\Presets\CCBPresetGenerator::default_presets() );
		}

		\cBuilder\Classes\CCBUpdates::init();
		\cBuilder\Classes\CCBAjaxAction::init();
		\cBuilder\Classes\CCBFrontController::init();
	}
);

// Register cost-calc types
function ccb_calculator_type_init() {
	$post_types = stm_calc_post_types();

	foreach ( $post_types as $post_type => $post_type_info ) {
		$add_args = ( ! empty( $post_type_info['args'] ) ) ? $post_type_info['args'] : array();
		$args     = stm_calc_post_type_args(
			stm_calc_post_types_labels(
				$post_type_info['single'],
				$post_type_info['plural']
			),
			$post_type,
			$add_args
		);

		register_post_type( $post_type, $args );
	}
}

function stm_calc_post_types() {
	return array(
		'cost-calc'           => array(
			'single' => 'Cost Calculator',
			'plural' => 'Cost Calculator',
		),
		'cost-calc-templates' => array(
			'single' => 'Cost Calculator Template',
			'plural' => 'Cost Calculator Templates',
		),
		'cost-calc-category'  => array(
			'single' => 'Category',
			'plural' => 'Categories',
		),
	);
}

function stm_calc_post_types_labels( $singular, $plural, $admin_bar_name = '' ) {
	$admin_bar_name = ( ! empty( $admin_bar_name ) ) ? $admin_bar_name : $plural;
	return array(
		'name'               => _x( sprintf( '%s', $plural ), 'post type general name', 'cost-calculator-builder' ), //phpcs:ignore
		'singular_name'      => sprintf( _x( 'Calc', 'post type singular name', 'cost-calculator-builder' ), $singular ), //phpcs:ignore
		'menu_name'          => _x( sprintf( '%s', $plural ), 'admin menu', 'cost-calculator-builder' ), //phpcs:ignore
		'name_admin_bar'     => sprintf( _x( '%s', 'Admin bar ' . $singular . ' name', 'cost-calculator-builder' ), $admin_bar_name ), //phpcs:ignore
		'add_new_item'       => sprintf( __( 'Add New %s', 'cost-calculator-builder' ), $singular ),
		'new_item'           => sprintf( __( 'New %s', 'cost-calculator-builder' ), $singular ),
		'edit_item'          => sprintf( __( 'Edit %s', 'cost-calculator-builder' ), $singular ),
		'view_item'          => sprintf( __( 'View %s', 'cost-calculator-builder' ), $singular ),
		'all_items'          => sprintf( _x( '%s', 'Admin bar ' . $singular . ' name', 'cost-calculator-builder' ), $admin_bar_name ), //phpcs:ignore
		'search_items'       => sprintf( __( 'Search %s', 'cost-calculator-builder' ), $plural ),
		'parent_item_colon'  => sprintf( __( 'Parent %s:', 'cost-calculator-builder' ), $plural ),
		'not_found'          => sprintf( __( 'No %s found.', 'cost-calculator-builder' ), $plural ),
		'not_found_in_trash' => sprintf( __( 'No %s found in Trash.', 'cost-calculator-builder' ), $plural ),
	);
}

function stm_calc_post_type_args( $labels, $slug, $args = array() ) {
	$default_args = array(
		'labels'             => $labels,
		'public'             => false,
		'publicly_queryable' => false,
		'show_ui'            => true,
		'show_in_menu'       => false,
		'query_var'          => false,
		'rewrite'            => array( 'slug' => $slug ),
		'capability_type'    => 'post',
		'has_archive'        => false,
		'hierarchical'       => false,
		'menu_position'      => null,
		'supports'           => array( 'title' ),
	);

	return wp_parse_args( $args, $default_args );
}
