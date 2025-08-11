import * as fs from 'fs-extra';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Book, NoteCard, Tag, SearchParams, DOMAIN_TAGS, THEME_TAGS } from './types';

class FileDatabase {
  private dataDir: string;
  private booksFile: string;
  private notesFile: string;
  private tagsFile: string;

  constructor(dataDir: string = './data') {
    this.dataDir = dataDir;
    this.booksFile = path.join(dataDir, 'books.json');
    this.notesFile = path.join(dataDir, 'notes.json');
    this.tagsFile = path.join(dataDir, 'tags.json');
    this.initFiles();
  }

  private async initFiles() {
    // 确保数据目录存在
    await fs.ensureDir(this.dataDir);

    // 初始化书籍文件
    if (!await fs.pathExists(this.booksFile)) {
      await fs.writeJson(this.booksFile, []);
    }

    // 初始化笔记文件
    if (!await fs.pathExists(this.notesFile)) {
      await fs.writeJson(this.notesFile, []);
    }

    // 初始化标签文件
    if (!await fs.pathExists(this.tagsFile)) {
      await this.initDefaultTags();
    }
  }

  private async initDefaultTags() {
    const tags: Tag[] = [];
    const now = new Date().toISOString();
    
    // 插入领域标签
    Object.entries(DOMAIN_TAGS).forEach(([category, subTags]) => {
      // 插入主分类
      tags.push({
        id: uuidv4(),
        name: category,
        type: 'domain',
        category: undefined,
        createdAt: now
      });
      
      // 插入子标签
      subTags.forEach(tag => {
        tags.push({
          id: uuidv4(),
          name: tag,
          type: 'domain',
          category: category,
          createdAt: now
        });
      });
    });

    // 插入主题标签
    Object.entries(THEME_TAGS).forEach(([category, subTags]) => {
      // 插入主分类
      tags.push({
        id: uuidv4(),
        name: category,
        type: 'theme',
        category: undefined,
        createdAt: now
      });
      
      // 插入子标签
      subTags.forEach(tag => {
        tags.push({
          id: uuidv4(),
          name: tag,
          type: 'theme',
          category: category,
          createdAt: now
        });
      });
    });

    await fs.writeJson(this.tagsFile, tags);
  }

  // 书籍相关操作
  async createBook(book: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Promise<Book> {
    const books = await this.getBooks();
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const newBook: Book = {
      ...book,
      id,
      createdAt: now,
      updatedAt: now
    };

    books.push(newBook);
    await fs.writeJson(this.booksFile, books, { spaces: 2 });
    
    return newBook;
  }

  async getBooks(params: SearchParams = {}): Promise<Book[]> {
    let books: Book[] = [];
    
    try {
      books = await fs.readJson(this.booksFile);
    } catch {
      books = [];
    }

    // 应用搜索筛选
    if (params.query) {
      const query = params.query.toLowerCase();
      books = books.filter(book => 
        book.title.toLowerCase().includes(query) ||
        (book.author && book.author.toLowerCase().includes(query)) ||
        (book.description && book.description.toLowerCase().includes(query))
      );
    }

    // 应用领域标签筛选
    if (params.domainTags && params.domainTags.length > 0) {
      books = books.filter(book => 
        params.domainTags!.some(tag => book.domainTags.includes(tag))
      );
    }

    // 应用主题标签筛选
    if (params.themeTags && params.themeTags.length > 0) {
      books = books.filter(book => 
        params.themeTags!.some(tag => book.themeTags.includes(tag))
      );
    }

    // 应用排序
    const sortBy = params.sortBy || 'updatedAt';
    const sortOrder = params.sortOrder || 'desc';
    
    books.sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];
      
      if (sortBy === 'title') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      } else {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    // 应用分页
    if (params.limit) {
      const offset = params.offset || 0;
      books = books.slice(offset, offset + params.limit);
    }

    return books;
  }

  async updateBook(id: string, updates: Partial<Book>): Promise<Book | null> {
    const books = await this.getBooks();
    const bookIndex = books.findIndex(book => book.id === id);
    
    if (bookIndex === -1) {
      return null;
    }

    const updatedBook = {
      ...books[bookIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    books[bookIndex] = updatedBook;
    await fs.writeJson(this.booksFile, books, { spaces: 2 });
    
    return updatedBook;
  }

  async deleteBook(id: string): Promise<boolean> {
    const books = await this.getBooks();
    const bookIndex = books.findIndex(book => book.id === id);
    
    if (bookIndex === -1) {
      return false;
    }

    books.splice(bookIndex, 1);
    await fs.writeJson(this.booksFile, books, { spaces: 2 });
    
    // 同时删除相关的笔记
    const notes = await this.getNoteCards();
    const filteredNotes = notes.filter(note => note.bookId !== id);
    await fs.writeJson(this.notesFile, filteredNotes, { spaces: 2 });
    
    return true;
  }

  // 笔记卡片相关操作
  async createNoteCard(noteCard: Omit<NoteCard, 'id' | 'createdAt' | 'updatedAt'>): Promise<NoteCard> {
    const notes = await this.getNoteCards();
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const newNoteCard: NoteCard = {
      ...noteCard,
      id,
      createdAt: now,
      updatedAt: now
    };

    notes.push(newNoteCard);
    await fs.writeJson(this.notesFile, notes, { spaces: 2 });
    
    return newNoteCard;
  }

  async getNoteCards(bookId?: string): Promise<NoteCard[]> {
    let notes: NoteCard[] = [];
    
    try {
      notes = await fs.readJson(this.notesFile);
    } catch {
      notes = [];
    }
    
    if (bookId) {
      notes = notes.filter(note => note.bookId === bookId);
    }
    
    // 按更新时间倒序排列
    notes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    
    return notes;
  }

  async deleteNoteCard(id: string): Promise<boolean> {
    const notes = await this.getNoteCards();
    const filteredNotes = notes.filter(note => note.id !== id);
    
    if (filteredNotes.length === notes.length) {
      return false; // 没有找到要删除的笔记
    }
    
    await fs.writeJson(this.notesFile, filteredNotes, { spaces: 2 });
    return true;
  }

  async updateNoteCard(id: string, updates: Partial<Omit<NoteCard, 'id' | 'bookId' | 'createdAt' | 'updatedAt'>>): Promise<NoteCard | null> {
    const notes = await this.getNoteCards();
    const noteIndex = notes.findIndex(note => note.id === id);
    
    if (noteIndex === -1) {
      return null; // 没有找到要更新的笔记
    }
    
    const updatedNote = {
      ...notes[noteIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    notes[noteIndex] = updatedNote;
    await fs.writeJson(this.notesFile, notes, { spaces: 2 });
    
    return updatedNote;
  }

  // 标签相关操作
  async getTags(type?: 'domain' | 'theme'): Promise<Tag[]> {
    let tags: Tag[] = [];
    
    try {
      tags = await fs.readJson(this.tagsFile);
    } catch {
      await this.initDefaultTags();
      tags = await fs.readJson(this.tagsFile);
    }
    
    if (type) {
      tags = tags.filter(tag => tag.type === type);
    }
    
    // 按分类和名称排序
    tags.sort((a, b) => {
      if (a.category && b.category) {
        if (a.category !== b.category) {
          return a.category.localeCompare(b.category);
        }
      } else if (a.category && !b.category) {
        return 1;
      } else if (!a.category && b.category) {
        return -1;
      }
      return a.name.localeCompare(b.name);
    });
    
    return tags;
  }
}

export const db = new FileDatabase();
export default FileDatabase;
