# 🚀 AllRummyApps Modern Rebuild (React.js + Node.js + SQLite)

Welcome to the modernized, high-performance rebuild of **AllRummyApps.com**. This project features:
- **100% Authentic User-Facing UI**: Matches the exact original design, fonts, red header, 5-star animated GIFs, Telegram promotion banner, yellow marquee announcement ticker, category navigation tabs, and floating sticky bottom ad.
- **Modern Full-Featured Admin Panel**: Fully dynamic CMS where the admin can add, edit, delete, and reorder apps, banners, categories, notice ticker, and pages anytime with instant live updates.
- **Real-Time Click Tracking & Visitor Analytics**: Complete analytics engine that tracks unique visitors, browsing sessions, card impressions, and direct APK download clicks with conversion rate (CTR) calculation and device breakdown (Mobile vs Desktop).
- **Zero-Setup SQLite Database**: Uses Node's built-in SQLite engine with zero database daemon or setup required.

---

## ⚡ Quick Start

### Option 1: Double click `start.bat`
Simply double click `start.bat` on Windows! It will start the server on port `5000`.

### Option 2: Command Line
```bash
# Start the unified production server
npm start
```
Then open:
- **Live Website**: [http://localhost:5000/](http://localhost:5000/)
- **Admin Panel**: [http://localhost:5000/admin](http://localhost:5000/admin)
- **Default Master Admin Password**: `admin123` (customizable in Site Settings)

---

## 📂 Project Structure

```
pandit dhamakha/
├── backend/
│   ├── config/
│   │   └── db.js              # Node.js SQLite database connection and table schemas
│   ├── controllers/
│   │   ├── appController.js   # CRUD & reordering for Rummy apps
│   │   ├── categoryController.js # Category tabs management
│   │   ├── bannerController.js   # Top hero, Telegram banner & sticky bottom ad
│   │   ├── settingsController.js # Site title, SEO tags, social media links
│   │   ├── analyticsController.js# Visitor tracking & /go/:appId redirect logger
│   │   ├── pageController.js  # Pages (About, Privacy, Guide) & blog posts
│   │   └── mediaController.js # File uploads & media library
│   ├── middleware/
│   │   ├── auth.js            # Admin authentication & session security
│   │   └── upload.js          # Multer image file upload handler
│   ├── routes/
│   │   ├── api.js             # Public API endpoints (/api/site, /api/go/:id)
│   │   └── admin.js           # Protected Admin API endpoints (/api/admin/*)
│   ├── data/
│   │   ├── site.sqlite        # SQLite database file
│   │   └── uploads/           # Uploaded images
│   ├── assets/                # App icons, banners, and logos
│   ├── seed.js                # Demo data seeder (15+ popular rummy apps)
│   ├── server.js              # Main Express server
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Header, HeroBanner, FeaturedCards, AppRow, StickyAd, Footer
│   │   ├── pages/             # HomePage, ContentPage, BlogListPage, TagsPage
│   │   ├── admin/             # Full Admin Dashboard (Apps, Banners, Analytics, Settings)
│   │   ├── services/api.js    # API client
│   │   ├── styles/            # public.css (Original UI) and admin.css (Dashboard UI)
│   │   ├── App.jsx            # Router and layout controller
│   │   └── main.jsx
│   ├── public/assets/         # Static icons & GIFs
│   ├── vite.config.js
│   └── package.json
│
├── start.bat                  # One-click Windows starter
└── package.json
```

---

## 🛡️ Admin Panel Modules

1. **Dashboard Overview**: Key metrics (Visitors, Page views, App Downloads, Average CTR), top converting apps, and live user event stream.
2. **Apps Management**: Add new Rummy/Teen Patti app with icon, bonus, min withdrawal, downloads count, rating. Toggle **Featured** and **Active** with 1 click. Drag or move apps Up/Down to control the ranking on the homepage.
3. **Categories & Tabs**: Manage navigation tabs ("Best For All", "✯ NEW APP ✯", "Other APPS", etc.).
4. **Banners & Placements**: Edit Top Hero Banner, Telegram Community Banner, and Sticky Bottom Floating Ad.
5. **Notice Ticker**: Update the live yellow scrolling announcement text across the entire website instantly.
6. **Pages & Blogs**: Edit About Us, Privacy Policy, Download Guide, or post new SEO blogs.
7. **Website Analytics**: Real-time graph of daily visits, per-app click counts and CTR%, device breakdown (Mobile vs Desktop), and individual click logs.
8. **Media Library**: Upload and manage graphics with one-click "Copy URL".
9. **Site Settings**: Customize website title, SEO description, Telegram link, WhatsApp link, YouTube link, and change Admin Master Password.
