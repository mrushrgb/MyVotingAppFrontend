import React from 'react';
import './Modal.css';

const Modal = ({
    isOpen = false,
    onClose,
    title,
    size = 'md',
    centered = true,
    backdrop = true,
    keyboard = true,
    className = '',
    children,
    ...props
}) => {
    // Handle escape key
    React.useEffect(() => {
        const handleEscape = (event) => {
            if (keyboard && event.key === 'Escape' && isOpen) {
                onClose?.();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, keyboard, onClose]);

    // Handle backdrop click
    const handleBackdropClick = (event) => {
        if (backdrop && event.target === event.currentTarget) {
            onClose?.();
        }
    };

    if (!isOpen) return null;

    const modalClasses = [
        'modal-reusable',
        `modal-${size}`,
        centered && 'modal-centered',
        className
    ].filter(Boolean).join(' ');

    return (
        <div 
            className={`modal-overlay ${isOpen ? 'modal-show' : ''}`}
            onClick={handleBackdropClick}
            {...props}
        >
            <div className={modalClasses} role="dialog" aria-modal="true">
                {title && (
                    <div className="modal-header">
                        <h3 className="modal-title">{title}</h3>
                        <button
                            type="button"
                            className="modal-close"
                            onClick={onClose}
                            aria-label="Close modal"
                        >
                            ×
                        </button>
                    </div>
                )}
                <div className="modal-content">
                    {children}
                </div>
            </div>
        </div>
    );
};

// Modal sub-components
const ModalHeader = ({ children, className = '', showClose = true, onClose, ...props }) => (
    <div className={`modal-header ${className}`} {...props}>
        <div className="modal-header-content">
            {children}
        </div>
        {showClose && (
            <button
                type="button"
                className="modal-close"
                onClick={onClose}
                aria-label="Close modal"
            >
                ×
            </button>
        )}
    </div>
);

const ModalBody = ({ children, className = '', ...props }) => (
    <div className={`modal-body ${className}`} {...props}>
        {children}
    </div>
);

const ModalFooter = ({ children, className = '', ...props }) => (
    <div className={`modal-footer ${className}`} {...props}>
        {children}
    </div>
);

// Export all components
Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;
