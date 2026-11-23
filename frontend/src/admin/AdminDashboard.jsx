import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import AdminLogin from './AdminLogin';
import DashboardOverview from './DashboardOverview';
import AppsManager from './AppsManager';
import CategoriesManager from './CategoriesManager';
import BannersManager from './BannersManager';
import MarqueeManager from './MarqueeManager';
import PagesManager from './PagesManager';
import MediaManager from './MediaManager';
import AnalyticsView from './AnalyticsView';
import SettingsManager from './SettingsManager';
import { api } from '../services/api';

export default function AdminDashboard({ onDataUpdated }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Admin Data States
  const [apps, setApps] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [settings, setSettings] = useState({});
  const [pages, setPages] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkAuth = async () => {
    setCheckingAuth(true);
    try {
      const ok = await api.checkAdminAuth();
      setIsAuthenticated(ok);
      if (ok) {
        await loadAllAdminData();
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setCheckingAuth(false);
    }
  };

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [appsData, catsData, bannersData, settingsData, pagesData, analyticsRes] = await Promise.all([
        api.getAdminApps(),
        api.getCategories(),
        api.getBanners(),
        api.getSettings(),
        api.getPages(),
        api.getAnalytics(7)
      ]);
      setApps(appsData);
      setCategories(catsData);
      setBanners(bannersData);
      setSettings(settingsData);
      setPages(pagesData);
      setAnalyticsData(analyticsRes);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogin = async (password) => {
    await api.adminLogin(password);
    setIsAuthenticated(true);
    await loadAllAdminData();
  };

  const handleLogout = async () => {
    await api.adminLogout();
    setIsAuthenticated(false);
  };

  // Apps Actions
  const handleCreateApp = async (appData) => {
    await api.createApp(appData);
    await loadAllAdminData();
    if (onDataUpdated) onDataUpdated();
  };

  const handleUpdateApp = async (id, appData) => {
    await api.updateApp(id, appData);
    await loadAllAdminData();
    if (onDataUpdated) onDataUpdated();
  };

  const handleDeleteApp = async (id) => {
    await api.deleteApp(id);
    await loadAllAdminData();
    if (onDataUpdated) onDataUpdated();
  };

  const handleToggleAppField = async (id, field) => {
    await api.toggleAppField(id, field);
    await loadAllAdminData();
    if (onDataUpdated) onDataUpdated();
  };

  const handleReorderApps = async (orderedIds) => {
    await api.reorderApps(orderedIds);
    await loadAllAdminData();
    if (onDataUpdated) onDataUpdated();
  };

  // Categories Actions
  const handleCreateCategory = async (catData) => {
    await api.createCategory(catData);
    await loadAllAdminData();
    if (onDataUpdated) onDataUpdated();
  };

  const handleUpdateCategory = async (id, catData) => {
    await api.updateCategory(id, catData);
    await loadAllAdminData();
    if (onDataUpdated) onDataUpdated();
  };

  const handleDeleteCategory = async (id) => {
    await api.deleteCategory(id);
    await loadAllAdminData();
    if (onDataUpdated) onDataUpdated();
  };

  // Banners Action
  const handleUpdateBanner = async (id, bannerData) => {
    await api.updateBanner(id, bannerData);
    await loadAllAdminData();
    if (onDataUpdated) onDataUpdated();
  };

  // Settings Action
  const handleUpdateSettings = async (settingsData) => {
    await api.updateSettings(settingsData);
    await loadAllAdminData();
    if (onDataUpdated) onDataUpdated();
  };

  // Pages Action
  const handleCreatePage = async (pageData) => {
    await api.createPage(pageData);
    await loadAllAdminData();
    if (onDataUpdated) onDataUpdated();
  };

  const handleUpdatePage = async (id, pageData) => {
    await api.updatePage(id, pageData);
    await loadAllAdminData();
    if (onDataUpdated) onDataUpdated();
  };

  const handleDeletePage = async (id) => {
    await api.deletePage(id);
    await loadAllAdminData();
    if (onDataUpdated) onDataUpdated();
  };

  if (checkingAuth) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#f8fafc' }}>
        <p style={{ fontWeight: 600, color: '#64748b' }}>Checking authorization...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <AdminLayout
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      onLogout={handleLogout}
    >
      {activeTab === 'overview' && (
        <DashboardOverview
          analyticsData={analyticsData}
          onNavigate={setActiveTab}
        />
      )}

      {activeTab === 'apps' && (
        <AppsManager
          apps={apps}
          categories={categories}
          onCreateApp={handleCreateApp}
          onUpdateApp={handleUpdateApp}
          onDeleteApp={handleDeleteApp}
          onToggleField={handleToggleAppField}
          onReorderApps={handleReorderApps}
        />
      )}

      {activeTab === 'categories' && (
        <CategoriesManager
          categories={categories}
          onCreateCategory={handleCreateCategory}
          onUpdateCategory={handleUpdateCategory}
          onDeleteCategory={handleDeleteCategory}
        />
      )}

      {activeTab === 'banners' && (
        <BannersManager
          banners={banners}
          onUpdateBanner={handleUpdateBanner}
        />
      )}

      {activeTab === 'marquee' && (
        <MarqueeManager
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
        />
      )}

      {activeTab === 'pages' && (
        <PagesManager
          pages={pages}
          onCreatePage={handleCreatePage}
          onUpdatePage={handleUpdatePage}
          onDeletePage={handleDeletePage}
        />
      )}

      {activeTab === 'analytics' && (
        <AnalyticsView />
      )}

      {activeTab === 'media' && (
        <MediaManager />
      )}

      {activeTab === 'settings' && (
        <SettingsManager
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
        />
      )}
    </AdminLayout>
  );
}
