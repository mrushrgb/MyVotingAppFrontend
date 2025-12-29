import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './VotingPage.css';
import axios from 'axios';
import { BASE_URL } from '../../../../config/api';

const VotingPage = () => {
    const navigate = useNavigate();
    const [selectedElection, setSelectedElection] = useState(null);
    const [votes, setVotes] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [elections, setElections] = useState([]);
    const [loadingElections, setLoadingElections] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    // Sample fallback data (used if backend not reachable)
    const sampleElections = [
        {
            id: 'sample-1',
            title: 'Presidential Election 2025',
            description: 'Choose the next President of the United States',
            date: '2025-11-04',
            status: 'active',
            positions: [
                {
                    id: 'position-default',
                    title: 'President',
                    description: 'Select one candidate',
                    candidates: [
                        { id: 'cand-1', name: 'Alice Johnson', party: 'Unity Party', image: '', experience: '10 years', platform: 'Transparency and reform' },
                        { id: 'cand-2', name: 'Bob Smith', party: 'Forward Party', image: '', experience: '8 years', platform: 'Economic growth' }
                    ]
                }
            ]
        }
    ];
   // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        const load = async () => {
            setLoadingElections(true);
            setFetchError(null);
            try {
                const token = localStorage.getItem('userToken') || localStorage.getItem('token');
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                // Get ALL elections, not just active ones
                const res = await axios.get(`${BASE_URL}/api/user/elections`, { headers });
                // normalize backend shapes: backend may return flat `candidates` (no positions)
                const raw = (res.data || []);
                const userId = localStorage.getItem('id') || null;
                const items = raw.map(e => {
                    const base = { ...e, id: e._id || e.id };

                    // normalize nested positions and candidates
                    if (Array.isArray(base.positions) && base.positions.length > 0) {
                        base.positions = base.positions.map(p => ({
                            ...p,
                            id: p._id || p.id,
                            candidates: (p.candidates || []).map(c => ({ ...c, id: c._id || c.id }))
                        }));
                    } else if (Array.isArray(base.candidates) && base.candidates.length > 0) {
                        // backend uses flat candidates array - convert to a single position for frontend
                        base.positions = [
                            {
                                id: 'position-default',
                                title: 'Candidates',
                                description: base.description || '',
                                candidates: base.candidates.map(c => ({ ...c, id: c._id || c.id }))
                            }
                        ];
                    } else {
                        base.positions = base.positions || [];
                    }

                    // compute if current user already voted in this election
                    base.userHasVoted = false;
                    // fast-path: consult localStorage saved voted election ids
                    try {
                        const votedList = JSON.parse(localStorage.getItem('votedElections') || '[]');
                        if (Array.isArray(votedList) && votedList.includes(String(base.id))) {
                            base.userHasVoted = true;
                        }
                    } catch (err) {
                        // ignore
                    }

                    if (!base.userHasVoted && userId) {
                        try {
                            const votesArr = base.votes || [];
                            const localIdStr = String(userId);
                            base.userHasVoted = votesArr.some(v => {
                                // handle cases where v.userId may be an ObjectId-like, nested object, or string
                                let voteUserId = '';
                                if (!v) return false;
                                if (v.userId) {
                                    if (typeof v.userId === 'string') voteUserId = v.userId;
                                    else if (typeof v.userId === 'object') {
                                        // try common shapes
                                        if (typeof v.userId.toString === 'function') voteUserId = v.userId.toString();
                                        else if (v.userId._id) voteUserId = String(v.userId._id);
                                        else voteUserId = JSON.stringify(v.userId);
                                    } else {
                                        voteUserId = String(v.userId);
                                    }
                                } else if (v.user) {
                                    // sometimes vote record stores nested `user` object
                                    voteUserId = String(v.user._id || v.user.id || '');
                                }
                                return voteUserId && voteUserId === localIdStr;
                            });
                        } catch (e) {
                            base.userHasVoted = false;
                        }
                    }

                    return base;
                });

                setElections(items);
            } catch (err) {
                console.warn('Could not load elections from backend, using sample data.', err?.message || err);
                setFetchError(err?.response?.data?.message || err?.message || 'Failed to load elections');
                // keep fallback but surface that we're using sample data
                setElections(sampleElections);
            } finally {
                setLoadingElections(false);
            }
        };

        load();
    }, []);

    const handleCandidateSelect = (positionId, candidateId) => {
        // If this election only has one position (backend flat model), treat selection as single-choice
        const posCount = (selectedElection?.positions || []).length;
        if (posCount === 1) {
            // replace entire votes object so only a single choice exists
            setVotes({ [positionId]: candidateId });
            return;
        }

        setVotes(prev => ({
            ...prev,
            [positionId]: candidateId
        }));
    };

    const handleSubmitVotes = async () => {
        if (!selectedElection) return;

        const votedPositions = Object.keys(votes).length;

        if (votedPositions === 0) {
            Swal.fire({
                title: 'No Votes Selected',
                text: 'Please select at least one candidate before submitting.',
                icon: 'warning'
            });
            return;
        }

        const result = await Swal.fire({
            title: 'Confirm Your Votes',
            html: generateVoteConfirmationHTML(),
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Submit Votes',
            cancelButtonText: 'Review Again',
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#6c757d'
        });

        if (result.isConfirmed) {
            setIsSubmitting(true);

                // Attempt to submit votes to backend. Backend currently accepts a single vote per election (flat model).
                // Submit one vote per election: choose the single selected candidate when there's one position.
                try {
                const token = localStorage.getItem('userToken') || localStorage.getItem('token');
                const headers = token ? { Authorization: `Bearer ${token}` } : {};

                if (!token) {
                    // No token found — user not authenticated. Prompt to login.
                    await Swal.fire({ title: 'Not authenticated', text: 'Please login to submit votes.', icon: 'warning' });
                    window.location.href = '/login';
                    return;
                }

                const entries = Object.entries(votes); // [ [positionId, candidateId], ... ]

                // If more than one selection exists, the backend may not support multiple position votes per election.
                if (entries.length > 1) {
                    await Swal.fire({
                        title: 'Multiple selections detected',
                        text: 'This server supports only a single vote per election. Please select one candidate before submitting, or save locally.',
                        icon: 'warning'
                    });
                    setIsSubmitting(false);
                    return;
                }

                // Submit single vote to backend
                const [ , candidateId ] = entries[0] || [];
                if (!candidateId) {
                    throw new Error('No candidate selected');
                }

                const payload = {
                    electionId: selectedElection.id || selectedElection._id || selectedElection.id,
                    candidateId
                };

                await axios.post(`${BASE_URL}/api/user/vote`, payload, { headers });

                // Update frontend state so election is immediately locked
                try {
                    // persist voted election id for fast-path on reloads
                    const existing = JSON.parse(localStorage.getItem('votedElections') || '[]');
                    const arr = Array.isArray(existing) ? existing : [];
                    if (!arr.includes(String(selectedElection.id))) arr.push(String(selectedElection.id));
                    localStorage.setItem('votedElections', JSON.stringify(arr));

                    // update local elections state if present
                    setElections(prev => (prev || []).map(e => e.id === selectedElection.id ? { ...e, userHasVoted: true } : e));
                    setSelectedElection(prev => prev ? { ...prev, userHasVoted: true } : prev);
                } catch (e) {
                    // ignore local update errors
                }

                Swal.fire({
                    title: 'Votes Submitted Successfully!',
                    text: 'Your votes have been recorded. Thank you for participating in democracy!',
                    icon: 'success',
                    confirmButtonText: 'View Receipt'
                }).then(() => {
                    navigate('/voter/status', { 
                        state: { 
                            votedElection: selectedElection,
                            submittedVotes: votes,
                            timestamp: new Date().toISOString()
                        } 
                    });
                });

            } catch (error) {
                console.error('Vote submission error:', error);

                // If server returned 401, direct user to login
                const status = error.response?.status;
                if (status === 401) {
                    Swal.fire({ title: 'Session expired', text: 'Please login again to submit votes.', icon: 'warning' }).then(() => {
                        localStorage.removeItem('userToken');
                        window.location.href = '/login';
                    });
                    return;
                }

                // If backend failed, fallback to simulated submission but inform user that votes may not be recorded
                const fallback = await Swal.fire({
                    title: 'Submission Failed',
                    text: 'Unable to submit your votes to the server. Would you like to save locally (not recorded on the server)?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Save Locally',
                    cancelButtonText: 'Cancel'
                });

                if (fallback.isConfirmed) {
                    // Save a local receipt so the user can see their selection (not authoritative)
                    const receipts = JSON.parse(localStorage.getItem('localReceipts') || '[]');
                    receipts.push({ election: selectedElection, votes, timestamp: new Date().toISOString() });
                    localStorage.setItem('localReceipts', JSON.stringify(receipts));

                    // mark election as voted in local fast-path storage and update UI
                    try {
                        const existing = JSON.parse(localStorage.getItem('votedElections') || '[]');
                        const arr = Array.isArray(existing) ? existing : [];
                        if (!arr.includes(String(selectedElection.id))) arr.push(String(selectedElection.id));
                        localStorage.setItem('votedElections', JSON.stringify(arr));

                        setElections(prev => (prev || []).map(e => e.id === selectedElection.id ? { ...e, userHasVoted: true } : e));
                        setSelectedElection(prev => prev ? { ...prev, userHasVoted: true } : prev);
                    } catch (err) {
                        // ignore
                    }

                    Swal.fire({ title: 'Saved Locally', text: 'Your selections were saved locally but NOT recorded on the server.', icon: 'info' }).then(() => {
                        navigate('/voter/status', { state: { votedElection: selectedElection, submittedVotes: votes, timestamp: new Date().toISOString() } });
                    });
                }
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const generateVoteConfirmationHTML = () => {
        if (!selectedElection) return '';

        let html = '<div class="vote-confirmation">';
        html += `<h4>${selectedElection.title}</h4>`;
        
        selectedElection.positions.forEach(position => {
            const selectedCandidateId = votes[position.id];
            if (selectedCandidateId) {
                const candidate = position.candidates.find(c => c.id === selectedCandidateId);
                if (candidate) {
                    html += `
                        <div class="vote-item">
                            <strong>${position.title}:</strong> ${candidate.name} (${candidate.party})
                        </div>
                    `;
                }
            } else {
                html += `
                    <div class="vote-item abstain">
                        <strong>${position.title}:</strong> <em>No vote selected</em>
                    </div>
                `;
            }
        });
        
        html += '</div>';
        return html;
    };

    const getElectionStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return <span className="badge badge-success">Active - Vote Now</span>;
            case 'upcoming':
                return <span className="badge badge-warning">Upcoming</span>;
            case 'completed':
                return <span className="badge badge-secondary">Completed</span>;
            default:
                return <span className="badge badge-light">Unknown</span>;
        }
    };

    // Compute status from startsAt/endsAt when backend doesn't provide `status`
    const computeElectionStatus = (election) => {
        try {
            const now = new Date();

            const parseLenient = (value) => {
                if (!value) return null;
                const s = String(value);
                // treat YYYY-MM-DD as local date-only (midnight)
                if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
                    const dt = new Date(s + 'T00:00:00');
                    return isNaN(dt.getTime()) ? null : dt;
                }
                const dt = new Date(s);
                return isNaN(dt.getTime()) ? null : dt;
            };

            const startsRaw = election?.startsAt || election?.date || null;
            const endsRaw = election?.endsAt || election?.date || null;

            const starts = parseLenient(startsRaw);
            let ends = parseLenient(endsRaw);

            // If ends was provided as a date-only value (YYYY-MM-DD) or equals the same day
            // ensure it represents the end of that day so that elections don't auto-lock
            // on the morning of the end date due to timezone/time components.
            const rawEnds = election?.endsAt || election?.date;
            if (ends && typeof rawEnds === 'string') {
                const rawStr = String(rawEnds);
                // date-only string -> set end to local end-of-day
                if (/^(\d{4}-\d{2}-\d{2})$/.test(rawStr)) {
                    const e = new Date(ends);
                    e.setHours(23, 59, 59, 999);
                    ends = e;
                } else {
                    // If backend sent an ISO datetime that is exactly midnight (00:00:00)
                    // in UTC (common when a server encodes a date as midnight UTC),
                    // treat it as the end of that day in local time to avoid premature lock
                    // for users in positive timezones.
                    const midnIso = /T00:00:00(?:\.0+)?Z?$/.test(rawStr);
                    if (midnIso) {
                        const e = new Date(ends);
                        e.setHours(23, 59, 59, 999);
                        ends = e;
                    }
                }
            }

            if (starts && ends) {
                if (starts <= now && ends >= now) return 'active';
                if (starts > now) return 'upcoming';
                if (ends < now) return 'completed';
            }

            return election?.status || 'unknown';
        } catch (e) {
            return election?.status || 'unknown';
        }
    };

    return (
        <div className="voting-page">
            <div className="container">
                {/* Header */}
                <div className="voting-header">
                    <button 
                        className="btn btn-outline-light back-btn"
                        onClick={() => navigate('/voter/dashboard')}
                    >
                        <i className="fas fa-arrow-left"></i> Back to Dashboard
                    </button>
                    <h1>Cast Your Vote</h1>
                    <p>Exercise your democratic right to choose your representatives</p>
                </div>

                {!selectedElection ? (
                    /* Election Selection */
                    <div className="elections-list">
                        <h3>Available Elections</h3>
                        <div className="elections-grid">
                            {(elections || []).map(election => {
                                const computedStatus = computeElectionStatus(election);
                                return (
                                    <div 
                                        key={election.id} 
                                        className={`election-card ${computedStatus !== 'active' ? 'disabled' : 'clickable'}`}
                                        onClick={() => computedStatus === 'active' && !election.userHasVoted && setSelectedElection({ ...election, positions: election.positions || [] })}
                                    >
                                        <div className="election-header">
                                            <h4>{election.title}</h4>
                                            {getElectionStatusBadge(computedStatus)}
                                            {election.userHasVoted && (
                                                <span className="badge badge-info ms-2">Voted</span>
                                            )}
                                        </div>
                                        <p className="election-description">{election.description}</p>

                                        <div className="election-meta">
                                            <div className="election-date">
                                                <i className="fas fa-calendar-alt"></i>
                                                {(() => {
                                                    const d = election.startsAt ? new Date(election.startsAt) : (election.date ? new Date(election.date) : null);
                                                    return d && !isNaN(d.getTime()) ? d.toLocaleDateString() : 'TBD';
                                                })()}
                                            </div>
                                            <div className="positions-count">
                                                <i className="fas fa-users"></i>
                                                {((election.positions || []).length)} Position{((election.positions || []).length) > 1 ? 's' : ''}
                                            </div>
                                        </div>

                                        {computedStatus === 'active' && !election.userHasVoted && (
                                            <div className="election-action">
                                                <i className="fas fa-arrow-right"></i>
                                                Click to Vote
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                                {(!loadingElections && (elections || []).length === 0) && (
                                    <div className="empty-elections">
                                        <p>No available elections right now.</p>
                                        <div className="d-flex gap-2">
                                            <button className="btn btn-outline-light" onClick={() => {
                                                // re-run loader
                                                setLoadingElections(true);
                                                setFetchError(null);
                                                (async () => {
                                                    try {
                                                        const token = localStorage.getItem('userToken') || localStorage.getItem('token');
                                                        const headers = token ? { Authorization: `Bearer ${token}` } : {};
                                                        const res = await axios.get(`${BASE_URL}/api/user/elections?active=true`, { headers });
                                                            // reuse normalization logic from initial load
                                                            const raw2 = (res.data || []);
                                                            const userId2 = localStorage.getItem('id') || null;
                                                            const items = raw2.map(e => {
                                                                const base = { ...e, id: e._id || e.id };
                                                                if (Array.isArray(base.positions) && base.positions.length > 0) {
                                                                    base.positions = base.positions.map(p => ({ ...p, id: p._id || p.id, candidates: (p.candidates || []).map(c => ({ ...c, id: c._id || c.id })) }));
                                                                } else if (Array.isArray(base.candidates) && base.candidates.length > 0) {
                                                                    base.positions = [{ id: 'position-default', title: 'Candidates', description: base.description || '', candidates: base.candidates.map(c => ({ ...c, id: c._id || c.id })) }];
                                                                } else {
                                                                    base.positions = base.positions || [];
                                                                }
                                                                base.userHasVoted = false;
                                                                if (userId2) {
                                                                    try {
                                                                        const votesArr = base.votes || [];
                                                                        const localIdStr = String(userId2);
                                                                        base.userHasVoted = votesArr.some(v => {
                                                                            let voteUserId = '';
                                                                            if (!v) return false;
                                                                            if (v.userId) {
                                                                                if (typeof v.userId === 'string') voteUserId = v.userId;
                                                                                else if (typeof v.userId === 'object') {
                                                                                    if (typeof v.userId.toString === 'function') voteUserId = v.userId.toString();
                                                                                    else if (v.userId._id) voteUserId = String(v.userId._id);
                                                                                    else voteUserId = JSON.stringify(v.userId);
                                                                                } else {
                                                                                    voteUserId = String(v.userId);
                                                                                }
                                                                            } else if (v.user) {
                                                                                voteUserId = String(v.user._id || v.user.id || '');
                                                                            }
                                                                            return voteUserId && voteUserId === localIdStr;
                                                                        });
                                                                    } catch (e) {
                                                                        base.userHasVoted = false;
                                                                    }
                                                                }
                                                                return base;
                                                            });
                                                            setElections(items);
                                                    } catch (err) {
                                                        setFetchError(err?.response?.data?.message || err?.message || 'Failed to load elections');
                                                    } finally {
                                                        setLoadingElections(false);
                                                    }
                                                })();
                                            }}>Refresh</button>
                                            {fetchError && (
                                                <div style={{color: '#f8d7da', paddingTop: '6px'}}>
                                                    {fetchError}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                        </div>
                    </div>
                ) : (
                    /* Voting Interface */
                    <div className="voting-interface">
                        <div className="election-info">
                            <button 
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => setSelectedElection(null)}
                            >
                                <i className="fas fa-arrow-left"></i> Back to Elections
                            </button>
                            <h2>{selectedElection.title}</h2>
                            <p>{selectedElection.description}</p>
                        </div>

                        {(selectedElection?.positions || []).map(position => (
                            <div key={position.id} className="position-section">
                                <div className="position-header">
                                    <h3>{position.title}</h3>
                                    <p>{position.description}</p>
                                    <div className="selection-indicator">
                                        {votes[position.id] ? (
                                            <span className="badge badge-success">
                                                <i className="fas fa-check"></i> Selected
                                            </span>
                                        ) : (
                                            <span className="badge badge-light">
                                                <i className="fas fa-clock"></i> Not Selected
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="candidates-grid">
                                    {(position.candidates || []).map(candidate => (
                                        <div 
                                            key={candidate.id}
                                            className={`candidate-card ${votes[position.id] === candidate.id ? 'selected' : ''}`}
                                            onClick={() => handleCandidateSelect(position.id, candidate.id)}
                                        >
                                            <div className="candidate-photo">
                                                <img 
                                                    src={candidate.image} 
                                                    alt={candidate.name}
                                                    onError={(e) => {
                                                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik01MCA1MEMzNy4yNSA1MCAyNyA0Ny43NSAyNyAzNUM1MCAyMiA1MCAyMiA1MCAyMkM1MCAyMiA3MyAyMiA3MyAzNUM3MyA0Ny43NSA2Mi43NSA1MCA1MCA1MFoiIGZpbGw9IiM5Q0E5QkEiLz4KPHBhdGggZD0iTTUwIDUyQzYyLjc1IDUyIDczIDU0LjI1IDczIDY2QzczIDc4IDczIDc4IDczIDc4SDI3QzI3IDc4IDI3IDc4IDI3IDY2QzI3IDU0LjI1IDM3LjI1IDUyIDUwIDUyWiIgZmlsbD0iIzlDQTlCQSIvPgo8L3N2Zz4K';
                                                    }}
                                                />
                                            </div>
                                            <div className="candidate-info">
                                                <h4>{candidate.name}</h4>
                                                <p className="party">{candidate.party}</p>
                                                <p className="experience">{candidate.experience}</p>
                                                <p className="platform">{candidate.platform}</p>
                                            </div>
                                            <div className="selection-radio">
                                                <input 
                                                    type="radio" 
                                                    name={position.id}
                                                    checked={votes[position.id] === candidate.id}
                                                    onChange={() => handleCandidateSelect(position.id, candidate.id)}
                                                />
                                            </div>
                                            <button 
                                                className="btn btn-outline-info btn-sm candidate-profile-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate('/voter/candidates', { 
                                                        state: { candidateId: candidate.id } 
                                                    });
                                                }}
                                            >
                                                View Profile
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <div className="voting-actions">
                            <div className="vote-summary">
                                <h4>Vote Summary</h4>
                                <p>
                                    You have selected candidates for {Object.keys(votes).length} out of {((selectedElection?.positions || []).length)} positions.
                                </p>
                                {selectedElection.userHasVoted && (
                                    <p style={{color: '#0dcaf0', fontWeight: 600}}>You already voted in this election. Voting is disabled.</p>
                                )}
                            </div>
                            <button 
                                className="btn btn-success btn-lg submit-votes-btn"
                                onClick={handleSubmitVotes}
                                disabled={isSubmitting || Object.keys(votes).length === 0 || selectedElection.userHasVoted}
                            >
                                {isSubmitting ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i>
                                        Submitting Votes...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-vote-yea"></i>
                                        Submit Votes
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VotingPage;
