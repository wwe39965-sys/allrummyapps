import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { BarChart2, RefreshCw, Smartphone, Monitor, Tablet, MousePointer, Eye, Users } from 'lucide-react';

export default function AnalyticsView() {
  const [days, setDays] = useState(7);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async (selectedDays = days) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getAnalytics(selectedDays);
      setData(res);
    } catch (err) {
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(days);
  }, [days]);

  if (loading && !data) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading visitor analytics...</div>;
  }

  const totals = data?.totals || { visitors: 0, visits: 0, views: 0, impressions: 0, clicks: 0 };
  const apps = data?.apps || [];
  const devices = data?.devices || [];
  const dates = data?.dates || [];
  const feed = data?.feed || [];

  const maxViews = Math.max(1, ...dates.map(d => d.views || 0));

  // Device percentage calculation
  const totalDeviceHits = devices.reduce((sum, d) => sum + (d.views + d.clicks), 0) || 1;

  return (
    <div>
      {/* Header with Period Filter */}
      <div className="admin-card">
        <div className="admin-card-body admin-toolbar">
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 4px' }}>Visitor Analytics & Conversion Tracking</h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>
              Real-time monitoring of user visits, app impressions, and outbound affiliate clicks.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              className="form-control"
              style={{ width: 'auto' }}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
            >
              <option value={1}>Today (Live)</option>
              <option value={7}>Last 7 Days</option>
              <option value={30}>Last 30 Days</option>
              <option value={90}>Last 90 Days</option>
            </select>
            <button onClick={() => loadData(days)} className="admin-btn admin-btn-secondary">
              <RefreshCw size={14} /> Refresh
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stat-cards-grid">
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#dbeafe', color: '#1e40af' }}>
            <Users size={22} />
          </div>
          <div className="stat-card-info">
            <h4>Total Visitors</h4>
            <div className="stat-value">{Number(totals.visitors || 0).toLocaleString()}</div>
            <div className="stat-sub">{totals.visits || 0} browsing sessions</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#e0e7ff', color: '#3730a3' }}>
            <Eye size={22} />
          </div>
          <div className="stat-card-info">
            <h4>Page Views</h4>
            <div className="stat-value">{Number(totals.views || 0).toLocaleString()}</div>
            <div className="stat-sub">Site impressions</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#fee2e2', color: '#b91c1c' }}>
            <MousePointer size={22} />
          </div>
          <div className="stat-card-info">
            <h4>App Clicks</h4>
            <div className="stat-value">{Number(totals.clicks || 0).toLocaleString()}</div>
            <div className="stat-sub">Direct APK downloads</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#dcfce7', color: '#166534' }}>
            <BarChart2 size={22} />
          </div>
          <div className="stat-card-info">
            <h4>Avg. Click-Through</h4>
            <div className="stat-value">
              {totals.impressions > 0 ? Math.round((totals.clicks / totals.impressions) * 1000) / 10 : 0}%
            </div>
            <div className="stat-sub">Conversion rate</div>
          </div>
        </div>
      </div>

      {/* Daily Activity Bar Chart */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">Daily Page Views Trend</h3>
        </div>
        <div className="admin-card-body">
          <div className="simple-bar-chart">
            {dates.map((d) => {
              const heightPercent = Math.max(8, Math.round((d.views / maxViews) * 100));
              return (
                <div key={d.date} className="bar-col">
                  <div className="bar-track" style={{ height: '100%' }}>
                    <div
                      className="bar-fill"
                      style={{ height: `${heightPercent}%` }}
                      title={`${d.date}: ${d.views} views, ${d.clicks} clicks`}
                    ></div>
                  </div>
                  <span className="bar-date">{d.date.slice(5)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {/* Apps Click Conversion Table */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">App Click Tracking & CTR</h3>
          </div>
          <div className="admin-card-body" style={{ padding: 0 }}>
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>App</th>
                    <th>Impressions</th>
                    <th>Clicks</th>
                    <th>CTR %</th>
                  </tr>
                </thead>
                <tbody>
                  {apps.map((app) => (
                    <tr key={app.app_id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img
                            src={app.icon_url || '/assets/logo.png'}
                            alt=""
                            style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover' }}
                          />
                          <strong style={{ fontSize: '13px' }}>{app.name}</strong>
                        </div>
                      </td>
                      <td>{app.impressions || 0}</td>
                      <td><strong style={{ color: '#e60009' }}>{app.clicks || 0}</strong></td>
                      <td>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontWeight: 700,
                          background: app.ctr > 20 ? '#dcfce7' : '#f1f5f9',
                          color: app.ctr > 20 ? '#166534' : '#475569'
                        }}>
                          {app.ctr || 0}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Devices Breakdown & Live Stream */}
        <div>
          {/* Device Distribution */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">Device Breakdown</h3>
            </div>
            <div className="admin-card-body">
              {['Mobile', 'Desktop', 'Tablet'].map((type) => {
                const match = devices.find(d => d.device_type === type);
                const count = match ? (match.views + match.clicks) : 0;
                const percent = Math.round((count / totalDeviceHits) * 100);
                const Icon = type === 'Mobile' ? Smartphone : type === 'Tablet' ? Tablet : Monitor;

                return (
                  <div key={type} style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Icon size={16} /> {type}
                      </span>
                      <strong>{percent}% ({count} events)</strong>
                    </div>
                    <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${percent}%`,
                          background: type === 'Mobile' ? '#e60009' : '#3b82f6',
                          borderRadius: '4px'
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Real-time Event Feed */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">Real-Time User Click Stream</h3>
            </div>
            <div className="admin-card-body" style={{ padding: 0 }}>
              <div className="analytics-feed-list" style={{ maxHeight: '280px' }}>
                {feed.map((event) => (
                  <div key={event.id} className="analytics-feed-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className={`event-type-badge event-${event.event_type}`}>
                        {event.event_type === 'click' ? 'CLICK' : event.event_type === 'impression' ? 'IMPR' : 'VIEW'}
                      </span>
                      <div>
                        <strong style={{ display: 'block', fontSize: '13px' }}>
                          {event.app_name ? event.app_name : event.path}
                        </strong>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                          {new Date(event.timestamp).toLocaleTimeString()} · {event.device_type}
                        </span>
                      </div>
                    </div>
                    <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace' }}>
                      {event.visitor_short}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
