<!-- <script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage, ElDivider, ElInput, ElSwitch, ElButton, ElForm, ElFormItem } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()

// 接收父组件传递的 props
const props = defineProps<{
  closeDialog: () => void
  getList: () => void
  id: string
}>()

// 模块数组
const modules = ['a', 'b', 'c']

// 存储每个模块的插件和参数数据
const plugins = reactive<Record<string, { name: string; hash: string; enabled: boolean }[]>>({})
const parameters = reactive<Record<string, Record<string, string>>>({})

// 初始化插件数据
const initPlugins = async () => {
  for (const module of modules) {
    const modulePlugins = await GetPlugin(module) // 调用实际接口获取插件数据
    plugins[module] = modulePlugins.map((plugin) => ({
      ...plugin,
      enabled: false // 初始化时开关为关闭状态
    }))
    parameters[module] = {} // 初始化空的参数对象
  }
}

// 根据 ID 加载模板数据
const loadTemplate = async (id: string) => {
  const template = await GetTemplate(id) // 调用实际接口获取已有数据

  for (const module of modules) {
    const modulePlugins = await GetPlugin(module) // 获取模块对应的插件
    plugins[module] = modulePlugins.map((plugin) => ({
      ...plugin,
      enabled: template[module]?.includes(plugin.hash) || false // 判断插件是否启用
    }))
    parameters[module] = template.Parameters[module] || {} // 填充参数数据
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

// 开关变化时处理逻辑
const onSwitchChange = (module: string, plugin: { hash: string; enabled: boolean }) => {
  if (!plugin.enabled) {
    parameters[module][plugin.hash] = '' // 如果关闭开关，则清空参数
  }
}

// 提交表单数据
const onSubmit = () => {
  const result: Record<string, any> = {}

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
      }
    }
  }

  // 打印数据或通过接口提交
  console.log(result)
  ElMessage.success('提交成功')

  // 提交后执行父组件的关闭和列表刷新逻辑
  props.closeDialog()
  props.getList()
}
</script> -->

<!-- <template>
  <ElForm @submit.prevent="onSubmit" label-width="100px">
    <div v-for="module in modules" :key="module">
      <ElDivider>{{ module }}</ElDivider>

      <div v-for="plugin in plugins[module]" :key="plugin.hash">
        <ElFormItem :label="plugin.name">
          <ElSwitch v-model="plugin.enabled" @change="onSwitchChange(module, plugin)" />
        </ElFormItem>

        <ElFormItem v-if="plugin.enabled" label="参数">
          <ElInput v-model="parameters[module][plugin.hash]" placeholder="请输入参数" />
        </ElFormItem>
      </div>
    </div>

    <ElFormItem>
      <ElButton type="primary" @click="onSubmit">提交</ElButton>
    </ElFormItem>
  </ElForm>
</template> -->

<style scoped>
/* 样式部分 */
.ElFormItem {
  margin-bottom: 20px;
}
</style>
