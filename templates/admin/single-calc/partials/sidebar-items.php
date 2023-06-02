<?php
$pro_active = defined( 'CCB_PRO' ) ? 'active' : '';
$types      = array(
	'string' => __( 'String', 'cost-calculator-builder' ),
	'option' => __( 'With option', 'cost-calculator-builder' ),
	'media'  => __( 'Media', 'cost-calculator-builder' ),
	'slider' => __( 'Slider', 'cost-calculator-builder' ),
	'date'   => __( 'Date', 'cost-calculator-builder' ),
	'misc'   => __( 'Misc', 'cost-calculator-builder' ),
);

?>

<?php foreach ( $types as $type_idx => $type_value ) : ?>
	<div class="ccb-sidebar-item-container">
		<span class="ccb-sidebar-item-type"><?php echo esc_html( $type_value ); ?></span>
		<draggable @start="start" @end="end" :sort="false" @change="log" handle=".ccb-sidebar-item" class="ccb-sidebar-item-list" :list="$store.getters.getFields" :group="{ name: 'fields', pull: 'clone', put: false }">
			<div class="ccb-sidebar-item" :class="{'lock': getProFields.includes(field.tag) && '<?php echo esc_attr( $pro_active ); ?>' === ''}" @click="addField(field)" :key="field.type" v-for="( field, index ) in $store.getters.getFields" v-if="'<?php echo esc_attr( $type_idx ); ?>' === field.sort_type">
				<span class="ccb-sidebar-item-lock" v-if="getProFields.includes(field.tag) && '<?php echo esc_attr( $pro_active ); ?>' === ''">
					<span class="ccb-item-lock-inner">
						<i class="ccb-icon-Path-3482"></i>
						<span><?php esc_html_e( 'Pro', 'cost-calculator-builder' ); ?></span>
					</span>
					<span class="ccb-item-lock"></span>
				</span>
				<span class="ccb-sidebar-item-icon">
					<i :class="field.icon"></i>
				</span>
				<span class="ccb-sidebar-item-draggable">
					<i class="ccb-icon-Union-16"></i>
				</span>
				<span class="ccb-sidebar-item-box">
					<span class="ccb-default-title ccb-bold">{{ field.name }}</span>
					<span class="ccb-default-description">{{ field.description }}</span>
				</span>
			</div>
		</draggable>
	</div>
<?php endforeach; ?>
