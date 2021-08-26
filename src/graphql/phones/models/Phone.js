import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const model = mongoose.model;

const statusTypes = Object.freeze({
  ACTIVE: 'ACTIVE',
  BANNED: 'BANNED',
});

const phoneSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    lines: [
      {
        campaign: String,
        number: String,
        status: {
          type: String,
          enum: Object.values(statusTypes),
          default: statusTypes.ACTIVE,
        },
      },
    ],
  },
  {
    collection: 'Phones',
    timestamps: true,
  }
);

export const Phone = model('Phones', phoneSchema);
export const LineStatus = statusTypes;
