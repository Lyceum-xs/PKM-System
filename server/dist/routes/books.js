"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("../database");
const router = express_1.default.Router();
// 获取所有书籍（支持搜索和筛选）
router.get('/', async (req, res) => {
    try {
        const params = {
            query: req.query.query,
            domainTags: req.query.domainTags ? req.query.domainTags.split(',') : undefined,
            themeTags: req.query.themeTags ? req.query.themeTags.split(',') : undefined,
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder,
            limit: req.query.limit ? parseInt(req.query.limit) : undefined,
            offset: req.query.offset ? parseInt(req.query.offset) : undefined
        };
        const books = await database_1.db.getBooks(params);
        const response = {
            success: true,
            data: books
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
// 获取单本书籍
router.get('/:id', async (req, res) => {
    try {
        const books = await database_1.db.getBooks({ query: '' });
        const book = books.find(b => b.id === req.params.id);
        if (!book) {
            const response = {
                success: false,
                error: 'Book not found'
            };
            return res.status(404).json(response);
        }
        const response = {
            success: true,
            data: book
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
// 创建新书籍
router.post('/', async (req, res) => {
    try {
        const { title, author, description, domainTags, themeTags } = req.body;
        if (!title) {
            const response = {
                success: false,
                error: 'Title is required'
            };
            return res.status(400).json(response);
        }
        const book = await database_1.db.createBook({
            title,
            author,
            description,
            domainTags: domainTags || [],
            themeTags: themeTags || []
        });
        const response = {
            success: true,
            data: book,
            message: 'Book created successfully'
        };
        res.status(201).json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
        res.status(500).json(response);
    }
});
// 更新书籍
router.put('/:id', async (req, res) => {
    try {
        const { title, author, description, domainTags, themeTags } = req.body;
        const updatedBook = await database_1.db.updateBook(req.params.id, {
            title,
            author,
            description,
            domainTags,
            themeTags
        });
        if (!updatedBook) {
            const response = {
                success: false,
                error: 'Book not found'
            };
            return res.status(404).json(response);
        }
        const response = {
            success: true,
            data: updatedBook,
            message: 'Book updated successfully'
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
// 删除书籍
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await database_1.db.deleteBook(req.params.id);
        if (!deleted) {
            const response = {
                success: false,
                error: 'Book not found'
            };
            return res.status(404).json(response);
        }
        const response = {
            success: true,
            message: 'Book deleted successfully'
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
