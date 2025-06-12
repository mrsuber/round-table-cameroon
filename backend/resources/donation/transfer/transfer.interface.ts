import { Document } from 'mongoose'

interface Transfer extends Document {
    purpose: string
    amount: number
    state: string
    payeeNumber: string
    donatedBy: string
    isDeleted: boolean
}

export default Transfer
