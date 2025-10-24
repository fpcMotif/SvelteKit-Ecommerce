# Drizzle 到 Convex 迁移指南

## 迁移状态

### ✅ 已完成的迁移

1. **核心基础设施**
   - ✅ Convex schema 已更新（添加用户提供商支持）
   - ✅ 创建了 `convex/users.ts` 用于用户管理
   - ✅ 创建了 `convex/emailList.ts` 用于邮件列表管理

2. **认证相关文件**
   - ✅ `src/routes/auth/callback/google/+server.ts`
   - ✅ `src/routes/auth/callback/github/+server.ts`
   - ✅ `src/routes/auth/list/+page.server.ts`
   - ✅ `src/routes/auth/list/remove/+server.ts`

3. **API 路由**
   - ✅ `src/routes/api/stripe/+server.ts`

4. **订单管理**
   - ✅ `src/routes/admin/orders/+page.server.ts`
   - ✅ `src/routes/admin/orders/[orderId]/+page.server.ts`

5. **主要页面**
   - ✅ `src/routes/+layout.server.ts`
   - ✅ `src/routes/+page.server.ts`

### ⏳ 需要迁移的文件

以下文件仍在使用 Drizzle ORM，需要迁移到 Convex：

1. **管理员产品管理**
   - ❌ `src/routes/admin/products/+page.server.ts` - CSV 导入功能
   - ❌ `src/routes/admin/products/[productId]/+layout.server.ts`
   - ❌ `src/routes/admin/products/[productId]/basics/+page.server.ts`
   - ❌ `src/routes/admin/products/[productId]/images/+page.server.ts`
   - ❌ `src/routes/admin/products/[productId]/sizes/+page.server.ts`
   - ❌ `src/routes/admin/products/[productId]/tags/+page.server.ts`
   - ❌ `src/routes/admin/products/new/+page.server.ts`
   - ❌ `src/routes/admin/products/new-old/+page.server.ts`

## 迁移模式

### 基本导入替换

**之前（Drizzle）：**
\`\`\`typescript
import { db } from '$lib/server/db'
import { user, product } from '$lib/server/db/schema'
import { eq } from 'drizzle-orm'
\`\`\`

**之后（Convex）：**
\`\`\`typescript
import { convexHttp } from '$lib/server/convex'
import { api } from '../../../convex/\_generated/api'
\`\`\`

### 查询转换示例

#### 查询单个用户

**之前：**
\`\`\`typescript
const user = await db.query.user.findFirst({
where: eq(user.email, email)
})
\`\`\`

**之后：**
\`\`\`typescript
const user = await convexHttp.query(api.users.getByEmail, { email })
\`\`\`

#### 查询多个记录

**之前：**
\`\`\`typescript
const orders = await db.query.order.findMany({
orderBy: desc(order.timestamp)
})
\`\`\`

**之后：**
\`\`\`typescript
const orders = await convexHttp.query(api.orders.list, {})
\`\`\`

#### 插入记录

**之前：**
\`\`\`typescript
await db.insert(user).values({
id: userId,
email: email,
firstName: firstName
})
\`\`\`

**之后：**
\`\`\`typescript
await convexHttp.mutation(api.users.create, {
id: userId,
email: email,
firstName: firstName
})
\`\`\`

#### 更新记录

**之前：**
\`\`\`typescript
await db.update(user)
.set({ firstName: newName })
.where(eq(user.id, userId))
\`\`\`

**之后：**
\`\`\`typescript
const user = await convexHttp.query(api.users.getByExternalId, {
externalId: userId
})
if (user) {
await convexHttp.mutation(api.users.update, {
id: user.\_id,
patch: { firstName: newName }
})
}
\`\`\`

## 产品结构变化

### 重要：产品尺寸存储方式变化

**Drizzle（旧）：** 产品尺寸作为单独的表
\`\`\`
products: { id, name, desc }
productSizes: { id, productId, width, height, price, ... }
\`\`\`

**Convex（新）：** 产品尺寸作为产品的嵌套数组
\`\`\`typescript
products: {
id: string
name: string
desc: string
sizes: Array<{
code: string
name: string
width: number
height: number
price: number
stripePriceId: string
stripeProductId: string
...
}>
}
\`\`\`

这意味着管理员产品页面需要重写以：

1. 将尺寸作为产品对象的一部分更新
2. 使用 `api.products.update` 更新整个产品（包括尺寸）

## 可用的 Convex API

### Users (`convex/users.ts`)

- `getByExternalId(externalId: string)`
- `getByEmail(email: string)`
- `getByProvider(provider, providerId)`
- `create({ id?, externalId?, provider?, providerId?, email, ... })`
- `update({ id, patch })`
- `upsertByExternalId({ externalId, email, ... })`

### Products (`convex/products.ts`)

- `list({ activeOnly?, tags?, limit?, offset? })`
- `getById(id: string)`
- `getBySlug(slug: string)`
- `create({ id, name, slug, desc, images, tags, sizes, ... })`
- `update({ id, patch })`
- `remove(id: string)`

### Orders (`convex/orders.ts`)

- `list({ userId?, status?, limit? })`
- `getById(id: Id<'orders'>)`
- `getByStripeOrderId(stripeOrderId: string)`
- `create({ userId, stripeOrderId?, items, totalPrice, status?, ... })`
- `update({ id, patch })`
- `updateStatus({ id, status })`

### Email List (`convex/emailList.ts`)

- `getByEmail(email: string)`
- `subscribe({ email, key })`
- `unsubscribe(email: string)`
- `list({ includeUnsubscribed? })`

## 下一步

1. 迁移管理员产品管理页面，重点关注：
   - 产品基本信息编辑
   - 图片管理
   - 标签管理
   - 尺寸管理（需要适配新的嵌套结构）
   - CSV 导入功能

2. 删除旧的 Drizzle 依赖：
   - 从 `package.json` 中移除 `drizzle-orm` 和 `drizzle-kit`
   - 删除 `src/lib/server/db/` 目录

3. 测试所有已迁移的功能

## 临时占位符

为了防止导入错误，已创建临时占位符文件：

- `src/lib/server/db/index.ts` - 抛出有用的错误消息
- `src/lib/server/db/schema.ts` - 抛出有用的错误消息

这些文件在所有迁移完成后应该被删除。
