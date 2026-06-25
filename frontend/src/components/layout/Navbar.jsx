import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import toast from 'react-hot-toast';
import {
  Leaf, MessageCircle, BarChart3, Trash2, BookOpen, Wheat,
  Sun, Moon, Menu, X, LogOut, User, ChevronDown, Zap
} from 'lucide-react';

const navLinks = [
  { to: '/', labelKey: 'nav_home', icon: Leaf },
  { to: '/features', labelKey: 'nav_features', icon: Zap },
  { to: '/chat', labelKey: 'nav_chat', icon: MessageCircle, protected: true },
  { to: '/farming', labelKey: 'nav_farming', icon: Wheat, protected: true },
  { to: '/waste', labelKey: 'nav_waste', icon: Trash2, protected: true },
  { to: '/analytics', labelKey: 'nav_analytics', icon: BarChart3, protected: true },
  { to: '/schemes', labelKey: 'nav_schemes', icon: BookOpen, protected: true },
  { to: '/about', labelKey: 'nav_about', icon: User },
];

const Navbar = () => {
  const { user, userProfile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, lang, changeLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const visibleLinks = navLinks.filter(l => !l.protected || user);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: scrolled
          ? 'rgba(6, 11, 21, 0.95)'
          : 'rgba(6, 11, 21, 0.7)',
        backdropFilter: 'blur(20px)',
        borderBottom: scrolled
          ? '1px solid rgba(0, 208, 132, 0.2)'
          : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px', height: '40px',
              background: 'linear-gradient(135deg, #00d084, #10b981)',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 15px rgba(0, 208, 132, 0.4)',
            }}>
              <Leaf size={22} color="#0a0f1e" strokeWidth={2.5} />
            </div>
            <div>
              <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '20px', color: '#00d084' }}>EcoBot</span>
              <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 400, fontSize: '20px', color: '#94a3b8' }}> AI</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, justifyContent: 'center' }}
            className="hidden-mobile">
            {visibleLinks.map(({ to, labelKey }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '14px' }}
              >
                {t(labelKey)}
              </NavLink>
            ))}
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              id="theme-toggle-btn"
              style={{
                background: 'rgba(26, 45, 74, 0.6)',
                border: '1px solid rgba(0, 208, 132, 0.2)',
                borderRadius: '8px',
                padding: '8px',
                cursor: 'pointer',
                color: '#94a3b8',
                display: 'flex', alignItems: 'center',
                transition: 'all 0.2s',
              }}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              <div ref={profileRef} style={{ position: 'relative' }}>
                <button
                  id="profile-menu-btn"
                  onClick={() => setProfileOpen(!profileOpen)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    background: 'rgba(26, 45, 74, 0.6)',
                    border: '1px solid rgba(0, 208, 132, 0.2)',
                    borderRadius: '10px',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    color: '#f0fdf4',
                  }}
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="avatar" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                  ) : (
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #00d084, #10b981)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', fontWeight: 700, color: '#0a0f1e',
                    }}>
                      {(userProfile?.displayName || user.email || 'E')[0].toUpperCase()}
                    </div>
                  )}
                  <span style={{ fontSize: '13px', fontWeight: 600, maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {userProfile?.displayName || 'User'}
                  </span>
                  <ChevronDown size={14} color="#94a3b8" />
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        position: 'absolute', top: '110%', right: 0,
                        background: 'rgba(13, 22, 40, 0.98)',
                        border: '1px solid rgba(0, 208, 132, 0.2)',
                        borderRadius: '12px',
                        padding: '8px',
                        minWidth: '180px',
                        backdropFilter: 'blur(20px)',
                      }}
                    >
                      <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(26, 45, 74, 0.8)', marginBottom: '4px' }}>
                        <p style={{ color: '#00d084', fontWeight: 600, fontSize: '13px' }}>{userProfile?.displayName}</p>
                        <p style={{ color: '#64748b', fontSize: '11px' }}>{user.email}</p>
                      </div>
                      <Link to="/analytics" style={{ textDecoration: 'none' }}>
                        <button style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', color: '#94a3b8', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}
                          onMouseEnter={e => e.target.style.color = '#00d084'}
                          onMouseLeave={e => e.target.style.color = '#94a3b8'}>
                          <BarChart3 size={14} /> {t('nav_dashboard')}
                        </button>
                      </Link>
                      <button
                        id="logout-btn"
                        onClick={handleLogout}
                        style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', color: '#94a3b8', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                        onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
                      >
                        <LogOut size={14} /> {t('nav_sign_out')}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" id="login-nav-btn">
                <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '14px' }}>
                  {t('nav_get_started')}
                </button>
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                display: 'none',
                background: 'rgba(26, 45, 74, 0.6)',
                border: '1px solid rgba(0, 208, 132, 0.2)',
                borderRadius: '8px',
                padding: '8px',
                cursor: 'pointer',
                color: '#94a3b8',
              }}
              className="show-mobile"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: 'rgba(6, 11, 21, 0.98)',
              borderTop: '1px solid rgba(0, 208, 132, 0.15)',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {visibleLinks.map(({ to, labelKey, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  style={{ textDecoration: 'none' }}
                >
                  {({ isActive }) => (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '10px 14px', borderRadius: '10px',
                      background: isActive ? 'rgba(0, 208, 132, 0.1)' : 'transparent',
                      color: isActive ? '#00d084' : '#94a3b8',
                      fontWeight: 500, fontSize: '15px',
                    }}>
                      <Icon size={18} />
                      {t(labelKey)}
                    </div>
                  )}
                </NavLink>
              ))}
              {!user && (
                <Link to="/login" style={{ textDecoration: 'none', marginTop: '8px' }}>
                  <button className="btn-primary" style={{ width: '100%', fontSize: '15px' }}>
                    Get Started — Free
                  </button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 900px) {
          .hidden-mobile { display: none !important; }
          #login-nav-btn { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </motion.nav>
  );
};

export default Navbar;
