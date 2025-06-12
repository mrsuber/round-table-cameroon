import { Router, Request, Response, NextFunction } from 'express'

import { Controller } from '@/utils/interfaces'
import HttpException from '@/utils/exceptions/http.exception'
import { DonationService, validate } from '@/resources/donation'
import { authJwt, validationMiddleware } from '@/middleware/index'
import { STATUS_CODES } from '@/utils/helper/constants'

class DonationController implements Controller {
    public path = '/donations'
    public router = Router()
    private donationService = new DonationService()

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes = (): void => {
        this.router.post(
            `${this.path}`,
            [validationMiddleware(validate.initiateDonation)],
            this.initiateDonation
        )

        this.router.post(`${this.path}/confirm-withdrawal`, this.confirmWithdrawal)
        // this.router.post(`${this.path}/confirm-deposit`, this.confirmTransfer)

        this.router.get(
            `${this.path}`,
            // [authJwt.isSuperAdmin],
            this.getDonations
        )

        this.router.get(
            `${this.path}/transfers`,
            // [authJwt.isSuperAdmin],
            this.getTransfers
        )

        this.router.get(
            `${this.path}/balance`,
            this.getDonationsBalance
        )

        this.router.get(
            `${this.path}/vallet-pay-balance`,
            this.getValletBalance
        )

        this.router.delete(
            `${this.path}/:donationId`,
            [authJwt.isSuperAdmin],
            this.deleteDonation
        )
    }

    private initiateDonation = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const donation = await this.donationService.initiateDonation(req)

            res.status(STATUS_CODES.SUCCESS.CREATED_SUCCESSFULLY).json({
                donation,
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private confirmTransfer = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.donationService.confirmTransfer(req)

            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                success: true,
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private getDonations = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const result = await this.donationService.getDonations(req)
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({ result })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private getDonationsBalance = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const balance = await this.donationService.getDonationsBalance(req)
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({ balance })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private getValletBalance = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const balance = await this.donationService.getValletBalance()
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({ balance })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private getTransfers = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const result = await this.donationService.getTransfers(req)
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({ result })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private confirmWithdrawal = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.donationService.confirmWithdrawal(req)

            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                "success": true
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private deleteDonation = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.donationService.deleteDonation(req)
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                success: true,
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }
}

export default DonationController
