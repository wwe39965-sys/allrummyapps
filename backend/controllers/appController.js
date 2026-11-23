import { db } from '../config/db.js';
import { randomUUID } from 'node:crypto';

export const getPublicApps = (req, res) => {
  try {
    const apps = db.prepare(`
      SELECT * FROM apps 
      WHERE is_active = 1 
      ORDER BY sort_order ASC, rowid ASC
    `).all();
    res.json(apps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAdminApps = (req, res) => {
  try {
    const apps = db.prepare(`
      SELECT * FROM apps 
      ORDER BY sort_order ASC, rowid ASC
    `).all();
    res.json(apps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createApp = (req, res) => {
  try {
    const {
      name,
      icon_url,
      download_url,
      bonus_amount = '₹51',
      min_withdrawal = '₹100',
      downloads_count = '100k+',
      rating = 5.0,
      badge_text = '100% Secure',
      category_id = 'best',
      is_featured = 0,
      is_active = 1
    } = req.body;

    if (!name || !download_url) {
      return res.status(400).json({ error: 'App name and download URL are required.' });
    }

    const id = req.body.id || (name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString(36));
    const maxOrder = db.prepare('SELECT MAX(sort_order) as maxOrder FROM apps').get()?.maxOrder ?? -1;
    const sort_order = maxOrder + 1;

    db.prepare(`
      INSERT INTO apps (
        id, name, icon_url, download_url, bonus_amount, min_withdrawal, 
        downloads_count, rating, badge_text, category_id, is_featured, is_active, sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      name,
      icon_url || '/assets/logo.png',
      download_url,
      bonus_amount,
      min_withdrawal,
      downloads_count,
      Number(rating) || 5.0,
      badge_text,
      category_id,
      is_featured ? 1 : 0,
      is_active ? 1 : 0,
      sort_order
    );

    const created = db.prepare('SELECT * FROM apps WHERE id = ?').get(id);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateApp = (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM apps WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'App not found' });
    }

    const {
      name = existing.name,
      icon_url = existing.icon_url,
      download_url = existing.download_url,
      bonus_amount = existing.bonus_amount,
      min_withdrawal = existing.min_withdrawal,
      downloads_count = existing.downloads_count,
      rating = existing.rating,
      badge_text = existing.badge_text,
      category_id = existing.category_id,
      is_featured = existing.is_featured,
      is_active = existing.is_active,
      sort_order = existing.sort_order
    } = req.body;

    db.prepare(`
      UPDATE apps SET 
        name = ?, icon_url = ?, download_url = ?, bonus_amount = ?, 
        min_withdrawal = ?, downloads_count = ?, rating = ?, badge_text = ?, 
        category_id = ?, is_featured = ?, is_active = ?, sort_order = ?
      WHERE id = ?
    `).run(
      name,
      icon_url,
      download_url,
      bonus_amount,
      min_withdrawal,
      downloads_count,
      Number(rating),
      badge_text,
      category_id,
      is_featured ? 1 : 0,
      is_active ? 1 : 0,
      Number(sort_order),
      id
    );

    const updated = db.prepare('SELECT * FROM apps WHERE id = ?').get(id);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteApp = (req, res) => {
  try {
    const { id } = req.params;
    const result = db.prepare('DELETE FROM apps WHERE id = ?').run(id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'App not found' });
    }
    res.json({ success: true, message: 'App deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const toggleAppField = (req, res) => {
  try {
    const { id, field } = req.params;
    if (!['is_featured', 'is_active'].includes(field)) {
      return res.status(400).json({ error: 'Invalid field to toggle' });
    }
    const current = db.prepare(`SELECT ${field} FROM apps WHERE id = ?`).get(id);
    if (!current) return res.status(404).json({ error: 'App not found' });

    const newValue = current[field] === 1 ? 0 : 1;
    db.prepare(`UPDATE apps SET ${field} = ? WHERE id = ?`).run(newValue, id);
    res.json({ id, field, value: newValue });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const reorderApps = (req, res) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: 'orderedIds must be an array of IDs' });
    }
    const updateStmt = db.prepare('UPDATE apps SET sort_order = ? WHERE id = ?');
    orderedIds.forEach((id, index) => {
      updateStmt.run(index, id);
    });
    res.json({ success: true, message: 'Apps reordered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
