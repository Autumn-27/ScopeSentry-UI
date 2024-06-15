<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { reactive, ref } from 'vue'
import { FormSchema } from '@/components/Form'
import {
  ElCol,
  ElRow,
  ElButton,
  ElTable,
  ElTableColumn,
  ElText,
  ElDivider,
  ElInput,
  ElForm,
  ElFormItem
} from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { Icon } from '@iconify/vue'
import { useIcon } from '@/hooks/web/useIcon'

const { t } = useI18n()

const props = defineProps<{
  getList: () => void
  handleSearch: (string) => void
  searchKeywordsData: {
    keyword: string
    example: string
    explain: string
  }[]
}>()
const searchHelpData = [
  {
    operator: '=',
    meaning: t('searchHelp.like')
  },
  {
    operator: '!=',
    meaning: t('searchHelp.notIn')
  },
  {
    operator: '==',
    meaning: t('searchHelp.equal')
  },
  {
    operator: '&&',
    meaning: t('searchHelp.and')
  },
  {
    operator: '||',
    meaning: t('searchHelp.or')
  },
  {
    operator: '()',
    meaning: t('searchHelp.brackets')
  }
]

const schema = reactive<FormSchema[]>([
  {
    field: 'search',
    label: t('form.input'),
    component: 'Input',
    formItemProps: {
      size: 'large',
      style: { width: '100%' }
    },
    componentProps: {
      clearable: false,
      slots: {
        suffix: () => (
          <ElButton
            class="icon-button"
            onClick={getHelp}
            text
            style="outline: none;background-color: transparent !important; color: inherit !important; box-shadow: none !important;position: relative;left: 24%"
          >
            <Icon icon="tdesign:chat-bubble-help" />
          </ElButton>
        )
      }
    }
  }
])
const dialogVisible = ref(false)
const getHelp = () => {
  dialogVisible.value = true
}
function tableHeaderColor() {
  return { background: 'var(--el-fill-color-light)' }
}
const searchParams = ref('')
const searchicon = useIcon({ icon: 'iconoir:search' })
const help = useIcon({ icon: 'tdesign:chat-bubble-help' })
</script>

<template>
  <ContentWrap style="height: 80px">
    <!-- <ElRow justify="start">
      <ElCol :span="1">
        <ElText>{{ t('form.input') }}:</ElText>
      </ElCol>
      <ElCol :span="5">
        <ElInput v-model="searchParams" :placeholder="t('common.inputText')" style="height: 38px" />
      </ElCol>
      <ElCol :span="5">
        <ElButton type="primary" :icon="searchicon" @click="props.handleSearch(searchParams)">
          Search
        </ElButton>
      </ElCol>
    </ElRow> -->
    <ElRow class="row-bg">
      <ElCol :span="8">
        <ElForm>
          <ElFormItem
            :label="t('form.input')"
            size="large"
            label-width="auto"
            style="max-width: 600px"
          >
            <ElInput v-model="searchParams" @keyup.enter="$props.handleSearch(searchParams)">
              <template #append>
                <ElButton
                  @click="getHelp"
                  text
                  class="icon-button"
                  :icon="help"
                  style="display: contents"
                />
              </template>
            </ElInput>
          </ElFormItem>
        </ElForm>
      </ElCol>
      <ElCol :span="12">
        <ElButton
          size="large"
          type="primary"
          :icon="searchicon"
          @click="$props.handleSearch(searchParams)"
        >
          {{ t('form.input') }}
        </ElButton>
        <ElButton size="large" type="info" @click="$props.handleSearch">
          {{ t('asset.export') }}
        </ElButton>
      </ElCol>
    </ElRow>
  </ContentWrap>
  <Dialog
    v-model="dialogVisible"
    :title="t('common.querysyntax')"
    center
    style="border-radius: 15px; box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3)"
  >
    <ElRow>
      <ElCol>
        <ElText tag="b" size="small">{{ t('searchHelp.operator') }}</ElText>
        <ElDivider direction="vertical" />
        <ElText size="small" type="danger">{{ t('searchHelp.notice') }}</ElText>
      </ElCol>
      <ElCol style="margin-top: 10px">
        <ElTable :headerCellStyle="tableHeaderColor" :data="searchHelpData">
          <ElTableColumn prop="operator" :label="t('searchHelp.operator')" width="300" />
          <ElTableColumn prop="meaning" :label="t('searchHelp.meaning')" />
        </ElTable>
      </ElCol>
      <ElCol style="margin-top: 15px">
        <ElText tag="b" size="small">{{ t('searchHelp.keywords') }}</ElText>
      </ElCol>
      <ElCol style="margin-top: 10px">
        <ElTable :headerCellStyle="tableHeaderColor" :data="$props.searchKeywordsData">
          <ElTableColumn prop="keyword" :label="t('searchHelp.keywords')" />
          <ElTableColumn prop="example" :label="t('searchHelp.example')" />
          <ElTableColumn prop="explain" :label="t('searchHelp.explain')" />
        </ElTable>
      </ElCol>
    </ElRow>
  </Dialog>
</template>
