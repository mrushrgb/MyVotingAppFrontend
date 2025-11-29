import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import Swal from 'sweetalert2';
import AdminNavigation from '../../navigation/AdminNavigation';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState({
        totalElections: 0,
        activeElections: 0,
        totalVoters: 0,
        totalVotes: 0,
        pendingDisputes: 0,
        systemAlerts: 0
    });
    
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [systemStats] = useState({
        serverStatus: 'Online',
        databaseStatus: 'Connected',
        lastBackup: '2025-08-09 02:00:00',
        systemLoad: 45
    });

    useEffect(() => {
        loadDashboardData();
        loadRecentActivity();
        
        // Set up real-time updates
        const interval = setInterval(() => {
            loadDashboardData();
            loadRecentActivity();
        }, 30000); // Update every 30 seconds

        return () => clearInterval(interval);
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Mock data - replace with actual API calls
            setDashboardData({
                totalElections: 12,
                activeElections: 4,
                totalVoters: 18750,
                totalVotes: 15420,
                pendingDisputes: 3,
                systemAlerts: 1
            });
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            setError('Failed to load dashboard data');
            Swal.fire({
                title: 'Error',
                text: 'Failed to load dashboard data. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setLoading(false);
        }
    };

    const loadRecentActivity = async () => {
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Mock data - replace with actual API calls
            setRecentActivity([
                {
                    id: 1,
                    type: 'election_created',
                    message: 'New election "Presidential Election 2025" created',
                    timestamp: '2025-08-09 14:30:00',
                    user: 'Admin Sarah'
                },
                {
                    id: 2,
                    type: 'voter_registered',
                    message: '47 new voters registered today',
                    timestamp: '2025-08-09 13:45:00',
                    user: 'System'
                },
                {
                    id: 3,
                    type: 'dispute_resolved',
                    message: 'Dispute resolved for Election ID: 2025-003',
                    timestamp: '2025-08-09 12:20:00',
                    user: 'Admin John'
                },
                {
                    id: 4,
                    type: 'system_backup',
                    message: 'Automated system backup completed successfully',
                    timestamp: '2025-08-09 02:00:00',
                    user: 'System'
                },
                {
                    id: 5,
                    type: 'security_update',
                    message: 'Security protocols updated and activated',
                    timestamp: '2025-08-08 23:30:00',
                    user: 'Security System'
                }
            ]);
        } catch (error) {
            console.error('Error loading recent activity:', error);
            setError('Failed to load recent activity');
        }
    };

    const handleQuickAction = (action) => {
        switch (action) {
            case 'create_election':
                Swal.fire({
                    title: 'Create New Election',
                    text: 'Redirecting to election management...',
                    icon: 'info',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    navigate('/admin/elections');
                });
                break;
            case 'view_disputes':
                Swal.fire({
                    title: 'View Disputes',
                    text: 'Redirecting to disputes panel...',
                    icon: 'info',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    navigate('/admin/disputes');
                });
                break;
            case 'system_logs':
                Swal.fire({
                    title: 'System Logs',
                    text: 'Redirecting to system logs...',
                    icon: 'info',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    navigate('/admin/logs');
                });
                break;
            case 'backup_system':
                handleSystemBackup();
                break;
            case 'refresh_data':
                handleRefreshData();
                break;
            default:
                console.warn(`Unknown action: ${action}`);
                break;
        }
    };

    const handleSystemBackup = () => {
        Swal.fire({
            title: 'System Backup',
            text: 'Are you sure you want to initiate a manual system backup?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#667eea',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, backup now',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                // Simulate backup process
                Swal.fire({
                    title: 'Backup in Progress',
                    html: 'Please wait while the system backup is being created...<br><div class="backup-progress"></div>',
                    timer: 4000,
                    timerProgressBar: true,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                }).then(() => {
                    Swal.fire({
                        title: 'Backup Complete!',
                        html: `System backup has been successfully created<br><small>Backup ID: BK-${Date.now()}</small>`,
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                    // Refresh dashboard data after backup
                    loadDashboardData();
                });
            }
        });
    };

    const handleRefreshData = () => {
        Swal.fire({
            title: 'Refreshing Data',
            text: 'Please wait while we update the dashboard...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        Promise.all([loadDashboardData(), loadRecentActivity()]).then(() => {
            Swal.close();
            Swal.fire({
                title: 'Data Refreshed!',
                text: 'Dashboard data has been updated successfully.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
        });
    };

    const getActivityIcon = (type) => {
        const icons = {
            'election_created': '📊',
            'voter_registered': '👥',
            'dispute_submitted': '⚠️',
            'dispute_resolved': '✅',
            'system_backup': '💾',
            'security_update': '🔒'
        };
        return icons[type] || '📋';
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Online':
            case 'Connected':
                return '#28a745';
            case 'Warning':
                return '#ffc107';
            case 'Offline':
            case 'Error':
                return '#dc3545';
            default:
                return '#6c757d';
        }
    };

    return (
        <div className="app-layout">
            <AdminNavigation />
            <div className="admin-dashboard-container">
                {error && (
                    <div className="error-banner">
                        <span>⚠️ {error}</span>
                        <button onClick={() => setError(null)}>✕</button>
                    </div>
                )}
                
                <div className="dashboard-header">
                    <h1>🔧 Admin Dashboard</h1>
                    <p>Welcome back! Here's what's happening with your voting system today.</p>
                    <div className="dashboard-actions">
                        <button 
                            className="refresh-btn"
                            onClick={() => handleQuickAction('refresh_data')}
                            disabled={loading}
                        >
                            <span className={loading ? 'spinning' : ''}>🔄</span>
                            {loading ? 'Refreshing...' : 'Refresh Data'}
                        </button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="stats-grid">
                    <div className={`stat-card primary ${loading ? 'loading-pulse' : ''}`}>
                        <div className="stat-icon">🗳️</div>
                        <div className="stat-content">
                            <h3>{loading ? '...' : dashboardData.totalElections}</h3>
                            <p>Total Elections</p>
                        </div>
                    </div>

                    <div className={`stat-card success ${loading ? 'loading-pulse' : ''}`}>
                        <div className="stat-icon">🟢</div>
                        <div className="stat-content">
                            <h3>{loading ? '...' : dashboardData.activeElections}</h3>
                            <p>Active Elections</p>
                        </div>
                    </div>

                    <div className={`stat-card info ${loading ? 'loading-pulse' : ''}`}>
                        <div className="stat-icon">👥</div>
                        <div className="stat-content">
                            <h3>{loading ? '...' : dashboardData.totalVoters.toLocaleString()}</h3>
                            <p>Registered Voters</p>
                        </div>
                    </div>

                    <div className={`stat-card warning ${loading ? 'loading-pulse' : ''}`}>
                        <div className="stat-icon">📊</div>
                        <div className="stat-content">
                            <h3>{loading ? '...' : dashboardData.totalVotes.toLocaleString()}</h3>
                            <p>Total Votes Cast</p>
                        </div>
                    </div>

                    <div className={`stat-card ${dashboardData.pendingDisputes > 0 ? 'danger' : 'success'} ${loading ? 'loading-pulse' : ''}`}>
                        <div className="stat-icon">{dashboardData.pendingDisputes > 0 ? '⚠️' : '✅'}</div>
                        <div className="stat-content">
                            <h3>{loading ? '...' : dashboardData.pendingDisputes}</h3>
                            <p>Pending Disputes</p>
                        </div>
                    </div>

                    <div className={`stat-card ${dashboardData.systemAlerts > 0 ? 'warning' : 'secondary'} ${loading ? 'loading-pulse' : ''}`}>
                        <div className="stat-icon">{dashboardData.systemAlerts > 0 ? '🔔' : '🔕'}</div>
                        <div className="stat-content">
                            <h3>{loading ? '...' : dashboardData.systemAlerts}</h3>
                            <p>System Alerts</p>
                        </div>
                    </div>
                </div>

                <div className="dashboard-content">
                    {/* Quick Actions */}
                    <div className="dashboard-section">
                        <h2>⚡ Quick Actions</h2>
                        <div className="quick-actions-grid">
                            <button 
                                className="quick-action-btn create"
                                onClick={() => handleQuickAction('create_election')}
                                disabled={loading}
                            >
                                <span className="action-icon">➕</span>
                                <span className="action-text">Create Election</span>
                            </button>

                            <button 
                                className="quick-action-btn disputes"
                                onClick={() => handleQuickAction('view_disputes')}
                                disabled={loading}
                            >
                                <span className="action-icon">⚖️</span>
                                <span className="action-text">View Disputes</span>
                                {dashboardData.pendingDisputes > 0 && (
                                    <span className="action-badge">{dashboardData.pendingDisputes}</span>
                                )}
                            </button>

                            <button 
                                className="quick-action-btn logs"
                                onClick={() => handleQuickAction('system_logs')}
                                disabled={loading}
                            >
                                <span className="action-icon">📝</span>
                                <span className="action-text">System Logs</span>
                            </button>

                            <button 
                                className="quick-action-btn backup"
                                onClick={() => handleQuickAction('backup_system')}
                                disabled={loading}
                            >
                                <span className="action-icon">💾</span>
                                <span className="action-text">Backup System</span>
                            </button>
                        </div>
                    </div>

                    <div className="dashboard-row">
                        {/* Recent Activity */}
                        <div className="dashboard-section activity-section">
                            <h2>📋 Recent Activity</h2>
                            <div className="activity-list">
                                {loading ? (
                                    <div className="loading-state">
                                        <div className="loading-spinner"></div>
                                        <p>Loading recent activity...</p>
                                    </div>
                                ) : recentActivity.length === 0 ? (
                                    <div className="empty-state">
                                        <div className="empty-icon">📭</div>
                                        <p>No recent activity to display</p>
                                    </div>
                                ) : (
                                    recentActivity.map(activity => (
                                        <div key={activity.id} className="activity-item interactive-hover">
                                            <div className="activity-icon">
                                                {getActivityIcon(activity.type)}
                                            </div>
                                            <div className="activity-content">
                                                <p className="activity-message">{activity.message}</p>
                                                <div className="activity-meta">
                                                    <span className="activity-user">{activity.user}</span>
                                                    <span className="activity-time">{activity.timestamp}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* System Status */}
                        <div className="dashboard-section status-section">
                            <h2>🔧 System Status</h2>
                            <div className="status-list">
                                <div className="status-item interactive-hover">
                                    <span className="status-label">🖥️ Server Status</span>
                                    <span 
                                        className="status-value"
                                        style={{ color: getStatusColor(systemStats.serverStatus) }}
                                    >
                                        {systemStats.serverStatus}
                                    </span>
                                </div>

                                <div className="status-item interactive-hover">
                                    <span className="status-label">🗄️ Database</span>
                                    <span 
                                        className="status-value"
                                        style={{ color: getStatusColor(systemStats.databaseStatus) }}
                                    >
                                        {systemStats.databaseStatus}
                                    </span>
                                </div>

                                <div className="status-item interactive-hover">
                                    <span className="status-label">💾 Last Backup</span>
                                    <span className="status-value">{systemStats.lastBackup}</span>
                                </div>

                                <div className="status-item interactive-hover">
                                    <span className="status-label">⚡ System Load</span>
                                    <div className="load-indicator">
                                        <div className="load-bar">
                                            <div 
                                                className="load-fill"
                                                style={{ 
                                                    width: `${systemStats.systemLoad}%`,
                                                    backgroundColor: systemStats.systemLoad > 80 ? '#dc3545' : 
                                                                   systemStats.systemLoad > 60 ? '#ffc107' : '#28a745'
                                                }}
                                            ></div>
                                        </div>
                                        <span className="load-percentage">{systemStats.systemLoad}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
