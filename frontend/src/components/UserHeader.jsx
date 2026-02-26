import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useState, useRef, useEffect } from 'react';

export default function UserHeader() {
  const navigate = useNavigate();
  const { currentUser, logout } = useUser();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNavigation = (path) => {
    if (!isNavigating) {
      setIsNavigating(true);
      setShowDropdown(false);
      navigate(path);
      // Reset after navigation
      setTimeout(() => setIsNavigating(false), 500);
    }
  };

  const handleLogout = () => {
    if (!isNavigating) {
      setIsNavigating(true);
      logout();
      setShowDropdown(false);
      navigate('/');
      setTimeout(() => setIsNavigating(false), 500);
    }
  };

  if (!currentUser) {
    return (
      <div className="user-header" ref={dropdownRef}>
        <button 
          className="login-btn"
          onClick={() => handleNavigation('/login')}
          disabled={isNavigating}
        >
          Login
        </button>
        <button 
          className="signup-btn"
          onClick={() => handleNavigation('/signup')}
          disabled={isNavigating}
        >
          Sign Up
        </button>
      </div>
    );
  }

  return (
    <div className="user-header" ref={dropdownRef}>
      <div 
        className="user-info" 
        onClick={() => !isNavigating && setShowDropdown(!showDropdown)}
      >
        <span className="user-avatar">{currentUser.avatar || '👤'}</span>
        <span className="user-name">{currentUser.name}</span>
        <span className="dropdown-arrow">▼</span>
      </div>

      {showDropdown && (
        <div className="user-dropdown">
          <div className="dropdown-header">
            <span className="dropdown-avatar">{currentUser.avatar || '👤'}</span>
            <div>
              <strong>{currentUser.name}</strong>
              <small>{currentUser.email}</small>
            </div>
          </div>
          <div className="dropdown-menu">
            <button onClick={() => handleNavigation('/dashboard')}>
              📊 Dashboard
            </button>
            <button onClick={() => handleNavigation('/subjects')}>
              📚 Subjects
            </button>
            <hr />
            <button onClick={handleLogout} className="logout-btn">
              🚪 Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
