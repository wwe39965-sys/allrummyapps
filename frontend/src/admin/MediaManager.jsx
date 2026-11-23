import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Upload, Trash2, Copy, Check } from 'lucide-react';

export default function MediaManager() {
  const [mediaList, setMediaList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState('');
  const [error, setError] = useState('');

  const loadMedia = async () => {
    try {
      const data = await api.getMedia();
      setMediaList(data);
    } catch (e) {
      setError('Could not load media list.');
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');
    try {
      await api.uploadMedia(file);
      await loadMedia();
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(''), 2500);
  };

  const handleDelete = async (name) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      await api.deleteMedia(name);
      await loadMedia();
    } catch (err) {
      setError(err.message || 'Delete failed');
    }
  };

  return (
    <div>
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">Media Library & Image Uploads</h2>
          <label className="admin-btn admin-btn-primary" style={{ cursor: 'pointer' }}>
            <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload Image'}
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
        </div>
        <div className="admin-card-body">
          <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 20px' }}>
            Upload banners, app icons, and logos. Once uploaded, copy the URL to paste into Apps or Banners.
          </p>

          {error && (
            <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px 14px', borderRadius: '6px', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          {mediaList.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '16px'
            }}>
              {mediaList.map((m) => (
                <div
                  key={m.name}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '10px',
                    background: '#fff',
                    textAlign: 'center'
                  }}
                >
                  <img
                    src={m.url}
                    alt={m.name}
                    style={{
                      width: '100%',
                      height: '110px',
                      objectFit: 'contain',
                      background: '#f8fafc',
                      borderRadius: '6px',
                      marginBottom: '8px'
                    }}
                  />
                  <div style={{
                    fontSize: '11px',
                    color: '#64748b',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    marginBottom: '8px'
                  }}>
                    {m.name}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                    <button
                      onClick={() => copyToClipboard(m.url)}
                      className="admin-btn admin-btn-secondary admin-btn-sm"
                      title="Copy URL"
                    >
                      {copiedUrl === m.url ? <Check size={12} color="#166534" /> : <Copy size={12} />}
                      {copiedUrl === m.url ? 'Copied' : 'Copy'}
                    </button>
                    <button
                      onClick={() => handleDelete(m.name)}
                      className="admin-btn admin-btn-danger admin-btn-sm"
                      title="Delete Image"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#64748b', padding: '30px' }}>
              No images uploaded yet. Click "Upload Image" above to add your first graphic.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
