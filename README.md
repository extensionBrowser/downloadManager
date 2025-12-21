# 下载管理器浏览器插件

一款功能强大、界面精美的浏览器下载管理器插件，基于 Vue 3 + TypeScript + ElementPlus 开发，提供完整的下载管理功能，支持多主题切换和多语言适配。

## 📑 目录

- [功能特性](#-功能特性)
- [技术栈](#️-技术栈)
- [项目结构](#-项目结构)
- [快速开始](#-快速开始)
- [浏览器安装](#-浏览器安装)
- [快捷键](#️-快捷键)
- [主题说明](#-主题说明)
- [语言支持](#-语言支持)
- [开发说明](#-开发说明)
- [配置说明](#-配置说明)
- [使用指南](#-使用指南)
- [已知问题](#-已知问题)
- [未来计划](#-未来计划)
- [许可证](#-许可证)
- [贡献](#-贡献)
- [反馈](#-反馈)

## ✨ 功能特性

### 核心功能

- ✅ **完整的下载管理**：统一管理所有下载任务，实时显示下载进度、速度、剩余时间
- ✅ **灵活的下载控制**：支持暂停/继续、取消、重试、删除记录或删除文件及记录
- ✅ **智能文件检测**：自动检测文件是否存在，已删除文件特殊标识，支持重新下载
- ✅ **强大的筛选功能**：
  - 按状态筛选：全部/下载中/已完成/失败/已暂停/已删除
  - 按文件类型筛选：图片/视频/文档/音频/其他
  - 按时间范围筛选：今天/昨天/本周/本月/本年/更早
  - 按文件大小筛选：小文件(<10MB)/中等(10MB-100MB)/大文件(100MB-1GB)/超大(>1GB)
  - 按文件存在状态筛选：仅显示存在的文件/仅显示已删除的文件
- ✅ **灵活的排序功能**：支持按时间、文件名、文件大小排序，升序/降序切换
- ✅ **快速搜索**：实时模糊搜索文件名，快速定位目标下载项
- ✅ **多种展示模式**：
  - 分页模式：支持自定义每页显示数量（10/20/50/100），适合精确查找
  - 滚动加载模式：自动加载更多，适合快速浏览
- ✅ **一键操作**：快速打开文件/文件夹、复制下载链接、批量操作
- ✅ **通知提醒**：下载完成/失败时自动通知，不错过重要下载
- ✅ **下载来源显示**：显示文件下载来源网站，方便追溯

### 界面特性

- 🎨 **现代科技风设计**：深色基调，霓虹蓝/青色调，磨砂玻璃质感，视觉体验出色
- 🎭 **多主题切换**：科技蓝、赛博紫、暗夜黑、极简白、深空蓝、暖橙色六种主题，满足不同审美需求
- 🌍 **多语言支持**：完整支持中文（简体/繁体）、英文、日文，国际化体验，Element Plus 组件自动适配语言
- ✨ **流畅动效**：
  - 基于 Animate.css 的优雅动画效果
  - 进度条流光效果和粒子流动动画
  - 卡片悬浮交互效果
  - 骨架屏加载动画，提升加载体验
- 📱 **响应式布局**：适配不同屏幕尺寸，操作便捷流畅
- 💫 **智能加载状态**：骨架屏匹配实际布局，加载过程更自然

## 🛠️ 技术栈

- **构建工具**：Vite 5.x
- **前端框架**：Vue 3 (Composition API)
- **类型系统**：TypeScript (严格模式)
- **UI 组件库**：ElementPlus
- **样式方案**：SCSS（模块化、变量化）
- **动效库**：Animate.css
- **状态管理**：Pinia
- **国际化**：vue-i18n
- **浏览器 API**：Chrome Extensions API (Manifest V3)

## 📁 项目结构

```
downloadManage/
├── public/                    # 静态资源
│   ├── manifest.json          # 浏览器插件清单文件
│   ├── icons/                 # 插件图标
│   └── _locales/              # 国际化消息文件
│       ├── zh_CN/             # 简体中文
│       ├── zh_TW/             # 繁体中文
│       ├── en/                # 英文
│       └── ja/                # 日文
├── src/
│   ├── background/            # 后台服务脚本
│   │   ├── index.ts           # Service Worker 入口
│   │   ├── listeners/          # 事件监听器
│   │   └── utils/              # 后台工具函数
│   ├── components/            # Vue 组件
│   │   ├── DownloadItem/      # 下载项组件
│   │   └── DownloadList/      # 下载列表组件
│   ├── i18n/                  # 国际化配置
│   │   └── index.ts
│   ├── router/                # 路由配置
│   │   └── index.ts
│   ├── store/                 # Pinia 状态管理
│   │   ├── download.ts        # 下载管理 Store
│   │   └── settings.ts        # 设置管理 Store
│   ├── styles/                # 样式文件
│   │   ├── variables.scss     # SCSS 变量（主题配置）
│   │   └── main.scss          # 全局样式
│   ├── types/                 # TypeScript 类型定义
│   │   └── download.ts
│   ├── utils/                 # 工具函数
│   │   └── downloadConverter.ts
│   ├── views/                 # 页面视图
│   │   ├── DownloadList.vue   # 下载列表页面
│   │   └── Settings.vue       # 设置页面
│   ├── App.vue                # 根组件
│   └── main.ts                # 应用入口
├── index.html                 # HTML 入口文件
├── package.json               # 项目配置
├── tsconfig.json              # TypeScript 配置
├── vite.config.ts             # Vite 配置
└── README.md                  # 项目说明
```

## 🚀 快速开始

### 环境要求

- Node.js >= 16.x
- npm >= 8.x 或 yarn >= 1.22.x

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 开发模式

```bash
npm run dev
# 或
yarn dev
```

开发模式会在 `http://localhost:5173` 启动开发服务器。

**注意**：由于这是浏览器插件项目，开发时需要：

1. 运行 `npm run build` 构建插件
2. 在浏览器中加载 `dist` 目录作为未打包的扩展程序
3. 修改代码后重新构建并刷新插件

### 构建生产版本

```bash
npm run build
# 或
yarn build
```

构建完成后，产物会输出到 `dist` 目录。

### 代码检查与格式化

```bash
# 代码检查并自动修复
npm run lint

# 代码格式化
npm run format
```

## 📦 浏览器安装

### Chrome / Edge

1. 打开浏览器，访问 `chrome://extensions/`（Edge 访问 `edge://extensions/`）
2. 开启右上角的「开发者模式」
3. 点击「加载已解压的扩展程序」
4. 选择项目的 `dist` 目录
5. 插件安装完成

### Firefox

1. 打开浏览器，访问 `about:debugging#/runtime/this-firefox`
2. 点击「临时载入附加组件」
3. 选择项目的 `dist/manifest.json` 文件
4. 插件安装完成

## ⌨️ 快捷键

- `Ctrl+J` (Mac: `Command+J`)：打开下载管理器

## 🎨 主题说明

### 预设主题

1. **科技蓝**（默认）：深色背景 + 霓虹蓝主色调，现代科技感
2. **赛博紫**：深色背景 + 紫色主色调，赛博朋克风格
3. **暗夜黑**：纯黑背景 + 白色主色调，极简暗色模式
4. **极简白**：浅色背景 + 蓝色主色调，清爽明亮
5. **深空蓝**：深色背景 + 深蓝色调，深邃宇宙感
6. **暖橙色**：深色背景 + 暖橙色调，温暖舒适

### 自定义主题

主题通过 SCSS 变量系统实现，修改 `src/styles/variables.scss` 中的 CSS 变量即可自定义主题。主题文件位于 `src/styles/_theme-*.scss`，支持：

- 主色调自定义
- 背景色和文本色配置
- 边框和阴影效果调整
- 主题设置持久化存储

## 🌍 语言支持

- 简体中文 (zh-CN)
- 繁體中文 (zh-TW)
- English (en)
- 日本語 (ja)

语言切换即时生效，设置会持久化存储。

## 📝 开发说明

### 代码规范

- 使用 ESLint + Prettier 进行代码格式化
- Vue 组件遵循单文件组件规范（SFC）
- TypeScript 严格模式，完整类型定义
- 组件命名使用 PascalCase，文件命名使用 kebab-case
- 使用 Composition API 和 `<script setup>` 语法

### 项目结构说明

```
src/
├── background/          # 后台 Service Worker
│   ├── index.ts        # 入口文件
│   ├── listeners/      # 事件监听器（下载、命令、消息）
│   └── utils/          # 后台工具函数
├── components/         # Vue 组件
│   ├── DownloadItem/   # 下载项组件（进度条、文件信息、操作按钮等）
│   └── DownloadList/   # 下载列表组件（筛选栏、骨架屏、列表内容）
├── store/              # Pinia 状态管理
│   ├── download.ts     # 下载数据管理（筛选、排序、分页）
│   └── settings.ts     # 设置管理（主题、语言、通知等）
├── views/              # 页面视图
│   ├── DownloadList.vue  # 下载列表主页面
│   └── Settings.vue      # 设置页面
└── utils/              # 工具函数
    ├── downloadConverter.ts  # 下载数据转换
    ├── downloadControl.ts    # 下载控制操作
    └── formatters.ts         # 格式化工具
```

### 主题系统

主题系统基于 CSS 变量实现，通过修改 `data-theme` 属性切换主题。主题变量定义在 `src/styles/_theme-*.scss` 中。支持：

- 6 种预设主题：科技蓝、赛博紫、暗夜黑、极简白、深空蓝、暖橙色
- 主题设置持久化存储（localStorage + chrome.storage）
- 暗色模式自动适配
- 主题切换即时生效，无需刷新

### 国际化

使用 `vue-i18n` 和 Chrome Extension 的 `_locales` 机制实现多语言支持。语言包存放在 `public/_locales` 目录下，使用标准的 Chrome Extension 国际化格式。

**新增语言步骤**：

1. 在 `public/_locales` 目录下创建语言文件夹（如 `fr`）
2. 创建 `messages.json` 文件，参考现有语言包添加所有翻译键值对
3. 在 `src/i18n/index.ts` 中添加语言配置
4. 在 `src/views/Settings.vue` 中添加语言选项

**Element Plus 国际化**：

通过 `ElConfigProvider` 组件动态切换 Element Plus 组件的语言，确保下拉框、分页等组件也支持多语言。

### 下载管理

下载管理通过 Chrome Downloads API 实现：

- **后台 Service Worker**：监听 `chrome.downloads.onCreated` 和 `chrome.downloads.onChanged` 事件
- **实时同步**：下载状态实时同步到 popup 页面
- **文件检测**：自动检测文件是否存在，已删除文件特殊标识
- **数据持久化**：分页设置、筛选条件、排序偏好等持久化存储
- **下载控制**：支持暂停/继续、取消、重试、删除等操作
- **速度计算**：基于时间差计算下载速度，显示实时进度

### 动画系统

- **骨架屏**：匹配实际布局的加载占位符，提升加载体验
- **进度条动画**：
  - 流光效果：从左到右的渐变光效
  - 粒子流动：多个粒子从左侧流向右侧，形成流动感
  - 暂停恢复：暂停时保持当前位置，恢复时继续动画
- **列表动画**：基于 Animate.css 的淡入淡出效果
- **交互反馈**：卡片悬浮、按钮点击等交互效果

### GitHub Actions 自动发布

项目配置了 GitHub Actions 工作流，实现自动发布：

**触发条件**：

- 当 `package.json` 或 `public/manifest.json` 的版本号更新时
- 推送到 `main` 或 `master` 分支

**工作流程**：

1. 检测版本号变化
2. 验证 `package.json` 和 `manifest.json` 版本一致性
3. 创建 Git 标签（格式：`v{version}`）
4. 构建插件
5. 打包为 zip 文件
6. 创建 GitHub Release 并上传 zip 文件

**使用方法**：

1. 更新 `package.json` 和 `public/manifest.json` 中的版本号
2. 提交并推送到主分支
3. GitHub Actions 自动执行发布流程

## 🔧 配置说明

### manifest.json

浏览器插件清单文件（Manifest V3），定义了：

- **权限**：`downloads`、`downloads.open`、`downloads.shelf`、`storage`、`notifications`
- **后台服务**：Service Worker 入口文件
- **弹出窗口**：popup 页面入口
- **快捷键**：`Ctrl+J` (Mac: `Command+J`) 打开下载管理器
- **国际化**：默认语言和语言包路径

### vite.config.ts

Vite 构建配置，包含：

- **浏览器插件特殊打包逻辑**：多入口配置、静态资源复制
- **SCSS 预处理器配置**：全局变量注入、主题文件导入
- **路径别名配置**：`@` 指向 `src` 目录
- **构建优化**：代码分割、资源压缩

### TypeScript 配置

- **严格模式**：启用所有严格类型检查
- **路径映射**：支持 `@/*` 别名
- **类型定义**：Chrome Extension API 类型定义

## 📖 使用指南

### 基本操作

1. **打开下载管理器**：
   - 点击浏览器工具栏中的插件图标
   - 或使用快捷键 `Ctrl+J` (Mac: `Command+J`)

2. **筛选下载项**：
   - 使用顶部筛选栏，可按状态、类型、时间、大小等筛选
   - 多个筛选条件可组合使用
   - 点击筛选框的清除按钮可重置筛选

3. **搜索下载项**：
   - 在搜索框中输入文件名关键词
   - 支持模糊匹配，实时显示结果

4. **排序下载项**：
   - 点击排序按钮，选择排序字段（时间/文件名/大小）
   - 点击排序方向按钮切换升序/降序

5. **操作下载项**：
   - **打开文件**：点击文件图标或文件名
   - **打开文件夹**：点击文件夹图标
   - **复制链接**：点击复制按钮
   - **暂停/继续**：点击暂停/继续按钮
   - **重试**：失败的任务可点击重试
   - **删除**：删除记录或同时删除文件和记录

### 高级功能

- **分页模式**：适合精确查找，可自定义每页显示数量
- **滚动加载**：适合快速浏览，自动加载更多内容
- **主题切换**：在设置页面选择喜欢的主题
- **语言切换**：支持中文（简/繁）、英文、日文
- **通知设置**：可开启/关闭下载完成通知和声音提醒

## 🐛 已知问题

- 粒子动画在插件关闭重开后可能会重置位置（已优化，使用 `animation-fill-mode: backwards` 确保初始状态不可见）
- 大量下载记录时，首次加载可能需要一些时间（已使用骨架屏优化体验）

## 🔮 未来计划

- [ ] 支持批量下载操作
- [ ] 添加下载历史统计图表
- [ ] 支持自定义下载路径
- [ ] 添加下载计划任务
- [ ] 支持下载速度限制
- [ ] 添加更多主题选项

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

**贡献指南**：

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

**代码提交规范**：

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具链相关

## 📮 反馈

如有问题或建议，请提交 Issue。反馈时请包含：

- 浏览器版本和操作系统
- 插件版本号
- 问题描述和复现步骤
- 错误截图（如有）

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Element Plus](https://element-plus.org/) - Vue 3 组件库
- [Pinia](https://pinia.vuejs.org/) - Vue 状态管理
- [Animate.css](https://animate.style/) - CSS 动画库
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
