"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("../database");
const router = express_1.default.Router();
// 获取笔记卡片（可按书籍筛选）
router.get('/', async (req, res) => {
    try {
        const bookId = req.query.bookId;
        const noteCards = await database_1.db.getNoteCards(bookId);
        const response = {
            success: true,
            data: noteCards
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
// 创建新笔记卡片
router.post('/', async (req, res) => {
    try {
        const { bookId, title, content, type, tags, pageNumber, chapter, priority } = req.body;
        if (!bookId || !title) {
            const response = {
                success: false,
                error: 'Book ID and title are required'
            };
            return res.status(400).json(response);
        }
        const noteCard = await database_1.db.createNoteCard({
            bookId,
            title,
            content: content || '',
            type: type || 'concept',
            tags: tags || [],
            pageNumber: pageNumber ? parseInt(pageNumber) : undefined,
            chapter: chapter || undefined,
            priority: priority || 'medium'
        });
        const response = {
            success: true,
            data: noteCard,
            message: 'Note card created successfully'
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
// 更新笔记卡片
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, type, tags, pageNumber, chapter, priority } = req.body;
        if (!id) {
            const response = {
                success: false,
                error: 'Note ID is required'
            };
            return res.status(400).json(response);
        }
        if (!title) {
            const response = {
                success: false,
                error: 'Title is required'
            };
            return res.status(400).json(response);
        }
        const updatedNote = await database_1.db.updateNoteCard(id, {
            title,
            content: content || '',
            type: type || 'concept',
            tags: tags || [],
            pageNumber: pageNumber ? parseInt(pageNumber) : undefined,
            chapter: chapter || undefined,
            priority: priority || 'medium'
        });
        if (!updatedNote) {
            const response = {
                success: false,
                error: 'Note not found'
            };
            return res.status(404).json(response);
        }
        const response = {
            success: true,
            data: updatedNote,
            message: 'Note card updated successfully'
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
// 删除笔记卡片
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            const response = {
                success: false,
                error: 'Note ID is required'
            };
            return res.status(400).json(response);
        }
        const deleted = await database_1.db.deleteNoteCard(id);
        if (!deleted) {
            const response = {
                success: false,
                error: 'Note not found'
            };
            return res.status(404).json(response);
        }
        const response = {
            success: true,
            message: 'Note card deleted successfully'
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
