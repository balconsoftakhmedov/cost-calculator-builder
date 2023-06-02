<?php

namespace CCB_Elementor_Widgets\Widgets;

use Elementor\Widget_Base;
use Elementor\Controls_Manager;
use Elementor\Base_Control;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}
/**
 * Elementor Hello World
 *
 * Elementor widget for hello world.
 *
 * @since 1.0.0
 */
class CCB_Elementor_Widget extends Widget_Base {

	/**
	 * Retrieve the widget name.
	 *
	 * @return string Widget name.
	 * @since 1.0.0
	 *
	 * @access public
	 *
	 */
	public function get_name() {
		return 'stm_calc';
	}

	/**
	 * Retrieve the widget title.
	 *
	 * @return string Widget title.
	 * @since 1.0.0
	 *
	 * @access public
	 *
	 */
	public function get_title() {
		return __( 'Cost Calculator Builder', 'cost-calculator-builder' );
	}

	/**
	 * Retrieve the widget icon.
	 *
	 * @return string Widget icon.
	 * @since 1.0.0
	 *
	 * @access public
	 *
	 */
	public function get_icon() {
		return 'eicon-archive';
	}

	/**
	 * Retrieve the list of categories the widget belongs to.
	 *
	 * Used to determine where to display the widget in the editor.
	 *
	 * Note that currently Elementor supports only one posts.
	 * When multiple categories passed, Elementor uses the first one.
	 *
	 * @return array Widget categories.
	 * @since 1.0.0
	 *
	 * @access public
	 *
	 */
	public function get_categories() {
		return array( 'theme-elements' );
	}

	/**
	 * Register the widget controls.
	 *
	 * Adds different input fields to allow the user to change and customize the widget settings.
	 *
	 * @since 1.0.0
	 *
	 * @access protected
	 */
	protected function register_controls() {
		$this->start_controls_section(
			'cost_calculator_builder',
			array(
				'label' => __( 'Select calculator', 'cost-calculator-builder' ),
			)
		);

		$this->add_control(
			'ccb_calculator',
			array(
				'label'   => __( 'Calculator', 'cost-calculator-builder' ),
				'type'    => Controls_Manager::SELECT,
				'options' => ccb_all_calculators(),
				'default' => 'select',
			)
		);

		$this->end_controls_section();

	}

	/**
	 * Render the widget output on the frontend.
	 *
	 * Written in PHP and used to generate the final HTML.
	 *
	 * @since 1.0.0
	 *
	 * @access protected
	 */
	protected function render() {
		$settings = $this->get_settings();
		if ( is_admin() ) {
			echo '<i class="elementor-widget-empty-icon eicon-archive" style="color: #c2cbd2; font-size: 22px; display: block; text-align: center; padding: 10px 0; background: rgba(213,218,223,.8);"></i>'; // phpcs:ignore
		} else {
			echo do_shortcode( "[stm-calc id='" . esc_attr( $settings['ccb_calculator'] ) . "']" );
		}
	}

	/**
	 * Render the widget output in the editor.
	 *
	 * Written as a Backbone JavaScript template and used to generate the live preview.
	 *
	 * @since 1.0.0
	 *
	 * @access protected
	 */
	protected function content_template() {

	}
}
