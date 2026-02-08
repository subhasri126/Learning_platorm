# 🚀 LEARNSPHERE - SERVER STATUS

## ✅ SERVERS RUNNING

### **BACKEND SERVER**
```
============================================================
🚀 BACKEND SERVER RUNNING
============================================================
📍 Port: 5000
🌐 API Base: http://localhost:5000
✅ Health: http://localhost:5000/health
🔐 Auth: http://localhost:5000/api/auth
📚 Courses: http://localhost:5000/api/courses
📖 Lessons: http://localhost:5000/api/lessons
============================================================
```

### **FRONTEND SERVER**
```
============================================================
🎨 FRONTEND SERVER RUNNING
============================================================
📍 Port: 3000
🌐 Website: http://localhost:3000
🏠 Home: http://localhost:3000
📚 Courses: http://localhost:3000/courses
🔐 Login: http://localhost:3000/login
============================================================
```

---

## 🔗 QUICK LINKS

### **For Users:**
- **Home Page**: http://localhost:3000
- **Courses**: http://localhost:3000/courses
- **Login**: http://localhost:3000/login
- **Register**: http://localhost:3000/register

### **For Instructors:**
- **Login**: http://localhost:3000/login
  - Email: `john@instructor.com`
  - Password: `password123`
- **Create Course**: http://localhost:3000/courses/create
- **My Courses**: http://localhost:3000/courses

### **For Admins:**
- **Login**: http://localhost:3000/login
  - Email: `admin@learnosphere.com`
  - Password: `admin123`

### **API Endpoints:**
- **Health Check**: http://localhost:5000/health
- **All Courses**: http://localhost:5000/api/courses
- **All Lessons**: http://localhost:5000/api/lessons

---

## 📊 SERVER STATUS CHECK

### **Backend Status:**
Open: http://localhost:5000/health

Should show:
```json
{
  "status": "OK",
  "message": "LearnSphere API is running",
  "timestamp": "..."
}
```

### **Frontend Status:**
Open: http://localhost:3000

Should show the LearnSphere homepage.

---

## 🔧 TO START SERVERS:

### **Backend:**
```powershell
cd "d:\Learning platform\backend"
npm run dev
```

### **Frontend:**
```powershell
cd "d:\Learning platform\frontend"
npm run dev
```

---

## 🛑 TO STOP SERVERS:

### **Stop All Node Processes:**
```powershell
taskkill /F /IM node.exe
```

### **Stop Specific Port:**
```powershell
# Find process on port
netstat -ano | findstr :5000

# Kill it
taskkill /F /PID [PID]
```

---

## 📝 CURRENT STATUS:

✅ Backend: Running on http://localhost:5000
✅ Frontend: Running on http://localhost:3000

**Main Website**: http://localhost:3000

---

Generated: 2026-02-07 21:46:49
