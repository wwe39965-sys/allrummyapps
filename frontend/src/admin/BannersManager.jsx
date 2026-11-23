import React, { useState } from 'react';

export default function BannersManager({ banners, onUpdateBanner }) {
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({ title: '', image_url: '', target_url: '', is_active: 1 });
  const [successMsg, setSuccessMsg] = useState('');

  const openEdit = (b) => {
    setEditingBanner(b);
    setFormData({
      title: b.title || '',
      image_url: b.image_url || '',
      target_url: b.target_url || '',
      is_active: b.is_active
    });
    setSuccessMsg('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingBanner) return;
    await onUpdateBanner(editingBanner.id, formData);
    setSuccessMsg(`Updated ${editingBanner.title || editingBanner.placement} successfully!`);
    setEditingBanner(null);
  };

  const bannerCards = [
    {
      id: 'top_hero',
      label: '1. Top Hero Banner (Main Header)',
      desc: 'Shown at the very top of the homepage below navigation bar.',
      defaultImg: '/assets/banner.jpeg'
    },
    {
      id: 'telegram',
      label: '2. Telegram Promo Banner (Middle)',
      desc: 'Promotional channel banner shown below the 3 featured app cards.',
      defaultImg: '/assets/channel.jpg'
    },
    {
      id: 'sticky_bottom',
      label: '3. Sticky Bottom Floating Banner Ad',
      desc: 'Floats at the bottom of the screen with a Close button for high conversions.',
      defaultImg: '/assets/sticky.jpg'
    }
  ];

  return (
    <div>
      <div className="admin-card">
        <div className="admin-card-body">
          <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 4px' }}>Banners & Promotional Placements</h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>
            Fully dynamic banners. Upload or set any image URL and affiliate redirect destination.
          </p>
        </div>
      </div>

      {successMsg && (
        <div style={{ background: '#dcfce7', color: '#166534', padding: '12px', borderRadius: '6px', marginBottom: '20px' }}>
          {successMsg}
        </div>
      )}

      <div style={{ display: 'grid', gap: '20px' }}>
        {bannerCards.map((spec) => {
          const banner = banners.find(b => b.placement === spec.id || b.id === spec.id) || {
            id: spec.id,
            placement: spec.id,
            title: spec.label,
            image_url: spec.defaultImg,
            target_url: '#',
            is_active: 1
          };

          return (
            <div key={spec.id} className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h3 className="admin-card-title">{spec.label}</h3>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0' }}>{spec.desc}</p>
                </div>
                <button onClick={() => openEdit(banner)} className="admin-btn admin-btn-primary admin-btn-sm">
                  Edit Placement
                </button>
              </div>
              <div className="admin-card-body">
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <img
                    src={banner.image_url}
                    alt={banner.title}
                    style={{
                      maxHeight: '80px',
                      maxWidth: '240px',
                      borderRadius: '6px',
                      border: '1px solid #ddd',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: '6px' }}>
                      <strong style={{ fontSize: '13px', color: '#334155' }}>Target URL: </strong>
                      <a href={banner.target_url} target="_blank" rel="noreferrer" style={{ color: '#2563eb', fontSize: '13px' }}>
                        {banner.target_url || 'None'}
                      </a>
                    </div>
                    <span className={`badge-status ${banner.is_active ? 'badge-active' : 'badge-inactive'}`}>
                      {banner.is_active ? 'Live on Website' : 'Hidden'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Banner Modal */}
      {editingBanner && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Edit Banner: {editingBanner.title || editingBanner.placement}</h3>
              <button onClick={() => setEditingBanner(null)} className="modal-close-btn">&times;</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Banner Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Image URL or Path *</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <img
                      src={formData.image_url}
                      alt=""
                      style={{ height: '40px', width: '70px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <input
                      type="text"
                      className="form-control"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Target Destination URL (Clicks go here) *</label>
                  <input
                    type="url"
                    className="form-control"
                    value={formData.target_url}
                    onChange={(e) => setFormData({ ...formData, target_url: e.target.value })}
                    required
                  />
                </div>
                <div style={{ marginTop: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_active === 1}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked ? 1 : 0 })}
                    />
                    <span><strong>Active Banner</strong> (Displayed to website visitors)</span>
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setEditingBanner(null)} className="admin-btn admin-btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
