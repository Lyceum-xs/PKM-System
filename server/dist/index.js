"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const books_1 = __importDefault(require("./routes/books"));
const notes_1 = __importDefault(require("./routes/notes"));
const tags_1 = __importDefault(require("./routes/tags"));
const stats_1 = __importDefault(require("./routes/stats"));
const search_1 = __importDefault(require("./routes/search"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// 中间件
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// 路由
app.use('/api/books', books_1.default);
app.use('/api/notes', notes_1.default);
app.use('/api/tags', tags_1.default);
app.use('/api/stats', stats_1.default);
app.use('/api/search', search_1.default);
// 健康检查
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: '双维度知识库系统 API 运行正常',
        timestamp: new Date().toISOString()
    });
});
// 错误处理中间件
app.use((err, req, res, next) => {
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
exports.default = app;
