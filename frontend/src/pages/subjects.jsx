import { useNavigate } from "react-router-dom";

export default function Subjects() {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <div className="quiz-card">
        <h2>Select Subject</h2>

        <button className="option-btn" onClick={() => navigate("/topics")}>
          Mathematics
        </button>

        <button className="option-btn" onClick={() => navigate("/topics")}>
          Programming
        </button>
      </div>
    </div>
  );
}