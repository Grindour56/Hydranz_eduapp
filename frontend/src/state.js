// Stores quiz attempts (used by AI pipeline)
export const studentState = {
  history: [],
  topicScores: {}
};

// Adds an attempt after each question
export function addAttempt(topic, accuracy, timeTaken) {
  studentState.history.push({
    topic,
    accuracy,
    timeTaken,
    timestamp: Date.now()
  });

  if (!studentState.topicScores[topic]) {
    studentState.topicScores[topic] = [];
  }

  studentState.topicScores[topic].push(accuracy);
}

// Stores selected subject & topic
export const appState = {
  selectedSubject: null,
  selectedTopic: null,
  currentLevel: null
};