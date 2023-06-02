import stylesMixin from '../checkbox-with-image-field-mixin'
export default {
    mixins: [stylesMixin],
    template: `
                <div>
                    <div class="calc-item__title">
                        <span> {{ checkboxField.label }} </span>
                        <span class="ccb-required-mark" v-if="checkboxField.required">*</span>
                        <span v-if="checkboxField.required" class="calc-required-field">
                            <div class="ccb-field-required-tooltip">
                                <span class="ccb-field-required-tooltip-text" :class="{active: $store.getters.isUnused(checkboxField)}" style="display: none;">{{ $store.getters.getSettings.texts.required_msg }}</span>
                            </div>
                        </span>
                    </div>
                    
                    <div class="calc-item__description before">
                        <span>{{ checkboxField.description }}</span>
                    </div>
                    
                    <div :class="['calc-checkbox calc-checkbox-image', boxStyle, 'default', 'calc_' + checkboxField.alias, {'calc-field-disabled': getStep === 'finish'}]">
                        <label :for="checkboxLabel + index" class="calc-checkbox-image-wrapper " v-for="( element, index ) in getOptions" :class="{'calc-checkbox-image-selected': selectedList.includes(element.value)}">
                            <div class="calc-checkbox-image-box">
                                <img :src="element.src" alt="field-img"/>
                            </div>
                            <div class="calc-checkbox-info">
                                <div class="calc-checkbox-title-box">
                                    <span class="calc-checkbox-label">{{ element.label }}</span>
                                    <span class="calc-checkbox-price">Price: {{ element.converted }}</span>
                                </div>
                            </div>
                            <div class="calc-checkbox-item">
                                <input :checked="element.isChecked" type="checkbox" :id="checkboxLabel + index" :value="element.value" @change="change(event, element.label)">
                                <label :for="checkboxLabel + index"></label>
                            </div>
                        </label>
                    </div>
                    
                    <div class="calc-item__description after">
                        <span>{{ checkboxField.description }}</span>
                    </div>
                </div>    
    `
}