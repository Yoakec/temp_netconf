# KonfigMe

离线优先的网络设备配置模板工具。上传 `.j2` / `.txt` 模板文件，自动提取 `{{ variable }}` 占位符生成动态表单，实时预览渲染结果。支持模块化配置块拼接（Snippet Builder），按厂商 `→` 系列 `→` 模块的方式像搭积木一样组装配置。

## 快速开始

```bash
cd konfigme
npm install
npm run dev        # 开发服务器 (http://0.0.0.0:5173)
npm run build      # 生产构建
npm run preview     # 预览生产构建
```

## 功能

**Template File 模式** — 上传单个模板文件，填写变量，实时预览。

**Snippet Builder 模式** — 从内置模板库（华为 CE/S/USG、华三 S、思科 Nexus）中勾选配置块，拼装成完整模板。支持自定义上传和管理自己的 Snippet。

**核心特性**：
- 完全离线可用，数据存储在浏览器 IndexedDB，无需后端
- Nunjucks 浏览器端渲染，50ms 防抖实时预览
- Monaco Editor 只读预览窗口，红色高亮未填充占位符，绿色高亮已填充值
- 浅色 / 深色主题切换，偏好持久化到 localStorage
- 变量值跨模块保留，切换厂商/型号不清空已填数据

## 技术栈

| 层 | 技术 |
|---|---|
| 框架 | Vue 3 (Composition API, reactive store) |
| 构建 | Vite 8 + Rolldown |
| 存储 | IndexedDB (idb) |
| 渲染 | Nunjucks (浏览器端) |
| 编辑器 | Monaco Editor (ESM 打包，无 CDN) |
| 目标浏览器 | Chrome 96+, Edge 96+ |

## 项目结构

```
konfigme/src/
  main.js                          # 入口
  App.vue                          # 根布局，按模式切换工作区
  style.css                        # CSS 变量，浅色/深色主题
  components/
    TemplateManager.vue            # 顶部工具栏：模式切换、模板上传/选择
    TemplateWorkspace.vue          # Template 模式工作区
    DynamicForm.vue                # 变量输入表单（Template 模式）
    MonacoPreview.vue              # Monaco 预览（Template 模式）
    SnippetWorkspace.vue           # Snippet 模式工作区
    SnippetSelector.vue            # 厂商/系列下拉 + 模板树 + 用户 Snippet 列表
    SnippetDynamicForm.vue         # 变量输入表单（Snippet 模式）
    SnippetMonacoPreview.vue       # Monaco 预览（Snippet 模式）
    SnippetEditModal.vue           # Snippet 编辑弹窗（Monaco 编辑器）
  stores/
    appStore.js                    # 全局：当前模式、主题
    templateStore.js               # Template 模式状态
    snippetStore.js                # Snippet 模式状态（树形导航 + 复合键）
  utils/
    db.js                          # 模板 IndexedDB CRUD
    snippetDb.js                   # Snippet IndexedDB CRUD
    snippetLibrary.js              # 内置模板树（华为/华三/思科）
    parser.js                      # 正则提取 {{ variable }}
    renderer.js                    # Nunjucks 渲染封装
```
