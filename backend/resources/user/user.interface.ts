import { Document } from 'mongoose'
import { Project } from '@/resources/project'
import { File } from '@/resources/file'
import { GeneralSettings, NotificationSettings } from '@/resources/user/settings'

interface User extends Document {
    email: string
    firstName: string
    lastName: string
    username: string
    profession: string
    town: string
    gender: string
    about: string
    password: string
    role: string
    profileImage: File
    isUser: boolean
    isMember: boolean
    facebook: string
    linkedIn: string
    twitter: string
    managedProjects: Project[]
    projects: Project[]
    createdAt?: string
    updatedAt?: string
    numberOfProjects: number
    generalSettings: GeneralSettings
    notificationSettings: NotificationSettings
    isDeleted: boolean

    isValidPassword(password: string): Promise<Error | boolean>
}

export default User
