import { makeExecutableSchema } from '@graphql-tools/schema';
import { resolvers } from './resolvers.js';

const typeDefs = `
  type Query {
    searchClients(current_db: String, first: Int, skip: Int): [Client]
    searchClientByPhone(phone: String): Client
    searchCampaignStatus(number: String, index: Int): CampaignStatus
    searchContactStatus(number: String): String
  }
  
  type Client {
    _id: ID
    name: String
    identification: String
    phone: String
    IGS_status: IGS_status
  }

  type IGS_status {
    wp_status: [WPStatus]
    campaign_status: [CampaignStatus]
    contact_status: String
  }

  type CampaignStatus {
    name: String
    assistance_status: String
    activation_date: String
    cancellation_date: String
    medium: String
  }

  type WPStatus {
    name: String
    times_reached: Int
    last_reach: String
    line: String
  }

  type ContactStatus{
    contact_status: String
  }
  
  type Mutation {    
    updateWPStatus(_id: ID,index: Int,input: WPStatusInput): WPStatus
    updateCampaignStatus(phone: String,index: Int,input: CampaignStatusInput): CampaignStatus
    updateContactStatus(phone: String,input: ContactStatusInput): ContactStatus
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

  input CampaignStatusInput {
    name: String
    assistance_status: String
  }

  input ContactStatusInput {
    contact_status: String
  }
`;

export function serverSchema(collection) {
  return makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: resolvers(collection),
  });
}

