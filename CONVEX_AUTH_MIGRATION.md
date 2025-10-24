# Convex Auth 迁移完成 ✅

## 迁移总结

成功将认证系统从 **Lucia + Drizzle** 迁移到 **@convex-dev/auth**。

## 已完成的工作

### 1. 依赖更新

- ✅ 安装 `@convex-dev/auth@0.0.90` 和 `@auth/core@0.41.0`
- ✅ 移除 `lucia`、`arctic`、`oslo` 依赖
- ✅ 移除 `@lucia-auth/adapter-drizzle`

### 2. Convex 配置

- ✅ 创建 `convex/auth.ts` - Convex Auth 配置
- ✅ 创建 `convex/http.ts` - HTTP 路由配置
- ✅ 更新 `convex/schema.ts` - 添加 authTables
- ✅ 删除不需要的 `convex/sessions.ts`

### 3. 服务器端代码

- ✅ 重写 `src/lib/server/auth.ts` - 简化为只保留 `ensureAdmin`
- ✅ 更新 `src/hooks.server.ts` - 使用 Convex Auth JWT
- ✅ 更新认证路由：
  - `src/routes/auth/login/github/+server.ts`
  - `src/routes/auth/login/google/+server.ts`
  - `src/routes/auth/callback/github/+server.ts`
  - `src/routes/auth/callback/google/+server.ts`
  - `src/routes/auth/logout/+server.ts`

### 4. 客户端代码

- ✅ 创建 `src/lib/client/convexAuth.svelte.ts` - 客户端认证辅助函数

## 开发模式 (Dev Auth)

项目保留了原有的 **开发模式认证**，无需配置 OAuth：

### 启用开发模式

在 `.env` 或 `.env.local` 中设置：

```env
DEV_AUTH_ENABLED=true
PUBLIC_DEV_AUTH_ENABLED=true
```

### 开发模式登录

访问以下路由快速登录：

- **管理员**: `/auth/dev/login?role=admin`
- **普通用户**: `/auth/dev/login?role=user`

开发模式会创建临时用户，无需真实的 OAuth 配置。

## 生产模式配置

### 环境变量

在生产环境中，需要配置以下环境变量：

```env
# 禁用开发模式
DEV_AUTH_ENABLED=false
PUBLIC_DEV_AUTH_ENABLED=false

# Convex
PUBLIC_CONVEX_URL=https://your-convex-deployment.convex.cloud

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### OAuth 配置

#### GitHub OAuth 应用设置

1. 访问 https://github.com/settings/developers
2. 创建新的 OAuth 应用
3. **Authorization callback URL**: `https://your-convex-url.convex.cloud/auth/callback/github`
4. 复制 Client ID 和 Client Secret 到环境变量

#### Google OAuth 应用设置

1. 访问 Google Cloud Console
2. 创建 OAuth 2.0 客户端
3. **Authorized redirect URIs**: `https://your-convex-url.convex.cloud/auth/callback/google`
4. 复制 Client ID 和 Client Secret 到环境变量

## 认证流程

### 用户登录流程

1. **用户点击登录** → `/auth/login/github` 或 `/auth/login/google`
2. **重定向到 Convex Auth** → Convex Auth 处理 OAuth
3. **OAuth 回调** → `/auth/callback/{provider}`
4. **设置 JWT Cookie** → `__convexAuthJWT`
5. **重定向到首页** → `/`

### 会话验证

在 `hooks.server.ts` 中：

- 读取 `__convexAuthJWT` cookie
- 使用 token 从 Convex 查询用户信息
- 设置 `event.locals.user` 和 `event.locals.session`

### 用户注销

访问 `/auth/logout`：

- 清除 `__convexAuthJWT` cookie
- 重定向到登录页

## 优势

### vs Lucia + Drizzle

| 特性        | Lucia + Drizzle    | Convex Auth  |
| ----------- | ------------------ | ------------ |
| 数据库      | 需要单独的会话表   | 自动管理     |
| Adapter     | 需要自定义 adapter | 原生集成     |
| OAuth       | 需要 Arctic 库     | 内置支持     |
| 配置复杂度  | 高（多个库）       | 低（单一库） |
| 类型安全    | 部分               | 完全         |
| Convex 集成 | 需要额外工作       | 原生支持     |

## 迁移注意事项

### 已解决的问题

1. ✅ 移除了 Drizzle session 表依赖
2. ✅ 简化了 OAuth 回调流程
3. ✅ 统一了认证状态管理
4. ✅ 保留了开发模式认证

### 潜在影响

- 现有的用户会话将失效（需要重新登录）
- Cookie 名称改变：`lucia_session` → `__convexAuthJWT`
- 会话数据结构改变（Convex Auth 管理）

## 下一步

### 立即可用（开发模式）

```bash
# 启动开发服务器
bun run dev

# 访问 http://localhost:5173/auth/dev/login?role=admin 快速登录
```

### 生产部署前

1. 配置 GitHub 和 Google OAuth 应用
2. 在 Convex Dashboard 设置环境变量
3. 在部署环境设置 `.env` 变量
4. 禁用 `DEV_AUTH_ENABLED`
5. 测试 OAuth 登录流程

## 相关文件

- `convex/auth.ts` - Convex Auth 配置
- `convex/http.ts` - HTTP 路由
- `src/hooks.server.ts` - 会话验证
- `src/lib/server/auth/mock.ts` - 开发模式认证
- `DRIZZLE_TO_CONVEX_MIGRATION.md` - 数据库迁移文档

## 支持

遇到问题？

- 查看 [Convex Auth 文档](https://docs.convex.dev/auth)
- 查看开发模式实现: `src/lib/server/auth/mock.ts`
- 检查 `.env` 配置是否正确
