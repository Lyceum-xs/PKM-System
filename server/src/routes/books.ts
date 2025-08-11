import express from 'express';
import { db } from '../database';
import { ApiResponse, Book, SearchParams } from '../types';

const router = express.Router();

// 获取所有书籍（支持搜索和筛选）
router.get('/', async (req, res) => {
  try {
    const params: SearchParams = {
      query: req.query.query as string,
      domainTags: req.query.domainTags ? (req.query.domainTags as string).split(',') : undefined,
      themeTags: req.query.themeTags ? (req.query.themeTags as string).split(',') : undefined,
      sortBy: req.query.sortBy as any,
      sortOrder: req.query.sortOrder as any,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset as string) : undefined
    };

    const books = await db.getBooks(params);
    const response: ApiResponse<Book[]> = {
      success: true,
      data: books
    };
    
    res.json(response);
  } catch (error) {
    const response: ApiResponse<Book[]> = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    res.status(500).json(response);
  }
});

// 获取单本书籍
router.get('/:id', async (req, res) => {
  try {
    const books = await db.getBooks({ query: '' });
    const book = books.find(b => b.id === req.params.id);
    
    if (!book) {
      const response: ApiResponse<Book> = {
        success: false,
        error: 'Book not found'
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<Book> = {
      success: true,
      data: book
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse<Book> = {
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
      const response: ApiResponse<Book> = {
        success: false,
        error: 'Title is required'
      };
      return res.status(400).json(response);
    }

    const book = await db.createBook({
      title,
      author,
      description,
      domainTags: domainTags || [],
      themeTags: themeTags || []
    });

    const response: ApiResponse<Book> = {
      success: true,
      data: book,
      message: 'Book created successfully'
    };
    res.status(201).json(response);
  } catch (error) {
    const response: ApiResponse<Book> = {
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
    
    const updatedBook = await db.updateBook(req.params.id, {
      title,
      author,
      description,
      domainTags,
      themeTags
    });

    if (!updatedBook) {
      const response: ApiResponse<Book> = {
        success: false,
        error: 'Book not found'
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<Book> = {
      success: true,
      data: updatedBook,
      message: 'Book updated successfully'
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse<Book> = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    res.status(500).json(response);
  }
});

// 删除书籍
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await db.deleteBook(req.params.id);
    
    if (!deleted) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Book not found'
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<null> = {
      success: true,
      message: 'Book deleted successfully'
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
