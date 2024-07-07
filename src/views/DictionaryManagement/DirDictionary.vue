<script setup lang="ts">
import { ElRow, ElCol, ElButton, ElUpload, ElFormItem, ElForm } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { ElCard } from 'element-plus'
import { ref } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { getDirDictionaryApi } from '@/api/DictionaryManagement'
const { t } = useI18n()
const getData = async () => {
  const response = await getDirDictionaryApi()
  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'dirdict') // 设置文件名
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
const userStore = useUserStore()
const uploadHeaders = ref({ Authorization: `${userStore.getToken}` })
</script>

<template>
  <ElCard shadow="never" class="mb-20px">
    <template #header>
      <ElRow>
        <ElCol :span="3" style="height: 100%">
          <span>{{ t('router.dirDictionary') }}</span>
        </ElCol>
      </ElRow>
    </template>
    <ElForm>
      <ElFormItem :label="t('common.upload')">
        <ElUpload class="upload-demo" action="/api/dictionary/dir/save" :headers="uploadHeaders">
          <ElButton type="primary" size="small">Click to upload</ElButton>
        </ElUpload>
      </ElFormItem>
      <ElFormItem :label="t('common.download')">
        <ElButton type="primary" size="small" @click="getData">Download</ElButton>
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
