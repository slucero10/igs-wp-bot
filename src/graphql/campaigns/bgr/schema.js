import { makeExecutableSchema } from 'graphql-tools';
import { resolvers } from './resolvers.js';

const typeDefs = `
  type Query {
    searchClientsTC: [Client]
    searchClientsC: [Client]
    searchClientsTCStatus: [ClientStatus]
    searchClientsCStatus: [ClientStatus]
  }
  
  type Client {
    _id: ID
    name: String
    identification: String
    phone: String
  }

  type ClientStatus {
    _id: ID
    client: Client
    wp_status: String
    sended: Int
    date_sended: String
    date_activated: String
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

    createClientTCStatus(input: ClientStatusInput): ClientStatus
    updateClientTCStatus(_id: ID,input: ClientStatusInput): ClientStatus

    createClientCStatus(input: ClientStatusInput): ClientStatus
    updateClientCStatus(_id: ID,input: ClientStatusInput): ClientStatus
    updateWPStatus(_id: ID,input: WPStatusInput): WPStatus
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

  input ClientStatusInput {
    client: ID!
    wp_status: String
    sended: Int
    date_sended: String
    date_activated: String
  }
`;
export function serverSchema(collection) {
  return makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: resolvers(collection),
  });
}

