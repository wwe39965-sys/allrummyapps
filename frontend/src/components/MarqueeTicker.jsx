import React from 'react';

export default function MarqueeTicker({ text }) {
  if (!text) return null;
  return (
    <div className="marquee-container">
      <div className="marquee-pill-label">
        <span className="pulse-dot"></span>
        <span>UPDATE</span>
      </div>
      <div className="marquee-track">
        <marquee scrollamount="6">
          {text}
        </marquee>
      </div>
    </div>
  );
}
