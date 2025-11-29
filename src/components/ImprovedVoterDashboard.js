import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Card, 
    Button, 
    Modal, 
    FormInput, 
    LoadingSpinner,
    PrimaryButton,
    SuccessButton,
    DangerButton,
    GlassCard
} from '../shared';
import UserNavigation from '../user/navigation/UserNavigation';

const ImprovedVoterDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showBiometricModal, setShowBiometricModal] = useState(false);
    const [voterData, setVoterData] = useState({
        name: 'John Doe',
        id: 'VTR123456',
        status: 'verified',
        eligibilityStatus: 'eligible'
    });

    // Quick actions data
    const quickActions = [
        {
            title: 'Check Eligibility',
            description: 'Verify your voting eligibility',
            icon: 'fas fa-user-check',
            color: 'success',
            action: () => navigate('/voter/eligibility'),
            disabled: false
        },
        {
            title: 'View Candidates',
            description: 'Browse candidate profiles',
            icon: 'fas fa-users',
            color: 'info',
            action: () => navigate('/voter/candidates'),
            disabled: false
        },
        {
            title: 'Cast Vote',
            description: 'Vote in active elections',
            icon: 'fas fa-vote-yea',
            color: 'primary',
            action: () => navigate('/voter/voting'),
            disabled: voterData.eligibilityStatus !== 'eligible'
        },
        {
            title: 'Voting Status',
            description: 'Track your voting history',
            icon: 'fas fa-chart-line',
            color: 'warning',
            action: () => navigate('/voter/status'),
            disabled: false
        }
    ];

    // Recent notifications
    const notifications = [
        {
            id: 1,
            type: 'info',
            title: 'Election Reminder',
            message: 'Presidential Election voting ends in 2 days',
            time: '2 hours ago'
        },
        {
            id: 2,
            type: 'success',
            title: 'Identity Verified',
            message: 'Your biometric verification was successful',
            time: '1 day ago'
        }
    ];

    // biometric auth removed

    return (
        <div className="app-layout">
            <UserNavigation />
            
            <div className="voter-dashboard" style={{ 
                padding: '2rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                minHeight: '100vh'
            }}>
                <div className="container-fluid">
                    {/* Dashboard Header */}
                    <GlassCard size="lg" className="mb-4">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                            <div>
                                <Card.Title level={2} style={{ marginBottom: '0.5rem' }}>
                                    Welcome back, {voterData.name}
                                </Card.Title>
                                <Card.Text style={{ marginBottom: '0' }}>
                                    Voter ID: {voterData.id} • Status: {voterData.status}
                                </Card.Text>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                {/* Biometric auth removed */}
                                <SuccessButton icon="fas fa-shield-check">
                                    Verified
                                </SuccessButton>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Quick Actions Grid */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ color: 'white', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <i className="fas fa-bolt"></i>
                            Quick Actions
                        </h3>
                        
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                            gap: '1.5rem' 
                        }}>
                            {quickActions.map((action, index) => (
                                <Card 
                                    key={index}
                                    variant="glass"
                                    hover={!action.disabled}
                                    onClick={!action.disabled ? action.action : undefined}
                                    style={{ 
                                        cursor: action.disabled ? 'not-allowed' : 'pointer',
                                        opacity: action.disabled ? 0.6 : 1
                                    }}
                                >
                                    <Card.Icon icon={action.icon} color={action.color} size="lg" />
                                    <Card.Title level={4}>{action.title}</Card.Title>
                                    <Card.Text>{action.description}</Card.Text>
                                    
                                    {action.disabled && (
                                        <div style={{ 
                                            background: 'rgba(255, 193, 7, 0.2)', 
                                            padding: '0.5rem', 
                                            borderRadius: '8px',
                                            marginTop: '0.5rem'
                                        }}>
                                            <small style={{ color: '#ffc107' }}>
                                                <i className="fas fa-exclamation-triangle"></i>
                                                {action.title === 'Cast Vote' ? ' Complete eligibility check first' : ' Currently unavailable'}
                                            </small>
                                        </div>
                                    )}
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Two Column Layout */}
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
                        gap: '2rem' 
                    }}>
                        {/* Recent Notifications */}
                        <Card variant="glass" size="lg">
                            <Card.Header>
                                <Card.Title level={3} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <i className="fas fa-bell"></i>
                                    Recent Notifications
                                </Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {notifications.map(notification => (
                                        <div key={notification.id} style={{ 
                                            padding: '1rem',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            borderRadius: '12px',
                                            borderLeft: `4px solid ${
                                                notification.type === 'success' ? '#28a745' :
                                                notification.type === 'warning' ? '#ffc107' :
                                                notification.type === 'danger' ? '#dc3545' : '#17a2b8'
                                            }`
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                                <i className={`fas ${
                                                    notification.type === 'success' ? 'fa-check-circle' :
                                                    notification.type === 'warning' ? 'fa-exclamation-triangle' :
                                                    notification.type === 'danger' ? 'fa-times-circle' : 'fa-info-circle'
                                                }`} style={{ 
                                                    color: notification.type === 'success' ? '#28a745' :
                                                           notification.type === 'warning' ? '#ffc107' :
                                                           notification.type === 'danger' ? '#dc3545' : '#17a2b8',
                                                    marginTop: '0.2rem'
                                                }}></i>
                                                <div style={{ flex: 1 }}>
                                                    <h5 style={{ margin: '0 0 0.25rem 0', color: 'white' }}>
                                                        {notification.title}
                                                    </h5>
                                                    <p style={{ margin: '0 0 0.25rem 0', color: 'rgba(255, 255, 255, 0.8)' }}>
                                                        {notification.message}
                                                    </p>
                                                    <small style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                                        {notification.time}
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card.Body>
                        </Card>

                        {/* Accessibility Features */}
                        <Card variant="glass" size="lg">
                            <Card.Header>
                                <Card.Title level={3} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <i className="fas fa-universal-access"></i>
                                    Accessibility Features
                                </Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                                    <Button 
                                        variant="ghost" 
                                        size="lg"
                                        icon="fas fa-text-height"
                                        onClick={() => navigate('/voter/accessibility')}
                                        style={{ 
                                            flexDirection: 'column', 
                                            height: '100px',
                                            padding: '1rem'
                                        }}
                                    >
                                        Text Size
                                    </Button>
                                    
                                    <Button 
                                        variant="ghost" 
                                        size="lg"
                                        icon="fas fa-volume-up"
                                        onClick={() => navigate('/voter/accessibility')}
                                        style={{ 
                                            flexDirection: 'column', 
                                            height: '100px',
                                            padding: '1rem'
                                        }}
                                    >
                                        Voice Control
                                    </Button>
                                    
                                    <Button 
                                        variant="ghost" 
                                        size="lg"
                                        icon="fas fa-hands-helping"
                                        onClick={() => navigate('/voter/assistance')}
                                        style={{ 
                                            flexDirection: 'column', 
                                            height: '100px',
                                            padding: '1rem'
                                        }}
                                    >
                                        Get Help
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                </div>

                {/* Biometric modal removed */}
            </div>
        </div>
    );
};

export default ImprovedVoterDashboard;
