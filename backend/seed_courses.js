import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('🌱 Starting database seed...');

        // 1. Find an instructor
        const instructor = await prisma.user.findFirst({
            where: { role: 'instructor' }
        });

        if (!instructor) {
            console.error('❌ No instructor found. Please create an instructor user first (role: instructor).');
            process.exit(1);
        }

        console.log(`👨‍🏫 Using instructor: ${instructor.name} (ID: ${instructor.id})`);

        // 2. Create "Advanced React Patterns" Course
        const course1 = await prisma.course.create({
            data: {
                title: 'Advanced React Patterns',
                description: 'Level up your React skills with advanced composition patterns, performance optimization, and state management strategies.',
                thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
                isPublished: true,
                instructorId: instructor.id,
                lessons: {
                    create: [
                        // Unit 1
                        {
                            title: 'The Compound Component Pattern',
                            unitTitle: 'Unit 1: Composition Patterns',
                            description: 'Building flexible and reusable components.',
                            content: 'https://www.youtube.com/watch?v=hDkiCAOefVQ', // Placeholder
                            type: 'VIDEO',
                            order: 1,
                            duration: 20
                        },
                        {
                            title: 'Context Module Functions',
                            unitTitle: 'Unit 1: Composition Patterns',
                            description: 'Efficient state sharing without re-renders.',
                            content: '# Context Context\n\nLearn how to optimize your context usage.',
                            type: 'DOCUMENT',
                            order: 2,
                            duration: 25
                        },
                        // Unit 2
                        {
                            title: 'useMemo and useCallback Deep Dive',
                            unitTitle: 'Unit 2: Performance',
                            description: 'When and how to use memoization correctly.',
                            content: 'https://www.youtube.com/watch?v=vpE9I_eqHdM',
                            type: 'VIDEO',
                            order: 3,
                            duration: 30
                        }
                    ]
                }
            }
        });
        console.log(`✅ Created course: "${course1.title}" with 3 lessons.`);

        // 3. Create "Node.js Microservices" Course
        const course2 = await prisma.course.create({
            data: {
                title: 'Node.js Microservices',
                description: 'Architecting scalable systems with Node.js, Docker, and Kubernetes.',
                thumbnail: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&w=800&q=80',
                isPublished: true,
                instructorId: instructor.id,
                lessons: {
                    create: [
                        {
                            title: 'Monolith vs Microservices',
                            unitTitle: 'Module 1: Architecture',
                            description: 'Understanding the trade-offs.',
                            content: 'https://www.youtube.com/watch?v=1xo-0gCVhRE',
                            type: 'VIDEO',
                            order: 1,
                            duration: 15
                        },
                        {
                            title: 'Gateway Service with Express',
                            unitTitle: 'Module 2: Implementation',
                            description: 'Setting up the API Gateway.',
                            content: 'https://www.youtube.com/watch?v=lzGWY5bd5-k',
                            type: 'VIDEO',
                            order: 2,
                            duration: 45
                        },
                        {
                            title: 'Message Queues with RabbitMQ',
                            unitTitle: 'Module 3: Communication',
                            description: 'Asynchronous service communication.',
                            content: '# RabbitMQ Setup\n\nDocker compose configuration for RabbitMQ.',
                            type: 'DOCUMENT',
                            order: 3,
                            duration: 35
                        }
                    ]
                }
            }
        });
        console.log(`✅ Created course: "${course2.title}" with 3 lessons.`);

    } catch (error) {
        console.error('❌ Seeding failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
