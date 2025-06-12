import otpGenerator from 'otp-generator'

import { User } from '@/resources/user'
import { OtpModel, PasswordCodeModel } from '@/utils/models'
import { VerificationToken } from '@/utils/interfaces'
import { OTP_LENGTH, OTP_CONFIG, AUTH_SETTINGS, JWT_INFO } from '@/utils/helper/constants'
import { createResetPasswordToken } from '@/utils/token'

export const createOTP = async (user: User): Promise<string | Error> => {
    try {
        const value = otpGenerator.generate(OTP_LENGTH, OTP_CONFIG)
        let expiredAt = new Date()
        expiredAt.setSeconds(
            expiredAt.getSeconds() +
                parseInt(AUTH_SETTINGS.OTP_EXPIRY as string)
        )

        await new OtpModel({
            value: value,
            userId: user._id,
            expiryDate: expiredAt.getTime(),
        }).save()

        return value
    } catch (error: any) {
        return new Error('Could not generate otp')
    }
}

export const createPasswordCode = async (
    user: User
): Promise<string | Error> => {
    try {
        const value = createResetPasswordToken(user.email)
        let expiredAt = new Date()
        expiredAt.setSeconds(
            expiredAt.getSeconds() +
                parseInt(JWT_INFO.ACCESS_TOKEN_DUR as string)
        )

        await new PasswordCodeModel({
            value: value,
            userId: user._id,
            expiryDate: expiredAt.getTime(),
        }).save()

        return value
    } catch (error: any) {
        return new Error('Could not generate otp')
    }
}

export const tokenHasExpired = (token: VerificationToken) => {
    return token.expiryDate.getTime() < new Date().getTime()
}

const authHelper = {
    createOTP,
    createPasswordCode,
    tokenHasExpired,
}

export default authHelper
