import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, isAuthenticated } from '../auth';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  if (isAuthenticated()) {
    navigate('/dashboard');
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!email) return;
    loginUser(email); // treat signup same as login
    navigate('/dashboard');
  }

  return (
    <div className="auth-container">
      <GlassCard className="auth-card">
        <h2>Sign Up</h2>
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
            Create account
          </GradientButton>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </GlassCard>
    </div>
  );
}