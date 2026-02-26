import { useState } from "react";
import { questionBank } from "../data/questionBank";
import { appState, addAttempt, studentState } from "../state";
import { generateModule } from "../core/pipeline";
import { fetchModule } from "../api/api";
import { useNavigate, Navigate } from "react-router-dom";
import GlassCard from "../components/GlassCard";
import GradientButton from "../components/GradientButton";
import ProgressBar from "../components/ProgressBar";

export default function Quiz() {
  const navigate = useNavigate();

  // guard: ensure we have subject/topic selected
  if (!appState.selectedSubject || !appState.selectedTopic) {
    return <Navigate to="/subjects" replace />;
  }

  const questions =
    questionBank?.[appState.selectedSubject]?.[appState.selectedTopic] || [];

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());

  async function submitAnswer() {
    if (selected === null) return;

    const question = questions[currentQ];
    const timeTaken = (Date.now() - startTime) / 1000;
    const isCorrect = selected === question.answer;

    // Hint-adjusted scoring
    const adjustedAccuracy = isCorrect
      ? Math.max(0, 1 - hintsUsed * 0.2)
      : 0;

    addAttempt(appState.selectedTopic, adjustedAccuracy, timeTaken);

    setHintsUsed(0);
    setSelected(null);
    setStartTime(Date.now());

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      return;
    }

    const moduleId = generateModule(studentState.history);

    try {
      const moduleContent = await fetchModule(moduleId);
      navigate("/module", { state: moduleContent });
    } catch {
      navigate("/module", {
        state: {
          title: "Sample Module",
          content: "Backend not connected yet"
        }
      });
    }
  }

  if (!questions.length) {
    return (
      <GlassCard>
        <h2>No questions available.</h2>
      </GlassCard>
    );
  }

  const question = questions[currentQ];
  const progressPercent = ((currentQ + 1) / questions.length) * 100;

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2>{appState.selectedSubject}</h2>
        <p>{appState.selectedTopic}</p>
      </div>

      <GlassCard className="quiz-panel">
        <div className="quiz-progress">
          <div className="progress-meta">
            <span>Question {currentQ + 1} of {questions.length}</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <ProgressBar progress={progressPercent} />
        </div>

        <div className="quiz-question">
          <h3>{question.q}</h3>
        </div>

        <div className="quiz-options">
          {question.options.map((opt) => (
            <button
              key={opt}
              className={`quiz-option ${selected === opt ? 'selected' : ''}`}
              onClick={() => setSelected(opt)}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="quiz-actions">
          <button
            className="hint-chip"
            onClick={() => setHintsUsed(hintsUsed + 1)}
          >
            💡 Hint ({hintsUsed})
          </button>

          <GradientButton
            variant="primary"
            onClick={submitAnswer}
            disabled={selected === null}
          >
            {currentQ === questions.length - 1
              ? "Finish Quiz"
              : "Next Question"}
          </GradientButton>
        </div>
      </GlassCard>
    </div>
  );
}