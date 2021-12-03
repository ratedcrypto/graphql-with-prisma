import '@babel/polyfill/noConflict';
import { GraphQLServer, PubSub } from 'graphql-yoga';
import { resolvers, fragmentReplacements } from './resolvers';
import prisma from './prisma';

const pubsub = new PubSub();

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context(request) {
        return {
            request,
            prisma,
            pubsub
        };
    },
    fragmentReplacements
});

server.start({ port: process.env.PORT || 4000 }, () =>
    console.log('Server is running on localhost:4000')
);