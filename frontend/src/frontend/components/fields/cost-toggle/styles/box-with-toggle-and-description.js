import styleMixin from '../toggle-field-mixin'

export default {
    mixins: [styleMixin],
    template: `
            <div>
                <div class="calc-item__title">
                    <span> {{ toggleField.label }} </span>
                    <span class="ccb-required-mark" v-if="toggleField.required">*</span>
                    <span v-if="toggleField.required" class="calc-required-field">
                        <div class="ccb-field-required-tooltip">
                            <span class="ccb-field-required-tooltip-text" :class="{active: $store.getters.isUnused(toggleField)}" style="display: none;">{{ $store.getters.getSettings.texts.required_msg }}</span>
                        </div>
                    </span>
                </div>
                
                <div class="calc-item__description before">
                    <span>{{ toggleField.description }}</span>
                </div>
                
                <div :class="['calc-toggle-container', boxStyle, 'boxed-with-toggle-and-description', 'calc_' + toggleField.alias, toggleView, {'calc-field-disabled': getStep === 'finish'}]">
                    <div class="calc-toggle-item" :class="{'calc-is-checked': element.isChecked}" v-for="( element, index ) in getOptions" @click="toggleTrigger(index)">
                        <div class="calc-toggle-wrapper">
                            <input :ref="toggleLabel" :id="toggleLabel + index" type="checkbox" :checked="element.isChecked" :value="element.value" @change="change(event, element.label)"/>
                            <label></label>
                        </div>
                        <div class="calc-toggle-label-wrap">
                            <span class="calc-toggle-label">{{ element.label }}</span>
                            <span class="calc-toggle-description" v-if="element.hint" v-html="element.hint"></span>
                        </div>
                    </div>
                </div>
                
                <div class="calc-item__description after">
                    <span>{{ toggleField.description }}</span>
                </div>
            </div>
        `
}