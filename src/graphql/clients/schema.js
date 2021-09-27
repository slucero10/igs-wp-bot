import { makeExecutableSchema } from '@graphql-tools/schema';
import { resolvers } from './resolvers.js';

const typeDefs = `
  type Query {
    searchClients(current_db: String, first: Int, skip: Int): [Client]
  }
  
  type Client {
    _id: ID
    name: String
    identification: String
    phone: String
  }

  type WPStatus {
    name: String
    times_reached: Int
    last_reach: String
    line: String
  }
  
  type Mutation {
    createClientTC(input: ClientInput): Client
    createClientC(input: ClientInput): Client
    
    updateWPStatus(_id: ID,index: Int,input: WPStatusInput): WPStatus
  }
  
  input ClientInput {
    name: String!
    identification: String
    phone: String
  }

  input WPStatusInput {
    name: String
    last_reach: String
    line: String
  }
`;
export function serverSchema(collection) {
  return makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: resolvers(collection),
  });
}

