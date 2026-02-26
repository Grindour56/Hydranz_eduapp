import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const links = [
    { to: '/', label: 'Home' },
    { to: '/subjects', label: 'Subjects' },
    { to: '/topics', label: 'Topics' },
    { to: '/quiz', label: 'Quiz' },
    { to: '/module', label: 'Module' },
    { to: '/dashboard', label: 'Dashboard' }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">Hydranz EduApp</div>
      <div className="navbar-links">
        {links.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={location.pathname === link.to ? 'active' : ''}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}