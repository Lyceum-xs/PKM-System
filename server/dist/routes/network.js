"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("../database");
const router = express_1.default.Router();
// 获取知识网络数据
router.get('/', async (req, res) => {
    try {
        const books = await database_1.db.getBooks();
        const notes = await database_1.db.getNoteCards();
        if (books.length === 0) {
            const response = {
                success: true,
                data: { nodes: [], links: [], clusters: [] }
            };
            return res.json(response);
        }
        // 生成网络节点
        const nodes = books.map(book => {
            const bookNotes = notes.filter(note => note.bookId === book.id);
            const primaryDomain = book.domainTags[0] || '其他';
            return {
                id: book.id,
                title: book.title,
                author: book.author,
                domainTags: book.domainTags,
                themeTags: book.themeTags,
                size: Math.max(3, Math.min(10, bookNotes.length + 3)), // 3-10 基于笔记数量
                color: getDomainColor(primaryDomain)
            };
        });
        // 生成连接关系
        const links = [];
        for (let i = 0; i < books.length; i++) {
            for (let j = i + 1; j < books.length; j++) {
                const relation = calculateBookRelation(books[i], books[j]);
                if (relation.strength > 0.2) { // 只显示强关联
                    links.push({
                        source: books[i].id,
                        target: books[j].id,
                        strength: relation.strength,
                        sharedTags: relation.sharedTags,
                        type: relation.relationType === 'same_domain' ? 'domain' :
                            relation.relationType === 'same_theme' ? 'theme' : 'mixed'
                    });
                }
            }
        }
        // 生成标签集群
        const clusters = generateTagClusters(books);
        const network = {
            nodes,
            links,
            clusters
        };
        const response = {
            success: true,
            data: network
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
// 计算两本书的关联关系
function calculateBookRelation(bookA, bookB) {
    const sharedDomainTags = bookA.domainTags.filter(tag => bookB.domainTags.includes(tag));
    const sharedThemeTags = bookA.themeTags.filter(tag => bookB.themeTags.includes(tag));
    const totalSharedTags = [...sharedDomainTags, ...sharedThemeTags];
    const totalTagsA = bookA.domainTags.length + bookA.themeTags.length;
    const totalTagsB = bookB.domainTags.length + bookB.themeTags.length;
    // 计算关联强度 (Jaccard 相似度)
    const union = new Set([...bookA.domainTags, ...bookA.themeTags, ...bookB.domainTags, ...bookB.themeTags]);
    const intersection = totalSharedTags.length;
    const strength = intersection / union.size;
    // 确定关联类型
    let relationType = 'mixed_tags';
    if (sharedDomainTags.length > 0 && sharedThemeTags.length === 0) {
        relationType = 'same_domain';
    }
    else if (sharedThemeTags.length > 0 && sharedDomainTags.length === 0) {
        relationType = 'same_theme';
    }
    return {
        book: bookB,
        relationType,
        sharedTags: totalSharedTags,
        strength
    };
}
// 生成标签集群
function generateTagClusters(books) {
    const domainGroups = {};
    books.forEach(book => {
        book.domainTags.forEach(tag => {
            if (!domainGroups[tag]) {
                domainGroups[tag] = [];
            }
            domainGroups[tag].push(book);
        });
    });
    return Object.entries(domainGroups)
        .filter(([tag, books]) => books.length >= 2) // 至少2本书才形成集群
        .map(([tag, clusterBooks], index) => ({
        name: tag,
        books: clusterBooks.map(book => book.id),
        center: {
            x: Math.cos((index * 2 * Math.PI) / Object.keys(domainGroups).length) * 200,
            y: Math.sin((index * 2 * Math.PI) / Object.keys(domainGroups).length) * 200
        },
        color: getDomainColor(tag)
    }));
}
// 根据领域获取颜色
function getDomainColor(domain) {
    const colorMap = {
        '心理学': '#FF6B6B',
        '经济学': '#4ECDC4',
        '数学': '#45B7D1',
        '计算机': '#96CEB4',
        '数据科学': '#FFEAA7',
        '哲学': '#DDA0DD',
        '历史': '#98D8C8',
        '文学': '#F7DC6F',
        '社会学': '#BB8FCE',
        '其他': '#95A5A6'
    };
    return colorMap[domain] || colorMap['其他'];
}
exports.default = router;
