import { db } from '../config/db.js';

export const getCategories = (req, res) => {
  try {
    const isPublic = req.query.public === 'true';
    const query = isPublic 
      ? 'SELECT * FROM categories WHERE is_active = 1 ORDER BY sort_order ASC, rowid ASC'
      : 'SELECT * FROM categories ORDER BY sort_order ASC, rowid ASC';
    const categories = db.prepare(query).all();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createCategory = (req, res) => {
  try {
    const { title, id: customId, is_active = 1 } = req.body;
    if (!title) return res.status(400).json({ error: 'Category title is required' });
    const id = customId || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const maxOrder = db.prepare('SELECT MAX(sort_order) as maxOrder FROM categories').get()?.maxOrder ?? -1;
    
    db.prepare(`
      INSERT INTO categories (id, title, sort_order, is_active)
      VALUES (?, ?, ?, ?)
    `).run(id, title, maxOrder + 1, is_active ? 1 : 0);

    const created = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCategory = (req, res) => {
  try {
    const { id } = req.params;
    const { title, is_active, sort_order } = req.body;
    const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
    if (!existing) return res.status(404).json({ error: 'Category not found' });

    db.prepare(`
      UPDATE categories SET 
        title = ?, 
        is_active = ?, 
        sort_order = ? 
      WHERE id = ?
    `).run(
      title || existing.title,
      is_active !== undefined ? (is_active ? 1 : 0) : existing.is_active,
      sort_order !== undefined ? Number(sort_order) : existing.sort_order,
      id
    );

    const updated = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCategory = (req, res) => {
  try {
    const { id } = req.params;
    // Check if any apps use this category
    const count = db.prepare('SELECT COUNT(*) as c FROM apps WHERE category_id = ?').get(id).c;
    if (count > 0) {
      return res.status(400).json({ error: `Cannot delete category. ${count} apps are currently assigned to it.` });
    }
    const result = db.prepare('DELETE FROM categories WHERE id = ?').run(id);
    if (result.changes === 0) return res.status(404).json({ error: 'Category not found' });
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const reorderCategories = (req, res) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) return res.status(400).json({ error: 'Invalid orderedIds' });
    const stmt = db.prepare('UPDATE categories SET sort_order = ? WHERE id = ?');
    orderedIds.forEach((id, idx) => stmt.run(idx, id));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
