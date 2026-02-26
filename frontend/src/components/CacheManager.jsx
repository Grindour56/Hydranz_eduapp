import { useState, useEffect } from 'react';
import {
    getCachedModules,
    deleteCachedModule,
    clearAllCache,
    getCacheStats,
    fetchModule
} from '../api/api';
import GlassCard from './GlassCard';
import GradientButton from './GradientButton';

export default function CacheManager({ onClose }) {
    const [cachedModules, setCachedModules] = useState([]);
    const [stats, setStats] = useState(null);
    const [selectedModules, setSelectedModules] = useState(new Set());
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        loadCacheData();
    }, []);

    function loadCacheData() {
        setCachedModules(getCachedModules());
        setStats(getCacheStats());
    }

    async function handleRefreshModule(moduleId) {
        setIsRefreshing(true);
        await fetchModule(moduleId, true); // Force refresh
        loadCacheData();
        setIsRefreshing(false);
    }

    function handleDeleteSelected() {
        selectedModules.forEach(id => {
            deleteCachedModule(id);
        });
        setSelectedModules(new Set());
        loadCacheData();
    }

    function handleDeleteAll() {
        if (window.confirm('Delete all cached modules? This cannot be undone.')) {
            clearAllCache();
            setSelectedModules(new Set());
            loadCacheData();
        }
    }

    function toggleModule(id) {
        const newSelected = new Set(selectedModules);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedModules(newSelected);
    }

    if (!stats) return null;

    return (
        <GlassCard className="cache-manager">
            <div className="cache-header">
                <h2>📦 Cache Management</h2>
                <button className="close-btn" onClick={onClose}>×</button>
            </div>

            <div className="cache-stats">
                <div className="stat-item">
                    <span>Storage Used:</span>
                    <strong>{stats.totalSizeMB} MB / {stats.maxSizeMB} MB</strong>
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${stats.usagePercent}%` }}
                        />
                    </div>
                </div>
                <div className="stat-item">
                    <span>Cached Modules:</span>
                    <strong>{stats.totalModules}</strong>
                </div>
                <div className="stat-item">
                    <span>Free Space:</span>
                    <strong>{stats.remainingMB} MB</strong>
                </div>
            </div>

            <div className="cache-actions">
                <GradientButton
                    variant="secondary"
                    onClick={handleDeleteAll}
                    disabled={cachedModules.length === 0}
                >
                    Delete All
                </GradientButton>
                <GradientButton
                    variant="primary"
                    onClick={handleDeleteSelected}
                    disabled={selectedModules.size === 0}
                >
                    Delete Selected ({selectedModules.size})
                </GradientButton>
            </div>

            <div className="cached-modules-list">
                <h3>Saved Modules</h3>
                {cachedModules.length === 0 ? (
                    <p className="empty-message">No modules cached yet. Complete quizzes to cache content!</p>
                ) : (
                    <table className="modules-table">
                        <thead>
                            <tr>
                                <th><input type="checkbox" onChange={e => {
                                    if (e.target.checked) {
                                        setSelectedModules(new Set(cachedModules.map(m => m.id)));
                                    } else {
                                        setSelectedModules(new Set());
                                    }
                                }} /></th>
                                <th>Module ID</th>
                                <th>Size</th>
                                <th>Cached</th>
                                <th>Last Used</th>
                                <th>Expires</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cachedModules.map(module => (
                                <tr key={module.id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedModules.has(module.id)}
                                            onChange={() => toggleModule(module.id)}
                                        />
                                    </td>
                                    <td>{module.id}</td>
                                    <td>{module.sizeKB} KB</td>
                                    <td>{module.cachedDate}</td>
                                    <td>{module.lastUsed}</td>
                                    <td>{module.expires}</td>
                                    <td>
                                        <button
                                            className="refresh-btn"
                                            onClick={() => handleRefreshModule(module.id)}
                                            disabled={isRefreshing}
                                        >
                                            🔄 Refresh
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => {
                                                deleteCachedModule(module.id);
                                                loadCacheData();
                                            }}
                                        >
                                            🗑️ Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <style jsx>{`
        .cache-manager {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 90%;
          max-width: 1000px;
          max-height: 80vh;
          overflow-y: auto;
          z-index: 1000;
          padding: 2rem;
        }

        .cache-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 2rem;
          cursor: pointer;
          color: #666;
        }

        .cache-stats {
          background: rgba(255, 255, 255, 0.1);
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
        }

        .stat-item {
          margin-bottom: 1rem;
        }

        .stat-item span {
          display: inline-block;
          width: 120px;
          color: #666;
        }

        .progress-bar {
          height: 8px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          margin-top: 4px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .cache-actions {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .modules-table {
          width: 100%;
          border-collapse: collapse;
        }

        .modules-table th,
        .modules-table td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .modules-table th {
          background: rgba(255, 255, 255, 0.05);
          font-weight: 600;
        }

        .refresh-btn,
        .delete-btn {
          margin: 0 0.25rem;
          padding: 0.25rem 0.5rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .refresh-btn:hover {
          background: #4a90e2;
        }

        .delete-btn:hover {
          background: #e24a4a;
        }

        .empty-message {
          text-align: center;
          color: #666;
          padding: 2rem;
        }
      `}</style>
        </GlassCard>
    );
}