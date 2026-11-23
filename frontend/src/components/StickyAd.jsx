import React, { useState } from 'react';

export default function StickyAd({ banner, enabled = true }) {
  const [closed, setClosed] = useState(false);

  if (closed || !enabled || !banner || !banner.is_active) return null;

  return (
    <div className="sticky-ad-container" id="All_Rummy_Sticky-Ads_App">
      <button 
        className="sticky-ad-close" 
        onClick={() => setClosed(true)}
        aria-label="Close Ad"
      >
        <i className="fa">&#xf00d;</i> Close
      </button>
      <div className="sticky-ad-content">
        <a href={banner.target_url || '#'} target="_blank" rel="noopener noreferrer">
          <img 
            src={banner.image_url || '/assets/sticky.jpg'} 
            alt={banner.title || 'Special Rummy App Link'} 
          />
        </a>
      </div>
    </div>
  );
}
