<template>
  <div class="menu-editor-container">
    <!-- 操作栏 -->
    <div class="toolbar mb-4 flex justify-between items-center">
      <div class="flex gap-2">
        <el-button type="primary" @click="showAddDialog(null)">
          <el-icon><Plus /></el-icon>
          添加根菜单
        </el-button>
        <el-button @click="handleReset">
          <el-icon><RefreshLeft /></el-icon>
          重置默认
        </el-button>
      </div>
      <div class="flex gap-2">
        <el-button type="success" @click="handleSaveLocal">
          <el-icon><Download /></el-icon>
          保存到本地
        </el-button>
        <el-button type="warning" :loading="saving" @click="handleSaveServer">
          <el-icon><Upload /></el-icon>
          保存到服务器
        </el-button>
      </div>
    </div>

    <!-- 表格 -->
    <el-table
      :data="menuData"
      row-key="name"
      border
      stripe
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      style="width: 100%"
    >
      <el-table-column prop="name" label="名称" min-width="150" />
      <el-table-column prop="icon" label="图标" width="120" />
      <el-table-column prop="type" label="类型" width="120">
        <template #default="{ row }">
          <el-tag size="small">{{ getTypeLabel(row.type) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="路径/动作" min-width="200">
        <template #default="{ row }">
          <span v-if="hasPath(row)" class="text-sm">{{ (row as any).path }}</span>
          <el-tag v-else-if="hasAction(row)" type="warning" size="small">函数</el-tag>
          <span v-else class="text-sm text-gray-400">未配置</span>
        </template>
      </el-table-column>
      <el-table-column prop="order" label="排序" width="80" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button size="small" text type="primary" @click="showAddDialog(row)">
            添加子项
          </el-button>
          <el-button size="small" text type="primary" @click="showEditDialog(row)">编辑</el-button>
          <el-button size="small" text type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑菜单' : '添加菜单'" width="600px">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="名称" required>
          <el-input v-model="formData.name" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="formData.icon" placeholder="图标名称，如：Menu" />
        </el-form-item>
        <el-form-item label="渲染类型" required>
          <el-select v-model="formData.type" placeholder="选择类型">
            <el-option label="按钮 (button)" value="button" />
            <el-option label="路由 (route)" value="route" />
            <el-option label="下拉菜单 (dropdown)" value="dropdown" />
            <el-option label="列表菜单 (list)" value="list" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="formData.type === 'route'" label="路由路径">
          <el-input v-model="formData.path" placeholder="/path/to/page" />
        </el-form-item>
        <el-form-item v-if="formData.type === 'button'" label="动作 Key">
          <el-input v-model="formData.actionKey" placeholder="action-key-name" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="formData.order" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, RefreshLeft, Download, Upload } from '@element-plus/icons-vue'
import type { MenuNode } from '@/types/menu'

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
function hasPath(menu: MenuNode): boolean {
  return menu.type === 'route' || (!!menu.path && typeof menu.path === 'string')
}

function hasAction(menu: MenuNode): boolean {
  return !!menu.actionKey && typeof menu.actionKey === 'string'
}

function getTypeLabel(type?: string): string {
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
    type: formData.value.type as any,
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
