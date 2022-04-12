import { Chat } from './models/Chats.js';

export const resolvers = {
    Mutation: {
        createChatBackup: async (_, { input }) => {
            return Chat.create(input);
        },
    },
};