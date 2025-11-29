import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './EligibilityCheck.css';

const EligibilityCheck = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [eligibilityData, setEligibilityData] = useState({
        voterRegistered: true,
        ageEligible: true,
        residencyValid: true,
        criminalRecordClear: true,
        mentalCapacityValid: true,
        overallEligible: true
    });
    
    const [voterInfo, setVoterInfo] = useState(() => {
        try {
            const raw = localStorage.getItem('userData');
            if (raw) {
                const parsed = JSON.parse(raw);
                return {
                    name: parsed.name || parsed.userName || parsed.user || 'Unknown',
                    voterId: parsed.voterId || parsed.voter_id || parsed._id || parsed.id || '',
                    dateOfBirth: parsed.dob || parsed.dateOfBirth || parsed.dob || '',
                    registrationDate: parsed.registrationDate || parsed.createdAt || '',
                    constituency: parsed.constituency || parsed.region || '',
                    address: parsed.address || '',
                    lastVoted: parsed.lastVoted || parsed.last_voted || ''
                };
            }
        } catch (err) {
            // ignore parse errors
        }

        return {
            name: 'John Doe',
            voterId: 'VTR123456789',
            dateOfBirth: '1990-05-15',
            registrationDate: '2018-03-20',
            constituency: 'Downtown District',
            address: '123 Main Street, Downtown City, DC 12345',
            lastVoted: '2024-11-05'
        };
    });

    // Keep eligibilityData consistent with voterInfo (optional enhancement)

    const checkEligibility = async () => {
        setLoading(true);
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Mock eligibility check results
            const mockResults = {
                voterRegistered: Math.random() > 0.1,
                ageEligible: Math.random() > 0.05,
                residencyValid: Math.random() > 0.1,
                criminalRecordClear: Math.random() > 0.2,
                mentalCapacityValid: Math.random() > 0.05,
            };
            
            const overallEligible = Object.values(mockResults).every(Boolean);
            
            setEligibilityData({
                ...mockResults,
                overallEligible
            });
            
            if (overallEligible) {
                Swal.fire({
                    title: 'Congratulations!',
                    text: 'You are eligible to vote in all available elections.',
                    icon: 'success',
                    confirmButtonText: 'Proceed to Vote',
                    showCancelButton: true,
                    cancelButtonText: 'Back to Dashboard'
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/voter/voting');
                    }
                });
            } else {
                Swal.fire({
                    title: 'Eligibility Issues Found',
                    text: 'Please review the issues below and contact support for assistance.',
                    icon: 'warning',
                    confirmButtonText: 'Contact Support',
                    showCancelButton: true,
                    cancelButtonText: 'Back to Dashboard'
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Unable to check eligibility at this time. Please try again later.',
                icon: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const eligibilityChecks = [
        {
            key: 'voterRegistered',
            title: 'Voter Registration',
            description: 'Valid voter registration in the electoral database',
            icon: '📝'
        },
        {
            key: 'ageEligible',
            title: 'Age Requirement',
            description: 'Must be 18 years or older on election day',
            icon: '🎂'
        },
        {
            key: 'residencyValid',
            title: 'Residency Status',
            description: 'Valid residency in the voting constituency',
            icon: '🏠'
        },
        {
            key: 'criminalRecordClear',
            title: 'Criminal Record',
            description: 'No disqualifying criminal convictions',
            icon: '⚖️'
        },
        {
            key: 'mentalCapacityValid',
            title: 'Mental Capacity',
            description: 'Legal capacity to make voting decisions',
            icon: '🧠'
        }
    ];

    const calculateAge = (dateOfBirth) => {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age;
    };

    // Update voterInfo when localStorage.userData changes (cross-tab or same-tab event)
    useEffect(() => {
        const updateFromStorage = () => {
            try {
                const raw = localStorage.getItem('userData');
                if (raw) {
                    const parsed = JSON.parse(raw);
                    setVoterInfo({
                        name: parsed.name || parsed.userName || 'Unknown',
                        voterId: parsed.voterId || parsed.voter_id || parsed._id || parsed.id || '',
                        dateOfBirth: parsed.dob || parsed.dateOfBirth || '',
                        registrationDate: parsed.registrationDate || parsed.createdAt || '',
                        constituency: parsed.constituency || parsed.region || '',
                        address: parsed.address || '',
                        lastVoted: parsed.lastVoted || parsed.last_voted || ''
                    });
                }
            } catch (err) {
                // ignore
            }
        };

        const onStorage = (e) => {
            if (e.key === 'userData') updateFromStorage();
        };

        // custom event dispatched in same tab after registration
        const onUserDataUpdated = () => updateFromStorage();

        window.addEventListener('storage', onStorage);
        window.addEventListener('userDataUpdated', onUserDataUpdated);

        // also run once on mount to pick up any current data
        updateFromStorage();

        return () => {
            window.removeEventListener('storage', onStorage);
            window.removeEventListener('userDataUpdated', onUserDataUpdated);
        };
    }, []);

    return (
        <div className="eligibility-check">
            <div className="container">
                {/* Header */}
                <div className="eligibility-header">
                    <button 
                        className="btn btn-outline-secondary back-btn"
                        onClick={() => navigate('/voter/dashboard')}
                    >
                        <i className="fas fa-arrow-left"></i> Back to Dashboard
                    </button>
                    <h1>Voter Eligibility Check</h1>
                    <p>Verify your eligibility to participate in elections</p>
                </div>

                {/* Voter Information Card */}
                <div className="voter-info-card">
                    <h3>Your Information</h3>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="info-item">
                                <label>Full Name:</label>
                                <span>{voterInfo.name}</span>
                            </div>
                            <div className="info-item">
                                <label>Voter ID:</label>
                                <span>{voterInfo.voterId}</span>
                            </div>
                            <div className="info-item">
                                <label>Date of Birth:</label>
                                <span>{voterInfo.dateOfBirth} (Age: {calculateAge(voterInfo.dateOfBirth)})</span>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="info-item">
                                <label>Registration Date:</label>
                                <span>{voterInfo.registrationDate}</span>
                            </div>
                            <div className="info-item">
                                <label>Constituency:</label>
                                <span>{voterInfo.constituency}</span>
                            </div>
                            <div className="info-item">
                                <label>Last Voted:</label>
                                <span>{voterInfo.lastVoted || 'Never'}</span>
                            </div>
                        </div>
                    </div>
                    <div className="full-width-info">
                        <div className="info-item">
                            <label>Registered Address:</label>
                            <span>{voterInfo.address}</span>
                        </div>
                    </div>
                </div>

                {/* Eligibility Checks */}
                <div className="eligibility-checks-section">
                    <h3>Eligibility Requirements</h3>
                    <div className="checks-grid">
                        {eligibilityChecks.map((check) => (
                            <div 
                                key={check.key} 
                                className={`eligibility-check-item ${
                                    eligibilityData[check.key] === true ? 'passed' : 
                                    eligibilityData[check.key] === false ? 'failed' : 'pending'
                                }`}
                            >
                                <div className="check-icon">
                                    {check.icon}
                                </div>
                                <div className="check-content">
                                    <h5>{check.title}</h5>
                                    <p>{check.description}</p>
                                </div>
                                <div className="check-status">
                                    {eligibilityData[check.key] === true && (
                                        <i className="fas fa-check-circle text-success"></i>
                                    )}
                                    {eligibilityData[check.key] === false && (
                                        <i className="fas fa-times-circle text-danger"></i>
                                    )}
                                    {eligibilityData[check.key] === null && (
                                        <i className="fas fa-clock text-warning"></i>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Overall Status */}
                <div className={`overall-eligibility ${eligibilityData.overallEligible ? 'eligible' : 'not-eligible'}`}>
                    <div className="status-content">
                        <div className="status-icon">
                            {eligibilityData.overallEligible ? (
                                <i className="fas fa-check-circle"></i>
                            ) : (
                                <i className="fas fa-exclamation-triangle"></i>
                            )}
                        </div>
                        <div className="status-text">
                            <h4>
                                {eligibilityData.overallEligible ? 
                                    'You are eligible to vote!' : 
                                    'Eligibility issues detected'
                                }
                            </h4>
                            <p>
                                {eligibilityData.overallEligible ? 
                                    'All requirements met. You can participate in available elections.' :
                                    'Please resolve the issues above or contact support for assistance.'
                                }
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="action-buttons">
                    <button 
                        className="btn btn-primary btn-lg"
                        onClick={checkEligibility}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i>
                                Checking Eligibility...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-search"></i>
                                Check Eligibility
                            </>
                        )}
                    </button>
                    
                    {eligibilityData.overallEligible && (
                        <button 
                            className="btn btn-success btn-lg"
                            onClick={() => navigate('/voter/voting')}
                        >
                            <i className="fas fa-vote-yea"></i>
                            Proceed to Vote
                        </button>
                    )}
                    
                    <button 
                        className="btn btn-outline-info btn-lg"
                        onClick={() => window.print()}
                    >
                        <i className="fas fa-print"></i>
                        Print Results
                    </button>
                </div>

                {/* Help Section */}
                <div className="help-section">
                    <h4>Need Help?</h4>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="help-card">
                                <i className="fas fa-phone"></i>
                                <h5>Call Support</h5>
                                <p>1-800-VOTE-NOW</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="help-card">
                                <i className="fas fa-envelope"></i>
                                <h5>Email Us</h5>
                                <p>support@votersystem.gov</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="help-card">
                                <i className="fas fa-map-marker-alt"></i>
                                <h5>Visit Office</h5>
                                <p>Local Election Office</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EligibilityCheck;
