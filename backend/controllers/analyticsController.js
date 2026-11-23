import { db } from '../config/db.js';
import { randomUUID } from 'node:crypto';

const DAY_MS = 86400000;

function parseDevice(ua = '') {
  if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) return 'Tablet';
  if (/mobile|iphone|ipod|blackberry|opera mini|iemobile|wpdesktop/i.test(ua)) return 'Mobile';
  return 'Desktop';
}

export const recordEvent = (req, res) => {
  try {
    const { event_type, path = '/', app_id = '', app_name = '', placement = 'list' } = req.body;
    if (!event_type) return res.status(400).json({ error: 'event_type is required' });

    const ua = req.headers['user-agent'] || '';
    const device_type = parseDevice(ua);
    const session_id = req.cookies?.site_session || req.body.session_id || randomUUID();
    const visitor_id = req.cookies?.site_visitor || req.body.visitor_id || randomUUID();
    const referrer = req.headers['referer'] || req.body.referrer || '';
    const timestamp = Date.now();

    db.prepare(`
      INSERT INTO analytics_events (
        timestamp, event_type, path, app_id, app_name, placement, session_id, visitor_id, device_type, referrer
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(timestamp, event_type, path, app_id, app_name, placement, session_id, visitor_id, device_type, referrer);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const redirectAppClick = (req, res) => {
  try {
    const { appId } = req.params;
    const placement = req.query.placement || 'list';
    const app = db.prepare('SELECT id, name, download_url FROM apps WHERE id = ?').get(appId);

    if (!app) {
      return res.redirect('/');
    }

    const ua = req.headers['user-agent'] || '';
    const device_type = parseDevice(ua);
    const session_id = req.cookies?.site_session || randomUUID();
    const visitor_id = req.cookies?.site_visitor || randomUUID();
    const timestamp = Date.now();

    // Record the click event
    db.prepare(`
      INSERT INTO analytics_events (
        timestamp, event_type, path, app_id, app_name, placement, session_id, visitor_id, device_type, referrer
      ) VALUES (?, 'click', ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(timestamp, `/go/${appId}`, app.id, app.name, placement, session_id, visitor_id, device_type, req.headers['referer'] || '');

    // Redirect to the actual download link
    res.redirect(302, app.download_url);
  } catch (error) {
    res.status(500).send('Error redirecting: ' + error.message);
  }
};

export const getDashboardAnalytics = (req, res) => {
  try {
    const days = Number(req.query.days) || 7;
    const now = new Date();
    const utcMidnight = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    const startTime = utcMidnight - (days - 1) * DAY_MS;

    // Totals
    const totals = db.prepare(`
      SELECT 
        COUNT(DISTINCT visitor_id) as visitors,
        COUNT(DISTINCT session_id) as visits,
        COUNT(CASE WHEN event_type = 'page_view' THEN 1 END) as views,
        COUNT(CASE WHEN event_type = 'impression' THEN 1 END) as impressions,
        COUNT(CASE WHEN event_type = 'click' THEN 1 END) as clicks
      FROM analytics_events 
      WHERE timestamp >= ?
    `).get(startTime);

    // Apps conversion (Impressions vs Clicks & CTR)
    const appsStats = db.prepare(`
      SELECT 
        a.id as app_id,
        a.name,
        a.icon_url,
        a.bonus_amount,
        COUNT(CASE WHEN e.event_type = 'impression' THEN 1 END) as impressions,
        COUNT(CASE WHEN e.event_type = 'click' THEN 1 END) as clicks
      FROM apps a
      LEFT JOIN analytics_events e ON e.app_id = a.id AND e.timestamp >= ?
      GROUP BY a.id
      ORDER BY clicks DESC, impressions DESC
    `).all(startTime);

    // Calculate CTR
    appsStats.forEach(app => {
      app.ctr = app.impressions > 0 
        ? Math.round((app.clicks / app.impressions) * 1000) / 10 
        : (app.clicks > 0 ? 100 : 0);
    });

    // Device breakdown
    const devices = db.prepare(`
      SELECT 
        device_type,
        COUNT(CASE WHEN event_type = 'page_view' THEN 1 END) as views,
        COUNT(CASE WHEN event_type = 'click' THEN 1 END) as clicks
      FROM analytics_events 
      WHERE timestamp >= ?
      GROUP BY device_type
    `).all(startTime);

    // Daily breakdown for graph
    const dailyRaw = db.prepare(`
      SELECT 
        strftime('%Y-%m-%d', timestamp / 1000, 'unixepoch') as date,
        COUNT(CASE WHEN event_type = 'page_view' THEN 1 END) as views,
        COUNT(CASE WHEN event_type = 'click' THEN 1 END) as clicks,
        COUNT(DISTINCT visitor_id) as visitors
      FROM analytics_events
      WHERE timestamp >= ?
      GROUP BY date
    `).all(startTime);

    const dates = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(startTime + i * DAY_MS).toISOString().slice(0, 10);
      const match = dailyRaw.find(row => row.date === d);
      dates.push(match || { date: d, views: 0, clicks: 0, visitors: 0 });
    }

    // Recent activity stream (last 100 events)
    const feed = db.prepare(`
      SELECT 
        id, timestamp, event_type, app_name, placement, path, device_type,
        substr(visitor_id, 1, 8) as visitor_short
      FROM analytics_events 
      WHERE timestamp >= ?
      ORDER BY id DESC 
      LIMIT 100
    `).all(startTime);

    res.json({
      days,
      totals,
      apps: appsStats,
      devices,
      dates,
      feed
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
