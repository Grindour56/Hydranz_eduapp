import { questionBank } from "../data/questionBank";
import { appState } from "../state";
import { useNavigate } from "react-router-dom";
import GlassCard from "../components/GlassCard";

export default function Subjects() {
  const navigate = useNavigate();
  const subjects = Object.keys(questionBank);

  function selectSubject(sub) {
    appState.selectedSubject = sub;
    navigate("/topics");
  }

  return (
    <div className="subjects-container">
      <div className="page-header">
        <h1>Select Subject</h1>
        <p>Choose a subject to start learning</p>
      </div>

      <div className="subjects-grid">
        {subjects.map(sub => (
          <GlassCard
            key={sub}
            className="subject-card"
            onClick={() => selectSubject(sub)}
          >
            <div className="subject-icon">📖</div>
            <h3>{sub}</h3>
            <p className="subject-description">
              Build your skills in {sub.toLowerCase()}
            </p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}