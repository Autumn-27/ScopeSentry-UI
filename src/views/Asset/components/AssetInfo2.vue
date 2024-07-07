<script setup lang="tsx">
import { useI18n } from '@/hooks/web/useI18n'
import { Ref, reactive, ref } from 'vue'
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
  ElText
} from 'element-plus'
import { Table, TableColumn } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import {
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
    keyword: 'protocol',
    example: 'protocol="ssh"',
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

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'selection',
    type: 'selection',
    minWidth: '55'
  },
  {
    field: 'index',
    label: t('tableDemo.index'),
    type: 'index',
    minWidth: '30'
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
            {domainValue}
          </ElLink>
        </div>
      )
    }
  },
  {
    field: 'ip',
    label: t('asset.IP'),
    minWidth: '160',
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
              effect="light"
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
    field: 'title',
    label: t('asset.title'),
    minWidth: '160',
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
    field: 'status',
    label: t('asset.status'),
    minWidth: '85',
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
    }
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
    minWidth: '200'
  },
  {
    field: 'products',
    label: t('asset.products'),
    minWidth: '200',
    formatter: (_: Recordable, __: TableColumn, ProductsValue: string[]) => {
      if (ProductsValue.length != 0) {
        if (ProductsValue.length > 1) {
          let contentTool = ''
          if (Array.isArray(ProductsValue)) {
            // It's an array, you can use forEach
            ProductsValue.forEach((item, _) => {
              contentTool += `<div>${item}</div>`
            })
          } else {
            console.error('ProductsValue is not an array')
          }
          return (
            <div class="flex">
              <ElTag type="success" effect="light" round>
                {ProductsValue[0]}
              </ElTag>
              <ElTooltip
                class="box-item"
                effect="dark"
                placement="top-start"
                content={contentTool}
                popper-class="tagtooltip"
                rawContent
              >
                <ElTag type="info" effect="plain" round style={'left:3px; position:relative'}>
                  {t('asset.total')} {ProductsValue.length} {t('asset.p')}
                </ElTag>
              </ElTooltip>
            </div>
          )
        } else {
          return (
            <div class="flex">
              <ElTag type="success" effect="light">
                {ProductsValue[0]}
              </ElTag>
            </div>
          )
        }
      }
    }
  },
  {
    field: 'time',
    label: t('asset.time'),
    minWidth: '180'
  },
  {
    field: 'action',
    label: t('tableDemo.action'),
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

const action = (id: string) => {
  push(`/asset-information/asset-detail?id=${id}`)
}

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
  immediate: true
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
onMounted(() => {
  setMaxHeight()
  window.addEventListener('resize', setMaxHeight)
})
const maxHeight = ref(0)

const setMaxHeight = () => {
  const screenHeight = window.innerHeight || document.documentElement.clientHeight
  maxHeight.value = screenHeight * 0.7
}
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
  />
  <ElRow :gutter="3">
    <ElCol :span="3">
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
          </ElCollapseItem>
          <ElCollapseItem name="3">
            <template #title>
              <ElText tag="b" size="small">{{ t('asset.service') }}</ElText>
            </template>
            <ElRow v-for="serviceItem in AssetstatisticsData.Service" :key="serviceItem.value">
              <ElCol :span="12">
                <div
                  @click="changeTags('protocol', serviceItem.value)"
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
          </ElCollapseItem>
          <ElCollapseItem name="4">
            <template #title>
              <ElText tag="b" size="small">{{ t('asset.products') }}</ElText>
            </template>
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
    <ElCol :span="21">
      <ElRow>
        <ElCol :span="24">
          <ElCard>
            <Table
              v-model:pageSize="pageSize"
              v-model:currentPage="currentPage"
              :columns="allSchemas.tableColumns"
              :data="dataList"
              stripe
              :max-height="maxHeight"
              :border="true"
              :loading="loading"
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
.el-button {
  margin-top: 10px;
}
:deep(.el-popper.is-dark) {
  max-width: 50% !important;
  line-height: 24px;
  color: #fff !important;
  background-color: rgb(48, 65, 86) !important;
  display: none;
}
</style>
