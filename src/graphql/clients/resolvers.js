import { Clients, WPStatus, IGSStatus } from './models/Clients.js';

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
    },
    Mutation: {
      updateWPStatus: async (_, { _id, index, input }) => {
        let cont = await Client.findById(_id);
        if (!cont.IGS_status) {
          const wpstatus = new WPStatus(input);
          cont.IGS_status = new IGSStatus();
          cont.IGS_status.wp_status[index] = wpstatus;
        } else {
          if (!cont.IGS_status[index]) {
            cont.IGS_status.wp_status[index] = new WPStatus(input);
          } else {
            cont.IGS_status.wp_status[index].times_reached += 1;
            cont.IGS_status.wp_status[index].name = input.name;
            cont.IGS_status.wp_status[index].last_reached = input.last_reached;
            cont.IGS_status.wp_status[index].line = input.line;
          }

        }
        const obj = JSON.parse(JSON.stringify(cont));
        return Client.findByIdAndUpdate(_id, obj);
      },
    },
  }
}
