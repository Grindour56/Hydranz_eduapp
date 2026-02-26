export function computeProfile(history) {
  if (history.length === 0) return null;

  // average accuracy
  let totalAccuracy = history.reduce((sum, h) => sum + h.accuracy, 0);
  let avgAccuracy = totalAccuracy / history.length;

  // average time
  let totalTime = history.reduce((sum, h) => sum + h.timeTaken, 0);
  let avgTime = totalTime / history.length;

  // convert time → speed score (faster = better)
  let speedScore = 1 / avgTime;

  return {
    accuracy: avgAccuracy,
    speed: speedScore
  };
}