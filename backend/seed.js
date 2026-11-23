import { db } from './config/db.js';
import { initAdminAuth } from './middleware/auth.js';

console.log('🌱 Seeding database...');

initAdminAuth('admin123');

// 1. Settings
const defaultSettings = {
  site_name: 'All Best Rummy Apps',
  meta_title: 'All Best Rummy Apps : Download All Rummy App & All Teen Patti APK For Android',
  meta_description: 'Best All Rummy App Downloading website, download daily New Rummy and Best All Rummy App with free bonus from ₹41 to ₹51.',
  meta_keywords: 'all rummy app, all rummy apps, rummy app list, teen patti apk, rummy modern, rummy loot',
  logo_url: '/assets/logo.png',
  banner_url: '/assets/banner.jpeg',
  announcement_ticker: 'Update :- दोस्तों अब AlllRummyApp.Com की इस वेबसाइट पर आप लोगों का स्वागत है, और आप लोग अब इस वेबसाइट के माध्यम से All Rummy & New Rummy Application को डाउनलोड कर सकेंगे ।',
  marquee_speed: 'normal',
  telegram_link: 'https://telegram.me/luckymind09',
  whatsapp_link: 'https://whatsapp.com/channel/0029VaFt6OaKgsNsJ7UF1739',
  youtube_link: 'https://youtube.com/@Zooroulettetricks?si=h1Z74oiZIfbz_D8-',
  footer_text: 'Copyright © Best Rummy Apps. All Rights Reserved.',
  contact_email: 'support@alllrummyapps.com',
  sticky_ad_enabled: true
};

const settingsStmt = db.prepare(`
  INSERT INTO settings (key, value) VALUES (?, ?)
  ON CONFLICT(key) DO UPDATE SET value = excluded.value
`);
Object.entries(defaultSettings).forEach(([k, v]) => {
  settingsStmt.run(k, typeof v === 'object' ? JSON.stringify(v) : String(v));
});

// 2. Categories
db.exec('DELETE FROM categories');
const categories = [
  { id: 'best', title: 'Best For All', sort_order: 0, is_active: 1 },
  { id: 'new', title: '✯ NEW APP ✯', sort_order: 1, is_active: 1 },
  { id: 'other', title: 'Other APPS', sort_order: 2, is_active: 1 },
  { id: 'teen-patti', title: 'Teen Patti', sort_order: 3, is_active: 1 }
];
const catStmt = db.prepare('INSERT INTO categories (id, title, sort_order, is_active) VALUES (?, ?, ?, ?)');
categories.forEach(c => catStmt.run(c.id, c.title, c.sort_order, c.is_active));

// 3. Banners
db.exec('DELETE FROM banners');
const banners = [
  {
    id: 'top_hero',
    placement: 'top_hero',
    title: 'All Rummy App Header Banner',
    image_url: '/assets/banner.jpeg',
    target_url: 'https://telegram.me/luckymind09',
    is_active: 1
  },
  {
    id: 'telegram',
    placement: 'telegram',
    title: 'Join Telegram Channel For Daily Predictions',
    image_url: '/assets/channel.jpg',
    target_url: 'https://telegram.me/luckymind09',
    is_active: 1
  },
  {
    id: 'sticky_bottom',
    placement: 'sticky_bottom',
    title: 'Special Bonus App Offer',
    image_url: '/assets/sticky.jpg',
    target_url: 'https://bit.ly/3wEv8ek',
    is_active: 1
  }
];
const bannerStmt = db.prepare('INSERT INTO banners (id, placement, title, image_url, target_url, is_active) VALUES (?, ?, ?, ?, ?, ?)');
banners.forEach(b => bannerStmt.run(b.id, b.placement, b.title, b.image_url, b.target_url, b.is_active));

// 4. Apps
db.exec('DELETE FROM apps');
const apps = [
  {
    id: 'rummy-loot',
    name: 'Rummy-loot',
    icon_url: '/assets/rummy-loot.jpeg',
    download_url: 'https://bit.ly/3wEv8ek',
    bonus_amount: '₹51',
    min_withdrawal: '₹100',
    downloads_count: '500k+',
    rating: 5.0,
    badge_text: '100% Secure',
    category_id: 'best',
    is_featured: 1,
    is_active: 1,
    sort_order: 0
  },
  {
    id: 'poker-ganga',
    name: 'Poker-Ganga',
    icon_url: '/assets/poker-ganga.jpeg',
    download_url: 'https://res.pokerganga.com/download/index.html?agentId=56716542',
    bonus_amount: '₹41',
    min_withdrawal: '₹100',
    downloads_count: '450k+',
    rating: 5.0,
    badge_text: '100% Secure',
    category_id: 'best',
    is_featured: 1,
    is_active: 1,
    sort_order: 1
  },
  {
    id: 'rummy-grand',
    name: 'Rummy-Grand',
    icon_url: '/assets/rummy-grand.jpeg',
    download_url: 'https://rummygrand.com/?from_gameid=8868590&channelCode=100000',
    bonus_amount: '₹51',
    min_withdrawal: '₹100',
    downloads_count: '400k+',
    rating: 5.0,
    badge_text: '100% Secure',
    category_id: 'best',
    is_featured: 1,
    is_active: 1,
    sort_order: 2
  },
  {
    id: 'teen-patti-master',
    name: 'Teen Patti Master',
    icon_url: '/assets/logo.png',
    download_url: 'https://bit.ly/3wEv8ek',
    bonus_amount: '₹1550',
    min_withdrawal: '₹100',
    downloads_count: '1M+',
    rating: 4.9,
    badge_text: 'VIP Exclusive',
    category_id: 'best',
    is_featured: 0,
    is_active: 1,
    sort_order: 3
  },
  {
    id: 'rummy-modern',
    name: 'Rummy Modern',
    icon_url: '/assets/rummy-loot.jpeg',
    download_url: 'https://bit.ly/3wEv8ek',
    bonus_amount: '₹51',
    min_withdrawal: '₹100',
    downloads_count: '350k+',
    rating: 4.8,
    badge_text: 'Hot Deal',
    category_id: 'new',
    is_featured: 0,
    is_active: 1,
    sort_order: 4
  },
  {
    id: 'rummy-nabob',
    name: 'Rummy Nabob',
    icon_url: '/assets/poker-ganga.jpeg',
    download_url: 'https://bit.ly/3wEv8ek',
    bonus_amount: '₹41',
    min_withdrawal: '₹100',
    downloads_count: '250k+',
    rating: 4.7,
    badge_text: 'Fast Payout',
    category_id: 'new',
    is_featured: 0,
    is_active: 1,
    sort_order: 5
  },
  {
    id: 'rummy-wealth',
    name: 'Rummy Wealth',
    icon_url: '/assets/rummy-grand.jpeg',
    download_url: 'https://bit.ly/3wEv8ek',
    bonus_amount: '₹41',
    min_withdrawal: '₹100',
    downloads_count: '200k+',
    rating: 4.8,
    badge_text: '100% Safe',
    category_id: 'new',
    is_featured: 0,
    is_active: 1,
    sort_order: 6
  },
  {
    id: 'teen-patti-gold',
    name: 'Teen Patti Gold',
    icon_url: '/assets/logo.png',
    download_url: 'https://bit.ly/3wEv8ek',
    bonus_amount: '₹51',
    min_withdrawal: '₹100',
    downloads_count: '800k+',
    rating: 4.9,
    badge_text: 'Classic',
    category_id: 'teen-patti',
    is_featured: 0,
    is_active: 1,
    sort_order: 7
  },
  {
    id: 'rummy-yes',
    name: 'Rummy Yes',
    icon_url: '/assets/rummy-loot.jpeg',
    download_url: 'https://bit.ly/3wEv8ek',
    bonus_amount: '₹75',
    min_withdrawal: '₹100',
    downloads_count: '150k+',
    rating: 4.6,
    badge_text: 'Instant Bonus',
    category_id: 'other',
    is_featured: 0,
    is_active: 1,
    sort_order: 8
  },
  {
    id: 'rummy-gogo',
    name: 'Rummy Gogo',
    icon_url: '/assets/poker-ganga.jpeg',
    download_url: 'https://bit.ly/3wEv8ek',
    bonus_amount: '₹35',
    min_withdrawal: '₹100',
    downloads_count: '120k+',
    rating: 4.5,
    badge_text: 'Daily Rewards',
    category_id: 'other',
    is_featured: 0,
    is_active: 1,
    sort_order: 9
  }
];

const appStmt = db.prepare(`
  INSERT INTO apps (
    id, name, icon_url, download_url, bonus_amount, min_withdrawal, 
    downloads_count, rating, badge_text, category_id, is_featured, is_active, sort_order
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
apps.forEach(a => {
  appStmt.run(
    a.id, a.name, a.icon_url, a.download_url, a.bonus_amount, a.min_withdrawal,
    a.downloads_count, a.rating, a.badge_text, a.category_id, a.is_featured, a.is_active, a.sort_order
  );
});

// 5. Pages and Blogs
db.exec('DELETE FROM pages_and_blogs');
const pages = [
  {
    id: 'about',
    slug: 'about',
    title: 'About Us',
    type: 'page',
    content: `Welcome to All Best Rummy Apps!

We are India's premier portal for the most reliable, trusted, and verified Rummy & Teen Patti APKs. Our team tests every single app before listing it here to ensure 100% fair play, secure payment gateways, instant UPI withdrawals, and maximum promotional bonuses for all our users.

Join our Telegram channel for daily game tips, prediction tricks, and exclusive VIP cashback rewards!`,
    cover_image: '/assets/about.webp',
    is_published: 1
  },
  {
    id: 'privacy',
    slug: 'privacy',
    title: 'Privacy Policy',
    type: 'page',
    content: `Privacy Policy for All Best Rummy Apps

We respect your personal privacy. Our website does not collect personally identifiable information without your permission.
- We record aggregate visitor analytics (page impressions and outbound referral clicks) to help us deliver the best user experience.
- All downloads link directly to original developer APK files.
- We advocate for 18+ responsible gaming. Please play within your limits.`,
    cover_image: '/assets/privacy.webp',
    is_published: 1
  },
  {
    id: 'download-guide',
    slug: 'download-guide',
    title: 'How to Download & Install Rummy APK',
    type: 'page',
    content: `Step-by-Step Guide to Download & Install Rummy Apps on Android:

Step 1: Choose any of our recommended apps above and click on the green "Download" button.
Step 2: The APK file will start downloading. If your browser asks "File might be harmful", click "Download Anyway" (this is standard for third-party APKs).
Step 3: Once downloaded, open the notification or find the file in your Downloads folder.
Step 4: If prompted, enable "Install from Unknown Sources" in your Android Settings.
Step 5: Tap "Install" and launch the app.
Step 6: Register with your mobile number and bind your OTP to claim your free sign-up bonus (₹41 to ₹51 instantly)!`,
    cover_image: '/assets/guide.webp',
    is_published: 1
  },
  {
    id: 'blog-1',
    slug: 'top-10-rummy-apps-2026',
    title: 'Top 10 High Bonus Rummy Apps For 2026',
    type: 'blog',
    content: `Looking for the biggest signup bonus in Rummy apps? In this post, we review the top applications offering free cash rewards upon mobile binding, highest rebate programs, and instant bank withdrawals within 5 minutes. Check out Rummy Loot, Poker Ganga, and Rummy Grand for the best experience!`,
    cover_image: '/assets/banner.jpeg',
    is_published: 1
  }
];

const pageStmt = db.prepare(`
  INSERT INTO pages_and_blogs (id, slug, title, type, content, cover_image, is_published)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);
pages.forEach(p => pageStmt.run(p.id, p.slug, p.title, p.type, p.content, p.cover_image, p.is_published));

// 6. Realistic Demo Analytics Data (Past 7 days)
db.exec('DELETE FROM analytics_events');
const eventStmt = db.prepare(`
  INSERT INTO analytics_events (
    timestamp, event_type, path, app_id, app_name, placement, session_id, visitor_id, device_type, referrer
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const now = Date.now();
const DAY = 86400000;
const appList = [
  { id: 'rummy-loot', name: 'Rummy-loot' },
  { id: 'poker-ganga', name: 'Poker-Ganga' },
  { id: 'rummy-grand', name: 'Rummy-Grand' },
  { id: 'teen-patti-master', name: 'Teen Patti Master' },
  { id: 'rummy-modern', name: 'Rummy Modern' }
];

console.log('Generating demo analytics events...');
for (let d = 6; d >= 0; d--) {
  const dayTime = now - d * DAY;
  const visitorsToday = 80 + Math.floor(Math.random() * 60);

  for (let v = 0; v < visitorsToday; v++) {
    const visitorId = 'vis-' + Math.random().toString(36).slice(2, 10);
    const sessionId = 'ses-' + Math.random().toString(36).slice(2, 10);
    const device = Math.random() > 0.15 ? 'Mobile' : 'Desktop';
    const eventTime = dayTime + Math.floor(Math.random() * (DAY - 1000));

    // Page view
    eventStmt.run(eventTime, 'page_view', '/', '', '', '', sessionId, visitorId, device, 'https://google.com');

    // Impressions for top apps
    appList.forEach(a => {
      eventStmt.run(eventTime + 500, 'impression', '/', a.id, a.name, 'featured', sessionId, visitorId, device, '');
    });

    // Random clicks (approx 20-30% CTR)
    if (Math.random() < 0.28) {
      const pickedApp = appList[Math.floor(Math.random() * appList.length)];
      eventStmt.run(eventTime + 2500, 'click', `/go/${pickedApp.id}`, pickedApp.id, pickedApp.name, 'featured', sessionId, visitorId, device, '');
    }
  }
}

console.log('✅ Database seeded successfully with apps, banners, categories, pages, and realistic analytics!');
