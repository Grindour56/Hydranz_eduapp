import { useNavigate } from "react-router-dom";
import GlassCard from "../components/GlassCard";
import GradientButton from "../components/GradientButton";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-hero">
      <GlassCard className="hero-card">
        <h1 className="hero-title">Hydranz Edu</h1>
        <p className="hero-subtitle">
          Personalized learning. Zero tracking. Built for every student.
        </p>
        <GradientButton 
          variant="primary" 
          onClick={() => navigate("/subjects")}
          style={{ width: '100%', padding: '14px' }}
        >
          Start Learning
        </GradientButton>
      </GlassCard>

      <div className="home-features">
        <GlassCard className="feature-card">
          <div className="feature-icon">📚</div>
          <h3>Smart Learning</h3>
          <p>Adaptive quizzes that adjust to your level</p>
        </GlassCard>
        <GlassCard className="feature-card">
          <div className="feature-icon">🔒</div>
          <h3>Privacy First</h3>
          <p>Your data stays with you, no tracking</p>
        </GlassCard>
        <GlassCard className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Track Progress</h3>
          <p>See your improvement over time</p>
        </GlassCard>
      </div>
    </div>
  );
}