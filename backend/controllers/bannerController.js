import { db } from '../config/db.js';

export const getBanners = (req, res) => {
  try {
    const banners = db.prepare('SELECT * FROM banners').all();
    res.json(banners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBanner = (req, res) => {
  try {
    const { id } = req.params;
    const { title, image_url, target_url, is_active, placement } = req.body;
    const existing = db.prepare('SELECT * FROM banners WHERE id = ?').get(id);

    if (!existing) {
      // create if not exists
      db.prepare(`
        INSERT INTO banners (id, placement, title, image_url, target_url, is_active)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        id,
        placement || id,
        title || '',
        image_url || '',
        target_url || '#',
        is_active !== undefined ? (is_active ? 1 : 0) : 1
      );
    } else {
      db.prepare(`
        UPDATE banners SET 
          title = ?, image_url = ?, target_url = ?, is_active = ?, placement = ?
        WHERE id = ?
      `).run(
        title !== undefined ? title : existing.title,
        image_url !== undefined ? image_url : existing.image_url,
        target_url !== undefined ? target_url : existing.target_url,
        is_active !== undefined ? (is_active ? 1 : 0) : existing.is_active,
        placement || existing.placement,
        id
      );
    }

    const updated = db.prepare('SELECT * FROM banners WHERE id = ?').get(id);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
