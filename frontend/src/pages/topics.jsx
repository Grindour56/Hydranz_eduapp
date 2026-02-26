import { questionBank } from "../data/questionBank";
import { appState } from "../state";
import { useNavigate } from "react-router-dom";

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
    <div className="app-container">
      <div className="quiz-card">
        <h2>{appState.selectedSubject}</h2>
        <p className="subtitle">Choose a topic</p>

        <div className="grid">
          {topics.map(topic => (
            <button
              key={topic}
              className="option-btn"
              onClick={() => selectTopic(topic)}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}