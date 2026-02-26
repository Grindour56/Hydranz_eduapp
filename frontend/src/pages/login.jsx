
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import GlassCard from "../components/GlassCard";
import GradientButton from "../components/GradientButton";
import { useUser } from '../context/UserContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, currentUser } = useUser();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [savedAccounts, setSavedAccounts] = useState([]);

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      console.log('User already logged in, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [currentUser, navigate]);

  // Load saved accounts for quick login
  useEffect(() => {
    try {
      const accounts = JSON.parse(localStorage.getItem('eduapp_accounts') || '[]');
      // Only show accounts that have passwords (for quick login)
      const validAccounts = accounts.filter(acc => acc.password);
      setSavedAccounts(validAccounts.slice(0, 3));
    } catch (error) {
      console.error('Error loading accounts:', error);
    }
  }, []);

  function handleInputChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate inputs
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    console.log('Attempting login with:', formData.email);

    // Attempt login
    const result = login(formData.email, formData.password);
    
    console.log('Login result:', result);
    
    if (result.success) {
      console.log('Login successful, redirecting to dashboard');
      // Use replace to prevent going back to login page
      navigate('/dashboard', { replace: true });
    } else {
      setError(result.error || 'Login failed');
      setIsLoading(false);
    }
  }

  function handleQuickLogin(account) {
    setFormData({
      email: account.email,
      password: account.password
    });
    
    // Auto submit after a brief delay
    setTimeout(() => {
      const result = login(account.email, account.password);
      if (result.success) {
        navigate('/dashboard', { replace: true });
      } else {
        setError(result.error);
        setIsLoading(false);
      }
    }, 100);
  }

  // Don't render if already logged in (prevents flash of login page)
  if (currentUser) {
    return null;
  }

  return (
    <div className="login-container">
      <GlassCard className="login-card">
        <div className="login-header">
          <h1>Welcome Back! 👋</h1>
          <p>Login to continue your learning journey</p>
        </div>

        {/* Quick Login Buttons */}
        {savedAccounts.length > 0 && (
          <div className="quick-login">
            <p>Quick login:</p>
            <div className="quick-login-buttons">
              {savedAccounts.map(account => (
                <button
                  key={account.email}
                  className="quick-login-btn"
                  onClick={() => handleQuickLogin(account)}
                  title={account.email}
                >
                  <span className="quick-avatar">{account.avatar || '👤'}</span>
                  <span className="quick-name">{account.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
                disabled={isLoading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <div className="form-options">
            <Link to="/forgot-password" className="forgot-link">
              Forgot Password?
            </Link>
          </div>

          <GradientButton 
            type="submit" 
            variant="primary"
            disabled={isLoading}
            className="login-button"
          >
            {isLoading ? "Logging in..." : "Login"}
          </GradientButton>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/signup" className="toggle-link">
              Sign Up
            </Link>
          </p>
        </div>

        {/* Demo credentials */}
        <div className="demo-credentials">
          <p>Demo Accounts:</p>
          <div className="demo-list">
            <small>📧 demo@example.com / demo123</small>
            <small>📧 student@example.com / pass123</small>
          </div>
        </div>
      </GlassCard>

      <style jsx>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 80vh;
          padding: 2rem;
        }

        .login-card {
          max-width: 400px;
          width: 100%;
          padding: 2rem;
        }

        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .login-header h1 {
          margin: 0 0 0.5rem;
          font-size: 2rem;
        }

        .login-header p {
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
        }

        .quick-login {
          margin-bottom: 1.5rem;
        }

        .quick-login p {
          margin: 0 0 0.5rem;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
        }

        .quick-login-buttons {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .quick-login-btn {
          flex: 1;
          min-width: 80px;
          padding: 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: white;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }

        .quick-login-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        .quick-avatar {
          font-size: 1.5rem;
        }

        .quick-name {
          font-size: 0.8rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 80px;
        }

        .error-message {
          background: rgba(255, 68, 68, 0.1);
          color: #ff6b6b;
          padding: 0.75rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          text-align: center;
          border: 1px solid rgba(255, 68, 68, 0.3);
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
        }

        .form-group input {
          width: 100%;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: white;
          font-size: 1rem;
          transition: all 0.3s;
        }

        .form-group input:focus {
          outline: none;
          border-color: #667eea;
          background: rgba(255, 255, 255, 0.15);
        }

        .form-group input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .password-input {
          position: relative;
        }

        .toggle-password {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          font-size: 1.2rem;
          padding: 0.25rem;
        }

        .toggle-password:hover {
          color: white;
        }

        .form-options {
          margin-bottom: 1.5rem;
          text-align: right;
        }

        .forgot-link {
          color: #667eea;
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.3s;
        }

        .forgot-link:hover {
          color: #764ba2;
          text-decoration: underline;
        }

        .login-button {
          width: 100%;
        }

        .login-footer {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          text-align: center;
        }

        .login-footer p {
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
        }

        .toggle-link {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s;
        }

        .toggle-link:hover {
          color: #764ba2;
          text-decoration: underline;
        }

        .demo-credentials {
          margin-top: 1.5rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
        }

        .demo-credentials p {
          margin: 0 0 0.5rem;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
        }

        .demo-list {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .demo-list small {
          color: rgba(255, 255, 255, 0.5);
          font-family: monospace;
        }
      `}</style>
    </div>
  );
}