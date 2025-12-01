# Next.js SaaS Template

一个现代化的全栈 Next.js 模板，包含用户认证、订阅支付和仪表盘功能，可用于快速开发 SaaS 应用或业务网站。

## ✨ 功能特性

- 🔐 **用户认证** - 基于 NextAuth.js 的完整认证系统（支持 GitHub OAuth）
- 💳 **订阅支付** - 集成 Stripe 支付，支持免费和付费订阅计划
- 📊 **仪表盘** - 用户仪表盘，包含账户管理和订阅管理
- ⚙️ **个人设置** - 用户资料设置页面
- 🎨 **UI 组件库** - 基于 Radix UI + Tailwind CSS 的精美组件
- 🌓 **深色模式** - 支持系统主题切换
- 📱 **响应式设计** - 完美适配移动端和桌面端
- 🔒 **中间件保护** - 路由级别的认证保护

## 🛠️ 技术栈

- **框架**: [Next.js 13](https://nextjs.org/) (App Router)
- **语言**: [TypeScript](https://www.typescriptlang.org/)
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **UI 组件**: [Radix UI](https://www.radix-ui.com/)
- **数据库**: [Prisma](https://www.prisma.io/) + MySQL
- **认证**: [NextAuth.js](https://next-auth.js.org/)
- **支付**: [Stripe](https://stripe.com/)
- **表单验证**: [Zod](https://zod.dev/) + [React Hook Form](https://react-hook-form.com/)

## 📁 项目结构

```
├── app/                    # Next.js App Router 目录
│   ├── (auth)/            # 认证相关页面 (登录、注册)
│   ├── (dashboard)/       # 仪表盘相关页面
│   ├── (marketing)/       # 营销页面 (首页、定价)
│   └── api/               # API 路由
├── components/            # React 组件
│   └── ui/               # UI 基础组件
├── config/               # 配置文件
├── lib/                  # 工具函数和库
├── prisma/               # Prisma 数据库模型
├── public/               # 静态资源
├── styles/               # 全局样式
└── types/                # TypeScript 类型定义
```

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd next-template
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 配置环境变量

复制 `.env.example` 文件并重命名为 `.env`：

```bash
cp .env.example .env
```

配置以下环境变量：

```env
# 数据库
DATABASE_URL="mysql://user:password@localhost:3306/database"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Stripe
STRIPE_API_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRO_MONTHLY_PLAN_ID="price_..."

# 邮件
SMTP_FROM="noreply@your-domain.com"
RESEND_API_KEY="re_..."

# 应用
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. 初始化数据库

```bash
pnpm prisma db push
```

### 5. 启动开发服务器

```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📝 配置说明

### 网站配置

编辑 `config/site.ts` 文件来自定义网站信息：

```ts
export const siteConfig: SiteConfig = {
  name: "Your App Name",
  description: "Your app description",
  url: "https://your-domain.com",
  // ...
}
```

### 订阅计划

编辑 `config/subscriptions.ts` 来配置订阅计划：

```ts
export const freePlan: SubscriptionPlan = {
  name: "Free",
  description: "Free plan description",
  stripePriceId: "",
}

export const proPlan: SubscriptionPlan = {
  name: "Pro",
  description: "Pro plan description",
  stripePriceId: env.STRIPE_PRO_MONTHLY_PLAN_ID,
}
```

## 🔧 自定义开发

### 添加新页面

在 `app/` 目录下创建新的路由文件夹和 `page.tsx` 文件。

### 添加新组件

在 `components/` 目录下创建新组件，UI 基础组件放在 `components/ui/` 目录。

### 修改数据库模型

1. 编辑 `prisma/schema.prisma`
2. 运行 `pnpm prisma db push` 同步数据库
3. 运行 `pnpm prisma generate` 更新 Prisma Client

## 📦 部署

### Vercel 部署

1. 将代码推送到 GitHub
2. 在 Vercel 导入项目
3. 配置环境变量
4. 部署

### 数据库

推荐使用 [PlanetScale](https://planetscale.com/) 或 [Neon](https://neon.tech/) 作为生产数据库。

## 📄 许可证

MIT License - 详见 [LICENSE.md](LICENSE.md)
