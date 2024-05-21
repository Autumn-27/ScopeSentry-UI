<script setup lang="ts">
import { Table } from '@/components/Table'
import { ref } from 'vue'
import { ElAvatar, ElDropdown, ElDropdownMenu, ElDropdownItem, ElPagination } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { useRouter } from 'vue-router'
import { Dialog } from '@/components/Dialog'
import { defineProps } from 'vue'
import { ElMessageBox } from 'element-plus'
import { deleteProjectApi } from '@/api/project'
import AddProject from './AddProject.vue'
import { useIcon } from '@/hooks/web/useIcon'
const { t } = useI18n()
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
    type: Function as unknown as () => (pageIndex: number, pageSize: number) => Promise<void>,
    required: true
  },
  total: {
    type: Number,
    default: 0
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
      props.getProjectTag(currentPage.value, pageSize.value)
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
const handlePageChange = () => {
  props.getProjectTag(currentPage.value, pageSize.value)
}
const currentPage = ref(1)
const pageSize = ref(50)
const small = ref(false)
const background = ref(false)
const disabled = ref(false)
</script>

<template>
  <Table
    :columns="[]"
    :data="tableDataList"
    :loading="loading"
    custom-content
    :card-wrap-style="{
      width: '210px',
      marginBottom: '20px',
      marginRight: '20px'
    }"
  >
    <template #content="row">
      <ElDropdown trigger="click" @command="handleCommand">
        <div class="flex cursor-pointer">
          <div class="pr-16px">
            <template v-if="row.logo != ''">
              <ElAvatar :src="row.logo" class="avatar" fit="cover" />
            </template>
            <template v-else>
              <ElAvatar class="avatar avatar-placeholder">
                {{ row.name.charAt(0) }}
              </ElAvatar>
            </template>
          </div>
          <div>
            <div class="name">{{ row.name }}</div>
            <div class="assets-info">{{ t('project.totalAssets') }} : {{ row.AssetCount }}</div>
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
  <ElPagination
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :page-sizes="[50, 70, 100, 200, 400]"
    :small="small"
    :disabled="disabled"
    :background="background"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"
    @size-change="handlePageChange"
    @current-change="handlePageChange"
  />
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
.avatar {
  width: 45px;
  height: 45px;
  line-height: 45px;
  font-size: 24px;
}

.avatar-placeholder {
  background-color: cornflowerblue;
}
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
.name {
  margin-bottom: 12px;
  font-weight: 700;
  font-size: 16px;
}

.assets-info {
  color: #b1b3b8;
  font-size: 11px;
  position: relative;
  top: -6px;
}
</style>
