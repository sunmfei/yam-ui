/**
 * ================================
 * TreeTable 核心逻辑
 * ================================
 * 功能：
 * 1. 扁平化树数据
 * 2. 控制展开/收起
 * 3. 控制懒加载
 * 4. 多选（含半选逻辑基础）
 */

import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import type { TreeNode } from './treeTable.types'

interface UseTreeTableOptions {
  rowKey: string
}

interface EmitEvents {
  (event: 'load-children', row: TreeNode): void
}

export function useTreeTable(
  dataRef: Ref<TreeNode[]>,
  options: UseTreeTableOptions,
  emit: EmitEvents
) {
  const { rowKey } = options

  const expandedKeys = ref<string[]>([])
  const selectedKeys = ref<string[]>([])

  /**
   * 展开/收起
   */
  function toggle(row: TreeNode) {
    const key = row[rowKey] as string
    const index = expandedKeys.value.indexOf(key)

    if (index > -1) {
      expandedKeys.value.splice(index, 1)
    } else {
      expandedKeys.value.push(key)

      // 懒加载
      if (!row.children && row.hasChildren) {
        row.loading = true
        emit('load-children', row)
      }
    }
  }

  /**
   * 多选
   */
  function toggleSelect(row: TreeNode) {
    const key = row[rowKey] as string
    const index = selectedKeys.value.indexOf(key)

    if (index > -1) {
      selectedKeys.value.splice(index, 1)
    } else {
      selectedKeys.value.push(key)
    }
  }

  /**
   * 扁平化（核心）
   */
  function flatten(data: TreeNode[], level = 0): (TreeNode & { level: number })[] {
    const result: (TreeNode & { level: number })[] = []

    data.forEach((item) => {
      result.push({
        ...item,
        level,
      })

      if (item.children && expandedKeys.value.includes(item[rowKey] as string)) {
        result.push(...flatten(item.children, level + 1))
      }
    })

    return result
  }

  const flatData = computed(() => flatten(dataRef.value))

  return {
    expandedKeys,
    selectedKeys,
    flatData,
    toggle,
    toggleSelect,
  }
}
