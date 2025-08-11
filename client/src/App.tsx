import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiSearch, FiFilter, FiGrid, FiList, FiTarget } from 'react-icons/fi';
import { Book, FilterState, CreateBookData } from './types';
import { booksApi, healthApi } from './api';
import BookCard from './components/BookCard';
import TagSelector from './components/TagSelector';
import BookCardSkeleton from './components/Skeletons/BookCardSkeleton';
import { useBooks } from './hooks/useBooks';

// 懒加载较大组件（模态 / 统计）
const AddBookModal = lazy(() => import('./components/AddBookModal'));
const NotesModal = lazy(() => import('./components/NotesModal'));
const StatsPanel = lazy(() => import('./components/StatsPanel'));
const AdvancedSearch = lazy(() => import('./components/AdvancedSearch'));

const App: React.FC = () => {
  // books 交给 React Query
  const [books, setBooks] = useState<Book[]>([]); // 保留本地以便过渡动画
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentView, setCurrentView] = useState<'books' | 'stats'>('books');
  const [showFilters, setShowFilters] = useState(false);
  const [isServerOnline, setIsServerOnline] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  
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

  const { data: queriedBooks, isLoading: booksLoading, error: booksError } = useBooks({ filters, enabled: isServerOnline });

  // 同步查询结果到本地 state 以便动画延迟
  useEffect(() => {
    if (queriedBooks) {
      setBooks(queriedBooks);
    }
  }, [queriedBooks]);

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

  // 错误合并
  useEffect(() => {
    if (booksError) {
      setError('获取书籍列表失败，请稍后重试');
    }
  }, [booksError]);

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
    if (!confirm('确定要删除这本书吗？此操作不可恢复。')) return;
    try {
      await booksApi.deleteBook(id);
      // 让 React Query 失效重新获取（简单方式：直接窗口聚焦或后续引入 queryClient.invalidateQueries）
    } catch (e) {
      console.error('删除失败:', e);
      alert('删除失败，请稍后重试');
    }
  };

  const handleViewNotes = (book: Book) => {
    setSelectedBook(book);
    setShowNotesModal(true);
  };

  const handleCreateBook = async (bookData: CreateBookData) => {
    await booksApi.createBook(bookData);
  };

  const hasActiveFilters = filters.searchQuery || 
    filters.selectedDomainTags.length > 0 || 
    filters.selectedThemeTags.length > 0;

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* 顶部导航 */}
        <header className="nav-glass sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center space-x-4">
                <div className="text-3xl animate-bounce-subtle">📚</div>
                <div>
                  <h1 className="text-2xl font-bold gradient-text">
                    双维度知识库
                  </h1>
                  <p className="text-sm text-secondary-600">
                    领域标签（What）+ 主题标签（Why & How）
                  </p>
                </div>
                {!isServerOnline && (
                  <span className="px-3 py-1.5 text-xs bg-gradient-to-r from-warning-100 to-warning-200 text-warning-700 rounded-full border border-warning-300/50 animate-pulse">
                    服务器离线
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex bg-white rounded-lg border border-secondary-200 p-1">
                  <button
                    onClick={() => setCurrentView('books')}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      currentView === 'books' 
                        ? 'bg-primary-50 text-primary-600' 
                        : 'text-secondary-600 hover:text-secondary-900'
                    }`}
                  >
                    📚 书籍
                  </button>
                  <button
                    onClick={() => setCurrentView('stats')}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      currentView === 'stats' 
                        ? 'bg-primary-50 text-primary-600' 
                        : 'text-secondary-600 hover:text-secondary-900'
                    }`}
                  >
                    📊 统计
                  </button>
                </div>
                
                <button
                  onClick={() => setShowAdvancedSearch(true)}
                  className="btn-ghost p-3"
                  title="高级搜索"
                >
                  <FiTarget className="w-5 h-5" />
                </button>
                
                {currentView === 'books' && (
                  <>
                    <button
                      onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                      className="btn-ghost p-3"
                      title={`切换到${viewMode === 'grid' ? '列表' : '网格'}视图`}
                    >
                      {viewMode === 'grid' ? <FiList className="w-5 h-5" /> : <FiGrid className="w-5 h-5" />}
                    </button>
                    
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`btn-ghost p-3 ${showFilters ? 'text-primary-600 bg-primary-50' : ''}`}
                      title="筛选"
                    >
                      <FiFilter className="w-5 h-5" />
                    </button>
                  </>
                )}
                
                <button className="btn-primary px-6 py-3" onClick={() => setShowAddModal(true)}>
                  <FiPlus className="w-4 h-4 mr-2" />
                  添加书籍
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
          {/* 条件渲染：书籍视图或统计视图 */}
          {currentView === 'stats' ? (
            <StatsPanel />
          ) : (
            <>
              {/* 搜索和筛选区域 */}
              <div className="mb-8 space-y-6">
                {/* 搜索框 */}
                <div className="flex justify-center animate-slide-up">
                  <div className="relative w-full max-w-2xl">
                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                    <input
                      type="text"
                      placeholder="搜索书名、作者或描述内容..."
                      value={filters.searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="input pl-12 w-full text-center text-lg h-14 shadow-lg hover:shadow-xl focus:shadow-xl"
                    />
                  </div>
                </div>

            {/* 统计信息 */}
            {books.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in" style={{animationDelay: '0.2s'}}>
                <div className="card-premium text-center">
                  <div className="text-3xl text-primary-600 font-bold">{books.length}</div>
                  <div className="text-secondary-600 font-medium">总书籍数</div>
                </div>
                <div className="card-premium text-center">
                  <div className="text-3xl text-success-600 font-bold">
                    {filters.searchQuery || filters.selectedDomainTags.length > 0 || filters.selectedThemeTags.length > 0 
                      ? books.length 
                      : books.length}
                  </div>
                  <div className="text-secondary-600 font-medium">当前显示</div>
                </div>
                <div className="card-premium text-center">
                  <div className="text-3xl text-accent-600 font-bold">
                    0
                  </div>
                  <div className="text-secondary-600 font-medium">总笔记数</div>
                </div>
              </div>
            )}

            {/* 筛选面板 */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="card-premium animate-slide-up"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TagSelector
                    type="domain"
                    selectedTags={filters.selectedDomainTags}
                    onChange={handleDomainTagsChange}
                    label="🎯 领域标签"
                    placeholder="选择知识领域..."
                  />
                  
                  <TagSelector
                    type="theme"
                    selectedTags={filters.selectedThemeTags}
                    onChange={handleThemeTagsChange}
                    label="🎨 主题标签"
                    placeholder="选择主题应用..."
                  />
                </div>

                <div className="flex justify-between items-center mt-6 pt-6 border-t border-secondary-200">
                  <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium text-secondary-700">排序方式:</label>
                    <select
                      value={`${filters.sortBy}-${filters.sortOrder}`}
                      onChange={(e) => {
                        const [sortBy, sortOrder] = e.target.value.split('-') as [FilterState['sortBy'], FilterState['sortOrder']];
                        handleSortChange(sortBy, sortOrder);
                      }}
                      className="input w-auto min-w-[160px]"
                    >
                      <option value="updatedAt-desc">🕒 最近更新</option>
                      <option value="createdAt-desc">📅 最近添加</option>
                      <option value="title-asc">🔤 标题 A-Z</option>
                      <option value="title-desc">🔡 标题 Z-A</option>
                    </select>
                  </div>

                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="btn-secondary text-sm px-6 py-2"
                    >
                      🔄 清除筛选
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* 内容区域 */}
          {error && (
            <div className="card bg-gradient-to-r from-warning-50 to-warning-100 border-warning-300 text-warning-800 mb-6 animate-fade-in">
              <div className="flex items-center">
                <div className="text-2xl mr-3">⚠️</div>
                <div className="flex-1">
                  <div className="font-semibold">连接问题</div>
                  <div className="text-sm opacity-90">{error}</div>
                </div>
                {!isServerOnline && (
                  <button
                    onClick={checkServerHealth}
                    className="btn-accent ml-4"
                  >
                    🔄 重试连接
                  </button>
                )}
              </div>
            </div>
          )}

          {booksLoading ? (
            <div className="flex justify-center items-center py-16 animate-fade-in">
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full' : 'space-y-6 w-full'}>
                {Array.from({ length: viewMode === 'grid' ? 8 : 6 }).map((_, i) => (
                  <BookCardSkeleton key={i} view={viewMode} />
                ))}
              </div>
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-16 animate-fade-in">
              <div className="mb-8">
                <div className="text-8xl mb-6 animate-bounce-subtle">
                  {hasActiveFilters ? '🔍' : '📚'}
                </div>
                <div className="max-w-md mx-auto card-premium">
                  <h3 className="text-2xl font-bold text-secondary-800 mb-3">
                    {hasActiveFilters ? '没有找到匹配的书籍' : '开始您的知识之旅'}
                  </h3>
                  <p className="text-secondary-600 mb-6 leading-relaxed">
                    {hasActiveFilters 
                      ? '尝试调整搜索条件或标签筛选，或者添加新的书籍来丰富您的知识库'
                      : '这里将成为您个人知识的宝库，添加第一本书开始记录您的学习历程吧！'
                    }
                  </p>
                  {!hasActiveFilters ? (
                    <button className="btn-primary px-8 py-4 text-lg" onClick={() => setShowAddModal(true)}>
                      <FiPlus className="w-5 h-5 mr-2" />
                      添加第一本书
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <button 
                        onClick={clearFilters}
                        className="btn-secondary px-6 py-3 w-full"
                      >
                        🔄 清除筛选条件
                      </button>
                      <button className="btn-primary px-6 py-3 w-full" onClick={() => setShowAddModal(true)}>
                        <FiPlus className="w-4 h-4 mr-2" />
                        添加新书籍
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-fade-in'
                : 'space-y-6 animate-fade-in'
            }>
              {books.map((book, index) => (
                <div 
                  key={book.id}
                  className="animate-scale-in"
                  style={{animationDelay: `${0.1 * index}s`}}
                >
                  <BookCard
                    book={book}
                    onEdit={handleEditBook}
                    onDelete={handleDeleteBook}
                    onViewNotes={handleViewNotes}
                  />
                </div>
              ))}
            </div>
          )}
            </>
          )}
        </main>

        {/* 添加书籍模态框 */}
        <Suspense fallback={null}>
          <AddBookModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSave={handleCreateBook}
          />
          <NotesModal
            isOpen={showNotesModal}
            book={selectedBook}
            onClose={() => {
              setShowNotesModal(false);
              setSelectedBook(null);
            }}
          />
          <AdvancedSearch
            isOpen={showAdvancedSearch}
            onClose={() => setShowAdvancedSearch(false)}
          />
        </Suspense>
      </div>
    </Router>
  );
};

export default App;
