import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSchemeInfo } from '../services/aiService';
import { useLanguage } from '../context/LanguageContext';
import { Search, BookOpen, Leaf, Droplets, Zap, Users, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

const SCHEMES_EN = [
  {
    id: 1, name: 'PM-KISAN', category: 'farming', icon: '🌾',
    benefit: '₹6,000/year direct benefit transfer to farmer bank accounts in 3 installments',
    eligibility: 'Small and marginal farmers with landholding up to 2 hectares',
    howToApply: 'Visit nearest CSC (Common Service Centre) or apply online at pmkisan.gov.in',
    documents: ['Aadhaar Card', 'Bank Account Details', 'Land Records (Khasra/Khatauni)'],
    deadline: 'Ongoing — Register anytime',
    color: '#10b981',
  },
  {
    id: 2, name: 'PM Fasal Bima Yojana', category: 'farming', icon: '🛡️',
    benefit: 'Crop insurance at premium of 1.5-2% for Rabi, 2% for Kharif crops',
    eligibility: 'All farmers growing notified crops in notified areas',
    howToApply: 'Apply through banks, insurance companies, or CSC centers',
    documents: ['Land Records', 'Bank Account', 'Sowing Certificate'],
    deadline: 'Before crop sowing season',
    color: '#3b82f6',
  },
  {
    id: 3, name: 'Jal Jeevan Mission', category: 'water', icon: '💧',
    benefit: 'Functional household tap connections with potable water supply',
    eligibility: 'All rural households without piped water supply',
    howToApply: 'Contact Gram Panchayat or district water supply department',
    documents: ['Aadhaar Card', 'Ration Card', 'Property Documents'],
    deadline: 'Target: 2024 (ongoing)',
    color: '#0ea5e9',
  },
  {
    id: 4, name: 'PM Surya Ghar Muft Bijli Yojana', category: 'energy', icon: '☀️',
    benefit: 'Up to 300 units of free electricity/month + subsidy up to ₹78,000',
    eligibility: 'Residential electricity consumers in India',
    howToApply: 'Apply online at pmsuryagarh.gov.in or through electricity distribution companies',
    documents: ['Aadhaar Card', 'Electricity Bill', 'Bank Account'],
    deadline: 'Ongoing',
    color: '#f59e0b',
  },
  {
    id: 5, name: 'MGNREGS', category: 'rural', icon: '👷',
    benefit: '100 days guaranteed wage employment per year to rural households',
    eligibility: 'Adult members of rural households willing to do unskilled manual work',
    howToApply: 'Register at Gram Panchayat and get Job Card',
    documents: ['Aadhaar Card', 'Ration Card', 'Passport Photo', 'Bank Account'],
    deadline: 'Ongoing',
    color: '#8b5cf6',
  },
  {
    id: 6, name: 'PM Ujjwala Yojana', category: 'energy', icon: '🔥',
    benefit: 'Free LPG connection + ₹1,600 financial assistance for BPL families',
    eligibility: 'BPL household women above 18 years without LPG connection',
    howToApply: 'Visit nearest LPG distributor with required documents',
    documents: ['Aadhaar Card', 'BPL Ration Card', 'Bank Account', 'Passport Photo'],
    deadline: 'Ongoing',
    color: '#ef4444',
  },
  {
    id: 7, name: 'Soil Health Card Scheme', category: 'farming', icon: '🧪',
    benefit: 'Free soil testing with nutrient recommendations and crop suitability report',
    eligibility: 'All farmers across India',
    howToApply: 'Contact local Agriculture Department or Krishi Vigyan Kendra',
    documents: ['Land Records', 'Aadhaar Card'],
    deadline: 'Ongoing',
    color: '#6b7280',
  },
  {
    id: 8, name: 'Atal Bhujal Yojana', category: 'water', icon: '🌊',
    benefit: 'Groundwater management support and community participation in water conservation',
    eligibility: 'Communities in water-stressed regions of 7 states',
    howToApply: 'Contact district groundwater department or Gram Sabha',
    documents: ['Village-level participation required'],
    deadline: '2025-26',
    color: '#06b6d4',
  },
];

const SCHEMES_TA = [
  {
    id: 1, name: 'PM-KISAN', category: 'farming', icon: '🌾',
    benefit: 'விவசாயிகளின் வங்கி கணக்கிற்கு 3 தவணைகளில் ஆண்டுக்கு ₹6,000 நேரடி நிதி உதவி',
    eligibility: '2 ஹெக்டேர் வரை நிலம் வைத்துள்ள சிறு மற்றும் குறு விவசாயிகள்',
    howToApply: 'அருகிலுள்ள CSC (பொது சேவை மையம்) அல்லது pmkisan.gov.in இணையதளத்தில் விண்ணப்பிக்கவும்',
    documents: ['அடையாள அட்டை (Aadhaar)', 'வங்கி கணக்கு விவரங்கள்', 'நில ஆவணங்கள் (பட்டா/சிட்டா)'],
    deadline: 'தொடர்ந்து நடைபெறுகிறது — எப்போது வேண்டுமானாலும் பதிவு செய்யலாம்',
    color: '#10b981',
  },
  {
    id: 2, name: 'PM பயிர் காப்பீட்டுத் திட்டம் (Fasal Bima)', category: 'farming', icon: '🛡️',
    benefit: 'ரபி பயிர்களுக்கு 1.5-2%, காரிப் பயிர்களுக்கு 2% குறைந்த பிரீமியத்தில் பயிர் காப்பீடு',
    eligibility: 'அறிவிக்கப்பட்ட பகுதிகளில் அறிவிக்கப்பட்ட பயிர்களை பயிரிடும் அனைத்து விவசாயிகள்',
    howToApply: 'வங்கிகள், காப்பீட்டு நிறுவனங்கள் அல்லது CSC மையங்கள் மூலம் விண்ணப்பிக்கவும்',
    documents: ['நில ஆவணங்கள்', 'வங்கி கணக்கு', 'பயிர் விதைப்பு சான்றிதழ்'],
    deadline: 'பயிர் விதைப்பு காலத்திற்கு முன்பு',
    color: '#3b82f6',
  },
  {
    id: 3, name: 'ஜல் ஜீவன் மிஷன் (Jal Jeevan)', category: 'water', icon: '💧',
    benefit: 'வீடுகளுக்கு குடிநீர் வழங்கும் பாதுகாப்பான குழாய் நீர் இணைப்புகள்',
    eligibility: 'குழாய் நீர் இணைப்பு இல்லாத அனைத்து கிராமப்புற வீடுகள்',
    howToApply: 'கிராம பஞ்சாயத்து அல்லது மாவட்ட குடிநீர் வழங்கல் துறையை தொடர்பு கொள்ளவும்',
    documents: ['அடையாள அட்டை (Aadhaar)', 'குடும்ப அட்டை (Ration Card)', 'சொத்து ஆவணங்கள்'],
    deadline: 'இலக்கு: 2024 (தொடர்கிறது)',
    color: '#0ea5e9',
  },
  {
    id: 4, name: 'PM சூர்ய கர் இலவச மின்சாரத் திட்டம்', category: 'energy', icon: '☀️',
    benefit: 'மாதம் 300 யூனிட் வரை இலவச மின்சாரம் + ₹78,000 வரை சோலார் மானியம்',
    eligibility: 'இந்தியாவில் உள்ள குடியிருப்பு மின் நுகர்வோர்',
    howToApply: 'pmsuryagarh.gov.in இணையதளத்தில் அல்லது மின்சார வாரியம் மூலம் விண்ணப்பிக்கவும்',
    documents: ['அடையாள அட்டை (Aadhaar)', 'மின் கட்டண ரசீது', 'வங்கி கணக்கு'],
    deadline: 'தொடர்ந்து நடைபெறுகிறது',
    color: '#f59e0b',
  },
  {
    id: 5, name: 'மகாத்மா காந்தி தேசிய ஊரக வேலை உறுதித் திட்டம் (MGNREGS)', category: 'rural', icon: '👷',
    benefit: 'கிராமப்புற குடும்பங்களுக்கு ஆண்டுக்கு 100 நாட்கள் வேலைவாய்ப்பு உத்தரவாதம்',
    eligibility: 'உடலுழைப்பு செய்ய விருப்பமுள்ள கிராமப்புற குடும்பங்களின் வயது வந்த உறுப்பினர்கள்',
    howToApply: 'கிராம பஞ்சாயத்தில் பதிவு செய்து வேலை அட்டையைப் (Job Card) பெறவும்',
    documents: ['அடையாள அட்டை (Aadhaar)', 'குடும்ப அட்டை', 'புகைப்படம்', 'வங்கி கணக்கு'],
    deadline: 'தொடர்ந்து நடைபெறுகிறது',
    color: '#8b5cf6',
  },
  {
    id: 6, name: 'PM உஜ்வாலா திட்டம் (Ujjwala)', category: 'energy', icon: '🔥',
    benefit: 'வறுமைக் கோட்டிற்கு கீழ் உள்ள குடும்பங்களுக்கு இலவச எரிவாயு இணைப்பு + ₹1,600 உதவித்தொகை',
    eligibility: 'எரிவாயு இணைப்பு இல்லாத வறுமைக்கோட்டிற்கு கீழ் உள்ள வீட்டுப் பெண்கள் (18+ வயது)',
    howToApply: 'தேவையான ஆவணங்களுடன் அருகிலுள்ள கேஸ் விநியோகஸ்தரை அணுகவும்',
    documents: ['அடையாள அட்டை (Aadhaar)', 'வறுமைக்கோட்டு குடும்ப அட்டை', 'வங்கி கணக்கு', 'புகைப்படம்'],
    deadline: 'தொடர்ந்து நடைபெறுகிறது',
    color: '#ef4444',
  },
  {
    id: 7, name: 'மண் வள அட்டை திட்டம்', category: 'farming', icon: '🧪',
    benefit: 'இலவச மண் பரிசோதனை, ஊட்டச்சத்து பரிந்துரைகள் மற்றும் பயிர் பொருத்த அறிக்கை',
    eligibility: 'இந்தியா முழுவதும் உள்ள அனைத்து விவசாயிகள்',
    howToApply: 'வட்டார வேளாண்மை அலுவலகம் அல்லது கிருஷி விக்யான் கேந்திராவை தொடர்பு கொள்ளவும்',
    documents: ['நில ஆவணங்கள்', 'அடையாள அட்டை (Aadhaar)'],
    deadline: 'தொடர்ந்து நடைபெறுகிறது',
    color: '#6b7280',
  },
  {
    id: 8, name: 'அடல் பூஜல் திட்டம் (Atal Bhujal)', category: 'water', icon: '🌊',
    benefit: 'நிலத்தடி நீர் மேலாண்மை ஆதரவு மற்றும் சமூக நீர் பாதுகாப்பு பங்களிப்பு',
    eligibility: 'நீர் பற்றாக்குறை உள்ள பகுதிகளில் உள்ள சமூகங்கள்',
    howToApply: 'மாவட்ட நிலத்தடி நீர் துறை அல்லது கிராம சபையை தொடர்பு கொள்ளவும்',
    documents: ['கிராம அளவிலான பங்களிப்பு தேவை'],
    deadline: '2025-26',
    color: '#06b6d4',
  },
];

const SchemesPage = () => {
  const { t, lang } = useLanguage();
  const isTa = lang === 'ta';
  const SCHEMES = isTa ? SCHEMES_TA : SCHEMES_EN;

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const filtered = SCHEMES.filter(s => {
    const matchCat = activeCategory === 'all' || s.category === activeCategory;
    const matchSearch = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.benefit.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleAiSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error(isTa ? 'தேடலை உள்ளிடவும்' : 'Please enter a search query');
      return;
    }
    setAiLoading(true);
    setAiAnswer('');
    try {
      // Send RAG request to backend
      const answer = await getSchemeInfo(searchQuery, activeCategory);
      if (typeof answer === 'string') {
        setAiAnswer(answer);
      } else if (answer.response) {
        setAiAnswer(answer.response);
      } else {
        setAiAnswer(isTa ? 'பொருத்தமான திட்டங்கள் கண்டறியப்பட்டன. கீழே காண்க.' : 'Found matching schemes. See details below.');
      }
    } catch {
      toast.error(isTa ? 'AI தேடல் தோல்வியடைந்தது' : 'AI search failed');
    } finally {
      setAiLoading(false);
    }
  };

  const CATEGORIES = [
    { id: 'all', label: t('schemes_all'), icon: BookOpen, color: 'var(--primary)' },
    { id: 'farming', label: t('schemes_farming'), icon: Leaf, color: '#10b981' },
    { id: 'water', label: t('schemes_water'), icon: Droplets, color: '#0ea5e9' },
    { id: 'energy', label: t('schemes_energy'), icon: Zap, color: '#f59e0b' },
    { id: 'rural', label: t('schemes_rural'), icon: Users, color: '#8b5cf6' },
  ];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '28px', textAlign: 'center' }}>
        <span className="badge badge-purple" style={{ marginBottom: '10px' }}>{t('schemes_badge')}</span>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, color: 'var(--text-1)', marginBottom: '8px' }}>
          {t('schemes_title')}
        </h1>
        <p style={{ color: 'var(--text-3)', fontSize: '15px', maxWidth: '600px', margin: '0 auto' }}>
          {t('schemes_subtitle')}
        </p>
      </motion.div>

      {/* AI Search */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Search size={16} color="#8b5cf6" />
          </div>
          <h3 style={{ color: 'var(--text-1)', fontWeight: 700, fontSize: '15px' }}>{t('schemes_ai_title')}</h3>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input className="form-input" id="scheme-search-input" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAiSearch()}
            placeholder={t('schemes_search_placeholder')}
            style={{ flex: 1, minWidth: '200px' }} />
          <button onClick={handleAiSearch} id="scheme-search-btn" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}
            disabled={aiLoading}>
            {aiLoading ? t('schemes_searching') : <><Search size={16} /> {t('schemes_ai_search')}</>}
          </button>
        </div>
        {aiAnswer && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: '16px', padding: '16px', background: 'var(--primary-bg)', border: '1px solid var(--primary-border)', borderRadius: '10px' }}>
            <p style={{ color: 'var(--text-2)', fontSize: '13px', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{aiAnswer}</p>
          </motion.div>
        )}
      </div>

      {/* Category filters */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {CATEGORIES.map(({ id, label, icon: Icon, color }) => (
          <button key={id} id={`cat-${id}-btn`} onClick={() => setActiveCategory(id)}
            className={`btn btn-sm ${activeCategory === id ? 'btn-primary' : 'btn-secondary'}`}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p style={{ color: 'var(--text-3)', fontSize: '13px', marginBottom: '16px' }}>
        {t('schemes_showing')} <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{filtered.length}</span> {t('schemes_schemes')}
      </p>

      {/* Scheme cards */}
      <motion.div layout style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
        <AnimatePresence>
          {filtered.map(scheme => (
            <SchemeCard key={scheme.id} scheme={scheme} t={t} isTa={isTa} />
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 24px', color: 'var(--text-3)' }}>
            <BookOpen size={44} style={{ margin: '0 auto 16px', opacity: 0.4 }} />
            <p style={{ fontSize: '15px', fontWeight: 600 }}>{t('schemes_not_found')}</p>
            <p style={{ fontSize: '13px', marginTop: '8px' }}>{t('schemes_try_different')}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

const SchemeCard = ({ scheme, t, isTa }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div layout className="card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
        <span style={{ fontSize: '28px' }}>{scheme.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', flexWrap: 'wrap' }}>
            <h3 style={{ color: 'var(--text-1)', fontWeight: 700, fontSize: '15px', fontFamily: 'Outfit, sans-serif' }}>{scheme.name}</h3>
            <span className="badge" style={{ background: `${scheme.color}15`, color: scheme.color, fontSize: '10px', textTransform: 'capitalize' }}>
              {scheme.category}
            </span>
          </div>
          <p style={{ color: 'var(--text-2)', fontSize: '13px', marginTop: '6px', lineHeight: '1.5' }}>{scheme.benefit}</p>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden', borderTop: '1px solid var(--border)', paddingTop: '14px', marginTop: '10px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '12px' }}>
              <div>
                <p style={{ color: 'var(--text-3)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>{t('schemes_eligibility')}</p>
                <p style={{ color: 'var(--text-2)', fontSize: '13px', lineHeight: '1.5' }}>{scheme.eligibility}</p>
              </div>
              <div>
                <p style={{ color: 'var(--text-3)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>{t('schemes_how_to_apply')}</p>
                <p style={{ color: 'var(--text-2)', fontSize: '13px', lineHeight: '1.5' }}>{scheme.howToApply}</p>
              </div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <p style={{ color: 'var(--text-3)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>{t('schemes_documents')}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {scheme.documents.map(doc => (
                  <span key={doc} style={{ padding: '3px 8px', borderRadius: '6px', background: 'var(--border-2)', color: 'var(--text-2)', fontSize: '11px' }}>
                    {doc}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px dashed var(--border)', paddingTop: '10px' }}>
              <span style={{ color: 'var(--text-3)', fontSize: '12px' }}>📅 {isTa ? 'கடைசி தேதி' : 'Deadline'}: {scheme.deadline}</span>
              <a href="#" onClick={e => { e.preventDefault(); toast.success(isTa ? 'திட்ட போர்ட்டல் திறக்கப்படுகிறது...' : 'Opening scheme portal...'); }}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', color: scheme.color, fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
                {t('schemes_apply_now')} <ExternalLink size={13} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button onClick={() => setExpanded(!expanded)} id={`scheme-${scheme.id}-toggle`}
        className="btn btn-sm btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
        {expanded ? <><ChevronUp size={13} /> {t('schemes_show_less')}</> : <><ChevronDown size={13} /> {t('schemes_show_details')}</>}
      </button>
    </motion.div>
  );
};

export default SchemesPage;
