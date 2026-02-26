
export default function AchievementBadges({ achievements }) {
  // Define all possible achievements with their icons and descriptions
  const achievementDefinitions = {
    quiz_master: {
      icon: '🏆',
      title: 'Quiz Master',
      description: 'Completed 10 quizzes'
    },
    weekly_warrior: {
      icon: '🔥',
      title: 'Weekly Warrior',
      description: '7 day learning streak'
    },
    sharp_mind: {
      icon: '🎯',
      title: 'Sharp Mind',
      description: 'Average accuracy above 80%'
    },
    topic_master: {
      icon: '📚',
      title: 'Topic Master',
      description: 'Mastered 3 topics'
    },
    hint_saver: {
      icon: '💪',
      title: 'Independent Learner',
      description: 'Completed 5+ quizzes without hints'
    },
    first_quiz: {
      icon: '🎉',
      title: 'First Steps',
      description: 'Completed your first quiz'
    },
    speed_demon: {
      icon: '⚡',
      title: 'Speed Demon',
      description: 'Completed a quiz in under 30 seconds'
    },
    perfect_score: {
      icon: '💯',
      title: 'Perfect Score',
      description: 'Got 100% on a quiz'
    },
    consistent_learner: {
      icon: '📅',
      title: 'Consistent Learner',
      description: 'Studied 5 days in a row'
    },
    hint_enthusiast: {
      icon: '💡',
      title: 'Hint Enthusiast',
      description: 'Used 10+ hints'
    }
  };

  return (
    <div className="achievement-badges">
      {achievements.length > 0 ? (
        <div className="badges-grid">
          {achievements.map(achievement => {
            const def = achievementDefinitions[achievement.id] || {
              icon: achievement.icon || '🏅',
              title: achievement.title,
              description: achievement.description
            };

            return (
              <div key={achievement.id} className={`badge ${achievement.unlocked ? 'unlocked' : 'locked'}`}>
                <div className="badge-icon">{def.icon}</div>
                <div className="badge-info">
                  <strong>{def.title}</strong>
                  <small>{def.description}</small>
                </div>
                {!achievement.unlocked && (
                  <div className="badge-locked">🔒</div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <p>No achievements yet</p>
          <small>Complete quizzes to earn achievements!</small>
        </div>
      )}

      <style jsx>{`
        .achievement-badges {
          padding: 1rem;
        }

        .badges-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
          max-height: 400px;
          overflow-y: auto;
        }

        .badge {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          transition: all 0.3s ease;
          position: relative;
          border: 1px solid transparent;
        }

        .badge.unlocked {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
          border-color: rgba(102, 126, 234, 0.5);
        }

        .badge.locked {
          opacity: 0.5;
          filter: grayscale(0.5);
        }

        .badge:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.1);
        }

        .badge-icon {
          font-size: 2rem;
          min-width: 40px;
          text-align: center;
        }

        .badge-info {
          flex: 1;
        }

        .badge-info strong {
          display: block;
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
          color: white;
        }

        .badge-info small {
          color: #999;
          font-size: 0.75rem;
          line-height: 1.2;
          display: block;
        }

        .badge-locked {
          position: absolute;
          top: 5px;
          right: 5px;
          font-size: 0.8rem;
        }

        .empty-state {
          text-align: center;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
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
        .badges-grid::-webkit-scrollbar {
          width: 6px;
        }

        .badges-grid::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }

        .badges-grid::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }

        .badges-grid::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}