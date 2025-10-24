# 🚨 快速修复 - 当前 500 错误

## 问题原因

```
Error: [svelte-cloudinary] unable to find a cloud name
```

## 💡 立即修复（3 步骤）

### 1️⃣ 在项目根目录创建 `.env` 文件

```bash
# 在项目根目录（与 package.json 同级）
# 创建新文件：.env
```

### 2️⃣ 在 `.env` 文件中添加以下内容

```env
PUBLIC_CLOUDINARY_CLOUD_NAME=demo
```

> **注意**：`demo` 是 Cloudinary 的公开演示账户，仅用于测试。
> 生产环境请使用您自己的 Cloudinary 账户。

### 3️⃣ 重启开发服务器

```bash
# 在终端按 Ctrl+C 停止当前服务器
# 然后重新启动：
bun run dev
```

---

## ✅ 验证修复成功

重启后，您应该看到：

- ✅ 没有 500 错误
- ✅ 页面正常加载
- ✅ 图片能够显示

---

## 🔐 获取您自己的 Cloudinary 账户（推荐）

1. 访问：[https://cloudinary.com/users/register_free](https://cloudinary.com/users/register_free)
2. 注册免费账户
3. 登录后，在控制台复制您的 **Cloud Name**
4. 更新 `.env` 文件：
   ```env
   PUBLIC_CLOUDINARY_CLOUD_NAME=您的实际cloud_name
   ```
5. 重启开发服务器

---

## 📌 注意事项

- `.env` 文件不会被 Git 跟踪（已在 .gitignore 中）
- 请勿将 `.env` 文件提交到代码仓库
- Cloudinary 免费账户足够用于开发和测试

---

**完成后，您的应用应该能够正常运行！** ✨
