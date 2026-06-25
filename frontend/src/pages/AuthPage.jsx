import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AuthPage = () => {
  const navigate = useNavigate();
  const { loginWithEmail, registerWithEmail, loginWithGoogle, isMock } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await loginWithEmail(form.email, form.password);
      } else {
        if (!form.name.trim()) { setError('Full name is required'); setLoading(false); return; }
        await registerWithEmail(form.email, form.password, form.name);
      }
      toast.success(mode === 'login' ? 'Welcome back!' : 'Account created!');
      navigate('/language-select');
    } catch (err) {
      setError(err.message || 'Authentication failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Signed in with Google!');
      navigate('/language-select');
    } catch (err) {
      setError(err.message || 'Google sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  const PERKS = [
    'AI-powered farming guidance',
    'Water conservation tips',
    'Waste classification AI',
    '50+ Government schemes',
    'Tamil & English support',
    'Voice input & response',
  ];

  return (
    <div style={{ minHeight: '92vh', display: 'flex', alignItems: 'stretch' }}>

      {/* ── Left panel (branding) ── */}
      <div style={{
        flex: '0 0 420px', display: 'none',
        background: 'linear-gradient(160deg, var(--bg-2) 0%, var(--bg) 100%)',
        borderRight: '1px solid var(--border)',
        padding: '48px 40px',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }} className="auth-left">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '48px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '11px', background: 'linear-gradient(135deg, var(--primary), var(--primary-dk))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Leaf size={20} color="#0b0f1a" strokeWidth={2.5} />
            </div>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '20px', color: 'var(--text-1)' }}>EcoBot AI</span>
          </div>

          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '28px', fontWeight: 800, color: 'var(--text-1)', marginBottom: '12px', lineHeight: 1.25 }}>
            Smart sustainability<br />for rural India
          </h2>
          <p style={{ color: 'var(--text-3)', fontSize: '15px', lineHeight: 1.7, marginBottom: '36px' }}>
            Powered by NVIDIA NIM AI — empowering villages with intelligent guidance.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {PERKS.map(p => (
              <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle size={16} color="var(--primary)" />
                <span style={{ fontSize: '14px', color: 'var(--text-2)' }}>{p}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ color: 'var(--text-3)', fontSize: '12px' }}>
          © 2025 EcoBot AI · Powered by NVIDIA NIM
        </div>
      </div>

      {/* ── Right panel (form) ── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ width: '100%', maxWidth: '400px' }}
        >
          {/* Logo (mobile) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', justifyContent: 'center' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--primary), var(--primary-dk))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Leaf size={18} color="#0b0f1a" strokeWidth={2.5} />
            </div>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '20px', color: 'var(--text-1)' }}>EcoBot AI</span>
          </div>

          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '24px', fontWeight: 800, color: 'var(--text-1)', marginBottom: '6px', textAlign: 'center' }}>
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h1>
          <p style={{ color: 'var(--text-3)', fontSize: '14px', textAlign: 'center', marginBottom: '28px' }}>
            {mode === 'login' ? 'Sign in to your EcoBot AI account' : 'Join EcoBot AI for free'}
          </p>

          {/* Google button */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="btn btn-secondary"
            style={{ width: '100%', justifyContent: 'center', marginBottom: '20px', padding: '11px', gap: '10px' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            <span style={{ color: 'var(--text-3)', fontSize: '12px' }}>or with email</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {mode === 'register' && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
                  <input
                    type="text" required
                    value={form.name} onChange={set('name')}
                    placeholder="Your full name"
                    className="form-input"
                    style={{ paddingLeft: '38px' }}
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
                <input
                  type="email" required
                  value={form.email} onChange={set('email')}
                  placeholder="your@email.com"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
                <input
                  type={showPass ? 'text' : 'password'} required
                  value={form.password} onChange={set('password')}
                  placeholder="••••••••"
                  className="form-input"
                  style={{ paddingLeft: '38px', paddingRight: '38px' }}
                  minLength={6}
                />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  style={{ position: 'absolute', right: '11px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: '2px' }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#ef4444', fontSize: '13px' }}>
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
              {loading ? '⏳ Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Toggle */}
          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--text-3)' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
              style={{ color: 'var(--primary)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>
              {mode === 'login' ? 'Register free' : 'Sign in'}
            </button>
          </p>

          {/* Demo mode notice */}
          {isMock && (
            <div style={{ marginTop: '20px', padding: '10px 14px', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '10px', fontSize: '12px', color: '#93c5fd', lineHeight: 1.6 }}>
              💡 <strong>Demo Mode:</strong> Use any email/password or click "Continue with Google" to sign in instantly.
            </div>
          )}
        </motion.div>
      </div>

      <style>{`
        @media (min-width: 860px) { .auth-left { display: flex !important; } }
      `}</style>
    </div>
  );
};

export default AuthPage;
