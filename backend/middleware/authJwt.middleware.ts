import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { verifyToken } from '@/utils/token'
import UserModel from '@/resources/user/user.model'
import Token from '@/utils/interfaces/token.interface'
import HttpException from '@/utils/exceptions/http.exception'
import { ROLES } from '@/utils/helper/constants'


const extractRole = async (req: Request) => {
    const bearer = req.headers.authorization

    if (!bearer || !bearer.startsWith('Bearer ')) {
        throw new HttpException(401, 'Unauthorised')
    }

    const accessToken = bearer.split('Bearer ')[1].trim()

    const payload: Token | jwt.JsonWebTokenError = await verifyToken(
        accessToken
    )

    if (payload instanceof jwt.JsonWebTokenError) {
        throw new HttpException(401, 'Unauthorised')
    }

    return payload
}

const addUserInfo = async (
    req: Request,
    id: string
): Promise<void> => {
    const user = await UserModel.findOne({ _id: id, isDeleted: false })
        .select('-password')
        .exec()

    if (!user) {
        throw new HttpException(401, 'Unauthorised')
    }
    req.user = user
}

const isUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    try {
        const token = await extractRole(req)
        const { id, role } = token
        if (
            role === ROLES.USER ||
            role === ROLES.MEMBER ||
            role === ROLES.SUPER_ADMIN
        ) {
            await addUserInfo(req, String(id))
            return next()
        } else {
            return next(new HttpException(403, 'Requires valid access token!'))
        }
    } catch (error: any) {
        next(new HttpException(401, 'Unauthorized!'))
    }
}

const isMember = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    try {
        const token = await extractRole(req)
        const { id, role } = token
        if (
            role === ROLES.MEMBER ||
            role === ROLES.SUPER_ADMIN
        ) {
            await addUserInfo(req, String(id))
            return next()
        } else {
            return next(new HttpException(403, 'Requires Member Role!'))
        }
    } catch (error: any) {
        next(new HttpException(401, 'Unauthorized!'))
    }
}

const isSuperAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    try {
        const token = await extractRole(req)
        const { id, role } = token
        if (role === ROLES.SUPER_ADMIN) {
            await addUserInfo(req, String(id))
            next()
        } else {
            next(new HttpException(403, 'Requires Super Admin Role!'))
        }
    } catch (error: any) {
        next(new HttpException(401, 'Unauthorized!'))
    }

}
const authJwt = {
    isUser,
    isMember,
    isSuperAdmin,
}

export default authJwt
