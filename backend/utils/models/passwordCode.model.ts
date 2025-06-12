import { Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'

import { VerificationToken } from '@/utils/interfaces'

const PasswordCodeSchema = new Schema({
    value: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    expiryDate: Date,
})

PasswordCodeSchema.pre<VerificationToken>('save', async function (next) {
    const hash = await bcrypt.hash(this.value, 10)
    this.value = hash

    next()
})

export default model<VerificationToken>('PasswordCode', PasswordCodeSchema)
