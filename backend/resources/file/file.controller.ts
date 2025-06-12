import { Router, Request, Response, NextFunction } from 'express'

import { Controller } from '@/utils/interfaces'
import HttpException from '@/utils/exceptions/http.exception'
import { File, FileService } from '@/resources/file'
import {
    authJwt,
} from '@/middleware/index'
import { STATUS_CODES } from '@/utils/helper/constants'

class FileController implements Controller {
    public path = '/uploads'
    public router = Router()
    private fileService = new FileService()

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes = (): void => {
        this.router.get(
            `${this.path}`,
            [authJwt.isSuperAdmin],
            this.getFiles
        )
        this.router.get(`${this.path}/admin/:fileId`, [authJwt.isSuperAdmin], this.adminGetFile)
        this.router.get(`${this.path}/:fileId`, this.getFile)
    }

    private getFile = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const file = (await this.fileService.getFile(req, false)) as File
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).sendFile(
                file.dirPath
            )
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private adminGetFile = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const file = (await this.fileService.getFile(req, true)) as File
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).sendFile(
                file.dirPath
            )
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private getFiles = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const data = await this.fileService.getFiles()
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json(data)
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }
}

export default FileController
