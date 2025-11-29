# Quick Start Guide - Updated Configuration

## What Changed?

### ✅ Removed `/server` folder (duplicate backend)
### ✅ Centralized API configuration in `src/config/api.js`
### ✅ Environment variables now properly configured

---

## How to Run the Application

### 1. Backend (Port 5000)
```bash
cd backend
npm start
```

### 2. Frontend (Port 3000)
```bash
# From root directory
npm start
```

---

## Environment Variables

### Development (`.env`)
```env
REACT_APP_API_BASE_URL=http://localhost:5000
```

### Production (`.env.production`)
```env
REACT_APP_API_BASE_URL=https://voting-system-backend.azurewebsites.net
```

**Important**: After changing `.env` file, restart the development server!

---

## Key Files

### Configuration
- `src/config/api.js` - Centralized API configuration
- `.env` - Development environment
- `.env.production` - Production environment

### Usage Example
```javascript
import { BASE_URL, API_ENDPOINTS, getHeaders } from './config/api';

// Direct URL usage
const response = await axios.post(`${BASE_URL}/api/auth/login`, data);

// Using predefined endpoints (recommended)
const response = await axios.get(API_ENDPOINTS.USER.PROFILE, {
  headers: getHeaders()
});
```

---

## API Endpoints Available

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### User/Voter
- `GET /api/user/me` - Get user profile
- `GET /api/user/elections?active=true` - Get active elections
- `POST /api/user/vote` - Submit vote

### Admin
- `GET /api/admin/stats` - Get admin statistics
- (More to be implemented)

---

## Troubleshooting

**Q: Getting "BASE_URL is undefined"?**
A: Restart the development server (`Ctrl+C` then `npm start`)

**Q: API calls failing?**
A: Check that backend is running on port 5000

**Q: CORS errors?**
A: Verify backend has CORS enabled for `http://localhost:3000`

---

## File Structure

```
E-Vote-System/
├── .env                          # Development config
├── .env.production              # Production config
├── package.json                 # Frontend dependencies
├── src/
│   ├── config/
│   │   └── api.js              # ✨ NEW - API configuration
│   ├── App.js                   # Routes (BASE_URL removed)
│   └── component/
│       ├── auth/                # Login/Register
│       ├── user/                # User components
│       └── admin/               # Admin components
├── backend/                     # ✅ PRIMARY BACKEND
│   ├── server.js
│   ├── package.json
│   └── src/
└── build/                       # Production build
```

---

## Migration Complete! ✅

All components now use the centralized configuration. The application is ready for:
- ✅ Local development
- ✅ Production deployment on Azure
- ✅ Easy environment switching
- ✅ Clean, maintainable codebase

---

## Need Help?

Check these files:
1. `CONFIGURATION_CHANGES.md` - Detailed changes
2. `FRONTEND_BACKEND_CONNECTIONS.md` - API mapping
3. `backend/README.md` - Backend setup
