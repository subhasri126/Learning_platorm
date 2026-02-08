# 🔍 TROUBLESHOOTING: "Add Lesson" Button Not Showing

## ❓ Why You Can't See the Button

The "+ Add Lesson" button only shows when **ALL** these conditions are met:

1. ✅ You are logged in
2. ✅ You are logged in as **Instructor** or **Admin** (NOT Learner)
3. ✅ You own the course (or you're an admin)
4. ✅ The course is a real database course (not a curated/demo course)

---

## 🎯 SOLUTION: Follow These Steps

### Step 1: Check Your Login Status

**Open your browser console** (Press F12) and check:
- Are you logged in?
- What role do you have?

### Step 2: Login as Instructor

1. **Logout first** (if logged in as learner)
   - Click your profile/logout button

2. **Login as Instructor**:
   ```
   URL: http://localhost:3000/auth/instructor
   Email: instructor@learnsphere.com
   Password: password123
   ```

### Step 3: Go to the RIGHT Course

**IMPORTANT**: The curated courses (fake demo courses) don't allow editing!

**Curated Courses (NO EDIT):**
- JavaScript Basics
- Advanced JavaScript
- Python Fundamentals
- Web Development – Frontend
- Web Development – Backend
- Full Stack Development
- MySQL & Databases
- Computer Fundamentals
- Data Structures Basics
- Programming Logic & Problem Solving

**Real Database Courses (CAN EDIT):**
- Introduction to JavaScript (ID: 6)
- React for Beginners (ID: 7)
- Advanced Node.js (Draft) (ID: 8)

### Step 4: Navigate to a Real Course

**Option A: Direct URL**
```
http://localhost:3000/courses/6
http://localhost:3000/courses/7
http://localhost:3000/courses/8
```

**Option B: From Courses Page**
1. Go to http://localhost:3000/courses
2. Scroll down to "All Courses" section
3. Look for courses WITHOUT the curated styling
4. Click on one of them

### Step 5: Check the Console

Once on the course page:
1. Press **F12** to open browser console
2. Look for debug messages:
   ```
   🔍 CourseDetail Debug:
     User: {id: 7, name: "John Instructor", ...}
     isInstructor: true
     Course Instructor ID: 7
     User ID: 7
     canEdit: true
   ```

3. If `canEdit: false`, check the reason in console

---

## 🚀 QUICK FIX: Direct Link

**Just paste this in your browser:**

```
http://localhost:3000/courses/8/lessons/create
```

This will take you DIRECTLY to the lesson creation form!

---

## 🔍 How to Identify Real vs Curated Courses

### Real Courses:
- Have numeric IDs (6, 7, 8)
- Show instructor name from database
- Have Edit/Delete buttons (if you're the instructor)
- URL looks like: `/courses/8`

### Curated Courses:
- Have string IDs (curated-js-basics, curated-python, etc.)
- Show "LearnSphere" as instructor
- NO Edit/Delete buttons
- URL looks like: `/courses/curated-js-basics`

---

## ✅ VERIFICATION CHECKLIST

Use this to verify you're in the right place:

- [ ] Logged in as instructor (not learner)
- [ ] On a real course page (numeric ID like /courses/8)
- [ ] Can see "Edit" and "Delete" buttons at top
- [ ] Console shows `canEdit: true`
- [ ] Can see "+ Add Lesson" button next to "Lessons" heading

If ALL are checked, you should see the button!

---

## 🎬 STEP-BY-STEP VIDEO GUIDE

1. **Logout** (if logged in)
2. **Go to**: http://localhost:3000/auth/instructor
3. **Login**: instructor@learnsphere.com / password123
4. **Go to**: http://localhost:3000/courses/8
5. **Look for**: "+ Add Lesson" button (top right, next to "Lessons")
6. **Click it**
7. **Select**: "PDF Upload"
8. **Upload your PDF**
9. **Done!** ✅

---

## 🆘 STILL NOT SHOWING?

If you've done all the above and still don't see it:

1. **Check browser console** (F12) for the debug logs
2. **Take a screenshot** of:
   - The course page
   - The browser console
3. **Tell me**:
   - Which course are you looking at?
   - What does the console say?
   - Are you logged in as instructor?

---

## 💡 PRO TIP: Create Your Own Course

If you want full control:

1. Go to: http://localhost:3000/courses
2. Click "+ Create Course" (top right)
3. Fill in course details
4. Save
5. Now you'll DEFINITELY see "+ Add Lesson" on YOUR course!

---

Generated: 2026-02-07 20:32:52
