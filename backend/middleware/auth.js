import { randomBytes, scryptSync, timingSafeEqual, createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { writeFileSync, existsSync } from 'node:fs';
import { db, dataDir } from '../config/db.js';

export const digest = (value) => createHash('sha256').update(value).digest('hex');

export function initAdminAuth(defaultPassword = process.env.ADMIN_PASSWORD || 'admin123') {
  const account = db.prepare('SELECT id FROM admin_auth WHERE id = 1').get();
  if (!account) {
    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(defaultPassword, salt, 64).toString('hex');
    db.prepare('INSERT INTO admin_auth (id, username, salt, hash) VALUES (1, ?, ?, ?)').run('admin', salt, hash);
    const passFile = resolve(dataDir, 'admin-password.txt');
    if (!existsSync(passFile)) {
      writeFileSync(passFile, `Admin Username: admin\nAdmin Password: ${defaultPassword}\n`, 'utf8');
    }
  }
}

export function verifyPassword(password) {
  const account = db.prepare('SELECT salt, hash FROM admin_auth WHERE id = 1').get();
  if (!account) return false;
  try {
    const derived = scryptSync(password, account.salt, 64);
    return timingSafeEqual(derived, Buffer.from(account.hash, 'hex'));
  } catch {
    return false;
  }
}

export function updateAdminPassword(newPassword) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(newPassword, salt, 64).toString('hex');
  db.prepare('UPDATE admin_auth SET salt = ?, hash = ? WHERE id = 1').run(salt, hash);
  const passFile = resolve(dataDir, 'admin-password.txt');
  writeFileSync(passFile, `Admin Username: admin\nAdmin Password: ${newPassword}\nUpdated At: ${new Date().toISOString()}\n`, 'utf8');
}

export function createSession() {
  const token = randomBytes(32).toString('hex');
  const hashedToken = digest(token);
  const expires = Date.now() + 24 * 3600 * 1000; // 24 hours
  db.prepare('DELETE FROM admin_sessions WHERE expires <= ?').run(Date.now());
  db.prepare('INSERT INTO admin_sessions (token, expires) VALUES (?, ?)').run(hashedToken, expires);
  return { token, expires };
}

export function verifyToken(token) {
  if (!token) return false;
  const hashed = digest(token);
  const session = db.prepare('SELECT 1 FROM admin_sessions WHERE token = ? AND expires > ?').get(hashed, Date.now());
  return Boolean(session);
}

export function authMiddleware(req, res, next) {
  const token = req.cookies?.admin_session || req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token || !verifyToken(token)) {
    return res.status(401).json({ error: 'Unauthorized. Please sign in to continue.' });
  }
  next();
}
