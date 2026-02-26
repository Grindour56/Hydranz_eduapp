import { useState } from "react";
import { computeProfile } from "../engines/profilingEngine";

export default function Quiz() {
  const [selected, setSelected] = useState(null);
  const [history, setHistory] = useState([]);
  const [startTime, setStartTime] = useState(Date.now());

  const correctAnswer = 8;

  function submitAnswer() {
    if (selected === null) return;

    let timeTaken = (Date.now() - startTime) / 1000;
    let isCorrect = selected === correctAnswer ? 1 : 0;

    const newRecord = {
      accuracy: isCorrect,
      timeTaken: timeTaken
    };

    setHistory(prev => [...prev, newRecord]);
    setSelected(null);
    setStartTime(Date.now());

    console.log("Student history:", [...history, newRecord]);
    let profile = computeProfile([...history, newRecord]);
    console.log("Student profile:", profile);
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

      <p>Selected Answer: {selected}</p>
      <p>Total Attempts: {history.length}</p>
    </div>
  );
}