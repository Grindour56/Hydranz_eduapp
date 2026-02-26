import { useState, useEffect } from 'react';

export default function LearningPath({ topicProgress }) {
    const [pathProgress, setPathProgress] = useState({
        currentStage: 0,
        nextMilestone: '',
        completedTopics: 0,
        totalTopics: 0
    });

    const stages = [
        {
            name: 'Beginner',
            icon: '🌱',
            color: '#4caf50',
            description: 'Learning fundamentals',
            requirements: 'Complete 2 beginner topics'
        },
        {
            name: 'Intermediate',
            icon: '🌿',
            color: '#ff9800',
            description: 'Building skills',
            requirements: 'Reach intermediate in 2 topics'
        },
        {
            name: 'Advanced',
            icon: '🌳',
            color: '#673ab7',
            description: 'Mastering concepts',
            requirements: 'Reach advanced in 2 topics'
        },
        {
            name: 'Master',
            icon: '🏆',
            color: '#f44336',
            description: 'Expert level',
            requirements: 'Master all topics'
        }
    ];

    useEffect(() => {
        if (topicProgress) {
            const topics = Object.values(topicProgress);
            const totalTopics = topics.length;

            // Count topics at each level
            const beginnerTopics = topics.filter(t => t.masteryLevel === 'beginner').length;
            const intermediateTopics = topics.filter(t => t.masteryLevel === 'intermediate').length;
            const advancedTopics = topics.filter(t => t.masteryLevel === 'advanced').length;

            // Determine current stage
            let currentStage = 0;
            if (advancedTopics >= 2) currentStage = 3;
            else if (intermediateTopics >= 2) currentStage = 2;
            else if (beginnerTopics >= 2) currentStage = 1;

            // Get next milestone
            const nextMilestone = getNextMilestone(currentStage, topics);

            setPathProgress({
                currentStage,
                nextMilestone,
                completedTopics: advancedTopics,
                totalTopics
            });
        }
    }, [topicProgress]);

    const getNextMilestone = (stage, topics) => {
        switch (stage) {
            case 0:
                return 'Complete 2 beginner topics';
            case 1:
                const intermediateNeeded = 2 - topics.filter(t => t.masteryLevel === 'intermediate').length;
                return `Reach intermediate in ${intermediateNeeded} more topic${intermediateNeeded > 1 ? 's' : ''}`;
            case 2:
                const advancedNeeded = 2 - topics.filter(t => t.masteryLevel === 'advanced').length;
                return `Reach advanced in ${advancedNeeded} more topic${advancedNeeded > 1 ? 's' : ''}`;
            case 3:
                return 'You\'ve reached the highest level! 🎉';
            default:
                return 'Start learning to begin your journey';
        }
    };

    return (
        <div className="learning-path">
            <div className="path-visualization">
                {stages.map((stage, index) => (
                    <div key={stage.name} className="path-node-wrapper">
                        <div
                            className={`path-node ${index <= pathProgress.currentStage ? 'completed' : ''}`}
                            style={{ '--node-color': stage.color }}
                        >
                            <div className="node-icon">{stage.icon}</div>
                            <div className="node-content">
                                <div className="node-name">{stage.name}</div>
                                <div className="node-desc">{stage.description}</div>
                            </div>
                        </div>

                        {index < stages.length - 1 && (
                            <div className={`path-connector ${index < pathProgress.currentStage ? 'completed' : ''}`}>
                                <div className="connector-line" />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="path-details">
                <div className="current-progress">
                    <h4>Current Progress</h4>
                    <div className="progress-ring">
                        <svg viewBox="0 0 100 100">
                            <circle
                                cx="50" cy="50" r="45"
                                fill="none"
                                stroke="rgba(255,255,255,0.1)"
                                strokeWidth="10"
                            />
                            <circle
                                cx="50" cy="50" r="45"
                                fill="none"
                                stroke={stages[pathProgress.currentStage]?.color || '#667eea'}
                                strokeWidth="10"
                                strokeLinecap="round"
                                strokeDasharray={`${(pathProgress.currentStage / (stages.length - 1)) * 283} 283`}
                                transform="rotate(-90 50 50)"
                                style={{ transition: 'stroke-dasharray 0.5s ease' }}
                            />
                        </svg>
                        <div className="progress-text">
                            <span className="progress-percent">
                                {Math.round((pathProgress.currentStage / (stages.length - 1)) * 100)}%
                            </span>
                        </div>
                    </div>
                </div>

                <div className="milestone-card">
                    <h4>Next Milestone</h4>
                    <div className="milestone-content">
                        <div className="milestone-icon">
                            {stages[Math.min(pathProgress.currentStage + 1, stages.length - 1)]?.icon}
                        </div>
                        <div className="milestone-info">
                            <strong>{stages[Math.min(pathProgress.currentStage + 1, stages.length - 1)]?.name}</strong>
                            <p>{pathProgress.nextMilestone}</p>
                        </div>
                    </div>
                </div>

                <div className="stage-requirements">
                    <h4>Stage Requirements</h4>
                    {stages.map((stage, index) => (
                        <div
                            key={stage.name}
                            className={`requirement-item ${index <= pathProgress.currentStage ? 'completed' : ''}`}
                        >
                            <span className="req-icon">{stage.icon}</span>
                            <span className="req-text">{stage.requirements}</span>
                            {index <= pathProgress.currentStage && (
                                <span className="req-check">✓</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
        .learning-path {
          padding: 1.5rem;
        }

        .path-visualization {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }

        .path-node-wrapper {
          position: relative;
        }

        .path-node {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.3s ease;
        }

        .path-node.completed {
          background: linear-gradient(90deg, 
            rgba(102, 126, 234, 0.1) 0%, 
            rgba(118, 75, 162, 0.1) 100%
          );
          border-color: var(--node-color);
        }

        .node-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }

        .path-node.completed .node-icon {
          background: var(--node-color);
        }

        .node-content {
          flex: 1;
        }

        .node-name {
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .node-desc {
          font-size: 0.8rem;
          color: #999;
        }

        .path-connector {
          position: relative;
          height: 20px;
          margin-left: 20px;
        }

        .connector-line {
          position: absolute;
          left: 20px;
          top: 0;
          width: 2px;
          height: 100%;
          background: rgba(255, 255, 255, 0.1);
        }

        .path-connector.completed .connector-line {
          background: linear-gradient(180deg, 
            var(--node-color) 0%, 
            ${stages[1]?.color} 100%
          );
        }

        .path-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .current-progress {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          padding: 1rem;
          text-align: center;
        }

        .current-progress h4,
        .milestone-card h4,
        .stage-requirements h4 {
          margin: 0 0 1rem;
          color: #999;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .progress-ring {
          position: relative;
          width: 120px;
          height: 120px;
          margin: 0 auto 1rem;
        }

        .progress-ring svg {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }

        .progress-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }

        .progress-percent {
          font-size: 1.5rem;
          font-weight: bold;
        }

        .milestone-card {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          padding: 1rem;
        }

        .milestone-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .milestone-icon {
          font-size: 2rem;
        }

        .milestone-info strong {
          display: block;
          margin-bottom: 0.25rem;
        }

        .milestone-info p {
          margin: 0;
          color: #999;
          font-size: 0.85rem;
        }

        .stage-requirements {
          grid-column: span 2;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          padding: 1rem;
        }

        .requirement-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem;
          border-radius: 6px;
          margin-bottom: 0.25rem;
        }

        .requirement-item.completed {
          background: rgba(76, 175, 80, 0.1);
        }

        .req-icon {
          font-size: 1.2rem;
        }

        .req-text {
          flex: 1;
          font-size: 0.9rem;
        }

        .req-check {
          color: #4caf50;
          font-weight: bold;
        }

        @media (max-width: 768px) {
          .path-details {
            grid-template-columns: 1fr;
          }
          
          .stage-requirements {
            grid-column: span 1;
          }
        }
      `}</style>
        </div>
    );
}

