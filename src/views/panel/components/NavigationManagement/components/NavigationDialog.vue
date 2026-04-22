<script setup lang="ts">
import { computed, ref } from 'vue'
import type { NavigationItem } from '@/components/modules/navigation/data/navigation.data'
import NavigationForm from './NavigationForm.vue'
import BaseDialog from '@/components/base/modal/BaseDialog.vue'
import { dialogConfig } from '../data/navigation.dialog.data'

/**
 * NavigationDialog - 菜单编辑对话框组件
 *
 * 封装 BaseDialog + NavigationForm，提供完整的对话框功能
 */
defineOptions({
  name: 'NavigationDialog',
})

interface Props {
  open?: boolean
  isEditMode: boolean
  formData: Omit<NavigationItem, 'id' | 'children'>
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'submit', value: Omit<NavigationItem, 'id' | 'children'>): void
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
})
const emit = defineEmits<Emits>()

// 表单引用
const formRef = ref<InstanceType<typeof NavigationForm> | null>(null)

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

function handleFormSubmit(data: Omit<NavigationItem, 'id' | 'children'>) {
  // 转发提交事件给父组件
  emit('submit', data)
  isOpen.value = false
}

async function handleConfirm() {
  // 调用表单的 submit 方法，触发表单验证和提交
  formRef.value?.submit()
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
    <NavigationForm
      ref="formRef"
      :is-edit-mode="isEditMode"
      :form-data="formData"
      @submit="handleFormSubmit"
    />
  </BaseDialog>
</template>
