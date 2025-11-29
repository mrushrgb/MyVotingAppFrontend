import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AccessibilityFeatures.css';

const AccessibilityFeatures = () => {
    const navigate = useNavigate();
    const [settings, setSettings] = useState({
        fontSize: 'normal',
        highContrast: false,
        screenReader: false,
        voiceCommands: false,
        colorBlindMode: false,
        reducedMotion: false,
        keyboardNavigation: true
    });

    const [isListening, setIsListening] = useState(false);
    const [speechRecognition, setSpeechRecognition] = useState(null);

    useEffect(() => {
        // Initialize speech recognition if available
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';
            
            recognition.onresult = (event) => {
                const command = event.results[0][0].transcript.toLowerCase();
                handleVoiceCommand(command);
            };
            
            recognition.onend = () => {
                setIsListening(false);
            };
            
            setSpeechRecognition(recognition);
        }

        // Load saved settings
        const savedSettings = localStorage.getItem('accessibilitySettings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    }, []);

    useEffect(() => {
        // Apply settings to document
        applyAccessibilitySettings();
        // Save settings
        localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    }, [settings]);

    const applyAccessibilitySettings = () => {
        const root = document.documentElement;
        
        // Font size
        switch (settings.fontSize) {
            case 'small':
                root.style.setProperty('--base-font-size', '14px');
                break;
            case 'large':
                root.style.setProperty('--base-font-size', '18px');
                break;
            case 'extra-large':
                root.style.setProperty('--base-font-size', '22px');
                break;
            default:
                root.style.setProperty('--base-font-size', '16px');
        }
        
        // High contrast
        if (settings.highContrast) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }
        
        // Reduced motion
        if (settings.reducedMotion) {
            document.body.classList.add('reduced-motion');
        } else {
            document.body.classList.remove('reduced-motion');
        }
        
        // Color blind mode
        if (settings.colorBlindMode) {
            document.body.classList.add('color-blind-mode');
        } else {
            document.body.classList.remove('color-blind-mode');
        }
    };

    const handleVoiceCommand = (command) => {
        const speak = (text) => {
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.rate = 0.8;
                utterance.pitch = 1;
                speechSynthesis.speak(utterance);
            }
        };

        if (command.includes('go to dashboard') || command.includes('dashboard')) {
            speak('Navigating to dashboard');
            navigate('/voter/dashboard');
        } else if (command.includes('vote') || command.includes('voting')) {
            speak('Navigating to voting page');
            navigate('/voter/voting');
        } else if (command.includes('candidates') || command.includes('candidate')) {
            speak('Navigating to candidate profiles');
            navigate('/voter/candidates');
        } else if (command.includes('eligibility') || command.includes('eligible')) {
            speak('Navigating to eligibility check');
            navigate('/voter/eligibility');
        } else if (command.includes('status') || command.includes('history')) {
            speak('Navigating to voting status');
            navigate('/voter/status');
        } else if (command.includes('help') || command.includes('assistance')) {
            speak('Navigating to assistance request');
            navigate('/voter/assistance');
        } else {
            speak('Command not recognized. Available commands include: dashboard, vote, candidates, eligibility, status, and help.');
        }
    };

    const toggleVoiceCommands = () => {
        if (!speechRecognition) {
            alert('Speech recognition is not supported in this browser.');
            return;
        }

        if (isListening) {
            speechRecognition.stop();
            setIsListening(false);
        } else {
            speechRecognition.start();
            setIsListening(true);
        }
    };

    const updateSetting = (key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const resetSettings = () => {
        const defaultSettings = {
            fontSize: 'normal',
            highContrast: false,
            screenReader: false,
            voiceCommands: false,
            colorBlindMode: false,
            reducedMotion: false,
            keyboardNavigation: true
        };
        setSettings(defaultSettings);
    };

    const accessibilityFeatures = [
        {
            id: 'fontSize',
            title: 'Text Size',
            description: 'Adjust the size of text for better readability',
            icon: 'fas fa-text-height',
            type: 'select',
            options: [
                { value: 'small', label: 'Small' },
                { value: 'normal', label: 'Normal' },
                { value: 'large', label: 'Large' },
                { value: 'extra-large', label: 'Extra Large' }
            ]
        },
        {
            id: 'highContrast',
            title: 'High Contrast Mode',
            description: 'Increase contrast between text and background for better visibility',
            icon: 'fas fa-adjust',
            type: 'toggle'
        },
        {
            id: 'screenReader',
            title: 'Screen Reader Optimization',
            description: 'Optimize interface for screen reader compatibility',
            icon: 'fas fa-volume-up',
            type: 'toggle'
        },
        {
            id: 'voiceCommands',
            title: 'Voice Commands',
            description: 'Navigate using voice commands (requires microphone permission)',
            icon: 'fas fa-microphone',
            type: 'toggle'
        },
        {
            id: 'colorBlindMode',
            title: 'Color Blind Friendly',
            description: 'Adjust colors for color vision deficiency',
            icon: 'fas fa-eye',
            type: 'toggle'
        },
        {
            id: 'reducedMotion',
            title: 'Reduced Motion',
            description: 'Minimize animations and motion effects',
            icon: 'fas fa-ban',
            type: 'toggle'
        },
        {
            id: 'keyboardNavigation',
            title: 'Enhanced Keyboard Navigation',
            description: 'Improve keyboard navigation with visual focus indicators',
            icon: 'fas fa-keyboard',
            type: 'toggle'
        }
    ];

    const renderFeatureControl = (feature) => {
        if (feature.type === 'select') {
            return (
                <select
                    className="form-control feature-control"
                    value={settings[feature.id]}
                    onChange={(e) => updateSetting(feature.id, e.target.value)}
                    aria-label={feature.title}
                >
                    {feature.options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            );
        } else if (feature.type === 'toggle') {
            return (
                <label className="toggle-switch">
                    <input
                        type="checkbox"
                        checked={settings[feature.id]}
                        onChange={(e) => updateSetting(feature.id, e.target.checked)}
                        aria-label={feature.title}
                    />
                    <span className="toggle-slider"></span>
                </label>
            );
        }
    };

    return (
        <div className="accessibility-features">
            <div className="container">
                {/* Header */}
                <div className="accessibility-header">
                    <button 
                        className="btn btn-outline-light back-btn"
                        onClick={() => navigate('/voter/dashboard')}
                        aria-label="Back to Dashboard"
                    >
                        <i className="fas fa-arrow-left"></i> Back to Dashboard
                    </button>
                    <h1>Accessibility Features</h1>
                    <p>Customize your voting experience for better accessibility</p>
                </div>

                {/* Voice Commands Section */}
                {speechRecognition && (
                    <div className="voice-commands-section">
                        <div className="voice-commands-card">
                            <div className="voice-icon">
                                <i className={`fas fa-microphone ${isListening ? 'listening' : ''}`}></i>
                            </div>
                            <div className="voice-content">
                                <h3>Voice Commands</h3>
                                <p>Click the button and say commands like "Go to dashboard", "Vote", "View candidates"</p>
                                <button 
                                    className={`btn ${isListening ? 'btn-danger' : 'btn-primary'} btn-lg`}
                                    onClick={toggleVoiceCommands}
                                    aria-label={isListening ? 'Stop listening' : 'Start voice commands'}
                                >
                                    {isListening ? (
                                        <>
                                            <i className="fas fa-stop"></i>
                                            Stop Listening
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-microphone"></i>
                                            Start Voice Commands
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Accessibility Features Grid */}
                <div className="features-section">
                    <h3>Accessibility Options</h3>
                    <div className="features-grid">
                        {accessibilityFeatures.map(feature => (
                            <div key={feature.id} className="feature-card">
                                <div className="feature-icon">
                                    <i className={feature.icon}></i>
                                </div>
                                <div className="feature-content">
                                    <h4>{feature.title}</h4>
                                    <p>{feature.description}</p>
                                </div>
                                <div className="feature-control-wrapper">
                                    {renderFeatureControl(feature)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Keyboard Shortcuts */}
                <div className="keyboard-shortcuts">
                    <h3>Keyboard Shortcuts</h3>
                    <div className="shortcuts-grid">
                        <div className="shortcut-item">
                            <kbd>Tab</kbd>
                            <span>Navigate between elements</span>
                        </div>
                        <div className="shortcut-item">
                            <kbd>Enter</kbd> / <kbd>Space</kbd>
                            <span>Activate buttons and links</span>
                        </div>
                        <div className="shortcut-item">
                            <kbd>Escape</kbd>
                            <span>Close dialogs and menus</span>
                        </div>
                        <div className="shortcut-item">
                            <kbd>Arrow Keys</kbd>
                            <span>Navigate within menus and lists</span>
                        </div>
                        <div className="shortcut-item">
                            <kbd>Alt + D</kbd>
                            <span>Go to Dashboard</span>
                        </div>
                        <div className="shortcut-item">
                            <kbd>Alt + V</kbd>
                            <span>Go to Voting Page</span>
                        </div>
                    </div>
                </div>

                {/* Screen Reader Instructions */}
                <div className="screen-reader-info">
                    <h3>Screen Reader Information</h3>
                    <div className="info-cards">
                        <div className="info-card">
                            <div className="info-icon">
                                <i className="fas fa-info-circle"></i>
                            </div>
                            <div className="info-content">
                                <h5>Navigation</h5>
                                <p>Use heading navigation (H1-H6) to quickly jump between sections. All interactive elements have descriptive labels.</p>
                            </div>
                        </div>
                        <div className="info-card">
                            <div className="info-icon">
                                <i className="fas fa-list"></i>
                            </div>
                            <div className="info-content">
                                <h5>Forms</h5>
                                <p>All form fields have proper labels and error messages are clearly announced. Use arrow keys to navigate radio button groups.</p>
                            </div>
                        </div>
                        <div className="info-card">
                            <div className="info-icon">
                                <i className="fas fa-table"></i>
                            </div>
                            <div className="info-content">
                                <h5>Data Tables</h5>
                                <p>Tables include proper headers and captions. Navigate with Ctrl+Alt+Arrow keys in most screen readers.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Settings Actions */}
                <div className="settings-actions">
                    <button 
                        className="btn btn-outline-secondary btn-lg"
                        onClick={resetSettings}
                        aria-label="Reset all accessibility settings to default"
                    >
                        <i className="fas fa-undo"></i>
                        Reset to Default
                    </button>
                    <button 
                        className="btn btn-success btn-lg"
                        onClick={() => {
                            if ('speechSynthesis' in window) {
                                const utterance = new SpeechSynthesisUtterance('Accessibility settings have been saved successfully.');
                                speechSynthesis.speak(utterance);
                            }
                            alert('Settings saved successfully!');
                        }}
                        aria-label="Save current accessibility settings"
                    >
                        <i className="fas fa-save"></i>
                        Save Settings
                    </button>
                </div>

                {/* Help Section */}
                <div className="help-section">
                    <h3>Need Additional Help?</h3>
                    <div className="help-options">
                        <button 
                            className="btn btn-outline-primary help-btn"
                            onClick={() => navigate('/voter/assistance')}
                        >
                            <i className="fas fa-hands-helping"></i>
                            Request Assistance
                        </button>
                        <a 
                            href="tel:1-800-VOTE-NOW" 
                            className="btn btn-outline-info help-btn"
                        >
                            <i className="fas fa-phone"></i>
                            Call Support
                        </a>
                        <a 
                            href="mailto:accessibility@votersystem.gov" 
                            className="btn btn-outline-success help-btn"
                        >
                            <i className="fas fa-envelope"></i>
                            Email Support
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccessibilityFeatures;
