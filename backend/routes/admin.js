import { Router } from 'express';
import { 
  verifyPassword, createSession, updateAdminPassword, authMiddleware 
} from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { 
  getAdminApps, createApp, updateApp, deleteApp, toggleAppField, reorderApps 
} from '../controllers/appController.js';
import { 
  getCategories, createCategory, updateCategory, deleteCategory, reorderCategories 
} from '../controllers/categoryController.js';
import { getBanners, updateBanner } from '../controllers/bannerController.js';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { 
  getPagesAndBlogs, createPageOrBlog, updatePageOrBlog, deletePageOrBlog 
} from '../controllers/pageController.js';
import { getDashboardAnalytics } from '../controllers/analyticsController.js';
import { uploadMedia, getMediaList, deleteMedia } from '../controllers/mediaController.js';
import { db } from '../config/db.js';

const router = Router();

// Public auth routes
router.post('/login', (req, res) => {
  const { password } = req.body;
  if (!password || !verifyPassword(password)) {
    return res.status(401).json({ error: 'Incorrect admin password.' });
  }
  const { token, expires } = createSession();
  res.cookie('admin_session', token, {
    httpOnly: true,
    maxAge: 24 * 3600 * 1000,
    sameSite: 'lax',
    path: '/'
  });
  res.json({ success: true, token, expires });
});

router.post('/logout', (req, res) => {
  const token = req.cookies?.admin_session || req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (token) {
    db.prepare('DELETE FROM admin_sessions WHERE token = ?').run(token);
  }
  res.clearCookie('admin_session', { path: '/' });
  res.json({ success: true });
});

router.get('/me', authMiddleware, (req, res) => {
  res.json({ authenticated: true, user: 'admin' });
});

router.post('/change-password', authMiddleware, (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 4) {
    return res.status(400).json({ error: 'Password must be at least 4 characters long.' });
  }
  updateAdminPassword(newPassword);
  res.json({ success: true, message: 'Password updated successfully' });
});

// Protected routes below
router.use(authMiddleware);

// Apps CRUD & Reorder
router.get('/apps', getAdminApps);
router.post('/apps', createApp);
router.put('/apps/:id', updateApp);
router.delete('/apps/:id', deleteApp);
router.patch('/apps/:id/:field', toggleAppField);
router.post('/apps/reorder', reorderApps);

// Categories
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);
router.post('/categories/reorder', reorderCategories);

// Banners
router.get('/banners', getBanners);
router.put('/banners/:id', updateBanner);

// Settings
router.get('/settings', getSettings);
router.post('/settings', updateSettings);

// Pages & Blogs
router.get('/pages', getPagesAndBlogs);
router.post('/pages', createPageOrBlog);
router.put('/pages/:id', updatePageOrBlog);
router.delete('/pages/:id', deletePageOrBlog);

// Analytics
router.get('/analytics', getDashboardAnalytics);

// Media
router.get('/media', getMediaList);
router.post('/media', upload.single('file'), uploadMedia);
router.delete('/media/:name', deleteMedia);

export default router;
