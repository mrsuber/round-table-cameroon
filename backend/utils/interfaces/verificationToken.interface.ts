import { Schema, Document } from 'mongoose'

interface verificationToken extends Document {
    userId: Schema.Types.ObjectId
    value: string
    expiryDate: Date
}

export default verificationToken
