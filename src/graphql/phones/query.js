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

export function fetchPhone(_id) {
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

export function checkInDB(name) {
  const query = gql`
  {
    searchDB(name: "${name}")
  }
  `;
  return client.request(query);
}