import { studentState } from '../state';
import GlassCard from './GlassCard';

export default function HintAnalytics() {
    const { hintUsage, history } = studentState;

    if (history.length === 0) return null;

    const hintDependencyPercent = (hintUsage.hintDependency * 100).toFixed(1);
    const avgHintsPerQ = hintUsage.averageHintsPerQuestion.toFixed(2);

    return (
        <GlassCard className="hint-analytics">
            <h3>📊 Hint Usage Analytics</h3>
            <div className="hint-stats">
                <div className="stat">
                    <label>Total Hints Used:</label>
                    <span>{hintUsage.totalHintsUsed}</span>
                </div>
                <div className="stat">
                    <label>Hint Dependency:</label>
                    <span>{hintDependencyPercent}%</span>
                </div>
                <div className="stat">
                    <label>Avg Hints/Question:</label>
                    <span>{avgHintsPerQ}</span>
                </div>
                <div className="stat">
                    <label>Learning Style:</label>
                    <span>
                        {hintUsage.hintDependency > 0.5
                            ? "🔍 Guided Learner"
                            : hintUsage.hintDependency > 0.2
                                ? "⚖️ Balanced Learner"
                                : "🚀 Independent Learner"}
                    </span>
                </div>
            </div>

            <style jsx>{`
                .hint-analytics {
                    margin: 1rem 0;
                    padding: 1rem;
                }
                .hint-stats {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1rem;
                    margin-top: 1rem;
                }
                .stat {
                    display: flex;
                    flex-direction: column;
                }
                .stat label {
                    font-size: 0.8rem;
                    color: #666;
                }
                .stat span {
                    font-size: 1.2rem;
                    font-weight: bold;
                }
            `}</style>
        </GlassCard>
    );
}