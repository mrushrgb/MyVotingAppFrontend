import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

import { BASE_URL } from '../../../config/api';

const LoginPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [faceAuthLoading, setFaceAuthLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        loginAs: 'user',
        adminSecretKey: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // biometric support removed — no face recognition checks
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => {
                const updated = { ...prev };
                delete updated[name];
                return updated;
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long';
        }

        // Validate admin secret key if logging in as admin
        if (formData.loginAs === 'admin' && !formData.adminSecretKey) {
            newErrors.adminSecretKey = 'Admin Secret Key is required for admin login';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setLoading(true);
        try {
            // Prepare login payload
            const loginPayload = {
                email: formData.email,
                password: formData.password
            };

            // Add admin secret key if logging in as admin
            if (formData.loginAs === 'admin') {
                loginPayload.adminSecretKey = formData.adminSecretKey;
            }

            const response = await axios.post(`${BASE_URL}/api/auth/login`, loginPayload);

            if (response.data?.token) {
                const { token, user } = response.data;
                // store token and user data consistently
                localStorage.setItem('token', token);
                localStorage.setItem('userData', JSON.stringify(user));
                localStorage.setItem('id', user.id || user._id);
                localStorage.setItem('role', user.role);

                // notify other components/tabs that user data changed
                try {
                    window.dispatchEvent(new Event('userDataUpdated'));
                } catch (err) {
                    // ignore
                }

                // set default Authorization header for subsequent requests
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                // route based on role
                if (user.role && user.role.toLowerCase() === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/voter/dashboard');
                }
                // short-circuit to avoid the navigate('/dashboard') below
                setLoading(false);
                return;
            }

            await Swal.fire({
                icon: 'success',
                title: 'Login Successful',
                text: 'Welcome back to the secure voting platform.',
                confirmButtonColor: '#10b981',
                background: 'rgba(15, 23, 42, 0.98)',
                color: '#e5e7eb',
                customClass: {
                    popup: 'glass-popup',
                },
            });

            // fallback route if no user object returned
            navigate('/voter/dashboard');
        } catch (error) {
            console.error('Login error:', error);

            const serverValidation = error.response?.data?.errors?.[0]?.msg;
            const serverMsg = serverValidation || error.response?.data?.msg || error.response?.data?.message;
            const errorMessage = serverMsg || error.message || 'Login failed. Please try again.';

            await Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: errorMessage,
                confirmButtonColor: '#ef4444',
                background: 'rgba(15, 23, 42, 0.98)',
                color: '#e5e7eb',
                customClass: {
                    popup: 'glass-popup',
                },
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="cyber-grid-background">
                <div className="grid-lines"></div>
                <div className="cyber-orbit orbit-1"></div>
                <div className="cyber-orbit orbit-2"></div>
                <div className="cyber-orbit orbit-3"></div>
                <div className="floating-orb orb-1"></div>
                <div className="floating-orb orb-2"></div>
                <div className="floating-orb orb-3"></div>
            </div>

            <div className="auth-page-wrapper container">
                <div className="row justify-content-center align-items-center min-vh-100">
                    {/* Left Column - Hero Section */}
                    <div className="col-lg-6 d-none d-lg-flex">
                        <div className="hero-section">
                            <div className="hero-content">
                                <div className="hero-icon">
                                    🗳️
                                </div>
                                <h2>Secure Voting Platform</h2>
                                {/* FIXED: removed biometric promise */}
                                <p>
                                    Experience the future of democratic participation with our secure authentication and transparent voting system.
                                </p>
                                
                                <div className="feature-list">
                                    <div className="feature-item">
                                        <div className="feature-icon">🔒</div>
                                        <span>End-to-End Encryption</span>
                                    </div>
                                    <div className="feature-item">
                                        <div className="feature-icon">👤</div>
                                        {/* FIXED: no longer says “Biometric Authentication” */}
                                        <span>Secure Authentication</span>
                                    </div>
                                    <div className="feature-item">
                                        <div className="feature-icon">🌐</div>
                                        <span>Global-Scale Infrastructure</span>
                                    </div>
                                </div>

                                <div className="hero-stats">
                                    <div className="stat-item">
                                        <span className="stat-value">99.99%</span>
                                        <span className="stat-label">System Uptime</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-value">1M+</span>
                                        <span className="stat-label">Votes Processed</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-value">256-bit</span>
                                        <span className="stat-label">Encryption</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Auth Card */}
                    <div className="col-lg-6 col-xl-5 col-md-8">
                        <div className="auth-card">
                            <div className="auth-card-header">
                                <div className="platform-badge">
                                    <span className="badge-dot"></span>
                                    Voting Platform
                                </div>
                                <div className="header-text">
                                    <h1>Welcome back</h1>
                                    <p>Enter your credentials to securely access your voting dashboard.</p>
                                </div>
                            </div>

                            <div className="auth-card-body">
                                <form onSubmit={handleSubmit} className="auth-form">
                                    {/* Email Field */}
                                    <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
                                        <label htmlFor="email">
                    
                                        </label>
                                        <div className="input-wrapper">

                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                placeholder="Enter the your email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                disabled={loading || faceAuthLoading}
                                                autoComplete="email"
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="error-message">
                                                <span className="error-dot"></span>
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    {/* Password Field */}
                                    <div className={`form-group ${errors.password ? 'has-error' : ''}`}>
                                        <label htmlFor="password">
                                        </label>
                                        <div className="input-wrapper">
                                            <input
                                                type="password"
                                                id="password"
                                                name="password"
                                                placeholder="Enter your password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                disabled={loading || faceAuthLoading}
                                                autoComplete="current-password"
                                            />
                                        </div>
                                        {errors.password && (
                                            <p className="error-message">
                                                <span className="error-dot"></span>
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>

                                    {/* Login As Role Selection */}
                                    <div className="form-group">
                                        <label htmlFor="loginAs">
                                            Login As
                                        </label>
                                        <div className="input-wrapper">
                                            <select
                                                id="loginAs"
                                                name="loginAs"
                                                value={formData.loginAs}
                                                onChange={handleInputChange}
                                                disabled={loading || faceAuthLoading}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px 16px',
                                                    fontSize: '14px',
                                                    border: '1px solid #e0e0e0',
                                                    borderRadius: '8px',
                                                    backgroundColor: '#fff',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <option value="user">Voter</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Admin Secret Key Field - Only shown when Admin is selected */}
                                    {formData.loginAs === 'admin' && (
                                        <div className={`form-group ${errors.adminSecretKey ? 'has-error' : ''}`}>
                                            <label htmlFor="adminSecretKey">
                                                Admin Secret Key
                                            </label>
                                            <div className="input-wrapper">
                                                <input
                                                    type="password"
                                                    id="adminSecretKey"
                                                    name="adminSecretKey"
                                                    placeholder="Enter admin secret key"
                                                    value={formData.adminSecretKey}
                                                    onChange={handleInputChange}
                                                    disabled={loading || faceAuthLoading}
                                                    autoComplete="off"
                                                />
                                            </div>
                                            {errors.adminSecretKey && (
                                                <p className="error-message">
                                                    <span className="error-dot"></span>
                                                    {errors.adminSecretKey}
                                                </p>
                                            )}
                                            <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                                Contact your organization for the admin secret key
                                            </p>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className={`primary-button ${loading ? 'loading' : ''}`}
                                        disabled={loading || faceAuthLoading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="button-spinner"></span>
                                                Authenticating...
                                            </>
                                        ) : (
                                            <>
                                            <span>Sign in</span>
                                            </>
                                        )}
                                    </button>
                                </form>

                                {/* Divider */}
                                <div className="auth-divider">
                                    <span>or</span>
                                </div>

                                {/* Secondary Links */}
                                <div className="auth-footer">
                                    <p className="signup-prompt">
                                        Create an account?{' '}
                                        <button
                                            type="button"
                                            className="link-button primary-link"
                                            onClick={() => navigate('/register')}
                                            disabled={loading || faceAuthLoading}
                                        >
                                            Register
                                        </button>
                                    </p>
                                </div>
                            </div>

                
                        </div>
                    </div>
                    {/* End Right Column */}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
