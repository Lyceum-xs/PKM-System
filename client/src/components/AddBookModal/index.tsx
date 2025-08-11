import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSave } from 'react-icons/fi';
import { CreateBookData } from '../../types';
import TagSelector from '../TagSelector';

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (book: CreateBookData) => Promise<void>;
}

const AddBookModal: React.FC<AddBookModalProps> = ({ isOpen, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateBookData>({
    title: '',
    author: '',
    description: '',
    domainTags: [],
    themeTags: []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('请输入书名');
      return;
    }

    try {
      setLoading(true);
      await onSave(formData);
      
      // 重置表单
      setFormData({
        title: '',
        author: '',
        description: '',
        domainTags: [],
        themeTags: []
      });
      
      onClose();
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    onClose();
  };

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
            onClick={handleClose}
          >
            {/* 模态框 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="card-premium w-full max-w-2xl max-h-[90vh] overflow-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 头部 */}
              <div className="flex items-center justify-between p-6 border-b border-secondary-200/50">
                <div>
                  <h2 className="text-2xl font-bold gradient-text mb-1">
                    📚 添加新书籍
                  </h2>
                  <p className="text-sm text-secondary-600">
                    构建您的双维度知识体系
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClose}
                  disabled={loading}
                  className="btn-ghost p-3 rounded-full"
                >
                  <FiX className="w-5 h-5" />
                </motion.button>
              </div>

              {/* 表单内容 */}
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-6">
                  {/* 基本信息 */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        书名 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="input w-full"
                        placeholder="请输入书名..."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        作者
                      </label>
                      <input
                        type="text"
                        value={formData.author}
                        onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                        className="input w-full"
                        placeholder="请输入作者姓名..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        描述
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="input w-full min-h-[100px] resize-y"
                        placeholder="请输入书籍描述..."
                        rows={4}
                      />
                    </div>
                  </div>

                  {/* 标签选择 */}
                  <div className="space-y-4">
                    <TagSelector
                      type="domain"
                      selectedTags={formData.domainTags}
                      onChange={(tags) => setFormData(prev => ({ ...prev, domainTags: tags }))}
                      label="领域标签"
                    />

                    <TagSelector
                      type="theme"
                      selectedTags={formData.themeTags}
                      onChange={(tags) => setFormData(prev => ({ ...prev, themeTags: tags }))}
                      label="主题标签"
                    />
                  </div>

                  {/* 使用提示 */}
                  <div className="card bg-gradient-to-r from-primary-50 via-white to-accent-50 border-primary-200/50">
                    <h4 className="text-sm font-bold text-primary-800 mb-3 flex items-center">
                      � 智能入库指南
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl mb-2">🎯</div>
                        <div className="text-xs font-semibold text-secondary-800 mb-1">Step 1</div>
                        <div className="text-xs text-secondary-600">选择1-2个核心领域标签</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl mb-2">🎨</div>
                        <div className="text-xs font-semibold text-secondary-800 mb-1">Step 2</div>
                        <div className="text-xs text-secondary-600">选择2-4个主题应用标签</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl mb-2">📝</div>
                        <div className="text-xs font-semibold text-secondary-800 mb-1">Step 3</div>
                        <div className="text-xs text-secondary-600">添加核心观点和笔记</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 底部按钮 */}
                <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-secondary-200/50">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    className="btn-secondary px-6 py-3"
                  >
                    取消
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={loading || !formData.title.trim()}
                    className="btn-primary px-8 py-3 flex items-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        保存中...
                      </>
                    ) : (
                      <>
                        <FiSave className="w-4 h-4 mr-2" />
                        保存书籍
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddBookModal;
