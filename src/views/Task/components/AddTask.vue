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
    duplicates: boolean
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
    taskForm.value.allNode = true
    taskForm.value.node = []
    nodeOptions.forEach((option) => {
      return taskForm.value.node.push(option.value)
    })
  } else {
    taskForm.value.allNode = false
    taskForm.value.node = []
  }
}
</script>
<template>
  <ElForm
    :model="taskForm"
    label-width="120px"
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
    <ElTooltip :content="t('task.selectNodeMsg')" placement="top">
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
            <el-checkbox
              v-model="taskForm.allNode"
              :disabled="isCheckboxDisabledNode"
              :indeterminate="indeterminate"
              @change="handleCheckAll"
            >
              All
            </el-checkbox>
          </template>
        </ElSelectV2>
      </ElFormItem>
    </ElTooltip>
    <ElRow>
      <ElCol :span="6">
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
      t('subdomain.subdomainName')
    }}</ElDivider>
    <ElRow v-if="!$props.schedule">
      <ElCol :span="6">
        <ElTooltip :content="t('task.duplicatesMsg')" placement="top">
          <ElFormItem :label="t('task.duplicates')">
            <ElSwitch
              v-model="taskForm.duplicates"
              inline-prompt
              :active-text="t('common.true')"
              :inactive-text="t('common.false')"
            />
          </ElFormItem>
        </ElTooltip>
      </ElCol>
    </ElRow>
    <ElRow>
      <ElCol :span="6">
        <ElFormItem :label="t('task.subdomainScan')">
          <ElSwitch
            v-model="taskForm.subdomainScan"
            inline-prompt
            :active-text="t('common.switchAction')"
            :inactive-text="t('common.switchInactive')"
          />
        </ElFormItem>
      </ElCol>
      <ElCol :span="12">
        <ElFormItem :label="t('task.config')" prop="type" v-if="taskForm.subdomainScan">
          <ElCheckboxGroup v-model="taskForm.subdomainConfig">
            <ElCheckbox label="Subfinder" name="subdomainConfig" :checked="true" />
            <ElCheckbox label="Ksubdomain" name="subdomainConfig" :checked="true" />
          </ElCheckboxGroup>
        </ElFormItem>
      </ElCol>
    </ElRow>
    <ElDivider content-position="center" style="width: 60%; left: 20%">{{
      t('task.portScan')
    }}</ElDivider>
    <ElRow>
      <ElCol :span="6">
        <ElFormItem :label="t('task.portScan')">
          <ElSwitch
            v-model="taskForm.portScan"
            inline-prompt
            :active-text="t('common.switchAction')"
            :inactive-text="t('common.switchInactive')"
          />
        </ElFormItem>
      </ElCol>
      <ElCol :span="12">
        <ElFormItem :label="t('task.portSelect')" prop="portScan" v-if="taskForm.portScan">
          <ElSelectV2
            v-model="taskForm.ports"
            filterable
            :options="portOptions"
            placeholder="Please select port"
            style="width: 80%"
          />
        </ElFormItem>
      </ElCol>
    </ElRow>
    <ElDivider content-position="center" style="width: 60%; left: 20%">{{
      t('dirScan.dirScanName')
    }}</ElDivider>
    <ElFormItem :label="t('dirScan.dirScanName')">
      <ElSwitch
        v-model="taskForm.dirScan"
        inline-prompt
        :active-text="t('common.switchAction')"
        :inactive-text="t('common.switchInactive')"
      />
    </ElFormItem>
    <ElDivider content-position="center" style="width: 60%; left: 20%">{{
      t('crawler.crawlerName')
    }}</ElDivider>
    <ElRow>
      <ElCol :span="6">
        <ElTooltip effect="dark" :content="t('task.msgUrl')" placement="top">
          <ElFormItem :label="t('task.url')">
            <ElSwitch
              v-model="taskForm.urlScan"
              inline-prompt
              :active-text="t('common.switchAction')"
              :inactive-text="t('common.switchInactive')"
            />
          </ElFormItem>
        </ElTooltip>
      </ElCol>
      <ElCol :span="6">
        <ElFormItem :label="t('task.sensitiveInfoScan')" prop="type" v-if="taskForm.urlScan">
          <ElSwitch
            v-model="taskForm.sensitiveInfoScan"
            inline-prompt
            :active-text="t('common.switchAction')"
            :inactive-text="t('common.switchInactive')"
          />
        </ElFormItem>
      </ElCol>
      <ElCol :span="6">
        <ElTooltip effect="dark" :content="t('task.waybackUrlMsg')" placement="top">
          <ElFormItem label="waybackurl" prop="type" v-if="taskForm.urlScan">
            <ElSwitch
              v-model="taskForm.waybackurl"
              inline-prompt
              :active-text="t('common.switchAction')"
              :inactive-text="t('common.switchInactive')"
            />
          </ElFormItem>
        </ElTooltip>
      </ElCol>
      <ElCol :span="12" :offset="6">
        <ElFormItem :label="t('task.pageMonitoring')" prop="type" v-if="taskForm.urlScan">
          <ElRadioGroup v-model="taskForm.pageMonitoring">
            <ElRadio label="None" name="pageMonitoring" />
            <ElTooltip effect="dark" :content="t('task.msgPageMonitoringAll')" placement="top">
              <ElRadio label="All" name="pageMonitoring" :checked="true" />
            </ElTooltip>
            <ElTooltip effect="dark" :content="t('task.msgPageMonitoringJs')" placement="top">
              <ElRadio label="JS" name="pageMonitoring" />
            </ElTooltip>
          </ElRadioGroup>
        </ElFormItem>
      </ElCol>
    </ElRow>
    <ElFormItem :label="t('crawler.crawlerName')" prop="type">
      <ElTooltip effect="dark" :content="t('task.msgCrawler')" placement="top">
        <ElSwitch
          v-model="taskForm.crawlerScan"
          inline-prompt
          :active-text="t('common.switchAction')"
          :inactive-text="t('common.switchInactive')"
        />
      </ElTooltip>
    </ElFormItem>
    <ElDivider content-position="center" style="width: 60%; left: 20%">{{
      t('task.vulScan')
    }}</ElDivider>
    <ElRow>
      <ElCol :span="6">
        <ElFormItem :label="t('task.vulScan')">
          <ElSwitch
            v-model="taskForm.vulScan"
            inline-prompt
            :active-text="t('common.switchAction')"
            :inactive-text="t('common.switchInactive')"
          />
        </ElFormItem>
      </ElCol>
      <ElCol :span="18">
        <ElFormItem :label="t('task.vulList')" prop="type" v-if="taskForm.vulScan">
          <ElSelectV2
            v-model="taskForm.vulList"
            filterable
            :options="vulOptions"
            placeholder="Please select vul"
            style="width: 80%"
            multiple
            collapse-tags
            collapse-tags-tooltip
            tag-type="info"
            :max-collapse-tags="3"
          />
        </ElFormItem>
      </ElCol>
    </ElRow>
    <ElDivider />
    <ElRow>
      <ElCol :span="2" :offset="7">
        <ElFormItem>
          <ElButton type="primary" @click="submitForm(ruleFormRef)" :loading="saveLoading">{{
            t('task.save')
          }}</ElButton>
        </ElFormItem>
      </ElCol>
    </ElRow>
  </ElForm>
</template>
