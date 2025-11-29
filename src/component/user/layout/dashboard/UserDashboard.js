import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../../../../config/api';

const UserDashboard = () => {
    const [user, setUser] = useState(null);
    const [activeElections, setActiveElections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        const load = async () => {
            try {
                setLoading(true);
                setError(null);

                const [meRes, electionsRes] = await Promise.all([
                    axios.get(`${BASE_URL}/api/user/me`),
                    axios.get(`${BASE_URL}/api/user/elections?active=true`)
                ]);

                setUser(meRes.data);
                setActiveElections(electionsRes.data || []);
            } catch (err) {
                console.error('UserDashboard load error', err);
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    return (
        <div>
            <div className='row'>
                <div className='col-12'>
                    <h2>Welcome, {user ? (user.name || user.email) : 'Voter'}!</h2>
                </div>

                <div className='col-12 col-md-4 mb-3'>
                    <div className="box">
                        <p>{loading ? '...' : activeElections.length}<br /><span>Active Elections</span></p>
                        <i className="fa fa-check-circle box-icon"></i>
                    </div>
                </div>

                <div className='col-12 col-md-4 mb-3'>
                    <div className="box">
                        <p>{user ? (user.email) : '—'}<br /><span>Your Email</span></p>
                        <i className='bx bxs-user box-icon' ></i>
                    </div>
                </div>

                <div className='col-12 col-md-4 mb-3'>
                    <div className="box">
                        <p>{user ? (user.role || 'voter') : 'voter'}<br /><span>Role</span></p>
                        <i className="fa fa-id-badge box-icon"></i>
                    </div>
                </div>

                <div className='col-12'>
                    <div className='card p-3'>
                        <h4>Active Elections</h4>
                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <p className='text-danger'>{error}</p>
                        ) : activeElections.length === 0 ? (
                            <p>No active elections at the moment.</p>
                        ) : (
                            <ul>
                                {activeElections.map(e => (
                                    <li key={e._id || e.id}>{e.title || e.name} — Ends: {new Date(e.endsAt).toLocaleString()}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserDashboard