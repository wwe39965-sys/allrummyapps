import React, { useState } from 'react';
import { 
  LayoutDashboard, Smartphone, Layers, Image as ImageIcon, 
  Volume2, FileText, BarChart2, Settings, ExternalLink, LogOut 
} from 'lucide-react';

export default function AdminLayout({ activeTab, onSelectTab, onLogout, children }) {
  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'apps', label: 'Apps Management', icon: Smartphone },
    { id: 'categories', label: 'Categories & Tabs', icon: Layers },
    { id: 'banners', label: 'Banners & Sticky Ad', icon: ImageIcon },
    { id: 'marquee', label: 'Notice Ticker', icon: Volume2 },
    { id: 'pages', label: 'Pages & Blogs', icon: FileText },
    { id: 'analytics', label: 'Website Analytics', icon: BarChart2 },
    { id: 'media', label: 'Media Library', icon: ImageIcon },
    { id: 'settings', label: 'Site Settings', icon: Settings },
  ];

  return (
    <div className="admin-wrapper">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-brand-icon">R</div>
          <div className="sidebar-title">
            <h2>Rummy Studio</h2>
            <p>Admin Control Panel</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => onSelectTab(item.id)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <a href="/" target="_blank" rel="noopener noreferrer" className="sidebar-footer-btn">
            <ExternalLink size={16} />
            <span>View Live Website</span>
          </a>
          <button onClick={onLogout} className="sidebar-footer-btn" style={{ color: '#ef4444' }}>
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main-area">
        <header className="admin-topbar">
          <div className="topbar-left">
            <h1 className="topbar-title">
              {navItems.find(i => i.id === activeTab)?.label || 'Dashboard'}
            </h1>
          </div>
          <div className="topbar-right">
            <span className="admin-badge">
              <span className="admin-badge-dot"></span>
              Admin Online
            </span>
            <a href="/" target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn-secondary admin-btn-sm">
              <ExternalLink size={14} />
              Open Site
            </a>
          </div>
        </header>

        <div className="admin-content-container">
          {children}
        </div>
      </div>
    </div>
  );
}
