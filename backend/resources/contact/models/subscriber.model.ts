import { Schema, model } from 'mongoose'

import { Subscriber } from '@/resources/contact'

const SubscriberSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
)

export default model<Subscriber>('Subscriber', SubscriberSchema)
