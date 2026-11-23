import { Router } from 'express';
import { db } from '../config/db.js';
import { getPublicApps } from '../controllers/appController.js';
import { getCategories } from '../controllers/categoryController.js';
import { getPageBySlug, getPagesAndBlogs } from '../controllers/pageController.js';
import { recordEvent, redirectAppClick } from '../controllers/analyticsController.js';

const router = Router();

// Consolidated site config for quick frontend load
router.get('/site', (req, res) => {
  try {
    const settingsRows = db.prepare('SELECT key, value FROM settings').all();
    const settings = {};
    settingsRows.forEach(r => {
      try { settings[r.key] = JSON.parse(r.value); } catch { settings[r.key] = r.value; }
    });

    const apps = db.prepare('SELECT * FROM apps WHERE is_active = 1 ORDER BY sort_order ASC, rowid ASC').all();
    const categories = db.prepare('SELECT * FROM categories WHERE is_active = 1 ORDER BY sort_order ASC, rowid ASC').all();
    const banners = db.prepare('SELECT * FROM banners WHERE is_active = 1').all();
    const pages = db.prepare('SELECT id, slug, title, type, cover_image, is_published, created_at FROM pages_and_blogs WHERE is_published = 1').all();

    res.json({
      settings,
      apps,
      categories,
      banners,
      pages
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/apps', getPublicApps);
router.get('/categories', (req, res) => {
  req.query.public = 'true';
  getCategories(req, res);
});
router.get('/pages', (req, res) => {
  req.query.publicOnly = 'true';
  getPagesAndBlogs(req, res);
});
router.get('/page/:slug', getPageBySlug);
router.post('/track', recordEvent);
router.get('/go/:appId', redirectAppClick);

export default router;
