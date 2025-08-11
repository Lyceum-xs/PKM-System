import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiBookOpen, FiFileText, FiTrendingUp, FiCalendar,
  FiPieChart, FiBarChart, FiActivity
} from 'react-icons/fi';
import { statsApi } from '../../api';

interface ReadingStats {
  totalBooks: number;
  totalNotes: number;
  booksThisMonth: number;
  notesThisMonth: number;
  domainDistribution: { [key: string]: number };
  themeDistribution: { [key: string]: number };
  recentActivity: {
    date: string;
    books: number;
    notes: number;
  }[];
  noteTypeDistribution: { [key: string]: number };
  priorityDistribution: { [key: string]: number };
}

const StatsPanel: React.FC = () => {
  const [stats, setStats] = useState<ReadingStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await statsApi.getStats();
      setStats(data);
    } catch (error) {
      console.error('加载统计数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNoteTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      concept: '💡 核心概念',
      quote: '📝 重要摘录',
      reflection: '🤔 个人思考',
      application: '🎯 实际应用',
      summary: '📚 章节总结'
    };
    return labels[type] || type;
  };

  const getPriorityLabel = (priority: string) => {
    const labels: { [key: string]: string } = {
      low: '低重要性',
      medium: '中重要性',
      high: '高重要性'
    };
    return labels[priority] || priority;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-bold text-secondary-700 mb-2">
          暂无统计数据
        </h3>
        <p className="text-secondary-600">
          开始添加书籍和笔记来查看统计信息
        </p>
      </div>
    );
  }

  const topDomains = Object.entries(stats.domainDistribution)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const topThemes = Object.entries(stats.themeDistribution)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* 总体统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-primary-600">总书籍数</p>
              <p className="text-3xl font-bold text-primary-900">{stats.totalBooks}</p>
            </div>
            <div className="p-3 bg-primary-200 rounded-lg">
              <FiBookOpen className="w-6 h-6 text-primary-700" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card bg-gradient-to-br from-accent-50 to-accent-100 border-accent-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-accent-600">总笔记数</p>
              <p className="text-3xl font-bold text-accent-900">{stats.totalNotes}</p>
            </div>
            <div className="p-3 bg-accent-200 rounded-lg">
              <FiFileText className="w-6 h-6 text-accent-700" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card bg-gradient-to-br from-success-50 to-success-100 border-success-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-success-600">本月新书</p>
              <p className="text-3xl font-bold text-success-900">{stats.booksThisMonth}</p>
            </div>
            <div className="p-3 bg-success-200 rounded-lg">
              <FiTrendingUp className="w-6 h-6 text-success-700" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card bg-gradient-to-br from-warning-50 to-warning-100 border-warning-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-warning-600">本月新笔记</p>
              <p className="text-3xl font-bold text-warning-900">{stats.notesThisMonth}</p>
            </div>
            <div className="p-3 bg-warning-200 rounded-lg">
              <FiCalendar className="w-6 h-6 text-warning-700" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* 分布图表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 领域分布 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <div className="flex items-center mb-4">
            <FiPieChart className="w-5 h-5 text-primary-600 mr-2" />
            <h3 className="text-lg font-bold text-secondary-800">知识领域分布</h3>
          </div>
          
          <div className="space-y-3">
            {topDomains.length > 0 ? (
              topDomains.map(([domain, count], index) => {
                const percentage = Math.round((count / stats.totalBooks) * 100);
                return (
                  <div key={domain} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-secondary-700 flex-1">
                      {domain}
                    </span>
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="flex-1 bg-secondary-200 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                          className="bg-primary-500 h-2 rounded-full"
                        />
                      </div>
                      <span className="text-sm text-secondary-600 w-12 text-right">
                        {count}本
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-secondary-500 text-center py-4">暂无数据</p>
            )}
          </div>
        </motion.div>

        {/* 主题分布 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <div className="flex items-center mb-4">
            <FiBarChart className="w-5 h-5 text-accent-600 mr-2" />
            <h3 className="text-lg font-bold text-secondary-800">主题标签分布</h3>
          </div>
          
          <div className="space-y-3">
            {topThemes.length > 0 ? (
              topThemes.map(([theme, count], index) => {
                const percentage = Math.round((count / stats.totalBooks) * 100);
                return (
                  <div key={theme} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-secondary-700 flex-1">
                      {theme}
                    </span>
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="flex-1 bg-secondary-200 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                          className="bg-accent-500 h-2 rounded-full"
                        />
                      </div>
                      <span className="text-sm text-secondary-600 w-12 text-right">
                        {count}本
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-secondary-500 text-center py-4">暂无数据</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* 笔记统计 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 笔记类型分布 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <div className="flex items-center mb-4">
            <FiFileText className="w-5 h-5 text-success-600 mr-2" />
            <h3 className="text-lg font-bold text-secondary-800">笔记类型分布</h3>
          </div>
          
          <div className="space-y-3">
            {Object.entries(stats.noteTypeDistribution).length > 0 ? (
              Object.entries(stats.noteTypeDistribution)
                .sort(([,a], [,b]) => b - a)
                .map(([type, count], index) => {
                  const percentage = Math.round((count / stats.totalNotes) * 100);
                  return (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-secondary-700 flex-1">
                        {getNoteTypeLabel(type)}
                      </span>
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="flex-1 bg-secondary-200 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                            className="bg-success-500 h-2 rounded-full"
                          />
                        </div>
                        <span className="text-sm text-secondary-600 w-12 text-right">
                          {count}条
                        </span>
                      </div>
                    </div>
                  );
                })
            ) : (
              <p className="text-secondary-500 text-center py-4">暂无数据</p>
            )}
          </div>
        </motion.div>

        {/* 优先级分布 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card"
        >
          <div className="flex items-center mb-4">
            <FiActivity className="w-5 h-5 text-warning-600 mr-2" />
            <h3 className="text-lg font-bold text-secondary-800">重要程度分布</h3>
          </div>
          
          <div className="space-y-3">
            {Object.entries(stats.priorityDistribution).length > 0 ? (
              Object.entries(stats.priorityDistribution)
                .sort(([,a], [,b]) => b - a)
                .map(([priority, count], index) => {
                  const percentage = Math.round((count / stats.totalNotes) * 100);
                  const colors = {
                    high: 'bg-danger-500',
                    medium: 'bg-warning-500',
                    low: 'bg-success-500'
                  };
                  return (
                    <div key={priority} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-secondary-700 flex-1">
                        {getPriorityLabel(priority)}
                      </span>
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="flex-1 bg-secondary-200 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                            className={`${colors[priority as keyof typeof colors] || 'bg-secondary-500'} h-2 rounded-full`}
                          />
                        </div>
                        <span className="text-sm text-secondary-600 w-12 text-right">
                          {count}条
                        </span>
                      </div>
                    </div>
                  );
                })
            ) : (
              <p className="text-secondary-500 text-center py-4">暂无数据</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StatsPanel;
