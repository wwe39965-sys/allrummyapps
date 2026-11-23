import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function CategoriesManager({ categories, onCreateCategory, onUpdateCategory, onDeleteCategory }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ title: '', id: '', is_active: 1 });

  const openAdd = () => {
    setEditingCategory(null);
    setFormData({ title: '', id: '', is_active: 1 });
    setIsModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({ title: cat.title, id: cat.id, is_active: cat.is_active });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCategory) {
      onUpdateCategory(editingCategory.id, formData);
    } else {
      onCreateCategory(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="admin-card">
        <div className="admin-card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 4px' }}>Category Navigation Tabs</h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>
              Create and manage category filters shown on the homepage (e.g., Best For All, New Apps, Other Apps).
            </p>
          </div>
          <button onClick={openAdd} className="admin-btn admin-btn-primary">
            <Plus size={16} /> Add Category Tab
          </button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-body" style={{ padding: 0 }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Category Tab Title</th>
                <th>Identifier / Slug</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td><strong style={{ fontSize: '14px' }}>{cat.title}</strong></td>
                  <td><code>{cat.id}</code></td>
                  <td>
                    <span className={`badge-status ${cat.is_active ? 'badge-active' : 'badge-inactive'}`}>
                      {cat.is_active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button onClick={() => openEdit(cat)} className="admin-btn admin-btn-secondary admin-btn-sm">
                        <Edit2 size={13} /> Edit
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm(`Delete category "${cat.title}"?`)) {
                            onDeleteCategory(cat.id);
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
          <div className="modal-card" style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h3>{editingCategory ? 'Edit Category' : 'Add Category'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="modal-close-btn">&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Tab Title (Shows on website) *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Best For All"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                {!editingCategory && (
                  <div className="form-group">
                    <label>Unique ID / Key (Optional)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. best or new-apps"
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    />
                  </div>
                )}
                <div style={{ marginTop: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_active === 1}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked ? 1 : 0 })}
                    />
                    <span>Active tab on website</span>
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="admin-btn admin-btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
