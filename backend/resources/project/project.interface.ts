import { Document } from 'mongoose'
import { User } from '@/resources/user'
import { Section } from '@/resources/task'
import { File } from '@/resources/file'

interface Project extends Document {
    title: string
    date: string
    description: string
    projectImage: File
    ongoing: boolean
    publicProject: boolean
    labels: string[]
    projectManager: User[]
    contributors: User[]
    sections: Section[]
    attachments: File[]
}

export default Project
