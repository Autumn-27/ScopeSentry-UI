<script setup lang="ts">
import { Table } from '@/components/Table'
import { ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { useRouter } from 'vue-router'
const { t } = useI18n()
const { push } = useRouter()
interface Recordable {
  ID: string
  ProjectName: string
  Logo: string
  AssetCount: number
  TagName: string
}
defineProps({
  tableDataList: {
    type: Array as () => Recordable[],
    default: () => []
  }
})
const loading = ref(false)
const actionClick = (row?: any) => {
  console.log(row)
  push(`/project-management/project-detail?id=${row.ID}`)
}
</script>

<template>
  <Table
    :columns="[]"
    :data="tableDataList"
    :loading="loading"
    custom-content
    :card-wrap-style="{
      width: '200px',
      marginBottom: '20px',
      marginRight: '20px'
    }"
  >
    <template #content="row">
      <div class="flex cursor-pointer" @click="actionClick(row.ID)">
        <div class="pr-16px">
          <img :src="row.Logo" class="w-48px h-48px rounded-[50%]" alt="" />
        </div>
        <div>
          <div class="mb-12px font-700 font-size-16px">{{ row.ProjectName }}</div>
          <div
            class="line-clamp-3 font-size-11px"
            style="color: #b1b3b8; position: relative; top: -6px"
            >{{ t('project.totalAssets') }} : {{ row.AssetCount }}</div
          >
        </div>
      </div>
    </template>
  </Table>
</template>
