<?php
function init_ccb_mixpanel() {
	require_once 'classes/class-mixpanel.php';
	require_once 'classes/class-mixpanel-general.php';
	require_once 'classes/class-mixpanel-additional.php';
	require_once 'classes/class-mixpanel-single-calculator.php';
	require_once 'classes/class-mixpanel-appearance.php';

	$data_classes = array(
		'CCB\Includes\Mixpanel_General',
		'CCB\Includes\Mixpanel_Additional',
		'CCB\Includes\Mixpanel_Appearance',
		'CCB\Includes\Mixpanel_Single_Calculator',
	);
	$mixpanel     = new CCB\Includes\Mixpanel( $data_classes );
	$mixpanel->execute();
}

add_filter( 'cron_schedules', 'mixpanel_ccb_cron_schedule' );

function mixpanel_ccb_cron_schedule( $schedules ) {
	if ( ! isset( $schedules['weekly'] ) ) {
		$schedules['weekly'] = array(
			'interval' => WEEK_IN_SECONDS,
			'display'  => __( 'Once every 1 week' ),
		);
	}

	return $schedules;
}

if ( ! wp_next_scheduled( 'ccb_init_mixpanel_cron' ) ) {
	wp_schedule_event( time(), 'weekly', 'ccb_init_mixpanel_cron' );
}

add_action( 'ccb_init_mixpanel_cron', 'init_ccb_mixpanel' );
