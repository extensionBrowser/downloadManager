<template>
  <div class="item-info">
    <div class="file-icon">
      {{ fileIcon }}
    </div>
    <div class="file-info">
      <div
        class="file-name"
        :title="downloadItem.name"
      >
        {{ downloadItem.name }}
        <!-- 文件已删除标识 -->
        <ElTooltip
          v-if="isFileDeleted"
          :content="fileDeletedMessage"
          placement="top"
          :popperStyle="{ maxWidth: '300px' }"
        >
          <span class="deleted-indicator">🗑️</span>
        </ElTooltip>
        <!-- 错误指示器（仅在hover时显示详情） -->
        <ElTooltip
          v-if="downloadItem.error"
          :content="errorMessage"
          placement="top"
          :popperStyle="{ maxWidth: '300px' }"
        >
          <span class="error-indicator">⚠️</span>
        </ElTooltip>
      </div>
      <!-- 下载中的详细信息 -->
      <div
        v-if="downloadItem.status === 'downloading'"
        class="download-details"
      >
        <span>{{ formatSpeed(downloadItem.speed) }}</span>
        <span> - {{ formatFileSize(downloadItem.receivedBytes) }}</span>
        <span> / {{ formatFileSize(downloadItem.size) }}</span>
        <span> | {{ remainingTimeText }}</span>
      </div>
      <!-- 非下载中的基本信息 -->
      <div
        v-else
        class="file-meta"
      >
        <span>{{ formatFileSize(downloadItem.size) }}</span>
        <span>· {{ formatTime(downloadItem.startTime) }}</span>
        <span
          v-if="downloadItem.path"
          class="file-path-inline"
          :title="downloadItem.path"
        >
          · 📁 {{ directoryPath }}
        </span>
      </div>
      <!-- 操作按钮和来源信息 -->
      <div class="file-actions-row">
        <div class="file-actions">
          <slot name="actions"></slot>
        </div>
        <!-- 下载来源 -->
        <div
          v-if="downloadSource"
          class="download-source"
        >
          <span class="source-label">{{ $t('downloadFrom') }}</span>
          <a
            v-if="websiteUrl"
            :href="websiteUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="source-link"
            @click.stop
          >
            {{ downloadSource }}
          </a>
          <span
            v-else
            class="source-text"
          >
            {{ downloadSource }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElTooltip } from 'element-plus'
import { useI18n } from 'vue-i18n'
import type { DownloadItem } from '@/types/download'
import { DownloadStatus } from '@/types/download'
import { formatFileSize, formatSpeed, formatTime } from '@/utils/download'

const props = defineProps<{
  downloadItem: DownloadItem
  fileIcon: string
  errorMessage: string
  remainingTimeText: string
  directoryPath: string
}>()

const { t } = useI18n()

// 检查文件是否已删除
const isFileDeleted = computed(() => {
  return props.downloadItem.status === DownloadStatus.DELETED
})

const fileDeletedMessage = computed(() => t('downloadFileDeleted'))

/**
 * 从 URL 提取域名
 */
const extractDomain = (url: string): string | null => {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname
  } catch {
    // 如果 URL 解析失败，尝试简单的字符串提取
    try {
      const match = url.match(/https?:\/\/([^/]+)/)
      if (match && match[1]) {
        return match[1]
      }
    } catch {
      // 解析失败
    }
  }
  return null
}

/**
 * 从 URL 提取网站基础 URL（用于跳转，而不是下载）
 */
const extractBaseUrl = (url: string): string | null => {
  try {
    const urlObj = new URL(url)
    // 返回 origin（协议 + 域名 + 端口），这样点击会跳转到网站首页
    return urlObj.origin
  } catch {
    // 如果 URL 解析失败，尝试简单的字符串提取
    try {
      const match = url.match(/(https?:\/\/[^/]+)/)
      if (match && match[1]) {
        return match[1]
      }
    } catch {
      // 解析失败
    }
  }
  return null
}

// 计算下载来源（显示用）
const downloadSource = computed(() => {
  if (!props.downloadItem.url) {
    return null
  }
  return extractDomain(props.downloadItem.url)
})

// 计算网站基础 URL（跳转用）
const websiteUrl = computed(() => {
  if (!props.downloadItem.url) {
    return null
  }
  return extractBaseUrl(props.downloadItem.url)
})
</script>

<style lang="scss" scoped>
.item-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.file-icon {
  font-size: 32px;
  flex-shrink: 0;
  line-height: 1;
}

.file-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.file-actions-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.file-actions {
  display: flex;
  align-items: center;
}

.download-source {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: $text-secondary;
  flex-shrink: 0;

  .source-label {
    color: $text-secondary;
  }

  .source-link {
    color: var(--el-color-primary, $primary-color);
    text-decoration: none;
    transition: color 0.2s ease;
    cursor: pointer;

    &:hover {
      color: var(--el-color-primary-light-3, $primary-hover);
      text-decoration: underline;
    }

    &:active {
      color: var(--el-color-primary-dark-2, $primary-active);
    }
  }

  .source-text {
    color: var(--el-color-primary, $primary-color);
  }

}

.file-name {
  font-size: 14px;
  font-weight: 500;
  color: $text-primary;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  gap: 4px;

  .error-indicator,
  .deleted-indicator {
    flex-shrink: 0;
    font-size: 14px;
  }

  .deleted-indicator {
    opacity: 0.8;
  }

  // 文件已删除时，文件名添加删除线，但使用更深的颜色保持清晰可读
  .file-deleted & {
    color: var(--el-text-color-regular, #374151); // 使用 regular 颜色，接近正常文本，确保清晰可读
    text-decoration: line-through;
    text-decoration-color: var(--el-text-color-regular, #374151);
    font-style: italic;
    opacity: 1; // 完全不透明，确保最佳可读性
  }
}

.file-meta,
.download-details {
  font-size: 12px;
  color: $text-secondary;
  display: flex;
  gap: 4px;
  margin-bottom: 4px;
  flex-wrap: nowrap; // 防止换行
  align-items: center;
  line-height: 1.4;
  min-height: 16.8px; // 固定最小高度：12px * 1.4 = 16.8px
  height: 16.8px; // 固定高度，防止变化
  overflow: hidden; // 防止内容溢出

  span {
    white-space: nowrap;
    flex-shrink: 0; // 防止文本收缩
  }
}

.file-path-inline {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

