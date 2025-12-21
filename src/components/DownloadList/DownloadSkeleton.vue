<template>
  <div class="download-items skeleton-container">
    <div
      v-for="i in count"
      :key="i"
      class="download-item tech-card skeleton-item"
    >
      <!-- 进度背景层（可选） -->
      <div
        v-if="showProgress"
        class="skeleton-progress-bg"
      ></div>

      <div class="item-main">
        <!-- 第一行：文件信息和状态标签 -->
        <div class="item-main-top">
          <!-- 文件信息区域 (item-info) -->
          <div class="item-info">
            <!-- 文件图标 -->
            <div class="file-icon skeleton-icon"></div>

            <!-- 文件信息 (file-info) -->
            <div class="file-info">
              <!-- 文件名 -->
              <div class="file-name skeleton-line skeleton-filename"></div>

              <!-- 文件详情 (file-meta/download-details) -->
              <div class="file-meta skeleton-line skeleton-meta"></div>

              <!-- 操作按钮和来源信息 (file-actions-row) -->
              <div class="file-actions-row">
                <!-- 操作按钮 (file-actions) -->
                <div class="file-actions skeleton-actions">
                  <div class="skeleton-button"></div>
                  <div class="skeleton-button"></div>
                  <div class="skeleton-button"></div>
                  <div class="skeleton-button"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 状态标签 (StatusBadge) -->
          <div class="skeleton-badge"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  count?: number
  showProgress?: boolean
}>(), {
  count: 6,
  showProgress: true
})
</script>

<style lang="scss" scoped>
.skeleton-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  align-items: stretch;
}

.skeleton-item {
  padding: 8px 16px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-dark);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  box-shadow: var(--el-box-shadow-light);
  transition: all 0.3s ease;
  width: 100%;
  box-sizing: border-box;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(59, 130, 246, 0.2),
      transparent
    );
    animation: skeleton-shimmer 2s infinite;
    z-index: 1;
  }
}

.skeleton-progress-bg {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 70%;
  background: var(--el-color-primary-light-9);
  opacity: 0.5;
  z-index: 0;
}

.item-main {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-main-top {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
}

.item-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.skeleton-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: var(--el-fill-color-darker);
  flex-shrink: 0;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
  border: 1px solid var(--el-border-color);
  font-size: 0;
}

.file-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.skeleton-line {
  border-radius: 4px;
  background: var(--el-fill-color-darker);
  animation: skeleton-pulse 1.5s ease-in-out infinite;
  border: 1px solid var(--el-border-color-light);

  &.skeleton-filename {
    height: 16px;
    width: 60%;
    margin-bottom: 4px;
    background: var(--el-fill-color-darker);
  }

  &.skeleton-meta {
    height: 12px;
    width: 50%;
    margin-bottom: 4px;
    min-height: 16.8px;
    background: var(--el-fill-color-dark);
  }
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

.skeleton-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.skeleton-button {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--el-fill-color-darker);
  border: 1px solid var(--el-border-color);
  animation: skeleton-pulse 1.5s ease-in-out infinite;
  flex-shrink: 0;

  &:nth-child(1) {
    animation-delay: 0s;
  }

  &:nth-child(2) {
    animation-delay: 0.2s;
  }

  &:nth-child(3) {
    animation-delay: 0.4s;
  }

  &:nth-child(4) {
    animation-delay: 0.6s;
  }
}

.skeleton-badge {
  width: 60px;
  height: 24px;
  border-radius: 12px;
  background: var(--el-fill-color-darker);
  border: 1px solid var(--el-border-color);
  flex-shrink: 0;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
  animation-delay: 0.3s;
}

@keyframes skeleton-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes skeleton-shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

// 深色主题适配
[data-theme='dark-night'],
[data-theme='deep-space'] {
  .skeleton-item {
    border-color: var(--el-border-color-darker);

    &::before {
      background: linear-gradient(
        90deg,
        transparent,
        rgba(139, 92, 246, 0.3),
        transparent
      );
    }
  }

  .skeleton-progress-bg {
    background: var(--el-color-primary-light-9);
    opacity: 0.4;
  }

  .skeleton-icon,
  .skeleton-line,
  .skeleton-button,
  .skeleton-badge {
    background: var(--el-fill-color-dark);
    border-color: var(--el-border-color-dark);
  }

  .skeleton-line.skeleton-filename {
    background: var(--el-fill-color);
  }
}
</style>
