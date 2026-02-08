# 📄 How to Upload PDF Lessons - LearnSphere

## Quick Start Guide

### Step 1: Login as Instructor
1. Navigate to: `http://localhost:3000/auth/instructor`
2. Login with:
   - Email: `instructor@learnsphere.com`
   - Password: `password123`

### Step 2: Go to Your Course
1. Click on "**Courses**" in the navigation
2. Select the course where you want to add the PDF lesson
3. OR create a new course first if needed

### Step 3: Add New Lesson
1. In the course detail page, click "**+ Add Lesson**" button
2. You'll be redirected to the lesson creation form

### Step 4: Configure PDF Lesson
1. **Lesson Title**: Enter a descriptive title (e.g., "JavaScript Fundamentals")
2. **Lesson Type**: Click on "**PDF Upload**" button (4th option)
3. **Upload PDF**: 
   - Click the upload area
   - Select your PDF file from your computer
   - The file name will appear once selected
4. **Description**: Add a brief summary (optional)
5. **Duration**: Estimated reading time in minutes (e.g., 15)
6. **Order**: Sequence number (e.g., 1, 2, 3... or leave blank for auto)

### Step 5: Save
1. Click "**Create Lesson**" button
2. Wait for the upload to complete
3. You'll be redirected back to the course page

---

## What Happens to Your PDF?

✅ **Uploaded**: PDF is saved to `backend/uploads/` folder
✅ **Processed**: Text content is extracted automatically
✅ **Structured**: Content is parsed into sections (headings, paragraphs, code blocks)
✅ **Displayed**: Shown as a tutorial-style page (NOT an iframe)

---

## Supported Features

- ✅ Automatic text extraction
- ✅ Code block detection
- ✅ Heading detection
- ✅ Structured content rendering
- ✅ No iframe/embed (clean tutorial UI)

---

## File Locations

- **Uploads folder**: `backend/uploads/`
- **Database**: Stores file path and extracted content
- **Frontend display**: Renders as structured HTML

---

## Troubleshooting

### "Please upload a PDF file" error
- Make sure you selected the "PDF Upload" type
- Ensure you clicked the upload area and selected a file

### PDF not processing
- Check backend console for errors
- Ensure `pdf-parse` package is installed: `npm install pdf-parse`
- Check file permissions on `backend/uploads/` folder

### Can't see the lesson
- Make sure you're logged in as the instructor who created it
- Check if the course is published (for learners)

---

## Example Workflow

```
1. Login → Instructor Dashboard
2. Courses → Select "JavaScript Basics"
3. Click "+ Add Lesson"
4. Title: "Variables and Data Types"
5. Type: PDF Upload
6. Upload: variables.pdf
7. Duration: 20 minutes
8. Order: 2
9. Click "Create Lesson"
10. Done! ✅
```

---

## Direct URLs

- **Login**: http://localhost:3000/auth/instructor
- **Courses**: http://localhost:3000/courses
- **Add Lesson**: http://localhost:3000/courses/{courseId}/lessons/create

---

## Need Help?

If you encounter any issues:
1. Check browser console (F12)
2. Check backend terminal for errors
3. Verify the PDF file is valid and not corrupted
4. Make sure backend server is running on port 5000
