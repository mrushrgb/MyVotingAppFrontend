import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './CandidateProfiles.css';

const CandidateProfiles = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [filterBy, setFilterBy] = useState('all');

    const candidates = useMemo(() => [
        {
            id: 'cand_1',
            name: 'John Smith',
            party: 'Democratic Party',
            position: 'President',
            image: 'https://via.placeholder.com/200x200?text=Candidate',
            age: 58,
            education: 'Harvard Law School, J.D.; Yale University, B.A.',
            experience: [
                'U.S. Senator (2010-2025)',
                'Governor of California (2006-2010)',
                'District Attorney (2002-2006)',
                'Private Practice Attorney (1995-2002)'
            ],
            achievements: [
                'Authored 15 major bills including Healthcare Reform Act',
                'Led bipartisan infrastructure initiative',
                'Reduced state unemployment by 3.2%',
                'Champion for environmental protection'
            ],
            platform: {
                healthcare: 'Universal healthcare access with public option',
                economy: 'Investment in clean energy jobs and infrastructure',
                education: 'Free community college and student debt relief',
                environment: 'Net zero emissions by 2035',
                immigration: 'Comprehensive immigration reform with pathway to citizenship'
            },
            endorsements: [
                'Teachers Union',
                'Environmental Action Group',
                'Labor Coalition',
                'Healthcare Workers Alliance'
            ],
            socialMedia: {
                twitter: '@johnsmith2025',
                facebook: 'JohnSmithForPresident',
                website: 'www.johnsmith2025.com'
            },
            financialInfo: {
                totalRaised: '$45,000,000',
                expenditures: '$32,000,000',
                cashOnHand: '$13,000,000'
            }
        },
        {
            id: 'cand_2',
            name: 'Sarah Johnson',
            party: 'Republican Party',
            position: 'President',
            image: 'https://via.placeholder.com/200x200?text=Candidate',
            age: 52,
            education: 'Stanford Business School, M.B.A.; University of Texas, B.S.',
            experience: [
                'U.S. Senator (2012-2025)',
                'State Secretary of Commerce (2008-2012)',
                'CEO of Johnson Enterprises (2000-2008)',
                'Management Consultant (1995-2000)'
            ],
            achievements: [
                'Led tax reform legislation saving families $2,000 annually',
                'Created 50,000 jobs through small business initiatives',
                'Balanced state budget for 4 consecutive years',
                'Champion for veterans\' rights'
            ],
            platform: {
                economy: 'Lower taxes and reduced government regulation',
                defense: 'Strong military and border security',
                healthcare: 'Market-based healthcare solutions',
                education: 'School choice and parental rights',
                energy: 'Energy independence through domestic production'
            },
            endorsements: [
                'Chamber of Commerce',
                'Veterans Association',
                'Police Benevolent Association',
                'Small Business Coalition'
            ],
            socialMedia: {
                twitter: '@sarahjohnson2025',
                facebook: 'SarahJohnsonForAmerica',
                website: 'www.sarahjohnson2025.com'
            },
            financialInfo: {
                totalRaised: '$38,000,000',
                expenditures: '$28,000,000',
                cashOnHand: '$10,000,000'
            }
        },
        {
            id: 'cand_3',
            name: 'Michael Davis',
            party: 'Independent',
            position: 'President',
            image: 'https://via.placeholder.com/200x200?text=Candidate',
            age: 49,
            education: 'Georgetown University, M.P.A.; Notre Dame, B.A.',
            experience: [
                'Governor of Colorado (2017-2025)',
                'State Representative (2010-2017)',
                'City Mayor (2006-2010)',
                'Non-profit Director (2000-2006)'
            ],
            achievements: [
                'Reformed state government reducing bureaucracy by 25%',
                'Implemented transparent budgeting process',
                'United divided legislature on infrastructure bill',
                'Pioneer in government innovation'
            ],
            platform: {
                government: 'Government transparency and accountability',
                unity: 'Bridging partisan divides for common solutions',
                innovation: 'Technology-driven government efficiency',
                economy: 'Support for both workers and businesses',
                democracy: 'Campaign finance reform and voting rights'
            },
            endorsements: [
                'Good Government Coalition',
                'Independent Voters Alliance',
                'Transparency International',
                'Reform Movement'
            ],
            socialMedia: {
                twitter: '@michaeldavis2025',
                facebook: 'MichaelDavisIndependent',
                website: 'www.davisforcbange.com'
            },
            financialInfo: {
                totalRaised: '$15,000,000',
                expenditures: '$12,000,000',
                cashOnHand: '$3,000,000'
            }
        },
        // Add more candidates for other positions
        {
            id: 'sen_1',
            name: 'Emily Rodriguez',
            party: 'Democratic Party',
            position: 'U.S. Senator',
            image: 'https://via.placeholder.com/200x200?text=Candidate',
            age: 45,
            education: 'Columbia Law School, J.D.; UCLA, B.A.',
            experience: [
                'U.S. Representative (2015-2025)',
                'State Senator (2010-2015)',
                'Public Defender (2005-2010)',
                'Community Organizer (2002-2005)'
            ],
            achievements: [
                'Authored landmark education funding bill',
                'Increased infrastructure spending by $2B',
                'Championed affordable housing initiatives',
                'Advocate for criminal justice reform'
            ],
            platform: {
                education: 'Increased funding for public schools and teachers',
                infrastructure: 'Modernizing roads, bridges, and broadband',
                housing: 'Affordable housing for working families',
                justice: 'Police reform and criminal justice modernization',
                immigration: 'Humane immigration policies'
            },
            endorsements: [
                'Education Association',
                'Construction Workers Union',
                'Civil Rights Coalition',
                'Progressive Alliance'
            ],
            socialMedia: {
                twitter: '@emilyrodriguez',
                facebook: 'EmilyRodriguezForSenate',
                website: 'www.rodriguez4senate.com'
            },
            financialInfo: {
                totalRaised: '$8,500,000',
                expenditures: '$6,200,000',
                cashOnHand: '$2,300,000'
            }
        }
    ], []);

    const filteredCandidates = filterBy === 'all' 
        ? candidates 
        : candidates.filter(candidate => candidate.position === filterBy);

    useEffect(() => {
        // If coming from voting page with specific candidate ID
        if (location.state?.candidateId) {
            const candidate = candidates.find(c => c.id === location.state.candidateId);
            if (candidate) {
                setSelectedCandidate(candidate);
            }
        }
    }, [location.state, candidates]);

    const renderPlatformItem = (key, value) => (
        <div key={key} className="platform-item">
            <h6>{key.charAt(0).toUpperCase() + key.slice(1)}</h6>
            <p>{value}</p>
        </div>
    );

    return (
        <div className="candidate-profiles">
            <div className="container">
                {/* Header */}
                <div className="profiles-header">
                    <button 
                        className="btn btn-outline-light back-btn"
                        onClick={() => navigate('/voter/dashboard')}
                    >
                        <i className="fas fa-arrow-left"></i> Back to Dashboard
                    </button>
                    <h1>Candidate Profiles</h1>
                    <p>Learn about the candidates and their positions on key issues</p>
                </div>

                {!selectedCandidate ? (
                    <>
                        {/* Filter Section */}
                        <div className="filter-section">
                            <h3>Filter by Position</h3>
                            <div className="filter-buttons">
                                <button 
                                    className={`btn ${filterBy === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => setFilterBy('all')}
                                >
                                    All Candidates
                                </button>
                                <button 
                                    className={`btn ${filterBy === 'President' ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => setFilterBy('President')}
                                >
                                    President
                                </button>
                                <button 
                                    className={`btn ${filterBy === 'U.S. Senator' ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => setFilterBy('U.S. Senator')}
                                >
                                    U.S. Senator
                                </button>
                                <button 
                                    className={`btn ${filterBy === 'U.S. Representative' ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => setFilterBy('U.S. Representative')}
                                >
                                    U.S. Representative
                                </button>
                            </div>
                        </div>

                        {/* Candidates Grid */}
                        <div className="candidates-overview">
                            <div className="candidates-grid">
                                {filteredCandidates.map(candidate => (
                                    <div 
                                        key={candidate.id} 
                                        className="candidate-overview-card"
                                        onClick={() => setSelectedCandidate(candidate)}
                                    >
                                        <div className="candidate-photo">
                                            <img 
                                                src={candidate.image} 
                                                alt={candidate.name}
                                                onError={(e) => {
                                                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMTAwQzc0LjUgMTAwIDU0IDk1LjUgNTQgNzBDMTAwIDQ0IDEwMCA0NCAxMDAgNDRDMTAwIDQ0IDE0NiA0NCAxNDYgNzBDMTQ2IDk1LjUgMTI1LjUgMTAwIDEwMCAxMDBaIiBmaWxsPSIjOUNBOUJBIi8+CjxwYXRoIGQ9Ik0xMDAgMTA0QzEyNS41IDEwNCAxNDYgMTA4LjUgMTQ2IDEzMkMxNDYgMTU2IDE0NiAxNTYgMTQ2IDE1Nkg1NEM1NCAxNTYgNTQgMTU2IDU0IDEzMkM1NCAxMDguNSA3NC41IDEwNCAxMDAgMTA0WiIgZmlsbD0iIzlDQTlCQSIvPgo8L3N2Zz4K';
                                                }}
                                            />
                                        </div>
                                        <div className="candidate-basic-info">
                                            <h4>{candidate.name}</h4>
                                            <p className="party">{candidate.party}</p>
                                            <p className="position">{candidate.position}</p>
                                            <p className="experience-summary">
                                                {candidate.experience[0]}
                                            </p>
                                        </div>
                                        <div className="card-action">
                                            <i className="fas fa-arrow-right"></i>
                                            View Full Profile
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    /* Detailed Profile View */
                    <div className="candidate-detail">
                        <button 
                            className="btn btn-outline-secondary btn-sm mb-3"
                            onClick={() => setSelectedCandidate(null)}
                        >
                            <i className="fas fa-arrow-left"></i> Back to Candidates
                        </button>

                        <div className="candidate-header">
                            <div className="candidate-photo-large">
                                <img 
                                    src={selectedCandidate.image} 
                                    alt={selectedCandidate.name}
                                    onError={(e) => {
                                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMTAwQzc0LjUgMTAwIDU0IDk1LjUgNTQgNzBDMTAwIDQ0IDEwMCA0NCAxMDAgNDRDMTAwIDQ0IDE0NiA0NCAxNDYgNzBDMTQ2IDk1LjUgMTI1LjUgMTAwIDEwMCAxMDBaIiBmaWxsPSIjOUNBOUJBIi8+CjxwYXRoIGQ9Ik0xMDAgMTA0QzEyNS41IDEwNCAxNDYgMTA4LjUgMTQ2IDEzMkMxNDYgMTU2IDE0NiAxNTYgMTQ2IDE1Nkg1NEM1NCAxNTYgNTQgMTU2IDU0IDEzMkM1NCAxMDguNSA3NC41IDEwNCAxMDAgMTA0WiIgZmlsbD0iIzlDQTlCQSIvPgo8L3N2Zz4K';
                                    }}
                                />
                            </div>
                            <div className="candidate-info">
                                <h2>{selectedCandidate.name}</h2>
                                <p className="party-position">{selectedCandidate.party} • {selectedCandidate.position}</p>
                                <p className="age">Age: {selectedCandidate.age}</p>
                                <div className="education">
                                    <h5>Education</h5>
                                    <p>{selectedCandidate.education}</p>
                                </div>
                            </div>
                        </div>

                        <div className="profile-content">
                            <div className="row">
                                <div className="col-md-8">
                                    {/* Experience Section */}
                                    <div className="profile-section">
                                        <h4>Professional Experience</h4>
                                        <div className="experience-timeline">
                                            {selectedCandidate.experience.map((exp, index) => (
                                                <div key={index} className="timeline-item">
                                                    <div className="timeline-marker"></div>
                                                    <div className="timeline-content">
                                                        <p>{exp}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Achievements Section */}
                                    <div className="profile-section">
                                        <h4>Key Achievements</h4>
                                        <ul className="achievements-list">
                                            {selectedCandidate.achievements.map((achievement, index) => (
                                                <li key={index}>{achievement}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Platform Section */}
                                    <div className="profile-section">
                                        <h4>Policy Platform</h4>
                                        <div className="platform-grid">
                                            {Object.entries(selectedCandidate.platform).map(([key, value]) => 
                                                renderPlatformItem(key, value)
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    {/* Endorsements */}
                                    <div className="profile-section">
                                        <h4>Endorsements</h4>
                                        <div className="endorsements-list">
                                            {selectedCandidate.endorsements.map((endorsement, index) => (
                                                <div key={index} className="endorsement-item">
                                                    <i className="fas fa-check-circle"></i>
                                                    {endorsement}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Social Media */}
                                    <div className="profile-section">
                                        <h4>Connect Online</h4>
                                        <div className="social-media-links">
                                            <a href={`https://twitter.com/${selectedCandidate.socialMedia.twitter}`} target="_blank" rel="noopener noreferrer" className="social-link twitter">
                                                <i className="fab fa-twitter"></i>
                                                {selectedCandidate.socialMedia.twitter}
                                            </a>
                                            <a href={`https://facebook.com/${selectedCandidate.socialMedia.facebook}`} target="_blank" rel="noopener noreferrer" className="social-link facebook">
                                                <i className="fab fa-facebook"></i>
                                                Facebook
                                            </a>
                                            <a href={`https://${selectedCandidate.socialMedia.website}`} target="_blank" rel="noopener noreferrer" className="social-link website">
                                                <i className="fas fa-globe"></i>
                                                Official Website
                                            </a>
                                        </div>
                                    </div>

                                    {/* Financial Information */}
                                    <div className="profile-section">
                                        <h4>Campaign Finance</h4>
                                        <div className="financial-info">
                                            <div className="financial-item">
                                                <label>Total Raised:</label>
                                                <span>{selectedCandidate.financialInfo.totalRaised}</span>
                                            </div>
                                            <div className="financial-item">
                                                <label>Expenditures:</label>
                                                <span>{selectedCandidate.financialInfo.expenditures}</span>
                                            </div>
                                            <div className="financial-item">
                                                <label>Cash on Hand:</label>
                                                <span>{selectedCandidate.financialInfo.cashOnHand}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="profile-actions">
                            <button 
                                className="btn btn-success btn-lg"
                                onClick={() => navigate('/voter/voting')}
                            >
                                <i className="fas fa-vote-yea"></i>
                                Vote for {selectedCandidate.name}
                            </button>
                            <button 
                                className="btn btn-outline-info btn-lg"
                                onClick={() => window.print()}
                            >
                                <i className="fas fa-print"></i>
                                Print Profile
                            </button>
                            <button 
                                className="btn btn-outline-secondary btn-lg"
                                onClick={() => {
                                    navigator.share({
                                        title: `${selectedCandidate.name} - Candidate Profile`,
                                        text: `Learn about ${selectedCandidate.name}'s platform and experience`,
                                        url: window.location.href
                                    });
                                }}
                            >
                                <i className="fas fa-share"></i>
                                Share Profile
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CandidateProfiles;
