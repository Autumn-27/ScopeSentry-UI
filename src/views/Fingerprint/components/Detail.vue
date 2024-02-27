<script setup lang="ts">
import {
  ElFormItem,
  ElInput,
  ElRow,
  ElCol,
  FormRules,
  FormInstance,
  ElForm,
  ElButton,
  ElDivider,
  ElSwitch
} from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { reactive, ref } from 'vue'
import { toRefs } from '@vueuse/core'
import { updateFingerprintDataApi, addFingerprintDataApi } from '@/api/fingerprint'
const { t } = useI18n()
const props = defineProps<{
  closeDialog: () => void
  getList: () => void
  fingerprintForm: {
    id: string
    name: string
    rule: string
    category: string
    parent_category: string
    state: boolean
  }
}>()
const { fingerprintForm } = toRefs(props)
const localFingerprintForm = ref({ ...fingerprintForm.value })

interface RuleForm {
  name: string
  rule: string
}
const rules = reactive<FormRules<RuleForm>>({
  name: [{ required: true, message: t('fingerprint.nameMsg'), trigger: 'blur' }],
  rule: [{ required: true, message: t('fingerprint.ruleMsg'), trigger: 'blur' }]
})
const saveLoading = ref(false)
const ruleFormRef = ref<FormInstance>()
const submitForm = async (formEl: FormInstance | undefined) => {
  saveLoading.value = true
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      let res
      console.log('submit!')
      if (localFingerprintForm.value.id != '') {
        res = await updateFingerprintDataApi(
          localFingerprintForm.value.id,
          localFingerprintForm.value.name,
          localFingerprintForm.value.rule,
          localFingerprintForm.value.category,
          localFingerprintForm.value.parent_category,
          localFingerprintForm.value.state
        )
      } else {
        res = await addFingerprintDataApi(
          localFingerprintForm.value.name,
          localFingerprintForm.value.rule,
          localFingerprintForm.value.category,
          localFingerprintForm.value.parent_category,
          localFingerprintForm.value.state
        )
      }
      if (res.code === 200) {
        props.getList()
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
  <ElForm
    :model="localFingerprintForm"
    label-width="120px"
    :rules="rules"
    status-icon
    ref="ruleFormRef"
  >
    <ElFormItem :label="t('fingerprint.name')" prop="name">
      <ElInput v-model="localFingerprintForm.name" :placeholder="t('fingerprint.nameMsg')" />
    </ElFormItem>
    <ElFormItem :label="t('fingerprint.rule')" prop="rule">
      <ElInput v-model="localFingerprintForm.rule" :placeholder="t('fingerprint.ruleMsg')" />
    </ElFormItem>
    <ElFormItem :label="t('fingerprint.category')">
      <ElInput v-model="localFingerprintForm.category" :placeholder="t('fingerprint.category')" />
    </ElFormItem>
    <ElFormItem :label="t('fingerprint.parentCategory')">
      <ElInput
        v-model="localFingerprintForm.parent_category"
        :placeholder="t('fingerprint.parentCategory')"
      />
    </ElFormItem>
    <ElFormItem :label="t('common.state')">
      <ElSwitch
        v-model="localFingerprintForm.state"
        inline-prompt
        :active-text="t('common.switchAction')"
        :inactive-text="t('common.switchInactive')"
      />
    </ElFormItem>
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
