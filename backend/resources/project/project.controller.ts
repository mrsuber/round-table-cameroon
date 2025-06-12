import { Router, Request, Response, NextFunction } from 'express'
import { UploadedFile } from 'express-fileupload'

import { Controller } from '@/utils/interfaces'
import HttpException from '@/utils/exceptions/http.exception'
import { Project, ProjectService, validate } from '@/resources/project'
import {
    authJwt,
    validationMiddleware,
} from '@/middleware/index'
import { PAGINATION, STATUS_CODES } from '@/utils/helper/constants'

class ProjectController implements Controller {
    public path = '/projects'
    public router = Router()
    private projectService = new ProjectService()

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes = (): void => {
        this.router.post(
            `${this.path}/add-project`,
            [authJwt.isSuperAdmin],
            this.addProject
        )

        this.router.get(
            `${this.path}/all`,
            [authJwt.isMember],
            this.getAllProjects
        )

        this.router.get(`${this.path}`, this.getProjects)

        this.router.get(`${this.path}/:projectId`, [authJwt.isMember], this.getProjectDetails)

        this.router.patch(
            `${this.path}/update-project-image`,
            [authJwt.isMember],
            this.updateProjectImage
        )

        this.router.patch(
            `${this.path}/toggle-project-status`,
            [
                validationMiddleware(validate.toggleProjectStatus),
                authJwt.isSuperAdmin,
            ],
            this.toggleProjectStatus
        )

        this.router.patch(
            `${this.path}/toggle-project-visibility`,
            [
                validationMiddleware(validate.toggleProjectStatus),
                authJwt.isSuperAdmin,
            ],
            this.toggleProjectVisibility
        )

        this.router.patch(
            `${this.path}/add-contributors`,
            [
                validationMiddleware(validate.addContributors),
                authJwt.isMember,
            ],
            this.addContributors
        )

        this.router.patch(
            `${this.path}/remove-contributor`,
            [
                validationMiddleware(validate.removeContributor),
                authJwt.isMember,
            ],
            this.removeContributor
        )

        this.router.patch(
            `${this.path}/edit-project`,
            [
                validationMiddleware(validate.editProject),
                authJwt.isMember,
            ],
            this.editProject
        )

        this.router.patch(
            `${this.path}/add-manager`,
            [
                validationMiddleware(validate.addManager),
                authJwt.isSuperAdmin,
            ],
            this.addManager
        )

        this.router.patch(
            `${this.path}/remove-manager`,
            [
                validationMiddleware(validate.addManager),
                authJwt.isSuperAdmin,
            ],
            this.removeManager
        )

        this.router.patch(
            `${this.path}/add-attachments/:projectId`,
            [authJwt.isMember],
            this.addAttachments
        )

        this.router.patch(
            `${this.path}/remove-attachment`,
            [
                validationMiddleware(validate.removeAttachment),
                authJwt.isMember,
            ],
            this.removeAttachment
        )

        this.router.delete(
            `${this.path}/:projectId`,
            [authJwt.isSuperAdmin],
            this.deleteProjectById
        )
    }

    private addProject = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.projectService.addProject(req)

            res.status(STATUS_CODES.SUCCESS.CREATED_SUCCESSFULLY).json({
                message: 'Project added successfully',
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private editProject = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.projectService.editProject(req)

            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                message: 'Project edited successfully',
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    // Provide ongoing projects, six at a time by default
    private getProjects = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const pageNumber =
                parseInt(req.query.pageNumber as string) ||
                PAGINATION.DEFAULT_PAGE_NUMBER
            const pageLimit =
                parseInt(req.query.limit as string) ||
                PAGINATION.DEFAULT_PAGE_LIMIT
            const result = await this.projectService.getProjects(
                pageNumber,
                pageLimit,
                true
            )

            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({ result })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private getAllProjects = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const pageNumber =
                parseInt(req.query.pageNumber as string) ||
                PAGINATION.DEFAULT_PAGE_NUMBER
            const pageLimit =
                parseInt(req.query.limit as string) ||
                PAGINATION.DEFAULT_PAGE_LIMIT
            const result = await this.projectService.getProjects(
                pageNumber,
                pageLimit,
                false
            )

            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({ result })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private getProjectDetails = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const project = (await this.projectService.getProjectDetails(
                req.params.projectId
            )) as Project
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json(project)
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private updateProjectImage = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            if (req.files) {
                await this.projectService.updateProjectImage(req)
            } else {
                throw new Error('Upload failed, no image found')
            }

            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                message: 'Project image uploaded successfully',
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private toggleProjectStatus = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { projectId } = req.body
            await this.projectService.toggleProjectStatus(projectId)
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                message: 'Project status toggled succesfully',
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private toggleProjectVisibility = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { projectId } = req.body
            await this.projectService.toggleProjectVisibility(projectId)
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                message: 'Project visibility toggled succesfully',
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private addContributors = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.projectService.addContributors(req)
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                message: 'Contributors added succesfully',
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private removeContributor = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.projectService.removeContributor(req)
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                message: 'Contributor removed succesfully',
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private deleteProjectById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.projectService.deleteProjectById(req.params.projectId)
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                success: true,
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private addManager = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.projectService.addManager(req)
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                success: true,
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private removeManager = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.projectService.removeManager(req)
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                success: true,
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private addAttachments = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.projectService.addAttachments(req)
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                success: true,
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private removeAttachment = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.projectService.removeAttachment(req)
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                success: true,
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private assignProjectManagers = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => { }

    private updateProjectInfos = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => { }
}

export default ProjectController
