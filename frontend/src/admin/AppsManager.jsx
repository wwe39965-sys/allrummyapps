import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, Star, Eye, EyeOff, Search } from 'lucide-react';

export default function AppsManager({ apps, categories, onCreateApp, onUpdateApp, onDeleteApp, onToggleField, onReorderApps }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingApp, setEditingApp] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    icon_url: '/assets/logo.png',
    download_url: '',
    bonus_amount: '₹51',
    min_withdrawal: '₹100',
    downloads_count: '100k+',
    rating: 5.0,
    badge_text: '100% Secure',
    category_id: categories[0]?.id || 'best',
    is_featured: 0,
    is_active: 1
  });

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || app.category_id === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const openAddModal = () => {
    setEditingApp(null);
    setFormData({
      name: '',
      icon_url: '/assets/logo.png',
      download_url: '',
      bonus_amount: '₹51',
      min_withdrawal: '₹100',
      downloads_count: '100k+',
      rating: 5.0,
      badge_text: '100% Secure',
      category_id: categories[0]?.id || 'best',
      is_featured: 0,
      is_active: 1
    });
    setIsModalOpen(true);
  };

  const openEditModal = (app) => {
    setEditingApp(app);
    setFormData({
      name: app.name,
      icon_url: app.icon_url,
      download_url: app.download_url,
      bonus_amount: app.bonus_amount || '₹51',
      min_withdrawal: app.min_withdrawal || '₹100',
      downloads_count: app.downloads_count || '100k+',
      rating: app.rating || 5.0,
      badge_text: app.badge_text || '100% Secure',
      category_id: app.category_id || categories[0]?.id || 'best',
      is_featured: app.is_featured,
      is_active: app.is_active
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingApp) {
      onUpdateApp(editingApp.id, formData);
    } else {
      onCreateApp(formData);
    }
    setIsModalOpen(false);
  };

  const moveApp = (index, delta) => {
    const newApps = [...apps];
    const targetIndex = index + delta;
    if (targetIndex < 0 || targetIndex >= newApps.length) return;
    
    const temp = newApps[index];
    newApps[index] = newApps[targetIndex];
    newApps[targetIndex] = temp;

    const orderedIds = newApps.map(a => a.id);
    onReorderApps(orderedIds);
  };

  return (
    <div>
      {/* Top Filter and Action Bar */}
      <div className="admin-card">
        <div className="admin-card-body admin-toolbar">
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', minWidth: '200px' }}>
              <input
                type="text"
                placeholder="Search apps..."
                className="form-control"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="form-control"
              style={{ width: 'auto' }}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          <button onClick={openAddModal} className="admin-btn admin-btn-primary">
            <Plus size={16} /> Add New App
          </button>
        </div>
      </div>

      {/* Apps Table */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">All Rummy & Teen Patti Apps ({filteredApps.length})</h3>
        </div>
        <div className="admin-card-body" style={{ padding: 0 }}>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Order</th>
                  <th>App</th>
                  <th>Category</th>
                  <th>Bonus</th>
                  <th>Min. Withdraw</th>
                  <th>Downloads</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.map((app, index) => {
                  const cat = categories.find(c => c.id === app.category_id);
                  return (
                    <tr key={app.id}>
                      <td>
                        <div style={{ display: 'flex', gap: '2px' }}>
                          <button
                            className="admin-btn admin-btn-secondary admin-btn-sm"
                            disabled={index === 0}
                            onClick={() => moveApp(index, -1)}
                            title="Move Up"
                          >
                            <ArrowUp size={12} />
                          </button>
                          <button
                            className="admin-btn admin-btn-secondary admin-btn-sm"
                            disabled={index === filteredApps.length - 1}
                            onClick={() => moveApp(index, 1)}
                            title="Move Down"
                          >
                            <ArrowDown size={12} />
                          </button>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={app.icon_url || '/assets/logo.png'}
                            alt=""
                            style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover' }}
                          />
                          <div>
                            <strong style={{ display: 'block', fontSize: '14px' }}>{app.name}</strong>
                            <a
                              href={app.download_url}
                              target="_blank"
                              rel="noreferrer"
                              style={{ fontSize: '11px', color: '#3b82f6', textDecoration: 'none' }}
                            >
                              Direct Link ↗
                            </a>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '12px', background: '#f1f5f9', padding: '3px 8px', borderRadius: '4px' }}>
                          {cat?.title || app.category_id}
                        </span>
                      </td>
                      <td style={{ color: '#e60009', fontWeight: 'bold' }}>{app.bonus_amount || '₹51'}</td>
                      <td>{app.min_withdrawal || '₹100'}</td>
                      <td>{app.downloads_count || '100k+'}</td>
                      <td>
                        <button
                          onClick={() => onToggleField(app.id, 'is_active')}
                          className={`badge-status ${app.is_active ? 'badge-active' : 'badge-inactive'}`}
                          style={{ border: 'none', cursor: 'pointer' }}
                        >
                          {app.is_active ? 'Active' : 'Hidden'}
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={() => onToggleField(app.id, 'is_featured')}
                          style={{
                            border: 'none',
                            background: app.is_featured ? '#fef3c7' : '#f1f5f9',
                            color: app.is_featured ? '#d97706' : '#94a3b8',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontWeight: 600,
                            fontSize: '12px'
                          }}
                        >
                          <Star size={13} fill={app.is_featured ? '#d97706' : 'none'} />
                          {app.is_featured ? 'Featured' : 'Regular'}
                        </button>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            onClick={() => openEditModal(app)}
                            className="admin-btn admin-btn-secondary admin-btn-sm"
                            title="Edit App"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete ${app.name}?`)) {
                                onDeleteApp(app.id);
                              }
                            }}
                            className="admin-btn admin-btn-danger admin-btn-sm"
                            title="Delete App"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredApps.length === 0 && (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                      No apps matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add / Edit App Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>{editingApp ? 'Edit App Details' : 'Add New App'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="modal-close-btn">&times;</button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label>App Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      className="form-control"
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>App Icon URL or Path</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <img
                      src={formData.icon_url || '/assets/logo.png'}
                      alt="Preview"
                      style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #ccc' }}
                    />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="/assets/rummy-loot.jpeg or https://..."
                      value={formData.icon_url}
                      onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Download APK URL (Affiliate / Landing Page) *</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://example.com/download"
                    value={formData.download_url}
                    onChange={(e) => setFormData({ ...formData, download_url: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Bonus Amount</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. ₹51 or ₹1550"
                      value={formData.bonus_amount}
                      onChange={(e) => setFormData({ ...formData, bonus_amount: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Min. Withdrawal</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. ₹100"
                      value={formData.min_withdrawal}
                      onChange={(e) => setFormData({ ...formData, min_withdrawal: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Downloads Count</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 500k+ or 1M+"
                      value={formData.downloads_count}
                      onChange={(e) => setFormData({ ...formData, downloads_count: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Badge Text</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 100% Secure or VIP"
                      value={formData.badge_text}
                      onChange={(e) => setFormData({ ...formData, badge_text: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_featured === 1}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked ? 1 : 0 })}
                    />
                    <span><strong>Featured on Homepage</strong> (Shows in top 3-card banner)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_active === 1}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked ? 1 : 0 })}
                    />
                    <span><strong>Active & Visible</strong></span>
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="admin-btn admin-btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  {editingApp ? 'Save Changes' : 'Create App'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
