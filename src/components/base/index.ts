/**
 * Base 层组件统一导出
 *
 * 基础组件封装层：所有业务代码必须通过此层访问UI组件
 * 禁止直接使用 @/components/ui/*
 */

export { default as BaseButton } from './button/BaseButton.vue'
export { default as BaseInput } from './input/BaseInput.vue'
export { default as BaseSelect } from './select/BaseSelect.vue'
export { default as BaseModal } from './modal/BaseModal.vue'
export { default as BaseSwitch } from './switch/BaseSwitch.vue'
export { default as BaseTable } from '@/components/modules/table/BaseTable.vue'
export { default as BaseBackground } from './background/BaseBackground.vue'
export { default as BaseContainer } from './container/BaseContainer.vue'
export { default as BaseVanishingInput } from './input/vanishing/BaseVanishingInput.vue'
