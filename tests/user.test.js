import '@babel/polyfill/noConflict';
import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';
import prisma from '../src/prisma';
import seedDatabase from './utils/seedDatabase';
import getClient from '../src/utils/getClient';

const client = getClient();

beforeEach(seedDatabase);

test('Should create a new user', async () => {
    const createUser = gql`
        mutation {
            createUser(
                data: {
                    name: "John"
                    email: "john@example.com"
                    password: "MyPass1234"
                }
            ) {
                token
                user {
                    id
                    name
                    email
                }
            }
        }
    `;
    const response = await client.mutate({
        mutation: createUser
    });

    const userExists = await prisma.exists.User({
        id: response.data.createUser.user.id
    });

    expect(userExists).toBe(true);
});

test('Should expose public author profiles', async () => {
    const getUsers = gql`
        query {
            users {
                id
                name
                email
            }
        }
    `;
    const response = await client.query({
        query: getUsers
    });

    expect(response.data.users.length).toBe(1);
    expect(response.data.users[0].email).toBe(null);
    expect(response.data.users[0].name).toBe('Rated');
});

test('Should not sign up with bad credentials', async () => {
    const signup = gql`
        mutation {
            createUser(
                data: {
                    name: "Smith"
                    email: "smith@example.com"
                    password: "Pass!"
                }
            ) {
                token
                user {
                    id
                    name
                    email
                }
            }
        }
    `;

    await expect(
        client.mutate({
            mutation: signup
        })
    ).rejects.toThrow();
});

test('Should not login with bad credentials', async () => {
    const login = gql`
        mutation {
            login(data: { email: "rated@example.com", password: "abc123" }) {
                token
                user {
                    id
                    name
                    email
                }
            }
        }
    `;

    await expect(
        client.mutate({
            mutation: login
        })
    ).rejects.toThrow();
});
