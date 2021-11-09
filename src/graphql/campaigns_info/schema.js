import { makeExecutableSchema } from '@graphql-tools/schema';
import { resolvers } from './resolvers.js';

const typeDefs = `
type Query {
  searchCampaign(name: String): Campaign
}

type Campaign {
  _id: ID
  name: String
  products: [CampaignInfo]
}

type CampaignInfo {
    product_name: String
    assistance_name: String
    url_accept_assistance: String
    html_path: String
    height: String
    width: String
    message: [String]
    info_messages: [String]
    cost_message: String
    accept_message: String
}
`;

export default makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: resolvers,
});
