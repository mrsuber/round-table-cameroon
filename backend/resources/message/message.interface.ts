import { Document } from 'mongoose'
import { File } from '@/resources/file'

interface Message extends Document {
    content: string
    from: string
    to: string
    deletedByReceiver?: boolean
    files: File[]
}

export default Message
