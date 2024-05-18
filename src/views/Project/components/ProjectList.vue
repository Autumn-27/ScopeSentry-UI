<script setup lang="ts">
import { Table } from '@/components/Table'
import { ref, unref } from 'vue'
import { ElAvatar, ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { ContextMenu } from '@/components/ContextMenu'
import { RouteLocationNormalizedLoaded, useRouter } from 'vue-router'
import { useTemplateRefsList } from '@vueuse/core'
import { Dialog } from '@/components/Dialog'
import { defineProps } from 'vue'
import { ElMessageBox } from 'element-plus'
import { deleteProjectApi } from '@/api/project'
import AddProject from './AddProject.vue'
import { useIcon } from '@/hooks/web/useIcon'
const { t } = useI18n()
const { push } = useRouter()
interface Recordable {
  id: string
  name: string
  logo: string
  AssetCount: number
  tag: string
}
const props = defineProps({
  tableDataList: {
    type: Array as () => Recordable[],
    default: () => []
  },
  getProjectTag: {
    type: Function as unknown as () => () => Promise<void>,
    required: true
  }
})
const loading = ref(false)
let ProjectId = ''
const dialogVisible = ref(false)
const closeDialog = () => {
  dialogVisible.value = false
}
const edit = async (id: string) => {
  ProjectId = id
  dialogVisible.value = true
}
const del = (id: string) => {
  ElMessageBox.alert('Are you sure you want to delete the selected data?', '', {
    confirmButtonText: 'YES',
    callback: async () => {
      await deleteProjectApi(id)
      props.getProjectTag()
    }
  })
}
const editIcon = useIcon({ icon: 'uil:edit' })
const delIcon = useIcon({ icon: 'material-symbols:delete-outline' })
const handleCommand = (command: string | number | object) => {
  if (command['type'] == 'edit') {
    edit(command['id'])
  } else {
    del(command['id'])
  }
}
</script>

<template>
  <Table
    :columns="[]"
    :data="tableDataList"
    :loading="loading"
    custom-content
    :card-wrap-style="{
      width: '220px',
      marginBottom: '20px',
      marginRight: '20px'
    }"
  >
    <template #content="row">
      <ElDropdown trigger="click" @command="handleCommand">
        <div class="flex cursor-pointer">
          <div class="pr-16px">
            <template v-if="row.logo != ''">
              <ElAvatar
                :src="row.logo"
                style="width: 45px; height: 45px; line-height: 45px; font-size: 24px"
                fit="cover"
              />
            </template>
            <template v-else>
              <ElAvatar
                style="
                  width: 45px;
                  height: 45px;
                  line-height: 45px;
                  font-size: 24px;
                  background-color: cornflowerblue;
                "
              >
                {{ row.name.charAt(0) }}
              </ElAvatar>
            </template>
          </div>
          <div>
            <div class="mb-12px font-700 font-size-16px">{{ row.name }}</div>
            <div
              class="line-clamp-3 font-size-11px"
              style="color: #b1b3b8; position: relative; top: -6px"
              >{{ t('project.totalAssets') }} : {{ row.AssetCount }}</div
            >
          </div>
        </div>
        <template #dropdown>
          <ElDropdownMenu>
            <ElDropdownItem :icon="editIcon" :command="{ type: 'edit', id: row.id }">{{
              t('common.edit')
            }}</ElDropdownItem>
            <ElDropdownItem :icon="delIcon" :command="{ type: 'del', id: row.id }">{{
              t('common.delete')
            }}</ElDropdownItem>
          </ElDropdownMenu>
        </template>
      </ElDropdown>
    </template>
  </Table>
  <Dialog
    v-model="dialogVisible"
    :title="t('common.edit')"
    center
    style="border-radius: 15px; box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3)"
  >
    <AddProject
      :closeDialog="closeDialog"
      :projectid="ProjectId"
      :getProjectData="$props.getProjectTag"
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
