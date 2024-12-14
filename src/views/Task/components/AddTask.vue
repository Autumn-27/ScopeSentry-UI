<script setup lang="ts">
import {
  ElCheckbox,
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
  ElOption,
  ElButton,
  FormInstance,
  ElSelect,
  ElMessage,
  ElInputNumber,
  CheckboxValueType,
  ElText
} from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { onMounted, reactive, ref, toRefs, watch } from 'vue'
import { getNodeDataOnlineApi } from '@/api/node'
import {
  addTaskApi,
  getScheduleDetailApi,
  getTaskDetailApi,
  getTemplateDataApi,
  updateScheduleApi
} from '@/api/task'
import { Dialog } from '@/components/Dialog'
import DetailTemplate from './DetailTemplate.vue'
const { t } = useI18n()

const props = defineProps<{
  closeDialog: () => void
  getList: () => void
  create: boolean
  schedule: boolean
  taskid: string
}>()

interface RuleForm {
  name: string
  target: string
  node: []
  template: string
}
const rules = reactive<FormRules<RuleForm>>({
  name: [{ required: true, message: t('task.msgTaskName'), trigger: 'blur' }],
  target: [{ required: true, message: t('task.msgTarget'), trigger: 'blur' }],
  node: [{ required: true, message: t('task.nodeMsg'), trigger: 'blur' }],
  template: [{ required: true, message: 'Please select template', trigger: 'blur' }]
})

const saveLoading = ref(false)
const ruleFormRef = ref<FormInstance>()
const submitForm = async (formEl: FormInstance | undefined) => {
  saveLoading.value = true
  try {
    if (!formEl) return

    const valid = await formEl.validate() // 使用 Promise 风格的 validate
    if (valid) {
      let res
      if (props.taskid) {
        // 修改计划任务
        res = await updateScheduleApi(
          props.taskid,
          taskData.name,
          taskData.target,
          taskData.ignore,
          taskData.node,
          taskData.allNode,
          taskData.duplicates,
          taskData.scheduledTasks,
          taskData.hour,
          taskData.template
        )
      } else {
        // 创建新任务
        res = await addTaskApi(
          taskData.name,
          taskData.target,
          taskData.ignore,
          taskData.node,
          taskData.allNode,
          taskData.duplicates,
          taskData.scheduledTasks,
          taskData.hour,
          taskData.template
        )
      }

      if (res.code === 200) {
        props.closeDialog()
        props.getList()
      }
    }
  } catch (error) {
    console.error('提交表单时发生错误:', error)
  } finally {
    saveLoading.value = false // 确保无论成功或失败都重置加载状态
  }
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
  getNodeList()
  getTemplateList()
})
const indeterminate = ref(false)
const isCheckboxDisabledNode = ref(false)
const taskData = reactive({
  name: '',
  target: '',
  ignore: '',
  node: [] as string[],
  allNode: true,
  scheduledTasks: false,
  hour: 24,
  duplicates: 'None',
  template: ''
})
const handleCheckAll = (val: CheckboxValueType) => {
  indeterminate.value = false
  if (val) {
    taskData.node = []
    nodeOptions.forEach((option) => {
      return taskData.node.push(option.value)
    })
  } else {
    taskData.node = []
  }
}
const templateId = ref('')
const dialogVisible = ref(false)

let DialogTitle = t('task.addTemplate')
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

const loadTaskData = async (id) => {
  const res = await getTaskDetailApi(id)
  taskData.name = res.data.name
  taskData.target = res.data.target
  taskData.ignore = res.data.ignore
  taskData.node = res.data.node
  taskData.allNode = res.data.allNode
  taskData.scheduledTasks = res.data.scheduledTasks
  taskData.hour = res.data.hour
  taskData.duplicates = res.data.duplicates
  taskData.template = res.data.template
}

const loadScheduleData = async (id) => {
  const res = await getScheduleDetailApi(id)
  taskData.name = res.data.name
  taskData.target = res.data.target
  taskData.ignore = res.data.ignore
  taskData.node = res.data.node
  taskData.allNode = res.data.allNode
  taskData.scheduledTasks = res.data.scheduledTasks
  taskData.hour = res.data.hour
  taskData.duplicates = res.data.duplicates
  taskData.template = res.data.template
}

watch(
  () => props.taskid, // 监听 props.taskid 的变化
  async (newId) => {
    if (newId) {
      // 如果传入了 ID，则加载已有数据
      if (props.schedule) {
        // 如果是计划任务则从计划任务中加载数据
        await loadScheduleData(newId)
      } else {
        // 从任务中加载数据
        await loadTaskData(newId)
      }
    } else {
      taskData.name = ''
      taskData.target = ''
      taskData.ignore = ''
      taskData.node = []
      taskData.allNode = true
      taskData.scheduledTasks = false
      taskData.hour = 24
      taskData.duplicates = 'None'
      taskData.template = ''
    }
  },
  { immediate: true } // 确保组件挂载时立即触发
)
</script>
<template>
  <ElForm
    :model="taskData"
    label-width="auto"
    :rules="rules"
    status-icon
    ref="ruleFormRef"
    :disabled="create ? false : true"
  >
    <ElFormItem :label="t('task.taskName')" prop="name">
      <ElInput v-model="taskData.name" :placeholder="t('task.msgTaskName')" />
    </ElFormItem>
    <ElFormItem :label="t('task.taskTarget')" prop="target">
      <ElInput
        v-model="taskData.target"
        :placeholder="t('task.msgTarget')"
        type="textarea"
        rows="10"
      />
    </ElFormItem>
    <ElFormItem :label="t('task.ignore')" prop="ignore">
      <ElInput
        v-model="taskData.ignore"
        :placeholder="t('task.ignoreMsg')"
        type="textarea"
        rows="10"
      />
    </ElFormItem>
    <ElRow>
      <ElCol :span="12">
        <ElFormItem :label="t('task.nodeSelect')" prop="node">
          <ElSelectV2
            v-model="taskData.node"
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
              v-model="taskData.allNode"
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
              v-model="taskData.scheduledTasks"
              inline-prompt
              :active-text="t('common.switchAction')"
              :inactive-text="t('common.switchInactive')"
            />
          </ElTooltip>
        </ElFormItem>
      </ElCol>
      <ElCol :span="12" v-if="taskData.scheduledTasks">
        <ElFormItem :label="t('project.cycle')" prop="type">
          <ElInputNumber
            v-model="taskData.hour"
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
          <ElRadioGroup v-model="taskData.duplicates">
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
    <ElFormItem :label="t('router.scanTemplate')" prop="template">
      <!-- <ElSelectV2 v-model="taskData.template" placeholder="Please select node" style="width: 50%" /> -->
      <ElSelect v-model="taskData.template" placeholder="Please select template" style="width: 30%">
        <ElOption
          v-for="item in templateOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
          <ElRow>
            <ElCol :span="16">
              <span style="float: left">{{ item.label }}</span>
            </ElCol>
            <ElCol :span="8">
              <ElButton
                type="primary"
                size="small"
                style="margin-left: 15px"
                @click.stop="editTemplate(item.value)"
              >
                {{ t('common.edit') }}
              </ElButton>
            </ElCol>
          </ElRow>
        </ElOption>
        <template #footer>
          <ElButton
            type="success"
            size="small"
            plain
            style="margin-left: 15px"
            @click.stop="editTemplate('')"
          >
            {{ t('common.new') }}
          </ElButton>
        </template>
      </ElSelect>
    </ElFormItem>
    <ElDivider />
    <ElRow>
      <ElCol :span="2" :offset="10">
        <ElFormItem>
          <ElButton type="primary" @click="submitForm(ruleFormRef)" :loading="saveLoading">
            {{ t('task.save') }}
          </ElButton>
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
