import React, { useState, useEffect } from 'react';
import './TurnoutMonitoring.css';
import axios from 'axios';
import { API_ENDPOINTS } from '../../../../config/api';

const TurnoutMonitoring = () => {
    const [selectedElection, setSelectedElection] = useState('');
    const [elections, setElections] = useState([]);
    const [turnoutData, setTurnoutData] = useState({
        overall: {
            totalVoters: 0,
            votedCount: 0,
            percentage: 0
        },
        candidates: []
    });
    const [refreshInterval, setRefreshInterval] = useState(5); // Auto-refresh every 5 seconds
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadElections();
    }, []);

    useEffect(() => {
        if (selectedElection) {
            loadTurnoutData();
            
            // Set up auto-refresh for real-time updates
            const interval = setInterval(() => {
                loadTurnoutData();
            }, refreshInterval * 1000);

            return () => clearInterval(interval);
        }
    }, [selectedElection, refreshInterval]);

    const loadElections = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(API_ENDPOINTS.ADMIN.ELECTIONS, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const activeElections = response.data.filter(e => e.status === 'active');
            setElections(activeElections);
            if (activeElections.length > 0) {
                setSelectedElection(activeElections[0]._id);
            }
        } catch (error) {
            console.error('Error loading elections:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadTurnoutData = async () => {
        if (!selectedElection) return;
        
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${API_ENDPOINTS.ADMIN.TURNOUT}/${selectedElection}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTurnoutData(response.data);
            setLastUpdated(new Date());
        } catch (error) {
            console.error('Error loading turnout data:', error);
        }
    };

    const getPercentageColor = (percentage) => {
        if (percentage >= 70) return '#28a745';
        if (percentage >= 50) return '#ffc107';
        return '#dc3545';
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const exportData = () => {
        const dataToExport = {
            election: elections.find(e => e._id === selectedElection)?.title,
            exportTime: new Date().toISOString(),
            turnoutData
        };
        
        const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `turnout-data-${selectedElection}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="turnout-monitoring-container">
            <div className="monitoring-header">
                <h1>Real-Time Turnout Monitoring</h1>
                <div className="header-controls">
                    <select
                        value={selectedElection}
                        onChange={(e) => setSelectedElection(e.target.value)}
                        className="election-select"
                    >
                        <option value="">Select Election</option>
                        {elections.map(election => (
                            <option key={election._id} value={election._id}>
                                {election.title}
                            </option>
                        ))}
                    </select>
                    
                    <div className="refresh-controls">
                        <label>Auto-refresh:</label>
                        <select
                            value={refreshInterval}
                            onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
                            className="refresh-select"
                        >
                            <option value={5}>5s (Real-time)</option>
                            <option value={10}>10s</option>
                            <option value={30}>30s</option>
                            <option value={60}>1m</option>
                        </select>
                    </div>
                    
                    <button className="export-btn" onClick={exportData}>
                        📊 Export Data
                    </button>
                </div>
            </div>

            {loading && <div className="loading">Loading elections...</div>}

            {!loading && elections.length === 0 && (
                <div className="no-elections">
                    <h3>No Active Elections</h3>
                    <p>Create an election and set its status to "Active" to monitor turnout.</p>
                </div>
            )}

            {selectedElection && (
                <>
                    <div className="last-updated">
                        ⚡ Live Updates Every {refreshInterval}s | Last updated: {formatTime(lastUpdated)}
                    </div>

                    {/* Overall Statistics */}
                    <div className="overall-stats">
                        <div className="stat-card primary">
                            <div className="stat-header">
                                <h3>📊 Overall Turnout - {turnoutData.title}</h3>
                                <div className="stat-trend">
                                    <span 
                                        className="percentage"
                                        style={{ color: getPercentageColor(turnoutData.overall.percentage) }}
                                    >
                                        {turnoutData.overall.percentage}%
                                    </span>
                                </div>
                            </div>
                            <div className="stat-details">
                                <div className="voter-count">
                                    <strong>{turnoutData.overall.votedCount.toLocaleString()}</strong> / {turnoutData.overall.totalVoters.toLocaleString()} voters
                                </div>
                                <div className="progress-bar">
                                    <div 
                                        className="progress-fill"
                                        style={{ 
                                            width: `${turnoutData.overall.percentage}%`,
                                            backgroundColor: getPercentageColor(turnoutData.overall.percentage)
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="monitoring-content">
                        {/* Candidate Breakdown */}
                        <div className="monitoring-section">
                            <h2>🗳️ Live Vote Distribution</h2>
                            {turnoutData.candidates && turnoutData.candidates.length > 0 ? (
                                <div className="candidates-grid">
                                    {turnoutData.candidates.map((candidate, index) => (
                                        <div key={index} className="candidate-card">
                                            <div className="candidate-header">
                                                <h4>{candidate.name}</h4>
                                                <span className="party">{candidate.party}</span>
                                            </div>
                                            
                                            <div className="candidate-stats">
                                                <div className="votes-large">
                                                    <span className="votes-count">{candidate.votes}</span>
                                                    <span className="votes-label">votes</span>
                                                </div>
                                                
                                                <div className="candidate-percentage">
                                                    <span 
                                                        className="percentage-value"
                                                        style={{ color: getPercentageColor(parseFloat(candidate.percentage)) }}
                                                    >
                                                        {candidate.percentage}%
                                                    </span>
                                                </div>

                                                <div className="progress-bar small">
                                                    <div 
                                                        className="progress-fill"
                                                        style={{ 
                                                            width: `${candidate.percentage}%`,
                                                            backgroundColor: getPercentageColor(parseFloat(candidate.percentage))
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="no-data">
                                    <p>No votes cast yet. Waiting for voters...</p>
                                </div>
                            )}
                        </div>
                    </div>
                                                    {region.votedCount.toLocaleString()} / {region.totalVoters.toLocaleString()}
                                                </div>
                                                <div className="progress-bar-small">
                                                    <div 
                                                        className="progress-fill-small"
                                                        style={{ 
                                                            width: `${region.percentage}%`,
                                                            backgroundColor: getPercentageColor(region.percentage)
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Hourly Turnout Chart */}
                        <div className="monitoring-section">
                            <h2>Hourly Turnout</h2>
                            <div className="chart-container">
                                <div className="chart-legend">
                                    <div className="legend-item">
                                        <span className="legend-color hourly"></span>
                                        Hourly Votes
                                    </div>
                                    <div className="legend-item">
                                        <span className="legend-color cumulative"></span>
                                        Cumulative Votes
                                    </div>
                                </div>
                                
                                <div className="hourly-chart">
                                    {turnoutData.hourlyData.map((data, index) => {
                                        const maxVotes = Math.max(...turnoutData.hourlyData.map(d => d.votes));
                                        const maxCumulative = Math.max(...turnoutData.hourlyData.map(d => d.cumulative));
                                        
                                        return (
                                            <div key={index} className="chart-bar-group">
                                                <div className="chart-bars">
                                                    <div 
                                                        className="chart-bar hourly"
                                                        style={{ 
                                                            height: `${(data.votes / maxVotes) * 100}%`,
                                                            minHeight: '5px'
                                                        }}
                                                        title={`${data.hour}: ${data.votes} votes`}
                                                    ></div>
                                                    <div 
                                                        className="chart-bar cumulative"
                                                        style={{ 
                                                            height: `${(data.cumulative / maxCumulative) * 80}%`,
                                                            minHeight: '3px'
                                                        }}
                                                        title={`Cumulative: ${data.cumulative} votes`}
                                                    ></div>
                                                </div>
                                                <div className="chart-label">{data.hour}</div>
                                                <div className="chart-values">
                                                    <div className="hourly-value">{data.votes}</div>
                                                    <div className="cumulative-value">{data.cumulative}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="demographics-row">
                            {/* Age Demographics */}
                            <div className="monitoring-section demographics">
                                <h2>Age Demographics</h2>
                                <div className="demographics-list">
                                    {turnoutData.demographics.ageGroups.map((group, index) => (
                                        <div key={index} className="demographic-item">
                                            <div className="demographic-header">
                                                <span className="demographic-label">{group.group}</span>
                                                <span 
                                                    className="demographic-percentage"
                                                    style={{ color: getPercentageColor(group.percentage) }}
                                                >
                                                    {group.percentage}%
                                                </span>
                                            </div>
                                            <div className="demographic-details">
                                                <div className="demographic-count">
                                                    {group.votedCount.toLocaleString()} / {group.totalVoters.toLocaleString()}
                                                </div>
                                                <div className="progress-bar-small">
                                                    <div 
                                                        className="progress-fill-small"
                                                        style={{ 
                                                            width: `${group.percentage}%`,
                                                            backgroundColor: getPercentageColor(group.percentage)
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Gender Distribution */}
                            <div className="monitoring-section demographics">
                                <h2>Gender Distribution</h2>
                                <div className="demographics-list">
                                    {turnoutData.demographics.genderDistribution.map((gender, index) => (
                                        <div key={index} className="demographic-item">
                                            <div className="demographic-header">
                                                <span className="demographic-label">{gender.gender}</span>
                                                <span 
                                                    className="demographic-percentage"
                                                    style={{ color: getPercentageColor(gender.percentage) }}
                                                >
                                                    {gender.percentage}%
                                                </span>
                                            </div>
                                            <div className="demographic-details">
                    </div>
                </>
            )}
        </div>
    );
};

export default TurnoutMonitoring;
                </>
            )}
        </div>
    );
};

export default TurnoutMonitoring;
