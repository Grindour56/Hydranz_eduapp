import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();
  
  const navItems = [
    { to: '/', label: 'Home', icon: '🏠' },
    { to: '/subjects', label: 'Learn', icon: '📚' },
    { to: '/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/profile', label: 'Profile', icon: '👤' }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-brand">Hydranz</h1>
        <p className="sidebar-tagline">Learn Smart</p>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <Link
            key={item.to}
            to={item.to}
            className={`sidebar-link ${location.pathname === item.to ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p className="sidebar-footer-text">v1.0 Hackathon</p>
      </div>
    </aside>
  );
}
