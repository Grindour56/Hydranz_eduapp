
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import GlassCard from "../components/GlassCard";
import GradientButton from "../components/GradientButton";
import { useUser } from '../context/UserContext';

export default function Signup() {
  const navigate = useNavigate();
  const { signup, currentUser } = useUser();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

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
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    // Attempt signup
    const result = signup(formData.name, formData.email, formData.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    
    setIsLoading(false);
  }

  return (
    <div className="signup-container">
      <GlassCard className="signup-card">
        <div className="signup-header">
          <h1>Create Account ✨</h1>
          <p>Start your learning journey today</p>
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              required
              disabled={isLoading}
            />
          </div>

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
                placeholder="Create a password"
                required
                disabled={isLoading}
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

          <div className="form-group">
            <label>Confirm Password</label>
            <div className="password-input">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <div className="password-hint">
            Password must be at least 6 characters
          </div>

          <GradientButton 
            type="submit" 
            variant="primary"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </GradientButton>
        </form>

        <div className="signup-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="toggle-link">
              Login
            </Link>
          </p>
        </div>
      </GlassCard>

      <style jsx>{`
        .signup-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 80vh;
          padding: 2rem;
        }

        .signup-card {
          max-width: 400px;
          width: 100%;
          padding: 2rem;
        }

        .signup-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .signup-header h1 {
          margin: 0 0 0.5rem;
          font-size: 2rem;
        }

        .signup-header p {
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
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
        }

        .form-group input:focus {
          outline: none;
          border-color: #667eea;
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
        }

        .password-hint {
          margin-bottom: 1.5rem;
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.8rem;
          text-align: center;
        }

        .signup-footer {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          text-align: center;
        }

        .signup-footer p {
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
        }

        .toggle-link {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
        }

        .toggle-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}