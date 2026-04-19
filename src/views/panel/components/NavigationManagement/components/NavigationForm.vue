<script setup lang="ts">
import type { NavigationItem } from '../types/NavigationItem'
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
import { formFields } from '../data/navigation.form.data'

/**
 * NavigationForm - 导航表单组件
 *
 * 纯表单组件，包含完整的验证和提交逻辑
 * 使用 shadcn-vue Form + vee-validate 进行表单验证
 */
defineOptions({
  name: 'NavigationForm',
})

interface Props {
  isEditMode: boolean
  formData: Omit<NavigationItem, 'id' | 'children'>
}

interface Emits {
  (e: 'submit', value: Omit<NavigationItem, 'id' | 'children'>): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 定义表单验证 schema
const formSchema = toTypedSchema(
  z
    .object({
      title: z.string().min(1, '标题不能为空'),
      icon: z.string().optional(),
      path: z.string().optional(),
      description: z.string().optional(),
      openInNewTab: z.boolean().default(true),
      order: z.number().min(0, '排序号不能小于0').optional(),
      hidden: z.boolean().default(false),
      disabled: z.boolean().default(false),
    })
    .superRefine((data, ctx) => {
      // 如果有子节点（分类节点），路径可以为空
      const hasChildren = props.formData.children && props.formData.children.length > 0

      // 如果没有子节点（叶子节点），路径必填且必须是完整 URL
      if (!hasChildren) {
        if (!data.path) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: '导航项必须填写网站地址',
            path: ['path'],
          })
          return
        }

        const path = data.path.trim()
        const isExternalUrl = /^https?:\/\//.test(path)

        if (!isExternalUrl) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: '网站地址必须是完整的 URL（以 http:// 或 https:// 开头）',
            path: ['path'],
          })
        }
      }
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
    title: props.formData.title ?? '',
    icon: props.formData.icon ?? '',
    path: props.formData.path ?? '',
    description: props.formData.description ?? '',
    openInNewTab: props.formData.openInNewTab ?? true,
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
      emit('submit', { ...values } as Omit<NavigationItem, 'id' | 'children'>)
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
          <p v-if="field.hint" class="text-xs text-muted-foreground mt-1">{{ field.hint }}</p>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>

    <!-- 状态选项 -->
    <div class="flex gap-6 pt-2">
      <div>
        <FormField name="openInNewTab">
          <FormItem class="flex flex-row items-center justify-between rounded-lg border p-4">
            <div class="space-y-0.5">
              <FormLabel class="text-base">新窗口打开</FormLabel>
            </div>
            <FormControl>
              <Switch
                :checked="values.openInNewTab"
                @update:checked="(val: boolean) => setFieldValue('openInNewTab', val)"
              />
            </FormControl>
          </FormItem>
        </FormField>
      </div>

      <div>
        <FormField name="hidden">
          <FormItem class="flex flex-row items-center justify-between rounded-lg border p-4">
            <div class="space-y-0.5">
              <FormLabel class="text-base">隐藏</FormLabel>
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
              <FormLabel class="text-base">禁用</FormLabel>
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
