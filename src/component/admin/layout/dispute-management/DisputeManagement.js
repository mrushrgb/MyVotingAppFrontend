import React, { useState, useEffect } from 'react';
import './DisputeManagement.css';
import Swal from 'sweetalert2';
import AdminNavigation from '../../navigation/AdminNavigation';

const DisputeManagement = () => {
    const [disputes, setDisputes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadDisputes();
    }, []);

    const loadDisputes = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Mock data - replace with actual API calls
            setDisputes([
                {
                    id: 'DIS-001',
                    type: 'Vote Count Discrepancy',
                    description: 'Voter claims their vote was not counted correctly in Election ID: ELE-2025-001',
                    submittedBy: 'John Smith',
                    submittedAt: '2025-08-09 10:30:00',
                    status: 'pending',
                    priority: 'high',
                    assignedTo: 'Admin Sarah',
                    electionId: 'ELE-2025-001',
                    voterInfo: {
                        id: 'V001234',
                        name: 'John Smith',
                        contact: 'john.smith@email.com'
                    }
                },
                {
                    id: 'DIS-002',
                    type: 'Technical Issue',
                    description: 'Voting system crashed during peak voting hours',
                    submittedBy: 'System Monitor',
                    submittedAt: '2025-08-08 14:15:00',
                    status: 'investigating',
                    priority: 'critical',
                    assignedTo: 'Tech Team',
                    electionId: 'ELE-2025-002',
                    voterInfo: null
                },
                {
                    id: 'DIS-003',
                    type: 'Identity Verification',
                    description: 'Voter unable to complete biometric verification',
                    submittedBy: 'Mary Johnson',
                    submittedAt: '2025-08-08 09:45:00',
                    status: 'resolved',
                    priority: 'medium',
                    assignedTo: 'Admin John',
                    electionId: 'ELE-2025-001',
                    voterInfo: {
                        id: 'V005678',
                        name: 'Mary Johnson',
                        contact: 'mary.johnson@email.com'
                    }
                }
            ]);
        } catch (error) {
            console.error('Error loading disputes:', error);
            setError('Failed to load disputes');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (disputeId, newStatus) => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            
            setDisputes(prev => prev.map(dispute => 
                dispute.id === disputeId 
                    ? { ...dispute, status: newStatus }
                    : dispute
            ));

            Swal.fire({
                title: 'Status Updated',
                text: `Dispute ${disputeId} status changed to ${newStatus}`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Error updating dispute status:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to update dispute status',
                icon: 'error'
            });
        }
    };

    const handleViewDetails = (dispute) => {
        Swal.fire({
            title: `Dispute Details: ${dispute.id}`,
            html: `
                <div class="dispute-details">
                    <p><strong>Type:</strong> ${dispute.type}</p>
                    <p><strong>Description:</strong> ${dispute.description}</p>
                    <p><strong>Submitted By:</strong> ${dispute.submittedBy}</p>
                    <p><strong>Submitted At:</strong> ${dispute.submittedAt}</p>
                    <p><strong>Status:</strong> <span class="status-${dispute.status}">${dispute.status}</span></p>
                    <p><strong>Priority:</strong> <span class="priority-${dispute.priority}">${dispute.priority}</span></p>
                    <p><strong>Assigned To:</strong> ${dispute.assignedTo}</p>
                    <p><strong>Election ID:</strong> ${dispute.electionId}</p>
                    ${dispute.voterInfo ? `
                        <hr>
                        <h4>Voter Information:</h4>
                        <p><strong>Voter ID:</strong> ${dispute.voterInfo.id}</p>
                        <p><strong>Name:</strong> ${dispute.voterInfo.name}</p>
                        <p><strong>Contact:</strong> ${dispute.voterInfo.contact}</p>
                    ` : ''}
                </div>
            `,
            width: '600px',
            confirmButtonText: 'Close'
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            'pending': '#ffc107',
            'investigating': '#17a2b8',
            'resolved': '#28a745',
            'rejected': '#dc3545'
        };
        return colors[status] || '#6c757d';
    };

    const getPriorityColor = (priority) => {
        const colors = {
            'low': '#28a745',
            'medium': '#ffc107',
            'high': '#fd7e14',
            'critical': '#dc3545'
        };
        return colors[priority] || '#6c757d';
    };

    const filteredDisputes = disputes.filter(dispute => {
        const matchesStatus = filterStatus === 'all' || dispute.status === filterStatus;
        const matchesSearch = dispute.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             dispute.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             dispute.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    return (
        <div className="app-layout">
            <AdminNavigation />
            <div className="dispute-management-container">
                {error && (
                    <div className="error-banner">
                        <span>⚠️ {error}</span>
                        <button onClick={() => setError(null)}>✕</button>
                    </div>
                )}

                <div className="dispute-header">
                    <h1>⚖️ Dispute Management</h1>
                    <p>Handle voting disputes and resolve issues effectively</p>
                </div>

                {/* Filters */}
                <div className="dispute-filters">
                    <div className="filter-group">
                        <label>Filter by Status:</label>
                        <select 
                            value={filterStatus} 
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="investigating">Investigating</option>
                            <option value="resolved">Resolved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Search:</label>
                        <input
                            type="text"
                            placeholder="Search disputes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </div>

                {/* Disputes List */}
                <div className="disputes-section">
                    {loading ? (
                        <div className="loading-state">
                            <div className="loading-spinner"></div>
                            <p>Loading disputes...</p>
                        </div>
                    ) : filteredDisputes.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📋</div>
                            <p>No disputes found</p>
                        </div>
                    ) : (
                        <div className="disputes-grid">
                            {filteredDisputes.map(dispute => (
                                <div key={dispute.id} className="dispute-card">
                                    <div className="dispute-header-card">
                                        <div className="dispute-id">{dispute.id}</div>
                                        <div className="dispute-priority">
                                            <span 
                                                className="priority-badge"
                                                style={{ backgroundColor: getPriorityColor(dispute.priority) }}
                                            >
                                                {dispute.priority.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="dispute-content">
                                        <h3 className="dispute-type">{dispute.type}</h3>
                                        <p className="dispute-description">{dispute.description}</p>
                                        
                                        <div className="dispute-meta">
                                            <div className="meta-item">
                                                <strong>Submitted by:</strong> {dispute.submittedBy}
                                            </div>
                                            <div className="meta-item">
                                                <strong>Date:</strong> {dispute.submittedAt}
                                            </div>
                                            <div className="meta-item">
                                                <strong>Assigned to:</strong> {dispute.assignedTo}
                                            </div>
                                        </div>

                                        <div className="dispute-status">
                                            <span 
                                                className="status-badge"
                                                style={{ backgroundColor: getStatusColor(dispute.status) }}
                                            >
                                                {dispute.status.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="dispute-actions">
                                        <button
                                            className="action-btn view"
                                            onClick={() => handleViewDetails(dispute)}
                                        >
                                            👁️ View Details
                                        </button>
                                        
                                        <select
                                            className="status-select"
                                            value={dispute.status}
                                            onChange={(e) => handleStatusChange(dispute.id, e.target.value)}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="investigating">Investigating</option>
                                            <option value="resolved">Resolved</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DisputeManagement;
