# 双维度个人知识库系统

> 🎯 一个现代化的个人知识管理系统，通过"领域（What）+ 主题/应用（Why & How）"双维度分类，帮助构建结构化的个人知识体系。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)

## ✨ 核心特性

### 📚 双维度标签体系
- **领域标签（What）**：心理学、经济学、计算机科学、数学等学科分类
- **主题标签（Why & How）**：思维提升、决策分析、学习方法、自我管理等应用场景
- **智能组合**：通过两套标签的交叉组合，实现精准的知识定位和检索

### 🔍 强大的搜索与筛选
- **全文搜索**：支持书名、作者、描述内容的模糊匹配
- **多维筛选**：按领域标签、主题标签、时间等维度组合筛选
- **智能排序**：支持按创建时间、更新时间、标题等多种排序方式
- **实时响应**：基于 React Query 的数据缓存，提供流畅的交互体验

### 📝 笔记卡片系统
- **多种类型**：概念、引用、反思、应用、总结五大笔记类型
- **优先级管理**：低、中、高三级优先级标记
- **关联管理**：笔记与书籍的强关联，支持快速导航
- **标签扩展**：笔记可独立添加标签，形成更细粒度的知识网络

### 🎨 现代化用户界面
- **响应式设计**：完美适配桌面和移动设备
- **双视图模式**：网格视图和列表视图自由切换
- **优雅动画**：基于 Framer Motion 的流畅过渡动画
- **玻璃拟态**：现代化的 UI 设计风格，提升视觉体验

### ⚡ 性能优化
- **组件懒加载**：大型组件按需加载，优化首屏性能
- **骨架屏**：加载过程中的占位符，避免布局跳动
- **智能缓存**：基于 React Query 的数据缓存和状态管理
- **并发安全**：优化的数据获取策略，减少无效请求

## 🏗️ 技术架构

### 前端技术栈
```
React 18.2.0          # 现代化 React 框架
TypeScript 5.2.2      # 类型安全的 JavaScript 超集
Vite 5.0.8            # 快速的构建工具
Tailwind CSS 3.3.6    # 实用优先的 CSS 框架
Framer Motion 10.16.16 # 声明式动画库
React Query 5.84.2    # 强大的数据获取和状态管理
React Router 6.20.1   # 单页应用路由
React Icons 4.12.0    # 丰富的图标库
```

### 后端技术栈
```
Node.js 20+           # JavaScript 运行时
Express 4.18.2        # Web 应用框架
TypeScript 5.3.3      # 类型安全的服务端开发
CORS 2.8.5            # 跨域资源共享
UUID 9.0.1            # 唯一标识符生成
fs-extra 11.2.0       # 增强的文件系统操作
```

### 数据存储
```
JSON 文件存储         # 轻量级数据持久化方案
结构化数据模型        # 清晰的数据关系设计
版本化管理           # 支持数据迁移和升级
```

## 🚀 快速开始

### 环境要求
- Node.js 18.0.0 或更高版本
- npm 9.0.0 或更高版本

### 安装与运行

1. **克隆项目**
```bash
git clone <repository-url>
cd 个人知识库搭建
```

2. **安装所有依赖**
```bash
npm run setup
```
这个命令会自动安装根目录、客户端和服务端的所有依赖。

3. **启动开发服务器**
```bash
npm run dev
```
这会并发启动前端和后端开发服务器：
- 🌐 前端：http://localhost:5173
- 🔧 后端 API：http://localhost:3001

4. **验证安装**
访问 http://localhost:3001/api/health 确认后端服务正常运行。

### 生产环境部署

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 📁 项目结构

```
个人知识库搭建/
├── client/                    # 前端 React 应用
│   ├── src/
│   │   ├── components/        # React 组件
│   │   │   ├── AddBookModal/  # 添加书籍模态框
│   │   │   ├── AdvancedSearch/ # 高级搜索
│   │   │   ├── BookCard/      # 书籍卡片
│   │   │   ├── NotesModal/    # 笔记管理
│   │   │   ├── StatsPanel/    # 统计面板
│   │   │   ├── TagSelector/   # 标签选择器
│   │   │   └── Skeletons/     # 骨架屏组件
│   │   ├── hooks/             # 自定义 React Hooks
│   │   │   └── useBooks.ts    # 书籍数据管理 Hook
│   │   ├── api/               # API 接口封装
│   │   │   └── index.ts       # 统一的 API 客户端
│   │   ├── types/             # TypeScript 类型定义
│   │   │   └── index.ts       # 通用类型声明
│   │   ├── App.tsx            # 主应用组件
│   │   ├── main.tsx           # 应用入口点
│   │   └── index.css          # 全局样式
│   ├── public/                # 静态资源
│   ├── package.json           # 前端依赖配置
│   ├── vite.config.ts         # Vite 构建配置
│   ├── tailwind.config.js     # Tailwind CSS 配置
│   └── tsconfig.json          # TypeScript 配置
├── server/                    # 后端 Express 应用
│   ├── src/
│   │   ├── routes/            # API 路由定义
│   │   │   ├── books.ts       # 书籍相关路由
│   │   │   ├── notes.ts       # 笔记相关路由
│   │   │   ├── tags.ts        # 标签相关路由
│   │   │   ├── stats.ts       # 统计相关路由
│   │   │   └── search.ts      # 搜索相关路由
│   │   ├── database.ts        # 数据库操作封装
│   │   ├── types.ts           # 后端类型定义
│   │   └── index.ts           # 服务器入口点
│   ├── data/                  # 数据存储目录
│   │   ├── books.json         # 书籍数据
│   │   ├── notes.json         # 笔记数据
│   │   └── tags.json          # 标签数据
│   ├── package.json           # 后端依赖配置
│   └── tsconfig.json          # TypeScript 配置
├── package.json               # 根目录脚本配置
└── README.md                  # 项目文档
```

## 📖 使用指南

### 新书入库工作流

#### 1. 快速录入（30秒领域判断）
- 点击右上角"添加书籍"按钮
- 填写书名、作者、简要描述
- **选择1-2个核心领域标签**：
  - 心理学 → 认知心理、社会心理
  - 计算机 → 算法与数据结构、机器学习
  - 经济学 → 行为经济学、微观经济

#### 2. 主题定位（60秒目标确认）
- **选择2-4个主题标签**，回答"读完希望解决什么问题"：
  - 提升思维 → 批判性思维、系统思维
  - 改善决策 → 启发式与偏差、风险管理
  - 学习方法 → 记忆技巧、元认知

#### 3. 核心笔记（关键概念记录）
- 点击书籍卡片的"管理笔记"
- 添加不同类型的笔记卡片：
  - **概念**：核心理论和定义
  - **引用**：重要段落和数据
  - **反思**：个人思考和质疑
  - **应用**：实际应用场景
  - **总结**：章节或全书总结

### 高效检索策略

#### 问题导向检索
1. **明确问题**：我要解决什么具体问题？
2. **选择主题标签**：在主题标签中找到相关类别
3. **横向浏览**：查看该主题下的所有书籍
4. **交叉验证**：对比不同书籍的观点和方法

#### 系统学习检索
1. **选择领域**：确定要深入的知识领域
2. **纵向探索**：按照该领域的不同子分类逐步学习
3. **建立联系**：寻找跨子分类的共同概念
4. **构建框架**：形成该领域的整体知识图谱

#### 复盘与总结
1. **定期回顾**：每季度回顾学习内容
2. **主题聚合**：将同主题的笔记导出整理
3. **跨领域连接**：发现不同领域间的共通点
4. **知识网络**：构建个人的跨领域知识网络

## 🔧 开发指南

### 本地开发环境搭建

```bash
# 1. 安装依赖
npm run setup

# 2. 启动开发服务器
npm run dev

# 3. 在新终端中运行代码检查
npm run lint

# 4. 构建生产版本
npm run build
```

### API 接口文档

#### 书籍管理 API

**获取书籍列表**
```http
GET /api/books?query=React&domainTags=计算机&themeTags=学习方法&sortBy=updatedAt&sortOrder=desc
```

**创建新书籍**
```http
POST /api/books
Content-Type: application/json

{
  "title": "深入理解计算机系统",
  "author": "Randal E. Bryant",
  "description": "从程序员角度学习计算机系统的工作原理",
  "domainTags": ["计算机", "系统架构"],
  "themeTags": ["工程实践", "系统理解"]
}
```

**更新书籍信息**
```http
PUT /api/books/:id
Content-Type: application/json

{
  "title": "更新的书名",
  "domainTags": ["计算机", "算法"],
  "themeTags": ["编程实践"]
}
```

**删除书籍**
```http
DELETE /api/books/:id
```

#### 笔记管理 API

**获取笔记列表**
```http
GET /api/notes?bookId=book-uuid
```

**创建新笔记**
```http
POST /api/notes
Content-Type: application/json

{
  "bookId": "book-uuid",
  "title": "核心概念：递归",
  "content": "递归是一种解决问题的方法...",
  "type": "concept",
  "tags": ["算法", "递归"],
  "priority": "high",
  "pageNumber": 45,
  "chapter": "第三章"
}
```

#### 标签系统 API

**获取所有标签**
```http
GET /api/tags
```

**获取特定类型标签**
```http
GET /api/tags?type=domain  # 或 type=theme
```

### 数据模型说明

#### Book 数据模型
```typescript
interface Book {
  id: string;              // 唯一标识符
  title: string;           // 书名
  author?: string;         // 作者
  description?: string;    // 描述
  domainTags: string[];    // 领域标签数组
  themeTags: string[];     // 主题标签数组
  createdAt: string;       // 创建时间（ISO 字符串）
  updatedAt: string;       // 更新时间（ISO 字符串）
}
```

#### NoteCard 数据模型
```typescript
interface NoteCard {
  id: string;                    // 唯一标识符
  bookId: string;               // 关联的书籍 ID
  title: string;                // 笔记标题
  content: string;              // 笔记内容
  type: 'concept' | 'quote' | 'reflection' | 'application' | 'summary';
  tags: string[];               // 笔记标签
  pageNumber?: number;          // 页码
  chapter?: string;             // 章节
  priority: 'low' | 'medium' | 'high';  // 优先级
  createdAt: string;            // 创建时间
  updatedAt: string;            // 更新时间
}
```

#### 预定义标签体系

**领域标签（Domain Tags）**
```
心理学: [认知心理, 社会心理, 动机与习惯, 心理测量]
经济学: [微观, 宏观, 行为经济学, 计量/实验]
数学: [分析, 代数, 概率统计, 离散数学, 优化]
计算机: [算法与数据结构, 操作系统, 计算机网络, 数据库, 机器学习/深度学习]
数据科学: [统计学习, 可视化, 实验设计]
哲学: [认识论, 伦理学, 科学哲学]
历史: [通史, 专题史]
文学: [小说, 散文, 批评]
社会学: [制度, 组织, 方法]
```

**主题标签（Theme Tags）**
```
思维提升: [批判性思维, 概率思维, 系统思维, 因果推断]
决策: [启发式与偏差, 风险与不确定性, 博弈/机制]
学习方法: [记忆/笔记, 元认知, 科研方法]
自我管理: [目标与执行, 习惯养成, 时间管理, 专注与成瘾]
职业技能: [编程实践, 代码质量/重构, 架构, 写作表达]
世界认知: [经济运行, 技术与社会, 历史视角]
工程实践: [性能与可靠性, 实验与评估, 系统理解]
伦理与社会影响: [AI伦理, 隐私, 公共政策]
```

## 🎯 最佳实践

### 标签使用建议

1. **领域标签**：选择1-2个最核心的学科分类
2. **主题标签**：选择2-4个应用场景或问题域
3. **避免冗余**：不要选择过于相似的标签
4. **保持一致**：在添加新书籍时参考已有标签，保持体系一致性

### 笔记记录技巧

1. **及时记录**：阅读过程中随时添加笔记，不要等到读完再补充
2. **分类明确**：根据内容性质选择合适的笔记类型
3. **简洁有力**：每条笔记专注一个核心观点
4. **关联思考**：在反思类笔记中记录与其他书籍的联系

### 检索优化策略

1. **组合搜索**：善用搜索框 + 标签筛选的组合
2. **迭代优化**：根据搜索结果调整关键词和标签选择
3. **交叉验证**：通过不同标签组合验证搜索结果的完整性
4. **定期整理**：定期清理和优化标签体系

## 🔮 未来规划

### 近期功能（1-2个月）
- [ ] 阅读进度跟踪
- [ ] 智能推荐系统
- [ ] 标签热力图与知识地图
- [ ] 导入导出功能

### 中期功能（3-6个月）
- [ ] 全文搜索增强
- [ ] 笔记卡片间引用关系
- [ ] 移动端适配优化
- [ ] 数据同步与备份

### 长期愿景（6个月以上）
- [ ] AI 助手集成
- [ ] 协作与分享功能
- [ ] 移动端原生应用
- [ ] 知识图谱可视化

## 🤝 贡献指南

我们欢迎社区贡献！请查看以下指南：

### 开发流程
1. Fork 本仓库
2. 创建功能分支：`git checkout -b feature/AmazingFeature`
3. 提交更改：`git commit -m 'Add some AmazingFeature'`
4. 推送分支：`git push origin feature/AmazingFeature`
5. 提交 Pull Request

### 代码规范
- 使用 TypeScript 进行类型安全的开发
- 遵循 ESLint 和 Prettier 的代码格式规范
- 为新功能编写相应的测试用例
- 保持良好的注释和文档

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [React](https://reactjs.org/) - 用户界面构建库
- [Vite](https://vitejs.dev/) - 现代化构建工具
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [Framer Motion](https://www.framer.com/motion/) - 声明式动画库
- [React Query](https://tanstack.com/query) - 强大的数据获取库

---

<div align="center">

**[⬆ 回到顶部](#双维度个人知识库系统)**

Made with ❤️ by 知识管理爱好者

</div>
