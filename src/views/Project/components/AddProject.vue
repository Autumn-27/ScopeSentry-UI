<script setup lang="ts">
import {
  ElDivider,
  ElForm,
  ElFormItem,
  ElInput,
  ElRow,
  ElCol,
  ElButton,
  FormInstance,
  CheckboxValueType
} from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { computed, onMounted, reactive, ref } from 'vue'
import { addProjectDataApi, getProjectContentDataApi, updateProjectDataApi } from '@/api/project'
import { Dialog } from '@/components/Dialog'
import { getTemplateDataApi } from '@/api/task'
import DetailTemplate from '../../Task/components/DetailTemplate.vue'
const { t } = useI18n()
let projectForm = reactive({
  name: '',
  tag: '',
  logo: '',
  target: '',
  ignore: '',
  scheduledTasks: false,
  hour: 24,
  node: [] as string[],
  allNode: false,
  duplicates: 'None',
  template: ''
})
const props = defineProps<{
  closeDialog: () => void
  projectid: string
  getProjectData: (pageIndex: number, pageSize: number) => void
  schedule: boolean
}>()

const rules = computed(() => {
  const baseRules = {
    name: [{ required: true, message: t('project.msgProject'), trigger: 'blur' }],
    tag: [{ required: true, message: t('project.msgProjectTag'), trigger: 'blur' }],
    target: [{ required: true, message: t('project.msgProjectScope'), trigger: 'blur' }],
    node: [{ required: false, message: t('task.nodeMsg'), trigger: 'blur' }],
    template: [{ required: true, message: 'Please select template', trigger: 'blur' }]
  }

  if (projectForm.scheduledTasks) {
    baseRules.node = [{ required: true, message: t('task.nodeMsg'), trigger: 'blur' }]
  }

  return baseRules
})

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
          projectForm.hour,
          projectForm.allNode,
          projectForm.node,
          projectForm.duplicates,
          projectForm.ignore,
          projectForm.template
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
          projectForm.hour,
          projectForm.allNode,
          projectForm.node,
          projectForm.duplicates,
          projectForm.ignore,
          projectForm.template
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
    projectForm.hour = res.data.hour
    projectForm.allNode = res.data.allNode
    projectForm.node = res.data.node
    projectForm.duplicates = res.data.duplicates
    projectForm.ignore = res.data.ignore
    projectForm.template = res.data.template
    dataLoading.value = false
  }
}

const indeterminate = ref(false)
const isCheckboxDisabledNode = ref(false)
const nodeOptions = reactive<{ value: string; label: string }[]>([])
const getNodeList = async () => {
  // const res = await getNodeDataOnlineApi()
  // console.log(res.data.list)
  // if (res.data.list.length > 0) {
  //   isCheckboxDisabledNode.value = false
  //   res.data.list.forEach((item) => {
  //     nodeOptions.push({ value: item, label: item })
  //   })
  // } else {
  //   isCheckboxDisabledNode.value = true
  //   ElMessage.warning(t('node.onlineNodeMsg'))
  // }
  // console.log(nodeOptions)
}

const handleCheckAll = (val: CheckboxValueType) => {
  indeterminate.value = false
  if (val) {
    projectForm.node = []
    nodeOptions.forEach((option) => {
      return projectForm.node.push(option.value)
    })
  } else {
    projectForm.node = []
  }
}
const templateOptions = reactive<{ value: string; label: string }[]>([])
const getTemplateList = async () => {
  templateOptions.length = 0
  const res = await getTemplateDataApi('', 1, 1000)
  if (res.data.list.length > 0) {
    res.data.list.forEach((item) => {
      templateOptions.push({ value: item.id, label: item.name })
    })
  }
}
onMounted(() => {
  getProjectInfo()
  getNodeList()
  getTemplateList()
})
const templateId = ref('')
let DialogTitle = ''
const dialogVisible = ref(false)
const editTemplate = async (data) => {
  templateId.value = data
  if (data != '') {
    DialogTitle = t('task.editTemplate')
  }
  dialogVisible.value = true
}
const closeTemplateDialog = () => {
  dialogVisible.value = false
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
        :placeholder="t('task.msgTarget')"
        type="textarea"
        :autosize="{ minRows: 6, maxRows: 15 }"
      />
    </ElFormItem>
    <ElFormItem :label="t('task.ignore')" prop="ignore">
      <ElInput
        v-model="projectForm.ignore"
        :placeholder="t('task.ignoreMsg')"
        type="textarea"
        rows="10"
      />
    </ElFormItem>
    <ElFormItem label="Logo" prop="logo">
      <ElInput v-model="projectForm.logo" placeholder="http(s)://xxxxx.xx" />
    </ElFormItem>
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
  <Dialog
    v-model="dialogVisible"
    :title="DialogTitle"
    center
    fullscreen
    style="border-radius: 15px; box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3)"
  >
    <DetailTemplate
      :closeDialog="closeTemplateDialog"
      :getList="getTemplateList"
      :id="templateId"
    />
  </Dialog>
</template>
