import bcrypt from 'bcryptjs';
import prisma from '../../src/prisma';

const seedDatabase = async () => {
    await prisma.mutation.deleteManyComments();
    await prisma.mutation.deleteManyPosts();
    await prisma.mutation.deleteManyUsers();

    const user = await prisma.mutation.createUser({
        data: {
            name: 'Rated',
            email: 'rated@example.com',
            password: bcrypt.hashSync('MyPass7890')
        }
    });

    await prisma.mutation.createPost({
        data: {
            title: 'My first post',
            body: 'Body of my first post',
            published: true,
            author: {
                connect: {
                    id: user.id
                }
            }
        }
    });

    await prisma.mutation.createPost({
        data: {
            title: 'My second post',
            body: 'Body of my second post',
            published: false,
            author: {
                connect: {
                    id: user.id
                }
            }
        }
    });
};

export { seedDatabase as default };
