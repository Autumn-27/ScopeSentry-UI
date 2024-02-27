<script setup lang="ts">
import { ElRow, ElCol, ElButton, ElForm, ElFormItem, ElInput } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { ElCard } from 'element-plus'
import { ref, reactive, onBeforeMount } from 'vue'
import { getSystemConfigurationApi, saveSystemConfigurationApi } from '@/api/Configuration'
const { t } = useI18n()
const form = reactive({
  timezone: ''
})
onBeforeMount(async () => {
  try {
    const res = await getSystemConfigurationApi()

    if (res.code == 200) {
      form.timezone = res.data.timezone
    } else {
      console.error(`API request failed with status code ${res.code}`)
    }
  } catch (error) {
    console.error('An error occurred while fetching the subfinder config:', error)
  }
})
const confirmAdd = async () => {
  const confirmed = window.confirm('Do you want to save the data?')
  if (confirmed) {
    await save()
  }
}
const save = async () => {
  saveLoading.value = true
  const res = await saveSystemConfigurationApi(form.timezone)
  if (res.code == 200) {
    saveLoading.value = false
  } else {
    saveLoading.value = false
  }
}
const saveLoading = ref(false)
</script>

<template>
  <ElCard shadow="never" class="mb-20px">
    <template #header>
      <ElRow>
        <ElCol :span="3" style="height: 100%">
          <span>{{ t('configuration.system') }}</span>
        </ElCol>
      </ElRow>
    </template>
    <ElForm :model="form">
      <ElRow>
        <ElCol :span="6">
          <ElFormItem :label="t('configuration.timezone')">
            <ElInput v-model="form.timezone" />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElFormItem>
        <ElButton type="primary" @click="confirmAdd" :loading="saveLoading">Save</ElButton>
      </ElFormItem>
    </ElForm>
  </ElCard>
</template>

<style scoped>
.header-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
