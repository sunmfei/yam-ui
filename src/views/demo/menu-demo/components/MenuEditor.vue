<template>
  <div class="menu-editor-container">
    <!-- 操作栏 -->
    <div class="toolbar mb-4 flex items-center justify-between">
      <div class="flex gap-2">
        <button
          class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          @click="showAddDialog(null)"
        >
          <Plus class="h-4 w-4" />
          添加根菜单
        </button>
        <button
          class="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          @click="handleReset"
        >
          <RotateCcw class="h-4 w-4" />
          重置默认
        </button>
      </div>
      <div class="flex gap-2">
        <button
          class="inline-flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600"
          @click="handleSaveLocal"
        >
          <Download class="h-4 w-4" />
          保存到本地
        </button>
        <button
          class="inline-flex items-center gap-2 rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-yellow-600 disabled:opacity-50"
          :disabled="saving"
          @click="handleSaveServer"
        >
          <Upload class="h-4 w-4" />
          {{ saving ? '保存中...' : '保存到服务器' }}
        </button>
      </div>
    </div>

    <!-- 表格 -->
    <div class="rounded-xl border bg-card">
      <div class="min-h-[400px]">
        <MenuTreeItem
          v-for="item in menuData"
          :key="item.id || item.name"
          :item="item"
          :level="0"
          @add="showAddDialog"
          @edit="showEditDialog"
          @delete="handleDelete"
        />
        <div
          v-if="menuData.length === 0"
          class="flex items-center justify-center py-12 text-muted-foreground"
        >
          暂无菜单数据
        </div>
      </div>
    </div>

    <!-- 添加/编辑对话框 -->
    <div
      v-if="dialogVisible"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      @click.self="dialogVisible = false"
    >
      <div
        class="w-full max-w-[600px] rounded-xl bg-background p-6 shadow-xl animate-in zoom-in-95"
      >
        <h2 class="mb-4 text-xl font-semibold">{{ isEdit ? '编辑菜单' : '添加菜单' }}</h2>
        <div class="space-y-4">
          <div>
            <label class="mb-2 block text-sm font-medium">
              名称
              <span class="text-destructive">*</span>
            </label>
            <input
              v-model="formData.name"
              type="text"
              placeholder="请输入菜单名称"
              class="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium">图标</label>
            <input
              v-model="formData.icon"
              type="text"
              placeholder="图标名称，如：Menu"
              class="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium">
              渲染类型
              <span class="text-destructive">*</span>
            </label>
            <select
              v-model="formData.type"
              class="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="button">按钮 (button)</option>
              <option value="route">路由 (route)</option>
              <option value="dropdown">下拉菜单 (dropdown)</option>
              <option value="list">列表菜单 (list)</option>
            </select>
          </div>
          <div v-if="formData.type === 'route'">
            <label class="mb-2 block text-sm font-medium">路由路径</label>
            <input
              v-model="formData.path"
              type="text"
              placeholder="/path/to/page"
              class="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div v-if="formData.type === 'button'">
            <label class="mb-2 block text-sm font-medium">动作 Key</label>
            <input
              v-model="formData.actionKey"
              type="text"
              placeholder="action-key-name"
              class="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium">排序</label>
            <input
              v-model.number="formData.order"
              type="number"
              :min="0"
              class="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
        <div class="mt-6 flex justify-end gap-3">
          <button
            class="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
            @click="dialogVisible = false"
          >
            取消
          </button>
          <button
            class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            @click="handleSubmit"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Plus, RotateCcw, Download, Upload } from 'lucide-vue-next'
import type { MenuNode } from '@/types/menu'
import { ElMessage, ElMessageBox } from '@/utils/message'
import MenuTreeItem from './MenuTreeItem.vue'

// Props
interface Props {
  data: MenuNode[]
  saving?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  saving: false,
})

// Emits
const emit = defineEmits<{
  update: [data: MenuNode[]]
  saveLocal: []
  saveServer: []
  reset: []
}>()

// 内部数据
const menuData = ref<MenuNode[]>([])

// 同步外部数据
watch(
  () => props.data,
  (newData) => {
    menuData.value = JSON.parse(JSON.stringify(newData))
  },
  { immediate: true, deep: true }
)

// 监听内部变化，同步到外部
watch(
  menuData,
  (newData) => {
    emit('update', newData)
  },
  { deep: true }
)

// 对话框状态
const dialogVisible = ref(false)
const isEdit = ref(false)
const editingParent = ref<MenuNode | null>(null)
const editingItem = ref<MenuNode | null>(null)
const formData = ref<Partial<MenuNode>>({
  name: '',
  icon: 'Menu',
  type: 'button',
  path: '',
  actionKey: '',
  order: 0,
})

// 类型守卫
function _hasPath(menu: MenuNode): boolean {
  return menu.type === 'route' || (!!menu.path && typeof menu.path === 'string')
}

function _hasAction(menu: MenuNode): boolean {
  return !!menu.actionKey && typeof menu.actionKey === 'string'
}

function _getTypeLabel(type?: string): string {
  const labels: Record<string, string> = {
    button: '按钮',
    dropdown: '下拉',
    list: '列表',
  }
  return labels[type || 'button'] || '按钮'
}

// 显示添加对话框
function showAddDialog(parent: MenuNode | null) {
  isEdit.value = false
  editingParent.value = parent
  editingItem.value = null
  formData.value = {
    name: '',
    icon: 'Menu',
    type: 'button',
    path: '',
    order: parent?.children?.length || menuData.value.length + 1,
  }
  dialogVisible.value = true
}

// 显示编辑对话框
function showEditDialog(item: MenuNode) {
  isEdit.value = true
  editingItem.value = item

  // 找到父级
  editingParent.value = findParent(menuData.value, item)

  formData.value = {
    name: item.name,
    icon: item.icon || '',
    type: item.type || 'button',
    path: item.path || '',
    order: item.order || 0,
  }
  dialogVisible.value = true
}

// 查找父节点
function findParent(items: MenuNode[], target: MenuNode): MenuNode | null {
  for (const item of items) {
    if (item.children && Array.isArray(item.children)) {
      if (item.children.includes(target)) {
        return item
      }
      const found = findParent(item.children, target)
      if (found) return found
    }
  }
  return null
}

// 提交表单
function handleSubmit() {
  if (!formData.value.name) {
    ElMessage.warning('请输入菜单名称')
    return
  }

  const newItem: MenuNode = {
    id: `menu-${Date.now()}`,
    name: formData.value.name!,
    icon: formData.value.icon || undefined,
    type: formData.value.type as MenuNode['type'],
    path: formData.value.path || undefined,
    actionKey: formData.value.actionKey || undefined,
    order: formData.value.order || 0,
  }

  if (isEdit.value && editingItem.value) {
    // 编辑模式
    Object.assign(editingItem.value, newItem)
    ElMessage.success('编辑成功')
  } else {
    // 添加模式
    if (editingParent.value) {
      // 添加子菜单
      if (!editingParent.value.children) {
        editingParent.value.children = []
      }
      if (!Array.isArray(editingParent.value.children)) {
        editingParent.value.children = []
      }
      ;(editingParent.value.children as MenuNode[]).push(newItem)
    } else {
      // 添加根菜单
      menuData.value.push(newItem)
    }
    ElMessage.success('添加成功')
  }

  dialogVisible.value = false
}

// 删除菜单
function handleDelete(item: MenuNode) {
  ElMessageBox.confirm('确定要删除这个菜单项吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    removeFromTree(menuData.value, item)
    ElMessage.success('删除成功')
  })
}

// 从树中删除节点
function removeFromTree(items: MenuNode[], target: MenuNode): boolean {
  const index = items.indexOf(target)
  if (index !== -1) {
    items.splice(index, 1)
    return true
  }

  for (const item of items) {
    if (item.children && Array.isArray(item.children)) {
      if (removeFromTree(item.children, target)) {
        return true
      }
    }
  }
  return false
}

// 保存操作
function handleSaveLocal() {
  emit('saveLocal')
}

function handleSaveServer() {
  emit('saveServer')
}

function handleReset() {
  emit('reset')
}
</script>

<style scoped lang="scss">
.menu-editor-container {
  padding: 1rem;
}

.toolbar {
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
