import { useState } from "react";
import { questionBank } from "../data/questionBank";
import { appState, addAttempt, studentState } from "../state";
import { generateModule } from "../core/pipeline";
import { fetchModule } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Quiz() {
  const navigate = useNavigate();

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

<<<<<<< Updated upstream
    // store attempt locally (privacy)
    addAttempt(appState.selectedTopic, isCorrect ? 1 : 0, timeTaken);
=======
    // store attempt in global state
    addAttempt("math", isCorrect ? 1 : 0, timeTaken);

    console.log("History:", studentState.history);

    // generate module id using AI pipeline
    const moduleId = generateModule(studentState.history);
    const moduleMap = {
      1: "remedial",
      2: "intermediate",
      3: "advanced",
      4: "practice"
    };

    const moduleKey = moduleMap[moduleId];
    console.log("Generated Module ID:", moduleId);

    if (!moduleId) return;

    try {
      const moduleContent = await fetchModule(moduleKey);

      setModuleResult(moduleContent);
    } catch (err) {
      console.log("Backend not ready yet, using mock module.");
      setModuleResult({ title: "Sample Module", content: "Backend not connected yet." });
    }
>>>>>>> Stashed changes

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

  // safety if topic not selected
  if (questions.length === 0) {
    return (
      <div className="app-container">
        <div className="quiz-card">
          <h2>No questions found for this topic</h2>
        </div>
      </div>
    );
  }

  const question = questions[currentQ];

return (
  <div className="app-container">
    <div className="quiz-card">

      <h2>{appState.selectedSubject}</h2>
      <p className="subtitle">{appState.selectedTopic}</p>
      <h3>Question {currentQ + 1} / {questions.length}</h3>
      <h3>{question.q}</h3>

      {question.options.map(opt => (
        <button
          key={opt}
          className="option-btn"
          onClick={() => setSelected(opt)}
        >
          {opt}
        </button>
      ))}

      <button className="next-btn" onClick={submitAnswer}>
        {currentQ === questions.length - 1 ? "Finish Quiz" : "Next"}
      </button>

    </div>
  </div>
);
}