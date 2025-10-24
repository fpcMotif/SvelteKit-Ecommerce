# VS Code 配置说明

## Svelte + Bun 集成

本项目已配置 VS Code 以与 Svelte 扩展和 bun 包管理器兼容。

### 必需扩展

- **svelte.svelte-vscode** - Svelte 官方语言服务器（推荐在扩展市场安装）
- **biomejs.biome** - Biome 代码格式化和 linting
- **ms-vscode.vscode-typescript-next** - TypeScript 支持（可选）

### 配置详解

#### settings.json 关键设置

```json
{
  "svelte.enable-ts-plugin": true,
  "svelte.language-server.runtime": "bun",
  "svelte.language-server.ls-path": "node_modules/svelte-language-server/bin/server.js",
  "emmet.includeLanguages": {
    "svelte": "html"
  }
}
```

- **enable-ts-plugin**: 启用 TypeScript 在 JS/TS 文件中对 Svelte 文件的智能感知
- **language-server.runtime**: 指定使用 bun 作为语言服务器运行时（替代 Node.js）
- **language-server.ls-path**: Svelte 语言服务器的入口文件路径
- **emmet.includeLanguages**: 在 Svelte 文件中启用 Emmet 缩写展开

#### bunfig.toml 配置

`bunfig.toml` 文件配置了 bun 的运行时行为：

- **autoPrefix**: 自动处理 Node.js 兼容性
- **jsx**: 配置为 "automatic"（自动导入）
- **BUN 环境变量**: 用于工具识别 bun 环境

### 使用步骤

1. **安装 Svelte 扩展**
   - 在 VS Code 扩展市场搜索 "Svelte"
   - 安装 `svelte.svelte-vscode` 官方扩展

2. **重启 VS Code**
   - 按 `Ctrl+Shift+P` 并运行 "Developer: Reload Window"

3. **验证配置**
   - 打开任何 `.svelte` 文件
   - 应该看到语法高亮、IntelliSense 和实时诊断

### 格式化配置

- **Svelte 文件** → `svelte.svelte-vscode`（基于 Prettier）
- **TypeScript** → `biomejs.biome`
- **JSON** → VS Code 内置格式化器
- **Markdown** → Prettier

所有格式化在保存时自动运行（`editor.formatOnSave: true`）

### 故障排除

| 问题 | 解决方案 |
|------|--------|
| Svelte 文件无高亮 | 确认已安装 `svelte.svelte-vscode` 扩展，重启 VS Code |
| 语言服务器崩溃 | 检查 bun 版本是否为最新（`bun --version`），运行 `bun install` |
| TypeScript 未识别 | 运行 `svelte-kit sync` 更新生成的类型 |
| Emmet 不工作 | 确认 `emmet.includeLanguages` 包含 `"svelte": "html"` |

### 相关文档

- [Svelte 官方文档](https://svelte.dev)
- [Bun 官方文档](https://bun.sh)
- [VS Code 语言服务器扩展指南](https://code.visualstudio.com/api/language-extensions/language-server-extension-guide)
