import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import './VotingStatus.css';

const VotingStatus = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [votingHistory, setVotingHistory] = useState([
        {
            id: 1,
            electionTitle: 'Presidential Election 2024',
            date: '2024-11-05',
            status: 'completed',
            timestamp: '2024-11-05T14:30:00Z',
            votes: {
                president: { candidate: 'Jane Doe', party: 'Democratic Party' }
            },
            receiptId: 'RCP-2024-001-VTR123456789'
        }
    ]);

    const [currentVote, setCurrentVote] = useState(null);

    useEffect(() => {
        // If coming from voting page with new vote
        if (location.state?.votedElection) {
            // try to get voter information from localStorage (set at login/dashboard)
            let savedUserRaw = localStorage.getItem('userData') || localStorage.getItem('voterData');
            let savedUser = null;
            try { savedUser = savedUserRaw ? JSON.parse(savedUserRaw) : null; } catch (e) { savedUser = null; }

            const voterName = savedUser?.name || savedUser?.auth || 'Voter';
            const voterId = savedUser?.voterId || savedUser?.id || savedUser?._id || ('VTR' + Math.floor(100000 + Math.random() * 900000));
            const constituency = savedUser?.constituency || 'Unknown';

            const newVote = {
                id: Date.now(),
                electionTitle: location.state.votedElection.title,
                date: new Date().toISOString().split('T')[0],
                status: 'completed',
                timestamp: location.state.timestamp,
                votes: {},
                voterName,
                voterId,
                constituency,
                receiptId: `RCP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}-${voterId}`
            };

            // Process the submitted votes
            location.state.votedElection.positions.forEach(position => {
                const candidateId = location.state.submittedVotes[position.id];
                if (candidateId) {
                    const candidate = position.candidates.find(c => c.id === candidateId);
                    if (candidate) {
                        newVote.votes[position.id] = {
                            candidate: candidate.name,
                            party: candidate.party,
                            position: position.title
                        };
                    }
                }
            });

            setCurrentVote(newVote);
            setVotingHistory(prev => [newVote, ...prev]);
        }
    }, [location.state]);

    const generatePDFReceipt = (vote) => {
        const receiptContent = `
            <div>
                <style>
                    /* Force monochrome/black rendering for PDF receipts */
                    html, body, * {
                        color: #000000 !important;
                        background: transparent !important;
                        background-color: #ffffff !important;
                        border-color: #000000 !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    table, th, td { color: #000000 !important; }
                    svg, path { fill: #000000 !important; stroke: #000000 !important; }
                    img { filter: grayscale(100%) !important; }
                    .receipt-container { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 2px solid #000; background: #ffffff; color: #000000; }
                    .receipt-container h1, .receipt-container h3 { color: #000000 !important; }
                </style>

                <div class="receipt-container">
                    <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="margin-bottom: 10px;">OFFICIAL VOTING RECEIPT</h1>
                    <p style="color: #000000; font-size: 14px;">This is your official confirmation of votes cast</p>
                    <div style="background: #ffffff; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <strong>Receipt ID: ${vote.receiptId}</strong>
                    </div>
                </div>

                <div style="margin-bottom: 30px;">
                    <h3 style="border-bottom: 2px solid #000000; padding-bottom: 8px;">Voter Information</h3>
                    <table style="width: 100%; margin-top: 15px;">
                        <tr><td style="padding: 8px 0; font-weight: bold;">Voter ID:</td><td style="padding: 8px 0;">${vote.voterId || 'VTR000000000'}</td></tr>
                        <tr><td style="padding: 8px 0; font-weight: bold;">Name:</td><td style="padding: 8px 0;">${vote.voterName || 'Unnamed Voter'}</td></tr>
                        <tr><td style="padding: 8px 0; font-weight: bold;">Constituency:</td><td style="padding: 8px 0;">${vote.constituency || 'Unknown'}</td></tr>
                        <tr><td style="padding: 8px 0; font-weight: bold;">Voting Date:</td><td style="padding: 8px 0;">${new Date(vote.timestamp).toLocaleDateString()}</td></tr>
                        <tr><td style="padding: 8px 0; font-weight: bold;">Voting Time:</td><td style="padding: 8px 0;">${new Date(vote.timestamp).toLocaleTimeString()}</td></tr>
                    </table>
                </div>

                <div style="margin-bottom: 30px;">
                    <h3 style="border-bottom: 2px solid #000000; padding-bottom: 8px;">Election Details</h3>
                    <p style="margin-top: 15px;"><strong>Election:</strong> ${vote.electionTitle}</p>
                    <p><strong>Election Date:</strong> ${vote.date}</p>
                </div>

                <div style="margin-bottom: 30px;">
                    <h3 style="border-bottom: 2px solid #000000; padding-bottom: 8px;">Votes Cast</h3>
                    ${Object.entries(vote.votes).map(([position, voteData]) => `
                        <div style="background: #ffffff; padding: 15px; margin: 10px 0; border-radius: 8px;">
                            <p style="margin: 0 0 8px 0;"><strong>Position:</strong> ${voteData.position}</p>
                            <p style="margin: 0 0 8px 0;"><strong>Candidate:</strong> ${voteData.candidate}</p>
                            <p style="margin: 0;"><strong>Party:</strong> ${voteData.party}</p>
                        </div>
                    `).join('')}
                </div>

                <div style="border-top: 2px solid #000000; padding-top: 20px; text-align: center;">
                    <p style="font-size: 12px; margin-bottom: 10px;">
                        This receipt confirms that your votes have been recorded in the electoral system.
                    </p>
                    <p style="font-size: 12px; margin-bottom: 10px;">
                        Keep this receipt for your records. It serves as proof of your participation in the democratic process.
                    </p>
                    <p style="font-size: 12px;">
                        For questions or concerns, contact the Election Commission at 1-800-VOTE-NOW
                    </p>
                </div>

                <div style="margin-top: 30px; text-align: center; border-top: 1px solid #000000; padding-top: 20px;">
                    <p style="font-weight: bold; margin: 0;">Generated on: ${new Date().toLocaleString()}</p>
                </div>
                </div>
            </div>
        `;

        const opt = {
            margin: 1,
            filename: `voting-receipt-${vote.receiptId}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(receiptContent).save();
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed':
                return <span className="badge badge-success">Completed</span>;
            case 'pending':
                return <span className="badge badge-warning">Pending</span>;
            case 'failed':
                return <span className="badge badge-danger">Failed</span>;
            default:
                return <span className="badge badge-secondary">Unknown</span>;
        }
    };

    return (
        <div className="voting-status">
            <div className="container">
                {/* Header */}
                <div className="status-header">
                    <button 
                        className="btn btn-outline-light back-btn"
                        onClick={() => navigate('/voter/dashboard')}
                    >
                        <i className="fas fa-arrow-left"></i> Back to Dashboard
                    </button>
                    <h1>Voting Status & History</h1>
                    <p>Track your voting participation and download receipts</p>
                </div>

                {/* Current Vote Confirmation */}
                {currentVote && (
                    <div className="current-vote-section">
                        <div className="success-message">
                            <div className="success-icon">
                                <i className="fas fa-check-circle"></i>
                            </div>
                            <div className="success-content">
                                <h3>Vote Successfully Recorded!</h3>
                                <p>Your votes have been securely recorded in the electoral system.</p>
                                <div className="vote-confirmation-details">
                                    <div className="confirmation-item">
                                        <label>Election:</label>
                                        <span>{currentVote.electionTitle}</span>
                                    </div>
                                    <div className="confirmation-item">
                                        <label>Date & Time:</label>
                                        <span>{new Date(currentVote.timestamp).toLocaleString()}</span>
                                    </div>
                                    <div className="confirmation-item">
                                        <label>Receipt ID:</label>
                                        <span className="receipt-id">{currentVote.receiptId}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="vote-summary-card">
                            <h4>Your Votes</h4>
                            <div className="votes-list">
                                {Object.entries(currentVote.votes).map(([position, voteData]) => (
                                    <div key={position} className="vote-item">
                                        <div className="vote-position">{voteData.position}</div>
                                        <div className="vote-candidate">
                                            <span className="candidate-name">{voteData.candidate}</span>
                                            <span className="candidate-party">({voteData.party})</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="receipt-actions">
                            <button 
                                className="btn btn-primary btn-lg"
                                onClick={() => generatePDFReceipt(currentVote)}
                            >
                                <i className="fas fa-download"></i>
                                Download PDF Receipt
                            </button>
                            <button 
                                className="btn btn-outline-primary btn-lg"
                                onClick={() => window.print()}
                            >
                                <i className="fas fa-print"></i>
                                Print Receipt
                            </button>
                        </div>
                    </div>
                )}

                {/* Voting History */}
                <div className="voting-history-section">
                    <h3>Voting History</h3>
                    {votingHistory.length > 0 ? (
                        <div className="history-list">
                            {votingHistory.map(vote => (
                                <div key={vote.id} className="history-item">
                                    <div className="history-header">
                                        <h4>{vote.electionTitle}</h4>
                                        {getStatusBadge(vote.status)}
                                    </div>
                                    <div className="history-meta">
                                        <div className="meta-item">
                                            <i className="fas fa-calendar-alt"></i>
                                            <span>{new Date(vote.timestamp).toLocaleDateString()}</span>
                                        </div>
                                        <div className="meta-item">
                                            <i className="fas fa-clock"></i>
                                            <span>{new Date(vote.timestamp).toLocaleTimeString()}</span>
                                        </div>
                                        <div className="meta-item">
                                            <i className="fas fa-receipt"></i>
                                            <span>{vote.receiptId}</span>
                                        </div>
                                    </div>
                                    <div className="history-votes">
                                        <h5>Votes Cast:</h5>
                                        <div className="votes-grid">
                                            {Object.entries(vote.votes).map(([position, voteData]) => (
                                                <div key={position} className="vote-summary-item">
                                                    <span className="position-title">{voteData.position}:</span>
                                                    <span className="candidate-info">
                                                        {voteData.candidate} ({voteData.party})
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="history-actions">
                                        <button 
                                            className="btn btn-outline-primary btn-sm"
                                            onClick={() => generatePDFReceipt(vote)}
                                        >
                                            <i className="fas fa-download"></i>
                                            Download Receipt
                                        </button>
                                        <button 
                                            className="btn btn-outline-secondary btn-sm"
                                            onClick={() => {
                                                navigator.share({
                                                    title: 'Voting Receipt',
                                                    text: `I voted in ${vote.electionTitle} on ${new Date(vote.timestamp).toLocaleDateString()}`,
                                                    url: window.location.href
                                                });
                                            }}
                                        >
                                            <i className="fas fa-share"></i>
                                            Share
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-history">
                            <div className="no-history-icon">
                                <i className="fas fa-vote-yea"></i>
                            </div>
                            <h4>No Voting History</h4>
                            <p>You haven't participated in any elections yet.</p>
                            <button 
                                className="btn btn-primary"
                                onClick={() => navigate('/voter/voting')}
                            >
                                <i className="fas fa-vote-yea"></i>
                                Vote in Available Elections
                            </button>
                        </div>
                    )}
                </div>

                {/* Voting Statistics */}
                <div className="voting-statistics">
                    <h3>Your Voting Statistics</h3>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">
                                <i className="fas fa-vote-yea"></i>
                            </div>
                            <div className="stat-content">
                                <h4>{votingHistory.length}</h4>
                                <p>Total Elections</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <i className="fas fa-calendar-check"></i>
                            </div>
                            <div className="stat-content">
                                <h4>{new Date().getFullYear()}</h4>
                                <p>Voting Since</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <i className="fas fa-trophy"></i>
                            </div>
                            <div className="stat-content">
                                <h4>100%</h4>
                                <p>Participation Rate</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <i className="fas fa-medal"></i>
                            </div>
                            <div className="stat-content">
                                <h4>Active</h4>
                                <p>Voter Status</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Important Information */}
                <div className="important-info">
                    <h3>Important Information</h3>
                    <div className="info-cards">
                        <div className="info-card">
                            <div className="info-icon">
                                <i className="fas fa-shield-alt"></i>
                            </div>
                            <div className="info-content">
                                <h5>Vote Privacy</h5>
                                <p>Your individual votes are secret and protected by law. Only aggregated results are made public.</p>
                            </div>
                        </div>
                        <div className="info-card">
                            <div className="info-icon">
                                <i className="fas fa-receipt"></i>
                            </div>
                            <div className="info-content">
                                <h5>Receipt Validity</h5>
                                <p>Your voting receipts are legally valid documents that prove your participation in elections.</p>
                            </div>
                        </div>
                        <div className="info-card">
                            <div className="info-icon">
                                <i className="fas fa-question-circle"></i>
                            </div>
                            <div className="info-content">
                                <h5>Need Help?</h5>
                                <p>Contact the Election Commission at 1-800-VOTE-NOW for any questions about your voting status.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VotingStatus;
