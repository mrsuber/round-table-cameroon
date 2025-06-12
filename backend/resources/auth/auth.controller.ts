import { Router, Request, Response, NextFunction } from 'express'

import { createOTP } from '@/utils/helper/authHelper'
import { Controller } from '@/utils/interfaces'
import HttpException from '@/utils/exceptions/http.exception'
import { validate, AuthService } from '@/resources/auth'
import { sendMail } from '@/utils/helper/mailingService'
import { validationMiddleware, authJwt } from '@/middleware/index'
import { STATUS_CODES } from '@/utils/helper/constants'
import { mailParams } from '@/utils/definitions/custom'

class UserController implements Controller {
    public path = '/users'
    public router = Router()
    private authService = new AuthService()

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.post(
            `${this.path}/register`,
            validationMiddleware(validate.register),
            this.register
        )
        this.router.post(
            `${this.path}/login`,
            validationMiddleware(validate.login),
            this.login
        )
        this.router.patch(
            `${this.path}/verify-account`,
            validationMiddleware(validate.verifyAccount),
            this.verifyAccount
        )
        this.router.post(
            `${this.path}/refresh-token`,
            validationMiddleware(validate.refreshToken),
            this.refreshToken
        )
        this.router.post(
            `${this.path}/forgot-password`,
            validationMiddleware(validate.emailProvided),
            this.forgotPassword
        )
        this.router.patch(
            `${this.path}/reset-password`,
            validationMiddleware(validate.resetPassword),
            this.resetPassword
        )
        this.router.post(
            `${this.path}/resend-verification-code`,
            validationMiddleware(validate.emailProvided),
            this.resendVerificationCode
        )
        this.router.patch(
            `${this.path}/change-password`,
            [validationMiddleware(validate.changePassword), authJwt.isUser],
            this.changePassword
        )
    }

    private register = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { firstName, lastName, email } = req.body
            const user = await this.authService.register(req)
            const otpCode = (await createOTP(user)) as string

            await sendMail({
                email: email,
                otpCode: otpCode,
                firstName: firstName,
                lastName: lastName,
                verification: true,
            })

            res.status(STATUS_CODES.SUCCESS.CREATED_SUCCESSFULLY).json({ user })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private login = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const tokens = await this.authService.login(req)

            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({ tokens })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private verifyAccount = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.authService.verifyAccount(req)

            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                message: 'User successfully verified.',
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private refreshToken = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const tokens = await this.authService.refreshToken(req)

            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({ tokens })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private forgotPassword = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { email } = req.body
            const data: mailParams =
                (await this.authService.createPasswordToken(
                    req
                )) as mailParams
            await sendMail({
                email: email,
                otpCode: data.token,
                firstName: data.firstName,
                lastName: data.lastName,
                verification: false,
            })

            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                message: 'Reset link sent.',
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private resetPassword = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.authService.resetPassword(req)

            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                message: 'Password changed successfully.',
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private resendVerificationCode = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { email } = req.body
            const data: mailParams =
                (await this.authService.resendVerificationCode(req)) as mailParams

            await sendMail({
                email: email,
                otpCode: data.token,
                firstName: data.firstName,
                lastName: data.lastName,
                verification: true,
            })

            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                message: 'Verification code resent.',
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private changePassword = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {

            await this.authService.changePassword(req)

            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                message: 'Password changed successfully.',
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }
}

export default UserController
