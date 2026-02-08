import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkUsers() {
    try {
        const users = await prisma.user.findMany({
            where: { role: 'INSTRUCTOR' },
            select: { id: true, name: true, email: true, role: true }
        });

        console.log('--- FOUND INSTRUCTORS ---');
        users.forEach(u => {
            console.log(`Email: ${u.email}, Name: ${u.name}, Role: ${u.role}`);
        });

        if (users.length === 0) {
            console.log('❌ NO INSTRUCTORS FOUND! Creating one...');
            // Create default instructor if none exist
            // Since password hashing is not easily scripted here without deps, 
            // I'll just rely on the seeding or manual creation
            console.log('Please register a new instructor at /register');
        }

        const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
        if (admin) {
            console.log(`\n--- FOUND ADMIN ---`);
            console.log(`Email: ${admin.email}`);
        }

    } catch (error) {
        console.error('Error checking users:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkUsers();
