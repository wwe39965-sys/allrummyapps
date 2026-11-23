import { db, uploadsDir } from '../config/db.js';
import { unlinkSync, existsSync } from 'node:fs';
import { resolve, basename } from 'node:path';

export const uploadMedia = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filename = req.file.filename;
    const url = `/uploads/${filename}`;
    const size = req.file.size;

    db.prepare(`
      INSERT INTO media (name, url, size)
      VALUES (?, ?, ?)
    `).run(filename, url, size);

    res.status(201).json({
      name: filename,
      url,
      size
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMediaList = (req, res) => {
  try {
    const list = db.prepare('SELECT * FROM media ORDER BY rowid DESC').all();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteMedia = (req, res) => {
  try {
    const { name } = req.params;
    const safeName = basename(name);

    db.prepare('DELETE FROM media WHERE name = ?').run(safeName);

    const filePath = resolve(uploadsDir, safeName);
    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }

    res.json({ success: true, message: 'Media file deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
