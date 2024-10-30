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
  ElInputNumber,
  ElText,
  ElMessage,
  CheckboxValueType
} from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { computed, reactive, ref } from 'vue'
import { addProjectDataApi, getProjectContentDataApi, updateProjectDataApi } from '@/api/project'
import { getPocDataAllApi } from '@/api/poc'
import { getPortDictDataApi } from '@/api/DictionaryManagement'
import { getNodeDataOnlineApi } from '@/api/node'
const { t } = useI18n()
let projectForm = reactive({
  name: '',
  tag: '',
  logo: '',
  target: '',
  scheduledTasks: true,
  subdomainScan: true,
  subdomainConfig: [],
  urlScan: true,
  sensitiveInfoScan: true,
  pageMonitoring: 'JS',
  crawlerScan: true,
  vulScan: false,
  vulList: [],
  hour: 24,
  waybackurl: true,
  portScan: true,
  ports: '',
  dirScan: false,
  node: [] as string[],
  allNode: false,
  duplicates: ''
})
const props = defineProps<{
  closeDialog: () => void
  projectid: string
  getProjectData: (pageIndex: number, pageSize: number) => void
  schedule: boolean
}>()
interface RuleForm {
  name: string
  tag: string
  target: string
}
// const rules = reactive<FormRules<RuleForm>>({
//   name: [{ required: true, message: t('project.msgProject'), trigger: 'blur' }],
//   tag: [{ required: true, message: t('project.msgProjectTag'), trigger: 'blur' }],
//   target: [{ required: true, message: t('project.msgProjectScope'), trigger: 'blur' }]
// })
const rules = computed(() => {
  const baseRules = {
    name: [{ required: true, message: t('project.msgProject'), trigger: 'blur' }],
    tag: [{ required: true, message: t('project.msgProjectTag'), trigger: 'blur' }],
    target: [{ required: true, message: t('project.msgProjectScope'), trigger: 'blur' }],
    node: [{ required: false, message: t('task.nodeMsg'), trigger: 'blur' }]
  }

  if (projectForm.scheduledTasks) {
    baseRules.node = [{ required: true, message: t('task.nodeMsg'), trigger: 'blur' }]
  }

  return baseRules
})

const vulOptions = reactive<{ value: string; label: string }[]>([])
const getPocList = async () => {
  const res = await getPocDataAllApi()
  console.log(res.data.list)
  if (res.data.list.length > 0) {
    vulOptions.push({ value: 'All Poc', label: 'All Poc' })
    res.data.list.forEach((item) => {
      vulOptions.push({ value: item.id, label: item.name })
    })
  }
}
const saveLoading = ref(false)
const ruleFormRef = ref<FormInstance>()
const runNow = ref(false)
const submitForm = async (formEl: FormInstance | undefined) => {
  saveLoading.value = true
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (props.projectid == '') {
        const res = await addProjectDataApi(
          runNow.value,
          projectForm.name,
          projectForm.tag,
          projectForm.target,
          projectForm.logo,
          projectForm.scheduledTasks,
          projectForm.subdomainScan,
          projectForm.subdomainConfig,
          projectForm.urlScan,
          projectForm.sensitiveInfoScan,
          projectForm.pageMonitoring,
          projectForm.crawlerScan,
          projectForm.vulScan,
          projectForm.vulList,
          projectForm.hour,
          projectForm.portScan,
          projectForm.ports,
          projectForm.dirScan,
          projectForm.allNode,
          projectForm.node,
          projectForm.waybackurl,
          projectForm.duplicates
        )
        if (res.code === 200) {
          props.closeDialog()
        }
        saveLoading.value = false
      } else {
        const res = await updateProjectDataApi(
          runNow.value,
          props.projectid,
          projectForm.name,
          projectForm.tag,
          projectForm.target,
          projectForm.logo,
          projectForm.scheduledTasks,
          projectForm.subdomainScan,
          projectForm.subdomainConfig,
          projectForm.urlScan,
          projectForm.sensitiveInfoScan,
          projectForm.pageMonitoring,
          projectForm.crawlerScan,
          projectForm.vulScan,
          projectForm.vulList,
          projectForm.hour,
          projectForm.portScan,
          projectForm.ports,
          projectForm.dirScan,
          projectForm.allNode,
          projectForm.node,
          projectForm.waybackurl,
          projectForm.duplicates
        )
        if (res.code === 200) {
          props.closeDialog()
        }
        saveLoading.value = false
      }
    } else {
      console.log('error submit!', fields)
      saveLoading.value = false
    }
  })
  props.getProjectData(1, 50)
}
getPocList()
const dataLoading = ref(false)
const getProjectInfo = async () => {
  if (props.projectid != '') {
    dataLoading.value = true
    const res = await getProjectContentDataApi(props.projectid)
    projectForm.name = res.data.name
    projectForm.tag = res.data.tag
    projectForm.target = res.data.target
    projectForm.logo = res.data.logo
    projectForm.scheduledTasks = res.data.scheduledTasks
    projectForm.subdomainScan = res.data.subdomainScan
    projectForm.subdomainConfig = res.data.subdomainConfig
    projectForm.urlScan = res.data.urlScan
    projectForm.sensitiveInfoScan = res.data.sensitiveInfoScan
    projectForm.pageMonitoring = res.data.pageMonitoring
    projectForm.crawlerScan = res.data.crawlerScan
    projectForm.vulScan = res.data.vulScan
    projectForm.vulList = res.data.vulList
    projectForm.hour = res.data.hour
    projectForm.portScan = res.data.portScan
    projectForm.ports = res.data.ports
    projectForm.dirScan = res.data.dirScan
    projectForm.allNode = res.data.allNode
    projectForm.node = res.data.node
    projectForm.duplicates = res.data.duplicates
    dataLoading.value = false
    // props.closedataLoading()
  }
}
getProjectInfo()
const portOptions = reactive<{ value: string; label: string }[]>([])
const getPortList = async () => {
  const res = await getPortDictDataApi('', 1, 10000)
  if (res.data.list.length > 0) {
    res.data.list.forEach((item) => {
      portOptions.push({ value: item.id, label: item.name })
    })
  }
}
getPortList()
const indeterminate = ref(false)
const isCheckboxDisabledNode = ref(false)
const nodeOptions = reactive<{ value: string; label: string }[]>([])
const getNodeList = async () => {
  const res = await getNodeDataOnlineApi()
  console.log(res.data.list)
  if (res.data.list.length > 0) {
    isCheckboxDisabledNode.value = false
    res.data.list.forEach((item) => {
      nodeOptions.push({ value: item, label: item })
    })
  } else {
    isCheckboxDisabledNode.value = true
    ElMessage.warning(t('node.onlineNodeMsg'))
  }
  console.log(nodeOptions)
}
getNodeList()
const handleCheckAll = (val: CheckboxValueType) => {
  indeterminate.value = false
  if (val) {
    projectForm.allNode = true
    projectForm.node = []
    nodeOptions.forEach((option) => {
      return projectForm.node.push(option.value)
    })
  } else {
    projectForm.allNode = false
    projectForm.node = []
  }
}
</script>
<template>
  <ElForm
    :model="projectForm"
    label-width="auto"
    :rules="rules"
    status-icon
    ref="ruleFormRef"
    :loading="dataLoading"
  >
    <ElFormItem :label="t('project.projectName')" prop="name">
      <ElInput v-model="projectForm.name" :placeholder="t('project.msgProject')" />
    </ElFormItem>
    <ElFormItem label="TAG" prop="tag">
      <ElInput v-model="projectForm.tag" :placeholder="t('project.msgProjectTag')" />
    </ElFormItem>
    <ElFormItem :label="t('project.projectScope')" prop="target">
      <ElInput
        v-model="projectForm.target"
        :placeholder="t('project.msgProjectScope')"
        type="textarea"
        :autosize="{ minRows: 6, maxRows: 15 }"
      />
    </ElFormItem>
    <ElFormItem label="Logo" prop="logo">
      <ElInput v-model="projectForm.logo" placeholder="http(s)://xxxxx.xx" />
    </ElFormItem>

    <ElDivider content-position="center" style="">{{ t('project.scheduledTasks') }}</ElDivider>
    <ElRow>
      <ElCol :span="6">
        <ElFormItem :label="t('project.scheduledTasks')">
          <ElTooltip effect="dark" :content="t('project.msgScheduledTasks')" placement="top">
            <ElSwitch
              v-model="projectForm.scheduledTasks"
              inline-prompt
              :active-text="t('common.switchAction')"
              :inactive-text="t('common.switchInactive')"
            />
          </ElTooltip>
        </ElFormItem>
      </ElCol>
      <ElCol :span="12" v-if="projectForm.scheduledTasks">
        <ElFormItem :label="t('project.cycle')" prop="type">
          <ElInputNumber
            v-model="projectForm.hour"
            :min="1"
            controls-position="right"
            size="small"
          /><ElText style="position: relative; left: 16px">Hour</ElText>
        </ElFormItem>
      </ElCol>
    </ElRow>
    <ElRow>
      <ElCol>
        <ElFormItem :label="t('configuration.runNowOne')">
          <ElSwitch
            v-model="runNow"
            inline-prompt
            :active-text="t('common.switchAction')"
            :inactive-text="t('common.switchInactive')"
          />
        </ElFormItem>
      </ElCol>
    </ElRow>
    <ElTooltip
      :content="t('task.selectNodeMsg')"
      placement="top"
      v-if="projectForm.scheduledTasks || runNow"
    >
      <ElFormItem :label="t('task.nodeSelect')" prop="node">
        <ElSelectV2
          v-model="projectForm.node"
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
              v-model="projectForm.allNode"
              :disabled="isCheckboxDisabledNode"
              :indeterminate="indeterminate"
              @change="handleCheckAll"
            >
              All
            </ElCheckbox>
          </template>
        </ElSelectV2>
      </ElFormItem>
    </ElTooltip>
    <div v-if="projectForm.scheduledTasks || runNow">
      <ElDivider content-position="center" style="width: 60%; left: 20%">{{
        t('task.duplicates')
      }}</ElDivider>
      <ElRow>
        <ElCol :span="24">
          <ElFormItem :label="t('task.duplicates')" prop="type">
            <ElRadioGroup v-model="projectForm.duplicates">
              <ElRadio label="None" name="duplicates" :checked="true" value="None" />
              <ElTooltip effect="dark" :content="t('task.duplicatesMsg')" placement="top">
                <ElRadio
                  :label="t('task.duplicatesSubdomain')"
                  name="duplicates"
                  value="subdomain"
                />
              </ElTooltip>
            </ElRadioGroup>
          </ElFormItem>
        </ElCol>
      </ElRow>
    </div>
    <ElDivider />
    <ElRow>
      <ElCol :span="2" :offset="12">
        <ElFormItem>
          <ElButton type="primary" @click="submitForm(ruleFormRef)" :loading="saveLoading">{{
            t('task.save')
          }}</ElButton>
        </ElFormItem>
      </ElCol>
    </ElRow>
  </ElForm>
</template>
