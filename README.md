# LearnSphere - eLearning Platform MVP

## Project Overview
A complete eLearning platform built for a 24-hour hackathon with role-based access control, course management, quizzes, and gamification.

## Tech Stack

### Frontend
- React + Vite
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js + Express.js
- MySQL + Prisma ORM
- JWT Authentication
- bcrypt

## Roles
- ADMIN
- INSTRUCTOR
- LEARNER

## Getting Started

### Backend Setup
```bash
cd backend
npm install
# Configure .env file
npx prisma migrate dev
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Features
- Role-based authentication & authorization
- Course creation & management
- Lesson management (video, document, image)
- Quiz system with multiple attempts
- Progress tracking
- Gamification (points & badges)
- Basic reporting
