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
  ElSelectV2,
  InputInstance,
  ElTag
} from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { Codemirror } from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { nextTick, reactive, ref } from 'vue'
import { toRefs } from '@vueuse/core'
import { updatePocDataApi, addPocDataApi } from '@/api/poc'
const { t } = useI18n()
const extensions = [javascript(), oneDark]
const props = defineProps<{
  closeDialog: () => void
  getList: () => void
  pocForm: {
    id: string
    name: string
    content: string
    level: string
    tags: string[]
  }
}>()
const { pocForm } = toRefs(props)
const localForm = ref({ ...pocForm.value })

interface RuleForm {
  name: string
  level: string
}
const rules = reactive<FormRules<RuleForm>>({
  name: [{ required: true, message: t('poc.nameMsg'), trigger: 'blur' }],
  level: [{ required: true, message: t('poc.contentMsg'), trigger: 'blur' }]
})
const levelOptions = [
  {
    value: 'critical',
    label: 'critical'
  },
  {
    value: 'high',
    label: 'high'
  },
  {
    value: 'medium',
    label: 'medium'
  },
  {
    value: 'low',
    label: 'low'
  },
  {
    value: 'info',
    label: 'info'
  },
  {
    value: 'unknown',
    label: 'unknown'
  }
]
const saveLoading = ref(false)
const ruleFormRef = ref<FormInstance>()

const dynamicTags = ref<string[]>([...pocForm.value.tags])
const submitForm = async (formEl: FormInstance | undefined) => {
  saveLoading.value = true
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      let res
      if (localForm.value.id != '') {
        res = await updatePocDataApi(
          localForm.value.id,
          localForm.value.name,
          localForm.value.content,
          localForm.value.level,
          dynamicTags.value
        )
      } else {
        res = await addPocDataApi(
          localForm.value.name,
          localForm.value.content,
          localForm.value.level,
          dynamicTags.value
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
const inputValue = ref('')
const inputVisible = ref(false)
const InputRef = ref<InputInstance>()

const handleClose = (tag: string) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}

const handleInputConfirm = () => {
  if (inputValue.value) {
    dynamicTags.value.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}
</script>
<template>
  <ElForm :model="localForm" label-width="120px" :rules="rules" status-icon ref="ruleFormRef">
    <ElFormItem :label="t('poc.pocName')" prop="name">
      <ElInput v-model="localForm.name" :placeholder="t('poc.nameMsg')" />
    </ElFormItem>
    <ElFormItem :label="t('poc.content')" prop="content">
      <codemirror
        v-model="localForm.content"
        :style="{ height: '600px', width: '100%' }"
        :autofocus="true"
        :indent-with-tab="true"
        :tab-size="2"
        :extensions="extensions"
      />
    </ElFormItem>
    <ElFormItem :label="t('poc.level')">
      <ElSelectV2
        v-model="localForm.level"
        placeholder="Please select level"
        :options="levelOptions"
      />
    </ElFormItem>
    <ElFormItem label="TAG">
      <div class="flex gap-2">
        <ElTag
          v-for="tag in dynamicTags"
          :key="tag"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
        >
          {{ tag }}
        </ElTag>
        <ElInput
          v-if="inputVisible"
          ref="InputRef"
          v-model="inputValue"
          class="w-20"
          size="small"
          @keyup.enter="handleInputConfirm"
          @blur="handleInputConfirm"
        />
        <el-button v-else class="button-new-tag" size="small" @click="showInput">
          + New Tag
        </el-button>
      </div>
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
