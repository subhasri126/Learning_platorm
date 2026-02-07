# Quick Start Without MySQL (Testing Mode)

Since you don't have MySQL set up yet, here's what you need to know:

## ✅ What's Been Completed (Step 3)

### 1. JWT Utilities ([jwt.js](d:\Learning platform\backend\src\utils\jwt.js))
- `generateToken(userId, role)` - Creates JWT with user info
- `verifyToken(token)` - Validates and decodes JWT
- Uses environment variables for secret and expiry

### 2. Authentication Middleware ([auth.js](d:\Learning platform\backend\src\middleware\auth.js))
- Validates Bearer token from Authorization header
- Attaches `req.user` with userId and role
- Returns 401 for missing/invalid tokens

### 3. Authorization Middleware ([authorize.js](d:\Learning platform\backend\src\middleware\authorize.js))
- Role-based access control
- Usage: `authorize('ADMIN', 'INSTRUCTOR')`
- Returns 403 for insufficient permissions

### 4. Auth Controller ([auth.controller.js](d:\Learning platform\backend\src\controllers\auth.controller.js))
- **register**: Creates new user with hashed password
- **login**: Validates credentials, returns JWT
- **getProfile**: Returns current user info (protected)

### 5. Auth Routes ([auth.routes.js](d:\Learning platform\backend\src\routes\auth.routes.js))
- `POST /api/auth/register` - Public
- `POST /api/auth/login` - Public
- `GET /api/auth/me` - Protected (requires token)

### 6. Server Integration ([server.js](d:\Learning platform\backend\src\server.js))
- All routes mounted
- CORS enabled
- Error handling active
- 404 handler for unknown routes

---

## 🔐 Authentication Flow Explained

### Registration Flow:
```
1. User sends: { email, password, name, role }
2. Backend validates input
3. Checks if email already exists
4. Hashes password with bcrypt (10 rounds)
5. Saves user to database
6. Generates JWT token
7. Returns: { user (no password), token }
```

### Login Flow:
```
1. User sends: { email, password }
2. Backend finds user by email
3. Compares hashed password with bcrypt
4. If valid, generates JWT token
5. Returns: { user (no password), token }
```

### Protected Route Access:
```
1. Client includes: Authorization: Bearer <token>
2. authenticate middleware extracts token
3. Verifies token signature and expiry
4. Attaches user info to req.user
5. authorize middleware checks role (if used)
6. Controller processes request
```

---

## 🎯 Key Security Features

✅ **Password Hashing**: bcrypt with salt rounds (10)  
✅ **JWT Tokens**: Signed with secret, 7-day expiry  
✅ **Token Validation**: Signature verification prevents tampering  
✅ **Role-Based Access**: Middleware enforces permissions  
✅ **No Password Leaks**: Never return password in responses  
✅ **Input Validation**: Email format, password length checks  

---

## 🚀 Next Step: Setup MySQL

To test the authentication system, you need to:

### Option 1: Docker (Fastest)
```bash
docker run --name learnsphere-mysql -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=learnsphere -p 3306:3306 -d mysql:8
```

### Option 2: Local MySQL
1. Install MySQL Community Server
2. Create database: `CREATE DATABASE learnsphere;`
3. Update `.env` with your credentials

### Option 3: XAMPP
1. Download and install XAMPP
2. Start MySQL from control panel
3. Update `.env`: `DATABASE_URL="mysql://root:@localhost:3306/learnsphere"`

### Then run:
```bash
cd backend
npx prisma migrate dev --name init
npm run seed  # Optional: adds sample data
npm run dev   # Start server
```

---

## 📦 What's Ready for Step 4

Once MySQL is connected, we'll implement:
- ✅ Course CRUD (with role checks)
- ✅ Lesson management
- ✅ Quiz creation & questions
- ✅ Quiz attempts with scoring logic
- ✅ Progress tracking
- ✅ Reporting endpoints

All controllers will use the `authenticate` and `authorize` middleware we just created!

---

## 💡 Code Quality Highlights

- **Modular Design**: Separation of concerns (routes → controllers → database)
- **Reusable Middleware**: DRY principle for auth checks
- **Error Handling**: Consistent response format with try-catch
- **Validation**: Input checks before database operations
- **Security First**: No sensitive data in logs or responses
