/**
 * useMenuCRUD - 菜单增删改查 Composable
 *
 * 负责菜单节点的增删改查操作
 */
import { type Ref, ref } from 'vue'
import type { MenuNode } from '@/types'
import type { TreeTableNode } from '@/components/ui/tree-table/types'
import { SunMessage, SunMessageBox } from '@/utils/message'

export function useMenuCRUD(menus: Ref<MenuNode[]>, saveMenuData: () => void) {
  const selectedKeys = ref<Array<string | number>>([])

  // 硬编码的默认数据 ID 列表（从外部传入）
  let hardcodedIds: Set<string> = new Set()

  /**
   * 设置硬编码 ID 列表
   */
  function setHardcodedIds(ids: Set<string>) {
    hardcodedIds = ids
  }

  /**
   * 检查节点是否为硬编码数据
   */
  function isHardcodedNode(nodeId: string | number): boolean {
    return hardcodedIds.has(String(nodeId))
  }

  /**
   * 查找节点
   */
  function findNodeById(nodes: MenuNode[], id: string): MenuNode | null {
    for (const node of nodes) {
      if (node.id === id) return node
      const child = findNodeById(node.children ?? [], id)
      if (child) return child
    }
    return null
  }

  /**
   * 收集节点及其子节点的所有 ID
   */
  function collectIds(node: MenuNode | null): Array<string | number> {
    if (!node) return []
    return [node.id, ...(node.children ?? []).flatMap((child) => collectIds(child))]
  }

  /**
   * 删除单个节点
   */
  function removeNode(nodes: MenuNode[], targetId: string): MenuNode[] {
    return nodes
      .filter((node) => node.id !== targetId)
      .map((node) => ({
        ...node,
        children: node.children ? removeNode(node.children, targetId) : undefined,
      }))
  }

  /**
   * 批量删除节点
   */
  function batchRemoveNodes(nodes: MenuNode[], keysToDelete: Set<string>): MenuNode[] {
    return nodes
      .filter((node) => !keysToDelete.has(String(node.id)))
      .map((node) => ({
        ...node,
        children: node.children ? batchRemoveNodes(node.children, keysToDelete) : undefined,
      }))
  }

  /**
   * 添加节点
   */
  function addNode(newNode: MenuNode, parentNode?: MenuNode | null) {
    if (parentNode) {
      // 使用展开运算符创建新数组，确保触发 Vue 响应式更新
      parentNode.children = [...(parentNode.children || []), newNode]
      SunMessage.success(`子节点已添加到 ${parentNode.name}`)
    } else {
      // 使用展开运算符创建新数组，确保触发 Vue 响应式更新
      menus.value = [...menus.value, newNode]
      SunMessage.success('根节点已添加')
    }
    saveMenuData()
  }

  /**
   * 更新节点
   */
  function updateNode(node: MenuNode, formData: Omit<MenuNode, 'id' | 'children'>) {
    Object.assign(node, formData)
    SunMessage.success('节点已更新')
    saveMenuData()
  }

  /**
   * 删除节点（带确认对话框）
   */
  async function deleteNode(row: TreeTableNode) {
    const sourceNode = findNodeById(menus.value, String(row.id ?? ''))
    if (!sourceNode) return

    if (isHardcodedNode(sourceNode.id)) {
      SunMessage.warning('默认菜单数据不允许删除')
      return
    }

    try {
      await SunMessageBox.confirm(
        `确定删除节点 "${sourceNode.name}" 及其所有子节点吗？`,
        '删除确认',
        {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
    } catch {
      return
    }

    const removedIds = collectIds(sourceNode)
    menus.value = removeNode(menus.value, String(sourceNode.id))
    selectedKeys.value = selectedKeys.value.filter((key) => !removedIds.includes(key))
    saveMenuData()
    SunMessage.success('节点已删除')
  }

  /**
   * 批量删除（带确认对话框）
   */
  async function batchDelete() {
    if (selectedKeys.value.length === 0) {
      SunMessage.warning('请先选择要删除的节点')
      return
    }

    const deletableKeys = selectedKeys.value.filter((key) => !isHardcodedNode(key))

    if (deletableKeys.length === 0) {
      SunMessage.warning('选中的节点都是默认数据，不允许删除')
      return
    }

    if (deletableKeys.length < selectedKeys.value.length) {
      const skippedCount = selectedKeys.value.length - deletableKeys.length
      SunMessage.info(`已跳过 ${skippedCount} 个默认数据节点`)
    }

    try {
      await SunMessageBox.confirm(
        `确定删除选中的 ${deletableKeys.length} 个节点及其子节点吗？`,
        '批量删除确认',
        {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
    } catch {
      return
    }

    const keysToDelete = new Set(deletableKeys.map(String))
    menus.value = batchRemoveNodes(menus.value, keysToDelete)
    selectedKeys.value = []
    saveMenuData()
    SunMessage.success(`已删除 ${keysToDelete.size} 个节点`)
  }

  return {
    selectedKeys,
    setHardcodedIds,
    isHardcodedNode,
    findNodeById,
    addNode,
    updateNode,
    deleteNode,
    batchDelete,
  }
}
