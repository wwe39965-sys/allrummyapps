import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FeaturedCards from '../components/FeaturedCards';
import CategoryTabs from '../components/CategoryTabs';
import AppRow from '../components/AppRow';
import MarqueeTicker from '../components/MarqueeTicker';
import StickyAd from '../components/StickyAd';
import { api } from '../services/api';

export default function HomePage({ siteData }) {
  const { settings = {}, apps = [], categories = [], banners = [] } = siteData || {};
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || 'best');

  useEffect(() => {
    if (categories.length && !selectedCategory) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories]);

  const heroBanner = banners.find(b => b.placement === 'top_hero') || {
    image_url: '/assets/banner.jpeg',
    target_url: 'https://telegram.me/luckymind09'
  };

  const telegramBanner = banners.find(b => b.placement === 'telegram') || {
    image_url: '/assets/channel.jpg',
    target_url: 'https://telegram.me/luckymind09'
  };

  const stickyBanner = banners.find(b => b.placement === 'sticky_bottom') || {
    image_url: '/assets/sticky.jpg',
    target_url: 'https://bit.ly/3wEv8ek',
    is_active: 1
  };

  const filteredApps = apps.filter(app => {
    if (!selectedCategory) return true;
    return app.category_id === selectedCategory;
  });

  return (
    <main>
      {/* 1. Header Hero Banner */}
      <div className="hero-banner-container">
        <a href={heroBanner.target_url} target="_blank" rel="noopener noreferrer">
          <img src={heroBanner.image_url} alt={heroBanner.title || 'Header Banner'} />
        </a>
      </div>

      {/* 2. Top Featured Cards (3 Cards with 5-Star GIFs) */}
      <FeaturedCards apps={apps} />

      {/* 3. Telegram Promo Banner */}
      <div className="telegram-promo">
        <a href={telegramBanner.target_url} target="_blank" rel="noopener noreferrer">
          <img src={telegramBanner.image_url} alt={telegramBanner.title || 'Telegram Channel'} />
        </a>
      </div>

      {/* 4. Marquee Announcement Ticker */}
      <MarqueeTicker text={settings.announcement_ticker} />

      {/* 5. Category Tabs Navigation */}
      <CategoryTabs 
        categories={categories} 
        activeCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* 6. App List Table */}
      <div className="app-table-container">
        {filteredApps.length > 0 ? (
          filteredApps.map((app, index) => (
            <AppRow key={app.id} app={app} rank={index + 1} />
          ))
        ) : (
          <div style={{ padding: '30px', textAlign: 'center', color: '#777' }}>
            No apps found in this category.
          </div>
        )}
      </div>

      {/* 7. How to Download Guide Button */}
      <div className="guide-btn-wrapper">
        <Link to="/page/download-guide" className="guide-btn">
          How to Download
        </Link>
      </div>

      {/* 8. Bottom Marquee Announcement Ticker */}
      <MarqueeTicker text={settings.announcement_ticker} />

      {/* 9. Floating Sticky Ad at Bottom */}
      <StickyAd banner={stickyBanner} enabled={settings.sticky_ad_enabled !== false} />
    </main>
  );
}
