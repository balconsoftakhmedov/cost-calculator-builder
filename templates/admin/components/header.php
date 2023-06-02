<?php
$support_url  = 'https://support.stylemixthemes.com/tickets/new/support?item_id=29';
$current_page = isset( $_GET['page'] ) ? sanitize_text_field( $_GET['page'] ) : 'cost_calculator_orders'; // phpcs:ignore WordPress.Security.NonceVerification
$current_page = isset( $_GET['tab'] ) && sanitize_text_field( $_GET['tab'] ) === 'settings' ? 'cost_calculator_builder_settings' : $current_page; // phpcs:ignore WordPress.Security.NonceVerification
$header_pages = array(
	'calculators' => array(
		'icon'  => 'ccb-icon-Union-18',
		'link'  => get_admin_url() . 'admin.php?page=cost_calculator_builder',
		'title' => __( 'Calculators', 'cost-calculator-builder' ),
		'key'   => 'cost_calculator_builder',
	),
	'orders'      => array(
		'icon'  => 'ccb-icon-Union-17',
		'link'  => get_admin_url() . 'admin.php?page=cost_calculator_orders',
		'title' => __( 'Orders', 'cost-calculator-builder' ),
		'key'   => 'cost_calculator_orders',
	),
	'settings'    => array(
		'icon'  => 'ccb-icon-Union-28',
		'link'  => get_admin_url() . 'admin.php?page=cost_calculator_builder&tab=settings',
		'title' => __( 'Settings', 'cost-calculator-builder' ),
		'key'   => 'cost_calculator_builder_settings',
	),
	'account'     => null,
);

if ( defined( 'CCB_PRO' ) ) {
	$header_pages['orders'] = array(
		'icon'  => 'ccb-icon-Union-17',
		'link'  => get_admin_url() . 'admin.php?page=cost_calculator_orders',
		'title' => __( 'Orders', 'cost-calculator-builder' ),
		'key'   => 'cost_calculator_orders',
	);

	$header_pages['account'] = array(
		'icon'  => 'ccb-icon-path7',
		'link'  => get_admin_url() . 'admin.php?page=cost_calculator_builder-account',
		'title' => __( 'Account', 'cost-calculator-builder' ),
		'key'   => 'cost_calculator_builder-account',
	);
}

?>

<div class="ccb-header">
	<div class="ccb-header-left">
		<span class="ccb-header-logo">
			<img src="<?php echo esc_attr( CALC_URL . '/frontend/dist/img/calc.svg' ); ?>" alt="Cost Calculator">
		</span>
		<span class="ccb-header-title-box">
			<span class="ccb-header-title"><?php esc_html_e( 'Cost Calculator', 'cost-calculator-builder' ); ?></span>
			<span class="ccb-header-version">
				<?php esc_html_e( 'Version', 'cost-calculator-builder' ); ?><?php echo esc_html( sprintf( '  %s', CALC_VERSION ) ); ?>
			</span>
		</span>
	</div>
	<div class="ccb-header-right">
		<span class="ccb-header-navigation">
			<?php foreach ( $header_pages as $h_page ) : ?>
				<?php if ( ! empty( $h_page ) ) : ?>
					<a class="ccb-header-nav <?php echo esc_attr( $current_page === $h_page['key'] ? 'active' : '' ); ?>" href="<?php echo esc_url( $h_page['link'] ); ?>">
						<i class="<?php echo esc_attr( $h_page['icon'] ); ?>"></i>
						<?php echo esc_html( $h_page['title'] ); ?>
					</a>
				<?php endif; ?>
			<?php endforeach; ?>
		</span>
		<span class="ccb-header-link">
			<?php if ( ! get_option( 'ccb_feedback_added', false ) ) : ?>
				<a href="#" class="ccb-header-link-item ccb-feedback-button">
					<i class="ccb-icon-feedback"></i>
					<?php esc_html_e( 'Feedback', 'cost-calculator-builder' ); ?>
				</a>
			<?php endif; ?>
			<a href="https://stylemixthemes.cnflx.io/boards/cost-calculator-builder" target="_blank" class="ccb-header-link-item">
				<i class="ccb-icon-Path-3599"></i>
				<?php esc_html_e( 'Request feature', 'cost-calculator-builder' ); ?>
			</a>
			<a href="https://docs.stylemixthemes.com/cost-calculator-builder/" target="_blank" class="ccb-header-link-item">
				<i class="ccb-icon-Path-3494"></i>
				<?php esc_html_e( 'Documentation', 'cost-calculator-builder' ); ?>
			</a>
			<?php if ( ! defined( 'CCB_PRO' ) ) : ?>
				<a href="<?php echo esc_url( get_admin_url() . 'admin.php?page=cost_calculator_gopro' ); ?>" target="_blank" class="btn-upgrade">
					<i class="ccb-icon-Path-3496"></i>
					<?php esc_html_e( 'Upgrade', 'cost-calculator-builder' ); ?>
				</a>
			<?php else : ?>
				<a href="<?php echo esc_url( $support_url ); ?>" target="_blank" class="ccb-header-link-item">
					<i class="ccb-icon-Path-3495"></i>
					<?php esc_html_e( 'Support', 'cost-calculator-builder' ); ?>
				</a>
			<?php endif; ?>
		</span>
	</div>
</div>
<?php echo \cBuilder\Classes\CCBTemplate::load( '/admin/components/feedback' ); // phpcs:ignore ?>
