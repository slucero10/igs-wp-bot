import { makeExecutableSchema } from '@graphql-tools/schema';
import { resolvers } from './resolvers.js';

const typeDefs = `
  type Query {
    searchPhone(_id: ID!): Phone
    searchPhones: [Phone]
    searchDB(name: String): Boolean
  }

  type Phone {
    _id: ID
    name: String!
    lines: [Line]
  }
  
  type Line {
    number: String
    status: Status
  }
  
  enum Status {
    ACTIVE
    BANNED
  }
`;

export default makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: resolvers,
});
