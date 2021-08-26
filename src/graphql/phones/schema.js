import { makeExecutableSchema } from 'graphql-tools';
import { resolvers } from './resolvers.js';

const typeDefs = `
  type Query {
    searchPhone(_id: ID!): Phone
    searchPhones: [Phone]
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
  

  type Mutation {
    createPhone(input: PhoneInput): Phone
    deletePhone(_id: ID!): Phone
    updatePhone(_id: ID!, input: PhoneInput): Phone
  }
  
  input PhoneInput {
    name: String
    number: String
    status: Status
    campaign: String
  }
`;

export default makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: resolvers,
});
