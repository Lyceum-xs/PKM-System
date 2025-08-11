import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, FiPlus, FiEdit2, FiTrash2, FiBookmark, FiFileText, 
  FiTarget, FiBookOpen, FiSearch, FiFilter 
} from 'react-icons/fi';
import { Book, NoteCard, CreateNoteCardData } from '../../types';
import { notesApi } from '../../api';

interface NotesModalProps {
  isOpen: boolean;
  book: Book | null;
  onClose: () => void;
}

const NOTE_TYPES = [
  { value: 'concept', label: '💡 核心概念', icon: FiFileText, color: 'primary' },
  { value: 'quote', label: '📝 重要摘录', icon: FiBookmark, color: 'success' },
  { value: 'reflection', label: '🤔 个人思考', icon: FiEdit2, color: 'accent' },
  { value: 'application', label: '🎯 实际应用', icon: FiTarget, color: 'warning' },
  { value: 'summary', label: '📚 章节总结', icon: FiBookOpen, color: 'secondary' }
] as const;

const PRIORITY_LEVELS = [
  { value: 'low', label: '低', color: 'text-secondary-500' },
  { value: 'medium', label: '中', color: 'text-warning-600' },
  { value: 'high', label: '高', color: 'text-danger-600' }
] as const;

const NotesModal: React.FC<NotesModalProps> = ({ isOpen, book, onClose }) => {
  const [notes, setNotes] = useState<NoteCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteCard | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [formData, setFormData] = useState<CreateNoteCardData>({
    bookId: '',
    title: '',
    content: '',
    type: 'concept',
    tags: [],
    priority: 'medium'
  });

  useEffect(() => {
    if (book) {
      setFormData(prev => ({ ...prev, bookId: book.id }));
      loadNotes();
    }
  }, [book]);

  const loadNotes = async () => {
    if (!book) return;
    
    try {
      setLoading(true);
      const noteCards = await notesApi.getNotes(book.id);
      setNotes(noteCards);
    } catch (error) {
      console.error('加载笔记失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('请填写标题和内容');
      return;
    }

    try {
      setLoading(true);
      
      if (editingNote) {
        // 更新现有笔记
        const updatedNote = await notesApi.updateNote(editingNote.id, formData);
        setNotes(prev => prev.map(note => 
          note.id === editingNote.id ? updatedNote : note
        ));
        setEditingNote(null);
      } else {
        // 创建新笔记
        const newNote = await notesApi.createNote(formData);
        setNotes(prev => [newNote, ...prev]);
      }
      
      setFormData({
        bookId: book?.id || '',
        title: '',
        content: '',
        type: 'concept',
        tags: [],
        priority: 'medium'
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('保存笔记失败:', error);
      alert('保存笔记失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleEditNote = (note: NoteCard) => {
    setEditingNote(note);
    setFormData({
      bookId: note.bookId,
      title: note.title,
      content: note.content,
      type: note.type,
      tags: note.tags,
      pageNumber: note.pageNumber,
      chapter: note.chapter,
      priority: note.priority
    });
    setShowAddForm(true);
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setFormData({
      bookId: book?.id || '',
      title: '',
      content: '',
      type: 'concept',
      tags: [],
      priority: 'medium'
    });
    setShowAddForm(false);
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('确定要删除这条笔记吗？')) return;

    try {
      setLoading(true);
      const success = await notesApi.deleteNote(noteId);
      if (success) {
        setNotes(prev => prev.filter(note => note.id !== noteId));
      } else {
        alert('删除笔记失败，请稍后重试');
      }
    } catch (error) {
      console.error('删除笔记失败:', error);
      alert('删除笔记失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || note.type === filterType;
    return matchesSearch && matchesType;
  });

  const getNoteTypeInfo = (type: string) => {
    return NOTE_TYPES.find(t => t.value === type) || NOTE_TYPES[0];
  };

  if (!book) return null;

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
            {/* 模态框 */}
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
                <div className="flex items-center space-x-4">
                  <div>
                    <h2 className="text-2xl font-bold gradient-text mb-1">
                      📖 《{book.title}》的笔记
                    </h2>
                    <p className="text-sm text-secondary-600">
                      {book.author && `作者: ${book.author} | `}
                      共 {notes.length} 条笔记
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddForm(true)}
                    className="btn-primary px-4 py-2"
                  >
                    <FiPlus className="w-4 h-4 mr-2" />
                    添加笔记
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="btn-ghost p-3 rounded-full"
                  >
                    <FiX className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* 搜索和筛选 */}
              <div className="p-6 border-b border-secondary-200/50">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="relative flex-1">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" />
                    <input
                      type="text"
                      placeholder="搜索笔记标题或内容..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="input pl-10 w-full"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <FiFilter className="text-secondary-400" />
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="input w-auto"
                    >
                      <option value="all">所有类型</option>
                      {NOTE_TYPES.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* 笔记内容区 */}
              <div className="flex-1 overflow-auto p-6">
                {showAddForm && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card bg-gradient-to-r from-primary-50 to-accent-50 border-primary-200/50 mb-6"
                  >
                    <h3 className="text-lg font-bold text-secondary-800 mb-4">
                      {editingNote ? '✏️ 编辑笔记' : '✍️ 添加新笔记'}
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            笔记类型
                          </label>
                          <select
                            value={formData.type}
                            onChange={(e) => setFormData(prev => ({ 
                              ...prev, 
                              type: e.target.value as CreateNoteCardData['type'] 
                            }))}
                            className="input w-full"
                          >
                            {NOTE_TYPES.map(type => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            重要程度
                          </label>
                          <select
                            value={formData.priority}
                            onChange={(e) => setFormData(prev => ({ 
                              ...prev, 
                              priority: e.target.value as CreateNoteCardData['priority'] 
                            }))}
                            className="input w-full"
                          >
                            {PRIORITY_LEVELS.map(level => (
                              <option key={level.value} value={level.value}>
                                {level.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          笔记标题 *
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                          className="input w-full"
                          placeholder="输入笔记标题..."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          笔记内容 *
                        </label>
                        <textarea
                          value={formData.content}
                          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                          className="input w-full min-h-[120px] resize-y"
                          placeholder="输入笔记内容..."
                          rows={5}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            页码 (可选)
                          </label>
                          <input
                            type="number"
                            value={formData.pageNumber || ''}
                            onChange={(e) => setFormData(prev => ({ 
                              ...prev, 
                              pageNumber: e.target.value ? parseInt(e.target.value) : undefined 
                            }))}
                            className="input w-full"
                            placeholder="如: 123"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            章节 (可选)
                          </label>
                          <input
                            type="text"
                            value={formData.chapter || ''}
                            onChange={(e) => setFormData(prev => ({ 
                              ...prev, 
                              chapter: e.target.value || undefined 
                            }))}
                            className="input w-full"
                            placeholder="如: 第三章"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        onClick={handleCancelEdit}
                        className="btn-secondary"
                      >
                        取消
                      </button>
                      <button
                        onClick={handleAddNote}
                        disabled={loading || !formData.title.trim() || !formData.content.trim()}
                        className="btn-primary"
                      >
                        {loading ? '保存中...' : (editingNote ? '更新笔记' : '保存笔记')}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* 笔记列表 */}
                <div className="space-y-4">
                  {filteredNotes.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4 animate-bounce-subtle">📝</div>
                      <h3 className="text-xl font-bold text-secondary-700 mb-2">
                        {notes.length === 0 ? '还没有笔记' : '没有找到匹配的笔记'}
                      </h3>
                      <p className="text-secondary-600 mb-6">
                        {notes.length === 0 
                          ? '开始记录您的第一条学习笔记吧！' 
                          : '尝试调整搜索条件或筛选器'}
                      </p>
                      {notes.length === 0 && (
                        <button
                          onClick={() => setShowAddForm(true)}
                          className="btn-primary px-6 py-3"
                        >
                          <FiPlus className="w-4 h-4 mr-2" />
                          添加第一条笔记
                        </button>
                      )}
                    </div>
                  ) : (
                    filteredNotes.map((note, index) => {
                      const typeInfo = getNoteTypeInfo(note.type);
                      const Icon = typeInfo.icon;
                      
                      return (
                        <motion.div
                          key={note.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="card group relative"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg bg-${typeInfo.color}-100 text-${typeInfo.color}-700`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-secondary-800">
                                  {note.title}
                                </h4>
                                <div className="flex items-center space-x-2 text-xs text-secondary-500 mt-1">
                                  <span>{typeInfo.label}</span>
                                  <span>•</span>
                                  <span className={PRIORITY_LEVELS.find(p => p.value === note.priority)?.color}>
                                    {PRIORITY_LEVELS.find(p => p.value === note.priority)?.label}重要
                                  </span>
                                  {note.pageNumber && (
                                    <>
                                      <span>•</span>
                                      <span>第{note.pageNumber}页</span>
                                    </>
                                  )}
                                  {note.chapter && (
                                    <>
                                      <span>•</span>
                                      <span>{note.chapter}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleEditNote(note)}
                                className="btn-ghost p-2"
                                title="编辑"
                              >
                                <FiEdit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteNote(note.id)}
                                className="btn-ghost p-2 text-warning-600 hover:text-warning-700"
                                title="删除"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="text-secondary-700 text-sm leading-relaxed whitespace-pre-wrap">
                            {note.content}
                          </div>
                          
                          {note.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {note.tags.map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="px-2 py-1 text-xs bg-secondary-100 text-secondary-700 rounded-full"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          <div className="text-xs text-secondary-400 mt-3">
                            创建于 {new Date(note.createdAt).toLocaleString('zh-CN')}
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotesModal;
