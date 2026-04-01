# Testing Setup Guide for VocabMaster

## Current Status

测试框架配置文件已创建，但由于环境限制，依赖包未成功安装。

## 已创建的文件

### 1. 测试配置文件
- `vitest.config.ts` - Vitest 配置
- `vitest.setup.ts` - 测试环境设置
- `jest.config.js` - Jest 配置（备用）
- `jest.setup.js` - Jest 设置（备用）

### 2. 测试文件
- `components/__tests__/ClayButton.test.tsx` - 按钮组件测试
- `components/__tests__/Navigation.test.tsx` - 导航组件测试
- `app/__tests__/page.test.tsx` - 首页测试
- `test-setup.test.ts` - 基础测试验证

### 3. package.json 更新
已添加测试脚本：
- `npm test` - 运行测试
- `npm run test:watch` - 监视模式
- `npm run test:coverage` - 生成覆盖率报告
- `npm run test:ui` - UI 界面（Vitest）

## 手动安装步骤

### 方法 1: 使用 Vitest（推荐）

```bash
# 安装依赖
npm install --save-dev vitest @vitest/ui @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event

# 运行测试
npm test
```

### 方法 2: 使用 Jest

```bash
# 安装依赖
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @types/jest ts-jest

# 运行测试
npm test
```

## 测试覆盖

### 组件测试
1. **ClayButton** - 按钮组件
   - 渲染测试
   - 点击事件测试
   - 变体样式测试（primary, orange, green）
   - 禁用状态测试

2. **Navigation** - 导航栏
   - 导航项渲染测试
   - 激活状态测试
   - Logo 显示测试
   - 用户连续学习天数显示

### 页面测试
1. **Home Page** - 首页
   - 页面标题渲染
   - 进度统计显示
   - 单元卡片渲染
   - 单元数量验证

## 示例测试代码

所有测试文件已创建并包含以下测试模式：

```typescript
// 组件测试示例
describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<Component />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })

  it('handles user interactions', () => {
    const handleClick = jest.fn()
    render(<Component onClick={handleClick} />)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalled()
  })
})
```

## 下一步

1. 在本地终端中手动运行上述安装命令
2. 运行 `npm test` 验证测试是否正常工作
3. 根据需要添加更多测试用例
4. 考虑添加 E2E 测试（Playwright 或 Cypress）

## 已知问题

在当前环境中，npm install 命令没有显示输出，可能的原因：
- Windows 环境下的路径问题
- npm 缓存问题
- 网络连接问题

建议在本地环境中重新运行安装命令。
