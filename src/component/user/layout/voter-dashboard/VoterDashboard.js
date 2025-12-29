import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import { BASE_URL } from '../../../../config/api';
import './VoterDashboard.css';
import UserNavigation from '../../navigation/UserNavigation';

const VoterDashboard = () => {
    const navigate = useNavigate();

    // Dynamic user data that can be updated
    const [voterData, setVoterData] = useState({
        name: 'Loading...',
        voterId: 'Loading...',
        constituency: 'Loading...',
        isEligible: false,
        hasVoted: false
    });

    // Load user data from localStorage (set at login/register) or defaults
    const getUserData = () => {
        const savedUserData = localStorage.getItem('userData') || localStorage.getItem('voterData');
        if (savedUserData) {
            try {
                const parsed = JSON.parse(savedUserData);
                // normalize fields expected by dashboard
                return {
                    name: parsed.name || parsed.auth || 'Voter',
                    voterId: parsed.voterId || parsed.id || parsed._id || 'VTR' + Math.floor(100000 + Math.random() * 900000),
                    constituency: parsed.constituency || 'Unknown',
                    isEligible: typeof parsed.isEligible === 'boolean' ? parsed.isEligible : false,
                    hasVoted: typeof parsed.hasVoted === 'boolean' ? parsed.hasVoted : false,
                    phoneNumber: parsed.phoneNumber,
                    address: parsed.address,
                    dob: parsed.dob
                };
            } catch (e) {
                console.warn('Invalid saved userData', e);
            }
        }

        return {
            name: 'Jane Smith',
            voterId: 'VTR987654321',
            constituency: 'Central District',
            isEligible: false,
            hasVoted: false
        };
    };

    const updateUserData = (newData) => {
        setVoterData((prev) => {
            const updated = { ...prev, ...newData };
            localStorage.setItem('voterData', JSON.stringify(updated));
            return updated;
        });
    };

    useEffect(() => {
        const userData = getUserData();

        // if dob exists and isEligible is absent, compute eligibility based on age >= 18
        if (userData.dob && typeof userData.isEligible !== 'boolean') {
            try {
                const dobDate = new Date(userData.dob);
                const ageMs = Date.now() - dobDate.getTime();
                const age = Math.floor(ageMs / (1000 * 60 * 60 * 24 * 365.25));
                userData.isEligible = age >= 18;
            } catch (e) {
                userData.isEligible = false;
            }
        }

        setVoterData(userData);
    }, []);

    // Active elections count
    const [availableElectionsCount, setAvailableElectionsCount] = useState(null);
    const [activeElections, setActiveElections] = useState([]);

    useEffect(() => {
        let mounted = true;

        const loadCounts = async () => {
            try {
                const token = localStorage.getItem('userToken') || localStorage.getItem('token');
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                // Get ALL elections, not just active ones
                const res = await axios.get(`${BASE_URL}/api/user/elections`, { headers });

                if (!mounted) return;
                setAvailableElectionsCount((res.data || []).length);
                // also compute a lightweight elections list showing vote-lock status
                try {
                    const userId = localStorage.getItem('id') || null;
                    const items = (res.data || []).map(e => {
                        const base = { ...e, id: e._id || e.id };
                        base.userHasVoted = false;
                        // fast-path: check local votedElections list
                        try {
                            const votedList = JSON.parse(localStorage.getItem('votedElections') || '[]');
                            if (Array.isArray(votedList) && votedList.includes(String(base.id))) {
                                base.userHasVoted = true;
                            }
                        } catch (err) {
                            // ignore
                        }

                        if (!base.userHasVoted && userId) {
                            try {
                                const votesArr = base.votes || [];
                                const localIdStr = String(userId);
                                base.userHasVoted = votesArr.some(v => {
                                    let voteUserId = '';
                                    if (!v) return false;
                                    if (v.userId) {
                                        if (typeof v.userId === 'string') voteUserId = v.userId;
                                        else if (typeof v.userId === 'object') {
                                            if (typeof v.userId.toString === 'function') voteUserId = v.userId.toString();
                                            else if (v.userId._id) voteUserId = String(v.userId._id);
                                            else voteUserId = JSON.stringify(v.userId);
                                        } else {
                                            voteUserId = String(v.userId);
                                        }
                                    } else if (v.user) {
                                        voteUserId = String(v.user._id || v.user.id || '');
                                    }
                                    return voteUserId && voteUserId === localIdStr;
                                });
                            } catch (e) {
                                base.userHasVoted = false;
                            }
                        }
                        return base;
                    });

                    if (mounted) setActiveElections(items);
                } catch (e) {
                    // ignore
                }
            } catch (err) {
                console.warn('Could not fetch active elections count', err?.message || err);
                if (mounted) {
                    setAvailableElectionsCount((prev) => (prev === null ? 0 : prev));
                }
            }
        };

        loadCounts();
        const interval = setInterval(loadCounts, 30000);

        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, []);

    // Edit voter info
    const handleChangeUser = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Update Voter Information',
            html: `
                <div style="text-align: left;">
                    <label for="swal-input1" style="display: block; margin-bottom: 5px; font-weight: bold;">Full Name:</label>
                    <input id="swal-input1" class="swal2-input" value="${voterData.name}" placeholder="Enter full name">
                    
                    <label for="swal-input2" style="display: block; margin-bottom: 5px; font-weight: bold; margin-top: 15px;">Voter ID:</label>
                    <input id="swal-input2" class="swal2-input" value="${voterData.voterId}" placeholder="Enter voter ID">
                    
                    <label for="swal-input3" style="display: block; margin-bottom: 5px; font-weight: bold; margin-top: 15px;">Constituency:</label>
                    <input id="swal-input3" class="swal2-input" value="${voterData.constituency}" placeholder="Enter constituency">
                    
                    <div style="margin-top: 15px;">
                        <label style="font-weight: bold;">
                            <input type="checkbox" id="swal-checkbox1" ${voterData.isEligible ? 'checked' : ''} style="margin-right: 8px;">
                            Eligible to vote
                        </label>
                    </div>
                    
                    <div style="margin-top: 10px;">
                        <label style="font-weight: bold;">
                            <input type="checkbox" id="swal-checkbox2" ${voterData.hasVoted ? 'checked' : ''} style="margin-right: 8px;">
                            Has voted
                        </label>
                    </div>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Update Information',
            cancelButtonText: 'Cancel',
            preConfirm: () => {
                const name = document.getElementById('swal-input1').value;
                const voterId = document.getElementById('swal-input2').value;
                const constituency = document.getElementById('swal-input3').value;
                const isEligible = document.getElementById('swal-checkbox1').checked;
                const hasVoted = document.getElementById('swal-checkbox2').checked;

                if (!name || !voterId || !constituency) {
                    Swal.showValidationMessage('Please fill in all fields');
                    return false;
                }

                return {
                    name,
                    voterId,
                    constituency,
                    isEligible,
                    hasVoted
                };
            }
        });

        if (formValues) {
            updateUserData(formValues);
            Swal.fire({
                title: 'Success!',
                text: 'Voter information has been updated successfully.',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        }
    };

    const [notifications] = useState([
        {
            id: 1,
            title: 'Election Reminder',
            message: 'Presidential Election voting is now open. Exercise your right to vote!',
            type: 'info',
            timestamp: '2 hours ago'
        }
    ]);

    const quickActions = [
        {
            title: 'Check Eligibility',
            description: 'Verify your voting eligibility status',
            icon: '✓',
            color: 'primary',
            action: () => navigate('/voter/eligibility')
        },
        {
            title: 'Vote Now',
            description: 'Cast your vote in available elections',
            icon: '🗳️',
            color: 'success',
            action: () => navigate('/voter/voting'),
            disabled: !voterData.isEligible
        },
        {
            title: 'View Candidates',
            description: 'Learn about candidates and their profiles',
            icon: '👥',
            color: 'info',
            action: () => navigate('/voter/candidates')
        },
        {
            title: 'Voting Status',
            description: 'Check your voting history and status',
            icon: '📊',
            color: 'warning',
            action: () => navigate('/voter/status')
        }
    ];

    const getNotificationColor = (type) => {
        const colors = {
            info: 'primary',
            success: 'success',
            warning: 'warning',
            danger: 'danger'
        };
        return colors[type] || 'primary';
    };

    const getNotificationIcon = (type) => {
        const icons = {
            info: <i className="fas fa-info-circle" aria-hidden="true"></i>,
            success: <i className="fas fa-check-circle" aria-hidden="true"></i>,
            warning: <i className="fas fa-exclamation-triangle" aria-hidden="true"></i>,
            danger: <i className="fas fa-times-circle" aria-hidden="true"></i>
        };
        return icons[type] || icons.info;
    };

    return (
        <div className="app-layout voter-app-layout">
            {/* Left sidebar */}
            <UserNavigation />

            {/* Main content */}
            <main className="voter-dashboard">
                <div className="container-fluid py-4">
                    {/* Header */}
                    <section className="dashboard-header card-responsive fade-in">
                        <div className="row align-items-center">
                            <div className="col-12 col-lg-8 mb-3 mb-lg-0">
                                <div className="d-flex align-items-center mb-3 dashboard-header-main">
                                    <div className="dashboard-avatar" aria-hidden="true">
                                        <i className="fas fa-user"></i>
                                    </div>

                                    <div>
                                        <h1 className="dashboard-title mb-2">
                                            <i className="fas fa-vote-yea me-2 dashboard-title-icon"></i>
                                            Voter Panel
                                            {availableElectionsCount !== null && (
                                                <span className="badge dashboard-elections-badge ms-2">
                                                    {availableElectionsCount} Available
                                                </span>
                                            )}
                                        </h1>

                                        <p className="dashboard-subtitle mb-1">
                                            Welcome back, <strong>{voterData.name}</strong>
                                        </p>

                                        <p className="mb-0 dashboard-id-text">
                                            <i className="fas fa-id-card me-1" aria-hidden="true"></i>
                                            ID: {voterData.voterId}
                                        </p>
                                    </div>
                                </div>

                                <div className="voter-info d-flex flex-wrap gap-2">
                                    <span className="badge voter-info-badge">
                                        <i className="fas fa-map-marker-alt me-1" aria-hidden="true"></i>
                                        <span className="d-none d-sm-inline">Constituency: </span>
                                        {voterData.constituency}
                                    </span>

                                    <span
                                        className={`badge voter-info-badge ${
                                            voterData.isEligible ? 'bg-success' : 'bg-danger'
                                        }`}
                                    >
                                        <i
                                            className={`fas ${
                                                voterData.isEligible ? 'fa-check-circle' : 'fa-times-circle'
                                            } me-1`}
                                            aria-hidden="true"
                                        ></i>
                                        {voterData.isEligible ? 'Eligible' : 'Not Eligible'}
                                    </span>

                                    <span
                                        className={`badge voter-info-badge ${
                                            voterData.hasVoted ? 'bg-success' : 'bg-warning'
                                        }`}
                                    >
                                        <i
                                            className={`fas ${
                                                voterData.hasVoted ? 'fa-vote-yea' : 'fa-clock'
                                            } me-1`}
                                            aria-hidden="true"
                                        ></i>
                                        {voterData.hasVoted ? 'Voted' : 'Pending'}
                                    </span>
                                </div>
                            </div>

                            <div className="col-12 col-lg-4 text-center text-lg-end">
                                <div className="d-flex gap-2 justify-content-center justify-content-lg-end flex-wrap">
                                    <button
                                        className="btn btn-outline-light btn-edit-profile"
                                        onClick={handleChangeUser}
                                        title="Update voter information"
                                        type="button"
                                    >
                                        <i className="fas fa-user-edit me-2" aria-hidden="true"></i>
                                        <span className="d-none d-sm-inline">Edit Profile</span>
                                        <span className="d-inline d-sm-none">Edit</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Quick Actions */}
                    <section className="quick-actions-section fade-in mb-4" aria-label="Quick actions">
                        <div className="section-header">
                            <h3>
                                <i className="fas fa-bolt me-2" aria-hidden="true"></i>
                                Quick Actions
                            </h3>
                            <p className="section-subtitle">
                                Access the most important actions in just one tap.
                            </p>
                        </div>

                        <div className="row g-3">
                            {quickActions.map((action, index) => (
                                <div key={index} className="col-12 col-sm-6 col-lg-3">
                                    <button
                                        type="button"
                                        className={`quick-action-card card-elevated ${
                                            action.disabled ? 'quick-action-disabled' : ''
                                        }`}
                                        onClick={!action.disabled ? action.action : undefined}
                                        disabled={action.disabled}
                                        style={{ animationDelay: `${index * 0.05}s` }}
                                    >
                                        <div className={`card-icon bg-${action.color}`}>
                                            <span aria-hidden="true">{action.icon}</span>
                                        </div>
                                        <div className="quick-action-text">
                                            <h5>{action.title}</h5>
                                            <p>{action.description}</p>
                                        </div>

                                        {action.disabled && (
                                            <div className="disabled-overlay">
                                                <span>Not Available</span>
                                            </div>
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Active Elections (show lock status if user already voted) */}
                    <section className="active-elections-section fade-in mb-4" aria-label="Active elections">
                        <div className="section-header">
                            <h3>
                                <i className="fas fa-vote-yea me-2" aria-hidden="true"></i>
                                Active Elections
                            </h3>
                            <p className="section-subtitle">See which active elections are available or locked based on your voting history.</p>
                        </div>

                        <div className="row g-3">
                            {(activeElections || []).length === 0 ? (
                                <div className="col-12">
                                    <div className="card card-elevated p-3 text-muted">No active elections at the moment.</div>
                                </div>
                            ) : (
                                activeElections.map((election) => (
                                    <div key={election.id} className="col-12 col-md-6 col-lg-4">
                                        <div className={`election-summary-card card-elevated ${election.userHasVoted ? 'locked' : ''}`}>
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div>
                                                    <h5 className="mb-1">{election.title}</h5>
                                                    <p className="mb-0 text-muted small">{election.description}</p>
                                                </div>
                                                <div>
                                                    {election.userHasVoted ? (
                                                        <span className="badge bg-secondary">Locked</span>
                                                    ) : (
                                                        <span className="badge bg-success">Open</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mt-3 d-flex justify-content-between align-items-center">
                                                <small className="text-muted">Positions: {(election.positions || []).length}</small>
                                                <div>
                                                    <button className="btn btn-sm btn-outline-light me-2" onClick={() => navigate('/voter/status')}>Status</button>
                                                    <button className="btn btn-sm btn-primary" onClick={() => navigate('/voter/voting')} disabled={election.userHasVoted}>Vote</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>

                    {/* Notifications */}
                    <section className="notifications-section fade-in mb-4" aria-label="Recent notifications">
                        <div className="section-header">
                            <h3>
                                <i className="fas fa-bell me-2" aria-hidden="true"></i>
                                Recent Notifications
                            </h3>
                            <p className="section-subtitle">
                                Stay informed about important updates and election events.
                            </p>
                        </div>

                        <div className="notifications-list">
                            {notifications.length === 0 ? (
                                <div className="notification-empty text-muted">
                                    <i className="fas fa-inbox me-2" aria-hidden="true"></i>
                                    No new notifications.
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <article
                                        key={notification.id}
                                        className={`notification-item card-elevated notification-${notification.type}`}
                                    >
                                        <div className="notification-content">
                                            <h5>{notification.title}</h5>
                                            <p>{notification.message}</p>
                                            <small className="text-muted">
                                                <i className="fas fa-clock me-1" aria-hidden="true"></i>
                                                {notification.timestamp}
                                            </small>
                                        </div>
                                        <div
                                            className={`notification-icon text-${getNotificationColor(
                                                notification.type
                                            )}`}
                                            aria-hidden="true"
                                        >
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                    </article>
                                ))
                            )}
                        </div>
                    </section>

                    {/* Accessibility */}
                    <section className="accessibility-section fade-in" aria-label="Accessibility features">
                        <div className="section-header">
                            <h3>
                                <i className="fas fa-universal-access me-2" aria-hidden="true"></i>
                                Accessibility Features
                            </h3>
                            <p className="section-subtitle">
                                Customize your experience to match your accessibility needs.
                            </p>
                        </div>

                        <div className="row g-3">
                            <div className="col-12 col-sm-6 col-lg-4">
                                <button
                                    type="button"
                                    className="accessibility-card card-elevated"
                                    onClick={() => navigate('/voter/accessibility')}
                                >
                                    <i className="fas fa-text-height accessibility-icon" aria-hidden="true"></i>
                                    <h5>Text Size</h5>
                                    <p>Adjust text size and contrast</p>
                                </button>
                            </div>

                            <div className="col-12 col-sm-6 col-lg-4">
                                <button
                                    type="button"
                                    className="accessibility-card card-elevated"
                                    onClick={() => navigate('/voter/accessibility')}
                                >
                                    <i className="fas fa-volume-up accessibility-icon" aria-hidden="true"></i>
                                    <h5>Voice Control</h5>
                                    <p>Navigate using voice commands</p>
                                </button>
                            </div>

                            <div className="col-12 col-sm-6 col-lg-4">
                                <button
                                    type="button"
                                    className="accessibility-card card-elevated"
                                    onClick={() => navigate('/voter/assistance')}
                                >
                                    <i className="fas fa-hands-helping accessibility-icon" aria-hidden="true"></i>
                                    <h5>Request Assistance</h5>
                                    <p>Get help based on your needs</p>
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default VoterDashboard;
