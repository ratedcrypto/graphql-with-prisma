# graphql-with-prisma

Production ready APIs with Node and GraphQL with Prisma using Postgres as db

## Libraries used

-   graphql-yoga
-   graphql-cli
-   prisma (v1)
-   prisma-binding
-   babel core/cli/node/preset-env
-   jsonwebtoken
-   env-cmd
-   bcryptjs
-   apollo-boost
-   jest

## Environment variables

Add a config folder with dev.env, test.env and prod.env with following values

```
PRISMA_ENDPOINT=http://localhost:4466
PRISMA_SECRET=supersecret
JWT_SECRET=thisisasecret
DB_CONNECTOR=postgres
DB_HOST=mydatabase.amazonaws.com
DB_PORT='5432'
DB_NAME=mydatabase
DB_SSL_CONNECTION=true
DB_USER=myuser
DB_PASSWORD=mypassword
```

## To deploy prisma docker container

`$ docker-compose --env-file ./config/dev.env up`

## To deploy datamode using prisma

`$ npm run prisma-deploy`
or
`$ prisma deploy -e ../config/dev.env`

## To fetch latest schema

`$ npm run get-schema`

## To run unit tests

`$ npm run test`
