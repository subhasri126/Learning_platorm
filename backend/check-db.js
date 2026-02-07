import prisma from './src/config/database.js';

async function checkDatabase() {
  try {
    console.log('🔍 Checking database contents...\n');
    
    const userCount = await prisma.user.count();
    const courseCount = await prisma.course.count();
    const lessonCount = await prisma.lesson.count();
    const quizCount = await prisma.quiz.count();
    const questionCount = await prisma.question.count();
    const progressCount = await prisma.lessonProgress.count();
    const attemptCount = await prisma.quizAttempt.count();
    
    console.log('📊 Database Statistics:');
    console.log(`   👥 Users: ${userCount}`);
    console.log(`   📚 Courses: ${courseCount}`);
    console.log(`   📖 Lessons: ${lessonCount}`);
    console.log(`   ❓ Quizzes: ${quizCount}`);
    console.log(`   📝 Questions: ${questionCount}`);
    console.log(`   ✅ Lesson Progress: ${progressCount}`);
    console.log(`   🎯 Quiz Attempts: ${attemptCount}\n`);
    
    // Show sample data
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, totalPoints: true }
    });
    
    console.log('👥 Users:');
    users.forEach(user => {
      console.log(`   ${user.id}. ${user.name} (${user.email}) - ${user.role} - ${user.totalPoints} points`);
    });
    
    const courses = await prisma.course.findMany({
      select: { id: true, title: true, isPublished: true, instructor: { select: { name: true } } }
    });
    
    console.log('\n📚 Courses:');
    courses.forEach(course => {
      console.log(`   ${course.id}. ${course.title} - ${course.isPublished ? '✅ Published' : '❌ Draft'} - by ${course.instructor.name}`);
    });
    
    console.log('\n✅ Database is working correctly!');
    console.log('🌐 Prisma Studio: http://localhost:5555');
    
  } catch (error) {
    console.error('❌ Database Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
