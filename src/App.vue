<template>
  <ElConfigProvider :locale="elementPlusLocale">
    <div class="app-container">
      <div class="tech-bg"></div>
      <div class="app-content">
        <DownloadList v-if="mounted" />
        <div v-else class="loading">
          加载中...
        </div>
      </div>
    </div>
  </ElConfigProvider>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElConfigProvider } from 'element-plus'
import { useSettingsStore } from '@/store/settings'
import { useDownloadStore } from '@/store/download'
import { convertChromeDownload } from '@/utils/download'
import DownloadList from '@/views/DownloadList.vue'
// @ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// @ts-ignore
import zhTw from 'element-plus/dist/locale/zh-tw.mjs'
// @ts-ignore
import en from 'element-plus/dist/locale/en.mjs'
// @ts-ignore
import ja from 'element-plus/dist/locale/ja.mjs'
import type { Locale } from '@/i18n/types'

const elementPlusLocaleMap: Record<Locale, any> = {
  zh_CN: zhCn,
  zh_TW: zhTw,
  en: en,
  ja: ja
}

const settingsStore = useSettingsStore()
const downloadStore = useDownloadStore()
const mounted = ref(false)
let pollingInterval: number | null = null

// Element Plus 语言包
const elementPlusLocale = computed(() => {
  return elementPlusLocaleMap[settingsStore.locale] || zhCn
})

// 跟踪最近创建的新下载 ID（用于区分重新下载和普通更新）
const recentlyCreatedDownloads = new Set<number>()

// 定期清理过期的 ID（10秒后移除）
setInterval(() => {
  // 清理逻辑：检查下载项是否还存在，如果不存在或超过10秒，从 Set 中移除
  const now = Date.now()
  recentlyCreatedDownloads.forEach(id => {
    const item = downloadStore.downloads.find(d => d.id === id)
    if (!item || (now - item.startTime) > 10000) {
      recentlyCreatedDownloads.delete(id)
    }
  })
}, 5000) // 每5秒清理一次

/**
 * 更新正在下载的项目
 */
const updateDownloadingItems = async() => {
  try {
    // 只查询正在下载的项目
    const results = await new Promise<chrome.downloads.DownloadItem[]>((resolve, reject) => {
      chrome.downloads.search(
        { state: 'in_progress' },
        (results: chrome.downloads.DownloadItem[]) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError)
          } else {
            resolve(results)
          }
        }
      )
    })

    // 更新每个正在下载的项目（只添加有效的下载项）
    results.forEach(item => {
      if (!item.paused) {
        const downloadItem = convertChromeDownload(item)
        if (downloadItem) {
          downloadStore.addDownload(downloadItem)
        }
      }
    })
  } catch (error) {
    console.error('Failed to update downloading items:', error)
  }
}

onMounted(async() => {
  // 设置加载状态
  downloadStore.setLoading(true)
  mounted.value = true

  // 加载设置
  settingsStore.loadSettings()

  // 加载下载记录
  try {
    // 使用 orderBy 确保按时间倒序排列（最新的在前面），与浏览器默认顺序一致
    const results = await new Promise<chrome.downloads.DownloadItem[]>((resolve, reject) => {
      chrome.downloads.search(
        { orderBy: ['-startTime'] }, // 按开始时间倒序排列，最新的在前面
        (results: chrome.downloads.DownloadItem[]) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError)
          } else {
            resolve(results)
          }
        }
      )
    })

    // 浏览器返回的顺序是最新的在前面 [newest, ..., oldest]
    // 为了保持 store 中的顺序也是最新的在前面，我们按顺序添加
    // 使用 unshift 从前往后添加，但 unshift 会添加到数组前面，所以顺序会反过来
    // 正确的方式：按顺序用 unshift 添加，这样 store 中的顺序就是 [oldest, ..., newest]
    // 但这样顺序是反的，所以我们需要反转数组，然后用 push
    // 或者，直接用 push，顺序不变 [newest, ..., oldest]
    // 实际上，浏览器返回的顺序已经是最新的在前面，我们用 push 添加，顺序不变
    results.forEach(item => {
      const downloadItem = convertChromeDownload(item)
      if (downloadItem) {
        // 初始加载时，浏览器返回的顺序是最新的在前面，用 push 添加保持顺序
        downloadStore.addDownload(downloadItem, false)
      }
    })
  } catch (error) {
    console.error('Failed to load downloads:', error)
  } finally {
    // 数据加载完成，关闭 loading 状态
    downloadStore.setLoading(false)
  }

  // 监听下载变化
  try {
    chrome.downloads.onChanged.addListener((downloadDelta: chrome.downloads.DownloadDelta) => {
      if (downloadDelta.id !== undefined) {
        chrome.downloads.search(
          { id: downloadDelta.id },
          (results: chrome.downloads.DownloadItem[]) => {
            if (results.length > 0 && results[0]) {
              const downloadItem = convertChromeDownload(results[0])
              if (downloadItem) {
                // 检查是否是新下载（不存在于列表中）
                const existingIndex = downloadStore.downloads.findIndex(d => d.id === downloadDelta.id)
                const isNewDownload = existingIndex === -1

                // 如果是新下载，需要添加
                // 但需要检查是否已经在 recentlyCreatedDownloads 中，避免重复添加
                if (isNewDownload) {
                  const isRecentlyCreated = recentlyCreatedDownloads.has(downloadDelta.id)
                  if (!isRecentlyCreated) {
                    // 如果不在 recentlyCreatedDownloads 中，说明 onCreated 可能还没处理
                    // 或者 onChanged 先于 onCreated 触发，这里添加并标记
                    // 标记为新下载，不保留旧记录的时间
                    downloadStore.addDownload(downloadItem, true, false, true)
                    recentlyCreatedDownloads.add(downloadDelta.id)
                  }
                  // 如果已经在 recentlyCreatedDownloads 中，说明 onCreated 已经处理了
                  // 这里不需要再次添加，直接返回
                  return
                }

                // 更新现有下载
                const isRecentlyCreated = recentlyCreatedDownloads.has(downloadDelta.id)

                if (isRecentlyCreated && existingIndex !== 0) {
                  // 新创建的下载（重新下载）：如果不在最前面，移到最前面
                  // 标记为新下载，不保留旧记录的时间
                  downloadStore.addDownload(downloadItem, false, true, true)
                } else {
                  // 普通更新：保持原位置，不移动，保留旧记录的时间
                  downloadStore.addDownload(downloadItem, false, false, false)
                }
              } else {
                downloadStore.removeDownload(downloadDelta.id)
                recentlyCreatedDownloads.delete(downloadDelta.id)
              }
            } else {
              downloadStore.removeDownload(downloadDelta.id)
              recentlyCreatedDownloads.delete(downloadDelta.id)
            }
          }
        )
      }
    })

    chrome.downloads.onCreated.addListener((downloadItem: chrome.downloads.DownloadItem) => {
      const item = convertChromeDownload(downloadItem)
      if (item) {
        // 检查是否已经存在（可能 onChanged 先处理了）
        const existingIndex = downloadStore.downloads.findIndex(d => d.id === item.id)
        const isNewDownload = existingIndex === -1

        if (isNewDownload) {
          // 按照浏览器默认逻辑：只添加新下载，不删除旧记录
          // 新下载应该添加到最前面，保持与浏览器顺序一致
          // 标记为新下载，不保留旧记录的时间
          downloadStore.addDownload(item, true, false, true)
        }
        // 标记为新创建的下载（无论是否已存在）
        recentlyCreatedDownloads.add(item.id)
      }
    })
  } catch (error) {
    console.error('Failed to register download listeners:', error)
  }

  pollingInterval = window.setInterval(() => {
    updateDownloadingItems()
  }, 500)
})

onUnmounted(() => {
  if (pollingInterval !== null) {
    clearInterval(pollingInterval)
    pollingInterval = null
  }
})
</script>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  height: 100%;
  min-height: 600px;
  position: relative;
  overflow: hidden;
}

.app-content {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
