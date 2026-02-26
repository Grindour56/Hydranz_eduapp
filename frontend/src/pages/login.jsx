import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, isAuthenticated } from '../auth';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  if (isAuthenticated()) {
    navigate('/dashboard');
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!email) return;
    loginUser(email);
    navigate('/dashboard');
  }

  return (
    <div className="auth-container">
      <GlassCard className="auth-card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="auth-input"
          />
          <GradientButton variant="primary" type="submit" style={{ width: '100%' }}>
            Continue Learning
          </GradientButton>
        </form>
        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </GlassCard>
    </div>
  );
}