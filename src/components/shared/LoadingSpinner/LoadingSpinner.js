import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({
    size = 'md',
    variant = 'primary',
    text = '',
    overlay = false,
    fullScreen = false,
    className = '',
    ...props
}) => {
    const spinnerClasses = [
        'loading-spinner-reusable',
        `spinner-${size}`,
        `spinner-${variant}`,
        className
    ].filter(Boolean).join(' ');

    const containerClasses = [
        'loading-container',
        overlay && 'loading-overlay',
        fullScreen && 'loading-fullscreen'
    ].filter(Boolean).join(' ');

    const SpinnerElement = () => (
        <div className={spinnerClasses} {...props}>
            <div className="spinner-circle">
                <div className="spinner-dot spinner-dot-1"></div>
                <div className="spinner-dot spinner-dot-2"></div>
                <div className="spinner-dot spinner-dot-3"></div>
                <div className="spinner-dot spinner-dot-4"></div>
            </div>
            {text && <div className="spinner-text">{text}</div>}
        </div>
    );

    if (overlay || fullScreen) {
        return (
            <div className={containerClasses}>
                <SpinnerElement />
            </div>
        );
    }

    return <SpinnerElement />;
};

// Alternative spinner variants
export const PulseSpinner = ({ size = 'md', variant = 'primary', className = '', ...props }) => (
    <div className={`pulse-spinner pulse-${size} pulse-${variant} ${className}`} {...props}>
        <div className="pulse-dot pulse-dot-1"></div>
        <div className="pulse-dot pulse-dot-2"></div>
        <div className="pulse-dot pulse-dot-3"></div>
    </div>
);

export const BarSpinner = ({ size = 'md', variant = 'primary', className = '', ...props }) => (
    <div className={`bar-spinner bar-${size} bar-${variant} ${className}`} {...props}>
        <div className="bar-line bar-line-1"></div>
        <div className="bar-line bar-line-2"></div>
        <div className="bar-line bar-line-3"></div>
        <div className="bar-line bar-line-4"></div>
        <div className="bar-line bar-line-5"></div>
    </div>
);

export const RingSpinner = ({ size = 'md', variant = 'primary', className = '', ...props }) => (
    <div className={`ring-spinner ring-${size} ring-${variant} ${className}`} {...props}>
        <div className="ring-circle"></div>
    </div>
);

export default LoadingSpinner;
