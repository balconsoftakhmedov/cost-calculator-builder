export default [
	{disabled: true, slug: 'paypal', name: 'PayPal', requiredSettingFields: ['paypal_email']},
	{disabled: true, slug: 'stripe', name: 'Stripe', requiredSettingFields: ['secretKey', 'publishKey']},
	{disabled: true, slug: 'woo_checkout', name: 'Woo Checkout', requiredSettingFields: ['product_id']},
];