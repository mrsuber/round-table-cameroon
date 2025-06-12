import { User } from '@/resources/user'

declare global {
    namespace Express {
        export interface Request {
            user: User
        }
    }
}

export type paginationResult = {
    total: number
    previous?: {
        pageNumber: number
        pageLimit: number
    }
    next?: {
        pageNumber: number
        pageLimit: number
    }
    data: array
    rowsPerPage: number
}

export type mailParams = {
    token?: string
    email?: string
    verification?: boolean
    otpCode?: string
    firstName: string
    lastName: string
    verificationCode?: string
}

export type momoHeader = {
    'X-Target-Environment': string
    'Ocp-Apim-Subscription-Key': string
    Authorization: string
    'Content-Type': string
    'X-Callback-Url': string
    'X-Reference-Id': string
}
