import React from 'react';

// Generic card container with padding and shadow
export default function Card({ children, className = '' }) {
  return <div className={`card ${className}`}>{children}</div>;
}