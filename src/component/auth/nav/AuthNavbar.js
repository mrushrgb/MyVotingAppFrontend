import React from 'react';
import './AuthNav.css';

const AuthNavbar = () => {
    return (
        <nav className="auth-navbar">
            <div className="container">
                <div className="navbar-brand d-flex align-items-center">
                    <div className="brand-icon me-3">🗳️</div>
                    <div>
                        <h3 className="mb-0">SecureVote</h3>
                        <small>Digital Democracy Platform</small>
                    </div>
                </div>

                <div className="nav-actions">
                    <div className="d-flex align-items-center">
                        <div className="status-indicator me-2"></div>
                        <span className="text-white-75">System Online</span>
                    </div>
                    <a href="#help" className="help-btn">Help &amp; Support</a>
                </div>
            </div>
        </nav>
    );
};

export default AuthNavbar;
