import { Router, Request, Response, NextFunction } from 'express'

import { Controller } from '@/utils/interfaces'
import HttpException from '@/utils/exceptions/http.exception'
import { Section, TaskService, validate } from '@/resources/task'
import {
    authJwt,
    validationMiddleware,
} from '@/middleware/index'
import { PAGINATION, STATUS_CODES } from '@/utils/helper/constants'

class TaskController implements Controller {
    public path = '/tasks'
    public router = Router()
    private taskService = new TaskService()

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes = (): void => {
        this.router.post(
            `${this.path}/add-section`,
            [
                validationMiddleware(validate.addSection),
                authJwt.isMember,
            ],
            this.addSection
        )

        this.router.post(
            `${this.path}/add-task`,
            [authJwt.isMember],
            this.addTask
        )

        this.router.get(
            `${this.path}/get-task/:taskId`,
            [authJwt.isMember],
            this.getTaskById
        )

        this.router.delete(
            `${this.path}/delete-sub-task/:subtaskId`,
            [authJwt.isMember],
            this.deleteSubtaskById
        )

        this.router.delete(
            `${this.path}/delete-task/:taskId`,
            [authJwt.isMember],
            this.deleteTaskById
        )

        this.router.delete(
            `${this.path}/delete-section/:sectionId`,
            [authJwt.isMember],
            this.deleteSectionById
        )

        // Project contributors only
        this.router.patch(
            `${this.path}/change-section`,
            [
                validationMiddleware(validate.changeTaskSection),
                authJwt.isMember,
            ],
            this.changeTaskSection
        )

        // Project contributors only
        this.router.patch(
            `${this.path}/edit-sub-task`,
            [
                validationMiddleware(validate.editSubtaskDetails),
                authJwt.isMember,
            ],
            this.editSubtaskDetails
        )

        // Project contributors only
        this.router.patch(
            `${this.path}/sub-task/toggle-completed/:subtaskId`,
            [authJwt.isMember],
            this.toogleSubtaskStatus
        )

        this.router.patch(
            `${this.path}/edit-task/:taskId`,
            [authJwt.isMember],
            this.editTask
        )

        this.router.patch(
            `${this.path}/remove-task-assignee`,
            [
                validationMiddleware(validate.removeTaskAssignee),
                authJwt.isMember,
            ],
            this.removeTaskAssignee
        )

        this.router.patch(
            `${this.path}/remove-sub-task`,
            [
                validationMiddleware(validate.removeSubtask),
                authJwt.isMember,
            ],
            this.removeSubtask
        )

        this.router.patch(
            `${this.path}/delete-attachment`,
            [
                validationMiddleware(validate.deleteAttachment),
                authJwt.isMember,
            ],
            this.deleteAttachment
        )
    }

    private addSection = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const sectionId = await this.taskService.addSection(req)

            res.status(STATUS_CODES.SUCCESS.CREATED_SUCCESSFULLY).json({
                message: 'Section added successfully',
                sectionId,
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private addTask = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const taskId = await this.taskService.addTask(req)

            res.status(STATUS_CODES.SUCCESS.CREATED_SUCCESSFULLY).json({
                message: 'Task added successfully',
                taskId,
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private getTaskById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const task = await this.taskService.getTaskById(req.params.taskId)
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                task,
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private deleteSubtaskById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.taskService.deleteSubtaskById(req)
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                success: true,
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private deleteTaskById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.taskService.deleteTaskById(req)
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                success: true,
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private deleteSectionById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.taskService.deleteSectionById(req)
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                success: true,
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private changeTaskSection = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const project = await this.taskService.changeTaskSection(req)
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json(project)
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private editSubtaskDetails = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.taskService.editSubtaskDescription(req)
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                success: true,
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private toogleSubtaskStatus = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.taskService.toogleSubtaskStatus(req)
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                success: true,
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private editTask = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.taskService.editTask(req)
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                success: true,
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private removeTaskAssignee = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.taskService.removeTaskAssignee(req)
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                success: true,
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private removeSubtask = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.taskService.removeSubtask(req)
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                success: true,
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private deleteAttachment = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.taskService.deleteAttachment(req)
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                success: true,
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }
}

export default TaskController
