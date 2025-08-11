import express from 'express';
import { db } from '../database';
import { ApiResponse, NoteCard } from '../types';

const router = express.Router();

// 获取笔记卡片（可按书籍筛选）
router.get('/', async (req, res) => {
  try {
    const bookId = req.query.bookId as string;
    const noteCards = await db.getNoteCards(bookId);
    
    const response: ApiResponse<NoteCard[]> = {
      success: true,
      data: noteCards
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse<NoteCard[]> = {
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
      const response: ApiResponse<NoteCard> = {
        success: false,
        error: 'Book ID and title are required'
      };
      return res.status(400).json(response);
    }

    const noteCard = await db.createNoteCard({
      bookId,
      title,
      content: content || '',
      type: type || 'concept',
      tags: tags || [],
      pageNumber: pageNumber ? parseInt(pageNumber) : undefined,
      chapter: chapter || undefined,
      priority: priority || 'medium'
    });

    const response: ApiResponse<NoteCard> = {
      success: true,
      data: noteCard,
      message: 'Note card created successfully'
    };
    res.status(201).json(response);
  } catch (error) {
    const response: ApiResponse<NoteCard> = {
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
      const response: ApiResponse<NoteCard> = {
        success: false,
        error: 'Note ID is required'
      };
      return res.status(400).json(response);
    }

    if (!title) {
      const response: ApiResponse<NoteCard> = {
        success: false,
        error: 'Title is required'
      };
      return res.status(400).json(response);
    }

    const updatedNote = await db.updateNoteCard(id, {
      title,
      content: content || '',
      type: type || 'concept',
      tags: tags || [],
      pageNumber: pageNumber ? parseInt(pageNumber) : undefined,
      chapter: chapter || undefined,
      priority: priority || 'medium'
    });

    if (!updatedNote) {
      const response: ApiResponse<NoteCard> = {
        success: false,
        error: 'Note not found'
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<NoteCard> = {
      success: true,
      data: updatedNote,
      message: 'Note card updated successfully'
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse<NoteCard> = {
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
      const response: ApiResponse<null> = {
        success: false,
        error: 'Note ID is required'
      };
      return res.status(400).json(response);
    }

    const deleted = await db.deleteNoteCard(id);
    
    if (!deleted) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Note not found'
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<null> = {
      success: true,
      message: 'Note card deleted successfully'
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    res.status(500).json(response);
  }
});

export default router;
