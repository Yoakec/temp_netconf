## Context

KonfigMe 是一个离线优先的纯前端模板配置工具。目标用户为网络工程师，他们需要填写大量 Jinja2 风格的设备配置模板。所有逻辑在浏览器中运行，数据存储在 IndexedDB，无任何后端依赖。

当前项目从零开始，无现有代码库，使用 Vite + Vue 3 初始化项目。

## Goals / Non-Goals

**Goals:**
- 用户可上传本地 `.j2` / `.txt` 模板文件，持久化到 IndexedDB
- 自动解析模板中的 `{{ variable }}` 占位符，生成动态表单
- 毫秒级实时渲染预览（Nunjucks 浏览器端渲染）
- Monaco Editor 红绿高亮——红色标未填充，绿色标已填充
- 完全离线可用，页面加载不发起任何外部网络请求
- 支持 Chrome 96+ 和 Edge 96+

**Non-Goals:**
- 无后端服务器、无数据库
- 不支持多用户协作
- 不支持模板语法中的循环、条件、过滤器（仅变量替换）
- 不导出/导入模板包（首版仅支持单个文件上传）
- 不强密码保护、无用户认证

## Decisions

### 1. 存储层：idb + IndexedDB

**选择**：使用 `idb` 库（Jake Archibald 的轻量 IndexedDB 封装）操作 IndexedDB。

**理由**：
- localStorage 上限 ~5MB，不够存 20 × 800KB = 16MB 的模板数据
- IndexedDB 无硬性上限，浏览器通常允许数百 MB
- `idb` 提供 Promise API，比原生 IndexedDB 回调简洁
- 纯前端实现，无需服务器

**替代方案**：
- File System Access API：Chrome 独占，Edge 支持有限，且用户换浏览器模板不可见
- localStorage：容量不足

### 2. Monaco Editor 加载：npm ESM 打包

**选择**：通过 npm 安装 `monaco-editor`，Vite 打包进 dist。

**理由**：
- 离线可用（不依赖 CDN）
- 与 Vite 构建流程集成
- Monaco 主要体积在语言 worker，配置 `monaco-editor-webpack-plugin` 的 Vite 等价方案 (`vite-plugin-monaco-editor`) 可优化

**风险**：Monaco 打包后 ~5MB+，增加首屏加载时间。缓解：首屏仅加载编辑器核心，语言服务按需加载。

### 3. 状态管理：Vue 3 reactive 替代 Pinia

**选择**：使用 Vue 3 原生 `reactive()` 创建全局 store，不引入 Pinia。

**理由**：
- 应用状态结构简单（当前模板、变量列表、表单值、渲染结果）
- 单一数据流，无需 Pinia 的模块化和 devtools 支持
- 减少依赖体积

### 4. 模板渲染引擎：Nunjucks 浏览器版本

**选择**：使用 `nunjucks` npm 包，在浏览器中配置并调用 `nunjucks.renderString()`。

**理由**：
- 完整兼容 Jinja2 `{{ variable }}` 语法
- 支持浏览器环境
- 提供 `renderString` API，直接渲染字符串模板

**注意**：Nunjucks 默认支持循环、条件等高级语法。首版仅使用变量替换功能，不做语法限制，但 UI 仅暴露变量输入。

### 5. 红绿高亮：Monaco DeltaDecorations API

**选择**：使用 Monaco Editor 的 `deltaDecorations` API，分两轮装饰：

- **红色装饰**：在渲染后的文本中查找所有未被替换的 `{{ variable }}` 残留字符串，添加红色背景 className
- **绿色装饰**：对已填充的值，在渲染后的文本中查找匹配位置，添加绿色背景 className

**理由**：
- `deltaDecorations` 支持动态增删装饰，不会引起编辑器内容变化
- 装饰规则在每次渲染后重新计算并更新
- 红绿逻辑清晰分离

## Risks / Trade-offs

| Risk | Impact | Mitigation |
|------|--------|------------|
| Monaco 打包体积大 (~5MB) | 首屏加载慢 | Vite code-split, Monaco worker 按需加载 |
| IndexedDB 数据在浏览器清除缓存时丢失 | 用户数据丢失 | UI 提示用户定期备份，后续可加导出功能 |
| Nunjucks 渲染大型模板可能卡顿 | 输入延迟 | debounce 50ms，模板最大 1MB 限制 |
| Safari/Firefox 未测试 | 未知兼容性问题 | 首版仅承诺 Chrome/Edge 96+ |

## Open Questions

- 是否需要模板编辑功能（上传后修改模板内容）？当前设计仅支持上传-使用-删除
- 是否需要渲染结果的复制/导出按钮？
- 是否需要暗色模式支持？
