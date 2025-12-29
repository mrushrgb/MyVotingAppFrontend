import React, { useState, useEffect } from 'react';
import './ElectionManagement.css';
import Swal from 'sweetalert2';
import axios from 'axios';
import { API_ENDPOINTS } from '../../../../config/api';

const ElectionManagement = () => {
    const [elections, setElections] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingElection, setEditingElection] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startsAt: '',
        endsAt: '',
        status: 'draft',
        candidates: []
    });

    useEffect(() => {
        loadElections();
    }, []);

    const loadElections = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(API_ENDPOINTS.ADMIN.ELECTIONS, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setElections(response.data);
        } catch (error) {
            console.error('Error loading elections:', error);
            Swal.fire('Error', 'Failed to load elections: ' + (error.response?.data?.msg || error.message), 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddCandidate = () => {
        Swal.fire({
            title: 'Add Candidate',
            html: `
                <div style="text-align: left;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Name:</label>
                    <input id="candidateName" class="swal2-input" placeholder="Candidate Name" style="margin-bottom: 10px;">
                    
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Party:</label>
                    <input id="candidateParty" class="swal2-input" placeholder="Political Party" style="margin-bottom: 10px;">
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Add Candidate',
            cancelButtonText: 'Cancel',
            preConfirm: () => {
                const name = document.getElementById('candidateName').value;
                const party = document.getElementById('candidateParty').value;
                
                if (!name || !party) {
                    Swal.showValidationMessage('Please fill in all fields');
                    return false;
                }
                
                return { name, party };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                setFormData(prev => ({
                    ...prev,
                    candidates: [...prev.candidates, result.value]
                }));
            }
        });
    };

    const handleRemoveCandidate = (candidateIndex) => {
        setFormData(prev => ({
            ...prev,
            candidates: prev.candidates.filter((_, index) => index !== candidateIndex)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.title || !formData.startsAt || !formData.endsAt) {
            Swal.fire('Error', 'Please fill in all required fields', 'error');
            return;
        }

        if (new Date(formData.startsAt) > new Date(formData.endsAt)) {
            Swal.fire('Error', 'End date must be after start date', 'error');
            return;
        }

        if (formData.candidates.length === 0) {
            Swal.fire('Error', 'Please add at least one candidate', 'error');
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            if (editingElection) {
                // Update existing election
                await axios.put(
                    `${API_ENDPOINTS.ADMIN.ELECTIONS}/${editingElection._id}`,
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                Swal.fire('Success', 'Election updated successfully', 'success');
            } else {
                // Create new election
                await axios.post(
                    API_ENDPOINTS.ADMIN.ELECTIONS,
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                Swal.fire('Success', 'Election created successfully', 'success');
            }

            // Reload elections and reset form
            await loadElections();
            setFormData({
                title: '',
                description: '',
                startsAt: '',
                endsAt: '',
                status: 'draft',
                candidates: []
            });
            setShowCreateForm(false);
            setEditingElection(null);
        } catch (error) {
            console.error('Error saving election:', error);
            Swal.fire('Error', 'Failed to save election: ' + (error.response?.data?.msg || error.message), 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (election) => {
        setEditingElection(election);
        setFormData({
            title: election.title,
            description: election.description,
            startsAt: election.startsAt ? election.startsAt.split('T')[0] : '',
            endsAt: election.endsAt ? election.endsAt.split('T')[0] : '',
            status: election.status || 'draft',
            candidates: election.candidates || []
        });
        setShowCreateForm(true);
    };

    const handleDelete = async (electionId) => {
        const result = await Swal.fire({
            title: 'Delete Election',
            text: 'Are you sure you want to delete this election? This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });
        
        if (result.isConfirmed) {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                await axios.delete(
                    `${API_ENDPOINTS.ADMIN.ELECTIONS}/${electionId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                await loadElections();
                Swal.fire('Deleted!', 'Election has been deleted.', 'success');
            } catch (error) {
                console.error('Error deleting election:', error);
                Swal.fire('Error', 'Failed to delete election', 'error');
            } finally {
                setLoading(false);
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return '#28a745';
            case 'scheduled': return '#17a2b8';
            case 'completed': return '#6c757d';
            case 'cancelled': return '#dc3545';
            default: return '#ffc107';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="election-management-container">
            <div className="election-header">
                <h1>Election Management</h1>
                <button 
                    className="create-election-btn"
                    onClick={() => {
                        setShowCreateForm(true);
                        setEditingElection(null);
                        setFormData({
                            title: '',
                            description: '',
                            startDate: '',
                            endDate: '',
                            regions: [],
                            candidates: [],
                            status: 'draft'
                        });
                    }}
                >
                    <span className="btn-icon">➕</span>
                    Create New Election
                </button>
            </div>

            {showCreateForm && (
                <div className="create-form-container">
                    <div className="form-header">
                        <h2>{editingElection ? 'Edit Election' : 'Create New Election'}</h2>
                        <button 
                            className="close-form-btn"
                            onClick={() => {
                                setShowCreateForm(false);
                                setEditingElection(null);
                            }}
                        >
                            ✕
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="election-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Enter election title"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Status *</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="draft">Draft</option>
                                    <option value="scheduled">Scheduled</option>
                                    <option value="active">Active (Voters can vote)</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Enter election description"
                                rows="3"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Start Date *</label>
                                <input
                                    type="date"
                                    name="startsAt"
                                    value={formData.startsAt}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>End Date *</label>
                                <input
                                    type="date"
                                    name="endsAt"
                                    value={formData.endsAt}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="candidates-header">
                                <label>Candidates</label>
                                <button 
                                    type="button"
                                    className="add-candidate-btn"
                                    onClick={handleAddCandidate}
                                >
                                    Add Candidate
                                </button>
                            </div>
                            
                            <div className="candidates-list">
                                {formData.candidates.map((candidate, index) => (
                                    <div key={index} className="candidate-item">
                                        <div className="candidate-info">
                                            <span className="candidate-name">{candidate.name}</span>
                                            <span className="candidate-party">{candidate.party}</span>
                                        </div>
                                        <button
                                            type="button"
                                            className="remove-candidate-btn"
                                            onClick={() => handleRemoveCandidate(index)}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                                {formData.candidates.length === 0 && (
                                    <div className="no-candidates">
                                        No candidates added yet. Click "Add Candidate" to start.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading ? 'Saving...' : (editingElection ? 'Update Election' : 'Create Election')}
                            </button>
                            <button 
                                type="button" 
                                className="cancel-btn"
                                onClick={() => {
                                    setShowCreateForm(false);
                                    setEditingElection(null);
                                    setFormData({
                                        title: '',
                                        description: '',
                                        startsAt: '',
                                        endsAt: '',
                                        status: 'draft',
                                        candidates: []
                                    });
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="elections-list">
                {loading ? (
                    <div className="loading">Loading elections...</div>
                ) : elections.length === 0 ? (
                    <div className="no-elections">
                        <div className="no-elections-icon">🗳️</div>
                        <h3>No Elections Found</h3>
                        <p>Create your first election to get started.</p>
                    </div>
                ) : (
                    elections.map(election => (
                        <div key={election._id} className="election-card">
                            <div className="election-header-card">
                                <div className="election-title-section">
                                    <h3>{election.title}</h3>
                                    <span 
                                        className="election-status"
                                        style={{ 
                                            backgroundColor: getStatusColor(election.status || 'draft'),
                                            color: 'white',
                                            padding: '4px 12px',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            marginLeft: '10px'
                                        }}
                                    >
                                        {(election.status || 'draft').toUpperCase()}
                                    </span>
                                </div>
                                <div className="election-actions">
                                    <button 
                                        className="action-btn edit"
                                        onClick={() => handleEdit(election)}
                                        title="Edit Election"
                                    >
                                        ✏️
                                    </button>
                                    <button 
                                        className="action-btn delete"
                                        onClick={() => handleDelete(election._id)}
                                        title="Delete Election"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>

                            <p className="election-description">{election.description}</p>

                            <div className="election-details">
                                <div className="detail-item">
                                    <span className="detail-label">Status:</span>
                                    <span className="detail-value" style={{ fontWeight: 'bold', color: getStatusColor(election.status || 'draft') }}>
                                        {election.status === 'active' ? '✅ ACTIVE - Voters can vote!' : (election.status || 'draft').toUpperCase()}
                                    </span>
                                </div>

                                <div className="detail-item">
                                    <span className="detail-label">Period:</span>
                                    <span className="detail-value">
                                        {new Date(election.startsAt).toLocaleDateString()} - {new Date(election.endsAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="detail-item">
                                    <span className="detail-label">Candidates:</span>
                                    <span className="detail-value">
                                        {election.candidates?.length || 0} candidate{election.candidates?.length !== 1 ? 's' : ''}
                                    </span>
                                </div>

                                <div className="detail-item">
                                    <span className="detail-label">Votes:</span>
                                    <span className="detail-value">
                                        {election.votes?.length || 0} vote{election.votes?.length !== 1 ? 's' : ''}
                                    </span>
                                </div>
                            </div>

                            {election.candidates && election.candidates.length > 0 && (
                                <div className="candidates-preview">
                                    <h4>Candidates:</h4>
                                    <div className="candidates-grid">
                                        {election.candidates.map((candidate, index) => (
                                            <div key={index} className="candidate-preview">
                                                <span className="candidate-name">{candidate.name}</span>
                                                <span className="candidate-party">({candidate.party})</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ElectionManagement;
