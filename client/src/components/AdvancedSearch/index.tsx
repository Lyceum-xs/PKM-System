import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, FiCalendar, FiBookOpen, FiFileText,
  FiX, FiSliders, FiClock, FiTag
} from 'react-icons/fi';
import { Book, NoteCard, Tag } from '../../types';
import { searchApi, tagsApi } from '../../api';
import BookCard from '../BookCard';

interface SearchResult {
  books: Book[];
  notes: NoteCard[];
  total: number;
}

interface AdvancedSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ isOpen, onClose }) => {
  const [searchParams, setSearchParams] = useState({
    query: '',
    searchIn: ['title', 'author', 'description', 'notes'] as string[],
    domainTags: [] as string[],
    themeTags: [] as string[],
    noteTypes: [] as string[],
    priorities: [] as string[],
    dateFrom: '',
    dateTo: '',
    sortBy: 'relevance' as string,
    sortOrder: 'desc' as string
  });

  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const NOTE_TYPES = [
    { value: 'concept', label: '💡 核心概念' },
    { value: 'quote', label: '📝 重要摘录' },
    { value: 'reflection', label: '🤔 个人思考' },
    { value: 'application', label: '🎯 实际应用' },
    { value: 'summary', label: '📚 章节总结' }
  ];

  const PRIORITIES = [
    { value: 'low', label: '低重要性' },
    { value: 'medium', label: '中重要性' },
    { value: 'high', label: '高重要性' }
  ];

  const SEARCH_IN_OPTIONS = [
    { value: 'title', label: '书名' },
    { value: 'author', label: '作者' },
    { value: 'description', label: '描述' },
    { value: 'notes', label: '笔记内容' }
  ];

  useEffect(() => {
    if (isOpen) {
      loadTags();
    }
  }, [isOpen]);

  const loadTags = async () => {
    try {
      const tags = await tagsApi.getTags();
      setAllTags(tags);
    } catch (error) {
      console.error('加载标签失败:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchParams.query.trim() && 
        searchParams.domainTags.length === 0 && 
        searchParams.themeTags.length === 0) {
      return;
    }

    try {
      setLoading(true);
      const results = await searchApi.advancedSearch({
        ...searchParams,
        searchIn: searchParams.searchIn.join(','),
        domainTags: searchParams.domainTags.join(','),
        themeTags: searchParams.themeTags.join(','),
        noteTypes: searchParams.noteTypes.join(','),
        priorities: searchParams.priorities.join(',')
      });
      setResults(results);
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTagToggle = (tag: string, type: 'domain' | 'theme') => {
    const key = type === 'domain' ? 'domainTags' : 'themeTags';
    setSearchParams(prev => ({
      ...prev,
      [key]: prev[key].includes(tag) 
        ? prev[key].filter(t => t !== tag)
        : [...prev[key], tag]
    }));
  };

  const handleMultiSelectToggle = (value: string, key: 'searchIn' | 'noteTypes' | 'priorities') => {
    setSearchParams(prev => ({
      ...prev,
      [key]: prev[key].includes(value) 
        ? prev[key].filter(v => v !== value)
        : [...prev[key], value]
    }));
  };

  const clearAllFilters = () => {
    setSearchParams({
      query: '',
      searchIn: ['title', 'author', 'description', 'notes'],
      domainTags: [],
      themeTags: [],
      noteTypes: [],
      priorities: [],
      dateFrom: '',
      dateTo: '',
      sortBy: 'relevance',
      sortOrder: 'desc'
    });
    setResults(null);
  };

  const domainTags = allTags.filter(tag => tag.type === 'domain');
  const themeTags = allTags.filter(tag => tag.type === 'theme');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* 搜索面板 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="card-premium w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 头部 */}
              <div className="flex items-center justify-between p-6 border-b border-secondary-200/50">
                <div className="flex items-center space-x-3">
                  <FiSearch className="w-6 h-6 text-primary-600" />
                  <h2 className="text-2xl font-bold gradient-text">高级搜索</h2>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`btn-ghost p-3 rounded-full ${showFilters ? 'bg-primary-100' : ''}`}
                  >
                    <FiSliders className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={onClose}
                    className="btn-ghost p-3 rounded-full"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* 搜索表单 */}
              <div className="p-6 border-b border-secondary-200/50">
                {/* 主搜索框 */}
                <div className="flex space-x-3 mb-4">
                  <div className="relative flex-1">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" />
                    <input
                      type="text"
                      placeholder="输入搜索关键词..."
                      value={searchParams.query}
                      onChange={(e) => setSearchParams(prev => ({ ...prev, query: e.target.value }))}
                      className="input pl-10 w-full"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  
                  <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="btn-primary px-6"
                  >
                    {loading ? '搜索中...' : '搜索'}
                  </button>
                  
                  <button
                    onClick={clearAllFilters}
                    className="btn-secondary px-4"
                  >
                    清空
                  </button>
                </div>

                {/* 高级筛选 */}
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      {/* 搜索范围 */}
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          搜索范围
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {SEARCH_IN_OPTIONS.map(option => (
                            <button
                              key={option.value}
                              onClick={() => handleMultiSelectToggle(option.value, 'searchIn')}
                              className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                                searchParams.searchIn.includes(option.value)
                                  ? 'bg-primary-100 border-primary-300 text-primary-700'
                                  : 'bg-white border-secondary-300 text-secondary-700 hover:border-primary-300'
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 日期范围 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            <FiCalendar className="w-4 h-4 inline mr-1" />
                            开始日期
                          </label>
                          <input
                            type="date"
                            value={searchParams.dateFrom}
                            onChange={(e) => setSearchParams(prev => ({ ...prev, dateFrom: e.target.value }))}
                            className="input w-full"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            <FiCalendar className="w-4 h-4 inline mr-1" />
                            结束日期
                          </label>
                          <input
                            type="date"
                            value={searchParams.dateTo}
                            onChange={(e) => setSearchParams(prev => ({ ...prev, dateTo: e.target.value }))}
                            className="input w-full"
                          />
                        </div>
                      </div>

                      {/* 排序 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            排序方式
                          </label>
                          <select
                            value={searchParams.sortBy}
                            onChange={(e) => setSearchParams(prev => ({ ...prev, sortBy: e.target.value }))}
                            className="input w-full"
                          >
                            <option value="relevance">相关性</option>
                            <option value="createdAt">创建时间</option>
                            <option value="updatedAt">更新时间</option>
                            <option value="title">标题</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            排序顺序
                          </label>
                          <select
                            value={searchParams.sortOrder}
                            onChange={(e) => setSearchParams(prev => ({ ...prev, sortOrder: e.target.value }))}
                            className="input w-full"
                          >
                            <option value="desc">降序</option>
                            <option value="asc">升序</option>
                          </select>
                        </div>
                      </div>

                      {/* 领域标签 */}
                      {domainTags.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            <FiTag className="w-4 h-4 inline mr-1" />
                            知识领域
                          </label>
                          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                            {domainTags.map(tag => (
                              <button
                                key={tag.id}
                                onClick={() => handleTagToggle(tag.name, 'domain')}
                                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                                  searchParams.domainTags.includes(tag.name)
                                    ? 'bg-primary-100 border-primary-300 text-primary-700'
                                    : 'bg-white border-secondary-300 text-secondary-700 hover:border-primary-300'
                                }`}
                              >
                                {tag.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 主题标签 */}
                      {themeTags.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            <FiTag className="w-4 h-4 inline mr-1" />
                            主题标签
                          </label>
                          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                            {themeTags.map(tag => (
                              <button
                                key={tag.id}
                                onClick={() => handleTagToggle(tag.name, 'theme')}
                                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                                  searchParams.themeTags.includes(tag.name)
                                    ? 'bg-accent-100 border-accent-300 text-accent-700'
                                    : 'bg-white border-secondary-300 text-secondary-700 hover:border-accent-300'
                                }`}
                              >
                                {tag.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 笔记类型 */}
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          笔记类型
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {NOTE_TYPES.map(type => (
                            <button
                              key={type.value}
                              onClick={() => handleMultiSelectToggle(type.value, 'noteTypes')}
                              className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                                searchParams.noteTypes.includes(type.value)
                                  ? 'bg-success-100 border-success-300 text-success-700'
                                  : 'bg-white border-secondary-300 text-secondary-700 hover:border-success-300'
                              }`}
                            >
                              {type.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 重要程度 */}
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          重要程度
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {PRIORITIES.map(priority => (
                            <button
                              key={priority.value}
                              onClick={() => handleMultiSelectToggle(priority.value, 'priorities')}
                              className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                                searchParams.priorities.includes(priority.value)
                                  ? 'bg-warning-100 border-warning-300 text-warning-700'
                                  : 'bg-white border-secondary-300 text-secondary-700 hover:border-warning-300'
                              }`}
                            >
                              {priority.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 搜索结果 */}
              <div className="flex-1 overflow-auto p-6">
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                  </div>
                ) : results ? (
                  <div className="space-y-6">
                    {/* 结果统计 */}
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-secondary-800">
                        搜索结果 (共 {results.total} 项)
                      </h3>
                      
                      <div className="flex items-center space-x-4 text-sm text-secondary-600">
                        {results.books.length > 0 && (
                          <span>
                            <FiBookOpen className="w-4 h-4 inline mr-1" />
                            {results.books.length} 本书籍
                          </span>
                        )}
                        {results.notes.length > 0 && (
                          <span>
                            <FiFileText className="w-4 h-4 inline mr-1" />
                            {results.notes.length} 条笔记
                          </span>
                        )}
                      </div>
                    </div>

                    {results.total === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-bold text-secondary-700 mb-2">
                          没有找到匹配的结果
                        </h3>
                        <p className="text-secondary-600">
                          尝试调整搜索关键词或筛选条件
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* 书籍结果 */}
                        {results.books.length > 0 && (
                          <div>
                            <h4 className="text-md font-semibold text-secondary-700 mb-3 flex items-center">
                              <FiBookOpen className="w-4 h-4 mr-2" />
                              书籍 ({results.books.length})
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {results.books.map(book => (
                                <BookCard 
                                  key={book.id} 
                                  book={book}
                                  onEdit={() => {}}
                                  onDelete={() => {}}
                                  onViewNotes={() => {}}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 笔记结果 */}
                        {results.notes.length > 0 && (
                          <div>
                            <h4 className="text-md font-semibold text-secondary-700 mb-3 flex items-center">
                              <FiFileText className="w-4 h-4 mr-2" />
                              笔记 ({results.notes.length})
                            </h4>
                            <div className="space-y-3">
                              {results.notes.map(note => (
                                <motion.div
                                  key={note.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="card p-4"
                                >
                                  <div className="flex items-start justify-between mb-2">
                                    <h5 className="font-medium text-secondary-800">
                                      {note.title}
                                    </h5>
                                    <span className="text-xs text-secondary-500">
                                      <FiClock className="w-3 h-3 inline mr-1" />
                                      {new Date(note.createdAt).toLocaleDateString('zh-CN')}
                                    </span>
                                  </div>
                                  <p className="text-sm text-secondary-600 line-clamp-2 mb-2">
                                    {note.content}
                                  </p>
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-secondary-500">
                                      类型: {NOTE_TYPES.find(t => t.value === note.type)?.label || note.type}
                                    </span>
                                    <span className="text-secondary-500">
                                      重要性: {PRIORITIES.find(p => p.value === note.priority)?.label || note.priority}
                                    </span>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-bold text-secondary-700 mb-2">
                      开始高级搜索
                    </h3>
                    <p className="text-secondary-600">
                      输入关键词或设置筛选条件来搜索书籍和笔记
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AdvancedSearch;
