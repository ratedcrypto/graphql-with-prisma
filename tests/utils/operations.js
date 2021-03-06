import { gql } from 'apollo-boost';

const createUser = gql`
    mutation ($data: CreateUserInput!) {
        createUser(data: $data) {
            token
            user {
                id
                name
                email
            }
        }
    }
`;

const getUsers = gql`
    query {
        users {
            id
            name
            email
        }
    }
`;

const login = gql`
    mutation ($data: LoginUserInput!) {
        login(data: $data) {
            token
            user {
                id
                name
                email
            }
        }
    }
`;

const getProfile = gql`
    query {
        me {
            id
            name
            email
        }
    }
`;

const getPosts = gql`
    query {
        posts {
            id
            title
            body
            published
        }
    }
`;

const myPosts = gql`
    query {
        myPosts {
            id
            title
            body
            published
        }
    }
`;

const updatePost = gql`
    mutation ($id: ID!, $data: UpdatePostInput!) {
        updatePost(id: $id, data: $data) {
            id
            title
            body
            published
        }
    }
`;

export {
    createUser,
    login,
    getUsers,
    getProfile,
    getPosts,
    myPosts,
    updatePost
};
