import React from 'react';

export default function CategoryTabs({ categories = [], activeCategory, onSelectCategory }) {
  if (!categories.length) return null;

  return (
    <div className="category-tabs-container">
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`category-tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
          onClick={() => onSelectCategory(cat.id)}
        >
          {cat.title}
        </button>
      ))}
    </div>
  );
}
