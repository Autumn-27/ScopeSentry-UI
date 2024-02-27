<script setup lang="ts">
import PanelGroup from './components/PanelGroup.vue'
import { ElRow, ElCol, ElCard, ElProgress } from 'element-plus'
import { Table, TableColumn } from '@/components/Table'
import { ElTag } from 'element-plus'
import { ref, reactive, h, onBeforeUnmount, Ref } from 'vue'
import { getNodeDataApi } from '@/api/node'
import { getTaskDataApi } from '@/api/task'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()

const loading = ref(true)
interface NodeDataItem {
  id: string
  nodeName: string
  taskCount: number
  nodeStatus: number
  nodeUsageLoad: number
  nodeUsageCpu: number
  nodeUsageMemory: number
}

const nodeColumns = reactive<TableColumn[]>([
  {
    field: 'nodeName',
    label: t('node.nodeName')
  },
  {
    field: 'taskCount',
    label: t('node.taskCount'),
    formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
      return h(
        ElTag,
        {
          type: '',
          round: true,
          effect: 'dark'
        },
        () => cellValue
      )
    }
  },
  {
    field: 'nodeStatus',
    label: t('node.nodeStatus'),
    formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
      return h(
        ElTag,
        {
          type: cellValue === 1 ? 'success' : cellValue === 2 ? 'warning' : 'danger',
          effect: 'dark'
        },
        () =>
          cellValue === 1
            ? t('node.statusRun')
            : cellValue === 2
              ? t('node.statusStop')
              : t('node.statusError')
      )
    }
  }
])
let nodeData: Ref<NodeDataItem[]> = ref([])

const taskColums = reactive<TableColumn[]>([
  {
    field: 'taskName',
    label: t('task.taskName')
  },
  {
    field: 'taskCount',
    label: t('task.taskCount'),
    formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
      return h(
        ElTag,
        {
          type: '',
          round: true,
          effect: 'dark'
        },
        () => cellValue
      )
    }
  },
  {
    field: 'taskProgress',
    label: t('task.taskProgress'),
    formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
      return h(ElProgress, {
        percentage: cellValue,
        type: 'line',
        striped: true,
        status: cellValue < 100 ? '' : 'success',
        stripedFlow: cellValue < 100 ? true : false
      })
    }
  },
  {
    field: 'createTime',
    label: t('task.createTime')
  }
])

let taskData = reactive([])

const nodeUsageColumns = reactive<TableColumn[]>([
  {
    field: 'nodeName',
    label: t('node.nodeName')
  },
  {
    field: 'nodeUsageLoad',
    label: t('node.nodeUsageLoad'),
    formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
      return h(ElProgress, {
        percentage: cellValue,
        type: 'dashboard',
        color: cellValue < 50 ? '#26a33f' : cellValue < 80 ? '#fe9900' : '#df2800'
      })
    }
  },
  {
    field: 'nodeUsageCpu',
    label: t('node.nodeUsageCpu'),
    formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
      return h(ElProgress, {
        percentage: cellValue,
        type: 'dashboard',
        color: cellValue < 50 ? '#26a33f' : cellValue <= 80 ? '#fe9900' : '#df2800'
      })
    }
  },
  {
    field: 'nodeUsageMemory',
    label: t('node.nodeUsageMemory'),
    formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
      return h(ElProgress, {
        percentage: cellValue,
        type: 'dashboard',
        color: cellValue < 50 ? '#26a33f' : cellValue < 80 ? '#fe9900' : '#df2800'
      })
    }
  }
])

let nodeUsageData: Ref<
  { nodeName: string; nodeUsageLoad: number; nodeUsageCpu: number; nodeUsageMemory: number }[]
> = ref([])
const getNodeState = async () => {
  try {
    const res = await getNodeDataApi()
    if (res && res.data && Array.isArray(res.data)) {
      nodeData.value = reactive(
        res.data.map((node) => ({
          id: node.id,
          nodeName: node.nodeName,
          taskCount: node.taskCount,
          nodeStatus: node.nodeStatus,
          nodeUsageCpu: node.nodeUsageCpu,
          nodeUsageLoad: node.nodeUsageLoad,
          nodeUsageMemory: node.nodeUsageMemory
        }))
      )
      nodeUsageData.value = reactive(
        res.data.map((node) => ({
          nodeName: node.nodeName,
          nodeUsageCpu: node.nodeUsageCpu,
          nodeUsageLoad: node.nodeUsageLoad,
          nodeUsageMemory: node.nodeUsageMemory
        }))
      )
    }
  } catch (error) {
    console.error('Error fetching node data:', error)
  } finally {
    // 不论请求成功或失败，都会执行的代码块
    loading.value = false
  }
}

const getTaskData = async () => {
  const res = await getTaskDataApi()
    .catch(() => {})
    .finally(() => {
      loading.value = false
    })
  taskData = Object.assign(taskData, res?.data || {})
}

const getAllApi = async () => {
  await Promise.all([getNodeState(), getTaskData()])
  loading.value = false
}

getAllApi()
const refreshInterval = setInterval(getAllApi, 10000)

onBeforeUnmount(() => {
  clearInterval(refreshInterval)
})
</script>

<template>
  <PanelGroup />
  <ElRow :gutter="20" justify="space-between">
    <ElCol :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
      <ElCard shadow="hover" class="mb-20px">
        <template #header>
          <span>{{ t('dashboard.nodeInfo') }}</span>
        </template>
        <Table :columns="nodeColumns" :data="nodeData" stripe :border="false" :height="250" />
      </ElCard>
    </ElCol>
    <ElCol :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
      <ElCard shadow="hover" class="mb-20px">
        <template #header>
          <span>{{ t('dashboard.taskInfo') }}</span>
        </template>
        <Table :columns="taskColums" :data="taskData" stripe :border="false" :height="250" />
      </ElCard>
    </ElCol>
    <ElCol :span="24">
      <ElCard shadow="hover" class="mb-25px">
        <template #header>
          <div class="header-container">
            <span class="header-content">{{ t('node.nodeUsageStatus') }}</span>
          </div>
        </template>
        <Table
          :columns="nodeUsageColumns"
          :data="nodeUsageData"
          stripe
          :border="false"
          :height="600"
        />
      </ElCard>
    </ElCol>
  </ElRow>
</template>

<style scoped>
.header-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
