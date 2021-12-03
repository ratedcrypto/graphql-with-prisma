# graphql-with-prisma

Production ready APIs with Node and GraphQL with Prisma using Postgres as db

## Libraries used
* graphql-yoga
* graphql-cli
* prisma (v1)
* prisma-binding
* babel core/cli/node/preset-env
* jsonwebtoken
* env-cmd
* bcryptjs

## Environment variables
Add a config folder with dev.env and prod.env with following values
* PRISMA_ENDPOINT=http://localhost:4466
* PRISMA_SECRET=supersecret
* JWT_SECRET=thisisasecret

## To deploy datamode using prisma
```$ prisma deploy -e ../config/dev.env```

## To fetch latest schema
```$ npm run get-schema```
