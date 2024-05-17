<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { ElButton, ElTabPane, ElTabs, ElInput, ElRow, ElCol } from 'element-plus'
import ProjectList from './components/ProjectList.vue'
import AddProject from './components/AddProject.vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ref } from 'vue'
import { Dialog } from '@/components/Dialog'
import { getProjectDataApi } from '@/api/project'
import { useIcon } from '@/hooks/web/useIcon'
const { t } = useI18n()
let allProjectData = ref<any[]>([])
let tabNames = ref<string[]>([])
const groupedProjects = ref<Record<string, any[]>>({})
const getProjectTag = async () => {
  try {
    const res = await getProjectDataApi(search.value)
    const projects = res.data
    console.log(projects)
    allProjectData.value = res?.data || []
    groupedProjects.value = projects.reduce((acc, project) => {
      const tagName = project.tag

      if (!acc[tagName]) {
        acc[tagName] = []
      }
      acc[tagName].push(project)
      return acc
    }, {})
    tabNames.value = Object.keys(groupedProjects.value)
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
const handleSearch = () => {
  getProjectTag()
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
        <ElButton type="primary" :icon="searchicon" style="height: 100%" @click="handleSearch" />
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
      <ElTabPane label="All"
        ><ProjectList :tableDataList="allProjectData" :getProjectTag="getProjectTag"
      /></ElTabPane>
      <ElTabPane v-for="tagName in tabNames" :label="tagName" :key="tagName"
        ><ProjectList :tableDataList="groupedProjects[tagName]" :getProjectTag="getProjectTag"
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
