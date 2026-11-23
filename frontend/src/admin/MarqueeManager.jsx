import React, { useState } from 'react';

export default function MarqueeManager({ settings, onUpdateSettings }) {
  const [tickerText, setTickerText] = useState(
    settings.announcement_ticker || ''
  );
  const [saved, setSaved] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    await onUpdateSettings({ announcement_ticker: tickerText });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">Live Marquee Announcement Ticker</h2>
        </div>
        <div className="admin-card-body">
          <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '16px' }}>
            This yellow announcement ticker continuously scrolls on both desktop and mobile views of the website.
            Edit below to push immediate live announcements (new apps, bonus alerts, warning updates) without changing any code.
          </p>

          {/* Live Preview */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
              Live Website Preview:
            </label>
            <div style={{ padding: '8px 12px', background: '#ffeb3b', border: '1.5px solid #222', borderRadius: '4px' }}>
              <marquee scrollamount="6" style={{ fontWeight: 'bold', color: '#222' }}>
                {tickerText || 'Enter announcement message below...'}
              </marquee>
            </div>
          </div>

          {saved && (
            <div style={{ background: '#dcfce7', color: '#166534', padding: '10px 14px', borderRadius: '6px', marginBottom: '16px' }}>
              Announcement updated live on the website!
            </div>
          )}

          <form onSubmit={handleSave}>
            <div className="form-group">
              <label>Announcement Text</label>
              <textarea
                className="form-control"
                rows={4}
                value={tickerText}
                onChange={(e) => setTickerText(e.target.value)}
                placeholder="Enter ticker message..."
                required
              />
            </div>
            <button type="submit" className="admin-btn admin-btn-primary">
              Publish Notice Live
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
