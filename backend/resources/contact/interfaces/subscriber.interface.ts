import { Document } from 'mongoose'

interface Subscriber extends Document {
    email: string
}

export default Subscriber
