<script setup lang="ts">
import { ElRow, ElCol, ElButton } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { ElCard } from 'element-plus'
import { ref, onBeforeMount } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { getSubdomainDictionaryApi, saveSubdomainDictionaryApi } from '@/api/DictionaryManagement'
const { t } = useI18n()
const dict = ref(``)
const extensions = [javascript(), oneDark]
onBeforeMount(async () => {
  try {
    const res = await getSubdomainDictionaryApi()

    if (res.code === 200) {
      dict.value = res.data.dict
    } else {
      console.error(`API request failed with status code ${res.code}`)
    }
  } catch (error) {
    console.error('An error occurred while fetching the subdomain dictionary:', error)
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
  const res = await saveSubdomainDictionaryApi(dict.value)
  if (res.code == 200) {
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
          <span>{{ t('router.subdomainDictionary') }}</span>
        </ElCol>
        <ElCol :span="2" :offset="19">
          <ElButton type="primary" @click="confirmAdd" @loading="saveLoading">{{
            t('common.save')
          }}</ElButton>
        </ElCol>
      </ElRow>
    </template>
    <codemirror
      v-model="dict"
      :style="{ height: '800px' }"
      :autofocus="true"
      :indent-with-tab="true"
      :tab-size="2"
      :extensions="extensions"
    />
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
