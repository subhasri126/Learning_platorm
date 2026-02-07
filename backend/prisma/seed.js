import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data (in development only!)
  await prisma.lessonProgress.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@learnsphere.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
      totalPoints: 0,
    },
  });

  const instructor = await prisma.user.create({
    data: {
      email: 'instructor@learnsphere.com',
      password: hashedPassword,
      name: 'John Instructor',
      role: 'INSTRUCTOR',
      totalPoints: 0,
    },
  });

  const learner1 = await prisma.user.create({
    data: {
      email: 'learner1@learnsphere.com',
      password: hashedPassword,
      name: 'Alice Learner',
      role: 'LEARNER',
      totalPoints: 150,
    },
  });

  const learner2 = await prisma.user.create({
    data: {
      email: 'learner2@learnsphere.com',
      password: hashedPassword,
      name: 'Bob Student',
      role: 'LEARNER',
      totalPoints: 550,
    },
  });

  console.log('✅ Users created');

  // Create Courses
  const course1 = await prisma.course.create({
    data: {
      title: 'Introduction to JavaScript',
      description: 'Learn the fundamentals of JavaScript programming from scratch.',
      thumbnail: 'https://via.placeholder.com/400x200?text=JavaScript+Course',
      isPublished: true,
      instructorId: instructor.id,
    },
  });

  const course2 = await prisma.course.create({
    data: {
      title: 'React for Beginners',
      description: 'Build modern web applications with React and React Hooks.',
      thumbnail: 'https://via.placeholder.com/400x200?text=React+Course',
      isPublished: true,
      instructorId: instructor.id,
    },
  });

  const course3 = await prisma.course.create({
    data: {
      title: 'Advanced Node.js (Draft)',
      description: 'Master backend development with Node.js and Express.',
      thumbnail: 'https://via.placeholder.com/400x200?text=NodeJS+Course',
      isPublished: false,
      instructorId: instructor.id,
    },
  });

  console.log('✅ Courses created');

  // Create Lessons for Course 1
  const lesson1 = await prisma.lesson.create({
    data: {
      title: 'What is JavaScript?',
      description: 'Introduction to JavaScript and its ecosystem',
      content: 'https://www.youtube.com/watch?v=example1',
      type: 'VIDEO',
      order: 1,
      duration: 15,
      courseId: course1.id,
    },
  });

  const lesson2 = await prisma.lesson.create({
    data: {
      title: 'Variables and Data Types',
      description: 'Learn about variables, let, const, and data types',
      content: 'https://www.youtube.com/watch?v=example2',
      type: 'VIDEO',
      order: 2,
      duration: 20,
      courseId: course1.id,
    },
  });

  const lesson3 = await prisma.lesson.create({
    data: {
      title: 'Functions in JavaScript',
      description: 'Understanding functions, arrow functions, and callbacks',
      content: 'https://docs.example.com/javascript-functions.pdf',
      type: 'DOCUMENT',
      order: 3,
      duration: 25,
      courseId: course1.id,
    },
  });

  // Create Lessons for Course 2
  const lesson4 = await prisma.lesson.create({
    data: {
      title: 'Getting Started with React',
      description: 'Setup and create your first React app',
      content: 'https://www.youtube.com/watch?v=react1',
      type: 'VIDEO',
      order: 1,
      duration: 18,
      courseId: course2.id,
    },
  });

  const lesson5 = await prisma.lesson.create({
    data: {
      title: 'React Components',
      description: 'Learn about functional and class components',
      content: 'https://www.youtube.com/watch?v=react2',
      type: 'VIDEO',
      order: 2,
      duration: 22,
      courseId: course2.id,
    },
  });

  console.log('✅ Lessons created');

  // Create Quiz for Course 1
  const quiz1 = await prisma.quiz.create({
    data: {
      title: 'JavaScript Basics Quiz',
      description: 'Test your knowledge of JavaScript fundamentals',
      courseId: course1.id,
      maxPoints: 100,
    },
  });

  // Create Questions for Quiz 1
  await prisma.question.createMany({
    data: [
      {
        questionText: 'What keyword is used to declare a constant in JavaScript?',
        options: JSON.stringify(['var', 'let', 'const', 'define']),
        correctAnswer: 'const',
        points: 25,
        order: 1,
        quizId: quiz1.id,
      },
      {
        questionText: 'Which of the following is NOT a JavaScript data type?',
        options: JSON.stringify(['String', 'Boolean', 'Integer', 'Undefined']),
        correctAnswer: 'Integer',
        points: 25,
        order: 2,
        quizId: quiz1.id,
      },
      {
        questionText: 'What does === operator do?',
        options: JSON.stringify([
          'Assigns a value',
          'Compares value only',
          'Compares value and type',
          'None of the above',
        ]),
        correctAnswer: 'Compares value and type',
        points: 25,
        order: 3,
        quizId: quiz1.id,
      },
      {
        questionText: 'Which function is used to parse a string to an integer?',
        options: JSON.stringify(['parseInt()', 'parseFloat()', 'Number()', 'toInteger()']),
        correctAnswer: 'parseInt()',
        points: 25,
        order: 4,
        quizId: quiz1.id,
      },
    ],
  });

  // Create Quiz for Course 2
  const quiz2 = await prisma.quiz.create({
    data: {
      title: 'React Fundamentals Quiz',
      description: 'Test your understanding of React concepts',
      courseId: course2.id,
      maxPoints: 100,
    },
  });

  await prisma.question.createMany({
    data: [
      {
        questionText: 'What is JSX?',
        options: JSON.stringify([
          'A JavaScript extension',
          'A CSS framework',
          'A testing library',
          'A database',
        ]),
        correctAnswer: 'A JavaScript extension',
        points: 50,
        order: 1,
        quizId: quiz2.id,
      },
      {
        questionText: 'Which hook is used for side effects in React?',
        options: JSON.stringify(['useState', 'useEffect', 'useContext', 'useReducer']),
        correctAnswer: 'useEffect',
        points: 50,
        order: 2,
        quizId: quiz2.id,
      },
    ],
  });

  console.log('✅ Quizzes and Questions created');

  // Create some progress for learner1
  await prisma.lessonProgress.create({
    data: {
      lessonId: lesson1.id,
      userId: learner1.id,
      isCompleted: true,
      completedAt: new Date(),
    },
  });

  await prisma.lessonProgress.create({
    data: {
      lessonId: lesson2.id,
      userId: learner1.id,
      isCompleted: true,
      completedAt: new Date(),
    },
  });

  // Create quiz attempts
  await prisma.quizAttempt.create({
    data: {
      quizId: quiz1.id,
      userId: learner1.id,
      score: 75,
      attemptNumber: 1,
      answers: JSON.stringify({
        1: 'const',
        2: 'Integer',
        3: 'Compares value only', // Wrong answer
        4: 'parseInt()',
      }),
    },
  });

  await prisma.quizAttempt.create({
    data: {
      quizId: quiz1.id,
      userId: learner2.id,
      score: 100,
      attemptNumber: 1,
      answers: JSON.stringify({
        1: 'const',
        2: 'Integer',
        3: 'Compares value and type',
        4: 'parseInt()',
      }),
    },
  });

  console.log('✅ Progress and quiz attempts created');
  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📧 Test Credentials:');
  console.log('Admin: admin@learnsphere.com / password123');
  console.log('Instructor: instructor@learnsphere.com / password123');
  console.log('Learner 1: learner1@learnsphere.com / password123');
  console.log('Learner 2: learner2@learnsphere.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
