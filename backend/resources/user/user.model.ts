import { Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'

import { User } from '@/resources/user'
import { GeneralSettingsModel, NotificationSettingsModel } from '@/resources/user/settings'

const UserSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        username: {
            type: String,
        },
        profession: {
            type: String,
        },
        town: {
            type: String,
        },
        gender: {
            type: String,
        },
        about: {
            type: String,
            required: false,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
        },
        profileImage: {
            type: Schema.Types.ObjectId,
            ref: 'File',
        },
        isUser: {
            type: Boolean,
            default: false,
        },
        isMember: {
            type: Boolean,
            default: false,
        },
        facebook: {
            type: String,
            required: false,
        },
        linkedIn: {
            type: String,
            required: false,
        },
        twitter: {
            type: String,
            required: false,
        },
        managedProjects: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Project',
            },
        ],
        projects: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Project',
            },
        ],
        numberOfProjects: {
            type: Number,
            required: false,
        },
        generalSettings: {
            type: Schema.Types.ObjectId,
            ref: 'GeneralSettings',
        },
        notificationSettings: {
            type: Schema.Types.ObjectId,
            ref: 'NotificationSettings',
        },
        isDeleted: {
            type: Boolean,
            default: false,
        }
    },
    { timestamps: true }
)

UserSchema.pre<User>('save', async function (next) {
    if (!this.isModified('password')) {
        return next()
    }

    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash
    this.generalSettings = await new GeneralSettingsModel().save()
    this.notificationSettings = await new NotificationSettingsModel().save()

    next()
})

UserSchema.methods.isValidPassword = async function (
    password: string
): Promise<Error | boolean> {
    return await bcrypt.compare(password, this.password)
}

export default model<User>('User', UserSchema)
