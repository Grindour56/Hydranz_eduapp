export function calculateTrend(history) {
    if (history.length < 2) return 0;

    const first = history[0].accuracy;
    const last = history[history.length - 1].accuracy;

    return last - first; // positive = improving
}