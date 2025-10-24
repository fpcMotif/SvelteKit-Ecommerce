# Convex + Effect 迁移进度报告

## ✅ 已完成

### 1. 后端基础设施
- [x] 安装所有依赖（Effect, Convex, 邮件库）
- [x] 初始化 Convex 项目
- [x] 配置环境变量（`.env.local`）
- [x] 配置 TypeScript（@effect/language-service 插件）

### 2. Convex Schema 与函数
- [x] 创建 `convex/schema.ts`（匹配前端需求）
  - products 表（包含完整图片对象、尺寸、标签）
  - orders 表
  - users 表
  - emailList 表
  - productReviews 表
- [x] 创建 `convex/products.ts`（list, getById, getBySlug, create, update, remove）
- [x] 创建 `convex/orders.ts`（list, getById, create, updateStatus, update）
- [x] 创建 `convex/checkout.ts`（Stripe 占位）
- [x] 创建 `convex/seed.ts`（种子数据）
- [x] 运行种子数据填充测试数据

### 3. Effect 集成
- [x] 创建 `src/lib/effect/convex.ts`（Effect 封装的 Convex 服务）
- [x] 创建 `src/lib/effect/runtime.ts`（Effect 运行时层）
- [x] 创建 `src/lib/server/convex.ts`（服务端客户端）
- [x] 创建 `src/lib/client/convex.ts`（浏览器端客户端）

### 4. 邮件服务
- [x] 创建 `src/lib/server/email/index.ts`（Postmark/Nodemailer 适配器）

### 5. 部分页面迁移
- [x] 产品列表页（`src/routes/products/+page.server.ts`）
- [x] 产品详情页（`src/routes/products/[productId]/+page.server.ts`）

## 🚧 需要完成

### 1. 前端页面更新（高优先级）

当前 Schema 结构：
```typescript
product = {
  _id: Id<'products'>,
  id: string,
  name: string,
  slug: string,
  desc: string,           // 前端期望 'desc'
  priceCents: number,
  images: Array<{
    cloudinaryId: string,
    width: number,
    height: number,
    isPrimary: boolean,
    isVertical: boolean,
    order: number
  }>,
  tags: string[],         // 前端期望字符串数组
  sizes: Array<{
    code: string,
    name: string,
    isAvailable: boolean,
    width: number,
    height: number,
    price: number,       // 前端期望 'price' 不是 'priceCents'
    stripePriceId: string,
    stripeProductId: string,
    productId: string
  }>,
  gradientColorStart: string,
  gradientColorVia: string,
  gradientColorStop: string,
  isActive: boolean,
  createdAt: number,
  updatedAt: number
}
```

需要更新的 Svelte 组件：
- [ ] `src/routes/products/+page.svelte`
  - 修复：`product.id`（已正确）
  - 修复：`product.desc`（已正确）
  - 修复：`product.images[0].cloudinaryId`（已正确）
  - 修复：`product.tags` 已是字符串数组（删除 `.map((tag) => tag.tagId)`）
  - 修复：`product.sizes` 中的 `price` 字段

- [ ] `src/routes/products/[productId]/+page.svelte`
  - 修复：访问 `size.price` 而不是 `size.priceCents`
  - 修复：图片对象访问（已更新为 `.cloudinaryId`）
  - 修复：产品 ID 访问（使用 `product.id`）

### 2. Admin 页面迁移

需要迁移的文件：
- [ ] `src/routes/admin/products/+page.server.ts`
- [ ] `src/routes/admin/products/[productId]/+page.server.ts`
- [ ] `src/routes/admin/products/[productId]/basics/+page.server.ts`
- [ ] `src/routes/admin/products/[productId]/images/+page.server.ts`
- [ ] `src/routes/admin/products/[productId]/sizes/+page.server.ts`
- [ ] `src/routes/admin/products/[productId]/tags/+page.server.ts`
- [ ] `src/routes/admin/products/new/+page.server.ts`
- [ ] `src/routes/admin/orders/+page.server.ts`
- [ ] `src/routes/admin/orders/[orderId]/+page.server.ts`

### 3. 购物车功能迁移
- [ ] `src/routes/cart/+page.server.ts`
- [ ] 更新购物车数据结构以匹配新 schema

### 4. API 路由清理/迁移
- [ ] `src/routes/api/products/+server.ts`（迁移或废弃）
- [ ] `src/routes/api/stripe/+server.ts`（保留占位）
- [ ] `src/routes/api/cloudinary/+server.ts`（保留或迁移）

### 5. 邮件集成
- [ ] 在订单确认流程调用邮件服务
- [ ] 测试邮件发送（配置 POSTMARK_API_TOKEN 或 SMTP）

### 6. Stripe 集成（后续）
- [ ] 实现真实的 `convex/checkout.ts` 逻辑
- [ ] 创建 webhook 处理器
- [ ] 测试支付流程

## 🔧 快速修复脚本

以下是前端页面最紧急需要修复的字段访问问题：

### 产品列表页（`src/routes/products/+page.svelte`）
```svelte
<!-- 旧代码 -->
tags: product.tags.map((tag) => tag.tagId)

<!-- 新代码 -->
tags: product.tags
```

### 产品详情页（`src/routes/products/[productId]/+page.svelte`）
所有 `size.priceCents` 应改为 `size.price`
所有 `product.desc` 保持不变（已正确）
所有 `image.cloudinaryId` 保持不变（已正确）

## 📊 测试数据

已填充的测试产品：
1. **Premium Canvas Print**（ID: `premium-canvas-print`）
   - 3 个尺寸：Small, Medium, Large
   - 标签：Sediment Collection, Canvas
   
2. **Honor Collection Frame**（ID: `honor-collection-frame`）
   - 2 个尺寸：Standard, Premium
   - 标签：Honor Collection, Frame

## 🎯 下一步行动

1. **立即修复** - 更新产品列表和详情页的字段访问
2. **功能测试** - 测试产品浏览功能
3. **Admin 迁移** - 迁移 Admin 面板的增删改功能
4. **购物车** - 迁移购物车逻辑
5. **完整测试** - 端到端测试所有功能

## ⚠️ 注意事项

- 旧数据层（Drizzle + MySQL）仍然存在，未删除
- 可使用环境变量 `USE_CONVEX=true` 切换数据源（需实现）
- Stripe 功能目前为占位状态
- 邮件功能已实现但未集成到业务流程

## 📝 配置检查清单

- [x] `PUBLIC_CONVEX_URL` 已配置
- [ ] `POSTMARK_API_TOKEN` 或 SMTP 配置（可选）
- [ ] `STRIPE_SECRET_KEY`（后续需要）
- [ ] Cloudinary 配置（如仍使用）

