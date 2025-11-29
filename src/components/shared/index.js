// Export all reusable components from a single entry point
import React from 'react';
export { default as Button } from './Button/Button';
export { default as Card } from './Card/Card';
export { default as Modal } from './Modal/Modal';
export { default as FormInput } from './FormInput/FormInput';
export { default as LoadingSpinner, PulseSpinner, BarSpinner, RingSpinner } from './LoadingSpinner/LoadingSpinner';

// Import components for themed exports
import Button from './Button/Button';
import Card from './Card/Card';
import Modal from './Modal/Modal';
import LoadingSpinner from './LoadingSpinner/LoadingSpinner';

// You can also create themed exports
export const PrimaryButton = (props) => <Button variant="primary" {...props} />;
export const SecondaryButton = (props) => <Button variant="secondary" {...props} />;
export const SuccessButton = (props) => <Button variant="success" {...props} />;
export const DangerButton = (props) => <Button variant="danger" {...props} />;

export const GlassCard = (props) => <Card variant="glass" {...props} />;
export const SolidCard = (props) => <Card variant="solid" {...props} />;

// HOC for adding common functionality
export const withLoading = (Component) => {
    return ({ loading, ...props }) => {
        if (loading) {
            return <LoadingSpinner overlay text="Loading..." />;
        }
        return <Component {...props} />;
    };
};

// Common patterns
export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, ...props }) => (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm" {...props}>
        <Modal.Body>
            <p>{message}</p>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={onClose}>
                Cancel
            </Button>
            <Button variant="danger" onClick={onConfirm}>
                Confirm
            </Button>
        </Modal.Footer>
    </Modal>
);
