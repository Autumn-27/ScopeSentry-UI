<script setup lang="ts">
import { ref, onBeforeMount, watch } from 'vue'
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElSelect,
  ElOption,
  ElButton,
  ElCol,
  ElRow,
  ElCard,
  ElMessage
} from 'element-plus'
import { Codemirror } from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { useI18n } from '@/hooks/web/useI18n'
import { getPluginDetailApi, savePluginDataApi } from '@/api/plugins'

const { t } = useI18n()

// 接收父组件传递的 id
const props = defineProps<{
  closeDialog: () => void
  getList: () => void
  id: string
}>()

// 表单数据
const form = ref({
  name: '',
  version: '',
  module: '',
  parameter: '',
  help: '',
  introduction: '',
  source: ''
})

const resetForm = () => {
  console.log('清空')
  form.value = {
    name: '',
    version: '',
    module: '',
    parameter: '',
    help: '',
    introduction: '',
    source: ''
  }
  content.value = '' // 清空 Codemirror 编辑器内容
}

// 校验规则
const rules = ref({
  name: [{ required: true, message: '', trigger: 'blur' }],
  module: [{ required: true, message: '', trigger: 'change' }],
  source: [{ required: true, message: '', trigger: 'blur' }]
})

// 模块选项
const moduleOptions = ref([
  { label: 'TargetHandler', value: 'TargetHandler' },
  { label: 'SubdomainScan', value: 'SubdomainScan' },
  { label: 'SubdomainSecurity', value: 'SubdomainSecurity' },
  { label: 'PortScanPreparation', value: 'PortScanPreparation' },
  { label: 'PortScan', value: 'PortScan' },
  { label: 'AssetMapping', value: 'AssetMapping' },
  { label: 'URLScan', value: 'URLScan' },
  { label: 'WebCrawler', value: 'WebCrawler' },
  { label: 'DirScan', value: 'DirScan' },
  { label: 'VulnerabilityScan', value: 'VulnerabilityScan' },
  { label: 'AssetHandle', value: 'AssetHandle' },
  { label: 'PortFingerprint', value: 'PortFingerprint' },
  { label: 'URLSecurity', value: 'URLSecurity' }
])

// Codemirror 配置
const content = ref('')
const extensions = [javascript(), oneDark]

// 检查是新建还是编辑
onBeforeMount(async () => {
  resetForm()
  if (props.id) {
    // 如果有 id，则查询该 id 的内容
    await fetchData(props.id)
  }
})

const isSystem = ref(false)
// 根据 id 查询配置数据
const fetchData = async (id: string) => {
  try {
    const res = await getPluginDetailApi(id)
    if (res.code === 200) {
      const data = res.data
      form.value.name = data.name
      form.value.version = data.version
      form.value.module = data.module
      form.value.parameter = data.parameter
      form.value.help = data.help
      form.value.introduction = data.introduction
      content.value = data.source
      isSystem.value = data.isSystem
    } else {
      ElMessage.error(`数据加载失败：${res.message}`)
    }
  } catch (error) {
    console.error('查询数据时发生错误:', error)
  }
}

const saveLoading = ref(false)

// 监听 id 的变化，如果 id 变化则重新获取数据
watch(
  () => props.id,
  async (newId) => {
    if (newId === '') {
      resetForm()
    } else {
      await fetchData(newId)
    }
  }
)
const save = async () => {
  saveLoading.value = true // 开始加载状态
  if (form.value.name == '') {
    ElMessage.error('name 不能为空')
    saveLoading.value = false // 结束加载状态
    return
  }
  if (form.value.module == '') {
    ElMessage.error('module 不能为空')
    saveLoading.value = false // 结束加载状态
    return
  }
  if (!isSystem.value) {
    if (content.value == '') {
      ElMessage.error('源码 不能为空')
      saveLoading.value = false // 结束加载状态
      return
    }
  }
  try {
    await savePluginDataApi(
      props.id,
      form.value.name,
      form.value.version,
      form.value.module,
      form.value.parameter,
      form.value.help,
      form.value.introduction,
      content.value
    )
    props.closeDialog()
    props.getList()
  } catch (error) {
    console.error('保存数据时发生错误:', error)
    ElMessage.error('保存失败，请稍后再试。')
  } finally {
    saveLoading.value = false // 结束加载状态
  }
}
</script>

<template>
  <ElForm :model="form" :rules="rules" label-width="100px">
    <ElRow :gutter="20">
      <!-- Name -->
      <ElCol :span="12">
        <ElFormItem :label="t('plugin.name')" prop="name">
          <ElInput v-model="form.name" :disabled="isSystem" />
        </ElFormItem>
      </ElCol>

      <!-- Module -->
      <ElCol :span="12">
        <ElFormItem :label="t('plugin.module')" prop="module">
          <ElSelect v-model="form.module" :disabled="isSystem">
            <el-option
              v-for="option in moduleOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </ElSelect>
        </ElFormItem>
      </ElCol>

      <!-- Parameter -->
      <ElCol :span="12">
        <ElFormItem :label="t('plugin.parameter')" prop="parameter">
          <ElInput v-model="form.parameter" />
        </ElFormItem>
      </ElCol>

      <!-- Help -->
      <ElCol :span="12">
        <ElFormItem :label="t('plugin.help')" prop="help">
          <ElInput v-model="form.help" />
        </ElFormItem>
      </ElCol>
      <!-- Version -->
      <ElCol :span="12">
        <ElFormItem :label="t('plugin.version')" prop="version">
          <ElInput v-model="form.version" :disabled="isSystem" />
        </ElFormItem>
      </ElCol>
      <!-- Introduction -->
      <ElCol :span="24">
        <ElFormItem :label="t('plugin.introduction')" prop="introduction">
          <ElInput v-model="form.introduction" />
        </ElFormItem>
      </ElCol>

      <!-- Source Code (Codemirror) -->
      <ElCol :span="24">
        <ElFormItem label="源码" prop="source">
          <codemirror
            v-model="content"
            :style="{ height: '400px', width: '90%' }"
            :autofocus="true"
            :indent-with-tab="true"
            :tab-size="2"
            :extensions="extensions"
            :disabled="isSystem"
          />
        </ElFormItem>
      </ElCol>
    </ElRow>
    <ElRow>
      <ElCol :span="12" style="text-align: right">
        <ElButton type="primary" @click="save" :loading="saveLoading"> 保存 </ElButton>
      </ElCol>
    </ElRow>
  </ElForm>
</template>

<style scoped>
.header-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
