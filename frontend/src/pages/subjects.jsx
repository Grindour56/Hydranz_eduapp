import { questionBank } from "../data/questionBank";
import { appState } from "../state";
import { useNavigate } from "react-router-dom";

export default function Subjects() {
  const navigate = useNavigate();
  const subjects = Object.keys(questionBank);

  function selectSubject(subject) {
    appState.selectedSubject = subject;
    navigate("/topics");
  }

  return (
    <div className="app-container">
      <div className="quiz-card">
        <h2>Select Subject</h2>

        {subjects.map(sub => (
          <button key={sub} className="option-btn" onClick={() => selectSubject(sub)}>
            {sub}
          </button>
        ))}
      </div>
    </div>
  );
}