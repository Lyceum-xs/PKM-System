// 数据类型定义
export interface Book {
  id: string;
  title: string;
  author?: string;
  description?: string;
  domainTags: string[];
  themeTags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface NoteCard {
  id: string;
  bookId: string;
  title: string;
  content: string;
  type: 'concept' | 'quote' | 'reflection' | 'application' | 'summary';
  tags: string[];
  pageNumber?: number;
  chapter?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  type: 'domain' | 'theme';
  category?: string;
  description?: string;
  createdAt: string;
}

// 预定义的标签体系
export const DOMAIN_TAGS = {
  '心理学': ['认知心理', '社会心理', '动机与习惯', '心理测量'],
  '经济学': ['微观', '宏观', '行为经济学', '计量/实验'],
  '数学': ['分析', '代数', '概率统计', '离散数学', '优化'],
  '计算机': ['算法与数据结构', '操作系统', '计算机网络', '数据库', '机器学习/深度学习', '编译原理', '软件工程'],
  '数据科学': ['统计学习', '可视化', '实验设计'],
  '哲学': ['认识论', '伦理学', '科学哲学'],
  '历史': ['通史', '专题史'],
  '文学': ['小说', '散文', '批评'],
  '社会学': ['制度', '组织', '方法']
};

export const THEME_TAGS = {
  '思维提升': ['批判性思维', '概率思维', '系统思维', '因果推断'],
  '决策': ['启发式与偏差', '风险与不确定性', '博弈/机制'],
  '学习方法': ['记忆/笔记', '元认知', '科研方法'],
  '自我管理': ['目标与执行', '习惯养成', '时间管理', '专注与成瘾'],
  '职业技能': ['编程实践', '代码质量/重构', '架构', '写作表达'],
  '世界认知': ['经济运行', '技术与社会', '历史视角'],
  '工程实践': ['性能与可靠性', '实验与评估', '系统理解'],
  '伦理与社会影响': ['AI伦理', '隐私', '公共政策']
};

// API 响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 搜索和筛选参数
export interface SearchParams {
  query?: string;
  domainTags?: string[];
  themeTags?: string[];
  sortBy?: 'createdAt' | 'updatedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}
