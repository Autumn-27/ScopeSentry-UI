<script setup lang="tsx">
import { useI18n } from '@/hooks/web/useI18n'
import { Ref, computed, reactive, ref } from 'vue'
import { onMounted } from 'vue'
import { useTable } from '@/hooks/web/useTable'
import {
  ElRow,
  ElCol,
  ElCard,
  ElStatistic,
  ElContainer,
  ElFooter,
  ElDescriptions,
  ElDescriptionsItem,
  ElTag,
  ElDivider,
  ElAvatar,
  ElTooltip,
  ElCollapse,
  ElCollapseItem,
  ElBadge,
  ElPagination,
  ElLink,
  ElText
} from 'element-plus'
import { Icon } from '@/components/Icon'
import { BaseButton } from '@/components/Button'
import { useRoute, useRouter } from 'vue-router'
import Csearch from '../search/Csearch.vue'
import { useIcon } from '@/hooks/web/useIcon'
import { size } from 'lodash-es'
import { getProjectAssetCountApi, getProjectInfoApi } from '@/api/ProjectAggregation'
const { push } = useRouter()
const { t } = useI18n()
const { query } = useRoute()
let projectInfo = reactive({
  name: '',
  tag: '',
  scheduledTasks: false,
  hour: 0,
  AssetCount: 0,
  domain: [''],
  nextTime: ''
})

let projectAssetCount = reactive({
  subdomainCount: 0,
  vulCount: 0
})
const projectInfoLoading = ref(false)
const getProjectInfo = async () => {
  try {
    projectInfoLoading.value = true

    const [res1, res2] = await Promise.all([
      getProjectInfoApi(query.id as string),
      getProjectAssetCountApi(query.id as string)
    ])

    projectInfo.name = res1.data.name
    projectInfo.tag = res1.data.tag
    projectInfo.scheduledTasks = res1.data.scheduledTasks
    projectInfo.hour = res1.data.hour
    projectInfo.AssetCount = res1.data.AssetCount
    projectInfo.domain = res1.data.root_domains
    projectInfo.nextTime = res1.data.next_time

    projectAssetCount.subdomainCount = res2.data.subdomainCount
    projectAssetCount.vulCount = res2.data.vulCount
  } catch (error) {
    console.error('Error fetching project info:', error)
  } finally {
    projectInfoLoading.value = false
  }
}
getProjectInfo()
const projectNameIcon = useIcon({ icon: 'icon-park:edit-name' })
const projectTagIcon = useIcon({ icon: 'icon-park:tag' })
const projectScopeIcon = useIcon({ icon: 'zondicons:network', color: '#40c9c6' })
const projectTaskIcon = useIcon({ icon: 'hugeicons:task-done-01', color: '#40c9c6' })
</script>

<template>
  <ElRow>
    <ElCol :xl="8" :lg="8" :md="8" :sm="8" :xs="8">
      <ElCard shadow="hover" class="mb-20px">
        <ElContainer v-loading="projectInfoLoading">
          <ElMain>
            <ElDescriptions :column="2" direction="vertical" :border="true">
              <ElDescriptionsItem labelClassName="projectinfoclass">
                <template #label>
                  <div class="cell-item">
                    <ElIcon style="position: relative; top: 3px">
                      <projectNameIcon />
                    </ElIcon>
                    {{ t('project.projectName') }}
                  </div>
                </template>
                {{ projectInfo.name }}
              </ElDescriptionsItem>
              <ElDescriptionsItem labelClassName="projectinfoclass">
                <template #label>
                  <div class="cell-item">
                    <ElIcon style="position: relative; top: 3px">
                      <projectTagIcon />
                    </ElIcon>
                    TAG
                  </div>
                </template>
                <ElTag> {{ projectInfo.tag }}</ElTag>
              </ElDescriptionsItem>
              <ElDescriptionsItem labelClassName="projectinfoclass">
                <template #label>
                  <div class="cell-item">
                    <ElIcon style="position: relative; top: 3px">
                      <projectScopeIcon />
                    </ElIcon>
                    {{ t('project.projectScope') }}
                  </div>
                </template>
                <ElScrollbar max-height="50px" always>
                  <template v-for="(o, index) in projectInfo.domain" :key="index">
                    <div class="text item">{{ o }}</div>
                  </template>
                </ElScrollbar>
              </ElDescriptionsItem>
              <ElDescriptionsItem labelClassName="projectinfoclass">
                <template #label>
                  <div class="cell-item">
                    <ElIcon style="position: relative; top: 3px">
                      <projectTaskIcon />
                    </ElIcon>
                    {{ t('project.scheduledTasks') }}
                  </div>
                </template>
                <ElTag :type="projectInfo.scheduledTasks ? 'success' : 'info'">
                  {{
                    projectInfo.scheduledTasks
                      ? t('common.switchAction')
                      : t('common.switchInactive')
                  }}
                </ElTag>
              </ElDescriptionsItem>
              <ElDescriptionsItem
                v-if="projectInfo.scheduledTasks"
                :label="t('project.cycle')"
                labelClassName="projectinfoclass"
              >
                {{ projectInfo.hour }}
              </ElDescriptionsItem>
              <ElDescriptionsItem
                v-if="projectInfo.scheduledTasks"
                :label="t('task.nextTime')"
                labelClassName="projectinfoclass"
              >
                {{ projectInfo.nextTime }}
              </ElDescriptionsItem>
            </ElDescriptions>
          </ElMain>
          <ElDivider />
          <ElFooter heigh="50%">
            <ElRow>
              <ElCol :span="8">
                <ElStatistic :title="t('dashboard.totalAssets')" :value="projectInfo.AssetCount" />
              </ElCol>
              <ElCol :span="8">
                <ElStatistic
                  :title="t('dashboard.subDomain')"
                  :value="projectAssetCount.subdomainCount"
                />
              </ElCol>
              <ElCol :span="8">
                <ElStatistic
                  :title="t('vulnerability.vulnerabilityName')"
                  :value="projectAssetCount.vulCount"
                />
              </ElCol>
            </ElRow>
          </ElFooter>
        </ElContainer>
      </ElCard>
    </ElCol>
    <ElCol :xl="8" :lg="8" :md="8" :sm="8" :xs="8">
      <ElCard shadow="hover" class="mb-20px">xxxx</ElCard>
    </ElCol>
  </ElRow>
</template>
<style scoped>
:deep(.projectinfoclass) {
  background: transparent !important;
  color: var(--el-text-color-primary) !important;
}
</style>
