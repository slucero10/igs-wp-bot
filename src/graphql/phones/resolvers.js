import { Phone } from './models/Phone.js';

export const resolvers = {
  Query: {
    searchPhone: async (root, { _id }) => {
      return Phone.findById(_id);
    },
    searchPhones: async () => {
      return Phone.find();
    },
    searchDB: async (root, { name }) => {
      let phone = await Phone.findOne({ name: name });
      if (phone == null || phone == undefined) {
        return false;
      } else {
        return true;
      }
    },
  },
};
