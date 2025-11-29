import React, { useState, useEffect } from 'react';
import './SystemLogs.css';
import AdminNavigation from '../../navigation/AdminNavigation';

const SystemLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadSystemLogs();
        const interval = setInterval(loadSystemLogs, 10000); // Update every 10 seconds
        return () => clearInterval(interval);
    }, []);

    const loadSystemLogs = async () => {
        try {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 800));
            
            setLogs([
                {
                    id: 1,
                    timestamp: '2025-08-09 14:35:22',
                    level: 'info',
                    category: 'authentication',
                    message: 'User admin@system.com successfully logged in',
                    details: 'IP: 192.168.1.100, Browser: Chrome 116.0.0.0'
                },
                {
                    id: 2,
                    timestamp: '2025-08-09 14:32:15',
                    level: 'success',
                    category: 'voting',
                    message: 'Vote successfully recorded for election ELC-2025-001',
                    details: 'Voter ID: VTR123456, Station: 12, Candidate: John Smith'
                },
                {
                    id: 3,
                    timestamp: '2025-08-09 14:30:08',
                    level: 'warning',
                    category: 'system',
                    message: 'High memory usage detected on server node-02',
                    details: 'Memory usage: 87%, Recommended action: Monitor closely'
                },
                {
                    id: 4,
                    timestamp: '2025-08-09 14:28:44',
                    level: 'error',
                    category: 'database',
                    message: 'Connection timeout to secondary database',
                    details: 'Database: replica-db-02, Timeout: 30s, Retrying connection...'
                },
                {
                    id: 5,
                    timestamp: '2025-08-09 14:25:33',
                    level: 'info',
                    category: 'backup',
                    message: 'Scheduled backup process started',
                    details: 'Backup type: Incremental, Target: Azure Storage Account'
                },
                {
                    id: 6,
                    timestamp: '2025-08-09 14:22:17',
                    level: 'success',
                    category: 'security',
                    message: 'Biometric authentication successful',
                    details: 'Voter ID: VTR789012, Method: Fingerprint, Match confidence: 98.7%'
                },
                {
                    id: 7,
                    timestamp: '2025-08-09 14:20:05',
                    level: 'warning',
                    category: 'network',
                    message: 'Slow response time from polling station PS-15',
                    details: 'Response time: 2.8s, Threshold: 2.0s, Location: West District'
                },
                {
                    id: 8,
                    timestamp: '2025-08-09 14:18:52',
                    level: 'info',
                    category: 'voting',
                    message: 'New voter registration completed',
                    details: 'Voter ID: VTR890123, Region: Central District, Status: Verified'
                }
            ]);
        } catch (error) {
            console.error('Error loading system logs:', error);
        } finally {
            setLoading(false);
        }
    };

    // const getLevelColor = (level) => {
    //     switch (level) {
    //         case 'error': return '#dc3545';
    //         case 'warning': return '#ffc107';
    //         case 'success': return '#28a745';
    //         case 'info': return '#17a2b8';
    //         default: return '#6c757d';
    //     }
    // };

    const getLevelIcon = (level) => {
        switch (level) {
            case 'error': return '❌';
            case 'warning': return '⚠️';
            case 'success': return '✅';
            case 'info': return 'ℹ️';
            default: return '📝';
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'authentication': return '🔐';
            case 'voting': return '🗳️';
            case 'system': return '🖥️';
            case 'database': return '🗄️';
            case 'backup': return '💾';
            case 'security': return '🔒';
            case 'network': return '🌐';
            default: return '📋';
        }
    };

    const filteredLogs = logs.filter(log => {
        const matchesFilter = filter === 'all' || log.level === filter;
        const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             log.category.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const logCounts = {
        all: logs.length,
        error: logs.filter(l => l.level === 'error').length,
        warning: logs.filter(l => l.level === 'warning').length,
        success: logs.filter(l => l.level === 'success').length,
        info: logs.filter(l => l.level === 'info').length
    };

    return (
        <div className="app-layout">
            <AdminNavigation />
            <div className="system-logs-container">
                <div className="page-header">
                    <h1>📝 System Logs</h1>
                    <p>Monitor system activities and troubleshoot issues</p>
                </div>

                <div className="logs-controls">
                    <div className="search-section">
                        <input
                            type="text"
                            placeholder="Search logs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    <div className="filter-buttons">
                        <button 
                            className={filter === 'all' ? 'active' : ''}
                            onClick={() => setFilter('all')}
                        >
                            All ({logCounts.all})
                        </button>
                        <button 
                            className={filter === 'error' ? 'active error' : 'error'}
                            onClick={() => setFilter('error')}
                        >
                            Errors ({logCounts.error})
                        </button>
                        <button 
                            className={filter === 'warning' ? 'active warning' : 'warning'}
                            onClick={() => setFilter('warning')}
                        >
                            Warnings ({logCounts.warning})
                        </button>
                        <button 
                            className={filter === 'success' ? 'active success' : 'success'}
                            onClick={() => setFilter('success')}
                        >
                            Success ({logCounts.success})
                        </button>
                        <button 
                            className={filter === 'info' ? 'active info' : 'info'}
                            onClick={() => setFilter('info')}
                        >
                            Info ({logCounts.info})
                        </button>
                    </div>
                </div>

                <div className="logs-content">
                    {loading ? (
                        <div className="loading-state">
                            <div className="loading-spinner"></div>
                            <p>Loading system logs...</p>
                        </div>
                    ) : filteredLogs.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📝</div>
                            <h3>No Logs Found</h3>
                            <p>No logs match the current filter criteria.</p>
                        </div>
                    ) : (
                        <div className="logs-list">
                            {filteredLogs.map(log => (
                                <div key={log.id} className={`log-entry ${log.level}`}>
                                    <div className="log-header">
                                        <div className="log-level-category">
                                            <span className="level-icon">{getLevelIcon(log.level)}</span>
                                            <span className="category-icon">{getCategoryIcon(log.category)}</span>
                                            <span className="category-name">{log.category.toUpperCase()}</span>
                                        </div>
                                        <span className="log-timestamp">{log.timestamp}</span>
                                    </div>
                                    
                                    <div className="log-message">{log.message}</div>
                                    
                                    {log.details && (
                                        <div className="log-details">{log.details}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SystemLogs;
