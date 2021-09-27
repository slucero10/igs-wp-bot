import { Campaign } from './models/Campaigns.js';

export const resolvers = {
    Query: {
        searchCampaign: async (root, { name }) => {
            const cursor = await Campaign.findOne({ name: name });
            return cursor;
        },
    },
    Mutation: {
        createCampaign: async (_, { input }) => {
          let campaign = new Campaign(input);
          await campaign.save();
          return campaign;
        },
      },
};