<template>
  <Table>
    <!-- 表头 -->
    <TableHeader>
      <TableRow>
        <!-- 多选 -->
        <TableHead style="width: 40px"></TableHead>

        <TableHead
          v-for="col in columns"
          :key="col.key"
          :style="{ width: col.width, textAlign: col.align || 'left' }"
        >
          {{ col.title }}
        </TableHead>
      </TableRow>
    </TableHeader>

    <!-- 表体 -->
    <TableBody>
      <TableRow v-for="row in flatData" :key="row[rowKey]">
        <!-- 选择框 -->
        <TableCell>
          <input
            type="checkbox"
            :checked="selectedKeys.includes(row[rowKey])"
            @change="
              () => {
                toggleSelect(row)
                emit('selection-change', selectedKeys)
              }
            "
          />
        </TableCell>

        <!-- 数据列 -->
        <TableCell
          v-for="(col, index) in columns"
          :key="col.key"
          :style="{ textAlign: col.align || 'left' }"
        >
          <div
            class="flex items-center"
            :style="index === 0 ? { paddingLeft: `${row.level * 20}px` } : {}"
          >
            <!-- 展开按钮 -->
            <span
              v-if="index === 0 && (row.children || row.hasChildren)"
              class="cursor-pointer mr-2"
              @click="toggle(row)"
            >
              <span v-if="row.loading">⏳</span>
              <span v-else>
                {{ expandedKeys.includes(row[rowKey]) ? '▼' : '▶' }}
              </span>
            </span>

            <!-- 插槽 -->
            <slot v-if="col.slot" :name="col.slot" :row="row" :value="row[col.key]" />

            <!-- 默认 -->
            <span v-else>
              {{ row[col.key] }}
            </span>
          </div>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>

<script setup lang="ts">
/**
 * ================================
 * TreeTable Pro 最终组件
 * ================================
 * 功能：
 * ✔ 树结构展示
 * ✔ 多选
 * ✔ 懒加载
 * ✔ 插槽
 * ✔ 分页扩展能力
 */

import { toRef } from 'vue'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'

import { useTreeTable } from './data/treeTable.data.ts'
import type { TreeColumn, TreeNode } from './data/treeTable.types.ts'

const props = defineProps<{
  data: TreeNode[]
  columns: TreeColumn[]
  rowKey?: string
}>()

const emit = defineEmits(['load-children', 'selection-change'])

const rowKey = props.rowKey || 'id'

const { flatData, expandedKeys, selectedKeys, toggle, toggleSelect } = useTreeTable(
  toRef(props, 'data'),
  { rowKey },
  emit
)
</script>
