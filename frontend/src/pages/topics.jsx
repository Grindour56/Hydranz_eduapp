import { useNavigate } from "react-router-dom";

export default function Topics() {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <div className="quiz-card">
        <h2>Select Topic</h2>

        <button className="option-btn" onClick={() => navigate("/quiz")}>
          Arithmetic
        </button>

        <button className="option-btn" onClick={() => navigate("/quiz")}>
          Logic
        </button>
      </div>
    </div>
  );
}