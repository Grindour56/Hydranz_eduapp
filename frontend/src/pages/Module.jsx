import { useLocation, useNavigate } from "react-router-dom";

export default function Module() {
  const location = useLocation();
  const navigate = useNavigate();
  const module = location.state;

  return (
    <div className="app-container">
      <div className="quiz-card">
        <h1 className="title">{module?.title}</h1>
        <p className="subtitle">{module?.content}</p>

        <button className="next-btn" onClick={() => navigate("/")}>
          Learn Another Topic
        </button>
      </div>
    </div>
  );
}