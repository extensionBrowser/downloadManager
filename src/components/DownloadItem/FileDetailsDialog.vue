<template>
  <el-dialog
    :model-value="visible"
    :title="$t('downloadFileDetails')"
    width="700px"
    :close-on-click-modal="false"
    append-to-body
    class="file-details-dialog"
    transition="dialog-bounce"
    @update:model-value="$emit('update:visible', $event)"
  >
    <div class="file-details-content">
      <el-descriptions
        :column="1"
        border
        :label-style="{ width: '120px' }"
      >
        <el-descriptions-item :label="$t('downloadId')">
          {{ downloadItem.id }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('downloadFileName')">
          {{ downloadItem.name }}
        </el-descriptions-item>
        <el-descriptions-item
          v-if="downloadItem.url"
          :label="$t('downloadUrl')"
        >
          <el-link
            :href="downloadItem.url"
            target="_blank"
            type="primary"
          >
            {{ downloadItem.url }}
          </el-link>
        </el-descriptions-item>
        <el-descriptions-item
          v-if="downloadItem.path"
          :label="$t('downloadFilePath')"
        >
          {{ downloadItem.path }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('downloadFileSize')">
          {{ formatFileSize(downloadItem.size) }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('downloadStartTime')">
          {{ formatTimeWithSeconds(downloadItem.startTime) }}
        </el-descriptions-item>
        <el-descriptions-item
          v-if="downloadItem.endTime"
          :label="$t('downloadEndTime')"
        >
          {{ formatTimeWithSeconds(downloadItem.endTime) }}
        </el-descriptions-item>
        <el-descriptions-item
          v-if="downloadItem.endTime && downloadItem.startTime"
          :label="$t('downloadDuration')"
        >
          {{ formatDuration(downloadItem.endTime - downloadItem.startTime) }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('downloadFileType')">
          {{ getFileTypeText(downloadItem.fileType) }}
        </el-descriptions-item>
        <el-descriptions-item
          v-if="downloadItem.mimeType"
          :label="$t('downloadMimeType')"
        >
          {{ downloadItem.mimeType }}
        </el-descriptions-item>
        <el-descriptions-item
          v-if="downloadItem.referrer"
          :label="$t('downloadReferrer')"
        >
          <el-link
            :href="downloadItem.referrer"
            target="_blank"
            type="primary"
          >
            {{ downloadItem.referrer }}
          </el-link>
        </el-descriptions-item>
        <el-descriptions-item
          v-if="downloadItem.incognito !== undefined"
          :label="$t('downloadIncognito')"
        >
          {{ downloadItem.incognito ? $t('commonYes') : $t('commonNo') }}
        </el-descriptions-item>
        <el-descriptions-item
          v-if="downloadItem.danger"
          :label="$t('downloadDanger')"
        >
          <el-tag :type="getDangerTagType(downloadItem.danger)">
            {{ getDangerText(downloadItem.danger) }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <template #footer>
      <el-button @click="$emit('update:visible', false)">
        {{ $t('commonClose') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { DownloadItem } from '@/types/download'
import { formatFileSize, formatTimeWithSeconds, formatDuration } from '@/utils/download'

const props = defineProps<{
  visible: boolean
  downloadItem: DownloadItem
}>()

defineEmits<{
  'update:visible': [value: boolean]
}>()

const { t: $t } = useI18n()

// 获取文件扩展名
const getFileExtension = (filename: string): string => {
  const lastDot = filename.lastIndexOf('.')
  if (lastDot === -1 || lastDot === filename.length - 1) {
    return ''
  }
  return filename.substring(lastDot + 1).toLowerCase()
}

// 获取文件类型文本（带扩展名）
const getFileTypeText = (fileType: string): string => {
  const typeMap: Record<string, string> = {
    image: $t('downloadFileTypeImage'),
    video: $t('downloadFileTypeVideo'),
    audio: $t('downloadFileTypeAudio'),
    document: $t('downloadFileTypeDocument'),
    file: $t('downloadFileTypeFile'),
    other: $t('downloadFileTypeOther')
  }
  const typeText = typeMap[fileType] || fileType
  const extension = getFileExtension(props.downloadItem.name)
  
  if (extension) {
    return `${typeText}（${extension}）`
  }
  return typeText
}

// 获取危险级别文本
const getDangerText = (danger: string): string => {
  const dangerMap: Record<string, string> = {
    safe: $t('downloadDangerSafe'),
    unsafe: $t('downloadDangerUnsafe'),
    user_confirmed: $t('downloadDangerUserConfirmed')
  }
  return dangerMap[danger] || danger
}

// 获取危险级别标签类型
const getDangerTagType = (danger: string): string => {
  const typeMap: Record<string, string> = {
    safe: 'success',
    unsafe: 'danger',
    user_confirmed: 'warning'
  }
  return typeMap[danger] || 'info'
}
</script>

<style lang="scss" scoped>
.file-details-content {
  :deep(.el-descriptions__label) {
    font-weight: 500;
  }
}
</style>

<!-- 非 scoped 样式：因为 el-dialog 被 append-to-body，scoped 样式无法生效 -->
<style lang="scss">
.el-dialog.file-details-dialog {
  .el-dialog__header {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  .el-dialog__headerbtn {
    top: 12px !important;
  }

  .el-dialog__body {
    max-height: calc(100vh - 200px);
    overflow-y: auto;
    padding: 20px !important;
  }

  .el-dialog__footer {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
}
</style>

