import React from 'react';
import './AuthNav.css';

const AuthFooter = () => {
    return (
        <footer className="auth-footer">
            <div className="container">
                <div className="row">
                    <div className="col-lg-4 col-md-6 mb-4">
                        <div className="footer-brand mb-3">
                            <div className="d-flex align-items-center">
                                <div className="brand-icon me-3">🗳️</div>
                                <h5 className="mb-0">SecureVote</h5>
                            </div>
                            <p className="mt-3 mb-0">
                                Empowering democratic participation through secure,
                                transparent, and accessible digital voting solutions.
                            </p>
                        </div>
                        
                        <div className="security-badges">
                            <h6>Security &amp; Compliance</h6>
                            <div className="d-flex flex-wrap gap-2">
                                <span className="badge bg-success d-flex align-items-center">SSL Secured</span>
                                <span className="badge bg-primary d-flex align-items-center">Biometric Auth</span>
                                <span className="badge bg-warning d-flex align-items-center">Verified System</span>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-2 col-md-6 mb-4">
                        <h6>Quick Links</h6>
                        <ul className="list-unstyled">
                            <li className="mb-2"><a href="#privacy" className="hover-link">Privacy Policy</a></li>
                            <li className="mb-2"><a href="#terms" className="hover-link">Terms of Service</a></li>
                            <li className="mb-2"><a href="#help" className="hover-link">Help</a></li>
                            <li className="mb-2"><a href="#contact" className="hover-link">Contact Us</a></li>
                        </ul>
                    </div>

                    <div className="col-lg-3 col-md-6 mb-4">
                        <h6>Support Center</h6>
                        <div className="contact-info">
                            <div className="mb-3 p-3 rounded" style={{ background: 'rgba(255,255,255,0.02)' }}>
                                <div className="d-flex align-items-center mb-2">
                                    <i className="fas fa-phone text-success me-2"></i>
                                    <span>24/7 Helpline</span>
                                </div>
                                <a href="tel:+1-800-VOTE-NOW" className="text-muted">+1-800-VOTE-NOW</a>
                            </div>
                            <div className="mb-3 p-3 rounded" style={{ background: 'rgba(255,255,255,0.02)' }}>
                                <div className="d-flex align-items-center mb-2">
                                    <i className="fas fa-envelope text-primary me-2"></i>
                                    <span>Email Support</span>
                                </div>
                                <a href="mailto:support@securevote.com" className="text-muted">support@securevote.com</a>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6 mb-4">
                        <h6>Stay Connected</h6>
                        <p className="mb-3">Follow us for system updates and democratic innovation news.</p>
                        <div className="social-links mb-4">
                            <a href="#facebook" className="social-link me-3"> <i className="fab fa-facebook-f"></i> </a>
                            <a href="#twitter" className="social-link me-3"> <i className="fab fa-twitter"></i> </a>
                            <a href="#linkedin" className="social-link"> <i className="fab fa-linkedin-in"></i> </a>
                        </div>

                        <div className="system-status p-3 rounded" style={{ background: 'rgba(255,255,255,0.02)' }}>
                            <div className="d-flex align-items-center">
                                <div className="status-dot me-2" style={{ width: '8px', height: '8px', background: '#4ade80', borderRadius: '50%' }}></div>
                                <span>All Systems Operational</span>
                            </div>
                            <small className="text-muted">Last updated: {new Date().toLocaleTimeString()}</small>
                        </div>
                    </div>
                </div>

                <div className="bottom-bar">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <p className="mb-0">&copy; {new Date().getFullYear()} Voting System. All rights reserved.</p>
                        </div>
                        <div className="col-md-6 text-md-end">
                            <p className="mb-0">Version 2.1.0 | Built with ❤️ for Democracy</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default AuthFooter;
