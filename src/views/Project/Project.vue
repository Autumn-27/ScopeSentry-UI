<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { ElButton, ElTabPane, ElTabs, ElInput, ElRow, ElCol } from 'element-plus'
import ProjectList from './components/ProjectList.vue'
import AddProject from './components/AddProject.vue'
import { useI18n } from '@/hooks/web/useI18n'
import { reactive, ref } from 'vue'
import { Dialog } from '@/components/Dialog'
import { getProjectDataApi } from '@/api/project'
import { useIcon } from '@/hooks/web/useIcon'
const { t } = useI18n()
let allProjectData = reactive({})
let tabNames = ref<string[]>([])
let tagNum = reactive({})
const getProjectTag = async (pageIndex: number, pageSize: number) => {
  if (pageIndex === 0) {
    pageIndex = currentPage.value
    pageSize = currentpageSize.value
  } else {
    currentPage.value = pageIndex
    currentpageSize.value = pageSize
  }
  try {
    const res = await getProjectDataApi(search.value, pageIndex, pageSize)
    // 更新响应式对象
    Object.assign(allProjectData, res.data.result)
    tabNames.value = Object.keys(res.data.tag)
    Object.assign(tagNum, res.data.tag)
    const index = tabNames.value.indexOf('All')
    if (index !== -1) {
      tabNames.value.splice(index, 1)
    }
  } catch (error) {
    console.error('An error occurred:', error)
  }
}
const dialogVisible = ref(false)
const addProject = async () => {
  dialogVisible.value = true
}
const closeDialog = () => {
  dialogVisible.value = false
}
const search = ref('')
const searchicon = useIcon({ icon: 'iconoir:search' })
const currentPage = ref(1)
const currentpageSize = ref(50)

const loading = ref(false)
const handleSearch = () => {
  loading.value = true
  getProjectTag(currentPage.value, currentpageSize.value)
  loading.value = false
}
handleSearch()
</script>

<template>
  <ContentWrap>
    <ElRow>
      <ElCol :span="0.5">
        <ElText class="mx-1" style="position: relative; top: 8px">{{ t('form.input') }}:</ElText>
      </ElCol>
      <ElCol :span="5">
        <ElInput v-model="search" :placeholder="t('common.inputText')" style="height: 38px" />
      </ElCol>
      <ElCol :span="5" style="position: relative; left: 16px">
        <ElButton
          :loading="loading"
          type="primary"
          :icon="searchicon"
          size="large"
          style="height: 100%"
          @click="handleSearch"
        />
      </ElCol>
    </ElRow>
    <ElRow>
      <ElCol style="position: relative; top: 16px">
        <div class="mb-10px">
          <ElButton type="primary" @click="addProject">{{ t('project.addProject') }}</ElButton>
        </div>
      </ElCol>
    </ElRow>
    <ElTabs class="demo-tabs" style="position: relative; top: 10px">
      <ElTabPane :label="`All (${tagNum['All']})`"
        ><ProjectList
          :tableDataList="allProjectData['All']"
          :getProjectTag="getProjectTag"
          :total="tagNum['All']"
      /></ElTabPane>
      <ElTabPane
        v-for="tagName in tabNames"
        :label="`${tagName} (${tagNum[tagName]})`"
        :key="tagName"
        ><ProjectList
          :tableDataList="allProjectData[tagName]"
          :getProjectTag="getProjectTag"
          :total="tagNum[tagName]"
      /></ElTabPane>
    </ElTabs>
  </ContentWrap>
  <Dialog
    v-model="dialogVisible"
    :title="t('project.addProject')"
    center
    style="border-radius: 15px; box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3)"
  >
    <AddProject
      :closeDialog="closeDialog"
      projectid=""
      :getProjectData="getProjectTag"
      :schedule="false"
    />
  </Dialog>
</template>
<style>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>
