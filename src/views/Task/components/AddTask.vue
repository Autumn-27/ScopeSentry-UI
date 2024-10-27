<script setup lang="ts">
import {
  ElCheckbox,
  ElCheckboxGroup,
  ElDivider,
  ElForm,
  ElFormItem,
  ElInput,
  ElRow,
  ElCol,
  ElSwitch,
  FormRules,
  ElTooltip,
  ElRadioGroup,
  ElRadio,
  ElSelectV2,
  ElButton,
  FormInstance,
  ElMessage,
  ElInputNumber,
  CheckboxValueType,
  ElText
} from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { onMounted, reactive, ref, toRefs, watch } from 'vue'
import { getNodeDataOnlineApi } from '@/api/node'
import { getPocDataAllApi } from '@/api/poc'
import { addTaskApi, updateTaskApi } from '@/api/task'
import { getPortDictDataApi } from '@/api/DictionaryManagement'
const { t } = useI18n()

const props = defineProps<{
  closeDialog: () => void
  getList: () => void
  vTaskForm: {
    name: string
    target: string
    node: string[]
    subdomainScan: boolean
    duplicates: string
    subdomainConfig: string[]
    urlScan: boolean
    sensitiveInfoScan: boolean
    pageMonitoring: string
    crawlerScan: boolean
    vulScan: boolean
    vulList: string[]
    portScan: boolean
    ports: string
    dirScan: boolean
    waybackurl: boolean
    scheduledTasks: boolean
    hour: number
    allNode: boolean
  }
  create: boolean
  schedule: boolean
  taskid: string
}>()

const { vTaskForm } = toRefs(props)
const taskForm = ref({ ...vTaskForm.value })

interface RuleForm {
  name: string
  target: string
  node: []
}
const rules = reactive<FormRules<RuleForm>>({
  name: [{ required: true, message: t('task.msgTaskName'), trigger: 'blur' }],
  target: [{ required: true, message: t('task.msgTarget'), trigger: 'blur' }],
  node: [{ required: true, message: t('task.nodeMsg'), trigger: 'blur' }]
})

const saveLoading = ref(false)
const ruleFormRef = ref<FormInstance>()
const submitForm = async (formEl: FormInstance | undefined) => {
  saveLoading.value = true
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    console.log(taskForm.value.allNode)
    if (!taskForm.value.allNode) {
      taskForm.value.allNode = false
      console.log(taskForm.value.allNode)
    }
    if (valid) {
      if (props.taskid === '') {
        let res = await addTaskApi(
          taskForm.value.name,
          taskForm.value.target,
          taskForm.value.node,
          taskForm.value.allNode,
          taskForm.value.subdomainScan,
          taskForm.value.subdomainConfig,
          taskForm.value.urlScan,
          taskForm.value.duplicates,
          taskForm.value.sensitiveInfoScan,
          taskForm.value.pageMonitoring,
          taskForm.value.crawlerScan,
          taskForm.value.vulScan,
          taskForm.value.vulList,
          taskForm.value.portScan,
          taskForm.value.ports,
          taskForm.value.dirScan,
          taskForm.value.waybackurl,
          taskForm.value.scheduledTasks,
          taskForm.value.hour
        )
        if (res.code === 200) {
          props.getList()
          props.closeDialog()
        }
      } else {
        let res = await updateTaskApi(
          props.taskid,
          taskForm.value.name,
          taskForm.value.target,
          taskForm.value.node,
          taskForm.value.allNode,
          taskForm.value.subdomainScan,
          taskForm.value.subdomainConfig,
          taskForm.value.urlScan,
          taskForm.value.duplicates,
          taskForm.value.sensitiveInfoScan,
          taskForm.value.pageMonitoring,
          taskForm.value.crawlerScan,
          taskForm.value.vulScan,
          taskForm.value.vulList,
          taskForm.value.portScan,
          taskForm.value.ports,
          taskForm.value.dirScan,
          taskForm.value.waybackurl,
          taskForm.value.scheduledTasks,
          taskForm.value.hour
        )
        if (res.code === 200) {
          props.getList()
          props.closeDialog()
        }
      }
      saveLoading.value = false
    } else {
      console.log('error submit!', fields)
      saveLoading.value = false
    }
  })
}
const nodeOptions = reactive<{ value: string; label: string }[]>([])
const getNodeList = async () => {
  const res = await getNodeDataOnlineApi()
  if (res.data.list.length > 0) {
    isCheckboxDisabledNode.value = false
    res.data.list.forEach((item) => {
      nodeOptions.push({ value: item, label: item })
    })
  } else {
    isCheckboxDisabledNode.value = true
    ElMessage.warning(t('node.onlineNodeMsg'))
  }
}
const portOptions = reactive<{ value: string; label: string }[]>([])
const getPortList = async () => {
  const res = await getPortDictDataApi('', 1, 10000)
  if (res.data.list.length > 0) {
    res.data.list.forEach((item) => {
      portOptions.push({ value: item.id, label: item.name })
    })
  }
}
const vulOptions = reactive<{ value: string; label: string }[]>([])
const getPocList = async () => {
  const res = await getPocDataAllApi()
  if (res.data.list.length > 0) {
    vulOptions.push({ value: 'All Poc', label: 'All Poc' })
    res.data.list.forEach((item) => {
      vulOptions.push({ value: item.id, label: item.name })
    })
  }
}
onMounted(() => {
  getNodeList()
  getPocList()
  getPortList()
})
const indeterminate = ref(false)
const isCheckboxDisabledNode = ref(false)
const handleCheckAll = (val: CheckboxValueType) => {
  indeterminate.value = false
  if (val) {
    taskForm.value.node = []
    nodeOptions.forEach((option) => {
      return taskForm.value.node.push(option.value)
    })
  } else {
    taskForm.value.node = []
  }
}
</script>
<template>
  <ElForm
    :model="taskForm"
    label-width="auto"
    :rules="rules"
    status-icon
    ref="ruleFormRef"
    :disabled="create ? false : true"
  >
    <ElFormItem :label="t('task.taskName')" prop="name">
      <ElInput v-model="taskForm.name" :placeholder="t('task.msgTaskName')" />
    </ElFormItem>
    <ElFormItem :label="t('task.taskTarget')" prop="target">
      <ElInput
        v-model="taskForm.target"
        :placeholder="t('task.msgTarget')"
        type="textarea"
        rows="10"
      />
    </ElFormItem>
    <ElRow>
      <ElCol :span="12">
        <ElFormItem :label="t('task.nodeSelect')" prop="node">
          <ElSelectV2
            v-model="taskForm.node"
            filterable
            :options="nodeOptions"
            placeholder="Please select node"
            style="width: 80%"
            multiple
            tag-type="success"
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="7"
          >
            <template #header>
              <ElCheckbox
                :disabled="isCheckboxDisabledNode"
                :indeterminate="indeterminate"
                @change="handleCheckAll"
              >
                All
              </ElCheckbox>
            </template>
          </ElSelectV2>
        </ElFormItem>
      </ElCol>
      <ElCol :span="12">
        <ElFormItem :label="t('task.autoNode')">
          <ElTooltip effect="dark" :content="t('task.selectNodeMsg')" placement="top">
            <ElSwitch
              v-model="taskForm.allNode"
              inline-prompt
              :active-text="t('common.switchAction')"
              :inactive-text="t('common.switchInactive')"
            />
          </ElTooltip>
        </ElFormItem>
      </ElCol>
    </ElRow>

    <ElRow>
      <ElCol :span="12">
        <ElFormItem :label="t('project.scheduledTasks')">
          <ElTooltip effect="dark" :content="t('project.msgScheduledTasks')" placement="top">
            <ElSwitch
              v-model="taskForm.scheduledTasks"
              inline-prompt
              :active-text="t('common.switchAction')"
              :inactive-text="t('common.switchInactive')"
            />
          </ElTooltip>
        </ElFormItem>
      </ElCol>
      <ElCol :span="12" v-if="taskForm.scheduledTasks">
        <ElFormItem :label="t('project.cycle')" prop="type">
          <ElInputNumber
            v-model="taskForm.hour"
            :min="1"
            controls-position="right"
            size="small"
          /><ElText style="position: relative; left: 16px">Hour</ElText>
        </ElFormItem>
      </ElCol>
    </ElRow>
    <ElDivider content-position="center" style="width: 60%; left: 20%">{{
      t('task.duplicates')
    }}</ElDivider>
    <ElRow>
      <ElCol :span="24">
        <ElFormItem :label="t('task.duplicates')" prop="type">
          <ElRadioGroup v-model="taskForm.duplicates">
            <ElRadio label="None" name="duplicates" :checked="true" value="None" />
            <ElTooltip effect="dark" :content="t('task.duplicatesMsg')" placement="top">
              <ElRadio :label="t('task.duplicatesSubdomain')" name="duplicates" value="subdomain" />
            </ElTooltip>
          </ElRadioGroup>
        </ElFormItem>
      </ElCol>
    </ElRow>
    <ElDivider content-position="center" style="width: 60%; left: 20%">{{
      t('router.scanTemplate')
    }}</ElDivider>
    <ElFormItem :label="t('router.scanTemplate')" prop="node">
      <ElSelectV2
        v-model="taskForm.node"
        filterable
        :options="nodeOptions"
        placeholder="Please select node"
        style="width: 0%"
        multiple
        tag-type="success"
        collapse-tags
        collapse-tags-tooltip
        :max-collapse-tags="7"
      />
    </ElFormItem>
    <ElDivider />
    <ElRow>
      <ElCol :span="2" :offset="10">
        <ElFormItem>
          <ElButton type="primary" @click="submitForm(ruleFormRef)" :loading="saveLoading">{{
            t('task.save')
          }}</ElButton>
        </ElFormItem>
      </ElCol>
    </ElRow>
  </ElForm>
</template>
