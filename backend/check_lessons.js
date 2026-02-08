import prisma from './src/config/database.js';

async function checkLessons() {
    try {
        const lessons = await prisma.lesson.findMany({
            where: { courseId: 10 }
        });
        console.log('Lessons for Course 10:', JSON.stringify(lessons, null, 2));
    } catch (error) {
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

checkLessons();
