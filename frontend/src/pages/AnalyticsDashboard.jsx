import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
  ArcElement, PointElement, LineElement, Filler
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Droplets, Leaf, Trash2, TrendingUp, Award, Zap, TreePine, Target } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, Filler);

const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#94a3b8', font: { family: 'Inter', size: 12 } } },
    tooltip: {
      backgroundColor: 'rgba(13,22,40,0.95)',
      borderColor: 'rgba(0,208,132,0.3)',
      borderWidth: 1,
      titleColor: '#00d084',
      bodyColor: '#94a3b8',
    },
  },
  scales: {
    x: { grid: { color: 'rgba(26,45,74,0.5)' }, ticks: { color: '#64748b' } },
    y: { grid: { color: 'rgba(26,45,74,0.5)' }, ticks: { color: '#64748b' } },
  },
};

const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const MONTHS_TA = ['ஜன', 'பிப்', 'மார்', 'ஏப்', 'மே', 'ஜூன்'];

const StatCard = ({ icon: Icon, label, value, unit, change, color }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card">
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
      <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: `${color}12`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={20} color={color} />
      </div>
      {change && (
        <span style={{ padding: '3px 10px', borderRadius: '99px', background: change > 0 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: change > 0 ? 'var(--primary)' : '#ef4444', fontSize: '11px', fontWeight: 700 }}>
          {change > 0 ? '+' : ''}{change}%
        </span>
      )}
    </div>
    <p style={{ color: 'var(--text-3)', fontSize: '13px', marginBottom: '4px' }}>{label}</p>
    <p style={{ color: 'var(--text-1)', fontWeight: 800, fontSize: '24px', fontFamily: 'Outfit, sans-serif' }}>
      {value}<span style={{ fontSize: '14px', color: 'var(--text-3)', fontWeight: 400, marginLeft: '4px' }}>{unit}</span>
    </p>
  </motion.div>
);

const GreenScore = ({ score, label }) => {
  const pct = score / 100;
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);
  const color = score >= 80 ? 'var(--primary)' : score >= 60 ? '#f59e0b' : '#ef4444';
  return (
    <div style={{ position: 'relative', width: '140px', height: '140px', margin: '0 auto' }}>
      <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="70" cy="70" r={r} fill="none" stroke="var(--border)" strokeWidth="10" />
        <motion.circle cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeLinecap="round" strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color, fontWeight: 900, fontSize: '28px', fontFamily: 'Outfit, sans-serif' }}>{score}</span>
        <span style={{ color: 'var(--text-3)', fontSize: '11px' }}>{label}</span>
      </div>
    </div>
  );
};

const AnalyticsDashboard = () => {
  const { user, userProfile } = useAuth();
  const { t, lang } = useLanguage();
  const isTa = lang === 'ta';

  const [greenScore] = useState(72);
  const [activeTab, setActiveTab] = useState('overview');

  const MONTHS = isTa ? MONTHS_TA : MONTHS_EN;

  const waterData = {
    labels: MONTHS,
    datasets: [{
      label: isTa ? 'சேமிக்கப்பட்ட நீர் (லிட்டர்கள்)' : 'Water Saved (Liters)',
      data: [120, 190, 170, 210, 250, 280],
      backgroundColor: 'rgba(14,165,233,0.15)',
      borderColor: '#0ea5e9',
      borderWidth: 2,
      fill: true,
      tension: 0.4,
    }],
  };

  const wasteLabels = isTa 
    ? ['பிளாஸ்டிக்', 'கரிமம்', 'காகிதம்', 'மின் கழிவு', 'உலோகம்', 'இதர']
    : ['Plastic', 'Organic', 'Paper', 'E-Waste', 'Metal', 'Other'];

  const wasteData = {
    labels: wasteLabels,
    datasets: [{
      data: [35, 28, 18, 8, 7, 4],
      backgroundColor: ['#ef4444', '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#64748b'],
      borderWidth: 0,
      hoverOffset: 8,
    }],
  };

  const emissionData = {
    labels: MONTHS,
    datasets: [{
      label: isTa ? 'சேமிக்கப்பட்ட CO₂ (கிலோ)' : 'CO₂ Saved (kg)',
      data: [8, 12, 10, 15, 18, 22],
      backgroundColor: 'rgba(34,197,94,0.15)',
      borderColor: '#00d084',
      borderWidth: 2,
      fill: true,
      tension: 0.4,
    }],
  };

  const activityData = {
    labels: MONTHS,
    datasets: [
      { label: isTa ? 'AI அரட்டைகள்' : 'AI Chats', data: [12, 19, 15, 22, 28, 35], backgroundColor: 'rgba(34,197,94,0.7)', borderRadius: 6 },
      { label: isTa ? 'கழிவு ஸ்கேன்கள்' : 'Waste Scans', data: [5, 8, 6, 12, 10, 15], backgroundColor: 'rgba(14,165,233,0.7)', borderRadius: 6 },
      { label: isTa ? 'திட்ட பார்வைகள்' : 'Scheme Views', data: [3, 5, 4, 8, 6, 10], backgroundColor: 'rgba(139,92,246,0.7)', borderRadius: 6 },
    ],
  };

  const goals = [
    { label: t('analytics_water_goal'), progress: 68, target: isTa ? '500லி/மாதம்' : '500L/month', color: '#0ea5e9', icon: Droplets },
    { label: t('analytics_waste_goal'), progress: 82, target: isTa ? 'நெகிழி இல்லாத வாரம்' : 'Zero plastic/week', color: '#10b981', icon: Trash2 },
    { label: t('analytics_carbon_goal'), progress: 55, target: isTa ? '100கி CO₂ சேமிப்பு' : '100kg CO₂ saved', color: 'var(--primary)', icon: Leaf },
    { label: t('analytics_green_goal'), progress: 90, target: isTa ? 'தினசரி செயல்கள்' : 'Daily actions', color: '#f59e0b', icon: TreePine },
  ];

  const TABS = [
    { id: 'overview', label: isTa ? 'கண்ணோட்டம்' : 'Overview' },
    { id: 'water', label: isTa ? 'நீர்' : 'Water' },
    { id: 'waste', label: isTa ? 'கழிவு' : 'Waste' },
    { id: 'carbon', label: isTa ? 'கார்பன்' : 'Carbon' },
  ];

  const achievements = isTa ? [
    { icon: '🌱', title: 'பசுமை தொடக்காளர்', desc: 'முதல் நிலைத்தன்மை செயல்', unlocked: true },
    { icon: '💧', title: 'நீர் சேமிப்பாளர்', desc: '1000லி நீர் சேமிக்கப்பட்டது', unlocked: true },
    { icon: '♻️', title: 'மறுசுழற்சியாளர்', desc: '10 கழிவுகளை வகைப்படுத்தியுள்ளார்', unlocked: true },
    { icon: '🌾', title: 'புத்திசாலி விவசாயி', desc: 'AI விவசாய குறிப்புகளை பயன்படுத்தினார்', unlocked: true },
    { icon: '🏆', title: 'சுற்றுச்சூழல் சாம்பியன்', desc: '80 க்கும் அதிகமான பசுமை புள்ளி', unlocked: false },
    { icon: '🌍', title: 'சமூக தலைவர்', desc: '5 ஆலோசனைகளை பகிர்ந்துள்ளார்', unlocked: false },
  ] : [
    { icon: '🌱', title: 'Green Starter', desc: 'First sustainability action', unlocked: true },
    { icon: '💧', title: 'Water Saver', desc: 'Saved 1000L of water', unlocked: true },
    { icon: '♻️', title: 'Recycler', desc: 'Classified 10 waste items', unlocked: true },
    { icon: '🌾', title: 'Smart Farmer', desc: 'Applied AI farming tips', unlocked: true },
    { icon: '🏆', title: 'Eco Champion', desc: 'Score above 80', unlocked: false },
    { icon: '🌍', title: 'Community Leader', desc: 'Share 5 insights', unlocked: false },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="badge badge-green" style={{ marginBottom: '10px' }}>
            {isTa ? 'உடனுக்குடன் பகுப்பாய்வு' : 'Real-time Analytics'}
          </span>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, color: 'var(--text-1)', marginBottom: '8px' }}>
            {t('analytics_title')}
          </h1>
          <p style={{ color: 'var(--text-3)', fontSize: '14px' }}>
            {isTa ? `மீண்டும் வருக, ${userProfile?.displayName || 'பயனர்'} — உங்களது சுற்றுச்சூழல் தாக்கம்:` : `Welcome back, ${userProfile?.displayName || 'User'} — Here's your environmental impact:`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {TABS.map(tab => (
            <button key={tab.id} id={`tab-${tab.id}-btn`} onClick={() => setActiveTab(tab.id)}
              className={`btn btn-sm ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <StatCard icon={Droplets} label={isTa ? 'சேமித்த நீர்' : 'Water Saved'} value="1,240" unit="L" change={12} color="#0ea5e9" />
        <StatCard icon={Trash2} label={isTa ? 'வகைப்படுத்திய கழிவு' : 'Waste Classified'} value="48" unit={isTa ? 'ஸ்கேன்கள்' : 'scans'} change={24} color="#10b981" />
        <StatCard icon={Leaf} label={isTa ? 'குறைத்த CO₂' : 'CO₂ Reduced'} value="85" unit="kg" change={8} color="var(--primary)" />
        <StatCard icon={Zap} label={isTa ? 'AI உரையாடல்கள்' : 'AI Interactions'} value="131" unit={isTa ? 'அரட்டைகள்' : 'chats'} change={35} color="#8b5cf6" />
      </div>

      {/* Green Score + Goals */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        {/* Green Score Card */}
        <div className="card" style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'var(--text-1)', fontWeight: 700, fontSize: '16px', marginBottom: '20px', fontFamily: 'Outfit, sans-serif' }}>
            🌿 {isTa ? 'உங்கள் பசுமை புள்ளிகள்' : 'Your Green Score'}
          </h2>
          <GreenScore score={greenScore} label={t('analytics_green_score')} />
          <p style={{ color: 'var(--text-3)', fontSize: '13px', marginTop: '16px', marginBottom: '16px' }}>
            {isTa ? 'நீங்கள் 68% பயனர்களை விட சிறப்பாக செயல்படுகிறீர்கள்!' : "You're performing better than 68% of users!"}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px' }}>
            {[{ label: isTa ? 'விவசாயம்' : 'Farming', val: 75 }, { label: isTa ? 'நீர்' : 'Water', val: 82 }, { label: isTa ? 'கழிவு' : 'Waste', val: 60 }].map(({ label, val }) => (
              <div key={label} style={{ padding: '8px', background: 'var(--border-2)', borderRadius: '8px' }}>
                <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '15px' }}>{val}</p>
                <p style={{ color: 'var(--text-3)', fontSize: '11px' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Goals */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Target size={18} color="var(--primary)" />
            <h2 style={{ color: 'var(--text-1)', fontWeight: 700, fontSize: '16px', fontFamily: 'Outfit, sans-serif' }}>{t('analytics_goals')}</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {goals.map(({ label, progress, target, color, icon: Icon }) => (
              <div key={label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icon size={14} color={color} />
                    <span style={{ color: 'var(--text-1)', fontSize: '13px', fontWeight: 600 }}>{label}</span>
                  </div>
                  <span style={{ color: color, fontSize: '13px', fontWeight: 700 }}>{progress}%</span>
                </div>
                <div className="progress-bar" style={{ background: 'var(--border)' }}>
                  <motion.div className="progress-fill" initial={{ width: 0 }} whileInView={{ width: `${progress}%` }}
                    transition={{ duration: 0.8 }} viewport={{ once: true }}
                    style={{ background: color }} />
                </div>
                <p style={{ color: 'var(--text-3)', fontSize: '11px', marginTop: '4px' }}>{isTa ? 'இலக்கு' : 'Target'}: {target}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        {/* Water savings line chart */}
        <div className="card">
          <h3 style={{ color: 'var(--text-1)', fontWeight: 700, fontSize: '15px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Droplets size={16} color="#0ea5e9" /> {isTa ? 'நீர் சேமிப்பு போக்கு' : 'Water Savings Trend'}
          </h3>
          <div style={{ height: '200px' }}>
            <Line data={waterData} options={{ ...chartDefaults, plugins: { ...chartDefaults.plugins, legend: { display: false } } }} />
          </div>
        </div>

        {/* Waste donut */}
        <div className="card">
          <h3 style={{ color: 'var(--text-1)', fontWeight: 700, fontSize: '15px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Trash2 size={16} color="#10b981" /> {isTa ? 'கழிவு விநியோகம்' : 'Waste Distribution'}
          </h3>
          <div style={{ height: '200px' }}>
            <Doughnut data={wasteData} options={{ ...chartDefaults, scales: undefined, cutout: '65%' }} />
          </div>
        </div>

        {/* CO2 chart */}
        <div className="card">
          <h3 style={{ color: 'var(--text-1)', fontWeight: 700, fontSize: '15px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Leaf size={16} color="var(--primary)" /> {isTa ? 'கார்பன் குறைப்பு' : 'CO₂ Reduction'}
          </h3>
          <div style={{ height: '200px' }}>
            <Line data={emissionData} options={{ ...chartDefaults, plugins: { ...chartDefaults.plugins, legend: { display: false } } }} />
          </div>
        </div>

        {/* Activity bar chart */}
        <div className="card">
          <h3 style={{ color: 'var(--text-1)', fontWeight: 700, fontSize: '15px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={16} color="#8b5cf6" /> {isTa ? 'தள செயல்பாடுகள்' : 'Platform Activity'}
          </h3>
          <div style={{ height: '200px' }}>
            <Bar data={activityData} options={chartDefaults} />
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Award size={18} color="#f59e0b" />
          <h2 style={{ color: 'var(--text-1)', fontWeight: 700, fontSize: '16px', fontFamily: 'Outfit, sans-serif' }}>
            {isTa ? 'வென்ற சாதனைகள்' : 'Achievements Unlocked'}
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          {achievements.map(({ icon, title, desc, unlocked }) => (
            <div key={title} style={{ padding: '14px', borderRadius: '10px', background: unlocked ? 'rgba(34,197,94,0.06)' : 'rgba(26,45,74,0.3)', border: `1px solid ${unlocked ? 'rgba(34,197,94,0.2)' : 'var(--border)'}`, opacity: unlocked ? 1 : 0.5, textAlign: 'center' }}>
              <div style={{ fontSize: '26px', marginBottom: '6px' }}>{icon}</div>
              <p style={{ color: unlocked ? 'var(--text-1)' : 'var(--text-3)', fontWeight: 700, fontSize: '13px' }}>{title}</p>
              <p style={{ color: 'var(--text-3)', fontSize: '11px', marginTop: '4px' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
