<script setup lang="ts">
import { Table } from '@/components/Table'
import { ref } from 'vue'
import { ElAvatar } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { useRouter } from 'vue-router'
const { t } = useI18n()
const { push } = useRouter()
interface Recordable {
  id: string
  name: string
  logo: string
  AssetCount: number
  tag: string
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
const getNameLast = (str) => {
  return str.substring(str.length - 1)
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
      <div class="flex cursor-pointer" @click="actionClick(row.id)">
        <div class="pr-16px">
          <template v-if="row.logo">
            <ElAvatar
              :src="row.logo"
              style="width: 45px; height: 45px; line-height: 45px; font-size: 24px"
              fit="cover"
            />
          </template>
          <template v-else>
            <ElAvatar
              style="
                width: 45px;
                height: 45px;
                line-height: 45px;
                font-size: 24px;
                background-color: cornflowerblue;
              "
            >
              {{ row.name.charAt(0) }}
            </ElAvatar>
          </template>
        </div>
        <div>
          <div class="mb-12px font-700 font-size-16px">{{ row.name }}</div>
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
