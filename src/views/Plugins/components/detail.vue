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

// 校验规则
const rules = ref({
  name: [{ required: true, message: '', trigger: 'blur' }],
  module: [{ required: true, message: '', trigger: 'change' }],
  source: [{ required: true, message: '', trigger: 'blur' }]
})

// 模块选项
const moduleOptions = ref([
  { label: '模块一', value: 'module1' },
  { label: '模块二', value: 'module2' }
])

// Codemirror 配置
const content = ref('')
const extensions = [javascript(), oneDark]

// 检查是新建还是编辑
onBeforeMount(async () => {
  if (props.id) {
    // 如果有 id，则查询该 id 的内容
    await fetchData(props.id)
  }
})

// 根据 id 查询配置数据
const fetchData = async (id: string) => {
  //   try {
  //     const res = await getConfigurationById(id)
  //     if (res.code === 200) {
  //       const data = res.data
  //       form.value.name = data.name
  //       form.value.version = data.version
  //       form.value.module = data.module
  //       form.value.parameter = data.parameter
  //       form.value.help = data.help
  //       form.value.introduction = data.introduction
  //       content.value = data.source
  //     } else {
  //       ElMessage.error(`数据加载失败：${res.message}`)
  //     }
  //   } catch (error) {
  //     console.error('查询数据时发生错误:', error)
  //   }
}

const save = async () => {
  // 手动触发表单验证
}

const saveLoading = ref(false)

// 监听 id 的变化，如果 id 变化则重新获取数据
watch(
  () => props.id,
  async (newId) => {
    if (newId) {
      await fetchData(newId)
    }
  }
)
</script>

<template>
  <ElForm :model="form" :rules="rules" ref="formRef" label-width="100px">
    <ElRow :gutter="20">
      <!-- Name -->
      <ElCol :span="12">
        <ElFormItem :label="t('plugin.name')" prop="name">
          <ElInput v-model="form.name" />
        </ElFormItem>
      </ElCol>

      <!-- Module -->
      <ElCol :span="12">
        <ElFormItem :label="t('plugin.module')" prop="module">
          <ElSelect v-model="form.module">
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
          <ElInput v-model="form.version" />
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
          />
        </ElFormItem>
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
