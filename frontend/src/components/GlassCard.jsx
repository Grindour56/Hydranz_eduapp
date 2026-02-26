import React from 'react';

// Glassmorphism card with blur + transparency effects
// forwards props (onClick, style, etc.) and adds pointer when clickable
export default function GlassCard({ children, className = '', ...props }) {
  const clickable = props.onClick || props.role === 'button';
  return (
    <div
      className={`glass-card ${className} ${clickable ? 'glass-clickable' : ''}`}
      {...props}
    >
      {children}
    </div>
  );
}
