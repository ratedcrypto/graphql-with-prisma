import '@babel/polyfill/noConflict';
import prisma from '../src/prisma';
import seedDatabase, { userOne } from './utils/seedDatabase';
import getClient from './utils/getClient';
import { createUser, login, getUsers, getProfile } from './utils/operations';

const client = getClient();

beforeEach(seedDatabase);

test('Should create a new user', async () => {
    const variables = {
        data: {
            name: 'John',
            email: 'john@example.com',
            password: 'MyPass1234'
        }
    };
    const response = await client.mutate({
        mutation: createUser,
        variables
    });
    const userExists = await prisma.exists.User({
        id: response.data.createUser.user.id
    });

    expect(userExists).toBe(true);
});

test('Should expose public author profiles', async () => {
    const response = await client.query({
        query: getUsers
    });

    expect(response.data.users.length).toBe(1);
    expect(response.data.users[0].email).toBe(null);
    expect(response.data.users[0].name).toBe('Rated');
});

test('Should not sign up with bad credentials', async () => {
    const variables = {
        data: {
            name: 'Smith',
            email: 'smith@example.com',
            password: 'Pass!'
        }
    };

    await expect(
        client.mutate({
            mutation: createUser,
            variables
        })
    ).rejects.toThrow();
});

test('Should not login with bad credentials', async () => {
    const variables = {
        data: { email: 'rated@example.com', password: 'abc123' }
    };

    await expect(
        client.mutate({
            mutation: login,
            variables
        })
    ).rejects.toThrow();
});

test('Should fetch user profile', async () => {
    const client = getClient(userOne.jwt);
    const response = await client.query({
        query: getProfile
    });

    expect(response.data.me.id).toBe(userOne.user.id);
    expect(response.data.me.name).toBe(userOne.user.name);
    expect(response.data.me.email).toBe(userOne.user.email);
});
