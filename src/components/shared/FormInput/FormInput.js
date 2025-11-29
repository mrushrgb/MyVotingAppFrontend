import React from 'react';
import './FormInput.css';

const FormInput = ({
    type = 'text',
    label,
    placeholder,
    value,
    onChange,
    onBlur,
    onFocus,
    error,
    success,
    disabled = false,
    required = false,
    size = 'md',
    variant = 'default',
    icon,
    iconPosition = 'left',
    helpText,
    className = '',
    id,
    name,
    autoComplete,
    ...props
}) => {
    const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    const inputClasses = [
        'form-input-reusable',
        `form-input-${size}`,
        `form-input-${variant}`,
        error && 'form-input-error',
        success && 'form-input-success',
        disabled && 'form-input-disabled',
        icon && `form-input-with-icon-${iconPosition}`,
        className
    ].filter(Boolean).join(' ');

    const wrapperClasses = [
        'form-input-wrapper',
        icon && 'form-input-wrapper-with-icon'
    ].filter(Boolean).join(' ');

    return (
        <div className="form-input-container">
            {label && (
                <label 
                    htmlFor={inputId} 
                    className={`form-input-label ${required ? 'form-input-label-required' : ''}`}
                >
                    {label}
                    {required && <span className="form-input-required">*</span>}
                </label>
            )}
            
            <div className={wrapperClasses}>
                {icon && iconPosition === 'left' && (
                    <span className="form-input-icon form-input-icon-left">
                        <i className={icon}></i>
                    </span>
                )}
                
                <input
                    type={type}
                    id={inputId}
                    name={name}
                    className={inputClasses}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    disabled={disabled}
                    required={required}
                    autoComplete={autoComplete}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={
                        error ? `${inputId}-error` : 
                        helpText ? `${inputId}-help` : undefined
                    }
                    {...props}
                />
                
                {icon && iconPosition === 'right' && (
                    <span className="form-input-icon form-input-icon-right">
                        <i className={icon}></i>
                    </span>
                )}
            </div>
            
            {error && (
                <div id={`${inputId}-error`} className="form-input-feedback form-input-error-text">
                    <i className="fas fa-exclamation-circle"></i>
                    {error}
                </div>
            )}
            
            {success && !error && (
                <div className="form-input-feedback form-input-success-text">
                    <i className="fas fa-check-circle"></i>
                    {success}
                </div>
            )}
            
            {helpText && !error && !success && (
                <div id={`${inputId}-help`} className="form-input-feedback form-input-help-text">
                    {helpText}
                </div>
            )}
        </div>
    );
};

export default FormInput;
