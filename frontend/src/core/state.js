export const studentState = {
    history: [],
    topicScores: {},
};

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