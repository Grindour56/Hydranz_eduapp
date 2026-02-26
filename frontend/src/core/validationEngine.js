export function validateDecision(level, history) {
    if (history.length < 3) {
        return "intermediate";
    }

    const last = history[history.length - 1];
    const prev = history[history.length - 2];

    // Sudden drop detection
    if (prev.accuracy > 0.7 && last.accuracy < 0.3) {
        return "practice";
    }

    return level;
}