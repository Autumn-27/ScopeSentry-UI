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
  FormInstance
} from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { reactive, ref } from 'vue'
const { t } = useI18n()
let taskForm = reactive({
  name: '',
  target: '',
  node: [],
  subdomainScan: true,
  subdomainConfig: [],
  urlScan: true,
  sensitiveInfoScan: true,
  pageMonitoring: 'JS',
  crawlerScan: true,
  vulScan: false,
  vulList: []
})
const props = defineProps<{
  closeDialog: () => void
}>()
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

const initials = [
  'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j'
]

const vulOptions = Array.from({ length: 1000 }).map((_, idx) => ({
  value: `Option${idx + 1}`,
  label: `${initials[idx % 10]}${idx}`
}))
const saveLoading = ref(false)
const ruleFormRef = ref<FormInstance>()
const submitForm = async (formEl: FormInstance | undefined) => {
  saveLoading.value = true
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
      console.log(taskForm)
      props.closeDialog()
      saveLoading.value = false
    } else {
      console.log('error submit!', fields)
      saveLoading.value = false
    }
  })
}
</script>
<template>
  <ElForm :model="taskForm" label-width="120px" :rules="rules" status-icon ref="ruleFormRef">
    <ElFormItem :label="t('task.taskName')" prop="name">
      <ElInput v-model="taskForm.name" :placeholder="t('task.msgTaskName')" />
    </ElFormItem>
    <ElFormItem :label="t('task.taskTarget')" prop="target">
      <ElInput
        v-model="taskForm.target"
        :placeholder="t('task.msgTarget')"
        type="textarea"
        :autosize="{ minRows: 6 }"
      />
    </ElFormItem>
    <ElFormItem :label="t('task.nodeSelect')" prop="node">
      <ElSelectV2
        v-model="taskForm.node"
        filterable
        :options="vulOptions"
        placeholder="Please select node"
        style="width: 100%"
        multiple
        tag-type="success"
        collapse-tags
        collapse-tags-tooltip
        :max-collapse-tags="7"
      />
    </ElFormItem>
    <ElDivider content-position="center" style="width: 60%; left: 20%">{{
      t('subdomain.subdomainName')
    }}</ElDivider>
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
      <ElCol :span="12">
        <ElFormItem :label="t('task.sensitiveInfoScan')" prop="type" v-if="taskForm.urlScan">
          <ElSwitch
            v-model="taskForm.sensitiveInfoScan"
            inline-prompt
            :active-text="t('common.switchAction')"
            :inactive-text="t('common.switchInactive')"
          />
        </ElFormItem>
      </ElCol>
      <ElCol :span="12" :offset="6">
        <ElFormItem :label="t('task.pageMonitoring')" prop="type" v-if="taskForm.urlScan">
          <ElRadioGroup v-model="taskForm.pageMonitoring">
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
            :max-collapse-tags="3"
          />
        </ElFormItem>
      </ElCol>
    </ElRow>
    <ElDivider />
    <ElRow>
      <ElCol :span="2" :offset="8">
        <ElFormItem>
          <ElButton type="primary" @click="submitForm(ruleFormRef)" :loading="saveLoading">{{
            t('task.save')
          }}</ElButton>
        </ElFormItem>
      </ElCol>
    </ElRow>
  </ElForm>
</template>
