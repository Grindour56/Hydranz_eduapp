export function computeProfile(history) {
    if (history.length === 0) return null;

    const avgAccuracy =
        history.reduce((sum, h) => sum + h.accuracy, 0) / history.length;

    const avgTime =
        history.reduce((sum, h) => sum + h.timeTaken, 0) / history.length;

    const consistency =
        1 - variance(history.map(h => h.accuracy));

    return {
        accuracy: avgAccuracy,
        speed: normalizeTime(avgTime),
        consistency
    };
}

function variance(arr) {
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    return arr.reduce((sum, x) => sum + (x - mean) ** 2, 0) / arr.length;
}

function normalizeTime(time) {
    return Math.max(0, 1 - (time / 120)); // 120 sec baseline
}