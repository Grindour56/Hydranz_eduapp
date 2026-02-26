import { questionBank } from "../data/questionBank";
import { appState } from "../state";
import { useNavigate, Navigate } from "react-router-dom";
import GlassCard from "../components/GlassCard";

export default function Topics() {
  const navigate = useNavigate();

  // guard: if no subject selected, redirect back
  if (!appState.selectedSubject) {
    return <Navigate to="/subjects" replace />;
  }

  const topics = Object.keys(questionBank[appState.selectedSubject] || {});

  function selectTopic(topic) {
    appState.selectedTopic = topic;
    navigate("/quiz");
  }

  return (
    <div className="topics-container">
      <div className="page-header">
        <h1>{appState.selectedSubject}</h1>
        <p>Choose a topic to start the quiz</p>
      </div>

      <div className="topics-grid">
        {topics.map(topic => (
          <GlassCard
            key={topic}
            className="topic-card"
            onClick={() => selectTopic(topic)}
          >
            <div className="topic-icon">✍️</div>
            <h3>{topic}</h3>
            <p className="topic-description">
              Master {topic.toLowerCase()} concepts
            </p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}