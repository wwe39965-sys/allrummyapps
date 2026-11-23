import { db } from '../config/db.js';

export const getPagesAndBlogs = (req, res) => {
  try {
    const { type, publicOnly } = req.query;
    let query = 'SELECT * FROM pages_and_blogs WHERE 1=1';
    const params = [];
    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }
    if (publicOnly === 'true') {
      query += ' AND is_published = 1';
    }
    query += ' ORDER BY created_at DESC';
    const items = db.prepare(query).all(...params);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPageBySlug = (req, res) => {
  try {
    const { slug } = req.params;
    const item = db.prepare('SELECT * FROM pages_and_blogs WHERE slug = ?').get(slug);
    if (!item) return res.status(404).json({ error: 'Page not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createPageOrBlog = (req, res) => {
  try {
    const { title, slug, type = 'page', content = '', cover_image = '', is_published = 1 } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const id = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);

    db.prepare(`
      INSERT INTO pages_and_blogs (id, slug, title, type, content, cover_image, is_published)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, finalSlug, title, type, content, cover_image, is_published ? 1 : 0);

    const created = db.prepare('SELECT * FROM pages_and_blogs WHERE id = ?').get(id);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePageOrBlog = (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, type, content, cover_image, is_published } = req.body;
    const existing = db.prepare('SELECT * FROM pages_and_blogs WHERE id = ?').get(id);
    if (!existing) return res.status(404).json({ error: 'Item not found' });

    db.prepare(`
      UPDATE pages_and_blogs SET 
        title = ?, slug = ?, type = ?, content = ?, cover_image = ?, is_published = ?
      WHERE id = ?
    `).run(
      title !== undefined ? title : existing.title,
      slug !== undefined ? slug : existing.slug,
      type !== undefined ? type : existing.type,
      content !== undefined ? content : existing.content,
      cover_image !== undefined ? cover_image : existing.cover_image,
      is_published !== undefined ? (is_published ? 1 : 0) : existing.is_published,
      id
    );

    const updated = db.prepare('SELECT * FROM pages_and_blogs WHERE id = ?').get(id);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePageOrBlog = (req, res) => {
  try {
    const { id } = req.params;
    const result = db.prepare('DELETE FROM pages_and_blogs WHERE id = ?').run(id);
    if (result.changes === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
