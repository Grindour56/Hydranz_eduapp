import React from 'react';

// Gradient button with hover effects
export default function GradientButton({ children, onClick, disabled = false, variant = 'primary', ...props }) {
  return (
    <button
      className={`gradient-btn gradient-btn--${variant}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
