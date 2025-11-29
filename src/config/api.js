/**
 * API Configuration
 * Centralized configuration for API endpoints
 */

// Get the base URL from environment variables
export const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: `${BASE_URL}/api/auth/register`,
    LOGIN: `${BASE_URL}/api/auth/login`,
    LOGOUT: `${BASE_URL}/api/auth/logout`,
  },
  
  // User endpoints
  USER: {
    PROFILE: `${BASE_URL}/api/user/me`,
    ELECTIONS: `${BASE_URL}/api/user/elections`,
    VOTE: `${BASE_URL}/api/user/vote`,
    VOTING_STATUS: `${BASE_URL}/api/user/voting-status`,
  },
  
  // Admin endpoints
  ADMIN: {
    STATS: `${BASE_URL}/api/admin/stats`,
    ELECTIONS: `${BASE_URL}/api/admin/elections`,
    USERS: `${BASE_URL}/api/admin/users`,
    TURNOUT: `${BASE_URL}/api/admin/turnout`,
    DISPUTES: `${BASE_URL}/api/admin/disputes`,
    LOGS: `${BASE_URL}/api/admin/logs`,
  }
};

// Helper function to get authorization header
export const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Helper function to get full headers
export const getHeaders = (additionalHeaders = {}) => {
  return {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...additionalHeaders
  };
};

export default BASE_URL;
