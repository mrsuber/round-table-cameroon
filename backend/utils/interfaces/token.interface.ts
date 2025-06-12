import { Schema } from 'mongoose'

interface Token extends Object {
    id?: Schema.Types.ObjectId
    email?: string
    role?: string
    expiresIn: number
}

export default Token
