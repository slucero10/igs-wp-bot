import { gql } from "graphql-request";
import { clientInit } from "../client.js";

let clients = clientInit("/clients");

export function fetchClients(current_db, first, skip) {
  let query = null;
  query = gql`
      {
        searchClients(current_db: "${current_db}", first:${first},skip:${skip}) {
          _id
          name
          identification
          phone
        }
      }
    `;
  return clients.request(query);
}

export function createClient() {
  let mutation = null;
    mutation = gql`
      mutation {
        createClientC(
          input: {
            name: "Client"
            identification: "124431"
            phone: "0994243234"
          }
        ) {
          _id
        }
      }
    `;
  return clients.request(mutation);
}

export function updateClient(id, campaign, date, line, index) {
  let query = null;
  query = gql`
    mutation{
        updateWPStatus(_id: "${id}", index: ${index}
          input:{
            name:"${campaign}",
            last_reach:"${date}",
            line:"${line}"
          })
          {
            name
            times_reached
            last_reach
            line
          }
      }
    `;
  return clients.request(query);
}
