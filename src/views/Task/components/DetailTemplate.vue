<script setup lang="ts">
import { ref, reactive, onMounted, watch, nextTick } from 'vue'
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
  ElRow,
  ElCol,
  ElSelectV2,
  ElTreeV2,
  ElTree
} from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { useI18n } from '@/hooks/web/useI18n'
import { getPluginDataByModuleApi } from '@/api/plugins'
import { getPocDataAllApi } from '@/api/poc'
import { getTemplateDetailApi, saveTemplateDetailApi } from '@/api/task'
import { pocData } from '@/api/poc/types'

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
  'VulnerabilityScan',
  'PassiveScan'
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

const vulList = ref<string[]>([])
// 根据 ID 加载模板数据
const loadTemplate = async (id: string) => {
  const template = await getTemplateDetailApi(id) // 调用实际接口获取已有数据
  console.log(template)
  templateName.value = template.data.name
  vulList.value = template.data.vullist
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
const onSubmit = async () => {
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
    for (const plugin of plugins[module]) {
      if (parameters[module][plugin.hash]) {
        result.Parameters[module][plugin.hash] = parameters[module][plugin.hash]
      }
    }
  }
  result['name'] = templateName.value
  result['vullist'] = vulList.value
  await saveTemplateDetailApi(result, props.id)
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
  URLSecurity: '#FFE4BA', // 浅米色
  PassiveScan: '#A2DFF7'
}
const templateName = ref('')
interface TreeNode {
  value: string
  label: string
  children: TreeNode[]
}

const vulOptions = reactive<TreeNode[]>([])

const buildTree = (data: pocData[]): TreeNode[] => {
  const tree: TreeNode[] = []

  data.forEach((item) => {
    let currentLevel = tree
    item.tags.forEach((tag) => {
      // 查找当前层级是否有该标签
      const existingNode = currentLevel.find((node) => node.label === tag)
      if (!existingNode) {
        // 如果没有找到，则生成一个分类节点
        const randomString = Math.random().toString(36).substring(2, 8)
        const newNode: TreeNode = { value: randomString, label: tag, children: [] }
        currentLevel.push(newNode)
        currentLevel = newNode.children // 进入下一层
      } else {
        currentLevel = existingNode.children // 如果找到了，继续向下
      }
    })

    // 添加实际数据节点
    currentLevel.push({ value: item.id, label: item.name, children: [] })
  })

  return tree
}

const vulSelectOptions = reactive<{ value: string; label: string }[]>([])
// 获取数据并生成树形结构
const getPocList = async () => {
  const res = await getPocDataAllApi() // 调用后端API
  if (res.data.list.length > 0) {
    vulSelectOptions.push({ value: 'All Poc', label: 'All Poc' })
    res.data.list.forEach((item) => {
      vulSelectOptions.push({ value: item.id, label: item.name })
    })
  }

  vulOptions.push({ value: 'All Poc', label: 'All Poc', children: [] })
  const tree = buildTree(res.data.list)
  vulOptions.push(...tree)
}

getPocList()
const dialogVisible = ref(false)
const openPocList = async () => {
  dialogVisible.value = true
}
watch(dialogVisible, (newVal) => {
  if (newVal) {
    nextTick(() => {
      const tree = treeRef.value
      if (tree) {
        console.log('treeRef 已经获取到实例:', tree)
        setTreeCheckedNodes(vulList.value) // 初始化选中的节点
      } else {
        console.log('treeRef 未能正确获取到实例')
      }
    })
  }
})
const treeRef = ref<InstanceType<typeof ElTreeV2> | null>(null)
const setTreeCheckedNodes = (checkedKeys) => {
  nextTick(() => {
    const tree = treeRef.value
    if (tree) {
      tree.setCheckedKeys(checkedKeys) // 使用 setCheckedKeys 方法来批量选中指定的节点
    } else {
      console.log('treeRef 未能正确获取到实例')
    }
  })
}
const propss = {
  value: 'value',
  label: 'label',
  children: 'children'
}

const handleCheckChange = (data, checked) => {
  const nodeValue = data.value // 当前节点的 value

  // 判断当前节点是否是叶子节点
  const isLeafNode = !data.children || data.children.length === 0

  // 如果是叶子节点，直接处理它
  if (isLeafNode) {
    if (checked && !vulList.value.includes(nodeValue)) {
      vulList.value.push(nodeValue) // 选中叶子节点，添加到 vulList
    } else if (!checked) {
      const index = vulList.value.indexOf(nodeValue)
      if (index > -1) {
        vulList.value.splice(index, 1) // 取消选中叶子节点，移除它
      }
    }
  } else {
    // 如果是父节点，遍历它的所有子节点并处理
    const addLeafNodes = (node) => {
      if (node.children && node.children.length > 0) {
        node.children.forEach((child) => {
          const isChildLeafNode = !child.children || child.children.length === 0 // 判断子节点是否为叶子节点
          if (isChildLeafNode) {
            // 只处理叶子节点
            if (checked && !vulList.value.includes(child.value)) {
              vulList.value.push(child.value) // 添加叶子节点到 vulList
            } else if (!checked) {
              const index = vulList.value.indexOf(child.value)
              if (index > -1) {
                vulList.value.splice(index, 1) // 移除取消选中的叶子节点
              }
            }
          } else {
            // 如果是父节点，则递归处理其子节点
            addLeafNodes(child)
          }
        })
      }
    }

    // 如果是父节点，递归地添加或移除其叶子节点
    addLeafNodes(data)
  }

  // 打印当前选中的叶子节点的值
  console.log('当前选中的叶子节点的值:', vulList.value)
}
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
              :options="vulSelectOptions"
              placeholder="Please select vul"
              style="width: 80%; margin-right: 10px"
              multiple
              collapse-tags
              collapse-tags-tooltip
              tag-type="info"
              :max-collapse-tags="3"
            />
            <ElButton type="primary" @click="openPocList" :loading="saveLoading">
              {{ t('common.selectCategory') }}
            </ElButton>
          </ElFormItem>
          <ElFormItem v-if="plugin.enabled" :label="t('plugin.parameter')">
            <ElTooltip placement="top" effect="light" :content="plugin.help" :trigger-keys="[]">
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
  <Dialog
    v-model="dialogVisible"
    title="POC"
    center
    fullscreen
    style="border-radius: 15px; box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3)"
  >
    <ElTreeV2
      ref="treeRef"
      style="max-width: 100%"
      :data="vulOptions"
      :props="propss"
      show-checkbox
      :height="600"
      @check-change="handleCheckChange"
    />
  </Dialog>
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
