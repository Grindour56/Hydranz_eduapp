import { questionBank } from "../data/questionBank";
import { appState } from "../state";
import { useNavigate } from "react-router-dom";

export default function Topics() {
  const navigate = useNavigate();

  const topics = Object.keys(
    questionBank[appState.selectedSubject] || {}
  );

  function selectTopic(topic) {
    appState.selectedTopic = topic;
    navigate("/quiz");
  }

  return (
    <div className="app-container">
      <div className="quiz-card">
        <h2>Select Topic</h2>

        {topics.map(topic => (
          <button key={topic} className="option-btn" onClick={() => selectTopic(topic)}>
            {topic}
          </button>
        ))}
      </div>
    </div>
  );
}