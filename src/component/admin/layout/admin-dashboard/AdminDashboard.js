import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../../../config/api';
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

            const token = localStorage.getItem('userToken') || localStorage.getItem('token');
            if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            const res = await axios.get(`${BASE_URL}/api/admin/stats`);
            setDashboardData(res.data || {});
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            // Extract server message if available
            const serverMsg = error.response?.data?.msg || error.response?.data?.message || error.response?.data || error.message;
            setError(serverMsg || 'Failed to load dashboard data');

            // Handle auth issues specifically
            const status = error.response?.status;
            if (status === 401) {
                Swal.fire({ title: 'Session expired', text: 'Your session has expired or you are not authorized. Please login again.', icon: 'warning' }).then(() => {
                    // clear auth and redirect to login
                    localStorage.removeItem('userToken');
                    localStorage.removeItem('userData');
                    localStorage.removeItem('role');
                    window.location.href = '/login';
                });
                return;
            }

            if (status === 403) {
                Swal.fire({ title: 'Access denied', text: serverMsg || 'Admin access required.', icon: 'error' });
                return;
            }

            Swal.fire({
                title: 'Error',
                text: serverMsg || 'Failed to load dashboard data. Please try again.',
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
                    type: 'security_audit',
                    message: 'Security audit completed - all systems secure',
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
            case 'manage_disputes':
                Swal.fire({
                    title: 'Dispute Management',
                    text: 'Redirecting to dispute management...',
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
            'system_backup': '💾',
            'security_update': '�',
            'security_audit': '�'
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

                    <div className={`stat-card ${dashboardData.pendingDisputes > 0 ? 'warning' : 'info'} ${loading ? 'loading-pulse' : ''}`}>
                        <div className="stat-icon">⚖️</div>
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
                                onClick={() => handleQuickAction('manage_disputes')}
                                disabled={loading}
                            >
                                <span className="action-icon">⚖️</span>
                                <span className="action-text">Manage Disputes</span>
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
