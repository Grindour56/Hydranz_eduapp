import { useState } from "react";
import { questionBank } from "../data/questionBank";
import { appState, addAttempt, studentState } from "../state";
import { generateModule } from "../core/pipeline";
import { fetchModule } from "../api/api";
import { useNavigate, Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Button from "../components/Button";
import ProgressBar from "../components/ProgressBar";

export default function Quiz() {
  const navigate = useNavigate();

  // guard: ensure we have subject/topic selected
  if (!appState.selectedSubject) {
    return <Navigate to="/subjects" replace />;
  }
  if (!appState.selectedTopic) {
    return <Navigate to="/topics" replace />;
  }

  // 🔥 Load questions dynamically
  const questions =
    questionBank?.[appState.selectedSubject]?.[appState.selectedTopic] || [];

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [startTime, setStartTime] = useState(Date.now());

  async function submitAnswer() {
    if (selected === null) return;

    const question = questions[currentQ];
    const timeTaken = (Date.now() - startTime) / 1000;
    const isCorrect = selected === question.answer;

    // store attempt locally (privacy)
    addAttempt(appState.selectedTopic, isCorrect ? 1 : 0, timeTaken);

    setSelected(null);
    setStartTime(Date.now());

    // move to next question
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      return;
    }

    // 🔥 QUIZ FINISHED → RUN PIPELINE
    const moduleId = generateModule(studentState.history);
    console.log("Generated Module:", moduleId);

    try {
      const moduleContent = await fetchModule(moduleId);
      navigate("/module", { state: moduleContent });
    } catch {
      navigate("/module", {
        state: { title: "Sample Module", content: "Backend not connected yet" }
      });
    }
  }

  // safety if topic not selected or no questions
  if (questions.length === 0) {
    return (
      <Layout>
        <Card>
          <h2>
            {appState.selectedSubject && appState.selectedTopic
              ? "No questions found for this topic"
              : "Please select a subject and topic first"}
          </h2>
          <Button variant="primary" onClick={() => navigate("/subjects")}>Choose subject</Button>
        </Card>
      </Layout>
    );
  }

  const question = questions[currentQ];

return (
  <Layout>
    <Card className="quiz-card">
      <h2>{appState.selectedSubject}</h2>
      <p className="subtitle">{appState.selectedTopic}</p>

      <ProgressBar progress={((currentQ + 1) / questions.length) * 100} />
      <h3 className="mt-2">Question {currentQ + 1} / {questions.length}</h3>
      <h3 className="mt-1">{question.q}</h3>

      <div className="grid mt-2">
        {question.options.map(opt => (
          <Button
            key={opt}
            variant={selected === opt ? 'primary' : 'secondary'}
            onClick={() => setSelected(opt)}
          >
            {opt}
          </Button>
        ))}
      </div>

      <Button
        variant="primary"
        className="mt-3"
        onClick={submitAnswer}
        disabled={selected === null}
      >
        {currentQ === questions.length - 1 ? "Finish Quiz" : "Next"}
      </Button>
    </Card>
  </Layout>
);
}