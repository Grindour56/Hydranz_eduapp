import { useLocation, useNavigate } from "react-router-dom";

export default function Module() {
  const location = useLocation();
  const navigate = useNavigate();
  const module = location.state;

  if (!module) {
    return <h2>No module data</h2>;
  }

  return (
    <div className="app-container">
      <div className="quiz-card">
        <h1>{module.title}</h1>
        <p>{module.content}</p>

        <button className="next-btn" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    </div>
  );
}