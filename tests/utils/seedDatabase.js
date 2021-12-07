import bcrypt from 'bcryptjs';
import prisma from '../../src/prisma';
import jwt from 'jsonwebtoken';

const userOne = {
    input: {
        name: 'Rated',
        email: 'rated@example.com',
        password: bcrypt.hashSync('MyPass7890')
    },
    user: undefined,
    jwt: undefined
};

const seedDatabase = async () => {
    await prisma.mutation.deleteManyComments();
    await prisma.mutation.deleteManyPosts();
    await prisma.mutation.deleteManyUsers();

    userOne.user = await prisma.mutation.createUser({
        data: userOne.input
    });

    userOne.jwt = jwt.sign(
        { userId: userOne.user.id },
        process.env.JWT_SECRET,
        {
            expiresIn: '1d'
        }
    );

    await prisma.mutation.createPost({
        data: {
            title: 'My first post',
            body: 'Body of my first post',
            published: true,
            author: {
                connect: {
                    id: userOne.user.id
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
                    id: userOne.user.id
                }
            }
        }
    });
};

export { seedDatabase as default, userOne };
