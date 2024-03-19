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
  ElText
} from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { reactive, ref } from 'vue'
import { addProjectDataApi } from '@/api/project'
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
  day: 0,
  hour: 0,
  minute: 0
})
const props = defineProps<{
  closeDialog: () => void
}>()
interface RuleForm {
  name: string
  tag: string
  target: string
}
const rules = reactive<FormRules<RuleForm>>({
  name: [{ required: true, message: t('project.msgProject'), trigger: 'blur' }],
  tag: [{ required: true, message: t('project.msgProjectTag'), trigger: 'blur' }],
  target: [{ required: true, message: t('project.msgProjectScope'), trigger: 'blur' }]
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
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log('submit!')
      console.log(projectForm)
      const res = await addProjectDataApi(
        projectForm.name,
        projectForm.tag,
        projectForm.target,
        projectForm.scheduledTasks,
        projectForm.subdomainScan,
        projectForm.subdomainConfig,
        projectForm.urlScan,
        projectForm.sensitiveInfoScan,
        projectForm.pageMonitoring,
        projectForm.crawlerScan,
        projectForm.vulScan,
        projectForm.vulList,
        projectForm.day,
        projectForm.hour,
        projectForm.minute
      )
      if (res.code === 200) {
        props.closeDialog()
      }
      saveLoading.value = false
    } else {
      console.log('error submit!', fields)
      saveLoading.value = false
    }
  })
}
</script>
<template>
  <ElForm :model="projectForm" label-width="120px" :rules="rules" status-icon ref="ruleFormRef">
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
        :autosize="{ minRows: 6 }"
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
        <ElFormItem :label="t('project.cycle')" prop="type" v-if="projectForm.subdomainScan">
          <ElInputNumber
            v-model="projectForm.day"
            :min="0"
            controls-position="right"
            size="small"
            style="position: relative; width: 20%"
          /><ElText style="position: relative; left: 6px">Day</ElText>
          <ElInputNumber
            v-model="projectForm.hour"
            :min="0"
            :max="23"
            controls-position="right"
            size="small"
            style="position: relative; width: 20%; left: 16px"
          /><ElText style="position: relative; left: 24px">Hour</ElText>
          <ElInputNumber
            v-model="projectForm.minute"
            :min="0"
            :max="59"
            controls-position="right"
            size="small"
            style="position: relative; width: 20%; left: 32px"
          /><ElText style="position: relative; left: 38px">Minute</ElText>
        </ElFormItem>
      </ElCol>
    </ElRow>
    <div v-if="projectForm.scheduledTasks">
      <ElDivider content-position="center" style="width: 60%; left: 20%">{{
        t('subdomain.subdomainName')
      }}</ElDivider>
      <ElRow>
        <ElCol :span="6">
          <ElFormItem :label="t('task.subdomainScan')">
            <ElSwitch
              v-model="projectForm.subdomainScan"
              inline-prompt
              :active-text="t('common.switchAction')"
              :inactive-text="t('common.switchInactive')"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem :label="t('task.config')" prop="type" v-if="projectForm.subdomainScan">
            <ElCheckboxGroup v-model="projectForm.subdomainConfig">
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
                v-model="projectForm.urlScan"
                inline-prompt
                :active-text="t('common.switchAction')"
                :inactive-text="t('common.switchInactive')"
              />
            </ElFormItem>
          </ElTooltip>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem :label="t('task.sensitiveInfoScan')" prop="type" v-if="projectForm.urlScan">
            <ElSwitch
              v-model="projectForm.sensitiveInfoScan"
              inline-prompt
              :active-text="t('common.switchAction')"
              :inactive-text="t('common.switchInactive')"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12" :offset="6">
          <ElFormItem :label="t('task.pageMonitoring')" prop="type" v-if="projectForm.urlScan">
            <ElRadioGroup v-model="projectForm.pageMonitoring">
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
            v-model="projectForm.crawlerScan"
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
              v-model="projectForm.vulScan"
              inline-prompt
              :active-text="t('common.switchAction')"
              :inactive-text="t('common.switchInactive')"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="18">
          <ElFormItem :label="t('task.vulList')" prop="type" v-if="projectForm.vulScan">
            <ElSelectV2
              v-model="projectForm.vulList"
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
    </div>
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
