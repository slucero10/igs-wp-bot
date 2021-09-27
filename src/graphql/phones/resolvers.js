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
  Mutation: {
    createPhone: async (_, { input }) => {
      let phone = new Phone(input);
      await phone.save();
      return phone;
    },
    deletePhone: async (_, { _id }) => {
      return Phone.findByIdAndDelete(_id);
    },
    updatePhone: async (_, { _id, input }) => {
      let cursor = await Phone.findById(_id);
      let line_index = cursor.lines.findIndex(
        (line) => line.campaign === input.campaign
      );
      if (input.index === undefined) {
        input.index = cursor.lines[line_index].index;
      }
      let indexObject = {};
      indexObject['lines.' + line_index + '.index'] = input.index;
      return Phone.findByIdAndUpdate(
        _id,
        {
          $set: indexObject,
        },
        { new: true }
      );
    },
  },
};
