export const studentState = {
    history: [],
    topicScores: {},
    hintUsage: {
        totalHintsUsed: 0,
        hintDependency: 0, // Ratio of questions where hints were used
        averageHintsPerQuestion: 0
    }
};

export function addAttempt(topic, accuracy, timeTaken, hintInfo = { hintsUsed: 0, usedHints: false }) {
    // Add to history
    studentState.history.push({
        topic,
        accuracy,
        timeTaken,
        timestamp: Date.now(),
        hintsUsed: hintInfo.hintsUsed || 0,
        usedHints: hintInfo.usedHints || false
    });

    // Update topic scores
    if (!studentState.topicScores[topic]) {
        studentState.topicScores[topic] = [];
    }
    studentState.topicScores[topic].push(accuracy);

    // Update hint usage statistics
    updateHintStats();
}

function updateHintStats() {
    const history = studentState.history;
    if (history.length === 0) return;

    const totalHints = history.reduce((sum, h) => sum + (h.hintsUsed || 0), 0);
    const questionsWithHints = history.filter(h => h.usedHints).length;

    studentState.hintUsage = {
        totalHintsUsed: totalHints,
        hintDependency: questionsWithHints / history.length,
        averageHintsPerQuestion: totalHints / history.length
    };
}

// Get hint-adjusted profile
export function getHintAdjustedProfile() {
    const baseProfile = computeProfile(studentState.history);
    if (!baseProfile) return null;

    // Adjust accuracy based on hint usage
    const hintPenalty = studentState.hintUsage.averageHintsPerQuestion * 0.1;

    return {
        ...baseProfile,
        rawAccuracy: baseProfile.accuracy,
        accuracy: Math.max(0, baseProfile.accuracy - hintPenalty),
        hintDependency: studentState.hintUsage.hintDependency,
        totalHintsUsed: studentState.hintUsage.totalHintsUsed
    };
}
export function getTopicLevel(topic) {
    const topicAttempts = studentState.topicScores[topic] || [];

    if (topicAttempts.length === 0) return 'beginner';

    const avgScore = topicAttempts.reduce((a, b) => a + b, 0) / topicAttempts.length;
    const hintUsage = studentState.hintUsage?.hintDependency || 0;

    // Adjust level based on hint usage
    let effectiveScore = avgScore;
    if (hintUsage > 0.5) {
        effectiveScore *= 0.8; // Heavy hint usage reduces effective score
    }

    if (effectiveScore >= 0.8) return 'advanced';
    if (effectiveScore >= 0.6) return 'intermediate';
    return 'beginner';
}