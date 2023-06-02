<?php
define( 'STM_FREEMIUS_CHECKOUT_LINK', 'https://checkout.freemius.com/mode/dialog/plugin/' );
define( 'STM_FREEMIUS_CHECKOUT_UTM_SOURCE', 'utm_source=wpadmin&utm_medium=buynow&utm_campaign=cost-calculator-plugin' );
define( 'STM_FREEMIUS_PLUGIN_INFO_URL', 'https://stylemixthemes.com/api/freemius/cost-calculator-builder-pro.json' );

function get_freemius_info() {
	$response = wp_remote_get( STM_FREEMIUS_PLUGIN_INFO_URL );
	$body     = wp_remote_retrieve_body( $response );
	$body     = json_decode( $body );

	if ( empty( $body ) ) {
		return '';
	}

	$freemius_info = array();

	/**
	 * Set to Array Premium Plan's Prices
	 */
	function set_premium_plan_prices( $plans, $plugin_id ) {
		$plan_info = array();

		$plan_data = array(
			'1'  => array(
				'text'      => esc_html__( 'Single Site', 'cost-calculator-builder' ),
				'classname' => '',
				'type'      => '',
			),
			'5'  => array(
				'classname' => 'stm_plan--popular',
				'text'      => esc_html__( 'Up to 5 Sites', 'cost-calculator-builder' ),
				'type'      => esc_html__( 'Most Popular', 'cost-calculator-builder' ),
			),
			'25' => array(
				'classname' => 'stm_plan--developer',
				'text'      => esc_html__( 'Up to 25 Sites', 'cost-calculator-builder' ),
				'type'      => esc_html__( 'Developer Oriented', 'cost-calculator-builder' ),
			),
		);

		foreach ( $plans as $plan ) {
			if ( 'premium' === $plan->name ) {
				if ( isset( $plan->pricing ) ) {
					foreach ( $plan->pricing as $pricing ) {
						$plan_info[ 'licenses_' . $pricing->licenses ]      = $pricing;
						$plan_info[ 'licenses_' . $pricing->licenses ]->url = STM_FREEMIUS_CHECKOUT_LINK . "{$plugin_id}/plan/{$pricing->plan_id}/licenses/{$pricing->licenses}/";

						if ( ! isset( $plan_data[ $pricing->licenses ] ) ) {
							$plan_data[ $pricing->licenses ] = array(
								'text'      => esc_html__( "Unlimited Sites", "cost-calculator-builder" ), // phpcs:ignore
								'classname' => '',
								'type'      => '',
							);
						}
						$plan_info[ 'licenses_' . $pricing->licenses ]->data = $plan_data[ $pricing->licenses ];
					}
				}
				break;
			}
		}

		return array_reverse( $plan_info );
	}

	/**
	 * Set to Array Latest Plugin's Info
	 */
	function set_latest_info( $latest ) {
		$latest_info['version']           = $latest->version;
		$latest_info['tested_up_to']      = $latest->tested_up_to_version;
		$latest_info['created']           = date( "M j, Y", strtotime( $latest->created ) ); // phpcs:ignore
		$latest_info['last_update']       = date( "M j, Y", strtotime( $latest->updated ) ); // phpcs:ignore
		$latest_info['wordpress_version'] = $latest->requires_platform_version;

		return $latest_info;
	}

	if ( isset( $body->plans ) && ! empty( $body->plans ) ) {
		$freemius_info['plan'] = set_premium_plan_prices( $body->plans, $body->id );
	}

	if ( isset( $body->latest ) && ! empty( $body->latest ) ) {
		$freemius_info['latest'] = set_latest_info( $body->latest );
	}

	if ( isset( $body->info ) && ! empty( $body->info ) ) {
		$freemius_info['info']      = $body->info;
		$freemius_info['info']->url = 'https://stylemixthemes.com/cost-calculator-plugin/pricing/';
	}

	return $freemius_info;
}

$freemius_info = get_freemius_info();

$date_now = date( 'Y-m-d' );

?>
<div class="cost_calculator_go_pro">
	<section class="stm_go_pro">
		<div class="container">
			<div class="stm_go_pro_plugin">
				<h2 class="stm_go_pro_plugin__title ccb-heading-1 ccb-bold">
					<?php esc_html_e( 'Cost Calculator', 'cost-calculator-builder' ); ?>
				</h2>
				<p class="stm_go_pro_plugin__content ccb-heading-5 ccb-light">
					<?php if ( isset( $freemius_info['info'] ) ) : ?>
						<?php if ( isset( $freemius_info['info']->short_description ) ) : ?>
							<?php echo esc_html( nl2br( $freemius_info['info']->short_description ) ); ?>
						<?php endif; ?>
						<?php if ( $freemius_info['info']->url ) : ?>
							<a href="<?php echo esc_html( $freemius_info['info']->url . '?utm_source=wpadmin&utm_medium=gopro&utm_campaign=2021' ); ?>">
								<?php esc_html_e( 'Learn more.', 'cost-calculator-builder' ); ?>
							</a>
						<?php endif; ?>
					<?php endif; ?>
				</p>
			</div>
			<?php if ( $date_now < '2023-05-18' ) : ?>
				<div class="stm-discount">
					<div class="stm-discount-info">
						<div class="stm-discount__title"><?php esc_html_e( '1 Week 30% Special Discount', 'cost-calculator-builder' ); ?></div>
						<div class="stm-discount__description">
							<span><?php esc_html_e( 'Coupon code valid for Subscriptions plans', 'cost-calculator-builder' ); ?></span>
							<span><?php esc_html_e( 'Available for 1 Week Only', 'cost-calculator-builder' ); ?></span>
						</div>
					</div>
					<div class="stm-discount-code">
						<span class="stm-discount-code__label"><?php esc_html_e( 'Promocode', 'cost-calculator-builder' ); ?></span>
						<span class="stm-discount-code__value"><?php esc_html_e( 'CSM30', 'cost-calculator-builder' ); ?></span>
					</div>
				</div>
			<?php endif; ?>

			<?php if ( isset( $freemius_info['plan'] ) ) : ?>
				<h2 class="pricing-section ccb-heading-1 ccb-bold" style="position: relative; left: -5px"><?php esc_html_e( 'Choose the package that suits your business', 'cost-calculator-builder' ); ?></h2>
				<div class="stm-type-pricing">
					<div class="left active ccb-heading-5"><?php esc_html_e( 'Annual', 'cost-calculator-builder' ); ?></div>
					<div class="stm-type-pricing__switch">
						<input type="checkbox" id="GoProStmTypePricing">
						<label for="GoProStmTypePricing"></label>
					</div>
					<div class="right ccb-heading-5"><?php esc_html_e( 'Lifetime', 'cost-calculator-builder' ); ?></div>
				</div>
				<div class="row">
					<?php foreach ( $freemius_info['plan'] as $plan ) : ?>
						<div class="col-md-4">
							<div class="stm_plan <?php echo esc_attr( $plan->data['classname'] ); ?>">
								<?php if ( ! empty( $plan->data['type'] ) ) : ?>
									<div class="stm_plan__type">
										<?php echo esc_attr( $plan->data['type'] ); ?>
									</div>
								<?php endif; ?>
								<div class="stm_price">
									<sup>$</sup>
									<span class="stm_price__value" data-price-annual="<?php echo esc_attr( $plan->annual_price ); ?>" data-price-lifetime="<?php echo esc_attr( $plan->lifetime_price ); ?>">
										<?php echo esc_html( $plan->annual_price ); ?>
									</span>
									<small>/<?php esc_html_e( 'per year', 'cost-calculator-builder' ); ?></small>
								</div>
								<p class="stm_plan__title"><?php echo esc_html( $plan->data['text'] ); ?></p>
								<?php
									$get_now_link = isset( $freemius_info['info']->url ) ? $freemius_info['info']->url . '?' . STM_FREEMIUS_CHECKOUT_UTM_SOURCE . '&licenses=' . $plan->licenses . '&billing_cycle=annual' : $plan->url;
									$data_url     = isset( $freemius_info['info']->url ) ? $freemius_info['info']->url . '?' . STM_FREEMIUS_CHECKOUT_UTM_SOURCE . '&licenses=' . $plan->licenses : $plan->url;
								?>
								<a href="<?php echo esc_url( $get_now_link ); ?>" class="stm_plan__btn stm_plan__btn--buy" data-checkout-url="<?php echo esc_url( $data_url ); ?>" target="_blank">
									<?php esc_html_e( 'Get now', 'cost-calculator-builder' ); ?>
								</a>
							</div>
						</div>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>
		</div>
		<div class="container">
			<p class="stm_terms_content ccb-default-title">
				<?php
				$url       = 'https://stylemixthemes.com/subscription-policy/';
				$span_attr = 'class="stm_terms_content_support" data-support-lifetime="' . esc_attr__( 'Lifetime', 'cost-calculator-builder' ) . '" data-support-annual="' . esc_attr__( '1 year', 'cost-calculator-builder' ) . '"';
				printf( __( 'You get <a href="%1$s"><span %2$s>1 year</span> updates and support</a> from the date of purchase. We offer 14 days Money Back Guarantee based on <a href="%1$s">Refund Policy</a>.', 'cost-calculator-builder' ), $url, $span_attr ); // phpcs:ignore
				?>
			</p>

			<?php if ( ! empty( $freemius_info['latest'] ) ) : ?>
				<ul class="stm_last_changelog_info">
					<li>
						<span class="ccb-default-title ccb-light">
							<?php esc_html_e( 'Version:', 'cost-calculator-builder' ); ?>
						</span>
						<span class="ccb-default-title ccb-light">
							<?php echo esc_html( $freemius_info['latest']['version'] ); ?>
							<a href="https://docs.stylemixthemes.com/cost-calculator-builder/changelog/" target="_blank">
								<?php esc_html_e( 'View Changelog', 'cost-calculator-builder' ); ?>
							</a>
						</span>
					</li>
					<li>
						<span class="ccb-default-title ccb-light">
							<?php esc_html_e( 'Last Update:', 'cost-calculator-builder' ); ?>
						</span>
						<span class="ccb-default-title ccb-light">
							<?php echo esc_html( $freemius_info['latest']['created'] ); ?>
						</span>
					</li>
					<li>
						<span class="ccb-default-title ccb-light">
							<?php esc_html_e( 'Wordpress Version:', 'cost-calculator-builder' ); // phpcs:ignore ?>
						</span>
						<span class="ccb-default-title ccb-light">
							<?php echo esc_html( $freemius_info['latest']['wordpress_version'] ); ?> or higher
						</span>
					</li>
					<li>
						<span class="ccb-default-title ccb-light">
							<?php esc_html_e( 'Tested up to:', 'cost-calculator-builder' ); ?>
						</span>
						<span class="ccb-default-title ccb-light">
							<?php echo defined( 'CALC_WP_TESTED_UP' ) ? esc_html( CALC_WP_TESTED_UP ) : esc_html( $freemius_info['latest']['tested_up_to'] ); ?>
						</span>
					</li>
				</ul>
			<?php endif; ?>
		</div>
	</section>
</div>

<script>
	jQuery(document).ready(function ($) {
		$('#GoProStmTypePricing').on('change', function () {

			let parent = $(this).closest('.stm-type-pricing');

			let left = parent.find('.left'); //Annual
			let right = parent.find('.right'); //Lifetime
			let stm_price = $('.stm_price small');

			left.toggleClass('active', !this.checked);
			right.toggleClass('active', this.checked);

			stm_price.toggleClass('hidden', this.checked);

			let typePrice = 'annual';

			if (this.checked) typePrice = 'lifetime';

			let support = $('.stm_terms_content_support');
			support.text(support.attr('data-support-' + typePrice));

			$('.stm_plan__btn--buy').each(function () {
				let $this = $(this)
				let checkoutUrl = $this.attr('data-checkout-url');
				$this.attr('href', checkoutUrl + '&billing_cycle=' + typePrice);
			})

			$('.stm_price__value').each(function () {
				let $this = $(this);
				$this.text($this.attr('data-price-' + typePrice));
			})

		});

	});
</script>
