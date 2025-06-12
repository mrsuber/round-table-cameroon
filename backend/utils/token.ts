import jwt from 'jsonwebtoken'

import { User } from '@/resources/user'
import { Token } from '@/utils/interfaces'
import { JWT_INFO } from '@/utils/helper/constants'

export const createAccessToken = (user: User): string => {
    return jwt.sign(
        { id: user._id, role: user.role },
        JWT_INFO.SECRET as jwt.Secret,
        {
            expiresIn: JWT_INFO.ACCESS_TOKEN_DUR + 's'
        }
    )
}

export const createRefreshToken = (user: User): string => {
    return jwt.sign(
        { id: user._id},
        JWT_INFO.SECRET as jwt.Secret,
        {
            expiresIn: JWT_INFO.REFRESH_TOKEN_DUR + 's'
        }
    )
}

export const createResetPasswordToken = (email: string): string => {
    return jwt.sign(
        { email},
        JWT_INFO.RESET_TOKEN_SECRET as jwt.Secret,
        {
            expiresIn: JWT_INFO.ACCESS_TOKEN_DUR + 's'
        }
    )
}

export const verifyToken = async (
    token: string
): Promise<jwt.VerifyErrors | Token> => {
    return new Promise((resolve, reject) => {
        jwt.verify(
            token,
            JWT_INFO.SECRET as jwt.Secret,
            (err, payload) => {
                if (err) return reject(err)

                resolve(payload as Token)
            }
        )
    })
}

export const verifyResetToken = async (
    token: string
): Promise<jwt.VerifyErrors | Token> => {
    return new Promise((resolve, reject) => {
        jwt.verify(
            token,
            JWT_INFO.RESET_TOKEN_SECRET as jwt.Secret,
            (err, payload) => {
                if (err) return reject(err)

                resolve(payload as Token)
            }
        )
    })
}

export default { createAccessToken, createRefreshToken, createResetPasswordToken, verifyToken, verifyResetToken }
