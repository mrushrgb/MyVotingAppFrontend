import React from 'react';
import './App.css';
import RegisterPage from './component/auth/register/RegisterPage';
import { Route, Routes, Navigate } from 'react-router-dom';
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
import ProtectedRoute from './components/ProtectedRoute';

// BASE_URL is now centralized in src/config/api.js
// Import from there if needed: import { BASE_URL } from './config/api';


function App() {
  return (
    <div className="App">
      <Routes>
        {/* Redirect root to login page */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Public Routes - Login and Register only */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/new-user" element={<RegisterPage />} />

        {/* Protected User/Voter Routes */}
        <Route path="/user" element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        } />
        <Route path="/voter/dashboard" element={
          <ProtectedRoute>
            <VoterDashboard />
          </ProtectedRoute>
        } />
        <Route path="/voter/eligibility" element={
          <ProtectedRoute>
            <EligibilityCheck />
          </ProtectedRoute>
        } />
        <Route path="/voter/voting" element={
          <ProtectedRoute>
            <VotingPage />
          </ProtectedRoute>
        } />
        <Route path="/voter/candidates" element={
          <ProtectedRoute>
            <CandidateProfiles />
          </ProtectedRoute>
        } />
        <Route path="/voter/status" element={
          <ProtectedRoute>
            <VotingStatus />
          </ProtectedRoute>
        } />

        {/* Protected Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/elections" element={
          <ProtectedRoute requiredRole="admin">
            <ElectionManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/disputes" element={
          <ProtectedRoute requiredRole="admin">
            <DisputeManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/turnout" element={
          <ProtectedRoute requiredRole="admin">
            <TurnoutMonitoring />
          </ProtectedRoute>
        } />
        <Route path="/admin/logs" element={
          <ProtectedRoute requiredRole="admin">
            <SystemLogs />
          </ProtectedRoute>
        } />

        {/* Additional Protected Routes */}
        <Route path="/auth" element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;
