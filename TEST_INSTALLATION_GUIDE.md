# 测试框架设置 - 安装指南

## 当前状态

### ✅ 已完成
1. **配置文件** - 全部创建
   - ✅ `vitest.config.ts` - Vitest 配置
   - ✅ `vitest.setup.ts` - 测试环境设置
   - ✅ `jest.config.js` - Jest 配置（备用）
   - ✅ `jest.setup.js` - Jest 设置（备用）

2. **测试文件** - 全部创建
   - ✅ `components/__tests__/ClayButton.test.tsx` - 8 个测试用例
   - ✅ `components/__tests__/Navigation.test.tsx` - 4 个测试用例
   - ✅ `app/__tests__/page.test.tsx` - 5 个测试用例

3. **package.json** - 已更新
   - ✅ 测试脚本已添加
   - ✅ 依赖已声明在 devDependencies 中

4. **.gitignore** - 已更新
   - ✅ 添加测试覆盖率报告目录

### ⚠️ 需要手动完成

由于环境限制，npm 依赖包未能自动安装。需要在本地手动完成。

## 🚀 手动安装步骤

### 步骤 1: 打开本地终端

在您的项目目录 `C:\Users\huige\vocabmaster` 中打开终端（PowerShell 或 cmd）

### 步骤 2: 安装依赖

选择以下任一方法：

**方法 A: 使用 Vitest（推荐）**
```bash
npm install --save-dev vitest @vitest/ui @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

**方法 B: 使用 Jest**
```bash
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @types/jest ts-jest
```

### 步骤 3: 验证安装

```bash
# 运行验证脚本
node verify-setup.js

# 或直接运行测试
npm test
```

## 📝 预期结果

### 成功后您应该看到：

1. **依赖已安装** - node_modules 中包含测试框架
```bash
ls node_modules | grep vitest  # Vitest
# 或
ls node_modules | grep jest    # Jest
```

2. **测试运行成功** - npm test 显示测试结果
```bash
npm test

# 输出示例：
# ✓ components/ClayButton.test.tsx (8)
# ✓ components/Navigation.test.tsx (4)
# ✓ app/page.test.tsx (5)
#
# Test Files  3 passed (3)
# Tests  17 passed (17)
```

3. **覆盖率报告** - npm run test:coverage 生成报告
```bash
npm run test:coverage

# 生成 coverage/ 目录
```

## 🔧 故障排除

### 问题 1: npm install 失败

```bash
# 清理并重新安装
rm -rf node_modules package-lock.json  # Windows: Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
```

### 问题 2: 测试失败

```bash
# 检查 Node 版本
node --version  # 应该 >= 18.0.0

# 检查 npm 版本
npm --version

# 更新 npm
npm install -g npm@latest
```

### 问题 3: 类型错误

```bash
# 安装缺失的类型定义
npm install --save-dev @types/react @types/react-dom @types/node
```

## 📊 测试文件说明

### 1. ClayButton.test.tsx
测试 ClayButton 组件的所有功能：
- 渲染子元素
- 点击事件处理
- 三种变体样式（primary, orange, green）
- 自定义类名
- 禁用状态
- 按钮类型（button, submit, reset）

### 2. Navigation.test.tsx
测试导航栏组件：
- 所有导航项正确渲染
- Logo 显示
- 当前路径高亮
- 用户连续学习天数显示

### 3. page.test.tsx
测试首页：
- 页面标题
- 学习进度统计
- 单元卡片渲染
- 单元数量验证
- 单词计数显示

## 📚 下一步

安装完成后，您可以：

1. **运行现有测试**
   ```bash
   npm test
   ```

2. **添加更多测试**
   - 为其他组件创建测试
   - 添加集成测试
   - 编写 E2E 测试

3. **查看测试文档**
   - `TESTING.md` - 完整测试指南
   - `QUICKSTART_TEST.md` - 快速开始

4. **设置 CI/CD**
   - GitHub Actions
   - GitLab CI
   - 或其他持续集成服务

## ✨ 验证清单

安装完成后，确认以下项目：

- [ ] `node_modules/vitest` 或 `node_modules/jest` 存在
- [ ] `npm test` 运行成功
- [ ] 所有 17 个测试通过
- [ ] 可以查看覆盖率报告
- [ ] `verify-setup.js` 显示全部通过

## 🎉 完成

一旦安装成功，您就可以：
- ✅ 运行测试确保代码质量
- ✅ 在开发新功能时编写测试
- ✅ 使用 TDD（测试驱动开发）
- ✅ 集成到 CI/CD 流程

---

**如有问题，请参考 TESTING.md 获取详细说明。**
