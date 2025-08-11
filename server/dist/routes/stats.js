"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("../database");
const router = express_1.default.Router();
// 获取学习统计数据
router.get('/', async (req, res) => {
    try {
        const books = await database_1.db.getBooks();
        const notes = await database_1.db.getNoteCards();
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        // 基础统计
        const totalBooks = books.length;
        const totalNotes = notes.length;
        // 本月新增
        const booksThisMonth = books.filter(book => new Date(book.createdAt) >= startOfMonth).length;
        const notesThisMonth = notes.filter(note => new Date(note.createdAt) >= startOfMonth).length;
        // 领域分布
        const domainDistribution = {};
        books.forEach(book => {
            book.domainTags.forEach(tag => {
                domainDistribution[tag] = (domainDistribution[tag] || 0) + 1;
            });
        });
        // 主题分布
        const themeDistribution = {};
        books.forEach(book => {
            book.themeTags.forEach(tag => {
                themeDistribution[tag] = (themeDistribution[tag] || 0) + 1;
            });
        });
        // 笔记类型分布
        const noteTypeDistribution = {};
        notes.forEach(note => {
            const type = note.type || 'concept';
            noteTypeDistribution[type] = (noteTypeDistribution[type] || 0) + 1;
        });
        // 重要程度分布
        const priorityDistribution = {};
        notes.forEach(note => {
            const priority = note.priority || 'medium';
            priorityDistribution[priority] = (priorityDistribution[priority] || 0) + 1;
        });
        // 最近30天活动
        const recentActivity = [];
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const dayBooks = books.filter(book => book.createdAt.startsWith(dateStr)).length;
            const dayNotes = notes.filter(note => note.createdAt.startsWith(dateStr)).length;
            recentActivity.push({
                date: dateStr,
                books: dayBooks,
                notes: dayNotes
            });
        }
        const stats = {
            totalBooks,
            totalNotes,
            booksThisMonth,
            notesThisMonth,
            domainDistribution,
            themeDistribution,
            recentActivity,
            noteTypeDistribution,
            priorityDistribution
        };
        const response = {
            success: true,
            data: stats
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
        res.status(500).json(response);
    }
});
exports.default = router;
