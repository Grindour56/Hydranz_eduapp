export function decideLevel(profile, trend) {
    let mastery =
        profile.accuracy * 0.5 +
        profile.consistency * 0.3 +
        profile.speed * 0.2;

    // Adjust mastery based on trend
    if (trend > 0.1) mastery += 0.05;
    if (trend < -0.1) mastery -= 0.05;

    if (mastery < 0.4) return "remedial";
    if (mastery < 0.7) return "intermediate";
    return "advanced";
}