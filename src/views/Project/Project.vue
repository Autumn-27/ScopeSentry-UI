<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { ElButton, ElTabPane, ElTabs } from 'element-plus'
import ProjectList from './components/ProjectList.vue'
import AddProject from './components/AddProject.vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ref } from 'vue'
import { Dialog } from '@/components/Dialog'
import { getProjectDataApi } from '@/api/project'
const { t } = useI18n()
let allProjectData = ref<any[]>([])
let tabNames = ref<string[]>([])
const groupedProjects = ref<Record<string, any[]>>({})
const getProjectTag = async () => {
  try {
    console.log('aaaa')
    const res = await getProjectDataApi()
    const projects = res.data
    allProjectData.value = res?.data || []
    groupedProjects.value = projects.reduce((acc, project) => {
      const tagName = project.TagName

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
getProjectTag()
const dialogVisible = ref(false)
const addProject = async () => {
  dialogVisible.value = true
}
const closeDialog = () => {
  dialogVisible.value = false
}
</script>

<template>
  <ContentWrap>
    <ElButton type="primary" @click="addProject">{{ t('project.addProject') }}</ElButton>
    <ElTabs class="demo-tabs" style="position: relative; top: 10px">
      <ElTabPane label="All"><ProjectList :tableDataList="allProjectData" /></ElTabPane>
      <ElTabPane v-for="tagName in tabNames" :label="tagName" :key="tagName"
        ><ProjectList :tableDataList="groupedProjects[tagName]"
      /></ElTabPane>
    </ElTabs>
  </ContentWrap>
  <Dialog
    v-model="dialogVisible"
    :title="t('project.addProject')"
    center
    style="border-radius: 15px; box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3)"
  >
    <AddProject :closeDialog="closeDialog" />
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
