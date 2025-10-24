# esbuild 版本冲突修复指南

## 问题
```
Error: Expected "0.19.11" but got "0.25.4"
```

这是因为 `node_modules` 中的 esbuild 包版本与已安装的二进制版本不匹配。

## 快速修复方案

### 方案 1：使用 bun（推荐）
```bash
# 删除 node_modules 和锁文件
rm -rf node_modules bun.lock package-lock.json

# 使用 bun 安装
bun install

# 启动开发服务器
bun run dev
```

### 方案 2：修复 esbuild 版本
```bash
# 在 PowerShell 中
Remove-Item -Path node_modules\esbuild -Recurse -Force
Remove-Item -Path node_modules\.bin\esbuild* -Force

# 重新安装 esbuild
bun add esbuild@0.19.11

# 启动开发服务器
bun run dev
```

### 方案 3：强制重新安装（Windows PowerShell）
```powershell
# 删除 node_modules
Remove-Item -Path node_modules -Recurse -Force

# 删除锁文件
Remove-Item -Path bun.lock -Force
Remove-Item -Path package-lock.json -Force -ErrorAction SilentlyContinue

# 重新安装
bun install

# 如果还有问题，尝试
bun install --no-cache
```

### 方案 4：使用 pbun
```bash
# 删除 node_modules 和锁文件
rm -rf node_modules bun.lock package-lock.json

# 使用 pbun 安装
pbun install

# 启动开发服务器
pbun dev
```

## 验证修复

安装完成后，运行：
```bash
bun run dev
```

或
```bash
bun run dev
```

如果看到类似以下输出，说明成功：
```
  VITE v5.0.12  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## 同时运行 Convex

在另一个终端运行：
```bash
bunx convex dev
```

## 如果所有方案都失败

1. **检查全局 esbuild**
   ```bash
   where esbuild  # Windows
   which esbuild  # Mac/Linux
   ```

2. **卸载全局 esbuild**
   ```bash
   bun uninstall -g esbuild
   bun remove -g esbuild
   ```

3. **清除缓存**
   ```bash
   bun pm cache rm
   bun cache clean --force
   ```

4. **使用 Docker**（终极方案）
   如果本地环境无法解决，可以使用 Docker 运行开发环境。

## 临时绕过（仅用于测试）

如果急需启动，可以临时修改 `node_modules/esbuild/install.js`：
1. 找到第 133 行的 `throw new Error(...)`
2. 注释掉这行（在前面加 `//`）
3. 运行 `bun run dev`

**注意**：这只是临时方案，不建议长期使用。

## 推荐的长期解决方案

使用 **bun** 或 **pbun** 而不是 bun 来管理依赖，因为 SvelteKit 生态系统主要针对 bun/pbun 优化。

```bash
# 一次性切换到 bun
rm -rf node_modules bun.lock
bun install
bun run dev
```

之后所有命令使用 bun：
- `bun run dev`
- `bun run build`
- `bun run check`

