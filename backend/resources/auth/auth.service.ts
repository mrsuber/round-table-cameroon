import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Request } from 'express'

import { Token } from '@/utils/interfaces'
import { User, UserModel } from '@/resources/user'
import { OtpModel, PasswordCodeModel } from '@/utils/models'
import token from '@/utils/token'
import authHelper from '@/utils/helper/authHelper'
import { STATUS_CODES, ROLES } from '@/utils/helper/constants'
import { mailParams } from '@/utils/definitions/custom'
import HttpException from '@/utils/exceptions/http.exception'
import { verifyResetToken } from '@/utils/token'

class AuthService {
    /**
     * Register a new user
     */
    public async register(
        req: Request
    ): Promise<User> {
        try {
            const { firstName, lastName, email, password } = req.body
            let user = await UserModel.findOne({
                email, isDeleted: false
            }).exec()

            if (user) {
                throw new HttpException(
                    STATUS_CODES.ERROR.CONFLICT,
                    'Failed! Email is already in use!'
                )
            } else {
                user = await UserModel.create({
                    firstName,
                    lastName,
                    email,
                    password,
                    role: ROLES.USER,
                })
                user.password = undefined as unknown as string
                user.isDeleted = undefined as unknown as boolean
                return user
            }
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * Attempt to login a user
     */
    public async login(
        req: Request
    ): Promise<object | Error> {
        try {
            const { email, password } = req.body
            const user = await UserModel.findOne({ email, isDeleted: false })
                .select('-isDeleted')
                .populate('generalSettings')
                .populate('notificationSettings')
                .exec()
            if (!user) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    'Unable to find a user with that email address'
                )
            }

            if (!user.isUser) {
                throw new HttpException(
                    STATUS_CODES.ERROR.BAD_REQUEST,
                    'Email not verified'
                )
            }

            if (await user.isValidPassword(password)) {
                user.password = undefined as unknown as string
                return {
                    accessToken: token.createAccessToken(user),
                    refreshToken: token.createRefreshToken(user),
                    user: user,
                }
            } else {
                throw new HttpException(
                    STATUS_CODES.ERROR.UNAUTHORIZED,
                    'Wrong credentials given'
                )
            }
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * Verify user's account
     */
    public async verifyAccount(
        req: Request
    ): Promise<void | Error> {
        try {
            const { email, otp } = req.body
            const user = await UserModel.findOne({
                email, isDeleted: false
            })

            if (!user) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    'Sorry no account found with this email address'
                )
            }

            if (user.isUser) {
                throw new HttpException(
                    STATUS_CODES.ERROR.BAD_REQUEST,
                    'Your account has already been verified.'
                )
            }

            const savedOtp = await OtpModel.findOne({
                userId: user._id,
            })

            if (!savedOtp) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    'Verification code not found! Please request for a new one'
                )
            }

            if (authHelper.tokenHasExpired(savedOtp)) {
                OtpModel.findByIdAndRemove(savedOtp._id, {
                    useFindAndModify: false,
                }).exec()
                throw new HttpException(
                    STATUS_CODES.ERROR.BAD_REQUEST,
                    'Verification code had expired. Please request for a new one'
                )
            }

            if (!bcrypt.compareSync(otp, savedOtp.value)) {
                throw new HttpException(
                    STATUS_CODES.ERROR.BAD_REQUEST,
                    'Invalid OTP Code.'
                )
            }

            await UserModel.findByIdAndUpdate(user._id, {
                isUser: true,
            })

            await OtpModel.findByIdAndRemove(savedOtp._id, {
                useFindAndModify: false,
            })
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * Refresh user's access token
     */
    public async refreshToken(req: Request): Promise<object | Error> {
        try {
            const { refreshToken } = req.body
            const payload: Token | jwt.JsonWebTokenError =
                await token.verifyToken(refreshToken)

            if (payload instanceof jwt.JsonWebTokenError) {
                throw new HttpException(
                    STATUS_CODES.ERROR.UNAUTHORIZED,
                    'Unauthorised'
                )
            }

            const user = await UserModel.findOne({ _id: payload.id, isDeleted: false }).exec()
            if (!user) {
                throw new HttpException(
                    STATUS_CODES.ERROR.UNAUTHORIZED,
                    'Unauthorised'
                )
            }

            return {
                accessToken: token.createAccessToken(user),
                refreshToken,
            }
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * Create password token for user
     */
    public async createPasswordToken(
        req: Request
    ): Promise<mailParams | Error> {
        try {
            const { email } = req.body
            const user = await UserModel.findOne({
                email, isDeleted: false
            })

            if (!user) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    `User with email ${email} not found.`
                )
            }

            const existingToken = await PasswordCodeModel.findOne({
                userId: user._id,
            })

            if (existingToken) {
                PasswordCodeModel.findByIdAndRemove(existingToken._id, {
                    useFindAndModify: false,
                }).exec()
            }

            let data = {
                firstName: user.firstName,
                lastName: user.lastName,
                token: await authHelper.createPasswordCode(user),
            }

            return data as mailParams
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * Reset user password
     */
    public async resetPassword(
        req: Request
    ): Promise<void | Error> {
        try {
            const { password, token } = req.body
            const payload: Token = await verifyResetToken(token) as Token
            if (payload instanceof jwt.JsonWebTokenError) {
                throw new HttpException(
                    STATUS_CODES.ERROR.UNAUTHORIZED,
                    'Invalid token.'
                )
            }
            const user = await UserModel.findOne({
                email: payload.email, isDeleted: false
            })

            if (!user) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    'Sorry no account found with this email address.'
                )
            }

            const passwordToken = await PasswordCodeModel.findOne({
                userId: user._id,
            })

            if (!passwordToken) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    'Reset token not found! Please request for a new one'
                )
            }

            if (authHelper.tokenHasExpired(passwordToken)) {
                PasswordCodeModel.findByIdAndRemove(passwordToken._id, {
                    useFindAndModify: false,
                }).exec()

                throw new HttpException(
                    STATUS_CODES.ERROR.BAD_REQUEST,
                    'Password token has expired. Please request for a new one'
                )
            }

            if (!bcrypt.compareSync(token, passwordToken.value)) {
                throw new HttpException(
                    STATUS_CODES.ERROR.BAD_REQUEST,
                    'Invalid password token.'
                )
            }

            if (await user.isValidPassword(password)) {
                await PasswordCodeModel.findByIdAndRemove(passwordToken._id, {
                    useFindAndModify: false,
                })
                throw new HttpException(
                    STATUS_CODES.ERROR.BAD_REQUEST,
                    'The new password should not be same as the old one.'
                )
            } else {
                await UserModel.findByIdAndUpdate(user._id, {
                    $set: { password: bcrypt.hashSync(password, 10) },
                }).then(
                    await PasswordCodeModel.findByIdAndRemove(passwordToken._id, {
                        useFindAndModify: false,
                    })
                )
            }
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * resend verification code
     */
    public async resendVerificationCode(
        req: Request
    ): Promise<mailParams | Error> {
        try {
            const { email } = req.body
            const user = await UserModel.findOne({
                email, isDeleted: false
            })

            if (!user) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    `User with email ${email} not found.`
                )
            }

            if (user.isUser) {
                throw new HttpException(
                    STATUS_CODES.ERROR.BAD_REQUEST,
                    'Your account has already been verified.'
                )
            }

            const savedOtp = await OtpModel.findOne({
                userId: user._id,
            })

            if (savedOtp) {
                OtpModel.findByIdAndRemove(savedOtp._id, {
                    useFindAndModify: false,
                }).exec()
            }

            let data = {
                firstName: user.firstName,
                lastName: user.lastName,
                token: await authHelper.createOTP(user),
            }

            return data as mailParams
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * Change password
     */
    public async changePassword(
        req: Request
    ): Promise<void | Error> {
        try {
            const { oldPassword, newPassword } = req.body
            const user = (await UserModel.findOne({ email: req.user.email, isDeleted: false })) as User
            if (!user) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    'Unable to find user with that email address'
                )
            }
            if (await user.isValidPassword(oldPassword)) {
                if (oldPassword === newPassword) {
                    throw new HttpException(
                        STATUS_CODES.ERROR.BAD_REQUEST,
                        'The new password should not be same as the old one.'
                    )
                }
                await UserModel.findByIdAndUpdate(user._id, {
                    password: await bcrypt.hash(newPassword, 10)
                })
            } else {
                throw new HttpException(
                    STATUS_CODES.ERROR.BAD_REQUEST,
                    'Incorrect old password.'
                )
            }
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }
}

export default AuthService
