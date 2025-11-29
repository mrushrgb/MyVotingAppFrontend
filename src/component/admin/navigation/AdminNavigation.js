import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AdminNavigation.css';

const AdminNavigation = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const adminRoutes = [
        { path: '/admin/dashboard', name: 'Dashboard', icon: '📊' },
        { path: '/admin/elections', name: 'Elections', icon: '🗳️' },
        { path: '/admin/disputes', name: 'Disputes', icon: '⚖️' },
        { path: '/admin/turnout', name: 'Turnout', icon: '📈' },
        { path: '/admin/logs', name: 'System Logs', icon: '📝' }
    ];

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <nav className="admin-navigation">
            <div className="admin-nav-header">
                <h2>🔧 Admin Panel</h2>
                <p>Voting System Management</p>
            </div>
            
            <div className="admin-nav-menu">
                {adminRoutes.map(route => (
                    <button
                        key={route.path}
                        className={`admin-nav-item ${location.pathname === route.path ? 'active' : ''}`}
                        onClick={() => handleNavigation(route.path)}
                    >
                        <span className="nav-icon">{route.icon}</span>
                        <span className="nav-text">{route.name}</span>
                    </button>
                ))}
            </div>

            <div className="admin-nav-footer">
                <button 
                    className="logout-btn"
                    onClick={() => navigate('/login')}
                >
                    🚪 Back to Login
                </button>
            </div>
        </nav>
    );
};

export default AdminNavigation;
