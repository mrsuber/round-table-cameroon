import { Schema, model } from 'mongoose'

import { Project } from '@/resources/project'

const ProjectSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        date: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
        },
        projectImage: {
            type: Schema.Types.ObjectId,
            ref: 'File',
        },
        ongoing: {
            type: Boolean,
            default: false,
        },
        publicProject: {
            type: Boolean,
            default: false,
        },
        labels: [
            {
                type: String,
            },
        ],
        projectManager: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        contributors: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        sections: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Section',
            },
        ],
        attachments: [
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

export default model<Project>('Project', ProjectSchema)
