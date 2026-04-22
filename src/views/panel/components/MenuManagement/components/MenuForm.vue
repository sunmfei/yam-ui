<script setup lang="ts">
import type { MenuNode } from '@/types'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import SunIconPicker from '@/components/business/sun-icon-picker/SunIconPicker.vue'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formFields } from '../data/menu.from.data'

/**
 * MenuForm - 菜单表单组件
 *
 * 纯表单组件，包含完整的验证和提交逻辑
 * 使用 shadcn-vue Form + vee-validate 进行表单验证
 */
defineOptions({
  name: 'MenuForm',
})

interface Props {
  isEditMode: boolean
  formData: Omit<MenuNode, 'id' | 'children'>
}

interface Emits {
  (e: 'submit', value: Omit<MenuNode, 'id' | 'children'>): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 定义表单验证 schema
const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, '节点名称不能为空'),
    type: z.enum(['route', 'action', 'menu', 'select', 'option', 'button', 'dropdown', 'list']),
    path: z.string().optional(),
    actionKey: z.string().optional(),
    icon: z.string().optional(),
    order: z.number().min(0, '排序号不能小于0').optional(),
    hidden: z.boolean().default(false),
    disabled: z.boolean().default(false),
  })
)

// 初始化表单
const {
  values,
  setFieldValue,
  validate: validateForm,
} = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: props.formData.name ?? '',
    type: props.formData.type ?? 'route',
    path: props.formData.path ?? '',
    actionKey: props.formData.actionKey ?? '',
    icon: props.formData.icon ?? '',
    order: props.formData.order ?? 0,
    hidden: props.formData.hidden ?? false,
    disabled: props.formData.disabled ?? false,
  },
})

function shouldShowField(field: { showWhen?: (formData: Record<string, unknown>) => boolean }) {
  if (field.showWhen) {
    return field.showWhen(values as Record<string, unknown>)
  }
  return true
}

// 暴露验证和提交方法给父组件
defineExpose({
  validate: async () => {
    const { valid } = await validateForm()
    return valid
  },
  getValues: () => values,
  submit: async () => {
    // 先验证，验证通过后再提交
    const { valid } = await validateForm()
    if (valid) {
      emit('submit', { ...values } as Omit<MenuNode, 'id' | 'children'>)
    }
  },
})
</script>

<template>
  <div class="space-y-4">
    <div v-for="field in formFields" v-show="shouldShowField(field)" :key="field.key">
      <FormField :name="field.key">
        <FormItem>
          <FormLabel>
            {{ field.label }}
            <span v-if="field.required" class="text-destructive">*</span>
          </FormLabel>
          <FormControl>
            <!-- 文本输入 -->
            <Input
              v-if="field.type === 'text'"
              :placeholder="field.placeholder"
              :model-value="String(values[field.key as keyof typeof values] ?? '')"
              @update:model-value="(val) => setFieldValue(field.key as keyof typeof values, val)"
            />

            <!-- 数字输入 -->
            <Input
              v-else-if="field.type === 'number'"
              type="number"
              :min="field.min"
              :placeholder="field.placeholder"
              :model-value="Number(values[field.key as keyof typeof values] ?? 0)"
              @update:model-value="
                (val) => setFieldValue(field.key as keyof typeof values, Number(val))
              "
            />

            <!-- 下拉选择 -->
            <Select
              v-else-if="field.type === 'select'"
              :model-value="String(values[field.key as keyof typeof values])"
              @update:model-value="
                (val) => setFieldValue(field.key as keyof typeof values, (val as string) ?? '')
              "
            >
              <SelectTrigger>
                <SelectValue :placeholder="field.placeholder" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="opt in field.options" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </SelectItem>
              </SelectContent>
            </Select>

            <!-- 图标选择器 -->
            <SunIconPicker
              v-else-if="field.type === 'icon-picker'"
              :model-value="String(values[field.key as keyof typeof values] || '')"
              :is-block="true"
              @update:model-value="(val) => setFieldValue(field.key as keyof typeof values, val)"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>

    <!-- 状态选项 -->
    <div class="flex gap-6 pt-2">
      <div>
        <FormField name="hidden">
          <FormItem class="flex flex-row items-center justify-between rounded-lg border p-4">
            <div class="space-y-0.5">
              <FormLabel class="text-base">隐藏节点</FormLabel>
            </div>
            <FormControl>
              <Switch
                :checked="values.hidden"
                @update:checked="(val: boolean) => setFieldValue('hidden', val)"
              />
            </FormControl>
          </FormItem>
        </FormField>
      </div>

      <div>
        <FormField name="disabled">
          <FormItem class="flex flex-row items-center justify-between rounded-lg border p-4">
            <div class="space-y-0.5">
              <FormLabel class="text-base">禁用节点</FormLabel>
            </div>
            <FormControl>
              <Switch
                :checked="values.disabled"
                @update:checked="(val: boolean) => setFieldValue('disabled', val)"
              />
            </FormControl>
          </FormItem>
        </FormField>
      </div>
    </div>
  </div>
</template>
