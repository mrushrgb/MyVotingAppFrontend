import React from 'react';
import './App.css';
import RegisterPage from './component/auth/register/RegisterPage';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './component/auth/login/LoginPage';
import UserDashboard from './component/user/layout/dashboard/UserDashboard';
import VoterDashboard from './component/user/layout/voter-dashboard/VoterDashboard';
import EligibilityCheck from './component/user/layout/eligibility-check/EligibilityCheck';
import VotingPage from './component/user/layout/voting-page/VotingPage';
import CandidateProfiles from './component/user/layout/candidate-profiles/CandidateProfiles';
import VotingStatus from './component/user/layout/voting-status/VotingStatus';
import AdminDashboard from './component/admin/layout/admin-dashboard/AdminDashboard';
import ElectionManagement from './component/admin/layout/election-management/ElectionManagement';
import DisputeManagement from './component/admin/layout/dispute-management/DisputeManagement';
import TurnoutMonitoring from './component/admin/layout/turnout-monitoring/TurnoutMonitoring';
import SystemLogs from './component/admin/layout/system-logs/SystemLogs';

// BASE_URL is now centralized in src/config/api.js
// Import from there if needed: import { BASE_URL } from './config/api';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<VoterDashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/new-user" element={<RegisterPage />} />

        {/* Direct User/Voter Routes (for development) */}
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/voter/dashboard" element={<VoterDashboard />} />
        <Route path="/voter/eligibility" element={<EligibilityCheck />} />
        <Route path="/voter/voting" element={<VotingPage />} />
        <Route path="/voter/candidates" element={<CandidateProfiles />} />
        <Route path="/voter/status" element={<VotingStatus />} />

        {/* Direct Admin Routes (for development) */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/elections" element={<ElectionManagement />} />
        <Route path="/admin/disputes" element={<DisputeManagement />} />
        <Route path="/admin/turnout" element={<TurnoutMonitoring />} />
        <Route path="/admin/logs" element={<SystemLogs />} />

        {/* Additional Routes */}
        <Route path="/auth" element={<UserDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
