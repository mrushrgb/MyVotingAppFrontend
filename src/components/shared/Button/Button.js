import React from 'react';
import './Button.css';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    icon = null,
    iconPosition = 'left',
    onClick,
    type = 'button',
    className = '',
    ...props
}) => {
    const buttonClasses = [
        'btn-reusable',
        `btn-${variant}`,
        `btn-${size}`,
        loading && 'btn-loading',
        disabled && 'btn-disabled',
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            type={type}
            className={buttonClasses}
            onClick={onClick}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <span className="btn-spinner">
                    <i className="fas fa-spinner fa-spin"></i>
                </span>
            )}
            
            {!loading && icon && iconPosition === 'left' && (
                <span className="btn-icon btn-icon-left">
                    <i className={icon}></i>
                </span>
            )}
            
            <span className="btn-text">{children}</span>
            
            {!loading && icon && iconPosition === 'right' && (
                <span className="btn-icon btn-icon-right">
                    <i className={icon}></i>
                </span>
            )}
        </button>
    );
};

export default Button;
