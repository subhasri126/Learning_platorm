import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const coursesData = [
  {
    title: 'Full Stack Web Foundations',
    description: 'Ship a production-ready front-end by mastering semantic HTML, responsive CSS, and modern React workflows.',
    thumbnail: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80',
    isPublished: true,
    units: [
      {
        title: 'Unit 1: Frontend Fundamentals',
        lessons: [
          {
            title: 'Semantic HTML in Practice',
            description: 'Use structural tags to build accessible layouts.',
            type: 'DOCUMENT',
            duration: 18,
            content: '# Semantic HTML\n- Use <header>, <nav>, <main>, and <footer> to describe layout\n- Prefer <section> and <article> instead of anonymous <div> blocks.\n- Add aria-labels to describe intent.',
            structuredContent: {
              manualContent: 'Lesson handout that explains landmarks with code snippets.'
            }
          },
          {
            title: 'Responsive CSS Layouts',
            description: 'Design systems that look great on every screen size.',
            type: 'DOCUMENT',
            duration: 20,
            content: 'https://patterns.dev/guide/responsive-layouts',
            structuredContent: {
              manualContent: 'Reference cheatsheet for grid/flex recipes',
              sections: [
                { heading: 'Fluid grids', bullets: ['Use repeat(auto-fit, minmax())', 'Set max-width to avoid stretched content'] }
              ]
            }
          },
          {
            title: 'JavaScript DOM Warm-up',
            description: 'Manipulate nodes, events, and state without frameworks.',
            type: 'VIDEO',
            duration: 22,
            content: 'https://www.youtube.com/watch?v=5fb2aPlgoys'
          }
        ],
        quiz: {
          title: 'Frontend Fundamentals Quiz',
          description: 'Checkpoint unlocked right after you wrap Unit 1.',
          maxPoints: 120,
          questions: [
            {
              questionText: 'Which HTML element describes the dominant content of a page?',
              options: ['<content>', '<section>', '<main>', '<summary>'],
              correctAnswer: '<main>',
              points: 30
            },
            {
              questionText: 'What CSS layout tool lets you define two-dimensional tracks?',
              options: ['Grid', 'Flexbox', 'Floats', 'Inline-block'],
              correctAnswer: 'Grid',
              points: 30
            },
            {
              questionText: 'Which method attaches a click listener to a DOM node?',
              options: ['node.listen()', 'node.handle()', 'node.addEventListener()', 'node.subscribe()'],
              correctAnswer: 'node.addEventListener()',
              points: 30
            },
            {
              questionText: 'What media-query breakpoint is best for large desktops in CSS?',
              options: ['min-width: 320px', 'min-width: 768px', 'min-width: 1024px', 'min-width: 1440px'],
              correctAnswer: 'min-width: 1440px',
              points: 30
            }
          ]
        }
      },
      {
        title: 'Unit 2: React & API Delivery',
        lessons: [
          {
            title: 'State Machines with Hooks',
            description: 'Design predictable UI state with useReducer and custom hooks.',
            type: 'VIDEO',
            duration: 26,
            content: 'https://www.youtube.com/watch?v=dGcsHMXbSOA'
          },
          {
            title: 'Fetching Data the Resilient Way',
            description: 'Layer Axios + React Query to handle caching and retries.',
            type: 'VIDEO',
            duration: 24,
            content: 'https://www.youtube.com/watch?v=VtYLFeZ0eh8'
          },
          {
            title: 'Deployment Checklist',
            description: 'Ship confidently with a 10-step production checklist.',
            type: 'DOCUMENT',
            duration: 15,
            content: 'https://learnsphere.dev/checklists/fullstack-rollout',
            structuredContent: {
              manualContent: 'Checklist covering bundle analysis, env vars, and monitoring hooks.'
            }
          }
        ]
      }
    ]
  },
  {
    title: 'Data Structures Crash Course',
    description: 'Master the fundamentals that power coding interviews by tackling real-world DS patterns.',
    thumbnail: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=900&q=80',
    isPublished: true,
    units: [
      {
        title: 'Unit 1: Linear Data Structures',
        lessons: [
          {
            title: 'Arrays vs Linked Lists',
            description: 'Pick the right structure for contiguous vs dynamic memory.',
            type: 'DOCUMENT',
            duration: 16,
            content: 'https://learnsphere.dev/dsa/arrays-vs-lists'
          },
          {
            title: 'Stacks & Queues Deep Dive',
            description: 'Implement browser history and task schedulers.',
            type: 'VIDEO',
            duration: 21,
            content: 'https://www.youtube.com/watch?v=wjI1WNcIntg'
          },
          {
            title: 'Two-Pointer Techniques',
            description: 'Solve sliding window challenges efficiently.',
            type: 'VIDEO',
            duration: 19,
            content: 'https://www.youtube.com/watch?v=MK-NZ4hN7rs'
          }
        ],
        quiz: {
          title: 'Linear Structures Quiz',
          description: 'Make sure Unit 1 is locked in before moving on.',
          maxPoints: 100,
          questions: [
            {
              questionText: 'What is the time complexity to prepend to a singly linked list?',
              options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
              correctAnswer: 'O(1)',
              points: 25
            },
            {
              questionText: 'Which data structure models function call execution?',
              options: ['Queue', 'Stack', 'Deque', 'Heap'],
              correctAnswer: 'Stack',
              points: 25
            },
            {
              questionText: 'Sliding window works best when the array elements are…',
              options: ['Sorted only', 'Hashable', 'Indexable in O(1)', 'Immutable'],
              correctAnswer: 'Indexable in O(1)',
              points: 25
            },
            {
              questionText: 'Which approach helps detect cycles in a linked list?',
              options: ['Binary search', 'Floyd’s tortoise and hare', 'DFS', 'Prefix sums'],
              correctAnswer: 'Floyd’s tortoise and hare',
              points: 25
            }
          ]
        }
      },
      {
        title: 'Unit 2: Trees, Tries & Graphs',
        lessons: [
          {
            title: 'Binary Tree Traversals',
            description: 'Traverse applications for UI rendering and parsers.',
            type: 'VIDEO',
            duration: 24,
            content: 'https://www.youtube.com/watch?v=Qxlr4HWT4zw'
          },
          {
            title: 'Graph Search Strategies',
            description: 'Compare BFS, DFS, and Dijkstra using city-routing examples.',
            type: 'VIDEO',
            duration: 27,
            content: 'https://www.youtube.com/watch?v=GazC3A4OQTE'
          },
          {
            title: 'Visualizing Disjoint Sets',
            description: 'Union-Find animations for cycle detection.',
            type: 'IMAGE',
            duration: 10,
            content: 'https://learnsphere.dev/assets/disjoint-set.png'
          }
        ]
      }
    ]
  },
  {
    title: 'Instructor Launchpad (Draft)',
    description: 'A sandbox course instructors can duplicate to craft bespoke curricula.',
    thumbnail: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=900&q=80',
    isPublished: false,
    units: [
      {
        title: 'Unit 1: Planning & Onboarding',
        lessons: [
          {
            title: 'Define Outcomes that Matter',
            description: 'Map OKRs to module-level learning objectives.',
            type: 'DOCUMENT',
            duration: 12,
            content: 'https://learnsphere.dev/playbooks/outcomes'
          },
          {
            title: 'Recording Studio Setup',
            description: 'Lighting, audio, and framing best practices.',
            type: 'VIDEO',
            duration: 14,
            content: 'https://www.youtube.com/watch?v=T5BE5L0U6cs'
          }
        ],
        quiz: {
          title: 'Curriculum Blueprint Quiz',
          description: 'Quick pulse-check before you duplicate this template.',
          maxPoints: 60,
          questions: [
            {
              questionText: 'Which statement defines a measurable learning objective?',
              options: [
                'Students will understand servers',
                'Students can deploy an Express API with JWT auth',
                'Students enjoy backend work',
                'Students like databases'
              ],
              correctAnswer: 'Students can deploy an Express API with JWT auth',
              points: 30
            },
            {
              questionText: 'What is the recommended length for a single micro-lesson video?',
              options: ['2 minutes', '5 minutes', '10 minutes', '25 minutes'],
              correctAnswer: '10 minutes',
              points: 30
            }
          ]
        }
      }
    ]
  }
];

async function resetDatabase() {
  await prisma.lessonProgress.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();
}

async function seedUsers() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const [admin, instructor, learnerOne, learnerTwo] = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@learnsphere.com',
        password: hashedPassword,
        name: 'Admin User',
        role: 'admin',
        totalPoints: 0
      }
    }),
    prisma.user.create({
      data: {
        email: 'instructor@learnsphere.com',
        password: hashedPassword,
        name: 'John Instructor',
        role: 'instructor',
        totalPoints: 0
      }
    }),
    prisma.user.create({
      data: {
        email: 'learner1@learnsphere.com',
        password: hashedPassword,
        name: 'Alice Learner',
        role: 'user',
        totalPoints: 150
      }
    }),
    prisma.user.create({
      data: {
        email: 'learner2@learnsphere.com',
        password: hashedPassword,
        name: 'Bob Student',
        role: 'user',
        totalPoints: 550
      }
    })
  ]);

  return { admin, instructor, learners: [learnerOne, learnerTwo] };
}

async function seedCourses(instructor) {
  const seededCourses = [];

  for (const courseBlueprint of coursesData) {
    const course = await prisma.course.create({
      data: {
        title: courseBlueprint.title,
        description: courseBlueprint.description,
        thumbnail: courseBlueprint.thumbnail,
        isPublished: courseBlueprint.isPublished,
        instructorId: instructor.id
      }
    });

    const lessons = [];
    const quizzes = [];
    let lessonOrder = 1;

    for (const unit of courseBlueprint.units) {
      for (const lessonDef of unit.lessons) {
        const lessonData = {
          title: lessonDef.title,
          unitTitle: unit.title,
          description: lessonDef.description,
          content: lessonDef.content,
          type: lessonDef.type,
          order: lessonOrder++,
          duration: lessonDef.duration,
          courseId: course.id
        };

        if (lessonDef.structuredContent) {
          lessonData.structuredContent = lessonDef.structuredContent;
        }

        const lesson = await prisma.lesson.create({ data: lessonData });
        lessons.push(lesson);
      }

      if (unit.quiz) {
        const quiz = await prisma.quiz.create({
          data: {
            title: unit.quiz.title,
            description: unit.quiz.description,
            courseId: course.id,
            maxPoints: unit.quiz.maxPoints
          }
        });

        await prisma.question.createMany({
          data: unit.quiz.questions.map((question, index) => ({
            questionText: question.questionText,
            options: JSON.stringify(question.options),
            correctAnswer: question.correctAnswer,
            points: question.points,
            order: index + 1,
            quizId: quiz.id
          }))
        });

        const questions = await prisma.question.findMany({
          where: { quizId: quiz.id },
          orderBy: { order: 'asc' }
        });

        quizzes.push({ ...quiz, questions });
      }
    }

    seededCourses.push({ course, lessons, quizzes });
  }

  return seededCourses;
}

async function seedProgressSamples(learners, seededCourses) {
  if (!seededCourses.length || !learners.length) {
    return;
  }

  const [learnerOne, learnerTwo] = learners;
  const firstCourse = seededCourses[0];
  const secondCourse = seededCourses[1];

  // Mark first two lessons of the first course as completed for learner one
  await prisma.lessonProgress.createMany({
    data: firstCourse.lessons.slice(0, 2).map((lesson) => ({
      lessonId: lesson.id,
      userId: learnerOne.id,
      isCompleted: true,
      completedAt: new Date()
    }))
  });

  if (secondCourse) {
    await prisma.lessonProgress.createMany({
      data: secondCourse.lessons.slice(0, 1).map((lesson) => ({
        lessonId: lesson.id,
        userId: learnerTwo.id,
        isCompleted: true,
        completedAt: new Date()
      }))
    });
  }

  // Create sample quiz attempts once Unit 1 quizzes exist
  for (const [index, seededCourse] of seededCourses.entries()) {
    const quiz = seededCourse.quizzes[0];
    if (!quiz) continue;

    const targetLearner = index % 2 === 0 ? learnerOne : learnerTwo;
    const answers = {};
    let score = 0;

    quiz.questions.forEach((question, questionIndex) => {
      const answer = questionIndex % 2 === 0 ? question.correctAnswer : question.options[0];
      answers[question.id] = answer;
      if (answer === question.correctAnswer) {
        score += question.points;
      }
    });

    await prisma.quizAttempt.create({
      data: {
        quizId: quiz.id,
        userId: targetLearner.id,
        score,
        attemptNumber: 1,
        answers
      }
    });
  }
}

async function main() {
  console.log('🌱 Starting database seed...');
  await resetDatabase();
  console.log('🧹 Cleared existing data');

  const { admin, instructor, learners } = await seedUsers();
  console.log('👥 Users ready (admin, instructor, 2 learners)');

  const seededCourses = await seedCourses(instructor);
  console.log('📚 Courses, lessons, and Unit 1 quizzes created');

  await seedProgressSamples(learners, seededCourses);
  console.log('🏁 Sample learner progress + quiz attempts recorded');

  console.log('\n🎉 Database seeded successfully!');
  seededCourses.forEach(({ course, lessons, quizzes }) => {
    console.log(`   • ${course.title} → ${lessons.length} lessons, ${quizzes.length} quiz(es)`);
  });

  console.log('\n📧 Test Credentials:');
  console.log('Admin:    admin@learnsphere.com / password123');
  console.log('Instructor: instructor@learnsphere.com / password123');
  console.log('Learner 1: learner1@learnsphere.com / password123');
  console.log('Learner 2: learner2@learnsphere.com / password123');
}

main()
  .catch((error) => {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
