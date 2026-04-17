<template>
  <div class="menu-config-container">
    <div class="config-header">
      <h1>菜单配置</h1>
      <p class="subtitle">自定义导航栏菜单项</p>
    </div>

    <div class="config-content">
      <el-card class="menu-list-card">
        <template #header>
          <div class="card-header">
            <span>当前菜单项</span>
            <el-button type="primary" @click="addMenuItem">
              <el-icon><Plus /></el-icon>
              添加菜单项
            </el-button>
          </div>
        </template>

        <el-empty v-if="menuItems.length === 0" description="暂无菜单项" />

        <div v-else class="menu-items-list">
          <div v-for="(item, index) in menuItems" :key="index" class="menu-item-card">
            <div class="item-header">
              <el-icon size="20">
                <component :is="getIconComponent(resolvedIcons[item.name] || 'CircleClose')" />
              </el-icon>
              <span class="item-name">{{ item.name }}</span>
              <div class="item-actions">
                <el-button size="small" @click="editMenuItem(index)">
                  <el-icon><Edit /></el-icon>
                  编辑
                </el-button>
                <el-button size="small" type="danger" @click="deleteMenuItem(index)">
                  <el-icon><Delete /></el-icon>
                  删除
                </el-button>
              </div>
            </div>
            <div class="item-info">
              <el-tag size="small" type="info">{{ item.type || 'button' }}</el-tag>
              <span v-if="hasPath(item)" class="info-text">路径: {{ item.path }}</span>
              <span v-if="item.order !== undefined" class="info-text">排序: {{ item.order }}</span>
            </div>
          </div>
        </div>
      </el-card>

      <el-card class="actions-card">
        <template #header>
          <span>操作</span>
        </template>
        <div class="action-buttons">
          <el-button @click="resetToDefault">
            <el-icon><RefreshLeft /></el-icon>
            重置为默认
          </el-button>
          <el-button type="success" @click="saveConfig">
            <el-icon><Check /></el-icon>
            保存配置
          </el-button>
        </div>
      </el-card>
    </div>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="editingIndex >= 0 ? '编辑菜单项' : '添加菜单项'"
      width="600px"
    >
      <el-form :model="currentItem" label-width="100px">
        <el-form-item label="名称" required>
          <el-input v-model="currentItem.name" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="currentItem.icon" placeholder="Element Plus 图标名称" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="currentItem.type" placeholder="选择类型">
            <el-option label="按钮 (button)" value="button" />
            <el-option label="下拉菜单 (dropdown)" value="dropdown" />
            <el-option label="列表菜单 (list)" value="list" />
          </el-select>
        </el-form-item>
        <el-form-item label="路径">
          <el-input v-model="(currentItem as any).path" placeholder="/path/to/page" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="currentItem.order" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveMenuItem">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete, Check, RefreshLeft } from '@element-plus/icons-vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import type { MenuNode } from '@/types/menu'
import { menuConfig } from '@/utils/menu/MenuUtils'
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

// 获取图标组件
function getIconComponent(iconName: string) {
  // @ts-expect-error - ElementPlusIconsVue is a dynamic object
  return ElementPlusIconsVue[iconName] || ElementPlusIconsVue['CircleClose']
}

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
