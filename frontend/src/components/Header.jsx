import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header({ settings = {} }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const logoSrc = settings.logo_url || '/assets/logo.png';

  const navItems = [
    { title: 'Home', path: '/' },
    { title: 'About', path: '/page/about' },
    { title: 'Privacy', path: '/page/privacy' },
    { title: 'Tags', path: '/tags' },
    { title: 'Blogs', path: '/blogs' }
  ];

  return (
    <header>
      <div className="top-nav">
        <div className="brand-logo">
          <Link to="/">
            <img src={logoSrc} alt={settings.site_name || 'All Best Rummy Apps'} />
          </Link>
        </div>

        <button 
          className="mobile-menu-btn" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          <i className="fas fa-bars"></i>
        </button>

        <ul className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
          {navItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path} 
                className={location.pathname === item.path ? 'active' : ''}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Red Secondary Bar */}
      <nav className="nav-red-bar">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path}
            className={location.pathname === item.path ? 'active' : ''}
          >
            {item.title}
          </Link>
        ))}
      </nav>
    </header>
  );
}
