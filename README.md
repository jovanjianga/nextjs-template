# AI 绘画平台

一个基于 Next.js 的 AI 图像生成平台，集成 Google Gemini/Imagen API，支持对话式创作、多种艺术风格和图片多轮修改。

## ✨ 功能特性

### AI 绘画功能
- 🎨 **AI 图像生成** - 基于 Google Imagen 3，高质量图像生成
- 💬 **对话式创作** - 像聊天一样描述需求，支持多轮对话持续优化作品
- 🖼️ **多种艺术风格** - 12+ 预设风格：写实、动漫、油画、水彩、赛博朋克等
- 📤 **参考图上传** - 上传参考图片，AI 根据图片进行风格化创作
- 🆓 **免费试用** - 游客 3 次免费，注册送 10 次，Pro 会员无限使用

### 基础功能
- 🔐 **用户认证** - 基于 NextAuth.js 的完整认证系统（支持 GitHub OAuth）
- 💳 **订阅支付** - 集成 Stripe 支付，支持免费和付费订阅计划
- 📊 **仪表盘** - 用户仪表盘，包含账户管理和订阅管理
- ⚙️ **个人设置** - 用户资料设置页面
- 🎨 **UI 组件库** - 基于 Radix UI + Tailwind CSS 的精美组件
- 🌓 **深色模式** - 支持系统主题切换
- 📱 **响应式设计** - 完美适配移动端和桌面端

## 🛠️ 技术栈

- **框架**: [Next.js 13](https://nextjs.org/) (App Router)
- **语言**: [TypeScript](https://www.typescriptlang.org/)
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **UI 组件**: [Radix UI](https://www.radix-ui.com/)
- **数据库**: [Prisma](https://www.prisma.io/) + MySQL
- **认证**: [NextAuth.js](https://next-auth.js.org/)
- **支付**: [Stripe](https://stripe.com/)
- **AI**: [Google Generative AI](https://ai.google.dev/) (Gemini/Imagen)
- **表单验证**: [Zod](https://zod.dev/) + [React Hook Form](https://react-hook-form.com/)

## 📁 项目结构

```
├── app/                    # Next.js App Router 目录
│   ├── (auth)/            # 认证相关页面 (登录、注册)
│   ├── (dashboard)/       # 仪表盘相关页面
│   ├── (marketing)/       # 营销页面 (首页、定价)
│   └── api/               # API 路由
│       ├── generate/      # AI 图像生成 API
│       └── upload/        # 图片上传 API
├── components/            # React 组件
│   ├── ai-painter/       # AI 绘画组件
│   └── ui/               # UI 基础组件
├── config/               # 配置文件
│   └── styles.ts         # 预设风格配置
├── lib/                  # 工具函数和库
│   └── gemini.ts         # Gemini API 封装
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

# Google AI (Gemini/Imagen)
GOOGLE_AI_API_KEY="your-google-ai-api-key"

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

### 4. 获取 Google AI API Key

1. 访问 [Google AI Studio](https://aistudio.google.com/)
2. 登录你的 Google 账号
3. 点击 "Get API Key" 获取 API 密钥
4. 将密钥填入 `.env` 文件的 `GOOGLE_AI_API_KEY`

### 5. 初始化数据库

```bash
pnpm prisma db push
```

### 6. 启动开发服务器

```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 🎨 AI 绘画功能说明

### 预设风格

| 风格 | 英文 | 描述 |
|------|------|------|
| 写实 | Realistic | 真实照片风格，高清细节 |
| 动漫 | Anime | 日式动漫风格 |
| 油画 | Oil Painting | 古典油画艺术风格 |
| 水彩 | Watercolor | 清新水彩画风格 |
| 赛博朋克 | Cyberpunk | 未来科幻霓虹风格 |
| 极简 | Minimalist | 简约现代设计风格 |
| 3D渲染 | 3D Render | 高质量3D渲染风格 |
| 像素艺术 | Pixel Art | 复古像素游戏风格 |
| 素描 | Sketch | 铅笔素描手绘风格 |
| 波普艺术 | Pop Art | 安迪·沃霍尔波普风格 |
| 印象派 | Impressionist | 莫奈印象派画风 |
| 奇幻 | Fantasy | 魔幻奇幻艺术风格 |

### 使用次数

| 用户类型 | 免费次数 |
|----------|----------|
| 游客 | 3 次 |
| 注册用户 | 10 次 |
| Pro 会员 | 无限制 |

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

### 风格配置

编辑 `config/styles.ts` 来添加或修改预设风格：

```ts
export const presetStyles: StyleOption[] = [
  {
    id: "realistic",
    name: "写实",
    nameEn: "Realistic",
    prompt: "photorealistic, high detail, sharp focus",
    description: "真实照片风格，高清细节",
  },
  // ... 更多风格
]
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
