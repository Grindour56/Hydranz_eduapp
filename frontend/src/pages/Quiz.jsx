
import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { questionBank } from "../data/questionBank";
import { appState, addAttempt, studentState } from "../state";
import { generateModule } from "../core/pipeline";
import { fetchModule } from "../api/api";
import GlassCard from "../components/GlassCard";
import GradientButton from "../components/GradientButton";
import ProgressBar from "../components/ProgressBar";

export default function Quiz() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showHint, setShowHint] = useState(false); // Add this to control hint visibility

  // guard: ensure we have subject/topic selected
  if (!appState.selectedSubject || !appState.selectedTopic) {
    return <Navigate to="/subjects" replace />;
  }

  const questions = questionBank?.[appState.selectedSubject]?.[appState.selectedTopic] || [];

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [totalHintsUsed, setTotalHintsUsed] = useState(0);
  const [hintsAvailable, setHintsAvailable] = useState(3);
  const [startTime, setStartTime] = useState(Date.now());

  function handleUseHint() {
    if (hintsUsed < hintsAvailable) {
      setHintsUsed(prev => {
        const newHintsUsed = prev + 1;
        setTotalHintsUsed(total => total + 1);
        setShowHint(true); // Show the hint text
        return newHintsUsed;
      });
    }
  }

  // Rest of your submitAnswer function remains the same...

  if (!questions.length) {
    return (
      <div className="quiz-container">
        <GlassCard>
          <h2>No questions available for {appState.selectedTopic}</h2>
          <GradientButton onClick={() => navigate("/subjects")}>
            Choose Another Topic
          </GradientButton>
        </GlassCard>
      </div>
    );
  }

  const question = questions[currentQ];
  const progressPercent = ((currentQ + 1) / questions.length) * 100;
  const remainingHints = hintsAvailable - hintsUsed;

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2>{appState.selectedSubject}</h2>
        <p>{appState.selectedTopic}</p>
      </div>

      <GlassCard className="quiz-panel">
        {error && (
          <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>
            Error: {error}
          </div>
        )}

        <div className="quiz-progress">
          <div className="progress-meta">
            <span>Question {currentQ + 1} of {questions.length}</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <ProgressBar progress={progressPercent} />
        </div>

        <div className="hint-tracker" style={{ marginBottom: '1rem', textAlign: 'right' }}>
          <span style={{
            padding: '0.25rem 0.75rem',
            background: remainingHints < 2 ? '#ff4444' : '#4a90e2',
            color: 'white',
            borderRadius: '20px',
            fontSize: '0.9rem'
          }}>
            💡 Hints remaining: {remainingHints}
          </span>
          {totalHintsUsed > 0 && (
            <span style={{ marginLeft: '1rem', color: '#666' }}>
              Total hints used: {totalHintsUsed}
            </span>
          )}
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
              disabled={isLoading}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Show hint text when hint is used */}
        {showHint && question.hint && (
          <div className="hint-box" style={{
            marginTop: '1rem',
            padding: '1rem',
            background: 'rgba(255, 193, 7, 0.15)',
            borderLeft: '4px solid #ffc107',
            borderRadius: '4px',
            animation: 'slideIn 0.3s ease'
          }}>
            <strong style={{ color: '#ffc107' }}>💡 Hint:</strong>
            <p style={{ margin: '0.5rem 0 0', color: '#fff' }}>{question.hint}</p>
          </div>
        )}

        <div className="quiz-actions">
          <button
            className="hint-chip"
            onClick={handleUseHint}
            disabled={isLoading || hintsUsed >= hintsAvailable}
            style={{
              opacity: hintsUsed >= hintsAvailable ? 0.5 : 1,
              cursor: hintsUsed >= hintsAvailable ? 'not-allowed' : 'pointer'
            }}
          >
            💡 Get Hint ({hintsUsed}/{hintsAvailable})
          </button>

          <GradientButton
            variant="primary"
            onClick={submitAnswer}
            disabled={selected === null || isLoading}
          >
            {isLoading ? "Loading..." : (currentQ === questions.length - 1 ? "Finish Quiz" : "Next Question")}
          </GradientButton>
        </div>

        {/* Show hint penalty warning */}
        {hintsUsed > 0 && (
          <div className="hint-warning" style={{
            marginTop: '1rem',
            padding: '0.75rem',
            background: 'rgba(255, 165, 0, 0.1)',
            borderRadius: '4px',
            fontSize: '0.9rem',
            color: '#ff9800',
            border: '1px solid rgba(255, 165, 0, 0.3)'
          }}>
            ⚠️ Using hints reduces accuracy by 15% per hint. Current penalty: {hintsUsed * 15}%
          </div>
        )}
      </GlassCard>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}