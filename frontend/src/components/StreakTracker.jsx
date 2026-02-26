
import { useState, useEffect } from 'react';

export default function StreakTracker({ currentStreak, longestStreak }) {
    const [weekDays, setWeekDays] = useState([]);

    useEffect(() => {
        // Generate last 7 days
        const days = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            days.push({
                day: date.toLocaleDateString('en-US', { weekday: 'short' }),
                date: date.toLocaleDateString(),
                active: i < currentStreak, // Last 'currentStreak' days are active
                isToday: i === 0
            });
        }

        setWeekDays(days);
    }, [currentStreak]);

    return (
        <div className="streak-tracker">
            <div className="streak-stats">
                <div className="streak-stat">
                    <span className="stat-value">{currentStreak}</span>
                    <span className="stat-label">Current Streak</span>
                </div>
                <div className="streak-stat">
                    <span className="stat-value">{longestStreak}</span>
                    <span className="stat-label">Longest Streak</span>
                </div>
            </div>

            <div className="streak-calendar">
                {weekDays.map((day, index) => (
                    <div
                        key={index}
                        className={`streak-day 
              ${day.active ? 'active' : ''} 
              ${day.isToday ? 'today' : ''}
              ${index === 0 ? 'first' : ''}
              ${index === 6 ? 'last' : ''}
            `}
                        title={day.date}
                    >
                        <span className="day-name">{day.day}</span>
                        <span className="day-indicator">●</span>
                    </div>
                ))}
            </div>

            <div className="streak-message">
                {currentStreak > 0 ? (
                    <p>🔥 {currentStreak} day streak! Keep it up!</p>
                ) : (
                    <p>Start your learning streak today!</p>
                )}
            </div>

            <style jsx>{`
        .streak-tracker {
          padding: 1rem;
        }

        .streak-stats {
          display: flex;
          justify-content: space-around;
          margin-bottom: 2rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 1rem;
        }

        .streak-stat {
          text-align: center;
          flex: 1;
        }

        .streak-stat:first-child {
          border-right: 1px solid rgba(255, 255, 255, 0.1);
        }

        .stat-value {
          display: block;
          font-size: 2.5rem;
          font-weight: bold;
          color: #ff9800;
          line-height: 1;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          color: #999;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .streak-calendar {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          gap: 4px;
        }

        .streak-day {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.5rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .streak-day.active {
          background: linear-gradient(135deg, rgba(255, 152, 0, 0.2) 0%, rgba(255, 193, 7, 0.2) 100%);
        }

        .streak-day.today {
          border: 2px solid #667eea;
        }

        .streak-day.first {
          border-top-left-radius: 12px;
          border-bottom-left-radius: 12px;
        }

        .streak-day.last {
          border-top-right-radius: 12px;
          border-bottom-right-radius: 12px;
        }

        .day-name {
          font-size: 0.75rem;
          color: #999;
          margin-bottom: 0.25rem;
        }

        .day-indicator {
          font-size: 1rem;
          color: #666;
        }

        .streak-day.active .day-indicator {
          color: #ff9800;
          text-shadow: 0 0 10px rgba(255, 152, 0, 0.5);
        }

        .streak-day.today .day-indicator {
          color: #667eea;
        }

        .streak-message {
          text-align: center;
          padding: 0.75rem;
          background: rgba(255, 152, 0, 0.1);
          border-radius: 20px;
        }

        .streak-message p {
          margin: 0;
          color: #ff9800;
          font-weight: 500;
        }
      `}</style>
        </div>
    );
}