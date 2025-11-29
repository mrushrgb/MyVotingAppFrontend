import React, { useState } from 'react';
import { 
    Button, 
    Card, 
    Modal, 
    FormInput, 
    LoadingSpinner,
    PrimaryButton,
    GlassCard,
    ConfirmModal
} from '../shared';

const ReusableComponentsDemo = () => {
    const [showModal, setShowModal] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    });
    const [errors, setErrors] = useState({});

    const handleInputChange = (field) => (e) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setLoading(false);
        setShowModal(false);
    };

    return (
        <div style={{ padding: '2rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h1 style={{ color: 'white', textAlign: 'center', marginBottom: '2rem' }}>
                    Reusable Components Demo
                </h1>

                {/* Buttons Section */}
                <Card size="lg" className="mb-4">
                    <Card.Header>
                        <Card.Title>Button Components</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            <Button variant="primary" icon="fas fa-vote" onClick={() => setShowModal(true)}>
                                Vote Now
                            </Button>
                            <Button variant="success" icon="fas fa-check" iconPosition="right">
                                Verified
                            </Button>
                            <Button variant="warning" size="lg" loading={loading}>
                                Processing
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => setShowConfirm(true)}>
                                Delete
                            </Button>
                            <Button variant="outline-primary" icon="fas fa-user">
                                Profile
                            </Button>
                            <Button variant="ghost" icon="fas fa-info-circle">
                                Help
                            </Button>
                        </div>
                    </Card.Body>
                </Card>

                {/* Cards Section */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    <Card variant="primary" hover>
                        <Card.Icon icon="fas fa-vote" color="primary" size="lg" />
                        <Card.Title level={3}>Election Status</Card.Title>
                        <Card.Text>
                            Track your voting status and view election results in real-time.
                        </Card.Text>
                        <PrimaryButton size="sm" icon="fas fa-arrow-right" iconPosition="right">
                            View Status
                        </PrimaryButton>
                    </Card>

                    <GlassCard hover onClick={() => console.log('Card clicked')}>
                        <Card.Icon icon="fas fa-users" color="success" size="lg" />
                        <Card.Title level={3}>Candidates</Card.Title>
                        <Card.Text>
                            Browse candidate profiles and learn about their platforms.
                        </Card.Text>
                        <Button variant="success" size="sm" icon="fas fa-eye">
                            View Candidates
                        </Button>
                    </GlassCard>

                    <Card variant="warning" hover>
                        <Card.Icon icon="fas fa-shield-alt" color="warning" size="lg" />
                        <Card.Title level={3}>Security</Card.Title>
                        <Card.Text>
                            Your vote is protected with advanced biometric authentication.
                        </Card.Text>
                        <Button variant="warning" size="sm" icon="fas fa-fingerprint">
                            Verify Identity
                        </Button>
                    </Card>
                </div>

                {/* Loading Spinners Section */}
                <Card size="lg" className="mb-4">
                    <Card.Header>
                        <Card.Title>Loading Components</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', alignItems: 'center', textAlign: 'center' }}>
                            <div>
                                <h4 style={{ color: 'white', marginBottom: '1rem' }}>Default Spinner</h4>
                                <LoadingSpinner size="lg" variant="primary" text="Loading..." />
                            </div>
                            <div>
                                <h4 style={{ color: 'white', marginBottom: '1rem' }}>Pulse Spinner</h4>
                                <LoadingSpinner.PulseSpinner size="lg" variant="success" />
                            </div>
                            <div>
                                <h4 style={{ color: 'white', marginBottom: '1rem' }}>Bar Spinner</h4>
                                <LoadingSpinner.BarSpinner size="lg" variant="warning" />
                            </div>
                            <div>
                                <h4 style={{ color: 'white', marginBottom: '1rem' }}>Ring Spinner</h4>
                                <LoadingSpinner.RingSpinner size="lg" variant="info" />
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                {/* Quick Action to toggle loading */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Button 
                        variant="info" 
                        size="lg" 
                        onClick={() => {
                            setLoading(true);
                            setTimeout(() => setLoading(false), 3000);
                        }}
                        icon="fas fa-spinner"
                    >
                        Test Loading State
                    </Button>
                </div>

                {/* Modal Example */}
                <Modal 
                    isOpen={showModal} 
                    onClose={() => setShowModal(false)}
                    title="Voter Registration"
                    size="lg"
                >
                    <Modal.Body>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <FormInput
                                label="Full Name"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleInputChange('name')}
                                icon="fas fa-user"
                                required
                                error={errors.name}
                            />
                            
                            <FormInput
                                type="email"
                                label="Email Address"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleInputChange('email')}
                                icon="fas fa-envelope"
                                required
                                error={errors.email}
                            />
                            
                            <FormInput
                                type="password"
                                label="Password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleInputChange('password')}
                                icon="fas fa-lock"
                                required
                                error={errors.password}
                                helpText="Password must be at least 8 characters long"
                            />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button 
                            variant="secondary" 
                            onClick={() => setShowModal(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="primary" 
                            onClick={handleSubmit}
                            loading={loading}
                            icon="fas fa-save"
                        >
                            Register
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Confirm Modal Example */}
                <ConfirmModal
                    isOpen={showConfirm}
                    onClose={() => setShowConfirm(false)}
                    onConfirm={() => {
                        console.log('Confirmed!');
                        setShowConfirm(false);
                    }}
                    title="Confirm Deletion"
                    message="Are you sure you want to delete this item? This action cannot be undone."
                />

                {/* Full screen loading overlay example */}
                {loading && (
                    <LoadingSpinner 
                        fullScreen 
                        size="xl" 
                        variant="primary" 
                        text="Processing your request..." 
                    />
                )}
            </div>
        </div>
    );
};

export default ReusableComponentsDemo;
