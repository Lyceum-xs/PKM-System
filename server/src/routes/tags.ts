import express from 'express';
import { db } from '../database';
import { ApiResponse, Tag } from '../types';

const router = express.Router();

// 获取所有标签
router.get('/', async (req, res) => {
  try {
    const type = req.query.type as 'domain' | 'theme' | undefined;
    const tags = await db.getTags(type);
    
    const response: ApiResponse<Tag[]> = {
      success: true,
      data: tags
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse<Tag[]> = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    res.status(500).json(response);
  }
});

export default router;
