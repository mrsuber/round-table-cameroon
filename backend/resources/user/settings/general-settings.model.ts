import { Schema, model } from 'mongoose'

import { GeneralSettings } from '@/resources/user/settings'

const GeneralSettingsSchema = new Schema(
    {
        region: {
            type: String,
            default: 'South West',
            trim: true,
        },
        language: {
            type: String,
            default: 'English',
            trim: true,
        },
        timezone: {
            type: String,
            default: 'GMT+1',
            trim: true,
        },
        twelveHourFormat: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
)

export default model<GeneralSettings>('GeneralSettings', GeneralSettingsSchema)
