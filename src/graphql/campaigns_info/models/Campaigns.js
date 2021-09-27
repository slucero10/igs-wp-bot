import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const model = mongoose.model;

const campaignInfoSchema = new Schema(
    {
        name: {
            type: String,
        },
        products: [
            {
                product_name: String,
                url_accept_assistance: String,
                html_path: String,
                height: String,
                width: String,
                message: Array,
                info_messages: Array,
                cost_message: String,
                accept_message: String
            }
        ]
    },
    {
        collection: 'CampaignsInfo',
    }
);

export const Campaign = model('CampaignsInfo', campaignInfoSchema);