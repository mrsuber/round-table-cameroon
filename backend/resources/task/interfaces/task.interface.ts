import { User } from '@/resources/user'
import { Document } from 'mongoose'
import { SubTask } from '@/resources/task'
import { File } from '@/resources/file'

interface Task extends Document {
    name: string
    description: string
    priority: string
    assignees: User[]
    subTasks: SubTask[]
    subTaskTotal: number
    subTaskCompleted: number
    section: string
    date: string
    files: File[]
}

export default Task
