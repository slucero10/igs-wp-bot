import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const model = mongoose.model;

const StatusTypes = Object.freeze({
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  UNSUBSCRIBED: 'UNSUBSCRIBED',
  TO_CONTACT: 'TO_CONTACT',
  CONTACTED: 'CONTACTED',
  UNREACHABLE: 'UNREACHABLE',
});

const mediumTypes = Object.freeze({
  WHATSAPP: 'WHATSAPP',
  EMAIL: 'EMAIL',
});

const wpStatusSchema = new Schema(
  {
    name: {
      type: String
    },
    times_reached: {
      type: Number,
      default: 1
    },
    last_reach: {
      type: Date
    },
    line: {
      type: String
    }
  },{_id: false}
);

const emailStatusSchema = new Schema(
  {
    name: {
      type: String
    },
    times_reached: {
      type: Number,
      default: 0
    },
    last_reach: {
      type: Date
    },
    email: {
      type: String
    }
  },{_id: false}
);

const campaignStatusSchema = new Schema(
  {
    name: {
      type: String
    },
    assistance_status: {
      type: String,
      enum: Object.values(StatusTypes), 
    },
    activation_date: {
      type: Date
    },
    cancellation_date: {
      type: Date
    },
    medium: {
      type: String,
      enum: Object.values(mediumTypes)
    }
  },{_id: false}
)

const statusSchema = new Schema(
  {
    wp_status: [
      {
        type: wpStatusSchema
      }
    ],
    email_status: [
      {
        type: emailStatusSchema
      }
    ],
    campaign_status: [
      {
        type: campaignStatusSchema
      }
    ],
    contact_status: {
      type: String,
      enum: Object.values(StatusTypes)
    }
  },{_id: false}
);

const clientSchema = new Schema(
  {
    name: {
      type: String,
    },
    identification: {
      type: String,
    },
    base: {
      type: String,
    },
    phone: {
      type: String,
    },
    gender: {
      type: String,
    },
    IGS_status: {
      type: statusSchema,
    },
  },
  {
    timestamps: true,
  }
);

export function Clients(collection) {
  return model(collection, clientSchema, collection);
}

export const IGSStatus = model('IGSStatus', statusSchema);
export const WPStatus = model('WPStatus', wpStatusSchema);
export const CampaignStatus = model('CampaignStatus', campaignStatusSchema)

export const WP_status = StatusTypes;
