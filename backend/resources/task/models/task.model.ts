import { Schema, model } from 'mongoose'

import { Task } from '@/resources/task'

const TaskSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        priority: {
            type: String,
            required: true,
            trim: true,
        },
        assignees: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        subTasks: [
            {
                type: Schema.Types.ObjectId,
                ref: 'SubTask',
            },
        ],
        subTaskTotal: {
            type: Number,
            default: 1,
        },
        subTaskCompleted: {
            type: Number,
            default: 0,
        },
        section: {
            type: Schema.Types.ObjectId,
            ref: 'Section',
        },
        date: {
            type: String,
            required: true,
            trim: true,
        },
        files: [
            {
                type: Schema.Types.ObjectId,
                ref: 'File',
            },
        ],
    },
    {
        timestamps: true,
    }
)

export default model<Task>('Task', TaskSchema)
