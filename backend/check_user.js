import prisma from './src/config/database.js';

async function checkUser() {
    try {
        const user = await prisma.user.findUnique({
            where: { id: 14 }
        });
        console.log('USER_NAME_LENGTH:', user?.name?.length);
        console.log('USER_NAME:', user?.name);
    } catch (error) {
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

checkUser();
