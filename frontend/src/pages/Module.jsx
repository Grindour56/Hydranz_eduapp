import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import GlassCard from "../components/GlassCard";
import GradientButton from "../components/GradientButton";
import CacheManager from "../components/CacheManager"; // Add this import

export default function Module() {
  const location = useLocation();
  const navigate = useNavigate();
  const [moduleData, setModuleData] = useState(null);
  const [showCacheManager, setShowCacheManager] = useState(false);

  useEffect(() => {
    const data = location.state || {};
    console.log("Module page received data:", data);

    setModuleData({
      title: data.title || "Learning Module",
      content: data.content || "No content available for this module.",
      moduleId: data.moduleId || "unknown",
      difficulty: data.difficulty || "beginner",
      estimated_time: data.estimated_time || 10
    });
  }, [location.state]);

  if (!moduleData) {
    return (
      <div className="module-container">
        <GlassCard className="module-card">
          <div className="module-header">
            <h1>Loading...</h1>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <>
      <div className="module-container">
        <GlassCard className="module-card">
          <div className="module-header">
            <h1>{moduleData.title}</h1>
            <div className="module-meta">
              <span className="module-difficulty">{moduleData.difficulty}</span>
              <span className="module-time">⏱️ {moduleData.estimated_time} min</span>
            </div>
            <p className="module-subtitle">Learning Content</p>
          </div>

          <div className="module-content">
            <p>{moduleData.content}</p>
            {moduleData.offline && (
              <p style={{ color: 'orange', marginTop: '1rem' }}>
                ⚠️ You are viewing offline content
              </p>
            )}
          </div>

          <div className="module-actions">
            <GradientButton
              variant="primary"
              onClick={() => navigate("/subjects")}
            >
              Learn Another Topic
            </GradientButton>
            <GradientButton
              variant="secondary"
              onClick={() => navigate("/")}
            >
              Go Home
            </GradientButton>
            <GradientButton
              variant="secondary"
              onClick={() => setShowCacheManager(true)}
            >
              📦 Manage Cache
            </GradientButton>
          </div>
        </GlassCard>
      </div>

      {showCacheManager && (
        <CacheManager onClose={() => setShowCacheManager(false)} />
      )}
    </>
  );
}