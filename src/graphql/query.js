import { gql } from "graphql-request";
import { clientInit } from "./client.js";

let client = clientInit("/phones");
let clients = clientInit("/clients");

export function fetchBGRClientsTC(collection) {
  let query = null;
  if (collection == "TC") {
    query = gql`
      {
        searchClientsTC {
          _id
          name
          identification
          phone
        }
      }
    `;
  } else if (collection == "C") {
    query = gql`
      {
        searchClientsC {
          _id
          name
          identification
          phone
        }
      }
    `;
  }
  return clients.request(query);
}

export function createClient(collection) {
  let mutation = null;
  if (collection == "TC") {
    mutation = gql`
      mutation {
        createClientTCStatus(
          input: {
            client: "fghjkl;"
            sended: 0
            date_sended: null
            date_activated: null
          }
        ) {
          _id
        }
      }
    `;
  } else if (collection == "C") {
    /*mutation = gql`
    mutation{
        createClientC(
          input:{
            client:"yrtrgt",
            sended:0,
            date_sended:null,
            date_activated:null
          })
          { 
      	    _id
          }
      }
    `;*/
    mutation = gql`
      mutation {
        createClientC(
          input: {
            name: "yrtrgt"
            identification: "124431"
            phone: "0994243234"
          }
        ) {
          _id
        }
      }
    `;
  }
  return clients.request(mutation);
}

export function createPhone() {
  let mutation = gql`
    mutation {
      createPhone(input: { name: "2-A" }) {
        _id
      }
    }
  `;
  return client.request(mutation);
}

export function updateClient(collection, id, campaign, date, line) {
  let query = null;
  if (collection === "TC") {
    query = gql`
    mutation{
        updateClientTCStatus(_id: "${id}",
          input:{
            client: "${id}",
            sended:${sended},
            date_sended:"${date}"
          })
          { 
      	    _id
          } 
      }
    `;
  } else if (collection === "C") {
    query = gql`
    mutation{
        updateWPStatus(_id: "${id}",
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
  }
  return clients.request(query);
}
