import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function PagesManager({ pages, onCreatePage, onUpdatePage, onDeletePage }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    type: 'page',
    content: '',
    cover_image: '',
    is_published: 1
  });

  const openAdd = () => {
    setEditingPage(null);
    setFormData({
      title: '',
      slug: '',
      type: 'blog',
      content: '',
      cover_image: '/assets/banner.jpeg',
      is_published: 1
    });
    setIsModalOpen(true);
  };

  const openEdit = (p) => {
    setEditingPage(p);
    setFormData({
      title: p.title,
      slug: p.slug,
      type: p.type || 'page',
      content: p.content || '',
      cover_image: p.cover_image || '',
      is_published: p.is_published
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPage) {
      onUpdatePage(editingPage.id, formData);
    } else {
      onCreatePage(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="admin-card">
        <div className="admin-card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 4px' }}>Pages & Blog Management</h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>
              Edit About Us, Privacy Policy, Download Guide, or publish new SEO blog posts.
            </p>
          </div>
          <button onClick={openAdd} className="admin-btn admin-btn-primary">
            <Plus size={16} /> Create Article / Page
          </button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-body" style={{ padding: 0 }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>URL Slug</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((p) => (
                <tr key={p.id}>
                  <td><strong style={{ fontSize: '14px' }}>{p.title}</strong></td>
                  <td>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      background: p.type === 'blog' ? '#e0e7ff' : '#f1f5f9',
                      color: p.type === 'blog' ? '#3730a3' : '#475569'
                    }}>
                      {p.type?.toUpperCase()}
                    </span>
                  </td>
                  <td><code>/page/{p.slug}</code></td>
                  <td>
                    <span className={`badge-status ${p.is_published ? 'badge-active' : 'badge-inactive'}`}>
                      {p.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button onClick={() => openEdit(p)} className="admin-btn admin-btn-secondary admin-btn-sm">
                        <Edit2 size={13} /> Edit
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete page "${p.title}"?`)) {
                            onDeletePage(p.id);
                          }
                        }}
                        className="admin-btn admin-btn-danger admin-btn-sm"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>{editingPage ? 'Edit Content' : 'Create New Page / Blog'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="modal-close-btn">&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label>Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Content Type</label>
                    <select
                      className="form-control"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option value="page">Standard Page</option>
                      <option value="blog">Blog Article</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>URL Slug *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. download-guide or best-rummy-tips"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Cover Image URL</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="/assets/guide.webp or image URL"
                    value={formData.cover_image}
                    onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Content Body (Supports multi-line text)</label>
                  <textarea
                    className="form-control"
                    rows={8}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  />
                </div>

                <div style={{ marginTop: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_published === 1}
                      onChange={(e) => setFormData({ ...formData, is_published: e.target.checked ? 1 : 0 })}
                    />
                    <span>Publish live on website</span>
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="admin-btn admin-btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Save Page
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
