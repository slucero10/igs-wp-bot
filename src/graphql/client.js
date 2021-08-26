import { GraphQLClient } from 'graphql-request';

export function clientInit(name) {
  const client = new GraphQLClient('http://localhost:3000/api' + name, {
    headers: {},
  });
  return client;
}
