import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Leaf, MessageCircle, BarChart3, Trash2, BookOpen, Wheat,
  LogOut, Globe, Menu, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import toast from 'react-hot-toast';

const Sidebar = () => {
  const { user, userProfile, logout } = useAuth();
  const { t, lang, changeLanguage } = useLanguage();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    toast.success(lang === 'ta' ? 'வெற்றிகரமாக வெளியேறினீர்கள்!' : 'Signed out successfully');
  };

  const displayName = userProfile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'User';
  const initial = displayName[0].toUpperCase();

  const NAV = [
    {
      section: lang === 'ta' ? 'AI கருவிகள்' : 'AI Tools',
      links: [
        { to: '/chat',      label: 'AI Chat',      tKey: 'nav_chat',      icon: MessageCircle },
        { to: '/farming',   label: 'Farming',       tKey: 'nav_farming',   icon: Wheat         },
        { to: '/waste',     label: 'Waste AI',      tKey: 'nav_waste',     icon: Trash2        },
        { to: '/schemes',   label: 'Schemes',       tKey: 'nav_schemes',   icon: BookOpen      },
      ],
    },
    {
      section: lang === 'ta' ? 'புள்ளியியல்' : 'Insights',
      links: [
        { to: '/analytics', label: 'Dashboard',     tKey: 'nav_analytics', icon: BarChart3     },
      ],
    },
  ];

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Leaf size={18} color="#0b0f1a" strokeWidth={2.5} />
        </div>
        <span className="sidebar-logo-text">Eco<span>Bot</span> AI</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {NAV.map(({ section, links }) => (
          <div key={section}>
            <div className="sidebar-section-label">{section}</div>
            {links.map(({ to, tKey, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={16} className="icon" />
                {t(tKey)}
              </NavLink>
            ))}
          </div>
        ))}

        {/* Language toggle */}
        <div style={{ marginTop: '8px' }}>
          <div className="sidebar-section-label">{t('language')}</div>
          <button
            className="sidebar-link"
            onClick={() => changeLanguage(lang === 'en' ? 'ta' : 'en')}
            style={{ cursor: 'pointer', background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
          >
            <Globe size={16} className="icon" />
            {lang === 'en' ? '🇮🇳 Switch to Tamil' : '🌐 Switch to English'}
          </button>
        </div>
      </nav>

      {/* User profile at bottom */}
      <div className="sidebar-bottom">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="sidebar-user" style={{ flex: 1 }}>
            <div className="sidebar-avatar">{initial}</div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {displayName}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.email || 'demo@ecobot.ai'}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-ghost btn-sm"
            title={t('nav_sign_out')}
            style={{ padding: '6px', borderRadius: '8px', flexShrink: 0 }}
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column' }}>
        <SidebarContent />
      </aside>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        style={{
          display: 'none',
          position: 'fixed', top: '14px', left: '16px',
          zIndex: 200, background: 'var(--bg-2)',
          border: '1px solid var(--border-2)',
          borderRadius: '8px', padding: '7px',
          cursor: 'pointer', color: 'var(--text-1)',
        }}
        className="mobile-menu-btn"
      >
        <Menu size={18} />
      </button>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 150 }}
            />
            <motion.aside
              initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              style={{
                position: 'fixed', top: 0, left: 0,
                width: 240, height: '100vh',
                background: 'var(--bg-2)', borderRight: '1px solid var(--border)',
                display: 'flex', flexDirection: 'column',
                zIndex: 160,
              }}
            >
              <button
                onClick={() => setMobileOpen(false)}
                style={{ position: 'absolute', top: '14px', right: '14px', background: 'none', border: 'none', color: 'var(--text-2)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .sidebar { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
};

export default Sidebar;
