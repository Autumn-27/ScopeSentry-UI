<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { reactive, ref } from 'vue'
import { FormSchema } from '@/components/Form'
import {
  ElCol,
  ElRow,
  ElButton,
  ElTable,
  ElTableColumn,
  ElText,
  ElDivider,
  ElInput,
  ElForm,
  ElFormItem,
  ElTabs
} from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { Icon } from '@iconify/vue'
import { useIcon } from '@/hooks/web/useIcon'
// import exportData from '../export/exportData.vue'
const { t } = useI18n()

const props = defineProps<{
  getList: () => void
  handleSearch: (string) => void
  searchKeywordsData: {
    keyword: string
    example: string
    explain: string
  }[]
}>()
</script>

<template>
  <ElTabs tab-position="tabPosition">
    <ElTabPane />
  </ElTabs>
</template>
