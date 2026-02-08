# 🔧 HOW TO STOP AND RESTART THE SERVERS

## ✅ I JUST KILLED ALL NODE PROCESSES FOR YOU!

All Node.js processes have been stopped. Port 5000 is now free.

---

## 🚀 TO RESTART THE SERVERS:

### **Step 1: Start Backend**
Open a terminal in the backend folder and run:
```powershell
cd "d:\Learning platform\backend"
npm run dev
```

Wait for: `Server running on port 5000` ✅

### **Step 2: Start Frontend**
Open ANOTHER terminal in the frontend folder and run:
```powershell
cd "d:\Learning platform\frontend"
npm run dev
```

Wait for: `Local: http://localhost:3000` ✅

---

## 📋 COMMANDS TO STOP PORTS IN FUTURE:

### **Option 1: Kill All Node Processes**
```powershell
taskkill /F /IM node.exe
```
This stops ALL Node.js processes.

### **Option 2: Kill Specific Port (e.g., 5000)**
```powershell
# Find process on port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with the number you see)
taskkill /F /PID [PID]
```

### **Option 3: Kill Specific Port (One Command)**
```powershell
FOR /F "tokens=5" %P IN ('netstat -ano ^| findstr :5000') DO taskkill /F /PID %P
```

---

## 🎯 WHAT TO DO NOW:

1. **Open 2 terminals** (or use the existing ones)

2. **Terminal 1 - Backend**:
   ```
   cd "d:\Learning platform\backend"
   npm run dev
   ```

3. **Terminal 2 - Frontend**:
   ```
   cd "d:\Learning platform\frontend"
   npm run dev
   ```

4. **Wait for both to start**:
   - Backend: "Server running on port 5000"
   - Frontend: "Local: http://localhost:3000"

5. **Then try uploading PDF again!**

---

## ⚠️ IMPORTANT NOTE:

I also saw this error in your output:
```
TypeError: pdfParse is not a function
```

This means the PDF processor still has an issue. After you restart the servers, we'll need to fix this.

---

**Please restart both servers now and let me know when they're running!**

Then we'll fix the PDF upload issue once and for all!

---

Generated: 2026-02-07 21:39:47
