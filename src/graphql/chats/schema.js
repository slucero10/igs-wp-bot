import { makeExecutableSchema } from '@graphql-tools/schema';
import { resolvers } from './resolvers.js';

const typeDefs = `
  type Chat {
    phone_id: String
    from: String
    to: String
    message: String
    pdf_name: String
    type: String
  }
  
  type Mutation { 
    createChatBackup(_input: ChatInput): Chat   
  }
  
  input ChatInput {
    phone_id: String
    from: String
    to: String
    message: String
    pdf_name: String
    type: String
  }
`;

export default makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: resolvers,
  });
  

