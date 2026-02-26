import { studentState } from "../state";
import GlassCard from "../components/GlassCard";

export default function Dashboard() {
  // Calculate stats from student history
  const totalAttempts = studentState.history.length;
  const correctAttempts = studentState.history.filter(a => a.accuracy > 0).length;
  const avgAccuracy = totalAttempts > 0 
    ? ((totalAttempts - correctAttempts) / totalAttempts * 100).toFixed(1)
    : 0;
  const uniqueTopics = Object.keys(studentState.topicScores).length;

  const stats = [
    {
      title: "Accuracy",
      value: `${avgAccuracy}%`,
      icon: "🎯",
      description: "Your success rate"
    },
    {
      title: "Attempts",
      value: totalAttempts,
      icon: "📝",
      description: "Questions answered"
    },
    {
      title: "Topics",
      value: uniqueTopics,
      icon: "📚",
      description: "Topics mastered"
    },
    {
      title: "Streak",
      value: "5 days",
      icon: "🔥",
      description: "Learning consistency"
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Your learning progress at a glance</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <GlassCard key={idx} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <h3>{stat.title}</h3>
            <div className="stat-value">{stat.value}</div>
            <p className="stat-description">{stat.description}</p>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="activity-card">
        <h3>Recent Activity</h3>
        {studentState.history.length > 0 ? (
          <div className="activity-list">
            {studentState.history.slice(-5).reverse().map((attempt, idx) => (
              <div key={idx} className="activity-item">
                <span className="activity-topic">{attempt.topic}</span>
                <span className={`activity-result ${attempt.accuracy > 0 ? 'correct' : 'incorrect'}`}>
                  {attempt.accuracy > 0 ? '✓' : '✗'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-activity">Start your first quiz to see progress here!</p>
        )}
      </GlassCard>
    </div>
  );
}