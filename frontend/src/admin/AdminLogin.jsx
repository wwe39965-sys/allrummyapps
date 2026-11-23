import React, { useState } from 'react';

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await onLogin(password);
    } catch (err) {
      setError(err.message || 'Incorrect admin password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f1f5f9',
      padding: '20px'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '36px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            background: '#e60009',
            color: 'white',
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            fontWeight: 'bold',
            margin: '0 auto 12px'
          }}>
            R
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1e293b', margin: '0 0 6px' }}>
            Admin Portal
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
            Sign in to manage apps, banners, categories & analytics
          </p>
        </div>

        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#b91c1c',
            padding: '10px 14px',
            borderRadius: '6px',
            fontSize: '13px',
            marginBottom: '16px',
            border: '1px solid #fca5a5'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="adminPassword">Master Password</label>
            <input
              id="adminPassword"
              type="password"
              className="form-control"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '10px' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div style={{
          marginTop: '24px',
          padding: '12px',
          background: '#f8fafc',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#64748b',
          textAlign: 'center'
        }}>
          <strong>Default credentials:</strong> Password is <code>admin123</code> (can be customized in settings)
        </div>
      </div>
    </div>
  );
}
