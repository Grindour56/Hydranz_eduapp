import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <div className="quiz-card">
        <h1 className="title">Hydranz Edu</h1>
        <p className="subtitle">
          Personalized learning. Zero tracking. Built for every student.
        </p>

        <button className="next-btn" onClick={() => navigate("/subjects")}>
          Start Learning
        </button>
      </div>
    </div>
  );
}