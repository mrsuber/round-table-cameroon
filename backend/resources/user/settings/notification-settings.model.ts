import { Schema, model } from 'mongoose'

import { NotificationSettings } from '@/resources/user/settings'

const NotificationSettingsSchema = new Schema(
    {
        dailyNewsletter: {
            type: Boolean,
            default: true,
        },
        message: {
            type: Boolean,
            default: true,
        },
        projectUpdate: {
            type: Boolean,
            default: true,
        },
        projectDeadline: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
)

export default model<NotificationSettings>('NotificationSettings', NotificationSettingsSchema)
