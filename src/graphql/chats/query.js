import { gql } from 'graphql-request';
import { clientInit } from '../client.js';

let clients = clientInit("/chats");

export function createBackup(phone, from_number, to_number, message, event_type, pdf_sent) {
  let mutation = gql`
    mutation{
        createChatBackup(
          input:{
            phone_id:"${phone}",
            from:"${from_number}",
            to:"${to_number}",
            message:"${message}",
            pdf_name:"${pdf_sent}"
            type:"${event_type}",
          })
          {
            phone_id
            from
            to
            message
            type
          }
      }
    `;
  return clients.request(mutation);
}
