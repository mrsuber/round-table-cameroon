import { Schema, model } from 'mongoose'

import { Partner } from '@/resources/contact'

const PartnerSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        moreInfo: {
            type: String,
            trim: true,
        },
        logo: {
            type: Schema.Types.ObjectId,
            ref: 'File',
        },
    },
    {
        timestamps: true,
    }
)

export default model<Partner>('Partner', PartnerSchema)
