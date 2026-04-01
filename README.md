# VocabMaster - 背单词应用

一个使用 Next.js + Tailwind CSS 构建的现代化背单词应用，采用 Claymorphism（粘土拟态）设计风格。

## ✨ 功能特性

- 📚 **单元学习** - 按主题单元组织单词，循序渐进
- 🔄 **智能复习** - 基于间隔重复算法（SM-2）的复习系统
- 📝 **多种测试** - 选择题、拼写、听力、连线匹配
- ⭐ **收藏夹** - 收藏难记或重点单词，支持标签分类
- 📊 **学习统计** - 可视化学习进度和成就徽章
- 🎨 **Claymorphism UI** - 现代化的粘土拟态设计风格

## 🛠️ 技术栈

- **框架**: Next.js 15 (App Router)
- **样式**: Tailwind CSS
- **语言**: TypeScript
- **字体**: Baloo 2 + Comic Neue (Google Fonts)
- **动画**: CSS 3D Transforms + Transitions

## 🚀 快速开始

### 安装依赖

```bash
cd ~/vocabmaster
npm install
```

### 运行开发服务器

```bash
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### 构建生产版本

```bash
npm run build
npm start
```

## 🧪 测试

项目已配置完整的测试框架，包括 17 个测试用例。

### 安装测试依赖

**Windows (PowerShell):**
```powershell
.\install-testing-deps.ps1
```

**Linux/Mac:**
```bash
./install-testing-deps.sh
```

**或手动安装:**
```bash
npm install --save-dev vitest @vitest/ui @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

### 运行测试

```bash
# 运行所有测试
npm test

# 监视模式
npm run test:watch

# 生成覆盖率报告
npm run test:coverage

# UI 界面
npm run test:ui
```

### 测试覆盖

- ✅ **ClayButton** - 8 个测试用例
- ✅ **Navigation** - 4 个测试用例
- ✅ **Home Page** - 5 个测试用例

详细文档请查看：
- `TESTING.md` - 完整测试指南
- `QUICKSTART_TEST.md` - 快速开始
- `TEST_INSTALLATION_GUIDE.md` - 安装指南

## 📁 项目结构

```
vocabmaster/
├── app/                    # Next.js App Router 页面
│   ├── page.tsx           # 首页（单元列表）
│   ├── layout.tsx         # 根布局
│   ├── globals.css        # 全局样式
│   ├── learn/             # 学习模式
│   ├── review/            # 复习模式
│   ├── test/              # 测试模式
│   ├── favorites/         # 收藏夹
│   ├── stats/             # 统计页面
│   └── unit/[id]/         # 单元详情
│
├── components/            # React 组件
│   ├── Navigation.tsx     # 导航栏
│   ├── ClayCard.tsx       # 粘土卡片组件
│   ├── ClayButton.tsx     # 粘土按钮组件
│   ├── Flashcard.tsx      # 翻转卡片组件
│   └── ProgressBar.tsx    # 进度条组件
│
├── public/               # 静态资源
├── tailwind.config.ts    # Tailwind 配置
├── tsconfig.json         # TypeScript 配置
└── next.config.js        # Next.js 配置
```

## 🎨 设计系统

### 配色方案
- **Primary**: #2563EB (学习蓝)
- **Secondary**: #3B82F6 (浅蓝)
- **Accent Orange**: #F97316 (橙色 CTA)
- **Accent Green**: #10B981 (进度绿)
- **Background**: #F8FAFC (浅灰背景)
- **Surface**: #FFFFFF (白色表面)

### 字体
- **标题**: Baloo 2 (圆润、友好)
- **正文**: Comic Neue (教育感、易读)

### 设计风格
- **Claymorphism**: 3D 粘土效果
  - 多层阴影营造深度
  - 圆润的边角 (20-50px)
  - 柔和的渐变色彩
  - 弹性动画效果

## 📄 页面说明

### 首页 (/)
- 显示所有学习单元
- 每个单元卡片显示学习进度
- 点击进入单元详情

### 学习页面 (/learn)
- Flashcard 翻转卡片
- 单词发音 (Web Speech API)
- 收藏功能
- 进度统计

### 复习页面 (/review)
- 基于间隔重复算法
- 自我评分系统
- 智能安排复习时间

### 测试页面 (/test)
- 4种测试类型
- 多种难度选择
- 测试记录统计

### 收藏页面 (/favorites)
- 标签筛选
- 搜索功能
- 批量操作

### 统计页面 (/stats)
- 学习数据可视化
- 成就徽章系统
- 连续学习天数

## 🔧 自定义配置

### 添加新单词

编辑 `app/learn/page.tsx` 或 `app/unit/[id]/page.tsx` 中的 `sampleWords` 数组：

```typescript
const sampleWords = [
  {
    id: 1,
    word: "your-word",
    pronunciation: "/pronunciation/",
    definition: "中文释义",
    partOfSpeech: "n.",
    example: "Example sentence.",
    isFavorite: false,
  },
  // ...
];
```

### 修改配色

编辑 `tailwind.config.ts` 中的 `colors` 配置。

### 添加新单元

在 `app/page.tsx` 的 `units` 数组中添加新单元。

## 🎯 后续功能计划

- [ ] 用户认证系统
- [ ] 数据持久化 (数据库)
- [ ] 更多测试类型
- [ ] 社交分享功能
- [ ] 离线模式 (PWA)
- [ ] 深色模式
- [ ] 多语言支持

## 📝 License

MIT License

---

**Made with ❤️ using Next.js + Tailwind CSS**
