import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const model = mongoose.model;

const chatsSchema = new Schema(
    {
        phone_id: {
            type: String,
        },
        from: {
            type: String,
        },
        to: {
            type: String,
        },
        message: {
            type: String,
        },
        pdf_name: {
            type: String,
        },
        type: {
            type: String,
        }
    },
    {
        timestamps: true
    }
);

export const Chat = model('ChatsBackups', chatsSchema);