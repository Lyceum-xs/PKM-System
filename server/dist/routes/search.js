"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("../database");
const router = express_1.default.Router();
// 高级搜索
router.get('/', async (req, res) => {
    try {
        const params = {
            query: req.query.query,
            searchIn: req.query.searchIn ? req.query.searchIn.split(',') : ['title', 'author', 'description', 'notes'],
            domainTags: req.query.domainTags ? req.query.domainTags.split(',') : undefined,
            themeTags: req.query.themeTags ? req.query.themeTags.split(',') : undefined,
            noteTypes: req.query.noteTypes ? req.query.noteTypes.split(',') : undefined,
            priorities: req.query.priorities ? req.query.priorities.split(',') : undefined,
            dateFrom: req.query.dateFrom,
            dateTo: req.query.dateTo,
            sortBy: req.query.sortBy || 'relevance',
            sortOrder: req.query.sortOrder || 'desc',
            limit: req.query.limit ? parseInt(req.query.limit) : undefined,
            offset: req.query.offset ? parseInt(req.query.offset) : undefined
        };
        const result = await performAdvancedSearch(params);
        const response = {
            success: true,
            data: result
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
async function performAdvancedSearch(params) {
    let books = await database_1.db.getBooks();
    let notes = await database_1.db.getNoteCards();
    const query = params.query?.toLowerCase();
    // 根据搜索字段筛选书籍
    if (query && params.searchIn) {
        books = books.filter(book => {
            if (params.searchIn.includes('title') && book.title.toLowerCase().includes(query))
                return true;
            if (params.searchIn.includes('author') && book.author?.toLowerCase().includes(query))
                return true;
            if (params.searchIn.includes('description') && book.description?.toLowerCase().includes(query))
                return true;
            return false;
        });
    }
    // 根据搜索字段筛选笔记
    if (query && params.searchIn?.includes('notes')) {
        notes = notes.filter(note => note.title.toLowerCase().includes(query) ||
            note.content.toLowerCase().includes(query));
        // 如果搜索笔记，也包含对应的书籍
        const noteBookIds = new Set(notes.map(note => note.bookId));
        const allBooks = await database_1.db.getBooks();
        const notesBooks = allBooks.filter(book => noteBookIds.has(book.id));
        // 合并书籍结果，去重
        const bookIds = new Set(books.map(book => book.id));
        notesBooks.forEach(book => {
            if (!bookIds.has(book.id)) {
                books.push(book);
            }
        });
    }
    // 应用标签筛选
    if (params.domainTags && params.domainTags.length > 0) {
        books = books.filter(book => params.domainTags.some(tag => book.domainTags.includes(tag)));
    }
    if (params.themeTags && params.themeTags.length > 0) {
        books = books.filter(book => params.themeTags.some(tag => book.themeTags.includes(tag)));
    }
    // 应用笔记类型筛选
    if (params.noteTypes && params.noteTypes.length > 0) {
        notes = notes.filter(note => params.noteTypes.includes(note.type || 'concept'));
    }
    // 应用优先级筛选
    if (params.priorities && params.priorities.length > 0) {
        notes = notes.filter(note => params.priorities.includes(note.priority || 'medium'));
    }
    // 应用日期筛选
    if (params.dateFrom) {
        const fromDate = new Date(params.dateFrom);
        books = books.filter(book => new Date(book.createdAt) >= fromDate);
        notes = notes.filter(note => new Date(note.createdAt) >= fromDate);
    }
    if (params.dateTo) {
        const toDate = new Date(params.dateTo);
        toDate.setHours(23, 59, 59, 999); // 包含整天
        books = books.filter(book => new Date(book.createdAt) <= toDate);
        notes = notes.filter(note => new Date(note.createdAt) <= toDate);
    }
    // 应用排序
    if (params.sortBy && params.sortBy !== 'relevance') {
        const sortOrder = params.sortOrder || 'desc';
        books.sort((a, b) => {
            let aValue = a[params.sortBy];
            let bValue = b[params.sortBy];
            if (params.sortBy === 'title') {
                aValue = aValue?.toLowerCase() || '';
                bValue = bValue?.toLowerCase() || '';
            }
            else {
                aValue = new Date(aValue).getTime();
                bValue = new Date(bValue).getTime();
            }
            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            }
            else {
                return aValue < bValue ? 1 : -1;
            }
        });
        notes.sort((a, b) => {
            let aValue = a[params.sortBy];
            let bValue = b[params.sortBy];
            if (params.sortBy === 'title') {
                aValue = aValue?.toLowerCase() || '';
                bValue = bValue?.toLowerCase() || '';
            }
            else {
                aValue = new Date(aValue).getTime();
                bValue = new Date(bValue).getTime();
            }
            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            }
            else {
                return aValue < bValue ? 1 : -1;
            }
        });
    }
    // 应用分页
    const total = books.length + notes.length;
    if (params.offset || params.limit) {
        const offset = params.offset || 0;
        const limit = params.limit || 50;
        // 简单实现：先对books分页，如果还有空间再对notes分页
        const booksSlice = books.slice(offset, offset + limit);
        const remainingLimit = limit - booksSlice.length;
        const notesOffset = Math.max(0, offset - books.length);
        const notesSlice = remainingLimit > 0 ? notes.slice(notesOffset, notesOffset + remainingLimit) : [];
        books = booksSlice;
        notes = notesSlice;
    }
    return {
        books,
        notes,
        total
    };
}
exports.default = router;
