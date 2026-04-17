<template>
  <div class="menu-config-container">
    <div class="config-header">
      <h1>菜单配置</h1>
      <p class="subtitle">自定义导航栏菜单项</p>
    </div>

    <div class="config-content">
      <div class="menu-list-card rounded-xl border bg-card p-6 shadow-sm">
        <div class="card-header mb-4 flex items-center justify-between">
          <span class="text-lg font-semibold">当前菜单项</span>
          <button
            class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            @click="addMenuItem"
          >
            <Plus class="h-4 w-4" />
            添加菜单项
          </button>
        </div>

        <div
          v-if="menuItems.length === 0"
          class="flex flex-col items-center justify-center py-12 text-muted-foreground"
        >
          暂无菜单项
        </div>

        <div v-else class="menu-items-list space-y-3">
          <div
            v-for="(item, index) in menuItems"
            :key="index"
            class="menu-item-card rounded-lg border p-4"
          >
            <div class="item-header mb-2 flex items-center gap-3">
              <span class="text-xl">{{ resolvedIcons[item.name] || '📋' }}</span>
              <span class="item-name font-medium">{{ item.name }}</span>
              <div class="item-actions ml-auto flex gap-2">
                <button
                  class="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
                  @click="editMenuItem(index)"
                >
                  <Edit class="h-3 w-3" />
                  编辑
                </button>
                <button
                  class="inline-flex items-center gap-1 rounded-md border border-destructive px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
                  @click="deleteMenuItem(index)"
                >
                  <Trash2 class="h-3 w-3" />
                  删除
                </button>
              </div>
            </div>
            <div class="item-info flex items-center gap-2">
              <span class="rounded bg-muted px-2 py-0.5 text-xs">{{ item.type || 'button' }}</span>
              <span v-if="hasPath(item)" class="info-text text-xs text-muted-foreground">
                路径: {{ item.path }}
              </span>
              <span v-if="item.order !== undefined" class="info-text text-xs text-muted-foreground">
                排序: {{ item.order }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="actions-card rounded-xl border bg-card p-6 shadow-sm">
        <div class="mb-4 text-lg font-semibold">操作</div>
        <div class="action-buttons flex gap-3">
          <button
            class="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
            @click="resetToDefault"
          >
            <RotateCcw class="h-4 w-4" />
            重置为默认
          </button>
          <button
            class="inline-flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600"
            @click="saveConfig"
          >
            <Check class="h-4 w-4" />
            保存配置
          </button>
        </div>
      </div>
    </div>

    <!-- 编辑对话框 -->
    <div
      v-if="dialogVisible"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      @click.self="dialogVisible = false"
    >
      <div
        class="w-full max-w-[600px] rounded-xl bg-background p-6 shadow-xl animate-in zoom-in-95"
      >
        <h2 class="mb-4 text-xl font-semibold">
          {{ editingIndex >= 0 ? '编辑菜单项' : '添加菜单项' }}
        </h2>
        <div class="space-y-4">
          <div>
            <label class="mb-2 block text-sm font-medium">
              名称
              <span class="text-destructive">*</span>
            </label>
            <input
              v-model="currentItem.name"
              type="text"
              placeholder="请输入菜单名称"
              class="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium">图标</label>
            <input
              v-model="currentItem.icon"
              type="text"
              placeholder="图标名称"
              class="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium">类型</label>
            <select
              v-model="currentItem.type"
              class="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="button">按钮 (button)</option>
              <option value="dropdown">下拉菜单 (dropdown)</option>
              <option value="list">列表菜单 (list)</option>
            </select>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium">路径</label>
            <input
              v-model="(currentItem as any).path"
              type="text"
              placeholder="/path/to/page"
              class="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium">排序</label>
            <input
              v-model.number="currentItem.order"
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
            @click="saveMenuItem"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, Edit, Trash2, Check, RotateCcw } from 'lucide-vue-next'
import type { MenuNode } from '@/types/menu'
import { menuConfig } from '@/utils/menu/MenuUtils'
import { ElMessage, ElMessageBox } from '@/utils/message'

const menuItems = ref<MenuNode[]>([])
const dialogVisible = ref(false)
const editingIndex = ref(-1)
const resolvedIcons = ref<Record<string, string>>({})
const currentItem = ref<Partial<MenuNode>>({
  name: '',
  icon: 'Menu',
  type: 'button',
  order: 0,
})

// 解析图标值（处理可能是函数的情况）
async function resolveIconValue(
  icon?: string | (() => string) | (() => Promise<string>)
): Promise<string> {
  if (typeof icon === 'function') {
    const result = icon()
    const resolved = result instanceof Promise ? await result : result
    return resolved || 'CircleClose'
  }
  return icon || 'CircleClose'
}

// 检查菜单项是否有 path 属性
function hasPath(item: MenuNode): boolean {
  return !!item.path && typeof item.path === 'string'
}

// 加载菜单项
async function loadMenuItems() {
  const items = await menuConfig.getMergedMenu()
  menuItems.value = [...items].sort((a, b) => (a.order || 0) - (b.order || 0))

  // 解析所有图标
  await resolveAllIcons()
}

// 解析所有图标
async function resolveAllIcons() {
  const icons: Record<string, string> = {}
  for (const item of menuItems.value) {
    icons[item.name] = await resolveIconValue(item.icon)
  }
  resolvedIcons.value = icons
}

// 添加菜单项
function addMenuItem() {
  editingIndex.value = -1
  currentItem.value = {
    name: '',
    icon: 'Menu',
    type: 'button',
    order: menuItems.value.length,
  }
  dialogVisible.value = true
}

// 编辑菜单项
function editMenuItem(index: number) {
  editingIndex.value = index
  currentItem.value = { ...menuItems.value[index] }
  dialogVisible.value = true
}

// 删除菜单项
async function deleteMenuItem(index: number) {
  try {
    await ElMessageBox.confirm('确定要删除这个菜单项吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    menuItems.value.splice(index, 1)
    ElMessage.success('删除成功')
  } catch {
    // 用户取消
  }
}

// 保存菜单项
function saveMenuItem() {
  if (!currentItem.value.name) {
    ElMessage.warning('请输入菜单名称')
    return
  }

  if (editingIndex.value >= 0) {
    // 编辑模式
    menuItems.value[editingIndex.value] = currentItem.value as MenuNode
    ElMessage.success('更新成功')
  } else {
    // 添加模式
    menuItems.value.push(currentItem.value as MenuNode)
    ElMessage.success('添加成功')
  }

  dialogVisible.value = false
}

// 重置为默认
async function resetToDefault() {
  try {
    await ElMessageBox.confirm('确定要重置为默认配置吗？所有自定义修改将丢失。', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    menuConfig.resetToDefault()
    loadMenuItems()
    ElMessage.success('已重置为默认配置')
  } catch {
    // 用户取消
  }
}

// 保存配置
function saveConfig() {
  // TODO: 实现保存到 localStorage 或后端
  console.log('保存的菜单配置:', menuItems.value)
  ElMessage.success('配置已保存')
}

onMounted(() => {
  loadMenuItems()
})
</script>

<style scoped lang="scss">
.menu-config-container {
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);

  .dark & {
    background: linear-gradient(135deg, rgba(30, 41, 59, 0.3) 0%, rgba(15, 23, 42, 0.2) 100%);
  }
}

.config-header {
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .subtitle {
    color: #6b7280;
    font-size: 1rem;

    .dark & {
      color: #9ca3af;
    }
  }
}

.config-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  gap: 1.5rem;
}

.menu-list-card {
  :deep(.el-card__header) {
    padding: 1rem 1.5rem;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.menu-items-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.menu-item-card {
  padding: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  transition: all 0.3s ease;

  .dark & {
    border-color: rgba(255, 255, 255, 0.1);
  }

  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  .item-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;

    .item-name {
      flex: 1;
      font-weight: 600;
      font-size: 1rem;
    }

    .item-actions {
      display: flex;
      gap: 0.5rem;
    }
  }

  .item-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 0.875rem;
    color: #6b7280;

    .dark & {
      color: #9ca3af;
    }

    .info-text {
      &::before {
        content: '•';
        margin-right: 0.5rem;
      }
    }
  }
}

.actions-card {
  :deep(.el-card__header) {
    padding: 1rem 1.5rem;
  }

  .action-buttons {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
  }
}
</style>
