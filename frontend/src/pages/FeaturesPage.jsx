import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  MessageCircle, Mic, Wheat, Trash2, BookOpen, BarChart3,
  ArrowRight, CheckCircle, Zap, Globe, Shield, Clock
} from 'lucide-react';

const FEATURES_DETAIL_EN = [
  {
    icon: MessageCircle, title: 'AI Sustainability Chatbot', color: '#00d084',
    desc: 'Ask any question about sustainable farming, water conservation, or environmental practices. Get intelligent, contextual answers powered by Google Gemini AI.',
    capabilities: ['Real-time AI responses', 'Tamil & English support', 'Chat history preservation', 'AI typing animation', 'Smart suggestion prompts'],
    link: '/chat',
  },
  {
    icon: Mic, title: 'Multilingual Voice Assistant', color: '#0ea5e9',
    desc: 'Speak naturally in Tamil or English. Our voice assistant transcribes your speech, processes it with AI, and responds in your language.',
    capabilities: ['Speech-to-text conversion', 'Text-to-speech output', 'Tamil voice support', 'Voice input button', 'Auto-speak responses'],
    link: '/chat',
  },
  {
    icon: Wheat, title: 'Smart Farming Advisor', color: '#10b981',
    desc: 'Get AI-driven crop recommendations, organic farming guidance, water-saving techniques, and pest prevention tips tailored to your region and season.',
    capabilities: ['Crop-specific advice', 'Organic farming tips', 'Pest control guidance', 'Seasonal farming calendar', 'Water requirement charts'],
    link: '/farming',
  },
  {
    icon: Trash2, title: 'Waste Detection AI', color: '#f59e0b',
    desc: 'Upload a photo of waste and our AI instantly classifies it, determines recyclability, and provides proper disposal and recycling instructions.',
    capabilities: ['Image-based classification', 'Plastic/organic/e-waste detection', 'Disposal recommendations', 'Environmental impact info', 'Report history'],
    link: '/waste',
  },
  {
    icon: BookOpen, title: 'Government Schemes Assistant', color: '#8b5cf6',
    desc: 'Find and understand government schemes for farmers, water conservation, energy, and rural welfare through AI-powered search and retrieval.',
    capabilities: ['50+ scheme database', 'AI-powered search', 'Eligibility checking', 'Application guidance', 'Document checklist'],
    link: '/schemes',
  },
  {
    icon: BarChart3, title: 'Sustainability Dashboard', color: '#ef4444',
    desc: 'Track your environmental impact with real-time charts, green score, water savings analytics, waste reduction stats, and personal achievements.',
    capabilities: ['Interactive charts', 'Green score tracking', 'Goal setting', 'Achievement badges', 'Progress analytics'],
    link: '/analytics',
  },
];

const FEATURES_DETAIL_TA = [
  {
    icon: MessageCircle, title: 'AI நிலைத்தன்மை அரட்டை', color: '#00d084',
    desc: 'நிலையான விவசாயம், நீர் பாதுகாப்பு அல்லது சுற்றுச்சூழல் நடைமுறைகள் பற்றி எதையும் கேளுங்கள். கூகுள் ஜெமினி AI மூலம் இயக்கப்படும் அறிவார்ந்த, சூழல் சார்ந்த பதில்களைப் பெறுங்கள்.',
    capabilities: ['உடனுக்குடன் AI பதில்கள்', 'தமிழ் & ஆங்கில ஆதரவு', 'அரட்டை வரலாறு சேமிப்பு', 'AI தட்டச்சு அனிமேஷன்', 'ஸ்மார்ட் பரிந்துரைகள்'],
    link: '/chat',
  },
  {
    icon: Mic, title: 'பன்மொழி குரல் உதவியாளர்', color: '#0ea5e9',
    desc: 'தமிழில் அல்லது ஆங்கிலத்தில் இயல்பாகப் பேசுங்கள். எங்களது குரல் உதவியாளர் உங்கள் பேச்சை உரைக்கு மாற்றி, AI மூலம் செயலாக்கி, உங்கள் மொழியில் பதிலளிக்கும்.',
    capabilities: ['பேச்சிலிருந்து உரை மாற்றம்', 'உரையிலிருந்து ஒலி வெளியீடு', 'தமிழ் குரல் ஆதரவு', 'குரல் உள்ளீட்டு பொத்தான்', 'தானியங்கி ஒலி பதில்கள்'],
    link: '/chat',
  },
  {
    icon: Wheat, title: 'ஸ்மார்ட் விவசாய ஆலோசகர்', color: '#10b981',
    desc: 'உங்கள் பகுதி மற்றும் பருவத்திற்கு ஏற்ப AI-ஆல் இயக்கப்படும் பயிர் பரிந்துரைகள், கரிம விவசாய வழிகாட்டுதல், நீர் சேமிப்பு மற்றும் பூச்சி தடுப்பு குறிப்புகளைப் பெறுங்கள்.',
    capabilities: ['பயிர் சார்ந்த ஆலோசனைகள்', 'கரிம விவசாய குறிப்புகள்', 'பூச்சி கட்டுப்பாட்டு வழிகாட்டி', 'பருவகால விவசாய காலண்டர்', 'நீர் தேவை விளக்கப்படங்கள்'],
    link: '/farming',
  },
  {
    icon: Trash2, title: 'கழிவு கண்டறிதல் AI', color: '#f59e0b',
    desc: 'கழிவுகளின் புகைப்படத்தைப் பதிவேற்றவும், எங்கள் AI உடனடியாக அதை வகைப்படுத்தி, அதன் மறுசுழற்சித் தன்மையை தீர்மானித்து, சரியான முறையில் அகற்றும் வழிகாட்டுதல்களை வழங்குகிறது.',
    capabilities: ['படம் சார்ந்த வகைப்பாடு', 'பிளாஸ்டிக்/கரிம/மின்-கழிவு கண்டறிதல்', 'அகற்றும் பரிந்துரைகள்', 'சுற்றுச்சூழல் தாக்க விவரங்கள்', 'பகுப்பாய்வு வரலாறு'],
    link: '/waste',
  },
  {
    icon: BookOpen, title: 'அரசு திட்டங்கள் உதவியாளர்', color: '#8b5cf6',
    desc: 'AI-ஆல் இயக்கப்படும் தேடல் மூலம் விவசாயிகள், நீர் பாதுகாப்பு, ஆற்றல் மற்றும் கிராமப்புற நலனுக்கான அரசு திட்டங்களைக் கண்டறிந்து புரிந்து கொள்ளுங்கள்.',
    capabilities: ['50+ திட்டங்களின் தரவுத்தளம்', 'AI தேடல் வசதி', 'தகுதி சரிபார்ப்பு', 'விண்ணப்ப வழிகாட்டுதல்', 'தேவையான ஆவணங்களின் பட்டியல்'],
    link: '/schemes',
  },
  {
    icon: BarChart3, title: 'நிலைத்தன்மை டாஷ்போர்டு', color: '#ef4444',
    desc: 'உடனுக்குடன் விளக்கப்படங்கள், பசுமை மதிப்பெண், நீர் சேமிப்பு பகுப்பாய்வு, கழிவு குறைப்பு புள்ளிவிவரங்கள் மற்றும் தனிப்பட்ட சாதனைகள் மூலம் உங்களது சுற்றுச்சூழல் தாக்கத்தை கண்காணிக்கவும்.',
    capabilities: ['ஊடாடும் விளக்கப்படங்கள்', 'பசுமை புள்ளிகள் கண்காணிப்பு', 'இலக்கு அமைப்புகள்', 'சாதனை பேட்ஜ்கள்', 'முன்னேற்ற பகுப்பாய்வு'],
    link: '/analytics',
  },
];

const FeaturesPage = () => {
  const { t, lang } = useLanguage();
  const isTa = lang === 'ta';

  const FEATURES_DETAIL = isTa ? FEATURES_DETAIL_TA : FEATURES_DETAIL_EN;

  const quickStats = isTa ? [
    { icon: Zap, label: '6 AI பிரிவுகள்', color: '#00d084' },
    { icon: Globe, label: '2 மொழிகள்', color: '#0ea5e9' },
    { icon: Shield, label: 'பாதுகாப்பானது', color: '#8b5cf6' },
    { icon: Clock, label: 'உடனடி பதில்கள்', color: '#f59e0b' },
  ] : [
    { icon: Zap, label: '6 AI Modules', color: '#00d084' },
    { icon: Globe, label: '2 Languages', color: '#0ea5e9' },
    { icon: Shield, label: 'Secure & Private', color: '#8b5cf6' },
    { icon: Clock, label: 'Real-time Responses', color: '#f59e0b' },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '56px' }}>
        <span className="badge badge-green" style={{ marginBottom: '8px' }}>
          {isTa ? 'ஜெமினி AI மூலம் இயங்குகிறது' : 'Powered by Gemini AI'}
        </span>
        <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', fontWeight: 900, fontFamily: 'Outfit, sans-serif', color: 'var(--text-1)', marginTop: '8px', marginBottom: '12px' }}>
          {isTa ? 'முழுமையான AI அம்சங்கள்' : 'Complete AI Feature Suite'}
        </h1>
        <p style={{ color: 'var(--text-3)', fontSize: '16px', lineHeight: '1.7', maxWidth: '600px', margin: '0 auto' }}>
          {isTa 
            ? 'கிராமப்புற சமூகத்தின் நிலையான வாழ்க்கை முறைக்கு தேவையான அனைத்து கருவிகளும் ஒரே AI தளத்தில்.'
            : 'Every tool your rural community needs for sustainable living — all in one AI-powered platform.'}
        </p>
      </motion.div>

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '48px' }}>
        {quickStats.map(({ icon: Icon, label, color }) => (
          <motion.div key={label} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', background: 'var(--bg-2)', border: `1px solid var(--border)`, borderRadius: '12px' }}>
            <Icon size={20} color={color} />
            <span style={{ color: 'var(--text-1)', fontWeight: 600, fontSize: '13px' }}>{label}</span>
          </motion.div>
        ))}
      </div>

      {/* Feature cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {FEATURES_DETAIL.map(({ icon: Icon, title, color, desc, capabilities, link }, i) => (
          <motion.div key={title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} viewport={{ once: true }}
            className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${color}12`, border: `1px solid ${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={24} color={color} />
                </div>
                <h2 style={{ color: 'var(--text-1)', fontWeight: 800, fontSize: '18px', fontFamily: 'Outfit, sans-serif' }}>{title}</h2>
              </div>
              <p style={{ color: 'var(--text-3)', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>{desc}</p>
              <Link to={link} style={{ textDecoration: 'none' }}>
                <button id={`feature-${title.replace(/\s+/g, '-').toLowerCase()}-btn`} className="btn btn-primary btn-sm" style={{ background: color, border: 'none' }}>
                  {isTa ? 'இந்த அம்சத்தை பயன்படுத்தவும்' : 'Try This Feature'} <ArrowRight size={14} />
                </button>
              </Link>
            </div>
            <div>
              <p style={{ color: 'var(--text-3)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                {isTa ? 'செயல்பாடுகள்' : 'Capabilities'}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {capabilities.map(cap => (
                  <div key={cap} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={14} color={color} />
                    <span style={{ color: 'var(--text-2)', fontSize: '13px' }}>{cap}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        style={{ textAlign: 'center', marginTop: '56px', padding: '36px', background: 'linear-gradient(135deg, rgba(34,197,94,0.03), rgba(14,165,233,0.03))', border: '1px solid var(--border)', borderRadius: '20px' }}>
        <h2 style={{ color: 'var(--text-1)', fontWeight: 800, fontSize: '1.6rem', fontFamily: 'Outfit, sans-serif', marginBottom: '12px' }}>
          {isTa ? 'அனைத்து அம்சங்களையும் இலவசமாகப் பயன்படுத்துங்கள்' : 'Start Using All Features Free'}
        </h2>
        <p style={{ color: 'var(--text-3)', fontSize: '14px', marginBottom: '24px' }}>
          {isTa 
            ? 'இன்றே உங்களது இலவச கணக்கை உருவாக்கி, அனைத்து நிலைத்தன்மைக் கருவிகளையும் அணுகுங்கள்.'
            : 'Create your free account and access all sustainability tools today.'}
        </p>
        <Link to="/login" id="features-cta-btn" style={{ textDecoration: 'none' }}>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn btn-primary btn-lg">
            {isTa ? 'இலவசமாகத் தொடங்குங்கள்' : 'Get Started Free'}
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
};

export default FeaturesPage;
