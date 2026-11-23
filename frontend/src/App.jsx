import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ContentPage from './pages/ContentPage';
import BlogListPage from './pages/BlogListPage';
import TagsPage from './pages/TagsPage';
import AdminDashboard from './admin/AdminDashboard';
import { api } from './services/api';
import './styles/public.css';
import './styles/admin.css';

export default function App() {
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const loadSiteData = async () => {
    try {
      const data = await api.getSiteData();
      setSiteData(data);
      if (data?.settings?.site_name) {
        document.title = data.settings.meta_title || data.settings.site_name;
      }
    } catch (err) {
      console.error('Failed to load site data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSiteData();
  }, []);

  // Track page views on route changes
  useEffect(() => {
    if (!location.pathname.startsWith('/admin')) {
      api.trackEvent('page_view', { path: location.pathname });
    }
  }, [location.pathname]);

  const isAdminRoute = location.pathname.startsWith('/admin');

  if (loading && !siteData && !isAdminRoute) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#f0f0f0' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #ddd',
            borderTopColor: '#e60009',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 12px'
          }}></div>
          <p style={{ fontWeight: 'bold', color: '#555' }}>Loading All Rummy Apps...</p>
        </div>
      </div>
    );
  }

  // If on admin route, show full admin dashboard directly
  if (isAdminRoute) {
    return <AdminDashboard onDataUpdated={loadSiteData} />;
  }

  return (
    <div className="site-container">
      <Header settings={siteData?.settings} />
      
      <Routes>
        <Route path="/" element={<HomePage siteData={siteData} />} />
        <Route path="/page/:slug" element={<ContentPage />} />
        <Route path="/about.html" element={<ContentPage />} />
        <Route path="/privacy.html" element={<ContentPage />} />
        <Route path="/download.html" element={<ContentPage />} />
        <Route path="/blogs" element={<BlogListPage siteData={siteData} />} />
        <Route path="/blog.php" element={<BlogListPage siteData={siteData} />} />
        <Route path="/tags" element={<TagsPage siteData={siteData} />} />
        <Route path="/tags.php" element={<TagsPage siteData={siteData} />} />
        <Route path="*" element={<HomePage siteData={siteData} />} />
      </Routes>

      <Footer settings={siteData?.settings} />
    </div>
  );
}
