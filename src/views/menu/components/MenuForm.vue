<script setup lang="ts">
import type { MenuNode } from '@/types/menu'
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
 * 纯表单组件，不包含对话框逻辑
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
  (e: 'update:formData', value: Omit<MenuNode, 'id' | 'children'>): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 定义表单验证 schema
const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, '节点名称不能为空'),
    type: z.enum(['route', 'button', 'dropdown', 'list', 'list-item']),
    path: z.string().optional(),
    component: z.string().optional(),
    icon: z.string().optional(),
    order: z.number().min(0, '排序号不能小于0').optional(),
    hidden: z.boolean().default(false),
    disabled: z.boolean().default(false),
  })
)

// 初始化表单
const { values, setFieldValue } = useForm({
  validationSchema: formSchema,
  initialValues: props.formData,
})

// 同步表单值到父组件
const syncToParent = () => {
  emit('update:formData', { ...values })
}

function shouldShowField(field: { showWhen?: (formData: Record<string, unknown>) => boolean }) {
  if (field.showWhen) {
    return field.showWhen(values as Record<string, unknown>)
  }
  return true
}
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
              :model-value="values[field.key]"
              @update:model-value="
                (val) => {
                  setFieldValue(field.key, val)
                  syncToParent()
                }
              "
            />

            <!-- 数字输入 -->
            <Input
              v-else-if="field.type === 'number'"
              type="number"
              :min="field.min"
              :placeholder="field.placeholder"
              :model-value="values[field.key]"
              @update:model-value="
                (val) => {
                  setFieldValue(field.key, Number(val))
                  syncToParent()
                }
              "
            />

            <!-- 下拉选择 -->
            <Select
              v-else-if="field.type === 'select'"
              :model-value="String(values[field.key])"
              @update:model-value="
                (val) => {
                  setFieldValue(field.key, val)
                  syncToParent()
                }
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
              :model-value="String(values[field.key] || '')"
              :is-block="true"
              @update:model-value="
                (val) => {
                  setFieldValue(field.key, val)
                  syncToParent()
                }
              "
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
                @update:checked="
                  (val) => {
                    setFieldValue('hidden', val)
                    syncToParent()
                  }
                "
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
                @update:checked="
                  (val) => {
                    setFieldValue('disabled', val)
                    syncToParent()
                  }
                "
              />
            </FormControl>
          </FormItem>
        </FormField>
      </div>
    </div>
  </div>
</template>
