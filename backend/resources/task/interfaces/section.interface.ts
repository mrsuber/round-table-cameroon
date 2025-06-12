import { Document } from 'mongoose'
import { Task } from '@/resources/task'

interface Section extends Document {
    name: string
    tasks: Task[]
    project: string
    uniqueName: string
}

export default Section
