<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { ref, reactive } from 'vue'
import { ElButton, ElCol, ElInput, ElRow, ElText } from 'element-plus'
import { Table, TableColumn } from '@/components/Table'
import { Dialog } from '@/components/Dialog'
import { Icon } from '@/components/Icon'
import { useTable } from '@/hooks/web/useTable'
import { useIcon } from '@/hooks/web/useIcon'
import { BaseButton } from '@/components/Button'
import { getFingerprintDataApi, deleteFingerprintDataApi } from '@/api/fingerprint'
import Detail from './components/Detail.vue'
const searchicon = useIcon({ icon: 'iconoir:search' })
const { t } = useI18n()
const search = ref('')
const handleSearch = () => {
  getList()
}
const nodeColums = reactive<TableColumn[]>([
  {
    field: 'selection',
    type: 'selection',
    width: '55'
  },
  {
    field: 'id',
    hidden: true
  },
  {
    field: 'name',
    label: t('fingerprint.name'),
    minWidth: 40
  },
  {
    field: 'rule',
    label: t('fingerprint.rule'),
    minWidth: 100
  },
  {
    field: 'category',
    label: t('fingerprint.category'),
    minWidth: 30
  },
  {
    field: 'parent_category',
    label: t('fingerprint.parentCategory'),
    minWidth: 30
  },
  {
    field: 'amount',
    label: t('fingerprint.amount'),
    minWidth: 20
  },
  {
    field: 'state',
    label: t('common.state'),
    minWidth: 30,
    formatter: (_: Recordable, __: TableColumn, stateValue: boolean) => {
      if (stateValue == null) {
        return <div></div>
      }
      let color = ''
      let flag = ''
      if (stateValue == true) {
        color = '#2eb98a'
        flag = t('common.on')
      } else {
        color = 'red'
        flag = t('common.off')
      }
      return (
        <ElRow gutter={20}>
          <ElCol span={1}>
            <Icon icon="clarity:circle-solid" color={color} size={10} />
          </ElCol>
          <ElCol span={5}>
            <ElText type="info">{flag}</ElText>
          </ElCol>
        </ElRow>
      )
    }
  },
  {
    field: 'action',
    label: t('tableDemo.action'),
    minWidth: 40,
    formatter: (row, __: TableColumn, _: number) => {
      return (
        <>
          <BaseButton type="primary" onClick={() => edit(row)}>
            {t('common.edit')}
          </BaseButton>
          <BaseButton type="danger" onClick={() => del(row)}>
            {t('common.delete')}
          </BaseButton>
        </>
      )
    }
  }
])
const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { currentPage, pageSize } = tableState
    const res = await getFingerprintDataApi(search.value, currentPage.value, pageSize.value)
    return {
      list: res.data.list,
      total: res.data.total
    }
  }
})
const { loading, dataList, total, currentPage, pageSize } = tableState
const { getList, getElTableExpose } = tableMethods
function tableHeaderColor() {
  return { background: 'var(--el-fill-color-light)' }
}
const dialogVisible = ref(false)
const addSensitive = async () => {
  fingerprintForm.id = ''
  fingerprintForm.rule = ''
  fingerprintForm.category = ''
  fingerprintForm.parent_category = ''
  fingerprintForm.name = ''
  fingerprintForm.state = true
  dialogVisible.value = true
}
const closeDialog = () => {
  dialogVisible.value = false
}
let fingerprintForm = reactive({
  id: '',
  name: '',
  rule: '',
  category: '',
  parent_category: '',
  state: true
})
const edit = (data) => {
  fingerprintForm.id = data.id
  fingerprintForm.rule = data.rule
  fingerprintForm.category = data.category
  fingerprintForm.parent_category = data.parent_category
  fingerprintForm.name = data.name
  fingerprintForm.state = data.state
  dialogVisible.value = true
}
const delLoading = ref(false)
const del = async (data) => {
  delLoading.value = true
  try {
    const res = await deleteFingerprintDataApi([data.id])
    console.log('Data deleted successfully:', res)
    delLoading.value = false
    getList()
  } catch (error) {
    console.error('Error deleting data:', error)
    delLoading.value = false
    getList()
  }
}
const ids = ref<string[]>([])
const delSelect = async () => {
  const elTableExpose = await getElTableExpose()
  const selectedRows = elTableExpose?.getSelectionRows() || []
  ids.value = selectedRows.map((row) => row.id)
  delLoading.value = true
  try {
    const res = await deleteFingerprintDataApi(ids.value)
    console.log('Data deleted successfully:', res)
    delLoading.value = false
    getList()
  } catch (error) {
    console.error('Error deleting data:', error)
    delLoading.value = false
    getList()
  }
}
const confirmDelete = async () => {
  const confirmed = window.confirm('Are you sure you want to delete the selected data?')
  if (confirmed) {
    await delSelect()
  }
}
</script>

<template>
  <ContentWrap>
    <ElRow :gutter="20" style="margin-bottom: 15px">
      <ElCol :span="1">
        <ElText class="mx-1" style="position: relative; top: 8px; left: 30%"
          >{{ t('fingerprint.name') }} :</ElText
        >
      </ElCol>
      <ElCol :span="5">
        <ElInput v-model="search" :placeholder="t('common.inputText')" style="height: 38px" />
      </ElCol>
      <ElCol :span="5">
        <ElButton type="primary" :icon="searchicon" style="height: 38px" @click="handleSearch"
          >Search</ElButton
        >
      </ElCol>
    </ElRow>
    <ElRow :gutter="60">
      <ElCol :span="1">
        <div class="mb-10px">
          <ElButton type="primary" @click="addSensitive">{{ t('common.new') }}</ElButton>
        </div>
      </ElCol>
      <ElCol :span="1">
        <div class="mb-10px">
          <BaseButton type="danger" :loading="delLoading" @click="confirmDelete">
            {{ t('common.delete') }}
          </BaseButton>
        </div>
      </ElCol>
    </ElRow>
    <Table
      v-model:pageSize="pageSize"
      v-model:currentPage="currentPage"
      :columns="nodeColums"
      :data="dataList"
      stripe
      :border="true"
      :loading="loading"
      :resizable="true"
      :pagination="{
        total: total,
        pageSizes: [10, 20, 50, 100, 200, 500, 1000]
      }"
      @register="tableRegister"
      :headerCellStyle="tableHeaderColor"
      :style="{
        fontFamily:
          '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji'
      }"
    />
  </ContentWrap>
  <Dialog
    v-model="dialogVisible"
    :title="fingerprintForm.id ? $t('common.edit') : $t('common.new')"
    center
    style="border-radius: 15px; box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3)"
    :maxHeight="350"
  >
    <Detail :closeDialog="closeDialog" :fingerprintForm="fingerprintForm" :getList="getList" />
  </Dialog>
</template>
