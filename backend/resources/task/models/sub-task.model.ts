import { Schema, model } from 'mongoose'

import { SubTask } from '@/resources/task'

const SubTaskSchema = new Schema(
    {
        description: {
            type: String,
            required: true,
            trim: true,
        },
        completed: {
            type: Boolean,
            required: true,
            default: false,
        },
        task: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
)

export default model<SubTask>('SubTask', SubTaskSchema)
