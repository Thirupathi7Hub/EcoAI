import React from 'react';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';

const LoadingScreen = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--eco-darker, #060b15)',
    flexDirection: 'column',
    gap: '24px',
  }}>
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      style={{
        width: '64px', height: '64px',
        background: 'linear-gradient(135deg, #00d084, #10b981)',
        borderRadius: '16px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 30px rgba(0, 208, 132, 0.5)',
      }}
    >
      <Leaf size={32} color="#0a0f1e" strokeWidth={2.5} />
    </motion.div>
    <div style={{ textAlign: 'center' }}>
      <p style={{ color: '#00d084', fontWeight: 700, fontSize: '20px', fontFamily: 'Outfit, sans-serif' }}>EcoBot AI</p>
      <p style={{ color: '#475569', fontSize: '14px', marginTop: '4px' }}>Loading sustainability assistant...</p>
    </div>
    <div style={{ display: 'flex', gap: '6px' }}>
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00d084' }}
        />
      ))}
    </div>
  </div>
);

export default LoadingScreen;
