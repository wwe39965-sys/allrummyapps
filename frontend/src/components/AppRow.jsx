import React from 'react';

export default function AppRow({ app, rank }) {
  const getRankClass = (r) => {
    if (r === 1) return 'rank-top rank-gold';
    if (r === 2) return 'rank-top rank-silver';
    if (r === 3) return 'rank-top rank-bronze';
    return 'rank-regular';
  };

  return (
    <div className="app-row">
      <div className="app-left">
        <span className={`app-rank ${getRankClass(rank)}`}>
          {rank}
        </span>
        <img 
          src={app.icon_url || '/assets/logo.png'} 
          alt={app.name} 
          className="app-icon"
          loading="lazy"
        />
        <div className="app-details">
          <div className="app-header-line">
            <h3 className="app-name">{app.name}</h3>
            {app.badge_text && <span className="app-mini-badge">{app.badge_text}</span>}
          </div>
          <div className="app-badges-line">
            <span className="badge-tag tag-downloads">
              <i className="fa fa-arrow-down" style={{ fontSize: '10px' }}></i> {app.downloads_count || '100k+'}
            </span>
            <span className="badge-tag tag-bonus">
              Bonus: {app.bonus_amount || '₹51'}
            </span>
            <span className="badge-tag tag-withdrawal">
              Min. {app.min_withdrawal || '₹100'}
            </span>
          </div>
        </div>
      </div>
      <a 
        href={`/go/${encodeURIComponent(app.id)}?placement=list`} 
        className="app-download-btn"
      >
        <i className="fa fa-download"></i> Download
      </a>
    </div>
  );
}
