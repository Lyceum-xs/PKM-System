import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBook, FiPlus, FiSearch, FiFilter, FiGrid, FiList } from 'react-icons/fi';
import { Book, FilterState, CreateBookData } from './types';
import { booksApi, healthApi } from './api';
import BookCard from './components/BookCard';
import TagSelector from './components/TagSelector';
import AddBookModal from './components/AddBookModal';

const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [isServerOnline, setIsServerOnline] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedDomainTags: [],
    selectedThemeTags: [],
    sortBy: 'updatedAt',
    sortOrder: 'desc'
  });

  // 检查服务器状态
  useEffect(() => {
    checkServerHealth();
  }, []);

  // 加载书籍数据
  useEffect(() => {
    if (isServerOnline) {
      fetchBooks();
    }
  }, [filters, isServerOnline]);

  const checkServerHealth = async () => {
    try {
      const isOnline = await healthApi.check();
      setIsServerOnline(isOnline);
      if (!isOnline) {
        setError('无法连接到服务器，请确保后端服务正在运行');
      }
    } catch {
      setIsServerOnline(false);
      setError('无法连接到服务器，请确保后端服务正在运行');
    }
  };

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const searchParams = {
        query: filters.searchQuery || undefined,
        domainTags: filters.selectedDomainTags.length > 0 ? filters.selectedDomainTags : undefined,
        themeTags: filters.selectedThemeTags.length > 0 ? filters.selectedThemeTags : undefined,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      };

      const data = await booksApi.getBooks(searchParams);
      setBooks(data);
    } catch (error) {
      console.error('获取书籍失败:', error);
      setError('获取书籍列表失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  };

  const handleDomainTagsChange = (tags: string[]) => {
    setFilters(prev => ({ ...prev, selectedDomainTags: tags }));
  };

  const handleThemeTagsChange = (tags: string[]) => {
    setFilters(prev => ({ ...prev, selectedThemeTags: tags }));
  };

  const handleSortChange = (sortBy: FilterState['sortBy'], sortOrder: FilterState['sortOrder']) => {
    setFilters(prev => ({ ...prev, sortBy, sortOrder }));
  };

  const clearFilters = () => {
    setFilters({
      searchQuery: '',
      selectedDomainTags: [],
      selectedThemeTags: [],
      sortBy: 'updatedAt',
      sortOrder: 'desc'
    });
  };

  const handleEditBook = (book: Book) => {
    // TODO: 实现编辑功能
    console.log('编辑书籍:', book);
  };

  const handleDeleteBook = async (id: string) => {
    if (!confirm('确定要删除这本书吗？此操作不可恢复。')) {
      return;
    }

    try {
      await booksApi.deleteBook(id);
      await fetchBooks(); // 重新加载列表
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败，请稍后重试');
    }
  };

  const handleViewNotes = (book: Book) => {
    // TODO: 实现查看笔记功能
    console.log('查看笔记:', book);
  };

  const handleCreateBook = async (bookData: CreateBookData) => {
    await booksApi.createBook(bookData);
    await fetchBooks(); // 重新加载列表
  };

  const hasActiveFilters = filters.searchQuery || 
    filters.selectedDomainTags.length > 0 || 
    filters.selectedThemeTags.length > 0;

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* 顶部导航 */}
        <header className="bg-white shadow-sm border-b border-secondary-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <FiBook className="w-8 h-8 text-primary-600" />
                <h1 className="text-xl font-bold text-secondary-900">
                  双维度知识库
                </h1>
                {!isServerOnline && (
                  <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">
                    服务器离线
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="btn-ghost p-2"
                  title={`切换到${viewMode === 'grid' ? '列表' : '网格'}视图`}
                >
                  {viewMode === 'grid' ? <FiList className="w-5 h-5" /> : <FiGrid className="w-5 h-5" />}
                </button>
                
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`btn-ghost p-2 ${showFilters ? 'text-primary-600' : ''}`}
                  title="筛选"
                >
                  <FiFilter className="w-5 h-5" />
                </button>
                
                <button className="btn-primary" onClick={() => setShowAddModal(true)}>
                  <FiPlus className="w-4 h-4 mr-2" />
                  添加书籍
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 搜索和筛选区域 */}
          <div className="mb-8 space-y-4">
            {/* 搜索框 */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 w-4 h-4 text-secondary-400" />
              <input
                type="text"
                placeholder="搜索书名、作者或描述..."
                value={filters.searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="input pl-10 w-full max-w-md"
              />
            </div>

            {/* 筛选面板 */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="card animate-slide-up"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TagSelector
                    type="domain"
                    selectedTags={filters.selectedDomainTags}
                    onChange={handleDomainTagsChange}
                    label="领域标签"
                    placeholder="选择领域..."
                  />
                  
                  <TagSelector
                    type="theme"
                    selectedTags={filters.selectedThemeTags}
                    onChange={handleThemeTagsChange}
                    label="主题标签"
                    placeholder="选择主题..."
                  />
                </div>

                <div className="flex justify-between items-center mt-6 pt-4 border-t border-secondary-200">
                  <div className="flex items-center space-x-4">
                    <select
                      value={`${filters.sortBy}-${filters.sortOrder}`}
                      onChange={(e) => {
                        const [sortBy, sortOrder] = e.target.value.split('-') as [FilterState['sortBy'], FilterState['sortOrder']];
                        handleSortChange(sortBy, sortOrder);
                      }}
                      className="input w-auto"
                    >
                      <option value="updatedAt-desc">最近更新</option>
                      <option value="createdAt-desc">最近添加</option>
                      <option value="title-asc">标题 A-Z</option>
                      <option value="title-desc">标题 Z-A</option>
                    </select>
                  </div>

                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="btn-ghost text-sm"
                    >
                      清除筛选
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* 内容区域 */}
          {error && (
            <div className="card bg-red-50 border-red-200 text-red-700 mb-6">
              <div className="flex items-center">
                <div className="flex-1">{error}</div>
                {!isServerOnline && (
                  <button
                    onClick={checkServerHealth}
                    className="btn-secondary ml-4"
                  >
                    重试连接
                  </button>
                )}
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-3 text-secondary-600">加载中...</span>
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-12">
              <FiBook className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">
                {hasActiveFilters ? '没有找到匹配的书籍' : '还没有添加任何书籍'}
              </h3>
              <p className="text-secondary-600 mb-6">
                {hasActiveFilters 
                  ? '试试调整筛选条件或清除筛选'
                  : '开始构建您的双维度知识库吧！'
                }
              </p>
              {!hasActiveFilters && (
                <button className="btn-primary" onClick={() => setShowAddModal(true)}>
                  <FiPlus className="w-4 h-4 mr-2" />
                  添加第一本书
                </button>
              )}
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }>
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onEdit={handleEditBook}
                  onDelete={handleDeleteBook}
                  onViewNotes={handleViewNotes}
                />
              ))}
            </div>
          )}
        </main>

        {/* 添加书籍模态框 */}
        <AddBookModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleCreateBook}
        />
      </div>
    </Router>
  );
};

export default App;
