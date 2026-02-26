import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GlassCard from "../components/GlassCard";
import GradientButton from "../components/GradientButton";
import { studentState } from "../state";
import { getCachedModules } from "../api/api";
import StreakTracker from "../components/StreakTracker";
import TopicProgress from "../components/TopicProgress";
import AchievementBadges from "../components/AchievementBadges";
import LearningPath from "../components/LearningPath";

export default function Dashboard() {
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState({
    totalQuizzes: 0,
    averageAccuracy: 0,
    totalTimeSpent: 0,
    currentStreak: 0,
    longestStreak: 0,
    topicsMastered: 0,
    hintsUsed: 0,
    modulesCompleted: 0
  });

  const [topicProgress, setTopicProgress] = useState({});
  const [recentActivities, setRecentActivities] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    calculateUserStats();
    loadTopicProgress();
    loadRecentActivities();
    calculateAchievements();
    generateRecommendations();
  }, []);

  function calculateUserStats() {
    const history = studentState.history || [];
    const hintUsage = studentState.hintUsage || { totalHintsUsed: 0 };

    // Calculate stats
    const totalQuizzes = history.length;
    const avgAccuracy = history.length > 0
      ? (history.reduce((sum, h) => sum + h.accuracy, 0) / history.length * 100).toFixed(1)
      : 0;

    const totalTime = history.reduce((sum, h) => sum + (h.timeTaken || 0), 0);

    // Get streak from localStorage or calculate
    const streak = JSON.parse(localStorage.getItem('userStreak') || '{"current":0,"longest":0}');

    // Count mastered topics (topics with >80% accuracy)
    const masteredTopics = Object.values(topicProgress).filter(t => t.masteryLevel === 'advanced').length;

    // Count modules completed from cache
    const cachedModules = getCachedModules().length;

    setUserStats({
      totalQuizzes,
      averageAccuracy: avgAccuracy,
      totalTimeSpent: Math.round(totalTime / 60), // in minutes
      currentStreak: streak.current,
      longestStreak: streak.longest,
      topicsMastered: masteredTopics,
      hintsUsed: hintUsage.totalHintsUsed,
      modulesCompleted: cachedModules
    });
  }

  function loadTopicProgress() {
    // Group history by topic and calculate progress
    const progress = {};
    const history = studentState.history || [];

    history.forEach(attempt => {
      if (!progress[attempt.topic]) {
        progress[attempt.topic] = {
          attempts: [],
          accuracy: [],
          level: 'beginner',
          masteryLevel: 'beginner',
          lastAttempted: attempt.timestamp,
          totalTime: 0,
          hintsUsed: 0,
          streak: 0
        };
      }

      progress[attempt.topic].attempts.push(attempt);
      progress[attempt.topic].accuracy.push(attempt.accuracy);
      progress[attempt.topic].totalTime += attempt.timeTaken || 0;
      progress[attempt.topic].hintsUsed += attempt.hintsUsed || 0;
      progress[attempt.topic].lastAttempted = Math.max(
        progress[attempt.topic].lastAttempted || 0,
        attempt.timestamp
      );

      // Calculate average accuracy for this topic
      const avgAccuracy = progress[attempt.topic].accuracy.reduce((a, b) => a + b, 0)
        / progress[attempt.topic].accuracy.length;

      // Determine mastery level
      if (avgAccuracy >= 0.8) progress[attempt.topic].masteryLevel = 'advanced';
      else if (avgAccuracy >= 0.6) progress[attempt.topic].masteryLevel = 'intermediate';
      else progress[attempt.topic].masteryLevel = 'beginner';

      // Calculate streak (consecutive correct answers)
      const recentAttempts = progress[attempt.topic].attempts.slice(-5);
      let streak = 0;
      for (let i = recentAttempts.length - 1; i >= 0; i--) {
        if (recentAttempts[i].accuracy > 0.7) streak++;
        else break;
      }
      progress[attempt.topic].streak = streak;
    });

    setTopicProgress(progress);
  }

  function loadRecentActivities() {
    const activities = [...(studentState.history || [])]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5)
      .map(activity => ({
        ...activity,
        date: new Date(activity.timestamp).toLocaleDateString(),
        time: new Date(activity.timestamp).toLocaleTimeString()
      }));

    setRecentActivities(activities);
  }

  function calculateAchievements() {
    const achievements = [];

    // Quiz master achievement
    if (userStats.totalQuizzes >= 10) {
      achievements.push({
        id: 'quiz_master',
        title: 'Quiz Master',
        description: 'Completed 10 quizzes',
        icon: '🏆',
        unlocked: true
      });
    }

    // Streak achievements
    if (userStats.currentStreak >= 7) {
      achievements.push({
        id: 'weekly_warrior',
        title: 'Weekly Warrior',
        description: '7 day learning streak',
        icon: '🔥',
        unlocked: true
      });
    }

    // Accuracy achievements
    if (userStats.averageAccuracy >= 80) {
      achievements.push({
        id: 'sharp_mind',
        title: 'Sharp Mind',
        description: 'Average accuracy above 80%',
        icon: '🎯',
        unlocked: true
      });
    }

    // Topic mastery achievements
    if (userStats.topicsMastered >= 3) {
      achievements.push({
        id: 'topic_master',
        title: 'Topic Master',
        description: 'Mastered 3 topics',
        icon: '📚',
        unlocked: true
      });
    }

    // Hint-saver achievement
    if (userStats.hintsUsed === 0 && userStats.totalQuizzes > 5) {
      achievements.push({
        id: 'hint_saver',
        title: 'Independent Learner',
        description: 'Completed 5+ quizzes without hints',
        icon: '💪',
        unlocked: true
      });
    }

    setAchievements(achievements);
  }

  function generateRecommendations() {
    const recommendations = [];

    // Recommend based on weakest topics
    const weakTopics = Object.entries(topicProgress)
      .filter(([_, data]) => data.masteryLevel === 'beginner')
      .map(([topic]) => topic);

    if (weakTopics.length > 0) {
      recommendations.push({
        type: 'weak_topic',
        title: 'Continue Learning',
        description: `Review ${weakTopics[0]} to improve your skills`,
        action: 'Practice Now',
        topic: weakTopics[0]
      });
    }

    // Recommend next level topics
    const intermediateTopics = Object.entries(topicProgress)
      .filter(([_, data]) => data.masteryLevel === 'intermediate')
      .map(([topic]) => topic);

    if (intermediateTopics.length > 0) {
      recommendations.push({
        type: 'next_level',
        title: 'Ready for Advanced',
        description: `You're doing great in ${intermediateTopics[0]}! Try advanced concepts`,
        action: 'Challenge Yourself',
        topic: intermediateTopics[0]
      });
    }

    // Practice recommendations
    if (recentActivities.length > 0) {
      const lastActivity = recentActivities[0];
      if (lastActivity.accuracy < 0.5) {
        recommendations.push({
          type: 'practice',
          title: 'Practice Makes Perfect',
          description: `Review ${lastActivity.topic} to strengthen your understanding`,
          action: 'Practice',
          topic: lastActivity.topic
        });
      }
    }

    setRecommendations(recommendations);
  }

  return (
    <div className="dashboard-container">
      {/* Welcome Header */}
      <div className="welcome-header">
        <h1>Welcome back, {studentState.user?.name || 'Learner'}! 👋</h1>
        <p>Continue your learning journey</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <GlassCard className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{userStats.totalQuizzes}</h3>
            <p>Quizzes Taken</p>
          </div>
        </GlassCard>

        <GlassCard className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>{userStats.averageAccuracy}%</h3>
            <p>Avg. Accuracy</p>
          </div>
        </GlassCard>

        <GlassCard className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <h3>{userStats.totalTimeSpent} min</h3>
            <p>Total Time</p>
          </div>
        </GlassCard>

        <GlassCard className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <h3>{userStats.currentStreak}</h3>
            <p>Day Streak</p>
          </div>
        </GlassCard>

        <GlassCard className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>{userStats.topicsMastered}</h3>
            <p>Topics Mastered</p>
          </div>
        </GlassCard>

        <GlassCard className="stat-card">
          <div className="stat-icon">💡</div>
          <div className="stat-content">
            <h3>{userStats.hintsUsed}</h3>
            <p>Hints Used</p>
          </div>
        </GlassCard>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Left Column */}
        <div className="left-column">
          <GlassCard className="streak-section">
            <h2>Learning Streak 🔥</h2>
            <StreakTracker
              currentStreak={userStats.currentStreak}
              longestStreak={userStats.longestStreak}
            />
          </GlassCard>

          <GlassCard className="achievements-section">
            <h2>Achievements 🏆</h2>
            <AchievementBadges achievements={achievements} />
          </GlassCard>

          <GlassCard className="recent-activities">
            <h2>Recent Activity 📝</h2>
            <div className="activity-list">
              {recentActivities.map((activity, index) => (
                <div key={index} className="activity-item">
                  <span className="activity-topic">{activity.topic}</span>
                  <span className="activity-accuracy" style={{
                    color: activity.accuracy > 0.7 ? '#4caf50' : activity.accuracy > 0.4 ? '#ff9800' : '#f44336'
                  }}>
                    {(activity.accuracy * 100).toFixed(0)}%
                  </span>
                  <span className="activity-time">{activity.date}</span>
                </div>
              ))}
              {recentActivities.length === 0 && (
                <p className="empty-state">No recent activities. Start a quiz!</p>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Right Column */}
        <div className="right-column">
          <GlassCard className="topic-progress-section">
            <h2>Topic Progress 📈</h2>
            <TopicProgress topics={topicProgress} />
          </GlassCard>

          <GlassCard className="recommendations-section">
            <h2>Recommended for You 🎯</h2>
            <div className="recommendations-list">
              {recommendations.map((rec, index) => (
                <div key={index} className="recommendation-item">
                  <div className="rec-content">
                    <h4>{rec.title}</h4>
                    <p>{rec.description}</p>
                  </div>
                  <GradientButton
                    variant="primary"
                    onClick={() => navigate('/subjects', { state: { topic: rec.topic } })}
                  >
                    {rec.action}
                  </GradientButton>
                </div>
              ))}
              {recommendations.length === 0 && (
                <p className="empty-state">Start learning to get personalized recommendations!</p>
              )}
            </div>
          </GlassCard>

          <GlassCard className="learning-path-section">
            <h2>Your Learning Path 🗺️</h2>
            <LearningPath topicProgress={topicProgress} />
          </GlassCard>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <GradientButton variant="primary" onClick={() => navigate('/subjects')}>
          Start New Quiz
        </GradientButton>
        <GradientButton variant="secondary" onClick={() => navigate('/modules')}>
          View Saved Modules
        </GradientButton>
        <GradientButton variant="secondary" onClick={() => navigate('/profile')}>
          View Profile
        </GradientButton>
      </div>

      <style jsx>{`
        .dashboard-container {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .welcome-header {
          margin-bottom: 2rem;
        }

        .welcome-header h1 {
          margin: 0;
          font-size: 2rem;
        }

        .welcome-header p {
          color: #666;
          margin: 0.5rem 0 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          display: flex;
          align-items: center;
          padding: 1.5rem;
        }

        .stat-icon {
          font-size: 2.5rem;
          margin-right: 1rem;
        }

        .stat-content h3 {
          margin: 0;
          font-size: 1.8rem;
          font-weight: bold;
        }

        .stat-content p {
          margin: 0.25rem 0 0;
          color: #666;
          font-size: 0.9rem;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .left-column,
        .right-column {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .activity-list {
          margin-top: 1rem;
        }

        .activity-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .activity-item:last-child {
          border-bottom: none;
        }

        .activity-topic {
          font-weight: 500;
        }

        .activity-accuracy {
          font-weight: bold;
        }

        .activity-time {
          color: #666;
          font-size: 0.85rem;
        }

        .recommendations-list {
          margin-top: 1rem;
        }

        .recommendation-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .rec-content h4 {
          margin: 0 0 0.25rem;
        }

        .rec-content p {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
        }

        .quick-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 2rem;
        }

        .empty-state {
          text-align: center;
          color: #666;
          padding: 2rem;
        }

        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
          
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}

