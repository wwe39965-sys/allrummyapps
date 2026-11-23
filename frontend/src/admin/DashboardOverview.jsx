import React from 'react';
import { Users, Eye, MousePointerClick, TrendingUp, Smartphone, ArrowRight, Plus } from 'lucide-react';

export default function DashboardOverview({ analyticsData, onNavigate, onOpenAddApp }) {
  const totals = analyticsData?.totals || { visitors: 0, visits: 0, views: 0, impressions: 0, clicks: 0 };
  const apps = analyticsData?.apps || [];
  const feed = analyticsData?.feed || [];

  const overallCtr = totals.impressions > 0 
    ? Math.round((totals.clicks / totals.impressions) * 1000) / 10 
    : 0;

  return (
    <div>
      {/* 1. Stat Cards Grid */}
      <div className="stat-cards-grid">
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#dbeafe', color: '#1e40af' }}>
            <Users size={24} />
          </div>
          <div className="stat-card-info">
            <h4>Unique Visitors</h4>
            <div className="stat-value">{Number(totals.visitors || 0).toLocaleString()}</div>
            <div className="stat-sub">{totals.visits || 0} total sessions</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#e0e7ff', color: '#3730a3' }}>
            <Eye size={24} />
          </div>
          <div className="stat-card-info">
            <h4>Page Views</h4>
            <div className="stat-value">{Number(totals.views || 0).toLocaleString()}</div>
            <div className="stat-sub">Across directory pages</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#fee2e2', color: '#b91c1c' }}>
            <MousePointerClick size={24} />
          </div>
          <div className="stat-card-info">
            <h4>App Downloads/Clicks</h4>
            <div className="stat-value">{Number(totals.clicks || 0).toLocaleString()}</div>
            <div className="stat-sub">Direct outbound redirects</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#dcfce7', color: '#166534' }}>
            <TrendingUp size={24} />
          </div>
          <div className="stat-card-info">
            <h4>Average Click CTR</h4>
            <div className="stat-value">{overallCtr}%</div>
            <div className="stat-sub">{totals.impressions || 0} card impressions</div>
          </div>
        </div>
      </div>

      {/* 2. Quick Actions Banner */}
      <div className="admin-card" style={{ background: 'linear-gradient(135deg, #1b0058 0%, #2a0082 100%)', color: 'white' }}>
        <div className="admin-card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 5px', color: '#fff' }}>Quick Management</h3>
            <p style={{ margin: 0, opacity: 0.85, fontSize: '13px' }}>
              Add new Rummy apps, update the top marquee ticker, or check live click conversion.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => onNavigate('apps')} 
              className="admin-btn"
              style={{ background: '#e60009', color: '#fff' }}
            >
              <Smartphone size={16} /> Manage Apps
            </button>
            <button 
              onClick={() => onNavigate('analytics')} 
              className="admin-btn admin-btn-secondary"
            >
              <TrendingUp size={16} /> View Full Analytics
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {/* Top 5 Apps by Clicks */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Top Converting Apps</h3>
            <button 
              onClick={() => onNavigate('apps')} 
              className="admin-btn admin-btn-secondary admin-btn-sm"
            >
              All Apps <ArrowRight size={13} />
            </button>
          </div>
          <div className="admin-card-body" style={{ padding: 0 }}>
            {apps.length > 0 ? (
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>App</th>
                      <th>Bonus</th>
                      <th>Clicks</th>
                      <th>CTR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apps.slice(0, 5).map((app) => (
                      <tr key={app.app_id}>
                        <td style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img 
                            src={app.icon_url || '/assets/logo.png'} 
                            alt="" 
                            style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover' }} 
                          />
                          <strong style={{ fontSize: '13px' }}>{app.name}</strong>
                        </td>
                        <td style={{ color: '#e60009', fontWeight: 700 }}>{app.bonus_amount || '—'}</td>
                        <td><strong>{app.clicks || 0}</strong></td>
                        <td>
                          <span style={{ 
                            fontWeight: 700, 
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
            ) : (
              <p style={{ padding: '20px', color: '#64748b', textAlign: 'center' }}>No app activity recorded yet.</p>
            )}
          </div>
        </div>

        {/* Real-time Click & Visitor Feed */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Live Activity Feed (Real-Time)</h3>
            <button 
              onClick={() => onNavigate('analytics')} 
              className="admin-btn admin-btn-secondary admin-btn-sm"
            >
              Full Log <ArrowRight size={13} />
            </button>
          </div>
          <div className="admin-card-body" style={{ padding: 0 }}>
            <div className="analytics-feed-list">
              {feed.slice(0, 8).map((event) => (
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
              {feed.length === 0 && (
                <p style={{ padding: '20px', color: '#64748b', textAlign: 'center' }}>No recent activity.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
