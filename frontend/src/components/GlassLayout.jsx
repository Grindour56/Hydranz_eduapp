import React from 'react';

// Main layout with sidebar + gradient background
export default function GlassLayout({ children }) {
  return (
    <div className="glass-layout">
      {/* Background gradient */}
      <div className="glass-bg" />
      
      {/* Content wrapper */}
      <div className="glass-content">
        {children}
      </div>
    </div>
  );
}
