import { Clients, WPStatus, IGSStatus, CampaignStatus } from './models/Clients.js';

export function resolvers(collection) {
  const Client = Clients(collection);
  return {
    Query: {
      searchClients: async(_, { current_db, first, skip }) => {
        let cursor = new Object();
        if (current_db == '' || current_db == null) {
          cursor = await Client.find().skip(first).limit(skip);
        } else{
          cursor = await Client.find({ base: current_db }).skip(first).limit(skip);
        }
        return cursor;
      },
      searchCampaignStatus: async(_, { number, index }) => {
        let cursor = new Object();
        cursor = await Client.findOne({ phone: number });
        if (!cursor) {
          cursor = await Client.findOne({ phone: '0' + number });
        }
        if (!cursor) {
          return null;
        }
        return cursor.IGS_status.campaign_status[index];
      },
      searchContactStatus: async(_, { number }) => {
        let cursor = new Object();
        cursor = await Client.findOne({ phone: number });
        if (!cursor) {
          cursor = await Client.findOne({ phone: '0' + number });
        }
        if (!cursor) {
          return null;
        }
        return cursor.IGS_status.contact_status;
      }
    },
    Mutation: {
      updateWPStatus: async (_, { _id, index, input }) => {
        let cont = await Client.findById(_id);
        if (!cont.IGS_status) {
          const wpstatus = new WPStatus(input);
          cont.IGS_status = new IGSStatus();
          cont.IGS_status.wp_status[index] = wpstatus;
        } else {
          if (!cont.IGS_status.wp_status[index]) {
            cont.IGS_status.wp_status[index] = new WPStatus(input);
          } else {
            cont.IGS_status.wp_status[index].times_reached += 1;
            cont.IGS_status.wp_status[index].name = input.name;
            cont.IGS_status.wp_status[index].last_reached = input.last_reached;
            cont.IGS_status.wp_status[index].line += ', ' + input.line;
          }

        }
        const obj = JSON.parse(JSON.stringify(cont));
        return Client.findByIdAndUpdate(_id, obj);
      },
      updateCampaignStatus: async (_, {phone, index, input}) => {
        let cont = await Client.findOne({ phone: phone });
        if (!cont) {
          cont = await Client.findOne({ phone: '0' + phone });
        }
        if (!cont) {
          return null;
        }
        if (!cont.IGS_status) {
          const campaignStatus = new CampaignStatus(input);
          cont.IGS_status = new IGSStatus();
          cont.IGS_status.campaign_status[index] = campaignStatus;
        } else {
          if (!cont.IGS_status.campaign_status[index]) {
            cont.IGS_status.campaign_status[index] = new CampaignStatus(input);
          } else {
            cont.IGS_status.campaign_status[index].name = input.name;
            cont.IGS_status.campaign_status[index].assistance_status = input.assistance_status;
          }
        }
        const obj = JSON.parse(JSON.stringify(cont));
        return Client.findByIdAndUpdate(cont._id, obj);
      },
      updateContactStatus: async (_, {phone, input}) => {
        let cont = await Client.findOne({ phone: phone });
        if (!cont) {
          cont = await Client.findOne({ phone: '0' + phone });
        }
        if (!cont) {
          return null;
        }
        if (!cont.IGS_status) {
          cont.IGS_status = new IGSStatus();
          cont.IGS_status.contact_status = input.contact_status;
        } else {
          cont.IGS_status.contact_status = input.contact_status;
        }
        const obj = JSON.parse(JSON.stringify(cont));
        return Client.findByIdAndUpdate(cont._id, obj);
      }
    },
  }
}
