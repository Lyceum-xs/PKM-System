// API 基础类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 书籍相关类型
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

export interface CreateBookData {
  title: string;
  author?: string;
  description?: string;
  domainTags: string[];
  themeTags: string[];
}

// 笔记卡片类型
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

export interface CreateNoteCardData {
  bookId: string;
  title: string;
  content: string;
  type: NoteCard['type'];
  tags: string[];
  pageNumber?: number;
  chapter?: string;
  priority?: NoteCard['priority'];
}

// 标签类型
export interface Tag {
  id: string;
  name: string;
  type: 'domain' | 'theme';
  category?: string;
  description?: string;
  createdAt: string;
}

// 搜索参数
export interface SearchParams {
  query?: string;
  domainTags?: string[];
  themeTags?: string[];
  sortBy?: 'createdAt' | 'updatedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

// UI 相关类型
export interface FilterState {
  searchQuery: string;
  selectedDomainTags: string[];
  selectedThemeTags: string[];
  sortBy: 'createdAt' | 'updatedAt' | 'title';
  sortOrder: 'asc' | 'desc';
}

export interface SelectOption {
  value: string;
  label: string;
  category?: string;
}
