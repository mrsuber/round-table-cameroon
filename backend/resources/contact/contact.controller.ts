import { Router, Request, Response, NextFunction } from 'express'

import { Controller } from '@/utils/interfaces'
import HttpException from '@/utils/exceptions/http.exception'
import {
    validationMiddleware,
    authJwt,
} from '@/middleware/index'
import { validate, ContactService } from '@/resources/contact'
import { STATUS_CODES } from '@/utils/helper/constants'

class ContactController implements Controller {
    public path = '/contacts'
    public router = Router()
    private contactService = new ContactService()

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes = (): void => {
        /**
         * FORM
         */

        this.router.post(
            `${this.path}/create-form`,
            [
                validationMiddleware(validate.createForm),
            ],
            this.createForm
        )

        this.router.get(
            `${this.path}/get-forms`,
            [authJwt.isSuperAdmin],
            this.getForms
        )

        /**
         * PARTNER
         */

        this.router.post(
            `${this.path}/add-partner`,
            [
                validationMiddleware(validate.addPartner),
                authJwt.isSuperAdmin,
            ],
            this.addPartner
        )

        this.router.get(`${this.path}/get-partners`, this.getPartners)

        this.router.patch(
            `${this.path}/upload-partner-logo`,
            [authJwt.isSuperAdmin],
            this.uploadPartnerLogo
        )

        /**
         * SUBSCRIBER
         */

        this.router.post(
            `${this.path}/subscribe`,
            validationMiddleware(validate.emailProvided),
            this.subscribe
        )

        this.router.get(
            `${this.path}/get-subscribers`,
            [authJwt.isSuperAdmin],
            this.getSubscribers
        )
    }

    /**
     * FORM
     */

    private createForm = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.contactService.createForm(req)
            res.status(STATUS_CODES.SUCCESS.CREATED_SUCCESSFULLY).json({
                message: 'Form submitted successfully',
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private getForms = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const result = await this.contactService.getForms(req)
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({ result })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private deleteForm = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => { }

    /**
     * PARTNER
     */

    private addPartner = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.contactService.addPartner(req)
            res.status(STATUS_CODES.SUCCESS.CREATED_SUCCESSFULLY).json({
                message: 'Partner added successfully',
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private getPartners = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const result = await this.contactService.getPartners(req)
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({ result })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private uploadPartnerLogo = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.contactService.uploadPartnerLogo(req)
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                message: 'Partner logo uploaded successfully',
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private updatePartnerInfo = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => { }

    private removePartner = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => { }

    /**
     * SUBSCRIBER
     */

    private subscribe = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.contactService.subscribe(req)
            res.status(STATUS_CODES.SUCCESS.CREATED_SUCCESSFULLY).json({
                message: 'Subscription successfully',
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private getSubscribers = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const result = await this.contactService.getSubscribers(req)
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({ result })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private unSubscribe = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => { }

    private confirmUnbscribing = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => { }
}

export default ContactController
