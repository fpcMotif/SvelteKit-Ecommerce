# 下一步操作指南

## ✅ 当前状态

Convex + Effect 后端已成功设置并运行：
- ✅ Convex schema 已定义（products, orders, users 等）
- ✅ Convex 函数已创建（products.ts, orders.ts, checkout.ts）
- ✅ Effect 集成层已完成（convex.ts, runtime.ts）
- ✅ 测试数据已填充（2 个产品，1 个用户）
- ✅ 产品列表和详情页后端已迁移

## 🎯 立即可做的事

### 1. 测试产品浏览功能

启动开发服务器：
\`\`\`bash
bun run dev
\`\`\`

访问：
- `http://localhost:5173/products` - 产品列表页
- `http://localhost:5173/products/premium-canvas-print` - 产品详情页
- `http://localhost:5173/products/honor-collection-frame` - 另一个产品

### 2. 修复剩余的前端类型问题

产品详情页还有一些小问题需要修复（TypeScript 错误）：
- `src/routes/products/[productId]/+page.svelte`
  - `size.price` vs `size.priceCents`（已经正确）
  - 确保所有图片访问使用 `.cloudinaryId`

### 3. 运行 Convex 开发模式（热重载）

\`\`\`bash
npx convex dev
\`\`\`

这将启动 Convex 开发服务器，自动监听函数变更。

## 📋 后续任务优先级

### 高优先级
1. **修复前端 TypeScript 错误**
   - 运行 `bun run check` 查看所有错误
   - 逐个修复类型不匹配

2. **测试基本浏览功能**
   - 确保产品列表正常显示
   - 确保产品详情页正常显示
   - 确保图片正常加载（Cloudinary）

### 中优先级
3. **迁移 Admin 面板**
   - 产品管理（增删改）
   - 订单管理

4. **迁移购物车功能**
   - 添加到购物车
   - 购物车列表
   - 结账流程（占位）

### 低优先级
5. **Stripe 集成**
   - 实现真实的支付流程
   - Webhook 处理

6. **邮件集成**
   - 订单确认邮件
   - 配置 Postmark 或 SMTP

## 🛠️ 开发命令

\`\`\`bash
# 启动 SvelteKit 开发服务器
bun run dev

# 启动 Convex 开发模式（另一个终端）
npx convex dev

# 类型检查
bun run check

# 运行特定的 Convex 函数
npx convex run products:list '{"activeOnly": true}'

# 查看 Convex 数据
# 访问 https://dashboard.convex.dev/d/clean-gecko-664

# 填充更多测试数据
npx convex run seed:seedProducts
npx convex run seed:seedUsers
\`\`\`

## 📊 数据模型速查

### Product Schema
\`\`\`typescript
{
  _id: Id<'products'>,
  id: string,              // 自定义 ID（用于 URL）
  name: string,
  slug: string,
  desc: string,
  priceCents: number,
  images: [{
    cloudinaryId: string,
    width: number,
    height: number,
    isPrimary: boolean,
    isVertical: boolean,
    order: number
  }],
  tags: string[],
  sizes: [{
    code: string,
    name: string,
    isAvailable: boolean,
    width: number,
    height: number,
    price: number,
    stripePriceId: string,
    stripeProductId: string,
    productId: string
  }],
  gradientColorStart: string,
  gradientColorVia: string,
  gradientColorStop: string,
  isActive: boolean,
  createdAt: number,
  updatedAt: number
}
\`\`\`

## 🐛 已知问题

1. **Cloudinary 图片**
   - 种子数据使用的是占位 ID（`sample-product-1`）
   - 需要上传真实图片或使用真实的 Cloudinary ID

2. **Stripe 功能**
   - 目前只是占位实现
   - 返回"未启用"消息

3. **环境变量缺失**
   - `GITHUB_CLIENT_ID` 等（如果需要 OAuth 登录）
   - `STRIPE_SECRET_KEY`（如果需要支付）
   - `POSTMARK_API_TOKEN` 或 SMTP 配置（如果需要邮件）

## 💡 提示

- **Convex Dashboard**：访问 https://dashboard.convex.dev 查看数据和日志
- **实时数据**：Convex 支持实时订阅，前端可以自动更新
- **Effect 优势**：所有副作用都通过 Effect 管理，便于测试和错误处理
- **回滚**：旧的数据层（Drizzle）仍保留，可随时回退

## 🎉 成功标志

完成以下测试表示迁移成功：
- [ ] 产品列表页正常显示
- [ ] 产品详情页正常显示
- [ ] 可以浏览不同产品
- [ ] 可以查看不同尺寸和价格
- [ ] 标签筛选正常工作
- [ ] Admin 面板可以管理产品
- [ ] 购物车功能正常

## 📞 遇到问题？

检查以下内容：
1. Convex 开发服务器是否运行？（`npx convex dev`）
2. SvelteKit 开发服务器是否运行？（`bun run dev`）
3. 浏览器控制台有错误吗？
4. Convex Dashboard 显示数据了吗？
5. `.env.local` 文件存在吗？

## 🚀 性能提示

- Convex 查询会自动缓存
- 使用 Effect 可以方便地添加重试逻辑
- 考虑添加分页功能（Convex 支持）
- 图片优化建议使用 Cloudinary 的转换功能

