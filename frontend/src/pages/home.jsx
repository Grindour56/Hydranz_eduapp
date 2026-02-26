import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <div className="quiz-card">
        <h1 className="title">Hydranz EduApp</h1>
        <p>Personalized learning. Zero data tracking.</p>

        <button className="next-btn" onClick={() => navigate("/subjects")}>
          Start Learning
        </button>
      </div>
    </div>
  );
}