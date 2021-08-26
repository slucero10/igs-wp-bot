import { gql } from 'graphql-request';
import { clientInit } from '../client.js';

let client = clientInit('/phones');
export function fetchPhones() {
  const query = gql`
    {
      searchPhones {
        _id
        name
        lines {
          number
          status
        }
      }
    }
  `;
  return client.request(query);
}

export function fetchphone(_id) {
  const query = gql`
    {
      searchPhone(_id: "${_id}") {
        _id
        lines{
          number
          status
        } 
      }
    }
  `;
  return client.request(query);
}
/*
export function fetchArt(name) {
  const query = gql`
    {
      searchArt(name: "${name}" ){
        _id
        name
        phoneNames
        campaign{
          name
          url_accept_assistance
          html_path
          height
          width
          promo
        }
    }
  }
  `;
  return client.request(query);
}
*/