import { Schema, model } from 'mongoose'

import { Message } from '@/resources/message'

const MessageSchema = new Schema(
    {
        content: {
            type: String,
            required: true,
        },
        from: {
            type: String,
            required: true,
            trim: true,
        },
        to: {
            type: String,
            required: true,
            trim: true,
        },
        deletedByReceiver: {
            type: Boolean,
            default: false,
        },
        files: [
            {
                type: Schema.Types.ObjectId,
                ref: 'File',
            },
        ],
    },
    { timestamps: true }
)

export default model<Message>('Message', MessageSchema)
