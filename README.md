# MES 企业移动管理端

基于 uni-app 的跨端工程，面向 Android App、微信小程序及 H5。已实现工业风登录页、首页、权限工作台、扫码、消息和个人中心，当前使用演示数据。

## 界面预览与权限演示

- 默认账号 `factory-manager`，密码 `mes2026`：显示全部 10 个业务分组。
- 一线员工账号 `line-operator`，密码 `mes2026`：显示 8 个现场业务分组，也可在“我的 → 角色权限预览”切换。
- 底部入口为首页、工作台、扫码、消息、我的，采用 `AppTabBar` 自定义组件实现跨端一致的中央扫码操作。
- 生产数据、待办和消息是明确标识的演示数据；未接后端的业务操作只提示待接入，不模拟真实提交。扫码支持 App/小程序调用摄像头，H5 使用手动输入。
- 登录态和用户资料保存在本地，生产接入真实认证时应按后端双 Token、用户信息和权限接口调整。

## 技术栈与版本

- uni-app `3.0.0-5030420261029002`（Vue 3、Vite 模式）
- Vue `3.4.21`、Vite `5.2.8`、TypeScript `5.6.3`
- Pinia `2.2.4` + `pinia-plugin-persistedstate`
- wot-design-uni `1.14.0`（WotResolver 自动按需导入）
- Apache ECharts `5.6.0` + uni-echarts `2.5.4`（Canvas 渲染）
- vue-i18n、VueUse、Sass、ESLint、Prettier

> uni-app 的编译依赖保持一致版本；TypeScript 5 / vue-tsc 2 与组件库配套，避免旧版类型检查扫描第三方 `.vue` 源码产生不兼容。运行时仍是 Vue 3 + Vite。

## 启动

要求 Node.js `>=22.12.0`，pnpm `9.15.9`。项目级 Store 固定为 `<项目目录>/.pnpm-store`，不会回退写入 `F:\.pnpm-store`；pnpm 缓存位于 `.cache/pnpm`。首次修改配置后需重新执行 `pnpm install`，使 `node_modules` 关联到项目内 Store。

```powershell
corepack enable
pnpm install

# H5（浏览器调试）
pnpm run dev:h5

# 微信小程序（编译 + 监听）
pnpm run dev:mp-weixin

# Android App 资源（编译 + 监听）
pnpm run dev:app
```

- 微信小程序：用微信开发者工具导入 `dist/dev/mp-weixin`；首次在 `src/manifest.json` 填写小程序 `appid`。
- Android：在 HBuilderX 打开本目录，选择“运行到手机或模拟器”；真机需 USB 调试和驱动。正式发布使用 HBuilderX 云打包或 Android 离线 SDK 打包，纯 CLI 构建只产出 App 资源，不直接生成 APK/AAB。
- App 首次运行前在 `src/manifest.json` 配置 DCloud `appid`。不要将证书、签名密码、后端密钥提交到仓库。

## 构建与质量检查

```powershell
pnpm run check             # 类型检查 + ESLint + Prettier 检查
pnpm run type-check
pnpm run lint:fix
pnpm run format
pnpm run build:h5          # dist/build/h5
pnpm run build:mp-weixin   # dist/build/mp-weixin
pnpm run build:app         # dist/build/app
```

CI 位于 `.github/workflows/ci.yml`，包含依赖安装、静态检查及三端构建。运行前安装依赖，依赖提升配置在 `pnpm-workspace.yaml`（pnpm 9 不支持仅由 `package.json` 配置 overrides）。

## 目录约定

```text
src/
  api/                    # 业务接口及演示数据适配
  components/             # AppChart、AppTabBar 等公共组件
  data/                   # 业务分组及演示权限映射
  config/                 # 环境默认值
  locales/                # i18n 文案
  pages/                  # pages.json 对应页面
  stores/                 # Pinia 实例与 user / settings
  styles/                 # 全局业务样式
  types/                  # API、领域模型
  utils/                  # request、storage、错误与常量
  App.vue / main.ts
  manifest.json           # DCloud、小程序、Android 权限配置
  pages.json              # 路由、自定义导航、easycom
```

### 请求与状态

- `src/utils/request.ts` 基于 `uni.request`，支持 Bearer Token、超时、HTTP/业务错误归一化、401 清理会话；页面通过 `notifyError` 统一提示，避免重复 Toast。`src/utils/session.ts` 独立管理凭证，避免请求层与 Store 循环依赖。
- 默认后端响应结构：`{ code: 0, message: string, data: T, requestId?: string }`。请在 `src/utils/constants.ts` 按实际后端调整业务码。
- `user` 保存登录态和用户信息；`settings` 使用 `uni.setStorageSync` 适配器持久化。不要在未确认安全方案时持久化高敏感信息；生产建议改用短期 Token/安全存储和刷新机制。
- 新页面先在 `src/pages.json` 注册，再于 `src/api` 定义数据适配器，在 `src/types/api.ts` 补充 DTO。
- 图表统一通过 `AppChart.vue` 引入 ECharts 模块，避免全量注册；新增图表类型时在这里注册相应的 chart/component。

## 环境配置

`.env.example` 为可提交模板。实际开发可复制为 `.env.development.local` 并修改：

```dotenv
VITE_APP_TITLE=MES 企业移动管理
VITE_API_BASE_URL=https://dev-api.example.com
VITE_API_TIMEOUT=15000
VITE_USE_MOCK=true
```

生产环境使用本地未提交的 `.env.production.local`，或在 CI/构建系统注入同名变量。`src/config/index.ts` 提供默认值：开发启用 Mock，生产关闭 Mock。`example.com` 是占位地址，接入真实后端前请替换。

本次 CLI 环境的写文件安全策略禁止直接创建 `.npmrc`、`.env.development` 和 `.env.production`，因此 pnpm 设置集中在 `pnpm-workspace.yaml`，并只提供可提交的 `.env.example`；不是项目不支持 Vite 环境变量。

H5 开发服务器在关闭 Mock 时为 `/api` 配置代理。浏览器受 CORS 约束；小程序需配置 request 合法域名，App 生产接口应使用 HTTPS。`manifest.json` 中小程序的 `urlCheck=false` 只用于开发，不能替代线上合法域名配置。

## 依赖与排错

- pnpm 锁文件为 `pnpm-lock.yaml`；`pnpm-workspace.yaml` 配置项目级 `storeDir: '.pnpm-store'`、`cacheDir: '.cache/pnpm'`、依赖提升及 uni-app harmony 间接版本对齐。可用 `pnpm store path` 检查实际 Store；其末尾的 `v11` 是 Store 格式版本，`node_modules/.modules.yaml` 中的 `v3` 是安装元数据版本，两者都不是旧盘符路径。
- Vite 开发服务器忽略 `.pnpm-store`、`.cache`、`.git`、`dist` 及编辑器临时文件的监听；这些文件不需要热更新，也避免 Windows 监听缓存或正在替换的临时文件时出现 `UNKNOWN` / `EBUSY` 错误。
- ECharts 5 的 `zrender`、`tslib` 已显式锁定，且 Vite 显式映射 `zrender/lib/core/util.js`，兼容 uni-app 编译器解析；勿轻易移除。
- `@intlify/message-compiler`、`@intlify/shared` 与 `vue-i18n` 统一为 `9.14.5`，并在 Vite 显式映射 ESM 文件，避免 uni-app 内部提升目录误用旧版 `9.1.9`。
- `@types/node` 固定为 `20.17.30`，与项目 TypeScript 兼容。
- 当前依赖安装日志中存在旧版 ESLint、vue-i18n 及部分 uni-app 间接包的弃用提示。它们属于当前锁定技术基线，升级前应单独验证三端兼容性，不能只升级单个 DCloud 包。
- 仅声明 Android 网络与网络状态权限；新增扫码、定位、推送等能力时同步审查权限、隐私政策和应用市场合规要求。
