import { questionBank } from "../data/questionBank";
import { appState } from "../state";
import { useNavigate, Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Button from "../components/Button";

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
    <Layout>
      <Card>
        <h2>{appState.selectedSubject}</h2>
        <p className="subtitle">Choose a topic</p>

        <div className="grid">
          {topics.map(topic => (
            <Button
              key={topic}
              variant="secondary"
              onClick={() => selectTopic(topic)}
            >
              {topic}
            </Button>
          ))}
        </div>
      </Card>
    </Layout>
  );
}