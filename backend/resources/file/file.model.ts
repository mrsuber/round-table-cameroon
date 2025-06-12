import { Schema, model } from 'mongoose'

import { File } from '@/resources/file'

const FileSchema = new Schema(
    {
        httpPath: {
            type: String,
            required: true,
            trim: true,
        },
        dirPath: {
            type: String,
            required: true,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        size: {
            type: Number,
            required: true,
        },
        mimetype: {
            type: String,
            required: true,
            trim: true,
        },
        uploadedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        deleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
)

export default model<File>('File', FileSchema)
