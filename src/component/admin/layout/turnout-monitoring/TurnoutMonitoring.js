import React, { useState, useEffect } from 'react';
import './TurnoutMonitoring.css';

const TurnoutMonitoring = () => {
    const [selectedElection, setSelectedElection] = useState('');
    const [elections, setElections] = useState([]);
    const [turnoutData, setTurnoutData] = useState({
        overall: {
            totalVoters: 0,
            votedCount: 0,
            percentage: 0,
            remainingTime: ''
        },
        regions: [],
        hourlyData: [],
        demographics: {
            ageGroups: [],
            genderDistribution: []
        }
    });
    const [refreshInterval, setRefreshInterval] = useState(30); // seconds
    const [lastUpdated, setLastUpdated] = useState(new Date());

    useEffect(() => {
        loadElections();
    }, []);

    useEffect(() => {
        if (selectedElection) {
            loadTurnoutData();
            
            // Set up auto-refresh
            const interval = setInterval(() => {
                loadTurnoutData();
            }, refreshInterval * 1000);

            return () => clearInterval(interval);
        }
    }, [selectedElection, refreshInterval]);

    const loadElections = async () => {
        try {
            // Mock data - replace with actual API call
            const mockElections = [
                {
                    id: 1,
                    title: 'Presidential Election 2025',
                    status: 'active',
                    startDate: '2025-07-23',
                    endDate: '2025-07-23'
                },
                {
                    id: 2,
                    title: 'City Council Election',
                    status: 'active',
                    startDate: '2025-08-15',
                    endDate: '2025-08-15'
                }
            ];
            setElections(mockElections);
            if (mockElections.length > 0) {
                setSelectedElection(mockElections[0].id.toString());
            }
        } catch (error) {
            console.error('Error loading elections:', error);
        }
    };

    const loadTurnoutData = async () => {
        try {
            // Mock data - replace with actual API call
            const mockData = {
                overall: {
                    totalVoters: 15420,
                    votedCount: 8945,
                    percentage: 58.0,
                    remainingTime: '3h 45m'
                },
                regions: [
                    { name: 'North District', totalVoters: 3240, votedCount: 2180, percentage: 67.3, trend: 'up' },
                    { name: 'South District', totalVoters: 2890, votedCount: 1634, percentage: 56.5, trend: 'stable' },
                    { name: 'East District', totalVoters: 4120, votedCount: 2380, percentage: 57.8, trend: 'up' },
                    { name: 'West District', totalVoters: 2760, votedCount: 1456, percentage: 52.8, trend: 'down' },
                    { name: 'Central District', totalVoters: 2410, votedCount: 1295, percentage: 53.7, trend: 'stable' }
                ],
                hourlyData: [
                    { hour: '08:00', votes: 245, cumulative: 245 },
                    { hour: '09:00', votes: 456, cumulative: 701 },
                    { hour: '10:00', votes: 623, cumulative: 1324 },
                    { hour: '11:00', votes: 789, cumulative: 2113 },
                    { hour: '12:00', votes: 892, cumulative: 3005 },
                    { hour: '13:00', votes: 756, cumulative: 3761 },
                    { hour: '14:00', votes: 923, cumulative: 4684 },
                    { hour: '15:00', votes: 1145, cumulative: 5829 },
                    { hour: '16:00', votes: 1289, cumulative: 7118 },
                    { hour: '17:00', votes: 1456, cumulative: 8574 },
                    { hour: '18:00', votes: 371, cumulative: 8945 }
                ],
                demographics: {
                    ageGroups: [
                        { group: '18-24', totalVoters: 2156, votedCount: 1234, percentage: 57.2 },
                        { group: '25-34', totalVoters: 3420, votedCount: 2145, percentage: 62.7 },
                        { group: '35-44', totalVoters: 3890, votedCount: 2456, percentage: 63.1 },
                        { group: '45-54', totalVoters: 2940, votedCount: 1789, percentage: 60.8 },
                        { group: '55-64', totalVoters: 1890, votedCount: 1012, percentage: 53.5 },
                        { group: '65+', totalVoters: 1124, votedCount: 309, percentage: 27.5 }
                    ],
                    genderDistribution: [
                        { gender: 'Male', totalVoters: 7890, votedCount: 4523, percentage: 57.3 },
                        { gender: 'Female', totalVoters: 7530, votedCount: 4422, percentage: 58.7 }
                    ]
                }
            };
            setTurnoutData(mockData);
            setLastUpdated(new Date());
        } catch (error) {
            console.error('Error loading turnout data:', error);
        }
    };

    const getTrendIcon = (trend) => {
        switch (trend) {
            case 'up': return '📈';
            case 'down': return '📉';
            case 'stable': return '➡️';
            default: return '➡️';
        }
    };

    const getTrendColor = (trend) => {
        switch (trend) {
            case 'up': return '#28a745';
            case 'down': return '#dc3545';
            case 'stable': return '#ffc107';
            default: return '#6c757d';
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
            election: elections.find(e => e.id.toString() === selectedElection)?.title,
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
                <h1>Turnout Monitoring</h1>
                <div className="header-controls">
                    <select
                        value={selectedElection}
                        onChange={(e) => setSelectedElection(e.target.value)}
                        className="election-select"
                    >
                        <option value="">Select Election</option>
                        {elections.map(election => (
                            <option key={election.id} value={election.id}>
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
                            <option value={10}>10s</option>
                            <option value={30}>30s</option>
                            <option value={60}>1m</option>
                            <option value={300}>5m</option>
                        </select>
                    </div>
                    
                    <button className="export-btn" onClick={exportData}>
                        📊 Export Data
                    </button>
                </div>
            </div>

            {selectedElection && (
                <>
                    <div className="last-updated">
                        Last updated: {formatTime(lastUpdated)}
                    </div>

                    {/* Overall Statistics */}
                    <div className="overall-stats">
                        <div className="stat-card primary">
                            <div className="stat-header">
                                <h3>Overall Turnout</h3>
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
                                    {turnoutData.overall.votedCount.toLocaleString()} / {turnoutData.overall.totalVoters.toLocaleString()} voters
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
                                <div className="remaining-time">
                                    Time remaining: {turnoutData.overall.remainingTime}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="monitoring-content">
                        {/* Regional Breakdown */}
                        <div className="monitoring-section">
                            <h2>Regional Breakdown</h2>
                            <div className="regions-grid">
                                {turnoutData.regions.map((region, index) => (
                                    <div key={index} className="region-card">
                                        <div className="region-header">
                                            <h4>{region.name}</h4>
                                            <div className="region-trend">
                                                <span style={{ color: getTrendColor(region.trend) }}>
                                                    {getTrendIcon(region.trend)}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="region-stats">
                                            <div className="region-percentage">
                                                <span 
                                                    className="percentage-large"
                                                    style={{ color: getPercentageColor(region.percentage) }}
                                                >
                                                    {region.percentage}%
                                                </span>
                                            </div>
                                            
                                            <div className="region-details">
                                                <div className="voter-count">
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
                                                <div className="demographic-count">
                                                    {gender.votedCount.toLocaleString()} / {gender.totalVoters.toLocaleString()}
                                                </div>
                                                <div className="progress-bar-small">
                                                    <div 
                                                        className="progress-fill-small"
                                                        style={{ 
                                                            width: `${gender.percentage}%`,
                                                            backgroundColor: getPercentageColor(gender.percentage)
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default TurnoutMonitoring;
