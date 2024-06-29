<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { ref } from 'vue'
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
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElMessageBox,
  ElMessage
} from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { useIcon } from '@/hooks/web/useIcon'
import exportData from '../export/exportData.vue'
import { delDataApi } from '@/api/asset'
const { t } = useI18n()

const props = defineProps<{
  getList: () => void
  handleSearch: (string) => void
  searchKeywordsData: {
    keyword: string
    example: string
    explain: string
  }[]
  index: string
  getElTableExpose: () => void
}>()
const searchHelpData = [
  {
    operator: '=',
    meaning: t('searchHelp.like')
  },
  {
    operator: '!=',
    meaning: t('searchHelp.notIn')
  },
  {
    operator: '==',
    meaning: t('searchHelp.equal')
  },
  {
    operator: '&&',
    meaning: t('searchHelp.and')
  },
  {
    operator: '||',
    meaning: t('searchHelp.or')
  },
  {
    operator: '()',
    meaning: t('searchHelp.brackets')
  }
]

const dialogVisible = ref(false)
const getHelp = () => {
  dialogVisible.value = true
}
function tableHeaderColor() {
  return { background: 'var(--el-fill-color-light)' }
}
const searchParams = ref('')
const searchicon = useIcon({ icon: 'iconoir:search' })
const help = useIcon({ icon: 'tdesign:chat-bubble-help' })
const elDropdownicon = useIcon({ icon: 'ri:arrow-drop-down-line' })
const exporticon = useIcon({ icon: 'ph:export-light' })
const deleteicon = useIcon({ icon: 'openmoji:delete' })
const exportDialogVisible = ref(false)
const openExport = () => {
  exportDialogVisible.value = true
}
const ids = ref<string[]>([])
const delSelect = async () => {
  ElMessageBox.confirm('Whether to delete?', 'Warning', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  })
    .then(async () => {
      const elTableExpose = await props.getElTableExpose()
      const selectedRows = elTableExpose?.getSelectionRows() || []
      ids.value = selectedRows.map((row) => row.id)
      console.log(ids)
      await delDataApi(ids.value, props.index)
      props.getList()
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled'
      })
    })
}
</script>

<template>
  <ContentWrap style="height: 80px">
    <!-- <ElRow justify="start">
      <ElCol :span="1">
        <ElText>{{ t('form.input') }}:</ElText>
      </ElCol>
      <ElCol :span="5">
        <ElInput v-model="searchParams" :placeholder="t('common.inputText')" style="height: 38px" />
      </ElCol>
      <ElCol :span="5">
        <ElButton type="primary" :icon="searchicon" @click="props.handleSearch(searchParams)">
          Search
        </ElButton>
      </ElCol>
    </ElRow> -->
    <ElRow class="row-bg" :gutter="20">
      <ElCol :span="8">
        <ElForm>
          <ElFormItem
            :label="t('form.input')"
            size="large"
            label-width="auto"
            style="max-width: 600px"
          >
            <ElInput v-model="searchParams" @keyup.enter="$props.handleSearch(searchParams)">
              <template #append>
                <ElButton
                  @click="getHelp"
                  text
                  class="icon-button"
                  :icon="help"
                  style="display: contents"
                />
              </template>
            </ElInput>
          </ElFormItem>
        </ElForm>
      </ElCol>
      <ElCol :span="12">
        <div class="flex flex-wrap items-center mb-4">
          <ElButton
            size="large"
            type="primary"
            :icon="searchicon"
            @click="$props.handleSearch(searchParams)"
          >
            {{ t('form.input') }}
          </ElButton>
          <ElButton size="large" type="primary" @click="openExport" :icon="exporticon">
            {{ t('asset.export') }}
          </ElButton>
          <ElDivider direction="vertical" />
          <ElDropdown trigger="click">
            <ElButton plain class="custom-button align-bottom">
              {{ t('common.operation') }}
              <ElIcon class="el-icon--right"><elDropdownicon /></ElIcon>
            </ElButton>
            <template #dropdown>
              <ElDropdownMenu>
                <ElDropdownItem :icon="deleteicon" @click="delSelect">{{
                  t('common.delete')
                }}</ElDropdownItem>
              </ElDropdownMenu>
            </template>
          </ElDropdown>
        </div>
      </ElCol>
    </ElRow>
  </ContentWrap>
  <Dialog
    v-model="dialogVisible"
    :title="t('common.querysyntax')"
    center
    style="border-radius: 15px; box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3)"
  >
    <ElRow>
      <ElCol>
        <ElText tag="b" size="small">{{ t('searchHelp.operator') }}</ElText>
        <ElDivider direction="vertical" />
        <ElText size="small" type="danger">{{ t('searchHelp.notice') }}</ElText>
      </ElCol>
      <ElCol style="margin-top: 10px">
        <ElTable :headerCellStyle="tableHeaderColor" :data="searchHelpData">
          <ElTableColumn prop="operator" :label="t('searchHelp.operator')" width="300" />
          <ElTableColumn prop="meaning" :label="t('searchHelp.meaning')" />
        </ElTable>
      </ElCol>
      <ElCol style="margin-top: 15px">
        <ElText tag="b" size="small">{{ t('searchHelp.keywords') }}</ElText>
      </ElCol>
      <ElCol style="margin-top: 10px">
        <ElTable :headerCellStyle="tableHeaderColor" :data="$props.searchKeywordsData">
          <ElTableColumn prop="keyword" :label="t('searchHelp.keywords')" />
          <ElTableColumn prop="example" :label="t('searchHelp.example')" />
          <ElTableColumn prop="explain" :label="t('searchHelp.explain')" />
        </ElTable>
      </ElCol>
    </ElRow>
  </Dialog>
  <Dialog
    v-model="exportDialogVisible"
    :title="t('asset.export')"
    center
    max-height="300"
    width="auto"
    style="border-radius: 15px; box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3)"
  >
    <exportData :index="$props.index" :searchParams="searchParams" />
  </Dialog>
</template>
<style scoped>
.custom-button:hover {
  background-color: transparent !important;
  color: inherit !important;
  box-shadow: none !important;
  border-color: inherit !important;
  border-width: 1px !important;
}
</style>
