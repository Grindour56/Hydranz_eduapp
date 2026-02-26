import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import GlassCard from "../components/GlassCard";
import GradientButton from "../components/GradientButton";
import { useUser } from '../context/UserContext';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { forgotPassword } = useUser();
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1: request, 2: show password

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!email) {
      setError('Please enter your email');
      setIsLoading(false);
      return;
    }

    // Call forgotPassword from context
    const result = forgotPassword(email);
    
    if (result.success) {
      setSuccess(result.message);
      if (result.password) {
        setResetStep(2); // Move to step 2 to show password
      }
    } else {
      setError(result.error);
    }
    
    setIsLoading(false);
  }

  function handleResetPassword() {
    // In a real app, this would navigate to a password reset page
    // For demo, we'll just go back to login
    navigate('/login');
  }

  return (
    <div className="forgot-container">
      <GlassCard className="forgot-card">
        <div className="forgot-header">
          <h1>Reset Password 🔐</h1>
          <p>
            {resetStep === 1 
              ? 'Enter your email to receive reset instructions' 
              : 'Password reset successful'}
          </p>
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {success && resetStep === 1 && (
          <div className="success-message">
            ✅ {success}
          </div>
        )}

        {resetStep === 2 && result?.password && (
          <div className="password-display">
            <p>Your temporary password is:</p>
            <div className="password-box">
              <code>{result.password}</code>
              <button 
                className="copy-btn"
                onClick={() => {
                  navigator.clipboard.writeText(result.password);
                  alert('Password copied to clipboard!');
                }}
              >
                📋 Copy
              </button>
            </div>
            <p className="password-note">
              Please change your password after logging in.
            </p>
          </div>
        )}

        {resetStep === 1 ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>

            <GradientButton 
              type="submit" 
              variant="primary"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </GradientButton>
          </form>
        ) : (
          <div className="action-buttons">
            <GradientButton 
              variant="primary"
              onClick={handleResetPassword}
            >
              Go to Login
            </GradientButton>
          </div>
        )}

        <div className="forgot-footer">
          <p>
            <Link to="/login" className="back-link">
              ← Back to Login
            </Link>
          </p>
        </div>
      </GlassCard>

      <style jsx>{`
        .forgot-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 80vh;
          padding: 2rem;
        }

        .forgot-card {
          max-width: 400px;
          width: 100%;
          padding: 2rem;
        }

        .forgot-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .forgot-header h1 {
          margin: 0 0 0.5rem;
          font-size: 2rem;
        }

        .forgot-header p {
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

        .success-message {
          background: rgba(76, 175, 80, 0.1);
          color: #4caf50;
          padding: 0.75rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          text-align: center;
          border: 1px solid rgba(76, 175, 80, 0.3);
        }

        .password-display {
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .password-display p {
          margin-bottom: 0.5rem;
          color: rgba(255, 255, 255, 0.8);
        }

        .password-box {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: rgba(0, 0, 0, 0.3);
          padding: 1rem;
          border-radius: 8px;
          margin: 1rem 0;
        }

        .password-box code {
          font-size: 1.1rem;
          color: #ffd700;
          background: rgba(0, 0, 0, 0.5);
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-family: monospace;
        }

        .copy-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .copy-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .password-note {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.85rem;
          margin-top: 0.5rem;
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

        .action-buttons {
          margin: 1.5rem 0;
        }

        .forgot-footer {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          text-align: center;
        }

        .back-link {
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          font-size: 0.9rem;
        }

        .back-link:hover {
          color: white;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}