import React from 'react';

export default function Footer({ settings = {} }) {
  const logoSrc = settings.logo_url || '/assets/logo.png';
  const telegram = settings.telegram_link || 'https://telegram.me/luckymind09';
  const whatsapp = settings.whatsapp_link || 'https://whatsapp.com/channel/0029VaFt6OaKgsNsJ7UF1739';
  const youtube = settings.youtube_link || 'https://youtube.com/@Zooroulettetricks?si=h1Z74oiZIfbz_D8-';

  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-logo">
          <img src={logoSrc} alt={settings.site_name || 'Best Rummy Apps'} />
        </div>

        <div className="footer-contact">
          <h2>Contact Us</h2>
          <h3>For promotion & sponsorship</h3>
          {settings.contact_email && <p style={{ fontSize: '13px', marginTop: '4px', opacity: 0.8 }}>Email: {settings.contact_email}</p>}
        </div>

        <div className="footer-social">
          <h2>Follow Us</h2>
          <div className="social-icons-wrapper">
            <a href={telegram} target="_blank" rel="noopener noreferrer" title="Telegram Channel">
              <img src="/assets/telegram.png" alt="Telegram" />
            </a>
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" title="WhatsApp Channel">
              <img src="/assets/whatsapp.png" alt="WhatsApp" />
            </a>
            <a href={youtube} target="_blank" rel="noopener noreferrer" title="YouTube Channel">
              <img src="/assets/youtube.png" alt="YouTube" />
            </a>
          </div>
        </div>

        <div className="footer-copyright">
          <p>{settings.footer_text || 'Copyright © Best Rummy Apps All Rights Reserved'}</p>
        </div>
      </div>
    </footer>
  );
}
