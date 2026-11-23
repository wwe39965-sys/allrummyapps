import React, { useState } from 'react';
import { api } from '../services/api';

export default function SettingsManager({ settings, onUpdateSettings }) {
  const [formData, setFormData] = useState({
    site_name: settings.site_name || 'All Best Rummy Apps',
    meta_title: settings.meta_title || '',
    meta_description: settings.meta_description || '',
    meta_keywords: settings.meta_keywords || '',
    logo_url: settings.logo_url || '/assets/logo.png',
    telegram_link: settings.telegram_link || '',
    whatsapp_link: settings.whatsapp_link || '',
    youtube_link: settings.youtube_link || '',
    contact_email: settings.contact_email || '',
    footer_text: settings.footer_text || '',
    sticky_ad_enabled: settings.sticky_ad_enabled !== false
  });

  const [passwordData, setPasswordData] = useState({ newPassword: '', confirmPassword: '' });
  const [saved, setSaved] = useState(false);
  const [passMsg, setPassMsg] = useState({ text: '', isError: false });

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    await onUpdateSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPassMsg({ text: 'Passwords do not match.', isError: true });
      return;
    }
    try {
      await api.changePassword(passwordData.newPassword);
      setPassMsg({ text: 'Admin password updated successfully!', isError: false });
      setPasswordData({ newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPassMsg({ text: err.message || 'Failed to update password', isError: true });
    }
  };

  return (
    <div style={{ display: 'grid', gap: '24px' }}>
      {/* 1. General & SEO Settings */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">Website Branding & SEO Settings</h2>
        </div>
        <div className="admin-card-body">
          {saved && (
            <div style={{ background: '#dcfce7', color: '#166534', padding: '10px 14px', borderRadius: '6px', marginBottom: '16px' }}>
              Website settings saved successfully!
            </div>
          )}

          <form onSubmit={handleSaveSettings}>
            <div className="form-row">
              <div className="form-group">
                <label>Website Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.site_name}
                  onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Header Logo URL</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.logo_url}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>SEO Meta Title</label>
              <input
                type="text"
                className="form-control"
                value={formData.meta_title}
                onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>SEO Meta Description</label>
              <textarea
                className="form-control"
                rows={3}
                value={formData.meta_description}
                onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>SEO Meta Keywords</label>
              <input
                type="text"
                className="form-control"
                value={formData.meta_keywords}
                onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
              />
            </div>

            <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '20px 0 12px', borderTop: '1px solid #eee', paddingTop: '16px' }}>
              Social & Community Channels
            </h3>

            <div className="form-row">
              <div className="form-group">
                <label>Telegram Channel Link</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://telegram.me/..."
                  value={formData.telegram_link}
                  onChange={(e) => setFormData({ ...formData, telegram_link: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>WhatsApp Channel Link</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://whatsapp.com/channel/..."
                  value={formData.whatsapp_link}
                  onChange={(e) => setFormData({ ...formData, whatsapp_link: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>YouTube Channel Link</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://youtube.com/@..."
                  value={formData.youtube_link}
                  onChange={(e) => setFormData({ ...formData, youtube_link: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Contact Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="support@allrummyapps.com"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Footer Copyright Text</label>
              <input
                type="text"
                className="form-control"
                value={formData.footer_text}
                onChange={(e) => setFormData({ ...formData, footer_text: e.target.value })}
              />
            </div>

            <div style={{ margin: '16px 0' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.sticky_ad_enabled}
                  onChange={(e) => setFormData({ ...formData, sticky_ad_enabled: e.target.checked })}
                />
                <span><strong>Enable Floating Sticky Bottom Ad</strong></span>
              </label>
            </div>

            <button type="submit" className="admin-btn admin-btn-primary">
              Save Website Settings
            </button>
          </form>
        </div>
      </div>

      {/* 2. Admin Security & Password Change */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">Admin Account Security</h2>
        </div>
        <div className="admin-card-body">
          {passMsg.text && (
            <div style={{
              background: passMsg.isError ? '#fee2e2' : '#dcfce7',
              color: passMsg.isError ? '#b91c1c' : '#166534',
              padding: '10px 14px',
              borderRadius: '6px',
              marginBottom: '16px'
            }}>
              {passMsg.text}
            </div>
          )}

          <form onSubmit={handleChangePassword}>
            <div className="form-row">
              <div className="form-group">
                <label>New Admin Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter new password (min 4 chars)"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Re-type new password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                />
              </div>
            </div>
            <button type="submit" className="admin-btn admin-btn-secondary">
              Update Admin Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
