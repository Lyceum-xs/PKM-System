import express from 'express';
import cors from 'cors';
import path from 'path';
import booksRouter from './routes/books';
import notesRouter from './routes/notes';
import tagsRouter from './routes/tags';
import statsRouter from './routes/stats';
import searchRouter from './routes/search';

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 在 Electron 环境中提供静态文件服务
if (process.env.NODE_ENV === 'production') {
  const clientPath = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientPath));
  
  // 对于非 API 路由，返回 index.html (支持 SPA 路由)
  app.get('/', (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });
}

// API 路由
app.use('/api/books', booksRouter);
app.use('/api/notes', notesRouter);
app.use('/api/tags', tagsRouter);
app.use('/api/stats', statsRouter);
app.use('/api/search', searchRouter);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: '双维度知识库系统 API 运行正常',
    timestamp: new Date().toISOString()
  });
});

// 错误处理中间件
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: '服务器内部错误'
  });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: '接口不存在'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 知识库服务器运行在 http://localhost:${PORT}`);
  console.log(`📚 API文档: http://localhost:${PORT}/api/health`);
});

export default app;
