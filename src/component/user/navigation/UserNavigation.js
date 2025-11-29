import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './UserNavigation.css';

const UserNavigation = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const userRoutes = [
        { path: '/voter/dashboard', name: 'Dashboard', icon: '🏠' },
        { path: '/voter/eligibility', name: 'Eligibility Check', icon: '✅' },
        { path: '/voter/candidates', name: 'Candidates', icon: '👥' },
        { path: '/voter/voting', name: 'Vote Now', icon: '🗳️' },
        { path: '/voter/status', name: 'Voting Status', icon: '📊' }
    ];

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <nav className="user-navigation">
            <div className="user-nav-header">
                <h2>🗳️ Voter Portal</h2>
                <p>Secure Digital Voting</p>
            </div>
            
            <div className="user-nav-menu">
                {userRoutes.map(route => (
                    <button
                        key={route.path}
                        className={`user-nav-item ${location.pathname === route.path ? 'active' : ''}`}
                        onClick={() => handleNavigation(route.path)}
                    >
                        <span className="nav-icon">{route.icon}</span>
                        <span className="nav-text">{route.name}</span>
                    </button>
                ))}
            </div>

            <div className="user-nav-info">
                <div className="voter-info">
                    <div className="voter-avatar">👤</div>
                    <div className="voter-details">
                        <p className="voter-name">John Doe</p>
                        <p className="voter-id">ID: VTR123456</p>
                    </div>
                </div>
            </div>

            <div className="user-nav-footer">
                <div className="help-section">
                    <button className="help-btn">
                        ❓ Help & Support
                    </button>
                </div>
                <button 
                    className="logout-btn"
                    onClick={() => navigate('/login')}
                >
                    🚪 Logout
                </button>
            </div>
        </nav>
    );
};

export default UserNavigation;
