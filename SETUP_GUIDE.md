# 🚀 SvelteKit 电商项目设置指南

## ⚠️ 重要：修复 Cloudinary 错误

您当前遇到的 500 错误是因为缺少 Cloudinary 配置。请按照以下步骤操作：

### 步骤 1：创建 `.env` 文件

在项目根目录创建一个 `.env` 文件（与 `package.json` 同级）：

```bash
# Windows PowerShell
New-Item -Path .env -ItemType File

# 或者直接在编辑器中创建 .env 文件
```

### 步骤 2：配置 Cloudinary

1. **获取 Cloudinary Cloud Name**：
   - 访问 [https://cloudinary.com/](https://cloudinary.com/)
   - 登录您的账户（或创建免费账户）
   - 在控制台页面，您会看到 **Cloud name**

2. **添加到 `.env` 文件**：
   ```env
   PUBLIC_CLOUDINARY_CLOUD_NAME=您的cloudinary名称
   ```

### 步骤 3：配置其他必需的环境变量

```env
# ============================================
# Cloudinary 配置 (必需 - 用于图片管理)
# ============================================
PUBLIC_CLOUDINARY_CLOUD_NAME=您的cloudinary名称

# ============================================
# Convex 配置 (必需 - 数据库)
# ============================================
PUBLIC_CONVEX_URL=您的convex_url

# ============================================
# Stripe 配置 (必需 - 支付)
# ============================================
PUBLIC_STRIPE_KEY=您的stripe公钥
STRIPE_SECRET_KEY=您的stripe密钥

# ============================================
# OAuth 配置 (可选 - 第三方登录)
# ============================================
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# ============================================
# Email 配置 (可选)
# ============================================
RESEND_API_KEY=

# ============================================
# 其他配置
# ============================================
ADMIN_EMAIL=
```

### 步骤 4：重启开发服务器

配置完成后，重启开发服务器：

```bash
# 停止当前服务器 (Ctrl+C)
# 然后重新启动
bun run dev
```

---

## 📋 已修复的问题

✅ **无障碍性 (a11y) 警告**

- 为 NavBar.svelte 中的图标链接添加了 `aria-label` 属性
- 为 +layout.svelte 中的按钮添加了 `aria-label` 属性

✅ **自闭合标签警告**

- 修复了 +page.svelte 中的自闭合 `<div />` 标签

✅ **安全性改进**

- 为 Instagram 链接添加了 `rel="noopener"` 属性

---

## 🔍 获取 API 密钥指南

### Cloudinary (必需)

1. 访问 [https://cloudinary.com/](https://cloudinary.com/)
2. 注册/登录
3. 在控制台复制 **Cloud Name**

### Convex (必需)

1. 访问 [https://www.convex.dev/](https://www.convex.dev/)
2. 创建项目
3. 运行 `npx convex dev` 获取 URL

### Stripe (必需 - 用于支付)

1. 访问 [https://stripe.com/](https://stripe.com/)
2. 创建账户
3. 在 Developers > API keys 获取密钥
4. 使用测试密钥进行开发

### Google OAuth (可选)

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建 OAuth 2.0 客户端 ID
3. 设置授权重定向 URI: `http://localhost:5173/auth/callback/google`

### GitHub OAuth (可选)

1. 访问 GitHub Settings > Developer settings > OAuth Apps
2. 创建新应用
3. 设置回调 URL: `http://localhost:5173/auth/callback/github`

### Resend (可选 - 用于邮件)

1. 访问 [https://resend.com/](https://resend.com/)
2. 创建账户
3. 生成 API 密钥

---

## 🎯 快速开始（最小配置）

如果您只想快速测试应用，只需配置以下必需项：

```env
PUBLIC_CLOUDINARY_CLOUD_NAME=您的cloudinary名称
PUBLIC_CONVEX_URL=您的convex_url
```

其他功能（支付、OAuth登录、邮件）可以稍后添加。

---

## ❓ 常见问题

### Q: 为什么我看到 500 错误？

A: 缺少 `PUBLIC_CLOUDINARY_CLOUD_NAME` 环境变量。请确保已创建 `.env` 文件并配置了 Cloudinary。

### Q: `.env` 文件应该提交到 Git 吗？

A: **不应该！** `.env` 文件包含敏感信息，已经在 `.gitignore` 中被忽略。只提交 `.env.example` 文件作为模板。

### Q: 如何验证环境变量是否生效？

A: 重启开发服务器后，500 错误应该消失，页面应该能够正常加载。

---

## 📞 需要帮助？

如果您在配置过程中遇到问题，请检查：

1. `.env` 文件是否在项目根目录
2. 环境变量名称是否正确（注意大小写）
3. 是否已重启开发服务器
4. Cloudinary cloud name 是否正确

---

**祝您使用愉快！** 🎉
