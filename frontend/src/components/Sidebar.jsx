import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { isAuthenticated, logoutUser } from '../auth';
import SystemStatus from './SystemStatus';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const auth = isAuthenticated();
  const navItems = [
    { to: '/', label: 'Home', icon: '🏠' },
  ];
  if (auth) {
    navItems.push({ to: '/dashboard', label: 'Dashboard', icon: '📊' });
    navItems.push({ to: '/subjects', label: 'Learn', icon: '📚' });
  } else {
    navItems.push({ to: '/login', label: 'Login', icon: '🔐' });
  }

  // simple demo state for system status
  const [statusMsg] = useState('Online');
  const [bandwidth] = useState(0);

  return (
    <aside className="sidebar">
      <SystemStatus statusMessage={statusMsg} bandwidthSaved={bandwidth} />
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
        {auth && (
          <button
            className="sidebar-link"
            onClick={() => {
              logoutUser();
              navigate('/');
            }}
            style={{ background: 'none', border: 'none', padding: 0, color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}
          >
            <span className="sidebar-icon">🚪</span> Logout
          </button>
        )}
        <p className="sidebar-footer-text">v1.0 Hackathon</p>
      </div>
    </aside>
  );
}
