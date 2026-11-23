import React, { useState } from 'react';
import CategoryTabs from '../components/CategoryTabs';
import AppRow from '../components/AppRow';

export default function TagsPage({ siteData }) {
  const { categories = [], apps = [] } = siteData || {};
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || 'best');

  const filteredApps = apps.filter(app => {
    if (!selectedCategory) return true;
    return app.category_id === selectedCategory;
  });

  return (
    <div className="content-page-container">
      <h1>All Rummy App Tags & Categories</h1>
      <CategoryTabs 
        categories={categories} 
        activeCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <div className="app-table-container" style={{ marginTop: '20px' }}>
        {filteredApps.map((app, index) => (
          <AppRow key={app.id} app={app} rank={index + 1} />
        ))}
      </div>
    </div>
  );
}
