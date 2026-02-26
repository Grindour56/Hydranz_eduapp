import React from 'react';

// Glassmorphism card with blur + transparency effects
export default function GlassCard({ children, className = '' }) {
  return (
    <div className={`glass-card ${className}`}>
      {children}
    </div>
  );
}
