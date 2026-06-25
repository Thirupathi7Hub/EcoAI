import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Leaf, Heart } from 'lucide-react';

const Footer = () => {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  const links = {
    [t('footer_platform')]: [
      { label: t('nav_chat'), to: '/chat' },
      { label: t('nav_farming'), to: '/farming' },
      { label: t('nav_waste'), to: '/waste' },
      { label: t('nav_analytics'), to: '/analytics' },
      { label: t('nav_schemes'), to: '/schemes' },
    ],
    [t('footer_company')]: [
      { label: t('nav_about'), to: '/about' },
      { label: t('nav_features'), to: '/features' },
      { label: t('submit'), to: '/contact' },
      { label: 'Responsible AI', to: '/responsible-ai' },
    ],
    [t('footer_sdgs')]: [
      { label: 'SDG 6 — Clean Water', to: '/features#sdg6' },
      { label: 'SDG 9 — Innovation', to: '/features#sdg9' },
      { label: 'SDG 11 — Communities', to: '/features#sdg11' },
      { label: 'SDG 13 — Climate', to: '/features#sdg13' },
    ],
  };

  const socialLinks = [
    { emoji: '🐙', href: '#', label: 'GitHub', text: 'GitHub' },
    { emoji: '🐦', href: '#', label: 'Twitter', text: 'Twitter' },
    { emoji: '💼', href: '#', label: 'LinkedIn', text: 'LinkedIn' },
  ];

  return (
    <footer style={{
      background: 'rgba(6, 11, 21, 0.98)',
      borderTop: '1px solid rgba(0, 208, 132, 0.15)',
      padding: '48px 24px 30px',
      marginTop: 'auto',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          marginBottom: '48px',
        }}>
          {/* Brand */}
          <div>
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '36px', height: '36px',
                background: 'linear-gradient(135deg, #00d084, #10b981)',
                borderRadius: '9px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Leaf size={20} color="#0a0f1e" strokeWidth={2.5} />
              </div>
              <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '18px', color: '#00d084' }}>
                EcoBot AI
              </span>
            </Link>
            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.7', maxWidth: '240px' }}>
              {t('footer_tagline')}
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
              {socialLinks.map(({ emoji, href, label, text }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '6px 10px', gap: '4px',
                    background: 'rgba(26, 45, 74, 0.6)',
                    border: '1px solid rgba(0, 208, 132, 0.15)',
                    borderRadius: '8px',
                    color: '#64748b',
                    transition: 'all 0.2s',
                    textDecoration: 'none',
                    fontSize: '13px',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#00d084'; e.currentTarget.style.borderColor = 'rgba(0,208,132,0.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = 'rgba(0,208,132,0.15)'; }}
                >
                  <span>{emoji}</span>
                  {text}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h4 style={{ color: '#00d084', fontWeight: 700, fontSize: '14px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {section}
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', padding: 0 }}>
                {items.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      style={{ color: '#64748b', fontSize: '14px', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.target.style.color = '#00d084'}
                      onMouseLeave={e => e.target.style.color = '#64748b'}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(26, 45, 74, 0.8)',
          paddingTop: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <p style={{ color: '#475569', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
              © {year} {t('footer_copyright')}. {t('footer_made_with')} <Heart size={14} color="#ef4444" fill="#ef4444" /> {t('footer_for')}.
            </p>
            <p style={{ color: 'var(--primary)', fontSize: '12px', fontWeight: 600, margin: 0 }}>
              {t('footer_copyright') === 'EcoBot AI' ? 'Created by Tamilraj, Thirupathi & Nitesh' : 'உருவாக்கியவர்கள்: தமிழ்ராஜ், திருப்பதி மற்றும் நிதேஷ்'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['SDG 6', 'SDG 9', 'SDG 11', 'SDG 13'].map((sdg, i) => (
              <span key={sdg} style={{
                padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 600,
                background: ['rgba(14,165,233,0.15)', 'rgba(139,92,246,0.15)', 'rgba(245,158,11,0.15)', 'rgba(0,208,132,0.15)'][i],
                color: ['#0ea5e9', '#8b5cf6', '#f59e0b', '#00d084'][i],
                border: `1px solid ${['rgba(14,165,233,0.3)', 'rgba(139,92,246,0.3)', 'rgba(245,158,11,0.3)', 'rgba(0,208,132,0.3)'][i]}`,
              }}>
                {sdg}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
