# Configuration Changes - Environment Setup

## Changes Made

### 1. ✅ Removed Duplicate Server Folder
- Deleted `/server` folder (duplicate backend)
- Frontend now exclusively uses `/backend` folder on port 5000

### 2. ✅ Centralized API Configuration

#### New Configuration Structure:
```
src/
  config/
    api.js          # Centralized API configuration
.env                # Development environment variables
.env.production     # Production environment variables
```

#### Configuration File: `src/config/api.js`
This file now contains:
- `BASE_URL` - Dynamically set from environment variables
- `API_ENDPOINTS` - Organized endpoints for Auth, User, and Admin
- `getAuthHeader()` - Helper to get authorization headers
- `getHeaders()` - Helper to get all headers including auth

### 3. ✅ Environment Variables

#### Development (`.env`):
```env
REACT_APP_API_BASE_URL=http://localhost:5000
```

#### Production (`.env.production`):
```env
REACT_APP_API_BASE_URL=https://voting-system-backend.azurewebsites.net
```

### 4. ✅ Updated Import Statements

All components now import BASE_URL from the centralized config:

**Before:**
```javascript
import { BASE_URL } from '../../../App';
```

**After:**
```javascript
import { BASE_URL } from '../../../config/api';
```

#### Updated Files:
- ✅ `src/App.js` - Removed BASE_URL export
- ✅ `src/component/auth/register/RegisterPage.js`
- ✅ `src/component/auth/login/LoginPage.js`
- ✅ `src/component/user/layout/dashboard/UserDashboard.js`
- ✅ `src/component/user/layout/voting-page/VotingPage.js`
- ✅ `src/component/user/layout/voter-dashboard/VoterDashboard.js`
- ✅ `src/component/user/layout/orderProduct/orderProduct.js`
- ✅ `src/component/user/layout/createInvoice/createInvoice.js`
- ✅ `src/component/user/layout/addFeedback/Feedback.js`
- ✅ `src/component/admin/layout/admin-dashboard/AdminDashboard.js`

## Usage

### Using BASE_URL in Components:
```javascript
import { BASE_URL } from '../../../config/api';

// Make API calls
const response = await axios.get(`${BASE_URL}/api/user/me`);
```

### Using Predefined Endpoints:
```javascript
import { API_ENDPOINTS, getHeaders } from '../../../config/api';

// Using predefined endpoints
const response = await axios.get(API_ENDPOINTS.USER.PROFILE, {
  headers: getHeaders()
});
```

### Using Helper Functions:
```javascript
import { getAuthHeader, getHeaders } from '../../../config/api';

// Get just auth header
const authHeader = getAuthHeader();

// Get all headers
const headers = getHeaders();

// Get headers with additional custom headers
const customHeaders = getHeaders({ 'Custom-Header': 'value' });
```

## Environment Setup

### Local Development:
1. Ensure `.env` file has:
   ```env
   REACT_APP_API_BASE_URL=http://localhost:5000
   ```

2. Start backend:
   ```bash
   cd backend
   npm start
   ```

3. Start frontend:
   ```bash
   npm start
   ```

### Production Deployment:
1. Set environment variable on Azure Static Web Apps:
   ```
   REACT_APP_API_BASE_URL=https://voting-system-backend.azurewebsites.net
   ```

2. Build and deploy:
   ```bash
   npm run build
   ```

## Benefits of This Approach

1. **Single Source of Truth**: All API configuration in one place
2. **Environment-Aware**: Automatically uses correct URL for dev/production
3. **Easy to Maintain**: Change URL in one place, affects entire app
4. **Type Safety**: Can easily add TypeScript types to API endpoints
5. **Reusable Helpers**: Auth headers and other utilities centralized
6. **Cleaner Code**: Components don't need to manage API URLs

## Testing the Changes

1. **Verify environment variable is loaded:**
   ```javascript
   console.log('BASE_URL:', BASE_URL);
   ```

2. **Test API calls:**
   - Login should work
   - Registration should work
   - User dashboard should load
   - Admin dashboard should load

3. **Check browser console** for any import errors

## Next Steps

Consider creating API service layers for better organization:

```javascript
// src/services/authService.js
import axios from 'axios';
import { API_ENDPOINTS, getHeaders } from '../config/api';

export const authService = {
  login: async (credentials) => {
    const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },
  
  register: async (userData) => {
    const response = await axios.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  }
};
```

## Troubleshooting

### Issue: "BASE_URL is undefined"
**Solution**: Restart the development server to load new environment variables

### Issue: "Cannot find module '../../../config/api'"
**Solution**: Check the relative path - it depends on component location

### Issue: API calls failing
**Solution**: 
1. Check `.env` file exists and has correct URL
2. Verify backend is running on port 5000
3. Check browser console for CORS errors
4. Verify `REACT_APP_` prefix is used in environment variables

## Migration Complete ✅

All components are now using the centralized configuration system. The duplicate `/server` folder has been removed, and the application now has a clean, maintainable structure for API configuration.
