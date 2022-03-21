import { gql } from "graphql-request";
import { clientInit } from "../client.js";

let clients = clientInit("/clients");

export function fetchClients(current_db, first, skip) {
  let query = gql`
      {
        searchClients(current_db: "${current_db}", first:${first},skip:${skip}) {
          _id
          name
          identification
          phone
          gender
          IGS_status {
            wp_status {
              name
              times_reached
              last_reach
              line
            }
            campaign_status {
              name
              assistance_status
              activation_date
              cancellation_date
              medium
            }
            contact_status
          }
        }
      }
    `;
  return clients.request(query);
}

export function fetchClientByPhone(number) {
  let query = gql`
      {
        searchClientByPhone(phone: "${number}") {
          _id
          name
          identification
          phone
          IGS_status {
            wp_status {
              name
              times_reached
              last_reach
              line
            }
            campaign_status {
              name
              assistance_status
              activation_date
              cancellation_date
              medium
            }
            contact_status
          }
        }
      }
    `;
  return clients.request(query);
}

export function checkCampaignStatus(number, index) {
  let query = gql`
    {
      searchCampaignStatus(number: "${number}", index: ${index}) {
        name
        assistance_status
        activation_date
        cancellation_date
        medium
      }
    }
  `;
  return clients.request(query);
}

export function checkContactStatus(number) {
  let query = gql`
    {
      searchContactStatus(number: "${number}")
    }
  `;
  return clients.request(query);
}

export function updateClient(id, campaign, date, line, index) {
  let mutation = gql`
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
  return clients.request(mutation);
}

export function updateCampaignStatus(phone, campaign, status, index) {
  let mutation = gql`
    mutation{
      updateCampaignStatus(phone: "${phone}", index: ${index}
      input:{
        name:"${campaign}",
        assistance_status:"${status}"
      })
      {
        name
        assistance_status
        activation_date
        cancellation_date
        medium
      }
    }
  `;
  return clients.request(mutation);
}

export function updateContactStatus(phone, status) {
  let mutation = gql`
  mutation{
    updateContactStatus(phone: "${phone}"
    input:{
      contact_status:"${status}"
    })
    {
      contact_status
    }
  }
  `;
  return clients.request(mutation);
}
