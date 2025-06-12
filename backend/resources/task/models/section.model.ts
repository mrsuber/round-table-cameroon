import { Schema, model } from 'mongoose'

import { Section } from '@/resources/task'

const SectionSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        tasks: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Task',
            },
        ],
        project: {
            type: Schema.Types.ObjectId,
            ref: 'Project',
            required: true,
        },
        uniqueName: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
)

export default model<Section>('Section', SectionSchema)
