import bcrypt from 'bcryptjs';
import getUserId from '../utils/getUserId';
import hashPassword from '../utils/hashPassword';
import generateToken from '../utils/generateToken';

const Mutation = {
    async createUser(parent, args, { prisma }, info) {
        const password = await hashPassword(args.data.password);
        const user = await prisma.mutation.createUser({
            data: {
                ...args.data,
                password
            }
        });

        return {
            user,
            token: generateToken(user.id)
        };
    },

    async login(parent, args, { prisma }, info) {
        const user = await prisma.query.user({
            where: {
                email: args.data.email
            }
        });

        if (!user) {
            throw new Error('Unable to login');
        }

        const isMatch = await bcrypt.compare(args.data.password, user.password);

        if (!isMatch) {
            throw new Error('Unable to login');
        }

        return {
            user,
            token: generateToken(user.id)
        };
    },

    async updateUser(parent, args, { request, prisma }, info) {
        const userId = getUserId(request);

        if (typeof args.data.password === 'string') {
            args.data.password = await hashPassword(args.data.password);
        }

        return prisma.mutation.updateUser(
            { data: args.data, where: { id: userId } },
            info
        );
    },

    deleteUser(parent, args, { request, prisma }, info) {
        const userId = getUserId(request);

        return prisma.mutation.deleteUser({ where: { id: userId } }, info);
    },

    createPost(parent, args, { request, prisma }, info) {
        const userId = getUserId(request);

        return prisma.mutation.createPost(
            {
                data: {
                    title: args.data.title,
                    body: args.data.title,
                    published: args.data.published,
                    author: {
                        connect: {
                            id: userId
                        }
                    }
                }
            },
            info
        );
    },

    async updatePost(parent, args, { request, prisma }, info) {
        const userId = getUserId(request);

        const postExists = await prisma.exists.Post({
            id: args.id,
            author: {
                id: userId
            }
        });

        const isPublished = await prisma.exists.Post({
            id: args.id,
            published: true
        });

        if (!postExists) {
            throw new Error('Unable to update post');
        }

        if (isPublished && args.data.published === false) {
            await prisma.mutation.deleteManyComments({
                where: {
                    post: {
                        id: args.id
                    }
                }
            });
        }

        return prisma.mutation.updatePost(
            { data: args.data, where: { id: args.id } },
            info
        );
    },

    async deletePost(parent, args, { request, prisma }, info) {
        const userId = getUserId(request);

        const postExists = await prisma.exists.Post({
            id: args.id,
            author: {
                id: userId
            }
        });

        if (!postExists) {
            throw new Error('Unable to delete post');
        }

        return prisma.mutation.deletePost({ where: { id: args.id } }, info);
    },

    async createComment(parent, args, { request, prisma }, info) {
        const userId = getUserId(request);

        const postExists = await prisma.exists.Post({
            id: args.data.post,
            published: true
        });

        if (!postExists) {
            throw new Error('Unable to find post');
        }

        return prisma.mutation.createComment(
            {
                data: {
                    text: args.data.text,
                    author: {
                        connect: {
                            id: userId
                        }
                    },
                    post: {
                        connect: {
                            id: args.data.post
                        }
                    }
                }
            },
            info
        );
    },

    async updateComment(parent, args, { request, prisma }, info) {
        const userId = getUserId(request);

        const commentExists = await prisma.exists.Comment({
            id: args.id,
            author: {
                id: userId
            }
        });

        if (!commentExists) {
            throw new Error('Unable to update comment');
        }

        return prisma.mutation.updateComment(
            { data: args.data, where: { id: args.id } },
            info
        );
    },

    async deleteComment(parent, args, { request, prisma }, info) {
        const userId = getUserId(request);

        const commentExists = await prisma.exists.Comment({
            id: args.id,
            author: {
                id: userId
            }
        });

        if (!commentExists) {
            throw new Error('Unable to delete comment');
        }

        return prisma.mutation.deleteComment({ where: { id: args.id } }, info);
    }
};

export default Mutation;
