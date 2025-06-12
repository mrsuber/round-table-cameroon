import { Document } from 'mongoose'

interface Partner extends Document {
    name: string
    moreInfo: string
    logo: File
}

export default Partner
