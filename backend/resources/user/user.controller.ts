import { Router, Request, Response, NextFunction } from 'express'
import { UploadedFile } from 'express-fileupload'

import { Controller } from '@/utils/interfaces'
import HttpException from '@/utils/exceptions/http.exception'
import { UserService } from '@/resources/user'
import { validate } from '@/resources/auth'
import {
    authJwt,
    validationMiddleware,
} from '@/middleware/index'
import { PAGINATION, STATUS_CODES } from '@/utils/helper/constants'

class UserController implements Controller {
    public path = '/users'
    public router = Router()
    private userService = new UserService()

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.get(`${this.path}/profile`, authJwt.isMember, this.getUser)

        this.router.patch(
            `${this.path}/upload-profile-image`,
            [authJwt.isMember],
            this.uploadProfileImage
        )

        this.router.patch(
            `${this.path}/update-general-settings`,
            [validationMiddleware(validate.updateGeneralSettings), authJwt.isMember],
            this.updateGeneralSettings
        )

        this.router.patch(
            `${this.path}/update-notification-settings`,
            [validationMiddleware(validate.updateNotificationSettings), authJwt.isMember],
            this.updateNotificationSettings
        )

        this.router.patch(
            `${this.path}/approve-member`,
            [
                validationMiddleware(validate.emailProvided),
                authJwt.isSuperAdmin,
            ],
            this.approveMember
        )

        this.router.patch(
            `${this.path}/make-admin`,
            [
                validationMiddleware(validate.emailProvided),
                authJwt.isSuperAdmin,
            ],
            this.makeAdmin
        )

        this.router.patch(
            `${this.path}/update-profile`,
            [
                validationMiddleware(validate.updateProfile),
                authJwt.isMember,
            ],
            this.updateProfile
        )

        this.router.delete(
            `${this.path}/delete-account`,
            [
                authJwt.isUser,
            ],
            this.deleteAccount
        )

        this.router.delete(
            `${this.path}/delete-user-account/:userId`,
            [
                authJwt.isSuperAdmin,
            ],
            this.deleteUserAccount
        )

        this.router.get(`${this.path}/get-members`, this.getMembers)

        this.router.get(`${this.path}/get-users`, this.getUsers)

        this.router.get(`${this.path}/deleted-users`, authJwt.isSuperAdmin, this.getDeletedUsers)
        // this.router.patch(`${this.path}/activate-users`, this.activateUsers)
    }

    private getUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).send({
                user: await this.userService.getUser(req),
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private uploadProfileImage = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            if (req.files) {
                const file = req.files.image as UploadedFile
                await this.userService.uploadProfileImage(req)
            } else {
                throw new Error('Upload failed, no image found')
            }

            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                message: 'Profile photo uploaded successfully',
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private updateGeneralSettings = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.userService.updateGeneralSettings(req)
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                message: 'General settings updated successfully',
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private updateNotificationSettings = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.userService.updateNotificationSettings(req)
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                message: 'Notification settings updated successfully',
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private approveMember = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.userService.approveMember(req)
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                message: 'User has been approved succcessfully',
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private makeAdmin = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.userService.makeAdmin(req)
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                message: 'User has been made admin succcessfully',
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    // Provide members, six at a time by default
    private getMembers = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const result = await this.userService.getMembers(
                req,
                { isMember: true, isDeleted: false }
            )

            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({ result })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private getUsers = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const result = await this.userService.getMembers(
                req,
                { isUser: true, isMember: false, isDeleted: false }
            )

            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({ result })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private getDeletedUsers = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const result = await this.userService.getMembers(
                req,
                { isDeleted: true }
            )

            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({ result })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private updateProfile = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.userService.updateProfile(req)
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                success: true,
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private deleteAccount = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.userService.deleteAccount(req)
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                success: true,
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private deleteUserAccount = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.userService.deleteUserAccount(req)
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                success: true,
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    // To be removed
    private activateUsers = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.userService.activateUsers()
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                success: true,
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    // Revoke someone as a member but keep as a user
    private revokeMember = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => { }
}

export default UserController
