import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, NavLink, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import Sidebar from './components/layout/Sidebar';
import LoadingScreen from './components/ui/LoadingScreen';
import { Leaf } from 'lucide-react';

// Lazy pages
const LandingPage        = lazy(() => import('./pages/LandingPage'));
const FeaturesPage       = lazy(() => import('./pages/FeaturesPage'));
const ChatPage           = lazy(() => import('./pages/ChatPage'));
const WasteDetectionPage = lazy(() => import('./pages/WasteDetectionPage'));
const AnalyticsDashboard = lazy(() => import('./pages/AnalyticsDashboard'));
const SchemesPage        = lazy(() => import('./pages/SchemesPage'));
const FarmingPage        = lazy(() => import('./pages/FarmingPage'));
const AboutPage          = lazy(() => import('./pages/AboutPage'));
const ContactPage        = lazy(() => import('./pages/ContactPage'));
const AuthPage           = lazy(() => import('./pages/AuthPage'));
const ResponsibleAI      = lazy(() => import('./pages/ResponsibleAI'));
const LanguageSelectPage = lazy(() => import('./pages/LanguageSelectPage'));

// ── Route Guards ─────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return user ? children : <Navigate to="/login" replace />;
};

const PostLoginRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  const hasChosen = localStorage.getItem('ecobot_language_selected') === 'true';
  if (!hasChosen) return <Navigate to="/language-select" replace />;
  return children;
};

// ── Public Topbar ────────────────────────────────
const PublicTopbar = () => {
  const { user } = useAuth();
  return (
    <header className="topbar">
      <Link to="/" className="topbar-logo">
        <div className="topbar-logo-icon">
          <Leaf size={16} color="#0b0f1a" strokeWidth={2.5} />
        </div>
        <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '17px', color: 'var(--text-1)' }}>
          Eco<span style={{ color: 'var(--primary)' }}>Bot</span> AI
        </span>
      </Link>

      <nav className="topbar-nav" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <NavLink to="/features" className={({ isActive }) => `topbar-link${isActive ? ' active' : ''}`}>Features</NavLink>
        <NavLink to="/about"    className={({ isActive }) => `topbar-link${isActive ? ' active' : ''}`}>About</NavLink>
        <NavLink to="/contact"  className={({ isActive }) => `topbar-link${isActive ? ' active' : ''}`}>Contact</NavLink>
      </nav>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {user ? (
          <Link to="/chat">
            <button className="btn btn-primary btn-sm">Open App →</button>
          </Link>
        ) : (
          <>
            <Link to="/login"><button className="btn btn-ghost btn-sm">Sign In</button></Link>
            <Link to="/login"><button className="btn btn-primary btn-sm">Get Started</button></Link>
          </>
        )}
      </div>
    </header>
  );
};

// ── App Layout: authenticated (sidebar) ──────────
const AppLayout = ({ children }) => (
  <div className="app-layout">
    <Sidebar />
    <main className="main-content">
      <Suspense fallback={<LoadingScreen />}>
        {children}
      </Suspense>
    </main>
  </div>
);

// ── Public Layout: topbar + content ──────────────
const PublicLayout = ({ children }) => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <PublicTopbar />
    <main style={{ flex: 1 }}>
      <Suspense fallback={<LoadingScreen />}>
        {children}
      </Suspense>
    </main>
    <PublicFooter />
  </div>
);

// ── Minimal Footer ────────────────────────────────
const PublicFooter = () => (
  <footer style={{
    borderTop: '1px solid var(--border)',
    padding: '24px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    flexWrap: 'wrap', gap: '12px',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ width: '24px', height: '24px', borderRadius: '7px', background: 'linear-gradient(135deg, var(--primary), var(--primary-dk))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Leaf size={13} color="#0b0f1a" />
      </div>
      <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '15px', color: 'var(--text-1)' }}>EcoBot AI</span>
    </div>
    <div style={{ display: 'flex', gap: '20px' }}>
      <Link to="/features" style={{ color: 'var(--text-3)', fontSize: '13px', textDecoration: 'none' }}>Features</Link>
      <Link to="/about"    style={{ color: 'var(--text-3)', fontSize: '13px', textDecoration: 'none' }}>About</Link>
      <Link to="/responsible-ai" style={{ color: 'var(--text-3)', fontSize: '13px', textDecoration: 'none' }}>Responsible AI</Link>
    </div>
    <span style={{ color: 'var(--text-3)', fontSize: '12px' }}>© 2025 EcoBot AI · Powered by NVIDIA NIM</span>
  </footer>
);

// ── Routes ────────────────────────────────────────
const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route path="/"               element={<PublicLayout><LandingPage /></PublicLayout>} />
    <Route path="/features"       element={<PublicLayout><FeaturesPage /></PublicLayout>} />
    <Route path="/about"          element={<PublicLayout><AboutPage /></PublicLayout>} />
    <Route path="/contact"        element={<PublicLayout><ContactPage /></PublicLayout>} />
    <Route path="/responsible-ai" element={<PublicLayout><ResponsibleAI /></PublicLayout>} />
    <Route path="/login"          element={<PublicLayout><AuthPage /></PublicLayout>} />

    {/* Language select (protected, no sidebar) */}
    <Route path="/language-select" element={
      <ProtectedRoute>
        <Suspense fallback={<LoadingScreen />}><LanguageSelectPage /></Suspense>
      </ProtectedRoute>
    } />

    {/* App (sidebar layout) */}
    <Route path="/chat"      element={<AppLayout><PostLoginRoute><ChatPage /></PostLoginRoute></AppLayout>} />
    <Route path="/farming"   element={<AppLayout><PostLoginRoute><FarmingPage /></PostLoginRoute></AppLayout>} />
    <Route path="/waste"     element={<AppLayout><PostLoginRoute><WasteDetectionPage /></PostLoginRoute></AppLayout>} />
    <Route path="/schemes"   element={<AppLayout><PostLoginRoute><SchemesPage /></PostLoginRoute></AppLayout>} />
    <Route path="/analytics" element={<AppLayout><PostLoginRoute><AnalyticsDashboard /></PostLoginRoute></AppLayout>} />

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

// ── Root ──────────────────────────────────────────
function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <div className="particles-bg" aria-hidden="true" />
            <AppRoutes />
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: 'var(--bg-2)',
                  color: 'var(--text-1)',
                  border: '1px solid var(--border-2)',
                  borderRadius: '10px',
                  fontSize: '14px',
                },
                success: { iconTheme: { primary: 'var(--primary)', secondary: 'var(--bg-2)' } },
                error:   { iconTheme: { primary: '#ef4444', secondary: 'var(--bg-2)' } },
              }}
            />
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
