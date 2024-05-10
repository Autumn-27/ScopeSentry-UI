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

const taskColums = reactive<TableColumn[]>([
  {
    field: 'name',
    label: t('task.taskName')
  },
  {
    field: 'taskNum',
    label: t('task.taskCount'),
    formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
      return h(
        ElTag,
        {
          round: true,
          effect: 'dark'
        },
        () => cellValue
      )
    }
  },
  {
    field: 'progress',
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
    field: 'creatTime',
    label: t('task.createTime')
  }
])

const nodeUsageColumns = reactive<TableColumn[]>([
  {
    field: 'nodeName',
    label: t('node.nodeName')
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

let nodeUsageData: Ref<{ nodeName: string; nodeUsageCpu: number; nodeUsageMemory: number }[]> = ref(
  []
)

const nodeData = ref<
  {
    nodeName: string
    taskCount: number
    nodeStatus: number
    nodeUsageCpu: number
    nodeUsageMemory: number
  }[]
>([])

const getNodeState = async () => {
  try {
    const res = await getNodeDataApi()
    if (res && res.data && Array.isArray(res.data.list)) {
      nodeData.value = res.data.list.map((node) => ({
        nodeName: node.name,
        taskCount: node.running,
        nodeStatus: node.state,
        nodeUsageCpu: node.cpuNum,
        nodeUsageMemory: node.memNum
      }))
      nodeUsageData.value = reactive(
        res.data.list.map((node) => ({
          nodeName: node.name,
          nodeUsageCpu: node.cpuNum,
          nodeUsageMemory: node.memNum
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

const taskData = ref<
  {
    name: string
    taskNum: string
    progress: string
    creatTime: string
  }[]
>([])

const getTaskData = async () => {
  const res = await getTaskDataApi('', 1, 10)
  console.log(res)
  taskData.value = reactive(
    res.data.list.map((task) => ({
      name: task.name,
      taskNum: task.taskNum,
      progress: task.progress,
      creatTime: task.creatTime
    }))
  )
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
        <Table
          :columns="taskColums"
          :data="taskData"
          stripe
          :border="false"
          :height="250"
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
            disabled: true
          }"
        />
      </ElCard>
    </ElCol>
    <ElCol :span="12">
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
