import { Document } from 'mongoose'
import { User } from '@/resources/user'

interface File extends Document {
    httpPath: string
    dirPath: string
    name: string
    size: number
    mimetype: string
    uploadedBy: User
    deleted: boolean
}

export default File
