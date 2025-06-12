import { Schema, model } from 'mongoose'
import { v4 as uuid } from 'uuid'

import { Donation } from '@/resources/donation'
import { DONATION_STATE } from '@/utils/helper/constants'

const DonationSchema = new Schema(
    {
        _id: {
            type: String,
            default: uuid,
        },
        purpose: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        state: {
            type: String,
            default: DONATION_STATE.INITIATED,
        },
        payerNumber: {
            type: String,
            required: true,
            trim: true,
        },
        donatedBy: {
            type: String,
            required: true,
            trim: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
)

export default model<Donation>('Donation', DonationSchema)
