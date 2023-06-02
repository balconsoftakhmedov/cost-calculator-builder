import colorAppearance from './color';
import backgroundAppearance from "./background";
import borderAppearance from "./border";
import borderRadiusAppearance from "./border-radius";
import numberAppearance from "./number";
import selectAppearance from "./select";
import shadowAppearance from "./shadow";

export default {
	props: {
		element: {
			type: Object,
			default: {},
		},
		name: '',
	},
	components: {
		'background-field': backgroundAppearance,
		'border-field': borderAppearance,
		'border-radius-field': borderRadiusAppearance,
		'color-field': colorAppearance,
		'number-field': numberAppearance,
		'select-field': selectAppearance,
		'shadow-field': shadowAppearance,
	},

	data: () => ({
		currentType: 'primary_button',
		value: null,
	}),

	computed: {
		getCurrentData() {
			return this.element.data[this.getCurrentType]?.data || {};
		},

		getCurrentType: {
			get() {
				return this.currentType;
			},

			set(val) {
				this.currentType = val;
				this.$emit('change');
			}
		},

		getType() {
			return `buttons.${this.getCurrentType}`
		}
	},

	created(){

	},

	methods: {
		/** get element path name **/
		getElementPathName( pathData){
			return pathData.join('.');
		},

		stateChanged() {
			this.$emit('change');
		}
	},

	template: `
			<div class="ccb-buttons-field">
				<div class="ccb-buttons-tab-header">
					<span class="ccb-default-title" @click="getCurrentType = 'primary_button'" :class="{'ccb-btn-active': getCurrentType === 'primary_button'}">Primary Button</span>
					<span class="ccb-default-title" @click="getCurrentType = 'second_button'" :class="{'ccb-btn-active': getCurrentType === 'second_button'}">Second Button</span>
				</div>
				<div class="ccb-buttons-tab-content">
					<div class="row" style="row-gap: 20px;">
						<template v-if="getCurrentType === 'primary_button'">
							<div v-for="(value, index) in getCurrentData" :class="value.col">
								<span v-if="value.label && value.type !== 'toggle'" class="ccb-default-description opacity-1 ccb-bold">{{ value.label }}</span>
								<component :is="value.type + '-field'" :name="getElementPathName(['elements', getType, 'data', index])" :element="value" @change="stateChanged"></component>
							</div>
						</template>
						<template v-if="getCurrentType === 'second_button'">
							<div v-for="(value, index) in getCurrentData" :class="value.col">
								<span v-if="value.label && value.type !== 'toggle'" class="ccb-default-description opacity-1 ccb-bold">{{ value.label }}</span>
								<component :is="value.type + '-field'" :name="getElementPathName(['elements', getType, 'data', index])" :element="value" @change="stateChanged"></component>
							</div>
						</template>
					</div>
				</div>
			</div>
    `,
}