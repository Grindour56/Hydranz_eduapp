import { useState } from "react";
import { questionBank } from "../data/questionBank";
import { appState, addAttempt, studentState } from "../state";
import { generateModule } from "../core/pipeline";
import { fetchModule } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Quiz() {
  const navigate = useNavigate();

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
    return <h2 style={{ padding: 40 }}>No questions available.</h2>;
  }

  const question = questions[currentQ];

  return (
    <div className="page-container">
      <div className="card">
        <h2>
          {appState.selectedSubject} → {appState.selectedTopic}
        </h2>

        <h3>
          Question {currentQ + 1} / {questions.length}
        </h3>

        <h3>{question.q}</h3>

        {question.options.map((opt) => (
          <button
            key={opt}
            className="option-btn"
            onClick={() => setSelected(opt)}
          >
            {opt}
          </button>
        ))}

        <button
          className="option-btn"
          onClick={() => setHintsUsed(hintsUsed + 1)}
        >
          Show Hint 💡 (Used: {hintsUsed})
        </button>

        <button className="primary-btn" onClick={submitAnswer}>
          {currentQ === questions.length - 1
            ? "Finish Quiz"
            : "Next Question"}
        </button>
      </div>
    </div>
  );
}