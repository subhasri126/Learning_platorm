# LearnSphere API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 🔐 Authentication Endpoints

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "LEARNER"  // Optional: ADMIN, INSTRUCTOR, LEARNER (default)
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "learner1@learnsphere.com",
  "password": "password123"
}
```

### Get Profile
```http
GET /api/auth/me
Authorization: Bearer <token>
```

---

## 📚 Course Endpoints

### Get All Courses
```http
GET /api/courses
Authorization: Bearer <token>
```
- **Learners**: See only published courses
- **Instructors/Admin**: See all courses

### Get Course by ID
```http
GET /api/courses/:id
Authorization: Bearer <token>
```
Returns course with lessons and quizzes.

### Create Course *(Instructor/Admin)*
```http
POST /api/courses
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Introduction to Python",
  "description": "Learn Python from scratch",
  "thumbnail": "https://example.com/image.jpg"
}
```

### Update Course *(Instructor/Admin)*
```http
PUT /api/courses/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "isPublished": true
}
```

### Delete Course *(Instructor/Admin)*
```http
DELETE /api/courses/:id
Authorization: Bearer <token>
```

### Get Course Progress *(Learner)*
```http
GET /api/courses/:id/progress
Authorization: Bearer <token>
```
Returns completion percentage and status.

---

## 📖 Lesson Endpoints

### Get Lessons by Course
```http
GET /api/lessons/course/:courseId
Authorization: Bearer <token>
```

### Get Lesson by ID
```http
GET /api/lessons/:id
Authorization: Bearer <token>
```

### Create Lesson *(Instructor/Admin)*
```http
POST /api/lessons
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Introduction to Variables",
  "description": "Learn about variables",
  "content": "https://youtube.com/watch?v=example",
  "type": "VIDEO",  // VIDEO, DOCUMENT, IMAGE
  "order": 1,
  "duration": 15,
  "courseId": 1
}
```

### Update Lesson *(Instructor/Admin)*
```http
PUT /api/lessons/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Lesson Title",
  "duration": 20
}
```

### Delete Lesson *(Instructor/Admin)*
```http
DELETE /api/lessons/:id
Authorization: Bearer <token>
```

---

## ❓ Quiz Endpoints

### Get Quizzes by Course
```http
GET /api/quizzes/course/:courseId
Authorization: Bearer <token>
```

### Get Quiz by ID
```http
GET /api/quizzes/:id
Authorization: Bearer <token>
```
**Note**: Learners don't see correct answers.

### Create Quiz *(Instructor/Admin)*
```http
POST /api/quizzes
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Python Basics Quiz",
  "description": "Test your Python knowledge",
  "courseId": 1,
  "maxPoints": 100,
  "questions": [
    {
      "questionText": "What is a variable?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A",
      "points": 25,
      "order": 1
    }
  ]
}
```

### Add Question to Quiz *(Instructor/Admin)*
```http
POST /api/quizzes/:id/questions
Authorization: Bearer <token>
Content-Type: application/json

{
  "questionText": "What is Python?",
  "options": ["A programming language", "A snake", "An IDE", "A framework"],
  "correctAnswer": "A programming language",
  "points": 10,
  "order": 1
}
```

### Submit Quiz Attempt *(Learner)*
```http
POST /api/quizzes/:id/attempt
Authorization: Bearer <token>
Content-Type: application/json

{
  "answers": {
    "1": "A programming language",
    "2": "def"
  }
}
```
**Scoring Logic**:
- 1st attempt: 100% points
- 2nd attempt: 90% points
- 3rd attempt: 80% points
- ...minimum 50% points

### Get Quiz Attempts *(Learner)*
```http
GET /api/quizzes/:id/attempts
Authorization: Bearer <token>
```

---

## 📊 Progress Endpoints

### Mark Lesson Complete *(Learner)*
```http
POST /api/progress/lessons/:lessonId/complete
Authorization: Bearer <token>
```

### Get Dashboard *(Learner)*
```http
GET /api/progress/dashboard
Authorization: Bearer <token>
```
Returns:
- Total points & badge
- Enrolled courses with progress
- Recent quiz attempts
- Stats

### Get Course Detailed Progress *(Learner)*
```http
GET /api/progress/courses/:courseId
Authorization: Bearer <token>
```

---

## 👥 User & Reporting Endpoints

### Get All Users *(Admin)*
```http
GET /api/users
Authorization: Bearer <token>
```

### Get User by ID *(Admin)*
```http
GET /api/users/:id
Authorization: Bearer <token>
```

### Get Leaderboard
```http
GET /api/users/leaderboard?limit=10
Authorization: Bearer <token>
```
Top learners by points.

### Get Course Statistics *(Instructor/Admin)*
```http
GET /api/users/courses/:courseId/stats
Authorization: Bearer <token>
```
Returns:
- Total learners
- Not started / In progress / Completed counts
- Individual learner progress

---

## 🎮 Gamification System

### Badge Levels
| Badge | Points Required |
|-------|----------------|
| BEGINNER | 0-99 |
| BRONZE | 100-499 |
| SILVER | 500-999 |
| GOLD | 1000+ |

### Points System
- Quiz attempts: Based on correct answers × attempt multiplier
- Each attempt decreases points by 10% (minimum 50%)

---

## Test Credentials (from seed data)

```
Admin:       admin@learnsphere.com / password123
Instructor:  instructor@learnsphere.com / password123
Learner 1:   learner1@learnsphere.com / password123 (150 points)
Learner 2:   learner2@learnsphere.com / password123 (550 points)
```

---

## PowerShell Testing Examples

### Login and Save Token
```powershell
$body = @{
    email = "learner1@learnsphere.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $body -ContentType "application/json"
$token = $response.data.token
```

### Get Courses
```powershell
$headers = @{ Authorization = "Bearer $token" }
Invoke-RestMethod -Uri "http://localhost:5000/api/courses" -Headers $headers
```

### Get Dashboard
```powershell
$headers = @{ Authorization = "Bearer $token" }
Invoke-RestMethod -Uri "http://localhost:5000/api/progress/dashboard" -Headers $headers
```

### Submit Quiz Attempt
```powershell
$headers = @{ Authorization = "Bearer $token" }
$body = @{
    answers = @{
        "1" = "const"
        "2" = "Integer"
        "3" = "Compares value and type"
        "4" = "parseInt()"
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/quizzes/1/attempt" -Method Post -Headers $headers -Body $body -ContentType "application/json"
```

---

## Error Responses

### 400 - Bad Request
```json
{
  "success": false,
  "message": "Title and description are required."
}
```

### 401 - Unauthorized
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### 403 - Forbidden
```json
{
  "success": false,
  "message": "Access denied. Insufficient permissions."
}
```

### 404 - Not Found
```json
{
  "success": false,
  "message": "Course not found."
}
```

---

## Role-Based Access Control

| Endpoint | ADMIN | INSTRUCTOR | LEARNER |
|----------|-------|-----------|---------|
| View published courses | ✅ | ✅ | ✅ |
| View all courses | ✅ | ✅ | ❌ |
| Create course | ✅ | ✅ | ❌ |
| Edit own course | ✅ | ✅ | ❌ |
| Delete own course | ✅ | ✅ | ❌ |
| Create quiz | ✅ | ✅ | ❌ |
| Attempt quiz | ❌ | ❌ | ✅ |
| Mark lesson complete | ❌ | ❌ | ✅ |
| View all users | ✅ | ❌ | ❌ |
| View course stats | ✅ | ✅ (own) | ❌ |
