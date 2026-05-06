## Why

网络工程师日常需要填写大量 Jinja2 风格的设备配置模板，每次都要手动复制模板、逐个查找替换变量，过程繁琐且易遗漏。需要一个离线可用的纯前端工具，让工程师在浏览器中就能加载模板、填写变量、实时预览最终配置——所有数据存储在本地，无需服务器，断网也能正常工作。

## What Changes

- 新增模板管理系统：支持上传本地 `.j2` / `.txt` 模板文件，存储到 IndexedDB，可增删改查
- 新增模板解析能力：正则提取 `{{ variable }}` 占位符，自动生成变量列表
- 新增动态表单：根据变量列表实时渲染输入框，支持双向绑定
- 新增实时渲染预览：Nunjucks 浏览器端渲染，输入即预览，延迟 < 50ms
- 新增 Monaco Editor 只读预览窗口：未填充占位符红色高亮，已填充值绿色高亮
- 新增输入校验：检测用户输入中的 `{{` 和 `}}` 标记为非法输入

## Capabilities

### New Capabilities

- `template-management`: 模板文件的存储、上传、选择、删除。基于 IndexedDB，支持至少 20 个模板（每个最大 1MB），纯前端离线操作。
- `template-parsing`: 从模板文本中通过正则提取所有 `{{ variable }}` 占位符变量名，去重后生成变量列表。
- `dynamic-form`: 根据变量列表动态生成输入表单，每个变量对应一个输入框，双向绑定到 reactive 状态，支持输入校验（禁止 `{{` `}}`）。
- `real-time-preview`: Nunjucks 渲染引擎在浏览器端将表单值与模板合并，生成最终配置文本，并在 Monaco Editor 只读窗口中实时展示。
- `highlight-system`: Monaco Editor 装饰器系统——红色高亮未替换的 `{{ }}` 占位符，绿色高亮已填充渲染后的实际值。

### Modified Capabilities

<!-- No existing capabilities to modify -->

## Impact

- 依赖：Vue 3, Vite, Nunjucks (browser build), Monaco Editor (npm ESM), idb (IndexedDB wrapper)
- 无后端依赖，无外部 CDN 请求
- 目标浏览器：Chrome 96+, Edge 96+
