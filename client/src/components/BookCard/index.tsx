import React from 'react';
import { motion } from 'framer-motion';
import { Book } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { FiEdit2, FiTrash2, FiBookOpen, FiCalendar, FiUser, FiTag } from 'react-icons/fi';

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
  onViewNotes: (book: Book) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onEdit, onDelete, onViewNotes }) => {
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true, 
        locale: zhCN 
      });
    } catch {
      return '未知时间';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="card-premium group relative overflow-hidden"
    >
      {/* 背景装饰 */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-100/30 to-accent-100/30 rounded-full -translate-y-16 translate-x-16 transition-transform duration-500 group-hover:scale-150"></div>
      
      <div className="relative z-10">
        {/* 头部 */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 pr-4">
            <h3 className="text-xl font-bold text-secondary-900 mb-2 line-clamp-2 group-hover:text-primary-700 transition-colors duration-300">
              {book.title}
            </h3>
            {book.author && (
              <div className="flex items-center text-secondary-600 text-sm mb-2">
                <FiUser className="w-4 h-4 mr-2" />
                <span className="font-medium">{book.author}</span>
              </div>
            )}
            {book.description && (
              <p className="text-secondary-600 text-sm mb-3 line-clamp-3 leading-relaxed">
                {book.description}
              </p>
            )}
          </div>
          
          {/* 操作按钮 */}
          <div className="flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onEdit(book)}
              className="p-2 rounded-lg bg-primary-100 text-primary-700 hover:bg-primary-200 transition-colors"
              title="编辑"
            >
              <FiEdit2 className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onViewNotes(book)}
              className="p-2 rounded-lg bg-success-100 text-success-700 hover:bg-success-200 transition-colors"
              title="查看笔记"
            >
              <FiBookOpen className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(book.id)}
              className="p-2 rounded-lg bg-warning-100 text-warning-700 hover:bg-warning-200 transition-colors"
              title="删除"
            >
              <FiTrash2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* 标签区域 */}
        <div className="space-y-3 mb-4">
          {/* 领域标签 */}
          {book.domainTags && book.domainTags.length > 0 && (
            <div>
              <div className="flex items-center mb-2">
                <FiTag className="w-3 h-3 mr-1 text-primary-600" />
                <span className="text-xs font-semibold text-primary-700">领域</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {book.domainTags.map((tag, index) => (
                  <span key={index} className="tag-domain text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 主题标签 */}
          {book.themeTags && book.themeTags.length > 0 && (
            <div>
              <div className="flex items-center mb-2">
                <FiTag className="w-3 h-3 mr-1 text-success-600" />
                <span className="text-xs font-semibold text-success-700">主题</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {book.themeTags.map((tag, index) => (
                  <span key={index} className="tag-theme text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 底部操作区 */}
        <div className="pt-4 border-t border-secondary-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-secondary-500">
              <FiCalendar className="w-3 h-3 mr-1" />
              更新于 {formatDate(book.updatedAt)}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onViewNotes(book)}
              className="btn-ghost text-xs px-3 py-1.5"
            >
              <FiBookOpen className="w-3 h-3 mr-1" />
              笔记
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BookCard;
