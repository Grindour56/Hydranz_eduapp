export default function TopicProgress({ topics }) {
  // Convert topics object to array and sort by mastery level
  const topicsList = Object.entries(topics || {}).map(([name, data]) => {
    const avgAccuracy = data.accuracy.length > 0
      ? (data.accuracy.reduce((a, b) => a + b, 0) / data.accuracy.length * 100).toFixed(1)
      : 0;

    return {
      name,
      masteryLevel: data.masteryLevel || 'beginner',
      accuracy: avgAccuracy,
      streak: data.streak || 0,
      attempts: data.attempts?.length || 0,
      lastAttempted: data.lastAttempted ? new Date(data.lastAttempted).toLocaleDateString() : 'Never'
    };
  }).sort((a, b) => {
    const levelOrder = { advanced: 3, intermediate: 2, beginner: 1 };
    return levelOrder[b.masteryLevel] - levelOrder[a.masteryLevel];
  });

  const getLevelColor = (level) => {
    switch (level) {
      case 'advanced': return '#673ab7';
      case 'intermediate': return '#ff9800';
      default: return '#4caf50';
    }
  };

  return (
    <div className="topic-progress">
      {topicsList.length > 0 ? (
        <div className="topics-list">
          {topicsList.map(topic => (
            <div key={topic.name} className="topic-item">
              <div className="topic-header">
                <div className="topic-name-wrapper">
                  <span className="topic-name">{topic.name}</span>
                  <span
                    className="topic-level"
                    style={{
                      background: `${getLevelColor(topic.masteryLevel)}20`,
                      color: getLevelColor(topic.masteryLevel)
                    }}
                  >
                    {topic.masteryLevel}
                  </span>
                </div>
                <span className="topic-last">{topic.lastAttempted}</span>
              </div>

              <div className="topic-stats">
                <div className="topic-stat">
                  <span className="stat-label">Accuracy</span>
                  <span className="stat-value">{topic.accuracy}%</span>
                </div>
                <div className="topic-stat">
                  <span className="stat-label">Streak</span>
                  <span className="stat-value">
                    {topic.streak} <span style={{ fontSize: '0.8rem' }}>🔥</span>
                  </span>
                </div>
                <div className="topic-stat">
                  <span className="stat-label">Attempts</span>
                  <span className="stat-value">{topic.attempts}</span>
                </div>
              </div>

              <div className="progress-container">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${topic.accuracy}%`,
                      background: `linear-gradient(90deg, ${getLevelColor(topic.masteryLevel)} 0%, ${getLevelColor(topic.masteryLevel)}dd 100%)`
                    }}
                  />
                </div>
                <span className="progress-label">{topic.accuracy}% Mastery</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No topics attempted yet</p>
          <small>Complete quizzes to see your progress!</small>
        </div>
      )}

      <style jsx>{`
        .topic-progress {
          padding: 1rem;
        }

        .topics-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-height: 400px;
          overflow-y: auto;
        }

        .topic-item {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          padding: 1rem;
          transition: all 0.3s ease;
        }

        .topic-item:hover {
          background: rgba(255, 255, 255, 0.05);
          transform: translateX(4px);
        }

        .topic-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .topic-name-wrapper {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .topic-name {
          font-weight: 600;
          font-size: 1.1rem;
        }

        .topic-level {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          text-transform: capitalize;
          font-weight: 500;
        }

        .topic-last {
          color: #666;
          font-size: 0.75rem;
        }

        .topic-stats {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          background: rgba(0, 0, 0, 0.2);
          padding: 0.75rem;
          border-radius: 8px;
        }

        .topic-stat {
          flex: 1;
          text-align: center;
        }

        .stat-label {
          display: block;
          font-size: 0.7rem;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.25rem;
        }

        .stat-value {
          font-size: 1.1rem;
          font-weight: bold;
        }

        .progress-container {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .progress-bar {
          flex: 1;
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          transition: width 0.3s ease;
          border-radius: 4px;
        }

        .progress-label {
          font-size: 0.85rem;
          color: #999;
          min-width: 80px;
          text-align: right;
        }

        .empty-state {
          text-align: center;
          padding: 3rem 1rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
        }

        .empty-state p {
          margin: 0 0 0.5rem;
          color: #999;
          font-size: 1.1rem;
        }

        .empty-state small {
          color: #666;
        }

        /* Scrollbar styling */
        .topics-list::-webkit-scrollbar {
          width: 6px;
        }

        .topics-list::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }

        .topics-list::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }

        .topics-list::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}