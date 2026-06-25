import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, Users, Brain, AlertCircle, CheckCircle, Scale, Lock } from 'lucide-react';

const principles = [
  { icon: Scale, title: 'Fairness & Non-Discrimination', color: '#00d084', desc: 'EcoBot AI is designed to serve all communities equally, regardless of caste, gender, religion, or economic status. Our training data is reviewed for bias, and we continuously monitor outputs to prevent discrimination.', practices: ['Diverse training data', 'Bias detection & mitigation', 'Equal access for all users', 'Regular fairness audits'] },
  { icon: Eye, title: 'Transparency', color: '#0ea5e9', desc: 'We are open about how our AI works. EcoBot AI is powered by Google Gemini and clearly indicates when responses are AI-generated vs. human-curated content.', practices: ['AI-generated content labeling', 'Open model documentation', 'Explainable recommendations', 'No hidden data processing'] },
  { icon: Lock, title: 'Privacy Protection', color: '#8b5cf6', desc: 'User privacy is our top priority. We collect only necessary data, never sell personal information, and give users full control over their data.', practices: ['End-to-end encryption', 'No data selling', 'User data deletion on request', 'GDPR-compliant practices'] },
  { icon: Brain, title: 'Ethical AI Usage', color: '#f59e0b', desc: 'Our AI is designed exclusively for constructive sustainability guidance. We have safeguards to prevent misuse and regularly audit AI behavior.', practices: ['Content safety filters', 'Regular ethical reviews', 'Community-centered design', 'Anti-misinformation measures'] },
  { icon: Users, title: 'Inclusive Design', color: '#10b981', desc: 'We design for accessibility, supporting low-literacy users through voice interfaces, and ensure Tamil language users get the same quality of service as English speakers.', practices: ['Voice-first interface', 'Tamil language parity', 'Low-bandwidth optimization', 'Rural-context training'] },
  { icon: Shield, title: 'Safety & Reliability', color: '#ef4444', desc: 'AI responses about farming practices, health, or government schemes are reviewed against verified sources. We clearly state when professional consultation is recommended.', practices: ['Expert-reviewed content', 'Source citation', 'Professional referral prompts', 'Regular accuracy reviews'] },
];

const ResponsibleAI = () => (
  <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 24px' }}>
    {/* Header */}
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '64px' }}>
      <div style={{ width: '72px', height: '72px', borderRadius: '18px', background: 'linear-gradient(135deg, rgba(0,208,132,0.2), rgba(14,165,233,0.2))', border: '1px solid rgba(0,208,132,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
        <Shield size={36} color="#00d084" />
      </div>
      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: '#f0fdf4', marginBottom: '16px' }}>
        Responsible AI
      </h1>
      <p style={{ color: '#64748b', fontSize: '17px', lineHeight: '1.8', maxWidth: '700px', margin: '0 auto' }}>
        At EcoBot AI, we are committed to building AI systems that are fair, transparent, safe, and beneficial for rural communities. This page outlines our responsible AI principles and practices.
      </p>
    </motion.div>

    {/* AI Disclaimer Banner */}
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '16px', padding: '24px', marginBottom: '48px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
      <AlertCircle size={24} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
      <div>
        <h3 style={{ color: '#f59e0b', fontWeight: 700, fontSize: '16px', marginBottom: '8px' }}>AI Disclaimer</h3>
        <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.7' }}>
          EcoBot AI provides general sustainability guidance powered by artificial intelligence. Responses should not be taken as professional agricultural, medical, legal, or financial advice. For critical decisions, always consult qualified professionals. Government scheme information is regularly updated but may change — verify eligibility with official sources.
        </p>
      </div>
    </motion.div>

    {/* Principles Grid */}
    <h2 style={{ color: '#f0fdf4', fontWeight: 800, fontSize: '1.8rem', fontFamily: 'Outfit, sans-serif', textAlign: 'center', marginBottom: '40px' }}>
      Our Responsible AI Principles
    </h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '64px' }}>
      {principles.map(({ icon: Icon, title, color, desc, practices }, i) => (
        <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} viewport={{ once: true }} className="eco-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${color}15`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={22} color={color} />
            </div>
            <h3 style={{ color: '#f0fdf4', fontWeight: 700, fontSize: '16px', fontFamily: 'Outfit, sans-serif' }}>{title}</h3>
          </div>
          <p style={{ color: '#64748b', fontSize: '13px', lineHeight: '1.7', marginBottom: '16px' }}>{desc}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {practices.map(p => (
              <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={14} color={color} />
                <span style={{ color: '#94a3b8', fontSize: '13px' }}>{p}</span>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>

    {/* Commitment section */}
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      style={{ background: 'linear-gradient(135deg, rgba(0,208,132,0.05), rgba(14,165,233,0.05))', border: '1px solid rgba(0,208,132,0.15)', borderRadius: '24px', padding: '48px', textAlign: 'center' }}>
      <h2 style={{ color: '#f0fdf4', fontWeight: 800, fontSize: '1.8rem', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>Our Commitment to You</h2>
      <p style={{ color: '#64748b', fontSize: '16px', lineHeight: '1.8', maxWidth: '700px', margin: '0 auto 32px' }}>
        EcoBot AI is built by people who care deeply about rural communities and the environment. We pledge to continuously improve our AI systems, listen to community feedback, and never compromise on ethics for profit.
      </p>
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center', padding: '16px 24px', background: 'rgba(0,208,132,0.06)', border: '1px solid rgba(0,208,132,0.2)', borderRadius: '12px' }}>
          <p style={{ color: '#00d084', fontWeight: 800, fontSize: '24px', fontFamily: 'Outfit' }}>Open</p>
          <p style={{ color: '#64748b', fontSize: '13px' }}>Source Commitment</p>
        </div>
        <div style={{ textAlign: 'center', padding: '16px 24px', background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: '12px' }}>
          <p style={{ color: '#0ea5e9', fontWeight: 800, fontSize: '24px', fontFamily: 'Outfit' }}>Zero</p>
          <p style={{ color: '#64748b', fontSize: '13px' }}>Data Selling</p>
        </div>
        <div style={{ textAlign: 'center', padding: '16px 24px', background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '12px' }}>
          <p style={{ color: '#8b5cf6', fontWeight: 800, fontSize: '24px', fontFamily: 'Outfit' }}>24/7</p>
          <p style={{ color: '#64748b', fontSize: '13px' }}>Safety Monitoring</p>
        </div>
      </div>
    </motion.div>
  </div>
);

export default ResponsibleAI;
