import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Leaf, Check } from 'lucide-react';

const LANGUAGES = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    desc: 'Use the entire app in English',
    flag: '🇬🇧',
    sample: 'Hello! How can I help you with sustainability today?',
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    desc: 'முழு பயன்பாட்டையும் தமிழில் பயன்படுத்துங்கள்',
    flag: '🇮🇳',
    sample: 'வணக்கம்! இன்று நிலைத்தன்மையில் நான் உங்களுக்கு எப்படி உதவலாம்?',
  },
];

const LanguageSelectPage = () => {
  const navigate = useNavigate();
  const { changeLanguage } = useLanguage();
  const [selected, setSelected] = useState('en');
  const [confirming, setConfirming] = useState(false);

  const handleContinue = async () => {
    setConfirming(true);
    await new Promise(r => setTimeout(r, 400));
    changeLanguage(selected);
    navigate('/chat', { replace: true });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated background */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(0,208,132,0.08) 0%, transparent 70%)',
        }} />
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: '10%', left: '5%',
            width: '400px', height: '400px',
            background: 'radial-gradient(circle, rgba(0,208,132,0.06) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{
            position: 'absolute', bottom: '10%', right: '5%',
            width: '300px', height: '300px',
            background: 'radial-gradient(circle, rgba(14,165,233,0.05) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ maxWidth: '560px', width: '100%', textAlign: 'center' }}
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '32px' }}
        >
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #00d084, #10b981)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 30px rgba(0,208,132,0.5)',
          }}>
            <Leaf size={28} color="#0a0f1e" strokeWidth={2.5} />
          </div>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '28px', color: '#00d084' }}>
            EcoBot AI
          </span>
        </motion.div>

        {/* Heading */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h1 style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
            fontWeight: 800,
            color: '#f0fdf4',
            marginBottom: '12px',
            lineHeight: 1.2,
          }}>
            Welcome to EcoBot AI! 🌍<br />
            <span style={{ fontSize: '0.85em', color: '#64748b' }}>EcoBot AI க்கு வரவேற்கிறோம்!</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '16px', lineHeight: 1.7, marginBottom: '8px' }}>
            Choose your preferred language
          </p>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '40px' }}>
            மொழியை தேர்ந்தெடுக்கவும் — You can change this anytime
          </p>
        </motion.div>

        {/* Language Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
          {LANGUAGES.map((lang, i) => (
            <motion.button
              key={lang.code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              onClick={() => setSelected(lang.code)}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: '24px 20px',
                borderRadius: '20px',
                border: selected === lang.code
                  ? '2px solid #00d084'
                  : '2px solid rgba(26,45,74,0.6)',
                background: selected === lang.code
                  ? 'rgba(0,208,132,0.08)'
                  : 'rgba(13,22,40,0.6)',
                cursor: 'pointer',
                textAlign: 'center',
                position: 'relative',
                backdropFilter: 'blur(12px)',
                boxShadow: selected === lang.code
                  ? '0 0 30px rgba(0,208,132,0.2)'
                  : 'none',
                transition: 'all 0.25s ease',
              }}
            >
              {/* Selected checkmark */}
              {selected === lang.code && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    position: 'absolute', top: '12px', right: '12px',
                    width: '24px', height: '24px', borderRadius: '50%',
                    background: '#00d084',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Check size={14} color="#0a0f1e" strokeWidth={3} />
                </motion.div>
              )}

              <div style={{ fontSize: '42px', marginBottom: '12px' }}>{lang.flag}</div>
              <div style={{
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 800,
                fontSize: '22px',
                color: selected === lang.code ? '#00d084' : '#f0fdf4',
                marginBottom: '4px',
                transition: 'color 0.2s',
              }}>
                {lang.nativeName}
              </div>
              <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '16px', lineHeight: 1.5 }}>
                {lang.desc}
              </div>
              {/* Sample text preview */}
              <div style={{
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '10px',
                padding: '10px',
                fontSize: '11px',
                color: '#94a3b8',
                lineHeight: 1.6,
                textAlign: 'left',
                fontStyle: 'italic',
              }}>
                "{lang.sample}"
              </div>
            </motion.button>
          ))}
        </div>

        {/* Continue button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={handleContinue}
          disabled={confirming}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '16px',
            border: 'none',
            background: confirming
              ? 'rgba(0,208,132,0.4)'
              : 'linear-gradient(135deg, #00d084, #10b981)',
            color: '#0a0f1e',
            fontWeight: 800,
            fontSize: '17px',
            fontFamily: 'Outfit, sans-serif',
            cursor: confirming ? 'not-allowed' : 'pointer',
            boxShadow: '0 8px 25px rgba(0,208,132,0.35)',
            letterSpacing: '0.02em',
          }}
        >
          {confirming
            ? '✓ Setting up your experience...'
            : selected === 'ta'
            ? 'தொடரவும் →'
            : 'Continue →'
          }
        </motion.button>

        <p style={{ color: '#334155', fontSize: '12px', marginTop: '20px' }}>
          {selected === 'ta'
            ? 'நீங்கள் இதை எப்போதும் மாற்றலாம்'
            : 'You can change this anytime from your profile settings'
          }
        </p>
      </motion.div>
    </div>
  );
};

export default LanguageSelectPage;
