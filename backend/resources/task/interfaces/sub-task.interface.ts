import { Document } from 'mongoose'

interface SubTask extends Document {
    description: string
    completed: boolean
    task: string
}

export default SubTask
