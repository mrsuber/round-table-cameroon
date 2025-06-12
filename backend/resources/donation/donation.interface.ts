import { Document } from 'mongoose'

interface Donation extends Document {
    purpose: string
    description: string
    amount: number
    state: string
    payerNumber: string
    donatedBy: string
    isDeleted: boolean
}

export default Donation
