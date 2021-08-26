import { Clients, WPStatus, IGSStatus } from './models/BGRDataBase.js';

export function resolvers(collection) {
  const Client = Clients(collection);
  return {
    Query: {
      searchClientsTC: async () => {
        return BGRClientsTC.find();
      },
      searchClientsC: async () => {
        return Client.find();
      },
      searchClientsTCStatus: async () => {
        return BGRClientsTCStatus.find();
      },
      searchClientsCStatus: async () => {
        return BGRClientsCStatus.find();
      },
    },
    Mutation: {
      createClientTC: async (_, { input }) => {
        const client = new Client(input);
        await client.save();
        return client;
      },
      createClientC: async (_, { input }) => {
        const client = new Client(input);
        await client.save();
        return client;
      },

      createClientTCStatus: async (_, { input }) => {
        const client = new BGRClientsTCStatus(input);
        await client.save();
        return client;
      },
      updateClientTCStatus: async (_, { _id, input }) => {
        const searchClientByID = await BGRClientsTCStatus.find({ client: _id });
        let cont = await BGRClientsTCStatus.findById(searchClientByID[0]._id);
        //console.log(cont);
        input.sended = cont.sended + 1;
        const obj = JSON.parse(JSON.stringify(input));
        //console.log(obj);
        return BGRClientsTCStatus.findByIdAndUpdate(searchClientByID[0]._id, obj);
        //return null;
      },
      createClientCStatus: async (_, { input }) => {
        const client = new BGRClientsCStatus(input);
        await client.save();
        return client;
      },
      updateClientCStatus: async (_, { _id, input }) => {
        //const searchClientByID = await BGRClientsC.find({client: _id});
        let cont = await BGRClientsC.findById(_id);
        //console.log(cont);
        cont.IGS_status.wp_status[0].times_reached += 1;
        cont.IGS_status.wp_status[0].name = input.name;
        cont.IGS_status.wp_status[0].last_reached = input.last_reached;
        cont.IGS_status.wp_status[0].line = input.line;
        const obj = JSON.parse(JSON.stringify(cont));
        //console.log(obj);
        return Client.findByIdAndUpdate(_id, obj);
        //return null;
      },
      updateWPStatus: async (_, { _id, input }) => {
        //const searchClientByID = await BGRClientsC.find({client: _id});
        let cont = await Client.findById(_id);
        //console.log(cont);
        if (!cont.IGS_status) {
          const wpstatus = new WPStatus(input);
          cont.IGS_status = new IGSStatus();
          cont.IGS_status.wp_status[0] = wpstatus;
        } else {
          cont.IGS_status.wp_status[0].times_reached += 1;
          cont.IGS_status.wp_status[0].name = input.name;
          cont.IGS_status.wp_status[0].last_reached = input.last_reached;
          cont.IGS_status.wp_status[0].line = input.line;
        }

        const obj = JSON.parse(JSON.stringify(cont));
        //console.log(obj);
        return Client.findByIdAndUpdate(_id, obj);
        //return null;
      },
    },
  }
}
