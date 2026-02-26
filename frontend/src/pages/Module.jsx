import { useLocation, useNavigate } from "react-router-dom";
import GlassCard from "../components/GlassCard";
import GradientButton from "../components/GradientButton";

export default function Module() {
  const location = useLocation();
  const navigate = useNavigate();
  const module = location.state;

  return (
    <div className="module-container">
      <GlassCard className="module-card">
        <div className="module-header">
          <h1>{module?.title || "Module"}</h1>
          <p className="module-subtitle">Learning Content</p>
        </div>

        <div className="module-content">
          <p>{module?.content || "(no content available)"}</p>
        </div>

        <div className="module-actions">
          <GradientButton variant="primary" onClick={() => navigate("/subjects")}>
            Learn Another Topic
          </GradientButton>
          <GradientButton variant="secondary" onClick={() => navigate("/")}>
            Go Home
          </GradientButton>
        </div>
      </GlassCard>
    </div>
  );
}