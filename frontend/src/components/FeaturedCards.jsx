import React from 'react';

export default function FeaturedCards({ apps = [] }) {
  const featured = apps.filter(a => a.is_featured === 1);
  if (!featured.length) return null;

  // Take top 3 for the podium layout
  const displayCards = featured.slice(0, 3);
  const centerIndex = displayCards.length === 3 ? 1 : 0;

  return (
    <div className="featured-section">
      <div className="featured-podium-wrapper">
        {displayCards.map((app, index) => {
          const isCenter = index === centerIndex;
          return (
            <div 
              className={`featured-card ${isCenter ? 'featured-card-center' : 'featured-card-side'}`} 
              key={app.id}
            >
              {isCenter && (
                <div className="podium-crown-badge">
                  <span>★ #1 TOP PICK ★</span>
                </div>
              )}
              <img 
                src={app.icon_url || '/assets/logo.png'} 
                alt={app.name} 
                className="app-thumb"
                loading="lazy"
              />
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((i) => (
                  <img key={i} src="/assets/star.gif" alt="star" />
                ))}
              </div>
              <div className="featured-title" title={app.name}>{app.name}</div>
              <div className="featured-badge">{app.badge_text || '100% Secure'}</div>
              <a 
                href={`/go/${encodeURIComponent(app.id)}?placement=featured`} 
                className={`featured-btn ${isCenter ? 'featured-btn-center' : ''}`}
              >
                Download
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
