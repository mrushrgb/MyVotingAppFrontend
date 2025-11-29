import React, { useState, useEffect } from 'react';
import './ElectionManagement.css';
import Swal from 'sweetalert2';

const ElectionManagement = () => {
    const [elections, setElections] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingElection, setEditingElection] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        regions: [],
        candidates: [],
        status: 'draft'
    });
    const [availableRegions] = useState([
        'North District', 'South District', 'East District', 'West District',
        'Central District', 'Metropolitan Area', 'Rural Areas'
    ]);

    useEffect(() => {
        loadElections();
    }, []);

    const loadElections = async () => {
        try {
            // Mock data - replace with actual API call
            const mockElections = [
                {
                    id: 1,
                    title: 'Presidential Election 2025',
                    description: 'National presidential election',
                    startDate: '2025-11-01',
                    endDate: '2025-11-01',
                    regions: ['North District', 'South District', 'East District'],
                    candidates: [
                        { id: 1, name: 'John Smith', party: 'Democratic Party', position: 'President' },
                        { id: 2, name: 'Jane Doe', party: 'Republican Party', position: 'President' }
                    ],
                    status: 'active',
                    totalVoters: 15420,
                    votesCount: 8945
                },
                {
                    id: 2,
                    title: 'City Council Election',
                    description: 'Local city council representatives',
                    startDate: '2025-08-15',
                    endDate: '2025-08-15',
                    regions: ['Central District', 'Metropolitan Area'],
                    candidates: [
                        { id: 3, name: 'Mike Johnson', party: 'Independent', position: 'Council Member' },
                        { id: 4, name: 'Sarah Wilson', party: 'Green Party', position: 'Council Member' }
                    ],
                    status: 'scheduled',
                    totalVoters: 5620,
                    votesCount: 0
                }
            ];
            setElections(mockElections);
        } catch (error) {
            console.error('Error loading elections:', error);
            Swal.fire('Error', 'Failed to load elections', 'error');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRegionChange = (region) => {
        setFormData(prev => ({
            ...prev,
            regions: prev.regions.includes(region)
                ? prev.regions.filter(r => r !== region)
                : [...prev.regions, region]
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
                    
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Position:</label>
                    <input id="candidatePosition" class="swal2-input" placeholder="Position" style="margin-bottom: 10px;">
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Add Candidate',
            cancelButtonText: 'Cancel',
            preConfirm: () => {
                const name = document.getElementById('candidateName').value;
                const party = document.getElementById('candidateParty').value;
                const position = document.getElementById('candidatePosition').value;
                
                if (!name || !party || !position) {
                    Swal.showValidationMessage('Please fill in all fields');
                    return false;
                }
                
                return { name, party, position };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const newCandidate = {
                    id: Date.now(),
                    ...result.value
                };
                setFormData(prev => ({
                    ...prev,
                    candidates: [...prev.candidates, newCandidate]
                }));
            }
        });
    };

    const handleRemoveCandidate = (candidateId) => {
        setFormData(prev => ({
            ...prev,
            candidates: prev.candidates.filter(c => c.id !== candidateId)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.title || !formData.startDate || !formData.endDate) {
            Swal.fire('Error', 'Please fill in all required fields', 'error');
            return;
        }

        if (new Date(formData.startDate) > new Date(formData.endDate)) {
            Swal.fire('Error', 'End date must be after start date', 'error');
            return;
        }

        if (formData.regions.length === 0) {
            Swal.fire('Error', 'Please select at least one region', 'error');
            return;
        }

        if (formData.candidates.length === 0) {
            Swal.fire('Error', 'Please add at least one candidate', 'error');
            return;
        }

        try {
            const electionData = {
                ...formData,
                id: editingElection ? editingElection.id : Date.now(),
                totalVoters: 0,
                votesCount: 0
            };

            if (editingElection) {
                // Update existing election
                setElections(prev => prev.map(e => 
                    e.id === editingElection.id ? electionData : e
                ));
                Swal.fire('Success', 'Election updated successfully', 'success');
            } else {
                // Create new election
                setElections(prev => [...prev, electionData]);
                Swal.fire('Success', 'Election created successfully', 'success');
            }

            // Reset form
            setFormData({
                title: '',
                description: '',
                startDate: '',
                endDate: '',
                regions: [],
                candidates: [],
                status: 'draft'
            });
            setShowCreateForm(false);
            setEditingElection(null);
        } catch (error) {
            console.error('Error saving election:', error);
            Swal.fire('Error', 'Failed to save election', 'error');
        }
    };

    const handleEdit = (election) => {
        setEditingElection(election);
        setFormData({
            title: election.title,
            description: election.description,
            startDate: election.startDate,
            endDate: election.endDate,
            regions: election.regions,
            candidates: election.candidates,
            status: election.status
        });
        setShowCreateForm(true);
    };

    const handleDelete = (electionId) => {
        Swal.fire({
            title: 'Delete Election',
            text: 'Are you sure you want to delete this election? This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                setElections(prev => prev.filter(e => e.id !== electionId));
                Swal.fire('Deleted!', 'Election has been deleted.', 'success');
            }
        });
    };

    const handleStatusChange = (electionId, newStatus) => {
        setElections(prev => prev.map(e => 
            e.id === electionId ? { ...e, status: newStatus } : e
        ));
        Swal.fire('Updated', `Election status changed to ${newStatus}`, 'success');
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
                                <label>Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                >
                                    <option value="draft">Draft</option>
                                    <option value="scheduled">Scheduled</option>
                                    <option value="active">Active</option>
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
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>End Date *</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Regions *</label>
                            <div className="regions-grid">
                                {availableRegions.map(region => (
                                    <label key={region} className="region-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={formData.regions.includes(region)}
                                            onChange={() => handleRegionChange(region)}
                                        />
                                        <span className="checkmark"></span>
                                        {region}
                                    </label>
                                ))}
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
                                {formData.candidates.map(candidate => (
                                    <div key={candidate.id} className="candidate-item">
                                        <div className="candidate-info">
                                            <span className="candidate-name">{candidate.name}</span>
                                            <span className="candidate-party">{candidate.party}</span>
                                            <span className="candidate-position">{candidate.position}</span>
                                        </div>
                                        <button
                                            type="button"
                                            className="remove-candidate-btn"
                                            onClick={() => handleRemoveCandidate(candidate.id)}
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
                            <button type="submit" className="submit-btn">
                                {editingElection ? 'Update Election' : 'Create Election'}
                            </button>
                            <button 
                                type="button" 
                                className="cancel-btn"
                                onClick={() => {
                                    setShowCreateForm(false);
                                    setEditingElection(null);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="elections-list">
                {elections.length === 0 ? (
                    <div className="no-elections">
                        <div className="no-elections-icon">🗳️</div>
                        <h3>No Elections Found</h3>
                        <p>Create your first election to get started.</p>
                    </div>
                ) : (
                    elections.map(election => (
                        <div key={election.id} className="election-card">
                            <div className="election-header-card">
                                <div className="election-title-section">
                                    <h3>{election.title}</h3>
                                    <span 
                                        className="election-status"
                                        style={{ backgroundColor: getStatusColor(election.status) }}
                                    >
                                        {election.status.toUpperCase()}
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
                                        onClick={() => handleDelete(election.id)}
                                        title="Delete Election"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>

                            <p className="election-description">{election.description}</p>

                            <div className="election-details">
                                <div className="detail-item">
                                    <span className="detail-label">Period:</span>
                                    <span className="detail-value">
                                        {formatDate(election.startDate)} - {formatDate(election.endDate)}
                                    </span>
                                </div>

                                <div className="detail-item">
                                    <span className="detail-label">Regions:</span>
                                    <span className="detail-value">
                                        {election.regions.join(', ')}
                                    </span>
                                </div>

                                <div className="detail-item">
                                    <span className="detail-label">Candidates:</span>
                                    <span className="detail-value">
                                        {election.candidates.length} candidate{election.candidates.length !== 1 ? 's' : ''}
                                    </span>
                                </div>

                                <div className="detail-item">
                                    <span className="detail-label">Turnout:</span>
                                    <span className="detail-value">
                                        {election.votesCount} / {election.totalVoters} voters 
                                        ({election.totalVoters > 0 ? ((election.votesCount / election.totalVoters) * 100).toFixed(1) : 0}%)
                                    </span>
                                </div>
                            </div>

                            <div className="candidates-preview">
                                <h4>Candidates:</h4>
                                <div className="candidates-grid">
                                    {election.candidates.map(candidate => (
                                        <div key={candidate.id} className="candidate-preview">
                                            <span className="candidate-name">{candidate.name}</span>
                                            <span className="candidate-party">({candidate.party})</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="status-actions">
                                <label>Change Status:</label>
                                <select
                                    value={election.status}
                                    onChange={(e) => handleStatusChange(election.id, e.target.value)}
                                    className="status-select"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="scheduled">Scheduled</option>
                                    <option value="active">Active</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ElectionManagement;
