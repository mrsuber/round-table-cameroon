import { Document } from 'mongoose'

interface NotificationSettings extends Document {
    dailyNewsletter: boolean
    message: boolean
    projectUpdate: boolean
    projectDeadline: boolean
}

export default NotificationSettings
