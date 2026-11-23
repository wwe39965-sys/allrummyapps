const API_BASE = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('admin_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const api = {
  // Public
  getSiteData: async () => {
    const res = await fetch(`${API_BASE}/site`, { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to load site data');
    return res.json();
  },

  getPageBySlug: async (slug) => {
    const res = await fetch(`${API_BASE}/page/${encodeURIComponent(slug)}`, { credentials: 'include' });
    if (!res.ok) throw new Error('Page not found');
    return res.json();
  },

  trackEvent: async (eventType, details = {}) => {
    try {
      await fetch(`${API_BASE}/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        keepalive: true,
        body: JSON.stringify({ event_type: eventType, ...details })
      });
    } catch (e) {
      // Non-blocking analytics failure
    }
  },

  // Admin Auth
  adminLogin: async (password) => {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    if (data.token) {
      localStorage.setItem('admin_token', data.token);
    }
    return data;
  },

  adminLogout: async () => {
    localStorage.removeItem('admin_token');
    const res = await fetch(`${API_BASE}/admin/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    return res.json();
  },

  checkAdminAuth: async () => {
    const res = await fetch(`${API_BASE}/admin/me`, { 
      credentials: 'include',
      headers: { ...getAuthHeaders() }
    });
    return res.ok;
  },

  changePassword: async (newPassword) => {
    const res = await fetch(`${API_BASE}/admin/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      credentials: 'include',
      body: JSON.stringify({ newPassword })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update password');
    return data;
  },

  // Admin Apps
  getAdminApps: async () => {
    const res = await fetch(`${API_BASE}/admin/apps`, { 
      credentials: 'include',
      headers: { ...getAuthHeaders() }
    });
    if (!res.ok) throw new Error('Failed to fetch apps');
    return res.json();
  },

  createApp: async (appData) => {
    const res = await fetch(`${API_BASE}/admin/apps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      credentials: 'include',
      body: JSON.stringify(appData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create app');
    return data;
  },

  updateApp: async (id, appData) => {
    const res = await fetch(`${API_BASE}/admin/apps/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      credentials: 'include',
      body: JSON.stringify(appData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update app');
    return data;
  },

  deleteApp: async (id) => {
    const res = await fetch(`${API_BASE}/admin/apps/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
      credentials: 'include'
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete app');
    return data;
  },

  toggleAppField: async (id, field) => {
    const res = await fetch(`${API_BASE}/admin/apps/${id}/${field}`, {
      method: 'PATCH',
      headers: { ...getAuthHeaders() },
      credentials: 'include'
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to toggle field');
    return data;
  },

  reorderApps: async (orderedIds) => {
    const res = await fetch(`${API_BASE}/admin/apps/reorder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      credentials: 'include',
      body: JSON.stringify({ orderedIds })
    });
    return res.json();
  },

  // Categories
  getCategories: async () => {
    const res = await fetch(`${API_BASE}/admin/categories`, { 
      credentials: 'include',
      headers: { ...getAuthHeaders() }
    });
    return res.json();
  },

  createCategory: async (categoryData) => {
    const res = await fetch(`${API_BASE}/admin/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      credentials: 'include',
      body: JSON.stringify(categoryData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create category');
    return data;
  },

  updateCategory: async (id, categoryData) => {
    const res = await fetch(`${API_BASE}/admin/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      credentials: 'include',
      body: JSON.stringify(categoryData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update category');
    return data;
  },

  deleteCategory: async (id) => {
    const res = await fetch(`${API_BASE}/admin/categories/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
      credentials: 'include'
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete category');
    return data;
  },

  // Banners
  getBanners: async () => {
    const res = await fetch(`${API_BASE}/admin/banners`, { 
      credentials: 'include',
      headers: { ...getAuthHeaders() }
    });
    return res.json();
  },

  updateBanner: async (id, bannerData) => {
    const res = await fetch(`${API_BASE}/admin/banners/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      credentials: 'include',
      body: JSON.stringify(bannerData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update banner');
    return data;
  },

  // Settings
  getSettings: async () => {
    const res = await fetch(`${API_BASE}/admin/settings`, { 
      credentials: 'include',
      headers: { ...getAuthHeaders() }
    });
    return res.json();
  },

  updateSettings: async (settingsData) => {
    const res = await fetch(`${API_BASE}/admin/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      credentials: 'include',
      body: JSON.stringify(settingsData)
    });
    return res.json();
  },

  // Pages & Blogs
  getPages: async () => {
    const res = await fetch(`${API_BASE}/admin/pages`, { 
      credentials: 'include',
      headers: { ...getAuthHeaders() }
    });
    return res.json();
  },

  createPage: async (pageData) => {
    const res = await fetch(`${API_BASE}/admin/pages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      credentials: 'include',
      body: JSON.stringify(pageData)
    });
    return res.json();
  },

  updatePage: async (id, pageData) => {
    const res = await fetch(`${API_BASE}/admin/pages/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      credentials: 'include',
      body: JSON.stringify(pageData)
    });
    return res.json();
  },

  deletePage: async (id) => {
    const res = await fetch(`${API_BASE}/admin/pages/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
      credentials: 'include'
    });
    return res.json();
  },

  // Analytics
  getAnalytics: async (days = 7) => {
    const res = await fetch(`${API_BASE}/admin/analytics?days=${days}`, { 
      credentials: 'include',
      headers: { ...getAuthHeaders() }
    });
    if (!res.ok) throw new Error('Failed to load analytics');
    return res.json();
  },

  // Media
  getMedia: async () => {
    const res = await fetch(`${API_BASE}/admin/media`, { 
      credentials: 'include',
      headers: { ...getAuthHeaders() }
    });
    return res.json();
  },

  uploadMedia: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/admin/media`, {
      method: 'POST',
      headers: { ...getAuthHeaders() },
      credentials: 'include',
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to upload media');
    return data;
  },

  deleteMedia: async (name) => {
    const res = await fetch(`${API_BASE}/admin/media/${encodeURIComponent(name)}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
      credentials: 'include'
    });
    return res.json();
  }
};

