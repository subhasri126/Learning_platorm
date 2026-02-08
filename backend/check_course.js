import prisma from './src/config/database.js';

async function checkCourse() {
    try {
        const courseId = 10;
        const course = await prisma.course.findUnique({
            where: { id: courseId },
            include: {
                instructor: { select: { id: true, name: true, role: true } }
            }
        });

        if (course) {
            console.log('--- COURSE 10 DETAILS ---');
            console.log('ID:', course.id);
            console.log('Title:', course.title);
            console.log('isPublished:', course.isPublished);
            console.log('Instructor ID:', course.instructorId);
            console.log('Instructor Role:', course.instructor?.role);
            console.log('-------------------------');
        } else {
            console.log('❌ Course 10 not found.');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkCourse();
