import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getFarmingAdvice } from '../services/aiService';
import { useLanguage } from '../context/LanguageContext';
import { Wheat, Droplets, Leaf, Loader2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const CROPS_EN = ['Rice', 'Wheat', 'Maize', 'Ragi', 'Sugarcane', 'Cotton', 'Tomato', 'Onion', 'Groundnut', 'Sunflower', 'Banana', 'Turmeric'];
const CROPS_TA = ['அரிசி', 'கோதுமை', 'மக்காச்சோளம்', 'ராகி', 'கரும்பு', 'பருத்தி', 'தக்காளி', 'வெங்காயம்', 'நிலக்கடலை', 'சூரியகாந்தி', 'வாழை', 'மஞ்சள்'];
const SEASONS_EN = ['Kharif (Jun-Sep)', 'Rabi (Oct-Mar)', 'Zaid (Mar-Jun)', 'Year-round'];
const SEASONS_TA = ['காரிப் (ஜூன்-செப்)', 'ரபி (அக்-மார்)', 'ஜெய்த் (மார்-ஜூன்)', 'ஆண்டு முழுவதும்'];
const LOCATIONS = ['Tamil Nadu', 'Karnataka', 'Andhra Pradesh', 'Kerala', 'Maharashtra', 'Punjab', 'Haryana', 'Rajasthan'];

const QUICK_TIPS_EN = [
  { icon: '🌱', title: 'Companion Planting', desc: 'Plant marigolds near tomatoes to repel nematodes and aphids naturally.', tag: 'Organic' },
  { icon: '💧', title: 'Drip Irrigation', desc: 'Switch to drip irrigation to save 50-70% water compared to flood irrigation.', tag: 'Water-Smart' },
  { icon: '🌿', title: 'Vermicompost', desc: 'Add vermicompost 2 weeks before planting for nutrient-rich soil.', tag: 'Soil Health' },
  { icon: '☀️', title: 'Solar Drying', desc: 'Use solar dryers to preserve crops and reduce post-harvest losses by 30%.', tag: 'Post-Harvest' },
  { icon: '🦗', title: 'Neem Oil Spray', desc: 'Mix 5ml neem oil per liter water — effective against 200+ pest species.', tag: 'Pest Control' },
  { icon: '🌾', title: 'Crop Rotation', desc: 'Rotate legumes with cereals to naturally restore soil nitrogen levels.', tag: 'Soil Health' },
];

const QUICK_TIPS_TA = [
  { icon: '🌱', title: 'துணை பயிர்', desc: 'நெமடோட்கள் மற்றும் பூச்சிகளை விரட்ட தக்காளி அருகே மரிகோல்ட் நடவுங்கள்.', tag: 'கரிமம்' },
  { icon: '💧', title: 'சொட்டு நீர்ப்பாசனம்', desc: 'வெள்ள நீர்ப்பாசனத்துடன் ஒப்பிடும்போது 50-70% நீரை சேமிக்க சொட்டு நீர்ப்பாசனம் பயன்படுத்துங்கள்.', tag: 'நீர் சேமிப்பு' },
  { icon: '🌿', title: 'மண்புழு உரம்', desc: 'ஊட்டச்சத்து நிறைந்த மண்ணுக்காக நடவுக்கு 2 வாரங்கள் முன்பு மண்புழு உரம் சேர்க்கவும்.', tag: 'மண் ஆரோக்கியம்' },
  { icon: '☀️', title: 'சூரிய உலர்த்தல்', desc: 'பயிர்களை பாதுகாக்கவும் அறுவடைக்கு பிந்தைய இழப்புகளை 30% குறைக்கவும் சூரிய உலர்த்திகளைப் பயன்படுத்துங்கள்.', tag: 'அறுவடை' },
  { icon: '🦗', title: 'வேம்பு எண்ணெய் தெளிப்பு', desc: 'லிட்டர் நீரில் 5ml வேம்பு எண்ணெய் கலக்கவும் — 200+ பூச்சி இனங்களுக்கு எதிராக பயனுள்ளது.', tag: 'பூச்சி கட்டுப்பாடு' },
  { icon: '🌾', title: 'பயிர் சுழற்சி', desc: 'மண்ணில் இயற்கையாக நைட்ரஜனை மீட்டெடுக்க தானியங்களுடன் பருப்பு வகைகளை சுழற்றுங்கள்.', tag: 'மண் ஆரோக்கியம்' },
];

const PEST_EN = [
  { name: 'Aphids', control: 'Neem oil spray (5ml/L)', severity: 'Medium', crop: 'Vegetables' },
  { name: 'Brown Plant Hopper', control: 'Carbofuran 3G @33 kg/ha', severity: 'High', crop: 'Rice' },
  { name: 'Bollworm', control: 'Bt spray or pheromone traps', severity: 'High', crop: 'Cotton' },
  { name: 'Leaf Miner', control: 'Yellow sticky traps + neem', severity: 'Low', crop: 'Tomato' },
  { name: 'Thrips', control: 'Spinosad or imidacloprid', severity: 'Medium', crop: 'Onion' },
  { name: 'Root Weevil', control: 'Drenching with chlorpyrifos', severity: 'High', crop: 'Banana' },
];

const PEST_TA = [
  { name: 'பேன்கள்', control: 'வேம்பு எண்ணெய் (5ml/L)', severity: 'நடுத்தர', crop: 'காய்கறிகள்' },
  { name: 'பழுப்பு தாவர தத்துப்பூச்சி', control: 'கார்போஃபுரான் 3G @33 கி/ஹெக்', severity: 'அதிக', crop: 'அரிசி' },
  { name: 'பொல்வோர்ம்', control: 'Bt தெளிப்பு அல்லது பெரோமோன் பொறிகள்', severity: 'அதிக', crop: 'பருத்தி' },
  { name: 'இலை மைனர்', control: 'மஞ்சள் ஒட்டும் பொறிகள் + வேம்பு', severity: 'குறைந்த', crop: 'தக்காளி' },
  { name: 'த்ரிப்ஸ்', control: 'ஸ்பினோசாட் அல்லது இமிடாக்ளோபிரிட்', severity: 'நடுத்தர', crop: 'வெங்காயம்' },
  { name: 'வேர் வண்டு', control: 'குளோர்பைரிஃபாஸ் உடன் தடவுதல்', severity: 'அதிக', crop: 'வாழை' },
];

const SEASONAL_EN = [
  { season: 'Kharif', months: 'June – September', crops: ['Rice', 'Maize', 'Cotton', 'Sugarcane', 'Groundnut'], icon: '🌧️', color: '#3b82f6', tip: 'Monitor for excess rainfall and waterlogging. Use ridge & furrow method.' },
  { season: 'Rabi', months: 'October – March', crops: ['Wheat', 'Mustard', 'Chickpea', 'Barley', 'Peas'], icon: '❄️', color: '#8b5cf6', tip: 'Ensure irrigation at crown root initiation stage. Apply phosphorus fertilizers.' },
  { season: 'Zaid', months: 'March – June', crops: ['Watermelon', 'Muskmelon', 'Bitter Gourd', 'Cucumber'], icon: '☀️', color: '#f59e0b', tip: 'Install shade nets for high-value crops. Drip irrigation is essential.' },
];

const SEASONAL_TA = [
  { season: 'காரிப்', months: 'ஜூன் – செப்டம்பர்', crops: ['அரிசி', 'மக்காச்சோளம்', 'பருத்தி', 'கரும்பு', 'நிலக்கடலை'], icon: '🌧️', color: '#3b82f6', tip: 'அதிக மழைப்பொழிவு மற்றும் நீர் தேக்கத்தை கண்காணிக்கவும். ரிட்ஜ் & ஃபர்ரோ முறையை பயன்படுத்துங்கள்.' },
  { season: 'ரபி', months: 'அக்டோபர் – மார்ச்', crops: ['கோதுமை', 'கடுகு', 'கொண்டைக்கடலை', 'வாற்கோதுமை', 'பட்டாணி'], icon: '❄️', color: '#8b5cf6', tip: 'கிரீடு வேர் தொடக்க நிலையில் நீர்ப்பாசனம் உறுதி செய்யுங்கள். பாஸ்பரஸ் உரங்கள் இடுங்கள்.' },
  { season: 'ஜெய்த்', months: 'மார்ச் – ஜூன்', crops: ['தர்பூசணி', 'முலாம்பழம்', 'பாகற்காய்', 'வெள்ளரிக்காய்'], icon: '☀️', color: '#f59e0b', tip: 'அதிக மதிப்பு பயிர்களுக்கு நிழல் வலைகள் அமைக்கவும். சொட்டு நீர்ப்பாசனம் அவசியம்.' },
];

const FarmingPage = () => {
  const { t, lang } = useLanguage();
  const isTa = lang === 'ta';

  const CROPS   = isTa ? CROPS_TA   : CROPS_EN;
  const SEASONS  = isTa ? SEASONS_TA  : SEASONS_EN;
  const TIPS    = isTa ? QUICK_TIPS_TA : QUICK_TIPS_EN;
  const PESTS   = isTa ? PEST_TA    : PEST_EN;
  const SEASONAL = isTa ? SEASONAL_TA  : SEASONAL_EN;

  const [selectedCropIdx, setSelectedCropIdx] = useState(null);
  const [location, setLocation]   = useState('Tamil Nadu');
  const [season, setSeason]       = useState('');
  const [advice, setAdvice]       = useState(null);
  const [loading, setLoading]     = useState(false);
  const [activeTab, setActiveTab] = useState('advisor');

  const handleGetAdvice = async () => {
    if (selectedCropIdx === null) {
      toast.error(isTa ? 'பயிரை தேர்ந்தெடுக்கவும்' : 'Please select a crop');
      return;
    }
    setLoading(true);
    try {
      const cropName = CROPS_EN[selectedCropIdx]; // always send English crop name to AI
      const result = await getFarmingAdvice(cropName, location, season);
      setAdvice(result);
      toast.success(isTa ? 'AI ஆலோசனை தயார்!' : 'AI farming advice ready!');
    } catch {
      toast.error(isTa ? 'ஆலோசனை பெற முடியவில்லை' : 'Failed to get advice');
    } finally {
      setLoading(false);
    }
  };

  const TABS = [
    { id: 'advisor',  label: t('farming_tab_advisor')  },
    { id: 'tips',     label: t('farming_tab_tips')     },
    { id: 'pest',     label: t('farming_tab_pest')     },
    { id: 'seasonal', label: t('farming_tab_seasonal') },
  ];

  const sevColor = (s) => {
    if (s === 'High'   || s === 'அதிக')   return { bg: 'rgba(239,68,68,0.1)',   color: '#ef4444' };
    if (s === 'Medium' || s === 'நடுத்தர') return { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b' };
    return { bg: 'rgba(34,197,94,0.1)', color: 'var(--primary)' };
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '28px' }}>
        <span className="badge badge-green" style={{ marginBottom: '10px' }}>{t('farming_badge')}</span>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, color: 'var(--text-1)', marginBottom: '8px' }}>
          {t('farming_title')}
        </h1>
        <p style={{ color: 'var(--text-3)', fontSize: '15px' }}>{t('farming_subtitle')}</p>
      </motion.div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {TABS.map(({ id, label }) => (
          <button key={id} id={`farm-tab-${id}`} onClick={() => setActiveTab(id)}
            className={`btn btn-sm ${activeTab === id ? 'btn-primary' : 'btn-secondary'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* ── AI Advisor ─────────────────── */}
      {activeTab === 'advisor' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          {/* Config form */}
          <div className="card">
            <h3 style={{ color: 'var(--text-1)', fontWeight: 700, fontSize: '16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Wheat size={18} color="var(--primary)" /> {t('farming_configure')}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Crop select */}
              <div className="form-group">
                <label className="form-label">{t('farming_select_crop')}</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {CROPS.map((crop, i) => (
                    <button key={i} onClick={() => setSelectedCropIdx(i)}
                      className={`btn btn-sm ${selectedCropIdx === i ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ fontSize: '12px', padding: '5px 12px' }}>
                      {crop}
                    </button>
                  ))}
                </div>
              </div>
              {/* Location */}
              <div className="form-group">
                <label className="form-label">{t('farming_location')}</label>
                <select className="form-select" value={location} onChange={e => setLocation(e.target.value)}>
                  {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              {/* Season */}
              <div className="form-group">
                <label className="form-label">{t('farming_season')}</label>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {SEASONS.map((s, i) => (
                    <button key={i} onClick={() => setSeason(SEASONS_EN[i])}
                      className={`btn btn-sm ${season === SEASONS_EN[i] ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ fontSize: '12px' }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={handleGetAdvice} disabled={loading || selectedCropIdx === null}
                className="btn btn-primary" style={{ justifyContent: 'center', marginTop: '4px' }}>
                {loading
                  ? <><Loader2 size={16} className="animate-spin" /> {t('farming_getting')}</>
                  : <><Leaf size={16} /> {t('farming_get_advice')}</>}
              </button>
            </div>
          </div>

          {/* Results */}
          <div>
            <AnimatePresence mode="wait">
              {!advice && !loading && (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="card" style={{ textAlign: 'center', padding: '60px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '280px' }}>
                  <Wheat size={44} color="var(--border-2)" style={{ marginBottom: '14px' }} />
                  <p style={{ color: 'var(--text-3)', fontSize: '15px', fontWeight: 600 }}>{t('farming_select_crop_hint')}</p>
                </motion.div>
              )}
              {loading && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="card" style={{ textAlign: 'center', padding: '60px 24px', minHeight: '280px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                    style={{ width: '48px', height: '48px', borderRadius: '50%', border: '3px solid var(--border-2)', borderTopColor: 'var(--primary)', marginBottom: '14px' }} />
                  <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '14px' }}>{t('farming_analyzing')}</p>
                </motion.div>
              )}
              {advice && (
                <motion.div key="result" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="card">
                    <h3 style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '15px', marginBottom: '16px' }}>
                      🌾 {t('farming_results_for')} {selectedCropIdx !== null ? CROPS[selectedCropIdx] : ''}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {advice.recommendations?.map(({ title, desc }, i) => (
                        <div key={i} style={{ display: 'flex', gap: '10px', padding: '12px', background: 'var(--primary-bg)', border: '1px solid var(--primary-border)', borderRadius: '10px' }}>
                          <CheckCircle size={15} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <div>
                            <p style={{ color: 'var(--text-1)', fontWeight: 600, fontSize: '13px', marginBottom: '3px' }}>{title}</p>
                            <p style={{ color: 'var(--text-2)', fontSize: '13px', lineHeight: '1.5' }}>{desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ padding: '14px', background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '10px' }}>
                      <Droplets size={16} color="#3b82f6" style={{ marginBottom: '6px' }} />
                      <p style={{ color: '#3b82f6', fontWeight: 700, fontSize: '12px' }}>{t('farming_water_needs')}</p>
                      <p style={{ color: 'var(--text-2)', fontSize: '12px', marginTop: '4px' }}>{advice.waterNeeds}</p>
                    </div>
                    <div style={{ padding: '14px', background: 'var(--primary-bg)', border: '1px solid var(--primary-border)', borderRadius: '10px' }}>
                      <Leaf size={16} color="var(--primary)" style={{ marginBottom: '6px' }} />
                      <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '12px' }}>{t('farming_organic')}</p>
                      <p style={{ color: 'var(--text-2)', fontSize: '12px', marginTop: '4px' }}>{advice.organicFertilizer}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* ── Quick Tips ─────────────────── */}
      {activeTab === 'tips' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {TIPS.map((tip, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ fontSize: '30px' }}>{tip.icon}</span>
                <span className="badge badge-green" style={{ fontSize: '11px' }}>{tip.tag}</span>
              </div>
              <h3 style={{ color: 'var(--text-1)', fontWeight: 700, fontSize: '15px', marginBottom: '8px' }}>{tip.title}</h3>
              <p style={{ color: 'var(--text-2)', fontSize: '13px', lineHeight: '1.65' }}>{tip.desc}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Pest Guide ─────────────────── */}
      {activeTab === 'pest' && (
        <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {(isTa
                  ? ['பூச்சி பெயர்', 'பயிர்', 'கட்டுப்பாட்டு முறை', 'தீவிரம்']
                  : ['Pest Name', 'Affected Crop', 'Control Method', 'Severity']
                ).map(h => (
                  <th key={h} style={{ color: 'var(--text-3)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', padding: '12px 16px', textAlign: 'left', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PESTS.map((pest, i) => {
                const sv = sevColor(pest.severity);
                return (
                  <motion.tr key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                    style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ color: 'var(--text-1)', fontWeight: 600, fontSize: '14px', padding: '14px 16px' }}>{pest.name}</td>
                    <td style={{ color: 'var(--text-2)', fontSize: '13px', padding: '14px 16px' }}>{pest.crop}</td>
                    <td style={{ color: 'var(--text-2)', fontSize: '13px', padding: '14px 16px' }}>{pest.control}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 600, background: sv.bg, color: sv.color }}>
                        {pest.severity}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Seasonal Guide ─────────────── */}
      {activeTab === 'seasonal' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {SEASONAL.map(({ season, months, crops, icon, color, tip }, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <span style={{ fontSize: '32px' }}>{icon}</span>
                <div>
                  <h3 style={{ color: 'var(--text-1)', fontWeight: 700, fontSize: '16px' }}>{season}</h3>
                  <p style={{ color, fontSize: '13px' }}>{months}</p>
                </div>
              </div>
              <p style={{ color: 'var(--text-3)', fontSize: '11px', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>
                {isTa ? 'முக்கிய பயிர்கள்' : 'Key Crops'}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '12px' }}>
                {crops.map(c => (
                  <span key={c} style={{ padding: '3px 10px', borderRadius: '99px', background: `${color}15`, color, fontSize: '12px', border: `1px solid ${color}25` }}>{c}</span>
                ))}
              </div>
              <div style={{ padding: '10px', background: `${color}08`, borderRadius: '8px', border: `1px solid ${color}20` }}>
                <p style={{ color: 'var(--text-2)', fontSize: '13px', lineHeight: '1.5' }}>💡 {tip}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FarmingPage;
