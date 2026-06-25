import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Leaf, Target, Heart, Users, Award, Zap, Globe, Shield } from 'lucide-react';

const AboutPage = () => {
  const { t, lang } = useLanguage();
  const isTa = lang === 'ta';

  const team = isTa ? [
    { name: 'தமிழ்ராஜ்', role: 'திட்டத் தலைவர் & முழு அடுக்கு டெவலப்பர்', avatar: 'த', bio: 'React, Node.js மற்றும் கிளவுட் கட்டமைப்பில் நிபுணர்', color: '#00d084' },
    { name: 'திருப்பதி', role: 'AI/ML பொறியாளர்', avatar: 'தி', bio: 'இயற்கை மொழி செயலாக்கம் (NLP) மற்றும் ஜெமினி AI நிபுணர்', color: '#0ea5e9' },
    { name: 'நிதேஷ்', role: 'UI/UX வடிவமைப்பாளர் & முன்முனை டெவலப்பர்', avatar: 'நி', bio: 'உள்ளுணர்வுடன் கூடிய பயனர் அனுபவ வடிவமைப்புகள் மற்றும் அனிமேஷன் நிபுணர்', color: '#f59e0b' },
  ] : [
    { name: 'Tamilraj', role: 'Project Lead & Full Stack Developer', avatar: 'T', bio: 'Specialist in React, Node.js, and cloud architecture', color: '#00d084' },
    { name: 'Thirupathi', role: 'AI/ML Engineer', avatar: 'T', bio: 'Expert in Natural Language Processing and Gemini AI models', color: '#0ea5e9' },
    { name: 'Nitesh', role: 'UI/UX Designer & Frontend Developer', avatar: 'N', bio: 'Creator of intuitive rural-focused user interfaces and animations', color: '#f59e0b' },
  ];

  const timeline = isTa ? [
    { year: '2024 Q1', event: 'கிராமப்புற சமுதாய சவால்களில் இருந்து EcoBot AI கருத்து பிறந்தது' },
    { year: '2024 Q2', event: 'Gemini AI ஒருங்கிணைப்பு மற்றும் தமிழ் NLP உருவாக்கம்' },
    { year: '2024 Q3', event: 'தமிழ்நாட்டில் 5 கிராமங்களில் முன்னோடித் திட்டம் தொடக்கம்' },
    { year: '2024 Q4', event: 'கழிவு கண்டறிதல் AI மற்றும் விவசாய ஆலோசகர் அறிமுகம்' },
    { year: '2025 Q1', event: 'அரசு திட்டங்கள் RAG மற்றும் பகுப்பாய்வு டாஷ்போர்டு' },
    { year: '2025 Q2', event: '25 கிராமங்களுக்கு விரிவாக்கம், 50,000+ விவசாயிகள் பயன்' },
  ] : [
    { year: '2024 Q1', event: 'EcoBot AI concept born from rural community challenges' },
    { year: '2024 Q2', event: 'Gemini AI integration and Tamil NLP development' },
    { year: '2024 Q3', event: 'Pilot launch in 5 villages in Tamil Nadu' },
    { year: '2024 Q4', event: 'Waste Detection AI and Farming Advisor launched' },
    { year: '2025 Q1', event: 'Government Schemes RAG system and Analytics Dashboard' },
    { year: '2025 Q2', event: 'Expanded to 25 villages, 50,000+ farmers' },
  ];

  const missions = [
    {
      icon: Target,
      title: t('about_mission_title'),
      color: '#00d084',
      text: isTa 
        ? 'இந்தியா முழுவதும் உள்ள கிராமப்புற சமூகங்களுக்கு AI-இயக்கப்படும் நிலைத்தன்மை அறிவை எளிதாகக் கிடைக்கச் செய்தல், பன்மொழி AI கருவிகள் மூலம் டிஜிட்டல் இடைவெளியைக் குறைத்தல்.'
        : 'To democratize access to AI-powered sustainability knowledge for rural communities across India, bridging the digital divide with multilingual AI tools.'
    },
    {
      icon: Heart,
      title: t('about_values_title'),
      color: '#ef4444',
      text: isTa
        ? 'சமநிலை, அணுகல் எளிமை, சுற்றுச்சூழல் பாதுகாப்பு, சமூக அதிகாரமளித்தல். ஒவ்வொரு கிராமமும் அதிநவீன AI கருவிகளைப் பெற தகுதியுடையது என்று நாங்கள் நம்புகிறோம்.'
        : 'Equity, Accessibility, Environmental stewardship, Community empowerment. We believe every village deserves cutting-edge AI tools.'
    },
    {
      icon: Globe,
      title: t('about_vision_title'),
      color: '#0ea5e9',
      text: isTa
        ? 'ஐக்கிய நாடுகள் சபையின் SDG இலக்குகளுடன் இணைந்து, விவசாயம், நீர் பாதுகாப்பு மற்றும் சுற்றுச்சூழல் பாதுகாப்பு ஆகியவற்றிற்கு ஒவ்வொரு கிராமமும் AI வழிகாட்டுதலைப் பெறும் நிலையான இந்தியா.'
        : 'A sustainable India where every rural community has AI-powered guidance for farming, water conservation, and environmental action aligned with UN SDGs.'
    }
  ];

  const stats = isTa ? [
    { value: '50,000+', label: 'பயனடைந்த விவசாயிகள்', icon: Users },
    { value: '25+', label: 'இணைக்கப்பட்ட கிராமங்கள்', icon: Globe },
    { value: '1.2M', label: 'லிட்டர் நீர் சேமிப்பு', icon: Shield },
    { value: '4 SDGs', label: 'இலக்குகள் சீரமைப்பு', icon: Award },
    { value: '2', label: 'ஆதரிக்கப்படும் மொழிகள்', icon: Zap },
    { value: '98%', label: 'பயனர் திருப்தி', icon: Heart },
  ] : [
    { value: '50,000+', label: 'Farmers Helped', icon: Users },
    { value: '25+', label: 'Villages Covered', icon: Globe },
    { value: '1.2M', label: 'Liters Water Saved', icon: Shield },
    { value: '4 SDGs', label: 'Goals Aligned', icon: Award },
    { value: '2', label: 'Languages Supported', icon: Zap },
    { value: '98%', label: 'User Satisfaction', icon: Heart },
  ];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '64px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'linear-gradient(135deg, #00d084, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 0 30px rgba(34,197,94,0.3)' }}>
          <Leaf size={32} color="#0a0f1e" strokeWidth={2.5} />
        </div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', fontWeight: 900, fontFamily: 'Outfit, sans-serif', color: 'var(--text-1)', marginBottom: '16px' }}>
          {isTa ? 'EcoBot AI எங்களைப் பற்றி' : 'About EcoBot AI'}
        </h1>
        <p style={{ color: 'var(--text-3)', fontSize: '16px', lineHeight: '1.7', maxWidth: '700px', margin: '0 auto' }}>
          {isTa 
            ? 'நாங்கள் கிராமப்புற சமுதாயங்கள் இன்னும் நிலையான முறையில் வாழ்வதற்கு AI-இயக்கப்படும் கருவிகளை உருவாக்கும் ஒரு ஆர்வமுள்ள குழு.'
            : "We're a passionate team building AI-powered tools to help rural communities in India live more sustainably — one village at a time."}
        </p>
      </motion.div>

      {/* Mission */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '64px' }}>
        {missions.map(({ icon: Icon, title, color, text }, i) => (
          <motion.div key={title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} viewport={{ once: true }} className="card">
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${color}12`, border: `1px solid ${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Icon size={22} color={color} />
            </div>
            <h2 style={{ color: 'var(--text-1)', fontWeight: 700, fontSize: '18px', fontFamily: 'Outfit, sans-serif', marginBottom: '10px' }}>{title}</h2>
            <p style={{ color: 'var(--text-3)', fontSize: '13px', lineHeight: '1.6' }}>{text}</p>
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.03), rgba(14,165,233,0.03))', border: '1px solid var(--border)', borderRadius: '20px', padding: '36px', marginBottom: '64px' }}>
        <h2 style={{ color: 'var(--text-1)', fontWeight: 800, fontSize: '1.8rem', fontFamily: 'Outfit, sans-serif', textAlign: 'center', marginBottom: '32px' }}>
          {t('about_impact')}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '24px', textAlign: 'center' }}>
          {stats.map(({ value, label }) => (
            <div key={label}>
              <div className="gradient-text" style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>{value}</div>
              <p style={{ color: 'var(--text-3)', fontSize: '12px', marginTop: '4px' }}>{label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Team */}
      <div style={{ marginBottom: '64px' }}>
        <h2 style={{ color: 'var(--text-1)', fontWeight: 800, fontSize: '1.8rem', fontFamily: 'Outfit, sans-serif', textAlign: 'center', marginBottom: '32px' }}>
          {t('about_team')}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          {team.map(({ name, role, avatar, bio, color }, i) => (
            <motion.div key={name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} viewport={{ once: true }} className="card" style={{ textAlign: 'center' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: `linear-gradient(135deg, ${color}, ${color}66)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontSize: '24px', fontWeight: 800, color: '#0a0f1e', boxShadow: `0 0 16px ${color}30` }}>
                {avatar}
              </div>
              <h3 style={{ color: 'var(--text-1)', fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>{name}</h3>
              <p style={{ color, fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>{role}</p>
              <p style={{ color: 'var(--text-3)', fontSize: '13px', lineHeight: '1.5' }}>{bio}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div>
        <h2 style={{ color: 'var(--text-1)', fontWeight: 800, fontSize: '1.8rem', fontFamily: 'Outfit, sans-serif', textAlign: 'center', marginBottom: '32px' }}>
          {t('about_journey')}
        </h2>
        <div style={{ position: 'relative', maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ position: 'absolute', left: '20px', top: 0, bottom: 0, width: '2px', background: 'linear-gradient(180deg, #00d084, #0ea5e9)' }} />
          {timeline.map(({ year, event }, i) => (
            <motion.div key={year} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} viewport={{ once: true }}
              style={{ display: 'flex', gap: '20px', marginBottom: '24px', paddingLeft: '4px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #00d084, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}>
                <Leaf size={12} color="#0a0f1e" />
              </div>
              <div className="card" style={{ padding: '12px 18px', flex: 1, margin: 0 }}>
                <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '12px', marginBottom: '4px' }}>{year}</p>
                <p style={{ color: 'var(--text-2)', fontSize: '13px', lineHeight: '1.5' }}>{event}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
