<script setup lang="tsx">
import { useI18n } from '@/hooks/web/useI18n'
import { Ref, computed, h, nextTick, reactive, ref } from 'vue'
import { onMounted } from 'vue'
import { useTable } from '@/hooks/web/useTable'
import {
  ElRow,
  ElCol,
  ElCard,
  ElScrollbar,
  ElTag,
  ElTooltip,
  ElCollapse,
  ElCollapseItem,
  ElBadge,
  ElPagination,
  ElLink,
  ElText,
  ElButton,
  InputInstance,
  ElInput
} from 'element-plus'
import { Table, TableColumn } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import {
  addTagApi,
  deleteTagApi,
  getAssetApi,
  getAssetStatisticsPortApi,
  getAssetStatisticsTypeApi,
  getAssetStatisticsappApi,
  getAssetStatisticsiconApi
} from '@/api/asset'
import { Icon } from '@/components/Icon'
import { BaseButton } from '@/components/Button'
import { useRouter } from 'vue-router'
import Csearch from '../search/Csearch.vue'
import { createImageViewer } from '@/components/ImageViewer'
import { RowState } from '@/api/asset/types'
const { push } = useRouter()
const { t } = useI18n()
interface Project {
  value: string
  label: string
  children?: Project[]
}
const props = defineProps<{
  projectList: Project[]
}>()
const searchKeywordsData = [
  {
    keyword: 'app',
    example: 'app="Nginx"',
    explain: t('searchHelp.app')
  },
  {
    keyword: 'body',
    example: 'body="bootstrap.min.css"',
    explain: t('searchHelp.body')
  },
  {
    keyword: 'header',
    example: 'header="rememberMe"',
    explain: t('searchHelp.header')
  },
  {
    keyword: 'title',
    example: 'title="admin console"',
    explain: t('searchHelp.title')
  },
  {
    keyword: 'statuscode',
    example: 'statuscode=="403"',
    explain: t('searchHelp.statuscode')
  },
  {
    keyword: 'icon',
    example: 'icon="54256234"',
    explain: t('searchHelp.icon')
  },
  {
    keyword: 'ip',
    example: 'ip="192.168.2.1"',
    explain: t('searchHelp.ip')
  },
  {
    keyword: 'port',
    example: 'port="3306"',
    explain: t('searchHelp.port')
  },
  {
    keyword: 'domain',
    example: 'domain="example.com"',
    explain: t('searchHelp.domain')
  },
  {
    keyword: 'service',
    example: 'service="ssh"',
    explain: t('searchHelp.protocol')
  },
  {
    keyword: 'banner',
    example: 'banner="SSH-2.0-OpenSSH"',
    explain: t('searchHelp.banner')
  },
  {
    keyword: 'project',
    example: 'project="Hackerone"',
    explain: t('searchHelp.project')
  }
]

const staticLoading = ref(true)
const searchParams = ref('')
const handleSearch = (data: any) => {
  searchParams.value = data
  staticLoading.value = true
  AssetstatisticsData.value.Icon = []
  getList()
  staticLoading.value = false
}

let AssetstatisticsData: Ref<{
  Port: { value: number; number: number }[]
  Service: { value: string; number: number }[]
  Product: { value: string; number: number }[]
  Icon: { value: string; number: number; icon_hash: string }[]
}> = ref({
  Port: [],
  Service: [],
  Product: [],
  Icon: []
})
const getAssetstatistics = async () => {
  AssetstatisticsData.value.Port = []
  AssetstatisticsData.value.Service = []
  AssetstatisticsData.value.Product = []
  staticLoading.value = true
  AssetstatisticsData.value.Icon = []
  const [portRes, serviceRes, productRes] = await Promise.all([
    getAssetStatisticsPortApi(searchParams.value, filter),
    getAssetStatisticsTypeApi(searchParams.value, filter),
    getAssetStatisticsappApi(searchParams.value, filter)
  ])

  AssetstatisticsData.value.Port = portRes.data.Port
  AssetstatisticsData.value.Service = serviceRes.data.Service
  AssetstatisticsData.value.Product = productRes.data.Product
  staticLoading.value = false
  let iconRes = await getAssetStatisticsiconApi(searchParams.value, filter)
  AssetstatisticsData.value.Icon = iconRes.data.Icon
}

const rowStateMap = reactive<Record<string, RowState>>({})

let crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'selection',
    type: 'selection',
    minWidth: '55'
  },
  {
    field: 'index',
    label: t('tableDemo.index'),
    type: 'index',
    minWidth: '15'
  },
  {
    field: 'domain',
    label: t('asset.domain'),
    minWidth: '200',
    formatter: (row, __: TableColumn, domainValue: string) => {
      return (
        <div class="flex">
          <Icon
            icon="material-symbols-light:bring-your-own-ip"
            style={'transform: translateY(35%)'}
            size={16}
            color="#409eff"
          />
          <ElLink href={row.url} underline={false}>
            {row.service + '://' + domainValue}
          </ElLink>
        </div>
      )
    }
  },
  {
    field: 'ip',
    label: t('asset.IP'),
    minWidth: '130',
    formatter: (row, __: TableColumn, ipValue: string) => {
      return (
        <div class="flex">
          <Icon
            icon="arcticons:ip-tools"
            style={'transform: translateY(30%)'}
            size={15}
            color="red"
          />
          <ElLink href={row.url} underline={false}>
            {ipValue}
          </ElLink>
        </div>
      )
    }
  },
  {
    field: 'port',
    label: t('asset.port') + '/' + t('asset.service'),
    minWidth: '110',
    formatter: (raw, __: TableColumn, statusValue: number) => {
      if (raw.service == '') {
        return <div>{statusValue}</div>
      } else {
        return (
          <div class="flex">
            <div>{statusValue}</div>
            <ElTag
              type="info"
              effect="dark"
              round
              size="small"
              style={'top: 2px; left:6px; position:relative'}
            >
              {raw.service}
            </ElTag>
          </div>
        )
      }
    }
  },
  {
    field: 'status',
    label: t('asset.status'),
    minWidth: '85',
    columnKey: 'statuscode',
    formatter: (_: Recordable, __: TableColumn, statusValue: number) => {
      if (statusValue == null) {
        return <div>-</div>
      }
      let color = ''
      if (statusValue < 300) {
        color = '#2eb98a'
      } else if (statusValue < 400) {
        color = '#ff5252'
      } else {
        color = '#ff5252'
      }
      return (
        <ElRow gutter={10}>
          <ElCol span={2}>
            <Icon
              icon="clarity:circle-solid"
              color={color}
              size={6}
              style={'transform: translateY(-35%)'}
            />
          </ElCol>
          <ElCol span={18}>
            <ElText>{statusValue}</ElText>
          </ElCol>
        </ElRow>
      )
    },
    filters: [
      { text: '200', value: 200 },
      { text: '201', value: 201 },
      { text: '204', value: 204 },
      { text: '301', value: 301 },
      { text: '302', value: 302 },
      { text: '304', value: 304 },
      { text: '400', value: 400 },
      { text: '401', value: 401 },
      { text: '403', value: 403 },
      { text: '404', value: 404 },
      { text: '500', value: 500 },
      { text: '502', value: 502 },
      { text: '503', value: 503 },
      { text: '504', value: 504 }
    ]
  },
  {
    field: 'title',
    label: t('asset.title'),
    minWidth: '150',
    formatter: (row: Recordable, __: TableColumn, title: string) => {
      if (title == null || title == '') {
        title = ''
      }
      if (row.icon == '' || row.icon == null) {
        return (
          <ElRow gutter={10}>
            <ElCol span={24}>
              <ElText size="small" class="w-200px mb-2" truncated>
                {title}
              </ElText>
            </ElCol>
          </ElRow>
        )
      }
      const st = 'data:image/png;base64,' + row.icon
      return (
        <ElRow gutter={20}>
          <ElCol span={2}>
            <img src={st} alt="Icon" style="width: 20px; height: 20px" />
          </ElCol>
          <ElCol span={18}>
            <ElText size="small" class="w-200px mb-2" truncated>
              {title}
            </ElText>
          </ElCol>
        </ElRow>
      )
    }
  },
  {
    field: 'tags',
    label: 'TAG',
    fit: 'true',
    formatter: (row: Recordable, __: TableColumn, tags: string[]) => {
      // 初始化状态
      if (!rowStateMap[row.id]) {
        rowStateMap[row.id] = {
          inputVisible: false,
          inputValue: '',
          inputRef: ref(null) as Ref<InputInstance | null>
        }
      }
      const rowState = rowStateMap[row.id]
      const handleInputConfirm = async () => {
        if (rowState.inputValue) {
          tags.push(rowState.inputValue) // 将输入值添加到 tags 中
          addTagApi(row.id, index, rowState.inputValue)
        }
        rowState.inputVisible = false // 隐藏输入框
        rowState.inputValue = '' // 清空输入框的值
      }
      const deleteTag = async (tag: string) => {
        const indexT = tags.indexOf(tag)
        if (indexT > -1) {
          tags.splice(indexT, 1) // 从数组中移除指定的元素
        }
        deleteTagApi(row.id, index, tag)
      }
      const showInput = () => {
        rowState.inputVisible = true
        nextTick(() => {
          // console.log('inputRef:', rowState.inputRef)
          // if (rowState.inputRef.value?.input) {
          //   rowState.inputRef.value.input.focus()
          // }
        })
      }
      // 标签点击处理函数
      const handleTagClick = (event: MouseEvent, tag: string) => {
        if ((event.target as HTMLElement).classList.contains('el-tag__close')) {
          // 点击关闭按钮时不处理
          return
        }
        // 这里可以添加处理点击事件的逻辑
        console.log('Tag clicked:', tag)
        changeTags('tags', tag)
      }

      return h(ElRow, {}, () => [
        // 渲染标签
        ...tags.map((tag) =>
          h(ElCol, { span: 24, key: tag }, () => [
            h('div', { onClick: (event: MouseEvent) => handleTagClick(event, tag) }, [
              h(ElTag, { closable: true, onClose: () => deleteTag(tag) }, () => tag)
            ])
          ])
        ),

        // 输入框或按钮
        h(
          ElCol,
          { span: 24 },
          rowState.inputVisible
            ? () =>
                h(ElInput, {
                  ref: rowState.inputRef,
                  modelValue: rowState.inputValue, // 双向绑定输入框值
                  'onUpdate:modelValue': (value: string) => (rowState.inputValue = value),
                  class: 'w-20',
                  size: 'small',
                  onKeyup: (event: KeyboardEvent) => {
                    if (event.key === 'Enter') {
                      handleInputConfirm() // 只在回车键被按下时触发
                    }
                  },
                  onBlur: handleInputConfirm // 失去焦点时调用 handleInputConfirm
                })
            : () =>
                h(
                  ElButton,
                  { class: 'button-new-tag', size: 'small', onClick: () => showInput() },
                  () => '+ New Tag'
                )
        )
      ])
    },
    minWidth: '130'
  },
  {
    field: 'banner',
    label: t('asset.banner'),
    fit: 'true',
    formatter: (_: Recordable, __: TableColumn, bannerValue: string) => {
      const lines = bannerValue.split('\n')
      const elements = lines.map((line, index) => <div key={index}>{line}</div>)
      return (
        <ElScrollbar height="100px">
          <div class="scrollbar-demo-item">{elements}</div>
        </ElScrollbar>
      )
    },
    minWidth: '190'
  },
  {
    field: 'products',
    label: t('asset.products'),
    minWidth: '110',
    formatter: (_: Recordable, __: TableColumn, ProductsValue: string[]) => {
      if (ProductsValue.length != 0) {
        return (
          <ElRow style={{ flexWrap: 'wrap' }}>
            {ProductsValue.map((product) => (
              <ElCol span={24} key={product}>
                <div
                  onClick={() => changeTags('app', product)}
                  style={'display: inline-block; cursor: pointer'}
                >
                  <ElTag type={'success'}>{product}</ElTag>
                </div>
              </ElCol>
            ))}
          </ElRow>
        )
        // if (ProductsValue.length > 1) {
        //   let contentTool = ''
        //   if (Array.isArray(ProductsValue)) {
        //     // It's an array, you can use forEach
        //     ProductsValue.forEach((item, _) => {
        //       contentTool += `<div>${item}</div>`
        //     })
        //   } else {
        //     console.error('ProductsValue is not an array')
        //   }
        //   return (
        //     <div class="flex">
        //       <ElTag type="success" effect="light" round>
        //         {ProductsValue[0]}
        //       </ElTag>
        //       <ElTooltip
        //         class="box-item"
        //         effect="dark"
        //         placement="top-start"
        //         content={contentTool}
        //         popper-class="tagtooltip"
        //         rawContent
        //       >
        //         <ElTag type="info" effect="plain" round style={'left:3px; position:relative'}>
        //           {t('asset.total')} {ProductsValue.length} {t('asset.p')}
        //         </ElTag>
        //       </ElTooltip>
        //     </div>
        //   )
        // } else {
        //   return (
        //     <div class="flex">
        //       <ElTag type="success" effect="light">
        //         {ProductsValue[0]}
        //       </ElTag>
        //     </div>
        //   )
        // }
      }
    }
  },
  {
    field: 'screenshot',
    label: t('asset.screenshot'),
    minWidth: '170',
    formatter: (row) => {
      if (row.screenshot != '') {
        return (
          <img
            src={`${row.screenshot}`}
            alt="screenshot"
            style={{ width: '100%', height: 'auto' }}
            onClick={() => handleImageClick(row.screenshot)}
          />
        )
      }
    }
  },
  {
    field: 'time',
    label: t('asset.time'),
    minWidth: '170'
  },
  {
    field: 'action',
    label: t('tableDemo.action'),
    fixed: 'right',
    formatter: (row, __: TableColumn, _: number) => {
      return (
        <>
          <BaseButton type="primary" onClick={() => action(row.id)}>
            {t('asset.detail')}
          </BaseButton>
        </>
      )
    },
    minWidth: '100'
  }
])

const filterChange = async (newFilters: any) => {
  Object.assign(filter, newFilters)
  getList()
}
const action = (id: string) => {
  push(`/asset-information/asset-detail?id=${id}`)
}

const handleImageClick = (screenshot: string) => {
  createImageViewer({
    urlList: [screenshot]
  })
}
let index = 'asset'
crudSchemas.forEach((schema) => {
  schema.hidden = schema.hidden ?? false // 如果没有 hidden 属性，添加并设置为 false
})
let statisticsHidden = ref(false)
// 从localStorage读取配置并更新列的显示状态
const loadColumnConfig = () => {
  const savedConfig = JSON.parse(localStorage.getItem(`columnConfig_${index}`) || '{}')
  console.log(savedConfig)
  crudSchemas.forEach((col) => {
    if (savedConfig[col.field] !== undefined && col.field != 'select') {
      col.hidden = savedConfig[col.field] // 恢复列的显示状态
    }
  })
  statisticsHidden.value = savedConfig['statisticsHidden']
}

// 保存配置到localStorage
const saveColumnConfig = () => {
  const config = crudSchemas.reduce((acc, col) => {
    acc[col.field] = col.hidden // 保存每列的显示状态
    return acc
  }, {})
  config['statisticsHidden'] = statisticsHidden.value
  localStorage.setItem(`columnConfig_${index}`, JSON.stringify(config)) // 按index保存配置
}

// 处理列显示状态变化
const handleColumnVisibilityChange = ({ field, hidden }) => {
  console.log(field, hidden)
  const columnIndex = crudSchemas.findIndex((col) => col.field === field)
  if (columnIndex !== -1) {
    // 使用对象的展开运算符来创建一个新的对象，并更新隐藏属性
    crudSchemas[columnIndex].hidden = hidden
  }
  saveColumnConfig()
}
loadColumnConfig()

const { allSchemas } = useCrudSchemas(crudSchemas)
const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    getAssetstatistics()
    const { currentPage, pageSize } = tableState
    const res = await getAssetApi(searchParams.value, currentPage.value, pageSize.value, filter)
    return {
      list: res.data.list,
      total: res.data.total
    }
  },
  immediate: false
})
const { loading, dataList, total, currentPage, pageSize } = tableState
const { getList, getElTableExpose } = tableMethods
function tableHeaderColor() {
  return { background: 'var(--el-fill-color-light)' }
}
function rowstyle() {
  return { maxheight: '10px' }
}
const activeNames = ref(['1', '2', '3', '4', '5'])
const filter = reactive<{ [key: string]: any }>({})
const handleFilterSearch = (data: any, newFilters: any) => {
  Object.assign(filter, newFilters)
  searchParams.value = data
  getList()
}
const dynamicTags = ref<string[]>([])
const changeTags = (type, value) => {
  const key = `${type}=${value}`
  console.log(key)
  dynamicTags.value = [...dynamicTags.value, key]
}
const handleClose = (tag: string) => {
  if (dynamicTags.value) {
    const [key, value] = tag.split('=')
    if (key in filter && Array.isArray(filter[key])) {
      filter[key] = filter[key].filter((item: string) => item !== value)
      if (filter[key].length === 0) {
        delete filter[key]
      }
    }
    dynamicTags.value = dynamicTags.value.filter((item) => item !== tag)
  }
}
const changeStatisticsHidden = (value: boolean) => {
  statisticsHidden.value = value
  saveColumnConfig()
}
</script>

<template>
  <Csearch
    :getList="getList"
    :handleSearch="handleSearch"
    :searchKeywordsData="searchKeywordsData"
    index="asset"
    :getElTableExpose="getElTableExpose"
    :projectList="$props.projectList"
    :handleFilterSearch="handleFilterSearch"
    :dynamicTags="dynamicTags"
    :handleClose="handleClose"
    :crudSchemas="crudSchemas"
    @update-column-visibility="handleColumnVisibilityChange"
    :statisticsHidden="statisticsHidden"
    :changeStatisticsHidden="changeStatisticsHidden"
  />
  <ElRow :gutter="3">
    <ElCol :span="statisticsHidden ? 0 : 3">
      <ElCard v-loading="staticLoading">
        <div>
          <ElRow>
            <ElCol :span="12">
              <ElText tag="b" size="small">{{ t('asset.assetTotalNum') }}:</ElText>
            </ElCol>
            <ElCol :span="12" style="text-align: end">
              <ElText size="small">{{ total }}</ElText>
            </ElCol>
          </ElRow>
        </div>
        <ElCollapse v-model="activeNames" style="position: relative; top: 15px">
          <!-- <ElCollapseItem name="1">
            <template #title>
              <ElText tag="b" size="small">{{ t('asset.assetTotalNum') }}</ElText>
            </template>
            xxxxx
          </ElCollapseItem> -->
          <ElCollapseItem name="2">
            <template #title>
              <ElText tag="b" size="small">{{ t('asset.port') }}</ElText>
            </template>
            <ElScrollbar height="20rem">
              <ElRow v-for="portItem in AssetstatisticsData.Port" :key="portItem.value">
                <ElCol :span="12">
                  <div
                    @click="changeTags('port', portItem.value)"
                    style="display: inline-block; cursor: pointer"
                  >
                    <ElTag effect="light" round size="small">
                      {{ portItem.value }}
                    </ElTag>
                  </div>
                </ElCol>
                <ElCol :span="12" style="text-align: end">
                  <ElText size="small">{{ portItem.number }}</ElText>
                </ElCol>
              </ElRow>
            </ElScrollbar>
          </ElCollapseItem>
          <ElCollapseItem name="3">
            <template #title>
              <ElText tag="b" size="small">{{ t('asset.service') }}</ElText>
            </template>
            <ElScrollbar height="13rem">
              <ElRow v-for="serviceItem in AssetstatisticsData.Service" :key="serviceItem.value">
                <ElCol :span="12">
                  <div
                    @click="changeTags('service', serviceItem.value)"
                    style="display: inline-block; cursor: pointer"
                  >
                    <ElTag effect="light" round size="small">
                      {{ serviceItem.value }}
                    </ElTag>
                  </div>
                </ElCol>
                <ElCol :span="12" style="text-align: end">
                  <ElText size="small">{{ serviceItem.number }}</ElText>
                </ElCol>
              </ElRow>
            </ElScrollbar>
          </ElCollapseItem>
          <ElCollapseItem name="4">
            <template #title>
              <ElText tag="b" size="small">{{ t('asset.products') }}</ElText>
            </template>
            <ElScrollbar height="20rem">
              <ElRow v-for="productItem in AssetstatisticsData.Product" :key="productItem.value">
                <ElCol :span="12">
                  <div
                    @click="changeTags('app', productItem.value)"
                    style="display: inline-block; cursor: pointer"
                  >
                    <ElTag effect="light" round size="small">
                      {{ productItem.value }}
                    </ElTag>
                  </div>
                </ElCol>
                <ElCol :span="12" style="text-align: end">
                  <ElText size="small">{{ productItem.number }}</ElText>
                </ElCol>
              </ElRow>
            </ElScrollbar>
          </ElCollapseItem>
          <ElCollapseItem name="5">
            <template #title>
              <ElText tag="b" size="small">icon</ElText>
            </template>
            <ElRow style="margin-top: 10px; margin-left: 10px">
              <ElCol :span="8" v-for="iconItem in AssetstatisticsData.Icon" :key="iconItem.value">
                <ElBadge :value="iconItem.number" :max="99" style="font-size: 8px">
                  <ElTooltip :content="iconItem.icon_hash" placement="top-start">
                    <img
                      :src="'data:image/png;base64,' + iconItem.value"
                      alt="Icon"
                      style="width: 30px; height: 30px"
                      @click="changeTags('icon', iconItem.icon_hash)"
                    />
                  </ElTooltip>
                </ElBadge>
              </ElCol>
            </ElRow>
          </ElCollapseItem>
        </ElCollapse>
      </ElCard>
    </ElCol>
    <ElCol :span="statisticsHidden ? 24 : 21">
      <ElRow>
        <ElCol :span="24">
          <ElCard>
            <Table
              :columns="allSchemas.tableColumns"
              :data="dataList"
              stripe
              :border="true"
              :loading="loading"
              @filter-change="filterChange"
              :rowStyle="rowstyle"
              :resizable="true"
              @register="tableRegister"
              :headerCellStyle="tableHeaderColor"
              :tooltip-options="{
                offset: 1,
                showArrow: false,
                effect: 'dark',
                enterable: false,
                showAfter: 0,
                popperOptions: {},
                popperClass: 'test',
                placement: 'bottom',
                hideAfter: 0,
                disabled: false
              }"
              :style="{
                fontFamily:
                  '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji'
              }"
            />
          </ElCard>
        </ElCol>
        <ElCol ::span="24">
          <ElCard>
            <ElPagination
              v-model:pageSize="pageSize"
              v-model:currentPage="currentPage"
              :page-sizes="[10, 20, 50, 100, 200, 500, 1000]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            />
          </ElCard>
        </ElCol>
      </ElRow>
    </ElCol>
  </ElRow>
</template>

<style lang="less">
.el-popper.is-dark.tagtooltip {
  max-width: 50% !important;
  line-height: 24px;
}
</style>
<style lang="less" scoped>
:deep(.el-popper.is-dark) {
  max-width: 50% !important;
  line-height: 24px;
  color: #fff !important;
  background-color: rgb(48, 65, 86) !important;
  display: none;
}
</style>
