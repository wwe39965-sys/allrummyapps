import { DatabaseSync } from 'node:sqlite';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync, existsSync } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dataDir = resolve(__dirname, '..', 'data');
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

const uploadsDir = resolve(dataDir, 'uploads');
if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true });
}

const dbPath = resolve(dataDir, 'site.sqlite');
export const db = new DatabaseSync(dbPath);

db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA busy_timeout = 5000;

  CREATE TABLE IF NOT EXISTS apps (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon_url TEXT NOT NULL,
    download_url TEXT NOT NULL,
    bonus_amount TEXT DEFAULT '₹51',
    min_withdrawal TEXT DEFAULT '₹100',
    downloads_count TEXT DEFAULT '100k+',
    rating REAL DEFAULT 5.0,
    badge_text TEXT DEFAULT '100% Secure',
    category_id TEXT DEFAULT 'best',
    is_featured INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS banners (
    id TEXT PRIMARY KEY,
    placement TEXT NOT NULL,
    title TEXT,
    image_url TEXT NOT NULL,
    target_url TEXT NOT NULL,
    is_active INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS pages_and_blogs (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE,
    title TEXT NOT NULL,
    type TEXT DEFAULT 'page',
    content TEXT,
    cover_image TEXT,
    is_published INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS analytics_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp INTEGER NOT NULL,
    event_type TEXT NOT NULL,
    path TEXT,
    app_id TEXT,
    app_name TEXT,
    placement TEXT,
    session_id TEXT,
    visitor_id TEXT,
    device_type TEXT DEFAULT 'Mobile',
    referrer TEXT
  );

  CREATE INDEX IF NOT EXISTS idx_analytics_time ON analytics_events(timestamp);
  CREATE INDEX IF NOT EXISTS idx_analytics_event ON analytics_events(event_type, timestamp);
  CREATE INDEX IF NOT EXISTS idx_analytics_app ON analytics_events(app_id, event_type);

  CREATE TABLE IF NOT EXISTS admin_auth (
    id INTEGER PRIMARY KEY,
    username TEXT DEFAULT 'admin',
    salt TEXT NOT NULL,
    hash TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS admin_sessions (
    token TEXT PRIMARY KEY,
    expires INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS media (
    name TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    size INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

export { dataDir, uploadsDir };
