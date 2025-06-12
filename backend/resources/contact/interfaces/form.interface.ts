import { Document } from 'mongoose'

interface Form extends Document {
    fullNames: string
    email: string
    message: string
}

export default Form
