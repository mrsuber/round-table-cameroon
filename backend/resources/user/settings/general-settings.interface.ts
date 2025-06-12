import { Document } from 'mongoose'

interface GeneralSettings extends Document {
    region: string
    language: string
    timezone: string
    twelveHourFormat: boolean
}

export default GeneralSettings
