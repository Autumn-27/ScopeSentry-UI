<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { Search } from '@/components/Search'
import { Ref, reactive, ref } from 'vue'
import { FormSchema } from '@/components/Form'
import { useSearch } from '@/hooks/web/useSearch'
import { onMounted } from 'vue'
import { useTable } from '@/hooks/web/useTable'
import {
  ElRow,
  ElCol,
  ElCard,
  ElScrollbar,
  ElTag,
  ElTooltip,
  ElText,
  ElCollapse,
  ElCollapseItem
} from 'element-plus'
import { Table, TableColumn } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { getAssetApi } from '@/api/asset'
import { Icon } from '@/components/Icon'
import { BaseButton } from '@/components/Button'
import { useRouter } from 'vue-router'
import { getAssetStatisticsApi } from '@/api/asset'

const { push } = useRouter()
const { t } = useI18n()
const { searchRegister } = useSearch()
const restaurants = ref<Recordable[]>([])
const querySearch = (queryString: string, cb: Fn) => {
  const results = queryString
    ? restaurants.value.filter(createFilter(queryString))
    : restaurants.value
  // call callback function to return suggestions
  cb(results)
}

const schema = reactive<FormSchema[]>([
  {
    field: 'search',
    label: t('form.input'),
    component: 'Autocomplete',
    componentProps: {
      fetchSuggestions: querySearch
    },
    formItemProps: {
      size: 'large',
      style: { width: '100%' }
    }
  }
])
const createFilter = (queryString: string) => {
  return (restaurant: Recordable) => {
    return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
  }
}
const loadAll = () => {
  return [
    { value: 'body' },
    { value: 'header' },
    { value: 'title' },
    { value: 'ip' },
    { value: 'host' },
    { value: 'port' },
    { value: 'icon_hash' },
    { value: 'and' },
    { value: 'or' },
    { value: '=' }
  ]
}

onMounted(() => {
  restaurants.value = loadAll()
})

const isGrid = ref(true)
const layout = ref('inline')

const buttonPosition = ref('left')

const searchParams = ref('')
const handleSearch = (data: any) => {
  searchParams.value = data.search
  getList()
}

const searchLoading = ref(false)

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
  const res = await getAssetStatisticsApi(searchParams.value)
  AssetstatisticsData.value.Port = res.data.Port
  AssetstatisticsData.value.Service = res.data.Service
  AssetstatisticsData.value.Product = res.data.Product
  AssetstatisticsData.value.Icon = res.data.Icon
}

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'index',
    label: t('tableDemo.index'),
    type: 'index',
    minWidth: 10
  },
  {
    field: 'domain',
    label: t('asset.domain'),
    minWidth: 50,
    formatter: (_, __: TableColumn, domainValue: string) => {
      return (
        <div class="flex">
          <Icon
            icon="material-symbols-light:bring-your-own-ip"
            style={'top: 4px; position:relative'}
            size={18}
            color="#409eff"
          />
          <div>{domainValue}</div>
        </div>
      )
    }
  },
  {
    field: 'ip',
    label: t('asset.IP'),
    minWidth: 40,
    formatter: (_, __: TableColumn, ipValue: string) => {
      return (
        <div class="flex">
          <Icon
            icon="arcticons:ip-tools"
            style={'top: 2px; position:relative'}
            size={18}
            color="red"
          />
          <div>{ipValue}</div>
        </div>
      )
    }
  },
  {
    field: 'port',
    label: t('asset.port') + '/' + t('asset.service'),
    minWidth: 30,
    formatter: (raw, __: TableColumn, statusValue: number) => {
      if (raw.Service == null) {
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
              {raw.Service}
            </ElTag>
          </div>
        )
      }
    }
  },
  {
    field: 'title',
    label: t('asset.title'),
    minWidth: 50
  },
  {
    field: 'status',
    label: t('asset.status'),
    minWidth: 30,
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
        <div class="flex">
          <Icon
            icon="clarity:circle-solid"
            color={color}
            size={10}
            style={'top: 6px; position:relative'}
          />
          <div style={'left: 1px'}>{statusValue}</div>
        </div>
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
        <ElScrollbar>
          <div class="scrollbar-demo-item">{elements}</div>
        </ElScrollbar>
      )
    },
    minWidth: 100
  },
  {
    field: 'products',
    label: t('asset.products'),
    minWidth: 60,
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
    minWidth: 60
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
    minWidth: 30
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
    const res = await getAssetApi(searchParams.value, currentPage.value, pageSize.value)
    return {
      list: res.data.list,
      total: res.data.total
    }
  }
})
const { loading, dataList, total, currentPage, pageSize } = tableState
const { getList } = tableMethods
// getList()
function tableHeaderColor() {
  return { background: 'var(--el-fill-color-light)' }
}
const activeNames = ref(['1', '2', '3', '4', '5'])
</script>

<template>
  <ContentWrap style="height: 80px">
    <Search
      :schema="schema"
      :is-col="isGrid"
      :layout="layout"
      :show-reset="false"
      :button-position="buttonPosition"
      :search-loading="searchLoading"
      @search="handleSearch"
      @register="searchRegister"
    />
  </ContentWrap>
  <ElRow :gutter="3">
    <ElCol :span="3">
      <ElCard v-loading="loading">
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
            <ElRow v-for="(portItem, index) in AssetstatisticsData.Port" :key="index">
              <ElCol :span="12">
                <ElTag effect="light" round size="small">{{ portItem.value }} </ElTag>
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
            <ElRow v-for="(serviceItem, index) in AssetstatisticsData.Service" :key="index">
              <ElCol :span="12">
                <ElTag effect="light" round size="small">{{ serviceItem.value }} </ElTag>
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
            <ElRow v-for="(productItem, index) in AssetstatisticsData.Product" :key="index">
              <ElCol :span="12">
                <ElTag effect="light" round size="small">{{ productItem.value }} </ElTag>
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
            <ElRow v-for="(iconItem, index) in AssetstatisticsData.Icon" :key="index">
              <ElCol :span="12">
                <ElTooltip :content="iconItem.icon_hash" placement="top-start">
                  <img
                    :src="'data:image/png;base64,' + iconItem.value"
                    alt="Icon"
                    style="width: 30px; height: 30px"
                  />
                </ElTooltip>
              </ElCol>
              <ElCol :span="12" style="text-align: end">
                <ElText size="small">{{ iconItem.number }}</ElText>
              </ElCol>
            </ElRow>
          </ElCollapseItem>
        </ElCollapse>
      </ElCard>
    </ElCol>
    <ElCol :span="21">
      <ElCard>
        <Table
          v-model:pageSize="pageSize"
          v-model:currentPage="currentPage"
          :columns="allSchemas.tableColumns"
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
