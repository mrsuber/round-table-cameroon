import { Schema, model } from 'mongoose'

import { Form } from '@/resources/contact'

const FormSchema = new Schema(
    {
        fullNames: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
        },
        message: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

export default model<Form>('Form', FormSchema)
