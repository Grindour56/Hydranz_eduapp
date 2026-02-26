import { computeProfile } from "./profiling.js";
import { calculateTrend } from "./trendEngine.js";
import { decideLevel } from "./decisionEngine.js";
import { validateDecision } from "./validationEngine.js";

export function generateModule(history) {
    const profile = computeProfile(history);
    if (!profile) return null;

    const trend = calculateTrend(history);

    const rawLevel = decideLevel(profile, trend);

    const finalLevel = validateDecision(rawLevel, history);

    return mapLevelToModuleId(finalLevel);
}

function mapLevelToModuleId(level) {
    const mapping = {
        remedial: 1,
        intermediate: 2,
        advanced: 3,
        practice: 4
    };

    return mapping[level];
}