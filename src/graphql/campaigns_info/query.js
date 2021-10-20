import { gql } from 'graphql-request';
import { clientInit } from '../client.js';

let client = clientInit('/campaigns');
export function fetchCampaign(name) {
    const query = gql`
    {
      searchCampaign(name:"${name}") {
        name
        products {
            product_name
            assistance_name
            url_accept_assistance
            html_path
            height
            width
            message
            info_messages
            cost_message
            accept_message
        }
      }
    }
  `;
    return client.request(query);
}

export function createCampaign() {
    let mutation = null;
    mutation = gql`
        mutation {
          createCampaign(
            input: {
              name: "Campaign"
            }
          ) {
            _id
          }
        }
      `;
    return client.request(mutation);
}