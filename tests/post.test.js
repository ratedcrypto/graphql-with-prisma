import '@babel/polyfill/noConflict';
import { gql } from 'apollo-boost';
import prisma from '../src/prisma';
import seedDatabase, { userOne, postOne } from './utils/seedDatabase';
import getClient from './utils/getClient';
import { getPosts, myPosts, updatePost } from './utils/operations';

const client = getClient();

beforeEach(seedDatabase);

test('Should expose published posts', async () => {
    const response = await client.query({
        query: getPosts
    });

    expect(response.data.posts.length).toBe(1);
    expect(response.data.posts[0].published).toBe(true);
});

test('Should get my posts', async () => {
    const client = getClient(userOne.jwt);
    const response = await client.query({
        query: myPosts
    });

    expect(response.data.myPosts.length).toBe(2);
});

test('Should be able to update my post', async () => {
    const client = getClient(userOne.jwt);
    const variables = {
        id: postOne.post.id,
        data: {
            published: false
        }
    };
    const response = await client.mutate({
        mutation: updatePost,
        variables
    });
    const exists = await prisma.exists.Post({
        id: postOne.post.id,
        published: false
    });

    expect(exists).toBe(true);
    expect(response.data.updatePost.published).toBe(false);
});
