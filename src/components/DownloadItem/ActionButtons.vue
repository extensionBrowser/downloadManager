<template>
  <div class="item-actions">
    <!-- 下载中/暂停/失败状态的操作 -->
    <div
      v-if="downloadItem.status !== 'completed'"
      class="actions-row"
    >
      <el-tooltip
        v-if="downloadItem.status === 'downloading'"
        :content="$t('downloadPauseDownload')"
        placement="top"
        :show-after="600"
      >
        <el-button
          size="small"
          circle
          :icon="VideoPause"
          @click="$emit('pause')"
        />
      </el-tooltip>

      <!-- 暂停状态：根据 canResume 决定显示继续下载还是重新下载 -->
      <el-tooltip
        v-if="downloadItem.status === 'paused' && downloadItem.canResume === true"
        :content="$t('downloadResumeDownload')"
        placement="top"
        :show-after="600"
      >
        <el-button
          size="small"
          type="primary"
          circle
          :icon="VideoPlay"
          @click="$emit('resume')"
        />
      </el-tooltip>

      <el-tooltip
        v-if="downloadItem.status === 'paused' && downloadItem.canResume !== true"
        :content="$t('downloadRedownload')"
        placement="top"
        :show-after="600"
      >
        <el-button
          size="small"
          type="primary"
          circle
          :icon="Refresh"
          :loading="isRetrying"
          :disabled="isRetrying"
          @click="$emit('retry')"
        />
      </el-tooltip>

      <!-- 失败状态：重试下载 -->
      <el-tooltip
        v-if="downloadItem.status === 'failed'"
        :content="$t('downloadRetryDownload')"
        placement="top"
        :show-after="600"
      >
        <el-button
          size="small"
          type="primary"
          circle
          :icon="Refresh"
          :loading="isRetrying"
          :disabled="isRetrying"
          @click="$emit('retry')"
        />
      </el-tooltip>

      <!-- 取消状态：重新下载 -->
      <el-tooltip
        v-if="downloadItem.status === 'cancelled'"
        :content="$t('downloadRedownload')"
        placement="top"
        :show-after="600"
      >
        <el-button
          size="small"
          type="primary"
          circle
          :icon="Refresh"
          :loading="isRetrying"
          :disabled="isRetrying"
          @click="$emit('retry')"
        />
      </el-tooltip>

      <!-- 复制下载地址 -->
      <el-tooltip
        v-if="downloadItem.url"
        :content="downloadItem.url"
        placement="top"
        :popper-style="{ maxWidth: '400px', wordBreak: 'break-all' }"
        :show-after="300"
      >
        <el-button
          size="small"
          circle
          :icon="CopyDocument"
          @click="$emit('copyUrl')"
        />
      </el-tooltip>

      <el-tooltip
        :content="$t('commonDelete')"
        placement="top"
        :show-after="600"
      >
        <el-dropdown
          trigger="click"
          @command="$emit('command', $event)"
        >
          <el-button
            size="small"
            circle
            :icon="Delete"
          />
          <template #dropdown>
            <el-dropdown-menu>
              <!-- 取消下载：只在下载中或暂停状态时显示 -->
              <el-dropdown-item
                v-if="downloadItem.status === 'downloading' || downloadItem.status === 'paused'"
                command="cancel"
              >
                {{ $t('downloadCancelDownload') }}
              </el-dropdown-item>
              <el-dropdown-item command="deleteRecord">
                {{ $t('downloadDeleteRecord') }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-tooltip>
    </div>

    <!-- 已完成状态的操作 -->
    <div
      v-if="downloadItem.status === 'completed'"
      class="actions-row"
    >
      <!-- 文件已删除：显示重新下载按钮 -->
      <template v-if="isFileDeleted">
        <el-tooltip
          :content="$t('downloadRedownload')"
          placement="top"
          :show-after="600"
        >
          <el-button
            size="small"
            type="primary"
            circle
            :icon="Refresh"
            :loading="isRetrying"
            :disabled="isRetrying"
            @click="$emit('retry')"
          />
        </el-tooltip>
      </template>

      <!-- 文件存在：显示打开文件夹和打开文件按钮 -->
      <template v-else>
        <el-tooltip
          :content="$t('downloadOpenFolder')"
          placement="top"
          :show-after="600"
        >
          <el-button
            size="small"
            circle
            :icon="FolderOpened"
            @click="$emit('openFolder')"
          />
        </el-tooltip>

        <el-tooltip
          :content="$t('downloadOpenFile')"
          placement="top"
          :show-after="600"
        >
          <el-button
            size="small"
            circle
            :icon="Document"
            @click="$emit('openFile')"
          />
        </el-tooltip>
      </template>

      <!-- 复制下载地址 -->
      <el-tooltip
        v-if="downloadItem.url"
        :content="downloadItem.url"
        placement="top"
        :popper-style="{ maxWidth: '400px', wordBreak: 'break-all' }"
        :show-after="300"
      >
        <el-button
          size="small"
          circle
          :icon="CopyDocument"
          @click="$emit('copyUrl')"
        />
      </el-tooltip>

      <!-- 文件详情：只在文件存在时显示 -->
      <el-tooltip
        v-if="!isFileDeleted"
        :content="$t('downloadFileDetails')"
        placement="top"
        :show-after="600"
      >
        <el-button
          size="small"
          circle
          :icon="View"
          @click="$emit('showDetails')"
        />
      </el-tooltip>

      <el-tooltip
        :content="$t('commonDelete')"
        placement="top"
        :show-after="600"
      >
        <el-dropdown
          trigger="click"
          @command="$emit('command', $event)"
        >
          <el-button
            size="small"
            circle
            :icon="Delete"
          />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="deleteRecord">
                {{ $t('downloadDeleteRecord') }}
              </el-dropdown-item>
              <el-dropdown-item
                v-if="!isFileDeleted"
                command="deleteFileAndRecord"
              >
                {{ $t('downloadDeleteFileAndRecord') }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  VideoPause,
  VideoPlay,
  Refresh,
  FolderOpened,
  Document,
  Delete,
  CopyDocument,
  View
} from '@element-plus/icons-vue'
import type { DownloadItem } from '@/types/download'
import { DownloadStatus } from '@/types/download'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  downloadItem: DownloadItem
  isRetrying?: boolean
}>()

defineEmits<{
  pause: []
  resume: []
  retry: []
  copyUrl: []
  openFolder: []
  openFile: []
  command: [command: string]
  showDetails: []
}>()

const { t: $t } = useI18n()

// 检查文件是否已删除
const isFileDeleted = computed(() => {
  return props.downloadItem.status === DownloadStatus.DELETED
})
</script>

<style lang="scss" scoped>
.item-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.actions-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>

