<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import {
  ElMessage,
  ElTooltip,
  ElTag,
  ElCard,
  ElInput,
  ElSwitch,
  ElButton,
  ElForm,
  ElFormItem,
  ElSelectV2,
  ElRow,
  ElCol
} from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { getPluginDataByModuleApi } from '@/api/plugins'
import { getPocDataAllApi } from '@/api/poc'
import { getTemplateDetailApi } from '@/api/task'
import { el } from 'element-plus/es/locale'

const { t } = useI18n()

// 接收父组件传递的 props
const props = defineProps<{
  closeDialog: () => void
  getList: () => void
  id: string
}>()

// 模块数组
const modules = [
  'TargetHandler',
  'SubdomainScan',
  'SubdomainSecurity',
  'PortScanPreparation',
  'PortScan',
  'PortFingerprint',
  'AssetMapping',
  'AssetHandle',
  'URLScan',
  'WebCrawler',
  'URLSecurity',
  'DirScan',
  'VulnerabilityScan'
]

// 存储每个模块的插件和参数数据
const plugins = reactive<
  Record<
    string,
    {
      name: string
      hash: string
      parameter: string
      help: string
      introduction: string
      enabled: boolean
    }[]
  >
>({})
const parameters = reactive<Record<string, Record<string, string>>>({})
const selectPlugin = reactive<Record<string, string[]>>({})
// 初始化插件数据
const initPlugins = async () => {
  for (const module of modules) {
    const modulePlugins = await getPluginDataByModuleApi(module) // 调用实际接口获取插件数据
    parameters[module] = {} // 初始化空的参数对象
    selectPlugin[module] = []

    plugins[module] = modulePlugins.data.list.map((plugin) => {
      parameters[module][plugin.hash] = plugin.parameter || ''

      return {
        ...plugin,
        enabled: false // 初始化时开关为关闭状态
      }
    })
  }
}

// 根据 ID 加载模板数据
const loadTemplate = async (id: string) => {
  const template = await getTemplateDetailApi(id) // 调用实际接口获取已有数据
  templateName.value = template.data.name
  for (const module of modules) {
    parameters[module] = {}

    const moduleData = template.data?.[module] || []
    const modulePlugins = await getPluginDataByModuleApi(module) // 获取模块对应的插件

    plugins[module] = modulePlugins.data.list.map((plugin) => ({
      ...plugin,
      enabled: moduleData.includes(plugin.hash) || false // 判断插件是否启用
    }))
    parameters[module] = template.data.Parameters[module] || {}
  }
}

// 监听 id 的变化来判断是创建还是编辑模式
watch(
  () => props.id,
  async (newId) => {
    if (newId) {
      await loadTemplate(newId) // 如果传入了 ID，则进入编辑模式，加载已有数据
    } else {
      await initPlugins() // 否则初始化空白表单，表示创建新项
    }
  },
  { immediate: true } // 确保组件挂载时立即触发
)
const saveLoading = ref(false)
// 提交表单数据
const onSubmit = () => {
  saveLoading.value = true
  const result: Record<string, any> = {}
  if (templateName.value == '') {
    ElMessage.error('name 不能为空')
    saveLoading.value = false
    return
  }
  // 收集每个模块启用的插件和对应的参数
  for (const module of modules) {
    const enabledPlugins = plugins[module].filter((plugin) => plugin.enabled)
    result[module] = enabledPlugins.map((plugin) => plugin.hash)
    result.Parameters = result.Parameters || {}
    result.Parameters[module] = {}

    // 收集参数
    for (const plugin of enabledPlugins) {
      if (parameters[module][plugin.hash]) {
        result.Parameters[module][plugin.hash] = parameters[module][plugin.hash]
        if (plugin.hash == 'ed93b8af6b72fe54a60efdb932cf6fbc') {
          const exists = vulList.value.includes('All Poc')
          let resultString = ''
          if (exists) {
            resultString = '*'
          } else {
            vulList.value.forEach((vul) => {
              resultString += vul + '.yaml,'
            })
            resultString = resultString.slice(0, -1)
          }
          result.Parameters[module][plugin.hash] =
            result.Parameters[module][plugin.hash] + '-t ' + resultString
        }
      }
    }
  }
  console.log(vulList)
  // 打印数据或通过接口提交
  console.log(result)
  ElMessage.success('提交成功')
  saveLoading.value = false
  // 提交后执行父组件的关闭和列表刷新逻辑
  props.closeDialog()
  props.getList()
}
const moduleColorMap = {
  TargetHandler: '#2243dda6', // 浅红色
  SubdomainScan: '#FF9B85', // 更深的浅橙色
  SubdomainSecurity: '#FFFFBA', // 浅黄色
  PortScanPreparation: '#BAFFB3', // 浅绿色
  PortScan: '#BAE1FF', // 浅蓝色
  AssetMapping: '#e3ffba', // 浅粉红色
  URLScan: '#D1BAFF', // 浅紫色
  WebCrawler: '#FFABAB', // 浅红
  DirScan: '#3ccde6', // 选择浅桃色
  VulnerabilityScan: '#FF677D', // 浅粉色
  AssetHandle: '#B2E1FF', // 浅青色
  PortFingerprint: '#ffb5e4', // 更亮的浅橙色
  URLSecurity: '#FFE4BA' // 浅米色
}
const templateName = ref('')
const vulOptions = reactive<{ value: string; label: string }[]>([])
const getPocList = async () => {
  const res = await getPocDataAllApi()
  if (res.data.list.length > 0) {
    vulOptions.push({ value: 'All Poc', label: 'All Poc' })
    res.data.list.forEach((item) => {
      vulOptions.push({ value: item.id, label: item.name })
    })
  }
}
getPocList()
const vulList = ref<string[]>([])
</script>

<template>
  <ElForm @submit.prevent="onSubmit" label-width="auto">
    <ElFormItem :label="t('task.templateName')">
      <ElInput v-model="templateName" />
    </ElFormItem>
    <div v-for="module in modules" :key="module">
      <ElCard class="module-card" :body-style="{ padding: '20px' }" shadow="always">
        <div style="display: flex; justify-content: space-between; align-items: center">
          <ElTag :style="{ backgroundColor: moduleColorMap[module], color: '#000' }">
            {{ t(`scanTemplate.${module}`) }}
          </ElTag>
        </div>

        <div v-for="plugin in plugins[module]" :key="plugin.hash">
          <ElFormItem :label="plugin.name">
            <ElTooltip placement="top" effect="light" :content="plugin.introduction">
              <ElSwitch v-model="plugin.enabled" />
            </ElTooltip>
          </ElFormItem>
          <ElFormItem
            :label="t('task.vulList')"
            prop="type"
            v-if="plugin.enabled && plugin.hash === 'ed93b8af6b72fe54a60efdb932cf6fbc'"
          >
            <ElSelectV2
              v-model="vulList"
              filterable
              :options="vulOptions"
              placeholder="Please select vul"
              style="width: 80%"
              multiple
              collapse-tags
              collapse-tags-tooltip
              tag-type="info"
              :max-collapse-tags="3"
            />
          </ElFormItem>
          <ElFormItem v-if="plugin.enabled" :label="t('plugin.parameter')">
            <ElTooltip placement="top" effect="light" :content="plugin.help">
              <ElInput v-model="parameters[module][plugin.hash]" />
            </ElTooltip>
          </ElFormItem>
        </div>
      </ElCard>
    </div>
    <ElRow>
      <ElCol :span="12" style="text-align: right">
        <ElButton type="primary" @click="onSubmit" :loading="saveLoading"> 保存 </ElButton>
      </ElCol>
    </ElRow>
  </ElForm>
</template>

<style scoped>
/* 样式部分 */
.ElFormItem {
  margin-bottom: 20px;
}
.module-card {
  margin-bottom: 20px; /* 卡片之间的间距 */
  border-radius: 8px; /* 圆角 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* 阴影效果 */
}
</style>
