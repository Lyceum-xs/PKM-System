import axios from 'axios';
import { Book, NoteCard, Tag, CreateBookData, CreateNoteCardData, SearchParams, ApiResponse } from '../types';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 响应拦截器
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// 书籍相关 API
export const booksApi = {
  // 获取书籍列表
  getBooks: async (params?: SearchParams): Promise<Book[]> => {
    const response = await api.get<ApiResponse<Book[]>>('/books', { params });
    return response.data.data || [];
  },

  // 获取单本书籍
  getBook: async (id: string): Promise<Book | null> => {
    try {
      const response = await api.get<ApiResponse<Book>>(`/books/${id}`);
      return response.data.data || null;
    } catch (error) {
      return null;
    }
  },

  // 创建书籍
  createBook: async (data: CreateBookData): Promise<Book> => {
    const response = await api.post<ApiResponse<Book>>('/books', data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || '创建失败');
    }
    return response.data.data;
  },

  // 更新书籍
  updateBook: async (id: string, data: Partial<CreateBookData>): Promise<Book> => {
    const response = await api.put<ApiResponse<Book>>(`/books/${id}`, data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || '更新失败');
    }
    return response.data.data;
  },

  // 删除书籍
  deleteBook: async (id: string): Promise<boolean> => {
    const response = await api.delete<ApiResponse<null>>(`/books/${id}`);
    return response.data.success;
  },
};

// 笔记相关 API
export const notesApi = {
  // 获取笔记列表
  getNotes: async (bookId?: string): Promise<NoteCard[]> => {
    const params = bookId ? { bookId } : {};
    const response = await api.get<ApiResponse<NoteCard[]>>('/notes', { params });
    return response.data.data || [];
  },

  // 创建笔记
  createNote: async (data: CreateNoteCardData): Promise<NoteCard> => {
    const response = await api.post<ApiResponse<NoteCard>>('/notes', data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || '创建失败');
    }
    return response.data.data;
  },

  // 更新笔记
  updateNote: async (id: string, data: Partial<CreateNoteCardData>): Promise<NoteCard> => {
    const response = await api.put<ApiResponse<NoteCard>>(`/notes/${id}`, data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || '更新失败');
    }
    return response.data.data;
  },

  // 删除笔记
  deleteNote: async (id: string): Promise<boolean> => {
    const response = await api.delete<ApiResponse<null>>(`/notes/${id}`);
    return response.data.success;
  },
};

// 标签相关 API
export const tagsApi = {
  // 获取所有标签
  getTags: async (type?: 'domain' | 'theme'): Promise<Tag[]> => {
    const params = type ? { type } : {};
    const response = await api.get<ApiResponse<Tag[]>>('/tags', { params });
    return response.data.data || [];
  },

  // 获取领域标签
  getDomainTags: async (): Promise<Tag[]> => {
    return tagsApi.getTags('domain');
  },

  // 获取主题标签
  getThemeTags: async (): Promise<Tag[]> => {
    return tagsApi.getTags('theme');
  },
};

// 健康检查
export const healthApi = {
  check: async (): Promise<boolean> => {
    try {
      const response = await api.get('/health');
      return response.data.success;
    } catch {
      return false;
    }
  },
};

// 统计相关 API
export const statsApi = {
  // 获取学习统计数据
  getStats: async () => {
    const response = await api.get('/stats');
    return response.data.data;
  },
};

// 搜索相关 API
export const searchApi = {
  // 高级搜索
  advancedSearch: async (params: any) => {
    const response = await api.get('/search', { params });
    return response.data.data;
  },
};

export default api;
