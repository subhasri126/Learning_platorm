# Authentication API Testing

## Base URL
```
http://localhost:5000/api/auth
```

## Test Endpoints

### 1. Register a New User

**POST** `/api/auth/register`

```json
{
  "email": "test@example.com",
  "password": "password123",
  "name": "Test User",
  "role": "LEARNER"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "user": {
      "id": 1,
      "email": "test@example.com",
      "name": "Test User",
      "role": "LEARNER",
      "totalPoints": 0,
      "createdAt": "2026-02-07T..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 2. Login

**POST** `/api/auth/login`

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "user": {
      "id": 1,
      "email": "test@example.com",
      "name": "Test User",
      "role": "LEARNER",
      "totalPoints": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 3. Get Current User Profile (Protected)

**GET** `/api/auth/me`

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "test@example.com",
    "name": "Test User",
    "role": "LEARNER",
    "totalPoints": 0,
    "createdAt": "2026-02-07T...",
    "updatedAt": "2026-02-07T..."
  }
}
```

---

## Testing with cURL

### Register:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\",\"name\":\"Test User\",\"role\":\"LEARNER\"}"
```

### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

### Get Profile:
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Testing with PowerShell

### Register:
```powershell
$body = @{
    email = "test@example.com"
    password = "password123"
    name = "Test User"
    role = "LEARNER"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $body -ContentType "application/json"
```

### Login:
```powershell
$body = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $body -ContentType "application/json"
$token = $response.data.token
```

### Get Profile:
```powershell
$headers = @{
    Authorization = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" -Headers $headers
```

---

## Common Error Responses

### 400 - Validation Error
```json
{
  "success": false,
  "message": "Email, password, and name are required."
}
```

### 401 - Invalid Credentials
```json
{
  "success": false,
  "message": "Invalid credentials."
}
```

### 401 - No Token
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### 403 - Forbidden (Wrong Role)
```json
{
  "success": false,
  "message": "Access denied. Insufficient permissions."
}
```

### 409 - User Already Exists
```json
{
  "success": false,
  "message": "User with this email already exists."
}
```
