import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './AssistanceRequest.css';

const AssistanceRequest = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        disabilityType: '',
        assistanceNeeded: [],
        preferredDate: '',
        preferredTime: '',
        contactMethod: 'phone',
        specialRequirements: '',
        interpreterNeeded: false,
        interpreterLanguage: '',
        transportationNeeded: false,
        caregiverAssistance: false,
        medicalEquipment: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const disabilityTypes = [
        { value: 'visual', label: 'Visual Impairment', icon: 'fas fa-eye-slash' },
        { value: 'hearing', label: 'Hearing Impairment', icon: 'fas fa-deaf' },
        { value: 'mobility', label: 'Mobility Impairment', icon: 'fas fa-wheelchair' },
        { value: 'cognitive', label: 'Cognitive Disability', icon: 'fas fa-brain' },
        { value: 'speech', label: 'Speech Impairment', icon: 'fas fa-comment-slash' },
        { value: 'multiple', label: 'Multiple Disabilities', icon: 'fas fa-universal-access' },
        { value: 'other', label: 'Other', icon: 'fas fa-question-circle' }
    ];

    const assistanceOptions = [
        { value: 'reader', label: 'Reading Assistance', description: 'Help reading ballot and materials' },
        { value: 'writer', label: 'Marking Assistance', description: 'Help marking ballot choices' },
        { value: 'mobility', label: 'Physical Mobility Help', description: 'Assistance moving around voting area' },
        { value: 'technology', label: 'Assistive Technology', description: 'Screen readers, magnifiers, etc.' },
        { value: 'interpreter', label: 'Sign Language Interpreter', description: 'ASL or other sign language interpretation' },
        { value: 'explanation', label: 'Process Explanation', description: 'Step-by-step voting process guidance' },
        { value: 'companion', label: 'Companion Support', description: 'Support from trusted person' }
    ];

    const languages = [
        'American Sign Language (ASL)',
        'Spanish',
        'French',
        'German',
        'Mandarin',
        'Other'
    ];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (type === 'checkbox') {
            if (name === 'assistanceNeeded') {
                setFormData(prev => ({
                    ...prev,
                    assistanceNeeded: checked 
                        ? [...prev.assistanceNeeded, value]
                        : prev.assistanceNeeded.filter(item => item !== value)
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    [name]: checked
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.disabilityType) {
            Swal.fire({
                title: 'Missing Information',
                text: 'Please select your disability type.',
                icon: 'warning'
            });
            return;
        }

        if (formData.assistanceNeeded.length === 0) {
            Swal.fire({
                title: 'Missing Information',
                text: 'Please select at least one type of assistance needed.',
                icon: 'warning'
            });
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            await Swal.fire({
                title: 'Request Submitted Successfully!',
                html: `
                    <div style="text-align: left;">
                        <p>Your assistance request has been received and will be processed within 24 hours.</p>
                        <p><strong>Reference Number:</strong> AR-${Date.now()}</p>
                        <p><strong>Expected Response:</strong> Within 1 business day</p>
                        <p>You will be contacted via your preferred method to arrange assistance.</p>
                    </div>
                `,
                icon: 'success',
                confirmButtonText: 'Continue',
                allowOutsideClick: false
            });

            navigate('/voter/dashboard');
        } catch (error) {
            Swal.fire({
                title: 'Submission Error',
                text: 'Unable to submit your request. Please try again or contact support.',
                icon: 'error'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="assistance-request">
            <div className="container">
                <div className="assistance-header">
                    <button 
                        className="btn btn-outline-light back-btn"
                        onClick={() => navigate('/voter/dashboard')}
                    >
                        <i className="fas fa-arrow-left"></i> Back to Dashboard
                    </button>
                    <h1>Request Voting Assistance</h1>
                    <p>Get the support you need to exercise your right to vote</p>
                </div>

                <form onSubmit={handleSubmit} className="assistance-form">
                    {/* Disability Type Selection */}
                    <div className="form-section">
                        <h3>1. Type of Disability</h3>
                        <p className="section-description">
                            Please select the category that best describes your situation. This helps us provide appropriate assistance.
                        </p>
                        <div className="disability-types-grid">
                            {disabilityTypes.map(type => (
                                <div key={type.value} className="disability-type-card">
                                    <input
                                        type="radio"
                                        id={`disability-${type.value}`}
                                        name="disabilityType"
                                        value={type.value}
                                        checked={formData.disabilityType === type.value}
                                        onChange={handleInputChange}
                                        className="disability-radio"
                                    />
                                    <label htmlFor={`disability-${type.value}`} className="disability-label">
                                        <div className="disability-icon">
                                            <i className={type.icon}></i>
                                        </div>
                                        <span>{type.label}</span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Assistance Needed */}
                    <div className="form-section">
                        <h3>2. Type of Assistance Needed</h3>
                        <p className="section-description">
                            Select all types of assistance you would like to receive (multiple selections allowed).
                        </p>
                        <div className="assistance-options-grid">
                            {assistanceOptions.map(option => (
                                <div key={option.value} className="assistance-option-card">
                                    <div className="option-content">
                                        <div className="option-header">
                                            <input
                                                type="checkbox"
                                                id={`assistance-${option.value}`}
                                                name="assistanceNeeded"
                                                value={option.value}
                                                checked={formData.assistanceNeeded.includes(option.value)}
                                                onChange={handleInputChange}
                                                className="assistance-checkbox"
                                            />
                                            <label htmlFor={`assistance-${option.value}`} className="option-title">
                                                {option.label}
                                            </label>
                                        </div>
                                        <p className="option-description">{option.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Scheduling */}
                    <div className="form-section">
                        <h3>3. Preferred Schedule</h3>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="preferredDate">Preferred Date</label>
                                    <input
                                        type="date"
                                        id="preferredDate"
                                        name="preferredDate"
                                        value={formData.preferredDate}
                                        onChange={handleInputChange}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="form-control"
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="preferredTime">Preferred Time</label>
                                    <select
                                        id="preferredTime"
                                        name="preferredTime"
                                        value={formData.preferredTime}
                                        onChange={handleInputChange}
                                        className="form-control"
                                    >
                                        <option value="">Select time...</option>
                                        <option value="morning">Morning (8:00 AM - 12:00 PM)</option>
                                        <option value="afternoon">Afternoon (12:00 PM - 5:00 PM)</option>
                                        <option value="evening">Evening (5:00 PM - 8:00 PM)</option>
                                        <option value="flexible">Flexible</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Method */}
                    <div className="form-section">
                        <h3>4. Preferred Contact Method</h3>
                        <div className="contact-methods">
                            <div className="contact-method">
                                <input
                                    type="radio"
                                    id="contact-phone"
                                    name="contactMethod"
                                    value="phone"
                                    checked={formData.contactMethod === 'phone'}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="contact-phone">
                                    <i className="fas fa-phone"></i>
                                    Phone Call
                                </label>
                            </div>
                            <div className="contact-method">
                                <input
                                    type="radio"
                                    id="contact-email"
                                    name="contactMethod"
                                    value="email"
                                    checked={formData.contactMethod === 'email'}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="contact-email">
                                    <i className="fas fa-envelope"></i>
                                    Email
                                </label>
                            </div>
                            <div className="contact-method">
                                <input
                                    type="radio"
                                    id="contact-text"
                                    name="contactMethod"
                                    value="text"
                                    checked={formData.contactMethod === 'text'}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="contact-text">
                                    <i className="fas fa-sms"></i>
                                    Text Message
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Additional Options */}
                    <div className="form-section">
                        <h3>5. Additional Support Options</h3>
                        <div className="additional-options">
                            <div className="option-group">
                                <div className="option-item">
                                    <input
                                        type="checkbox"
                                        id="interpreterNeeded"
                                        name="interpreterNeeded"
                                        checked={formData.interpreterNeeded}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="interpreterNeeded">I need an interpreter</label>
                                </div>
                                {formData.interpreterNeeded && (
                                    <div className="sub-option">
                                        <label htmlFor="interpreterLanguage">Language/Type:</label>
                                        <select
                                            id="interpreterLanguage"
                                            name="interpreterLanguage"
                                            value={formData.interpreterLanguage}
                                            onChange={handleInputChange}
                                            className="form-control"
                                        >
                                            <option value="">Select language...</option>
                                            {languages.map(lang => (
                                                <option key={lang} value={lang}>{lang}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div className="option-item">
                                <input
                                    type="checkbox"
                                    id="transportationNeeded"
                                    name="transportationNeeded"
                                    checked={formData.transportationNeeded}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="transportationNeeded">I need transportation assistance</label>
                            </div>

                            <div className="option-item">
                                <input
                                    type="checkbox"
                                    id="caregiverAssistance"
                                    name="caregiverAssistance"
                                    checked={formData.caregiverAssistance}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="caregiverAssistance">I will bring a caregiver/companion</label>
                            </div>
                        </div>
                    </div>

                    {/* Special Requirements */}
                    <div className="form-section">
                        <h3>6. Special Requirements or Medical Equipment</h3>
                        <div className="form-group">
                            <label htmlFor="medicalEquipment">Medical Equipment (if any):</label>
                            <input
                                type="text"
                                id="medicalEquipment"
                                name="medicalEquipment"
                                value={formData.medicalEquipment}
                                onChange={handleInputChange}
                                placeholder="e.g., wheelchair, oxygen tank, guide dog"
                                className="form-control"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="specialRequirements">Additional Requirements:</label>
                            <textarea
                                id="specialRequirements"
                                name="specialRequirements"
                                value={formData.specialRequirements}
                                onChange={handleInputChange}
                                placeholder="Please describe any other specific needs or accommodations..."
                                rows="4"
                                className="form-control"
                            ></textarea>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="form-actions">
                        <button
                            type="submit"
                            className="btn btn-primary btn-lg submit-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i>
                                    Submitting Request...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-paper-plane"></i>
                                    Submit Assistance Request
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Information Panel */}
                <div className="info-panel">
                    <h3>What to Expect</h3>
                    <div className="info-steps">
                        <div className="info-step">
                            <div className="step-number">1</div>
                            <div className="step-content">
                                <h5>Request Review</h5>
                                <p>Your request will be reviewed within 24 hours by our accessibility team.</p>
                            </div>
                        </div>
                        <div className="info-step">
                            <div className="step-number">2</div>
                            <div className="step-content">
                                <h5>Contact & Coordination</h5>
                                <p>We'll contact you to confirm details and schedule your assistance.</p>
                            </div>
                        </div>
                        <div className="info-step">
                            <div className="step-number">3</div>
                            <div className="step-content">
                                <h5>Voting Day Support</h5>
                                <p>A trained assistant will be available to help you vote independently.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssistanceRequest;
