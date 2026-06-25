import React from 'react';
import { motion } from 'framer-motion';

export const SkeletonCard = ({ lines = 3 }) => (
  <div className="eco-card" style={{ gap: '12px', display: 'flex', flexDirection: 'column' }}>
    <div className="skeleton" style={{ height: '20px', width: '60%' }} />
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className="skeleton" style={{ height: '14px', width: `${80 - i * 15}%` }} />
    ))}
  </div>
);

export const SkeletonText = ({ width = '100%', height = '14px' }) => (
  <div className="skeleton" style={{ height, width, borderRadius: '6px' }} />
);

export const SkeletonAvatar = ({ size = 40 }) => (
  <div className="skeleton" style={{ width: size, height: size, borderRadius: '50%' }} />
);

const Skeleton = ({ type = 'card', ...props }) => {
  if (type === 'text') return <SkeletonText {...props} />;
  if (type === 'avatar') return <SkeletonAvatar {...props} />;
  return <SkeletonCard {...props} />;
};

export default Skeleton;
