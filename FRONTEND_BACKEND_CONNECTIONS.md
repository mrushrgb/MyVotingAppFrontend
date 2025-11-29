# Frontend-Backend API Connections Map

## Overview
This document maps all API connections between the React frontend and the backend services.

---

## Current Backend Structure

### ✅ PRIMARY BACKEND: `/backend` folder (Port 5000)
**Server File**: `backend/server.js`
**Routes**:
- `/api/auth` → `backend/src/routes/authRoutes.js`
- `/api/admin` → `backend/src/routes/adminRoutes.js`
- `/api/user` → `backend/src/routes/userRoutes.js`

### ⚠️ DUPLICATE/MINIMAL: `/server` folder (Port 5000)
**Server File**: `server/index.js`
**Routes**:
- `/api/auth` → `server/routes/auth.js` (basic auth only)

**STATUS**: This is a duplicate that should be removed. Frontend does NOT use this.

---

## API Endpoint Mapping

### 🔐 AUTHENTICATION APIs (`/api/auth`)

#### 1. User Registration
**Frontend Location**: `src/component/auth/register/RegisterPage.js`
```javascript
Line 118: axios.post(`${BASE_URL}/api/auth/register`, payload)
```
**Backend**: `backend/src/routes/authRoutes.js` → `backend/src/controllers/authController.js`
- **Method**: POST
- **Payload**: 
  ```javascript
  {
    name, email, password, role,
    phoneNumber, address, dob, gender,
    voterId, constituency
  }
  ```
- **Returns**: `{ token, user }`

#### 2. User Login
**Frontend Location**: `src/component/auth/login/LoginPage.js`
```javascript
Line 66: axios.post(`${BASE_URL}/api/auth/login`, formData)
```
**Backend**: `backend/src/routes/authRoutes.js` → `backend/src/controllers/authController.js`
- **Method**: POST
- **Payload**: `{ email, password }`
- **Returns**: `{ token, user: { id, name, email, role } }`

---

### 👤 USER/VOTER APIs (`/api/user`)

#### 3. Get User Profile
**Frontend Location**: `src/component/user/layout/dashboard/UserDashboard.js`
```javascript
Line 21: axios.get(`${BASE_URL}/api/user/me`)
```
**Backend**: `backend/src/routes/userRoutes.js` → `backend/src/controllers/userController.js`
- **Method**: GET
- **Headers**: `Authorization: Bearer <token>`
- **Returns**: User profile object

#### 4. Get Active Elections (User View)
**Frontend Locations**:
1. `src/component/user/layout/dashboard/UserDashboard.js`
   ```javascript
   Line 22: axios.get(`${BASE_URL}/api/user/elections?active=true`)
   ```

2. `src/component/user/layout/voting-page/VotingPage.js`
   ```javascript
   Line 46: axios.get(`${BASE_URL}/api/user/elections?active=true`, { headers })
   Line 471: axios.get(`${BASE_URL}/api/user/elections?active=true`, { headers })
   ```

3. `src/component/user/layout/voter-dashboard/VoterDashboard.js`
   ```javascript
   Line 89: axios.get(`${BASE_URL}/api/user/elections?active=true`, { headers })
   ```

**Backend**: `backend/src/routes/userRoutes.js` → `backend/src/controllers/userController.js`
- **Method**: GET
- **Query**: `?active=true`
- **Headers**: `Authorization: Bearer <token>`
- **Returns**: Array of active elections

#### 5. Submit Vote
**Frontend Location**: `src/component/user/layout/voting-page/VotingPage.js`
```javascript
Line 212: axios.post(`${BASE_URL}/api/user/vote`, payload, { headers })
```
**Backend**: `backend/src/routes/userRoutes.js` → `backend/src/controllers/userController.js`
- **Method**: POST
- **Payload**: `{ electionId, candidateId }`
- **Headers**: `Authorization: Bearer <token>`
- **Returns**: Vote confirmation

---

### 👨‍💼 ADMIN APIs (`/api/admin`)

#### 6. Get Admin Statistics
**Frontend Location**: `src/component/admin/layout/admin-dashboard/AdminDashboard.js`
```javascript
Line 51: axios.get(`${BASE_URL}/api/admin/stats`)
```
**Backend**: `backend/src/routes/adminRoutes.js` → `backend/src/controllers/adminController.js`
- **Method**: GET
- **Headers**: `Authorization: Bearer <token>` (admin role required)
- **Returns**: 
  ```javascript
  {
    totalUsers, totalElections, totalVotes,
    activeElections, recentActivity
  }
  ```

#### 7. Election Management APIs (Expected but NOT YET IMPLEMENTED)
**Frontend Location**: `src/component/admin/layout/election-management/ElectionManagement.js`
**Status**: ⚠️ Currently using MOCK DATA

**Expected Backend APIs** (Need to be implemented):
- GET `/api/admin/elections` - List all elections
- POST `/api/admin/elections` - Create new election
- PUT `/api/admin/elections/:id` - Update election
- DELETE `/api/admin/elections/:id` - Delete election
- PATCH `/api/admin/elections/:id/status` - Change election status

#### 8. Turnout Monitoring APIs (Expected but NOT YET IMPLEMENTED)
**Frontend Location**: `src/component/admin/layout/turnout-monitoring/TurnoutMonitoring.js`
**Status**: ⚠️ Currently using MOCK DATA

**Expected Backend APIs** (Need to be implemented):
- GET `/api/admin/elections/:id/turnout` - Real-time turnout statistics
- GET `/api/admin/elections/:id/turnout/regions` - Regional breakdown
- GET `/api/admin/elections/:id/turnout/demographics` - Demographic data

---

### 🛒 LEGACY/NON-VOTING APIs (Should be removed)

#### 9. Product/Order APIs (NOT RELATED TO VOTING)
**Frontend Locations**:
- `src/component/user/layout/orderProduct/orderProduct.js`
  ```javascript
  Line 42: axios.get(BASE_URL + '/products')
  Line 54: axios.get(BASE_URL + `/product/${getUserData}`)
  Line 103: axios.post(BASE_URL + '/addOrderProduct', orderData.orderProducts)
  ```

**Status**: ⚠️ These are NOT voting-related and should be removed

#### 10. Invoice APIs (NOT RELATED TO VOTING)
**Frontend Location**: `src/component/user/layout/createInvoice/createInvoice.js`
```javascript
Line 17: axios.get(BASE_URL + '/distinctInvoiceNumbersByUser/' + userId)
```

**Status**: ⚠️ These are NOT voting-related and should be removed

#### 11. Feedback APIs (NOT RELATED TO VOTING)
**Frontend Location**: `src/component/user/layout/addFeedback/Feedback.js`
```javascript
Line 31: axios.get(BASE_URL + '/feedbackById/' + userID)
Line 49: axios.post(BASE_URL + '/addFeedback', data)
```

**Status**: ⚠️ These are NOT voting-related and should be removed

---

## BASE_URL Configuration

### Frontend Configuration
**File**: `src/App.js`
```javascript
export const BASE_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:5000'
  : 'https://voting-system-backend.azurewebsites.net'
```

### Environment Variables
**Root `.env`**:
```env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_PROD_API_URL=https://cloud-based-voting-system-backend.azurewebsites.net
```

**Backend `.env`**:
```env
MONGO_URI=mongodb://127.0.0.1:27017/cloudbase_voting
PORT=5000
JWT_SECRET=change_this_for_dev
```

---

## Summary of Connections

### ✅ ACTIVE AND FUNCTIONAL
| Frontend Component | API Endpoint | Backend Handler | Status |
|-------------------|--------------|-----------------|--------|
| RegisterPage | POST `/api/auth/register` | authController | ✅ Working |
| LoginPage | POST `/api/auth/login` | authController | ✅ Working |
| UserDashboard | GET `/api/user/me` | userController | ✅ Working |
| VotingPage | GET `/api/user/elections?active=true` | userController | ✅ Working |
| VotingPage | POST `/api/user/vote` | userController | ✅ Working |
| AdminDashboard | GET `/api/admin/stats` | adminController | ✅ Working |

### ⚠️ USING MOCK DATA (Need Backend Implementation)
| Frontend Component | Expected API | Status |
|-------------------|--------------|--------|
| ElectionManagement | GET/POST/PUT/DELETE `/api/admin/elections` | ❌ Mock Data |
| TurnoutMonitoring | GET `/api/admin/turnout/*` | ❌ Mock Data |
| DisputeManagement | GET/POST `/api/admin/disputes` | ❌ Mock Data |
| SystemLogs | GET `/api/admin/logs` | ❌ Mock Data |

### ❌ NON-VOTING LEGACY CODE (Should be removed)
- Product/Order management endpoints
- Invoice creation endpoints
- Feedback system endpoints

---

## Backend Services Analysis

### `/backend` folder - PRIMARY BACKEND ✅
**Purpose**: Complete voting system backend
**Models**:
- User (with voting fields: voterId, hasVoted, isEligible)
- Election (with candidates, votes, dates)

**Controllers**:
- authController: register, login
- userController: profile, elections, vote
- adminController: stats, election management

**Status**: **USE THIS ONE**

### `/server` folder - DUPLICATE ⚠️
**Purpose**: Basic auth scaffold (appears to be old/test version)
**Models**:
- User (minimal: name, email, password, role)
- No Election model

**Status**: **REMOVE THIS - NOT USED BY FRONTEND**

---

## Recommendations

### 1. Remove Duplicate Backend
```bash
# The /server folder is not used and should be removed
git rm -r server/
```

### 2. Implement Missing Admin APIs
The following endpoints need to be implemented in `/backend`:
- Election CRUD operations
- Turnout monitoring endpoints
- Dispute management endpoints
- System logs endpoints

### 3. Remove Non-Voting Code
Clean up legacy code that's not related to voting:
- Product/order management components
- Invoice creation components
- Generic feedback components

### 4. Standardize API Calls
Consider creating an API service layer:
```javascript
// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token interceptor
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData)
};

export const userAPI = {
  getProfile: () => api.get('/api/user/me'),
  getElections: () => api.get('/api/user/elections?active=true'),
  submitVote: (voteData) => api.post('/api/user/vote', voteData)
};

export const adminAPI = {
  getStats: () => api.get('/api/admin/stats'),
  getElections: () => api.get('/api/admin/elections'),
  createElection: (data) => api.post('/api/admin/elections', data)
};
```

---

## Conclusion

**Frontend uses ONLY the `/backend` folder APIs.**

The `/server` folder is a duplicate that should be removed. The frontend makes API calls to:
- `/api/auth/*` - Authentication (register, login)
- `/api/user/*` - User operations (profile, elections, voting)
- `/api/admin/*` - Admin operations (stats, management)

All pointing to port 5000, which is served by `backend/server.js`.
