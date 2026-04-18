<script setup lang="ts">
import { computed } from 'vue'
import type { MenuNode } from '@/types/menu'
import MenuForm from './MenuForm.vue'
import BaseDialog from '@/components/base/modal/BaseDialog.vue'
import { dialogConfig } from '../data/menu.dialog.data'

/**
 * MenuDialog - 菜单编辑对话框组件
 *
 * 封装 BaseDialog + MenuForm，提供完整的对话框功能
 */
defineOptions({
  name: 'MenuDialog',
})

interface Props {
  open?: boolean
  isEditMode: boolean
  formData: Omit<MenuNode, 'id' | 'children'>
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'update:formData', value: Omit<MenuNode, 'id' | 'children'>): void
  (e: 'confirm'): void
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
})
const emit = defineEmits<Emits>()

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value),
})

const dialogTitle = computed(() =>
  props.isEditMode ? dialogConfig.title.edit : dialogConfig.title.add
)

const confirmButtonLabel = computed(() =>
  props.isEditMode
    ? dialogConfig.buttons.confirm.label.edit
    : dialogConfig.buttons.confirm.label.add
)

function handleCancel() {
  isOpen.value = false
}

function handleConfirm() {
  emit('confirm')
}
</script>

<template>
  <BaseDialog
    v-model:open="isOpen"
    :size="dialogConfig.size"
    :fullscreen="dialogConfig.fullscreen"
    :title="dialogTitle"
    :show-header="true"
    :show-footer="true"
    :buttons="[
      {
        label: dialogConfig.buttons.cancel.label,
        variant: dialogConfig.buttons.cancel.variant,
        onClick: handleCancel,
      },
      {
        label: confirmButtonLabel,
        variant: dialogConfig.buttons.confirm.variant,
        onClick: handleConfirm,
      },
    ]"
  >
    <MenuForm
      :is-edit-mode="isEditMode"
      :form-data="formData"
      @update:form-data="$emit('update:formData', $event)"
    />
  </BaseDialog>
</template>
