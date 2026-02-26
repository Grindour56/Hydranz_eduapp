import { useState } from "react";
import { generateModule } from "../core/pipeline";
import { fetchModule } from "../api/api";
import { addAttempt, studentState } from "../state";

export default function Quiz() {
  const [selected, setSelected] = useState(null);
  const [startTime, setStartTime] = useState(Date.now());
  const [moduleResult, setModuleResult] = useState(null);

  const correctAnswer = 8;

  async function submitAnswer() {
    if (selected === null) return;

    let timeTaken = (Date.now() - startTime) / 1000;
    let isCorrect = selected === correctAnswer;

    // store attempt in global state
    addAttempt("math", isCorrect ? 1 : 0, timeTaken);

    console.log("History:", studentState.history);

    // generate module id using AI pipeline
    const moduleId = generateModule(studentState.history);
    console.log("Generated Module ID:", moduleId);

    if (!moduleId) return;

    try {
      const moduleContent = await fetchModule(moduleId);
      setModuleResult(moduleContent);
    } catch (err) {
      console.log("Backend not ready yet, using mock module.");
      setModuleResult({ title: "Sample Module", content: "Backend not connected yet." });
    }

    setSelected(null);
    setStartTime(Date.now());
  }

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Adaptive Learning Quiz</h1>
      <h3>What is 5 + 3 ?</h3>

      <button onClick={() => setSelected(6)}>6</button>
      <button onClick={() => setSelected(7)}>7</button>
      <button onClick={() => setSelected(8)}>8</button>
      <button onClick={() => setSelected(9)}>9</button>

      <br /><br />
      <button onClick={submitAnswer}>Submit</button>

      <p>Selected: {selected}</p>
      <p>Total Attempts: {studentState.history.length}</p>

      {moduleResult && (
        <div style={{ marginTop: "30px", padding: "20px", border: "1px solid black" }}>
          <h2>{moduleResult.title}</h2>
          <p>{moduleResult.content}</p>
        </div>
      )}
    </div>
  );
}