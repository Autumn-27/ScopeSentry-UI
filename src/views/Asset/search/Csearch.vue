<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { nextTick, onMounted, reactive, ref, watch } from 'vue'
import {
  ElCol,
  ElRow,
  ElButton,
  ElTable,
  ElTableColumn,
  ElText,
  ElDivider,
  ElAutocomplete,
  ElIcon,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElMessageBox,
  ElMessage,
  ElTreeSelect,
  ElTag,
  ElSwitch
} from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { useIcon } from '@/hooks/web/useIcon'
import { Icon } from '@/components/Icon'
import exportData from '../export/exportData.vue'
import { delDataApi } from '@/api/asset'
import { useRoute } from 'vue-router'
import { defineProps, defineEmits } from 'vue'
import { CrudSchema } from '@/hooks/web/useCrudSchemas'
const { t } = useI18n()
const { query } = useRoute()
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
  handleFilterSearch: (string, any) => void
  projectList: Project[]
  dynamicTags?: string[]
  handleClose?: (string) => void
  openAggregation?: () => void
  crudSchemas: Array<CrudSchema>
  statisticsHidden?: boolean
  changeStatisticsHidden?: (boolean) => void
  searchResultCount: number
  activeSegment?: 'tableSegment' | 'cardSegment' // 可选属性
  setActiveSegment?: (segment: 'tableSegment' | 'cardSegment', flag: boolean) => void // 可选方法
}>()
const localSearchKeywordsData = reactive([...props.searchKeywordsData])
const newKeyword = {
  keyword: 'task',
  example: 'task=="test"',
  explain: t('searchHelp.taskName')
}
const tagKeyword = {
  keyword: 'tag',
  example: 'tag=="test"',
  explain: 'find tags'
}
localSearchKeywordsData.push(newKeyword)
localSearchKeywordsData.push(tagKeyword)
const AssignmentHelp = [
  {
    operator: '=',
    meaning: t('searchHelp.like'),
    value: '=""'
  },
  {
    operator: '!=',
    meaning: t('searchHelp.notIn'),
    value: '!=""'
  },
  {
    operator: '==',
    meaning: t('searchHelp.equal'),
    value: '==""'
  }
]
const logicHelp = [
  {
    operator: '&&',
    meaning: t('searchHelp.and'),
    value: '&&',
    logic: '1'
  },
  {
    operator: '||',
    meaning: t('searchHelp.or'),
    value: '||',
    logic: '1'
  },
  {
    operator: '()',
    meaning: t('searchHelp.brackets'),
    value: '()',
    logic: '1'
  }
]
const searchHelpData = AssignmentHelp.concat(logicHelp)
const dialogVisible = ref(false)

// 保存列显示配置到localStorage
const saveColumnConfig = () => {
  const config = props.crudSchemas.reduce((acc, column) => {
    if (column.field != 'select') {
      acc[column.field] = column.hidden
    }
    return acc
  }, {})
  localStorage.setItem(`columnConfig_${props.index}`, JSON.stringify(config))
}

// 从localStorage加载配置
const loadColumnConfig = () => {
  const savedConfig = JSON.parse(localStorage.getItem(`columnConfig_${props.index}`) || '{}')
  props.crudSchemas.forEach((col) => {
    if (savedConfig[col.field] !== undefined) {
      col.hidden = savedConfig[col.field]
    }
  })
}

// 初始化加载配置
loadColumnConfig()
watch(
  () => props.crudSchemas,
  () => {
    saveColumnConfig()
  },
  { deep: true }
)
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
const aggregationIcon = useIcon({ icon: 'carbon:data-vis-1' })
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

const selectedKeyword = ref('')
const opSelect = ref(false)
const opSelect2 = ref(false)
let keyword = ref(true)
let assignmen = ref(false)
let logic = ref(false)
const querySearch = (queryString, cb) => {
  selectedKeyword.value = queryString
  console.log(queryString)
  if (queryString == '') {
    keyword.value = true
    logic.value = false
    assignmen.value = false
  }
  if (keyword.value) {
    console.log('第一')
    if (logic.value) {
      queryString = queryString.replace(selectedKeyword.value, '').trim()
    }
    const results = localSearchKeywordsData.filter((item) => {
      return item.keyword.toLowerCase().includes(queryString.toLowerCase())
    })
    cb(results)
    return
  }
  if (assignmen.value) {
    console.log('第2')
    const searchStr = queryString.replace(selectedKeyword.value, '').trim()
    const results = AssignmentHelp.filter((item) => item.operator.includes(searchStr))
    cb(results)
    return
  }
  if (logic.value && queryString.endsWith(' ')) {
    console.log('第3')
    const searchStr = queryString.replace(searchParams.value, '').trim()
    const results = logicHelp.filter((item) => item.operator.includes(searchStr))
    cb(results)
    return
  }
  cb([])
  return
}

const handleSelect = (item) => {
  console.log(item)
  if (item.keyword) {
    console.log('handleSelect 1')
    let key = ''
    if (logic.value) {
      key = selectedKeyword.value + item.keyword
    } else {
      key = item.keyword
    }
    selectedKeyword.value = key
    searchParams.value = key
    opSelect.value = true
    keyword.value = false
    assignmen.value = true
  } else if (item.logic) {
    console.log('handleSelect 2')
    searchParams.value = `${selectedKeyword.value}${item.value}`
    selectedKeyword.value = searchParams.value
    keyword.value = true
  } else {
    console.log('handleSelect 3')
    searchParams.value = `${selectedKeyword.value}${item.value}`
    selectedKeyword.value = searchParams.value
    opSelect2.value = true
    assignmen.value = false
    logic.value = true
  }
}
interface Project {
  value: string
  label: string
  children?: Project[]
}
const projectLoading = ref(false)
const projectValue = ref([])
const filterChange = async () => {
  console.log(projectValue.value)
  props.handleFilterSearch(searchParams.value, { project: projectValue.value })
}
watch(
  () => projectValue.value,
  (newValue) => {
    filterChange()
  }
)
const localDynamicTags = ref<string[]>(props.dynamicTags ? [...props.dynamicTags] : [])
const tagClickFilterSearch = () => {
  const dictionary: { [key: string]: string[] } = {}
  console.log(localDynamicTags.value)
  console.log('Updated dictionary:', dictionary)
  localDynamicTags.value.forEach((tag) => {
    const [key, value] = tag.split('=')
    if (key in dictionary) {
      dictionary[key].push(value)
    } else {
      dictionary[key] = [value]
    }
  })
  dictionary['project'] = projectValue.value
  console.log('Updated dictionary:', dictionary)
  props.handleFilterSearch(searchParams.value, dictionary)
}
let task = query.task as string
if (task !== undefined && task !== '') {
  localDynamicTags.value.push(`task=${task}`)
}
const savedActiveSegmentConfig = JSON.parse(localStorage.getItem('assetActiveSegment') || '{}')

// 如果配置中有 activeSegment，则使用它，否则使用默认值
if (savedActiveSegmentConfig && savedActiveSegmentConfig.activeSegment) {
  if (props.setActiveSegment) {
    props.setActiveSegment(savedActiveSegmentConfig.activeSegment, false)
  }
}
tagClickFilterSearch()
watch(
  () => props.dynamicTags,
  (newTags) => {
    if (newTags) {
      localDynamicTags.value = [...newTags]
      if (task !== undefined && task !== '') {
        localDynamicTags.value.push(`task=${task}`)
      }
    } else {
      localDynamicTags.value = []
    }
    tagClickFilterSearch()
  },
  { immediate: false }
)
function handleCloseTag(tag: string) {
  if (tag.includes('task=')) {
    task = ''
  }
  if (props.handleClose) {
    props.handleClose(tag)
  } else {
    console.warn('handleClose function is not defined')
  }
}
const emit = defineEmits<{
  (event: 'update-column-visibility', payload: { field: string; hidden: boolean }): void
}>()
// 处理开关变化，通知父组件
const handleSwitchChange = (field) => {
  emit('update-column-visibility', { field: field.field, hidden: field.hidden })
}
const localStatisticsHidden = ref(props.statisticsHidden)
const refreshPage = () => {
  location.reload()
}
// const activeSegment = ref<'tableSegment' | 'cardSegment'>('tableSegment')

// const setActiveSegment = (segment: 'tableSegment' | 'cardSegment') => {
//   activeSegment.value = segment
// }

const tableSegmentIcon = useIcon({ icon: 'icons8:insert-table' })
const cardSegmentIcon = useIcon({ icon: 'flowbite:grid-solid' })
function handleSetActiveSegment(segment: 'tableSegment' | 'cardSegment') {
  if (props.setActiveSegment) {
    props.setActiveSegment(segment, true)
  }
}
</script>

<template>
  <ContentWrap>
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
      <ElCol :span="6">
        <ElAutocomplete
          v-model="searchParams"
          :fetch-suggestions="querySearch"
          :placeholder="t('form.input')"
          popperClass="my-autocomplete"
          @select="handleSelect"
          style="width: 100%"
        >
          <template #append>
            <ElButton @click="getHelp" text style="display: contents" :icon="help">
              <!-- <template #default>
                <ElIcon :icon="help" style="color: black" />
              </template> -->
            </ElButton>
          </template>
          <template #default="{ item }">
            <span style="float: left">{{ item.keyword || item.operator }}</span>
            <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px">
              {{ item.explain || item.meaning }}
            </span>
          </template>
        </ElAutocomplete>
      </ElCol>
      <ElCol :span="1.5"
        ><ElButton type="primary" :icon="searchicon" @click="$props.handleSearch(searchParams)">
          {{ t('form.input') }}
        </ElButton>
      </ElCol>
      <ElCol :span="1.5">
        <ElButton type="primary" @click="openExport" :icon="exporticon">
          {{ t('asset.export') }}
        </ElButton>
      </ElCol>
      <ElCol :span="4">
        <ElTreeSelect
          :loading="projectLoading"
          v-model="projectValue"
          :data="$props.projectList"
          :placeholder="t('project.project')"
          multiple
          filterable
          show-checkbox
          collapse-tags
          :max-collapse-tags="1"
        />
      </ElCol>
      <ElCol :span="1.5" :xs="1.5" :sm="1.5" :md="1.5">
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
              <ElDropdownItem :icon="deleteicon" @click="delSelect">扫描</ElDropdownItem>
            </ElDropdownMenu>
          </template>
        </ElDropdown>
      </ElCol>
      <ElCol :span="1" style="display: flex; align-items: center">
        <ElDropdown>
          <div class="custom-dropdown">
            <Icon icon="ant-design:setting-outlined" class="cursor-pointer" />
          </div>
          <template #dropdown>
            <ElDropdownMenu>
              <ElDropdownItem v-for="(field, i) in crudSchemas" :key="i">
                <div class="dropdown-item" v-if="field.field != 'selection'">
                  <span class="label-text">{{ field.label }}</span>
                  <ElSwitch
                    size="small"
                    v-model="field.hidden"
                    :active-value="false"
                    :inactive-value="true"
                    @change="handleSwitchChange(field)"
                  />
                </div>
              </ElDropdownItem>
              <ElDropdownItem v-if="$props.index == 'asset'">
                <span class="label-text">{{ t('asset.Chart') }}</span>
                <ElSwitch
                  size="small"
                  v-model="localStatisticsHidden"
                  :active-value="false"
                  :inactive-value="true"
                  @change="changeStatisticsHidden(localStatisticsHidden)"
                />
              </ElDropdownItem>
              <ElDropdownItem divided>
                <ElButton style="width: 100%" type="primary" @click="refreshPage">Save</ElButton>
              </ElDropdownItem>
            </ElDropdownMenu>
          </template>
        </ElDropdown>
      </ElCol>
      <ElCol :span="2" style="display: flex; align-items: center" v-if="index == 'asset'">
        <div class="segment-control">
          <div
            class="segment"
            :class="{ active: props.activeSegment === 'tableSegment' }"
            @click="handleSetActiveSegment('tableSegment')"
          >
            <ElIcon>
              <tableSegmentIcon />
            </ElIcon>
          </div>
          <div
            class="segment"
            :class="{ active: props.activeSegment === 'cardSegment' }"
            @click="handleSetActiveSegment('cardSegment')"
          >
            <ElIcon>
              <cardSegmentIcon />
            </ElIcon>
          </div>
        </div>
      </ElCol>
      <ElCol :span="2" :xs="2" :sm="2" :md="2">
        <ElButton
          type="success"
          @click="$props.openAggregation"
          :icon="aggregationIcon"
          v-if="index == 'SensitiveResult'"
        >
          {{ t('project.aggregation') }}
        </ElButton>
      </ElCol>
    </ElRow>
    <ElRow style="margin-top: 10px">
      <ElCol :span="24">
        <div class="flex gap-2">
          <span style="color: #888">{{ t('asset.total') }}</span>
          <span style="font-weight: bold; color: #333333">{{ props.searchResultCount }}</span>
          <span style="color: #888">{{ t('asset.result') }}</span>
          <ElTag
            v-for="tag in localDynamicTags"
            :key="tag"
            closable
            :disable-transitions="false"
            type="info"
            size="small"
            @close="handleCloseTag(tag)"
          >
            {{ tag }}
          </ElTag>
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
        <ElTable :headerCellStyle="tableHeaderColor" :data="localSearchKeywordsData">
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
.my-autocomplete .el-scrollbar__view {
  max-height: 300px;
  overflow-y: auto;
}
.my-autocomplete li {
  line-height: normal;
  padding: 7px;
}
.my-autocomplete li .name {
  text-overflow: ellipsis;
  overflow: hidden;
}
.my-autocomplete li .addr {
  font-size: 12px;
  color: #b4b4b4;
}
.my-autocomplete li .highlighted .addr {
  color: #ddd;
}
.custom-dropdown:focus-visible {
  outline: unset;
}
.dropdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.label-text {
  margin-right: 10px; /* 设置标签与开关之间的间距 */
}
.segment-control {
  display: flex;
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: hidden;
  flex-wrap: wrap;
}

.segment {
  flex: 1;
  text-align: center;
  padding: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.segment.active {
  background-color: #007bff;
  color: white;
}
</style>
