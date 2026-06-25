import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import {
  Leaf, MessageCircle, Mic, BarChart3, Trash2, BookOpen, Wheat,
  ArrowRight, CheckCircle, Star, TrendingUp
} from 'lucide-react';

const FEATURES_EN = [
  { icon: MessageCircle, title: 'AI Chat',            desc: 'Instant answers on farming, water & waste in Tamil or English.',  color: 'var(--primary)', link: '/chat'      },
  { icon: Wheat,         title: 'Farming Advisor',    desc: 'Crop recommendations, organic tips, seasonal guidance.',           color: '#3b82f6',         link: '/farming'   },
  { icon: Trash2,        title: 'Waste Detection',    desc: 'Upload a photo — AI classifies waste and guides disposal.',        color: '#f59e0b',         link: '/waste'     },
  { icon: BookOpen,      title: 'Govt Schemes',       desc: 'Find PM-KISAN, Jal Jeevan Mission and 50+ schemes in seconds.',   color: '#8b5cf6',         link: '/schemes'   },
  { icon: BarChart3,     title: 'Sustainability Dashboard', desc: 'Track water savings, green score, and carbon footprint.',    color: '#ef4444',         link: '/analytics' },
  { icon: Mic,           title: 'Voice AI',           desc: 'Speak in Tamil or English — voice input and spoken responses.',   color: '#06b6d4',         link: '/chat'      },
];

const FEATURES_TA = [
  { icon: MessageCircle, title: 'AI அரட்டை',            desc: 'விவசாயம், நீர் மற்றும் கழிவு பற்றிய உடனடி பதில்கள் தமிழில் அல்லது ஆங்கிலத்தில்.', color: 'var(--primary)', link: '/chat'      },
  { icon: Wheat,         title: 'விவசாய ஆலோசகர்',    desc: 'பயிர் பரிந்துரைகள், கரிம குறிப்புகள், பருவகால வழிகாட்டுதல்கள்.',             color: '#3b82f6',         link: '/farming'   },
  { icon: Trash2,        title: 'கழிவு கண்டறிதல்',    desc: 'படத்தை பதிவேற்றவும் — AI கழிவுகளை வகைப்படுத்தி அகற்றும் வழிகாட்டுதலை வழங்கும்.',    color: '#f59e0b',         link: '/waste'     },
  { icon: BookOpen,      title: 'அரசு திட்டங்கள்',       desc: 'PM-KISAN, ஜல் ஜீவன் மற்றும் 50+ திட்டங்களை நொடிகளில் கண்டறியவும்.',        color: '#8b5cf6',         link: '/schemes'   },
  { icon: BarChart3,     title: 'நிலைத்தன்மை டாஷ்போர்டு', desc: 'நீர் சேமிப்பு, பசுமை புள்ளிகள் மற்றும் கார்பன் தடம் ஆகியவற்றை கண்காணிக்கவும்.', color: '#ef4444',         link: '/analytics' },
  { icon: Mic,           title: 'குரல் AI',           desc: 'தமிழில் அல்லது ஆங்கிலத்தில் பேசுங்கள் — குரல் உள்ளீடு மற்றும் ஒலி பதில்கள்.',    color: '#06b6d4',         link: '/chat'      },
];

const STATS_EN = [
  { value: '50K+', label: 'Farmers Helped' },
  { value: '4',    label: 'SDGs Aligned'   },
  { value: '40%',  label: 'Water Saved'    },
  { value: '2',    label: 'Languages'      },
];

const STATS_TA = [
  { value: '50K+', label: 'பயனடைந்த விவசாயிகள்' },
  { value: '4',    label: 'SDG இலக்குகள்'   },
  { value: '40%',  label: 'நீர் சேமிப்பு'    },
  { value: '2',    label: 'மொழிகள்'      },
];

const TESTIMONIALS_EN = [
  { name: 'Muthu Rajan', role: 'Farmer, Tirunelveli', text: 'EcoBot helped me switch to organic farming and save 40% water this season.', avatar: 'M' },
  { name: 'Kavitha Selvi', role: 'Village Head, Madurai', text: 'Our village now properly segregates waste. The Tamil support is amazing!', avatar: 'K' },
  { name: 'Arjun Kumar', role: 'Agriculture Officer', text: 'I use EcoBot daily to explain schemes to farmers. Incredibly useful tool.', avatar: 'A' },
];

const TESTIMONIALS_TA = [
  { name: 'முத்து ராஜன்', role: 'விவசாயி, திருநெல்வேலி', text: 'இந்த பருவத்தில் கரிம விவசாயத்திற்கு மாறவும் 40% நீரை சேமிக்கவும் EcoBot எனக்கு உதவியது.', avatar: 'மு' },
  { name: 'கவிதா செல்வி', role: 'பஞ்சாயத்து தலைவர், மதுரை', text: 'எங்கள் கிராமம் இப்போது கழிவுகளை சரியாக பிரிக்கிறது. தமிழ் ஆதரவு அருமையாக உள்ளது!', avatar: 'க' },
  { name: 'அர்ஜுன் குமார்', role: 'வேளாண்மை அதிகாரி', text: 'விவசாயிகளுக்கு திட்டங்களை விளக்க நான் தினசரி EcoBot ஐ பயன்படுத்துகிறேன். மிகவும் பயனுள்ள கருவி.', avatar: 'அ' },
];

const CHECK_ITEMS_EN = [
  'Supports Tamil & English',
  'Voice input & text-to-speech',
  'Powered by NVIDIA NIM AI',
  '50+ Government schemes',
];

const CHECK_ITEMS_TA = [
  'தமிழ் மற்றும் ஆங்கில ஆதரவு',
  'குரல் உள்ளீடு மற்றும் உரை-ஒலி வெளியீடு',
  'NVIDIA NIM AI மூலம் இயங்குகிறது',
  '50+ அரசு திட்டங்கள்',
];

const FadeUp = ({ children, delay = 0, ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    {...props}
  >
    {children}
  </motion.div>
);

const LandingPage = () => {
  const { t, lang } = useLanguage();
  const isTa = lang === 'ta';
  const featRef = useRef(null);

  const FEATURES = isTa ? FEATURES_TA : FEATURES_EN;
  const STATS = isTa ? STATS_TA : STATS_EN;
  const TESTIMONIALS = isTa ? TESTIMONIALS_TA : TESTIMONIALS_EN;
  const CHECK_ITEMS = isTa ? CHECK_ITEMS_TA : CHECK_ITEMS_EN;

  return (
    <div style={{ overflowX: 'hidden' }}>

      {/* ── Hero ─────────────────────────────── */}
      <section style={{
        minHeight: '85vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '60px 24px 40px',
        textAlign: 'center',
        position: 'relative',
      }}>
        {/* Soft glow */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 70% 50% at 50% 20%, rgba(34,197,94,0.04) 0%, transparent 70%)',
        }} />

        <div style={{ maxWidth: '820px', position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            style={{ marginBottom: '24px' }}>
            <span className="badge badge-green" style={{ fontSize: '12px', padding: '5px 12px' }}>
              <Leaf size={12} /> {t('hero_badge')}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }}
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'clamp(2rem, 5.5vw, 3.6rem)',
              fontWeight: 900, lineHeight: 1.15,
              color: 'var(--text-1)',
              marginBottom: '16px',
              letterSpacing: '-0.02em',
            }}
          >
            {t('hero_title')}<br />
            <span className="gradient-text">{t('hero_title2')}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
            style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: 1.65, maxWidth: '620px', margin: '0 auto 32px' }}
          >
            {t('hero_subtitle')}
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.22 }}
            style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '48px' }}
          >
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <button className="btn btn-primary btn-lg" id="hero-cta-btn">
                <MessageCircle size={16} /> {t('hero_cta1')} <ArrowRight size={14} />
              </button>
            </Link>
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => featRef.current?.scrollIntoView({ behavior: 'smooth' })}
            >
              {t('hero_cta2')}
            </button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}
            style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '1px', background: 'var(--border)',
              border: '1px solid var(--border)',
              borderRadius: '16px', overflow: 'hidden',
            }}
          >
            {STATS.map(({ value, label }) => (
              <div key={label} style={{
                background: 'rgba(13,22,40,0.6)', padding: '16px',
                textAlign: 'center',
              }}>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '24px', fontWeight: 800, color: 'var(--primary)' }}>{value}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '2px' }}>{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Features ────────────────────────── */}
      <section ref={featRef} style={{ padding: '64px 24px', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <FadeUp style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="badge badge-green" style={{ marginBottom: '10px' }}>{isTa ? 'தள அம்சங்கள்' : 'Platform Features'}</span>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, color: 'var(--text-1)' }}>
              {isTa ? 'உங்கள் சமூகத்திற்கு தேவையான அனைத்தும்' : 'Everything Your Community Needs'}
            </h2>
            <p style={{ color: 'var(--text-3)', marginTop: '8px', fontSize: '14px' }}>
              {isTa ? 'ஒரே தளம் — AI அரட்டை, விவசாய ஆலோசகர், கழிவு கண்டறிதல், திட்டங்கள் மற்றும் பகுப்பாய்வு.' : 'One platform — AI chat, farming advisor, waste detection, schemes, and analytics.'}
            </p>
          </FadeUp>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {FEATURES.map(({ icon: Icon, title, desc, color, link }, i) => (
              <FadeUp key={title} delay={i * 0.05}>
                <Link to={link} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{ height: '100%', cursor: 'pointer' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '10px',
                      background: `${color}12`, border: `1px solid ${color}20`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: '14px',
                    }}>
                      <Icon size={18} color={color} />
                    </div>
                    <h3 style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-1)', marginBottom: '8px' }}>{title}</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: 1.6 }}>{desc}</p>
                    <div style={{ marginTop: '14px', color, fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {isTa ? 'இப்போது முயற்சிக்கவும்' : 'Try now'} <ArrowRight size={13} />
                    </div>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Demo split ───────────────────── */}
      <section style={{ padding: '64px 24px', borderTop: '1px solid var(--border)', background: 'rgba(13,22,40,0.6)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center' }}>
          <FadeUp>
            <span className="badge badge-green" style={{ marginBottom: '14px' }}>Live AI</span>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, color: 'var(--text-1)', marginBottom: '14px', lineHeight: 1.25 }}>
              {isTa ? 'சுற்றுச்சூழல் பற்றி எது வேண்டுமானாலும் கேளுங்கள்' : 'Ask anything about sustainability'}
            </h2>
            <p style={{ color: 'var(--text-3)', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>
              {isTa ? 'NVIDIA NIM Llama 3.1 மூலம் இயங்குகிறது — கிராமப்புற இந்திய சமூகங்களுக்கு நடைமுறை மற்றும் கலாச்சார ரீதியான வழிகாட்டுதல்.' : 'Powered by NVIDIA NIM Llama 3.1 — get practical, culturally-relevant guidance for rural Indian communities.'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              {CHECK_ITEMS.map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={14} color="var(--primary)" />
                  <span style={{ fontSize: '13px', color: 'var(--text-2)' }}>{item}</span>
                </div>
              ))}
            </div>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <button className="btn btn-primary btn-lg" id="demo-cta-btn">
                <MessageCircle size={16} /> {t('hero_cta1')}
              </button>
            </Link>
          </FadeUp>

          {/* Mock chat UI */}
          <FadeUp delay={0.1}>
            <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
              {/* Chat header */}
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--primary-dk))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Leaf size={13} color="#0b0f1a" />
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-1)' }}>EcoBot AI</div>
                  <div style={{ fontSize: '10px', color: 'var(--primary)' }}>● Online · NVIDIA NIM</div>
                </div>
              </div>
              {/* Messages */}
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '220px' }}>
                <div className="chat-bubble-user" style={{ alignSelf: 'flex-end', fontSize: '13px' }}>
                  {isTa ? 'எனது பண்ணையில் நீரை எவ்வாறு சேமிப்பது? 🌾' : 'How can I save water in my farm? 🌾'}
                </div>
                <div className="chat-bubble-ai" style={{ fontSize: '13px', lineHeight: '1.5' }}>
                  <strong style={{ color: 'var(--primary)' }}>💧 {isTa ? 'நீர் பாதுகாப்பு குறிப்புகள்:' : 'Water Conservation Tips:'}</strong><br /><br />
                  1. <strong>{isTa ? 'சொட்டு நீர்ப்பாசனம்' : 'Drip Irrigation'}</strong> — {isTa ? '50-70% கூடுதல் நீரைச் சேமிக்கும்' : 'saves 50-70% more water'}<br />
                  2. <strong>{isTa ? 'மண் மூடாக்கு' : 'Mulching'}</strong> — {isTa ? 'ஆவியாதலை 30% குறைக்கும்' : 'reduces evaporation by 30%'}<br />
                  3. <strong>{isTa ? 'பண்ணைக் குட்டைகள்' : 'Farm Ponds'}</strong> — {isTa ? 'வறட்சி காலத்திற்கு மழைநீரைச் சேகரிக்கும்' : 'collect rainwater for dry season'}
                </div>
              </div>
              {/* Input bar */}
              <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div style={{ flex: 1, background: 'var(--bg)', border: '1px solid var(--border-2)', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', color: 'var(--text-3)' }}>
                  {t('chat_placeholder')}
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Testimonials ────────────────────── */}
      <section style={{ padding: '64px 24px', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <FadeUp style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="badge badge-green" style={{ marginBottom: '10px' }}>{isTa ? 'மதிப்புரைகள்' : 'Community'}</span>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, color: 'var(--text-1)' }}>
              {isTa ? 'கிராமப்புற சமூகங்களால் நம்பப்படுகிறது' : 'Trusted by Rural Communities'}
            </h2>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {TESTIMONIALS.map(({ name, role, text, avatar }, i) => (
              <FadeUp key={name} delay={i * 0.05}>
                <div className="card">
                  <div style={{ display: 'flex', gap: '2px', marginBottom: '12px' }}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} size={12} color="#f59e0b" fill="#f59e0b" />
                    ))}
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.6, marginBottom: '14px', fontStyle: 'italic' }}>"{text}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--primary-dk))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', color: '#0b0f1a' }}>
                      {avatar}
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-1)' }}>{name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>{role}</div>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────── */}
      <section style={{ padding: '64px 24px', borderTop: '1px solid var(--border)', background: 'rgba(13,22,40,0.6)' }}>
        <FadeUp>
          <div style={{
            maxWidth: '700px', margin: '0 auto', textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(34,197,94,0.04), rgba(59,130,246,0.03))',
            border: '1px solid var(--primary-border)',
            borderRadius: '20px', padding: '40px 24px',
          }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-bg)', border: '1px solid var(--primary-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <TrendingUp size={22} color="var(--primary)" />
            </div>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, color: 'var(--text-1)', marginBottom: '12px' }}>
              {isTa ? 'உங்கள் சமூகத்தை பசுமையாக்க தயாரா?' : 'Ready to Make Your Community Greener?'}
            </h2>
            <p style={{ color: 'var(--text-3)', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px', maxWidth: '480px', margin: '0 auto 24px' }}>
              {isTa ? 'EcoBot AI உடன் இணைந்து நிலையான எதிர்காலத்தை உருவாக்கும் ஆயிரக்கணக்கான விவசாயிகளுடன் இணையுங்கள்.' : 'Join thousands of farmers and community leaders building sustainable futures with EcoBot AI.'}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <button className="btn btn-primary btn-lg" id="cta-final-btn">{isTa ? 'இலவசமாக சேருங்கள்' : 'Join Free Today'}</button>
              </Link>
              <Link to="/features" style={{ textDecoration: 'none' }}>
                <button className="btn btn-secondary btn-lg">{isTa ? 'மேலும் அறிய' : 'Learn More'}</button>
              </Link>
            </div>
          </div>
        </FadeUp>
      </section>
    </div>
  );
};

export default LandingPage;
