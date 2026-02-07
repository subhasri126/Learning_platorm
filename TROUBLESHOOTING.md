# 🔧 Troubleshooting Guide

## Login Issues - RESOLVED ✅

### Problem
Login functionality not working due to servers not running properly.

### Solution
Both backend and frontend servers needed to be restarted.

### Current Status
✅ **Backend**: Running on http://localhost:5000  
✅ **Frontend**: Running on http://localhost:3000  
✅ **Login API**: Verified working with test account  

---

## How to Start/Restart Servers

### 1. Stop All Servers (if needed)
```powershell
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
```

### 2. Start Backend
```powershell
cd "d:\Learning platform\backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"
```

Wait 2-3 seconds, then verify:
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/health" -UseBasicParsing
```

### 3. Start Frontend
```powershell
cd "d:\Learning platform\frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"
```

Wait 3-4 seconds, then verify:
```powershell
Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing
```

---

## Test Login API

### PowerShell Test
```powershell
$body = @{
    email = "learner1@learnsphere.com"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $body -ContentType "application/json"
```

### Expected Response
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "user": {
      "id": 3,
      "email": "learner1@learnsphere.com",
      "name": "Alice Learner",
      "role": "LEARNER",
      "totalPoints": 150
    },
    "token": "eyJhbGci..."
  }
}
```

---

## Common Issues & Solutions

### Issue: Port Already in Use
**Error**: `Port 5000 (or 3000) is already in use`

**Solution**:
```powershell
# Find and stop the process
Get-NetTCPConnection -LocalPort 5000 | Select-Object OwningProcess
Stop-Process -Id <ProcessId> -Force
```

### Issue: Backend Not Responding
**Check**:
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/health"
```

**Solutions**:
1. Verify MySQL is running
2. Check `.env` file has correct DATABASE_URL
3. Restart backend server
4. Check for errors in backend terminal

### Issue: Frontend Shows Network Error
**Symptoms**: Login button doesn't work, network errors in console

**Solutions**:
1. Verify backend is running: http://localhost:5000/health
2. Check CORS is enabled in backend
3. Verify Vite proxy configuration in `vite.config.js`
4. Clear browser cache and reload

### Issue: Invalid Credentials
**Check**:
- Using correct test account emails (see below)
- Password is `password123` for all test accounts
- No extra spaces in email/password fields

---

## Test Accounts

| Role | Email | Password | Points | Badge |
|------|-------|----------|--------|-------|
| **Learner 1** | learner1@learnsphere.com | password123 | 150 | BRONZE |
| **Learner 2** | learner2@learnsphere.com | password123 | 550 | SILVER |
| **Instructor** | instructor@learnsphere.com | password123 | 0 | BEGINNER |
| **Admin** | admin@learnsphere.com | password123 | 0 | BEGINNER |

---

## Verification Checklist

Before testing login, ensure:

- [ ] MySQL server is running
- [ ] Backend server is running on port 5000
- [ ] Frontend server is running on port 3000
- [ ] No port conflicts
- [ ] Database has seeded data
- [ ] `.env` file exists with correct credentials

### Quick Verification Commands
```powershell
# 1. Check MySQL
mysql -u root -p -e "SHOW DATABASES LIKE 'learnsphere';"

# 2. Check backend
Invoke-WebRequest -Uri "http://localhost:5000/health"

# 3. Check frontend
Invoke-WebRequest -Uri "http://localhost:3000"

# 4. Test login API
$body = @{email="learner1@learnsphere.com"; password="password123"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $body -ContentType "application/json"
```

---

## Browser Console Debugging

### Check Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Try to login
4. Look for the `/api/auth/login` request
5. Check:
   - Request URL (should be http://localhost:5000/api/auth/login)
   - Status Code (should be 200)
   - Response data

### Common Console Errors

**"Failed to fetch"**
- Backend is not running
- Wrong API URL in axios config

**"CORS policy error"**
- Backend CORS not configured (should be fixed)
- Check `server.js` has `app.use(cors())`

**"401 Unauthorized"**
- Wrong credentials
- Token expired or invalid

**"500 Internal Server Error"**
- Database connection issue
- Check backend terminal for error logs

---

## Still Having Issues?

### Get Detailed Logs

1. **Backend logs**: Check the PowerShell window running backend
2. **Frontend logs**: Check browser console (F12)
3. **Database logs**: Run `npx prisma studio` to inspect data

### Debug Steps

1. Test API directly (use PowerShell commands above)
2. If API works but UI doesn't, it's a frontend issue
3. If API doesn't work, check backend logs and database
4. Check network tab in browser for exact error messages

---

## Success Indicators

✅ Backend health check returns: `{"status":"OK"}`  
✅ Frontend loads at http://localhost:3000  
✅ Login page displays without errors  
✅ Login API test returns token and user data  
✅ After login, redirects to dashboard  
✅ User info appears in navbar  

---

## Need Help?

1. Check this troubleshooting guide
2. Review terminal outputs for error messages
3. Check browser console for frontend errors
4. Verify all test accounts exist in database
5. Ensure all dependencies are installed

**Last Updated**: February 7, 2026  
**Status**: All systems operational ✅
