import { Request } from 'express'
import { UploadedFile } from 'express-fileupload'

import { Project, ProjectModel } from '@/resources/project'
import { FileModel } from '@/resources/file'
import { User, UserModel } from '@/resources/user'
import { SectionModel, TaskModel, SubTaskModel, Task } from '@/resources/task'
import { paginationResult } from '@/utils/definitions/custom'
import {
    FILE_STRUCTURE,
    STATUS_CODES,
    API_HOST,
    ROLES,
    UPLOADS_SHORT_URL
} from '@/utils/helper/constants'
import {
    saveFile,
    addElementToArray,
    deleteElementInArray,
    isProjectManager
} from '@/utils/helper/utils'
import HttpException from '@/utils/exceptions/http.exception'

class ProjectService {
    /**
     * Add a new project
     */
    public async addProject(req: Request): Promise<void | Error> {
        try {
            const { body, files } = req
            const projectInfo = JSON.parse(body.projectInfo)
            const { publicProject, title, date, ongoing } = projectInfo
            const projectManagers = body.projectManager
            let projectMembers = body.projectMembers
            const labels = body.labels
            const description = body.description
            const tasks = body.tasks
            const projectImage = files?.projectImage as UploadedFile
            const attachments = files?.attachments as UploadedFile[]
            let managers: User[] = [];
            const userId = req.user._id
            if (!Array.isArray(projectMembers)) {
                projectMembers = [projectMembers]
            }
            if (Array.isArray(projectManagers)) {
                for (let i = 0; i < projectManagers.length; i++) {
                    let manager = await UserModel.findById(projectManagers[i]).exec() as User
                    managers.push(manager)
                }
            } else {
                let manager = await UserModel.findById(projectManagers).exec() as User
                managers.push(manager)
            }

            for (let i = 0; i < managers.length; i++) {
                if (!managers[i]) {
                    throw new HttpException(
                        STATUS_CODES.ERROR.NOT_FOUND,
                        'Project manager not found'
                    )
                }
                if (!managers[i].isMember) {
                    throw new HttpException(
                        STATUS_CODES.ERROR.BAD_REQUEST,
                        'Project managers must be members'
                    )
                }

                // Remove project manager from array of contributors
                deleteElementInArray(projectManagers[i], projectMembers)
            }

            const validContributors = await this.validProjectContributors(
                projectMembers
            )

            if (!validContributors) {
                throw new HttpException(
                    STATUS_CODES.ERROR.BAD_REQUEST,
                    'All contributors must be menbers'
                )
            }

            // Add project image
            const filePath = saveFile(
                FILE_STRUCTURE.PROJECT_IMAGE_DIR,
                projectImage as UploadedFile
            )

            const arr = projectImage.name.split('.')
            const ext = arr[arr.length - 1]
            let newFile = await new FileModel({
                httpPath: ext,
                dirPath: filePath,
                name: projectImage.name,
                size: projectImage.size,
                mimetype: projectImage.mimetype,
                uploadedBy: userId
            }).save()

            // Save project
            const project = await new ProjectModel({
                title,
                publicProject,
                date,
                projectManager: projectManagers,
                contributors: projectMembers,
                description,
                ongoing,
                labels,
                sections: [],
                projectImage: newFile._id,
            }).save()

            for (let i = 0; i < managers.length; i++) {
                await UserModel.findByIdAndUpdate(managers[i]._id, {
                    managedProjects: [...managers[i].managedProjects, project._id],
                })
            }

            for (let i = 0; i < projectMembers.length; i++) {
                let projectMember = await UserModel.findById(projectMembers[i]).exec()
                if (projectMember) {
                    await UserModel.findByIdAndUpdate(projectMembers[i], {
                        projects: [...projectMember.projects, project._id],
                    })
                }
            }

            const uniqueName = String(project._id) + '____' + 'Backlog'

            const backlogSection = await new SectionModel({
                name: 'Backlog',
                tasks: [],
                project: project._id,
                uniqueName,
            }).save()

            await ProjectModel.findByIdAndUpdate(project._id, {
                sections: [backlogSection._id],
            })

            // Create tasks
            const taskIds = []
            if (tasks) {
                if (Array.isArray(tasks)) {
                    for (let i = 0; i < tasks.length; i++) {
                        let taskData = JSON.parse(tasks[i])
                        let validTaskContributors =
                            await this.validTaskContributors(
                                projectMembers,
                                projectManagers,
                                taskData.assignees
                            )
                        if (!validTaskContributors) {
                            throw new HttpException(
                                STATUS_CODES.ERROR.NOT_FOUND,
                                'Tasks can only be assigned to project contributors'
                            )
                        }
                        let id = await this.createTask(
                            tasks[i],
                            backlogSection._id
                        )
                        taskIds.push(id)
                    }
                } else {
                    let taskData = JSON.parse(tasks)
                    let validTaskContributors =
                        await this.validTaskContributors(
                            projectMembers,
                            projectManagers,
                            taskData.assignees
                        )
                    if (!validTaskContributors) {
                        throw new HttpException(
                            STATUS_CODES.ERROR.NOT_FOUND,
                            'Tasks can only be assigned to project contributors'
                        )
                    }
                    let id = await this.createTask(
                        tasks,
                        backlogSection._id
                    )
                    taskIds.push(id)
                }
            }

            await SectionModel.findByIdAndUpdate(backlogSection._id, {
                tasks: taskIds,
            })

            // Add attachments
            let fileIds = []
            if (attachments) {
                if (Array.isArray(attachments)) {
                    for (let i = 0; i < attachments.length; i++) {
                        let id = await this.saveAttachment(attachments[i], userId)
                        fileIds.push(id)
                    }
                } else {
                    let id = await this.saveAttachment(attachments, userId)
                    fileIds.push(id)
                }
            }

            await ProjectModel.findByIdAndUpdate(project._id, {
                attachments: fileIds,
            })
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    public async editProject(req: Request): Promise<void | Error> {
        try {
            const {
                publicProject,
                title,
                date,
                ongoing,
                description,
                labels,
                projectId,
            } = req.body

            // Perform project manager authorisation
            if (!isProjectManager(projectId, req.user.managedProjects) && req.user.role !== ROLES.SUPER_ADMIN) {
                throw new HttpException(
                    STATUS_CODES.ERROR.FORBIDDEN,
                    'Only the project manager is authorized to perform this operation'
                )
            }

            const project = await ProjectModel.findById(projectId).exec()
            if (!project) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    'Project not found'
                )
            }

            await ProjectModel.findByIdAndUpdate(project._id, {
                publicProject,
                title,
                date,
                ongoing,
                description,
                labels,
            })
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * Get saved projects
     */
    public async getProjects(
        pageNumber: number,
        pageLimit: number,
        publicProjectOnly: boolean
    ): Promise<paginationResult | Error> {
        const searchParams = publicProjectOnly ? { publicProject: true } : {}
        try {
            const startIndex = pageNumber * pageLimit
            const endIndex = (pageNumber + 1) * pageLimit

            const result: paginationResult = {
                total: 0,
                data: [],
                rowsPerPage: 0,
            }
            result.total = await ProjectModel.find({ ...searchParams })
                .countDocuments()
                .exec()

            // Check if previous page exists and give page number
            if (startIndex > 0) {
                result.previous = {
                    pageNumber: pageNumber - 1,
                    pageLimit,
                }
            }

            // Check if next page exists and give page number
            if (endIndex < result.total) {
                result.next = {
                    pageNumber: pageNumber + 1,
                    pageLimit,
                }
            }

            result.data = await ProjectModel.find({ ...searchParams }, '')
                .populate({
                    path: 'sections',
                    select: {
                        name: 1
                    },
                    populate: {
                        path: 'tasks',
                        select: {
                            name: 1,
                            description: 1,
                            subTaskTotal: 1,
                            subTaskCompleted: 1
                        }
                    },
                })
                .populate({
                    path: 'projectManager',
                    select: {
                        email: 1,
                        firstName: 1,
                        lastName: 1,
                        profileImage: 1,
                    },
                    populate: {
                        path: 'profileImage',
                    },
                })
                .populate({
                    path: 'contributors',
                    select: {
                        email: 1,
                        firstName: 1,
                        lastName: 1,
                        profileImage: 1,
                    },
                    populate: {
                        path: 'profileImage',
                    },
                })
                .populate('attachments')
                .populate('projectImage')
                .sort('title')
                .skip(startIndex)
                .limit(pageLimit)
                .exec()

            result.rowsPerPage = pageLimit

            for (let i = 0; i < result.data.length; i++) {
                let project = result.data[i]
                project.percentage = await this.getProjectPercentage(project.sections)
                for (let j = 0; j < project.projectManager.length; j++) {
                    let manager = project.projectManager[j]
                    if (manager.profileImage) {
                        manager.profileImage.dirPath = undefined as unknown as string
                        manager.profileImage.deleted = undefined
                        manager.profileImage.httpPath = API_HOST + UPLOADS_SHORT_URL + String(manager.profileImage._id) + '.' + manager.profileImage.httpPath
                    }
                }
                for (let j = 0; j < project.contributors.length; j++) {
                    let contributor = project.contributors[j]
                    if (contributor.profileImage) {
                        contributor.profileImage.dirPath = undefined as unknown as string
                        contributor.profileImage.deleted = undefined
                        contributor.profileImage.httpPath = API_HOST + UPLOADS_SHORT_URL + String(contributor.profileImage._id) + '.' + contributor.profileImage.httpPath
                    }
                }
                for (let j = 0; j < project.attachments.length; j++) {
                    let attachment = project.attachments[j]
                    attachment.dirPath = undefined as unknown as string
                    attachment.deleted = undefined
                    attachment.httpPath = API_HOST + UPLOADS_SHORT_URL + String(attachment._id) + '.' + attachment.httpPath
                }
                if (project.projectImage) {
                    project.projectImage.dirPath = undefined as unknown as string
                    project.projectImage.deleted = undefined
                    project.projectImage.httpPath = API_HOST + UPLOADS_SHORT_URL + String(project.projectImage._id) + '.' + project.projectImage.httpPath
                }
            }
            return result
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * Get project details
     */
    public async getProjectDetails(
        projectId: string
    ): Promise<Project | Error> {
        try {
            const project = await ProjectModel.findById(projectId)
                .populate({
                    path: 'projectManager',
                    select: {
                        email: 1,
                        firstName: 1,
                        lastName: 1,
                        about: 1,
                        profileImage: 1
                    },
                    populate: {
                        path: 'profileImage'
                    }
                })
                .populate({
                    path: 'sections',
                    populate: {
                        path: 'tasks',
                        populate: {
                            path: 'subTasks',
                        },
                    },
                })
                .populate({
                    path: 'sections',
                    populate: {
                        path: 'tasks',
                        populate: {
                            path: 'assignees',
                            select: {
                                email: 1,
                                firstName: 1,
                                lastName: 1,
                                about: 1,
                                profileImage: 1,
                            },
                            populate: {
                                path: 'profileImage'
                            }
                        },
                    },
                })
                .populate({
                    path: 'sections',
                    populate: {
                        path: 'tasks',
                        populate: {
                            path: 'section',
                            select: {
                                name: 1,
                            },
                        },
                    },
                })
                .populate({
                    path: 'sections',
                    populate: {
                        path: 'tasks',
                        populate: {
                            path: 'files',
                        },
                    },
                })
                .populate({
                    path: 'contributors',
                    select: {
                        email: 1,
                        firstName: 1,
                        lastName: 1,
                        profileImage: 1,
                    },
                    populate: {
                        path: 'profileImage'
                    }
                })
                .populate('projectImage')
                .populate('attachments')
                .exec()
            if (!project) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    'Project not found'
                )
            }
            if (project.projectImage) {
                project.projectImage.dirPath = undefined as unknown as string
                project.projectImage.deleted = undefined as unknown as boolean
                project.projectImage.httpPath = API_HOST + UPLOADS_SHORT_URL + String(project.projectImage._id) + '.' + project.projectImage.httpPath
            }

            for (let i = 0; i < project.contributors.length; i++) {
                if (project.contributors[i].profileImage) {
                    project.contributors[i].profileImage.dirPath = undefined as unknown as string
                    project.contributors[i].profileImage.deleted = undefined as unknown as boolean
                    project.contributors[i].profileImage.httpPath = API_HOST + UPLOADS_SHORT_URL + String(project.contributors[i].profileImage._id) + '.' + project.contributors[i].profileImage.httpPath
                }
                project.contributors[i].about = project.contributors[i].about ? project.contributors[i].about : null as unknown as string
            }
            for (let i = 0; i < project.projectManager.length; i++) {
                if (project.projectManager[i].profileImage) {
                    project.projectManager[i].profileImage.dirPath = undefined as unknown as string
                    project.projectManager[i].profileImage.deleted = undefined as unknown as boolean
                    project.projectManager[i].profileImage.httpPath = API_HOST + UPLOADS_SHORT_URL + String(project.projectManager[i].profileImage._id) + '.' + project.projectManager[i].profileImage.httpPath
                }
                project.projectManager[i].about = project.projectManager[i].about ? project.projectManager[i].about : null as unknown as string
            }
            for (let i = 0; i < project.attachments.length; i++) {
                project.attachments[i].dirPath = undefined as unknown as string
                project.attachments[i].deleted = undefined as unknown as boolean
                project.attachments[i].httpPath = API_HOST + UPLOADS_SHORT_URL + String(project.attachments[i]._id) + '.' + project.attachments[i].httpPath

            }
            for (let i = 0; i < project.sections.length; i++) {
                let section = project.sections[i]
                for (let j = 0; j < section.tasks.length; j++) {
                    let task = section.tasks[j]
                    for (let k = 0; k < task.files.length; k++) {
                        let file = task.files[k]
                        file.dirPath = undefined as unknown as string
                        file.deleted = undefined as unknown as boolean
                        file.httpPath = API_HOST + UPLOADS_SHORT_URL + String(file._id) + '.' + file.httpPath
                    }
                    for (let k = 0; k < task.assignees.length; k++) {
                        let assignee = task.assignees[k]
                        if (assignee.profileImage && assignee.profileImage.dirPath) {
                            assignee.profileImage.dirPath = undefined as unknown as string
                            assignee.profileImage.deleted = undefined as unknown as boolean
                            assignee.profileImage.httpPath = API_HOST + UPLOADS_SHORT_URL + String(assignee.profileImage._id) + '.' + assignee.profileImage.httpPath
                        }
                    }
                }
            }
            return project as Project
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * Update project image
     */
    public async updateProjectImage(
        req: Request,
    ): Promise<void | Error> {
        try {
            const { projectId } = req.body
            const userId = req.user._id

            // Perform project manager authorisation
            if (!isProjectManager(projectId, req.user.managedProjects) && req.user.role !== ROLES.SUPER_ADMIN) {
                throw new HttpException(
                    STATUS_CODES.ERROR.FORBIDDEN,
                    'Only the project manager is authorized to perform this operation'
                )
            }

            const file = req.files?.image as UploadedFile
            if (!file) {
                throw new HttpException(
                    STATUS_CODES.ERROR.BAD_REQUEST,
                    'No image uploaded'
                )
            }
            const project = await ProjectModel.findById(projectId).exec()
            if (!project) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    'Project not found'
                )
            }
            const filePath = saveFile(
                FILE_STRUCTURE.PROJECT_IMAGE_DIR,
                file
            )
            const arr = file.name.split('.')
            const ext = arr[arr.length - 1]
            const fileId = project.projectImage
            if (fileId) {
                await FileModel.findByIdAndUpdate(fileId, {
                    deleted: true
                })
            }
            let newFile = await new FileModel({
                httpPath: ext,
                dirPath: filePath,
                name: file.name,
                size: file.size,
                mimetype: file.mimetype,
                uploadedBy: userId
            }).save()
            await ProjectModel.findByIdAndUpdate(project._id, {
                projectImage: newFile._id,
            })
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * Toggle project state between ongoing or not
     */
    public async toggleProjectStatus(projectId: string): Promise<void | Error> {
        try {
            const project = await ProjectModel.findById(projectId).exec()
            if (!project) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    'Project not found'
                )
            }

            await ProjectModel.findByIdAndUpdate(projectId, {
                ongoing: !project.ongoing,
            })
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * Toggle project visibility between publicly accessible or not
     */
    public async toggleProjectVisibility(
        projectId: string
    ): Promise<void | Error> {
        try {
            const project = await ProjectModel.findById(projectId).exec()
            if (!project) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    'Project not found'
                )
            }

            await ProjectModel.findByIdAndUpdate(projectId, {
                publicProject: !project.publicProject,
            })
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * Add a new contributors to a project
     */
    public async addContributors(req: Request): Promise<void | Error> {
        try {
            const { projectId, contributorId } = req.body

            // Perform project manager authorisation
            if (!isProjectManager(projectId, req.user.managedProjects) && req.user.role !== ROLES.SUPER_ADMIN) {
                throw new HttpException(
                    STATUS_CODES.ERROR.FORBIDDEN,
                    'Only the project manager is authorized to perform this operation'
                )
            }

            const project = await ProjectModel.findById(projectId).exec()
            if (!project) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    'Project not found'
                )
            }

            // Remove all ids that are project manager ids
            for (let i = 0; i < project.projectManager.length; i++) {
                deleteElementInArray(String(project.projectManager[i]), contributorId)
            }

            //Screen contributor ids
            for (let i = 0; i < contributorId.length; i++) {
                let contributor = await UserModel.findById(
                    contributorId[i]
                ).exec()
                if (!contributor) {
                    throw new HttpException(
                        STATUS_CODES.ERROR.NOT_FOUND,
                        'Contributor not found'
                    )
                }

                if (!contributor.isMember) {
                    throw new HttpException(
                        STATUS_CODES.ERROR.BAD_REQUEST,
                        'This user is not yet a member'
                    )
                }
                addElementToArray(contributorId[i], project.contributors)
            }

            for (let i = 0; i < contributorId.length; i++) {
                let contributor = await UserModel.findById(
                    contributorId[i]
                ).exec()
                if (contributor) {
                    addElementToArray(projectId, contributor.projects)
                    await UserModel.findByIdAndUpdate(contributorId[i], {
                        projects: contributor.projects,
                    })
                }
            }
            await ProjectModel.findByIdAndUpdate(projectId, {
                contributors: project.contributors,
            })
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * Remove a contributor from a project
     */
    public async removeContributor(req: Request): Promise<void | Error> {
        try {
            const { projectId, contributorId } = req.body

            // Perform project manager authorisation
            if (!isProjectManager(projectId, req.user.managedProjects) && req.user.role !== ROLES.SUPER_ADMIN) {
                throw new HttpException(
                    STATUS_CODES.ERROR.FORBIDDEN,
                    'Only the project manager is authorized to perform this operation'
                )
            }

            const project = await ProjectModel.findById(projectId).exec()
            if (!project) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    'Project not found'
                )
            }

            const contributor = await UserModel.findById(contributorId).exec()
            if (!contributor) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    'Contributor not found'
                )
            }

            deleteElementInArray(contributorId, project.contributors)
            deleteElementInArray(projectId, contributor.projects)

            await ProjectModel.findByIdAndUpdate(projectId, {
                contributors: project.contributors,
            })
            await UserModel.findByIdAndUpdate(contributorId, {
                projects: contributor.projects,
            })
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * Create a task
     */
    private async createTask(
        tasks: string,
        sectionId: string
    ): Promise<String | Error> {
        let taskData = JSON.parse(tasks)
        const task = await new TaskModel({
            name: taskData.name,
            date: taskData.date,
            description: taskData.description,
            priority: 'Low',
            subTasks: [],
            assignees: taskData.assignees,
            section: sectionId,
        }).save()
        const subTask = await new SubTaskModel({
            description: taskData.description,
            task: task._id,
        }).save()
        await TaskModel.findByIdAndUpdate(task._id, {
            subTasks: [subTask._id],
        })
        return task._id
    }

    /**
     * Save attachement
     */
    private async saveAttachment(attachment: UploadedFile, uploaderId: string): Promise<String | Error> {
        let arr = attachment.name.split('.')
        let ext = arr[arr.length - 1]
        let filePath = saveFile(
            FILE_STRUCTURE.PROJECT_ATTACHMENT_DIR,
            attachment
        )
        let newFile = await new FileModel({
            httpPath: ext,
            dirPath: filePath,
            name: attachment.name,
            size: attachment.size,
            mimetype: attachment.mimetype,
            uploadedBy: uploaderId
        }).save()
        return newFile._id
    }

    /**
     * Delete project by id
     */
    public async deleteProjectById(projectId: string): Promise<void | Error> {
        try {
            const project = await ProjectModel.findById(projectId).exec()
            if (!project) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    'Project not found'
                )
            }

            // Delete sections
            for (let i = 0; i < project.sections.length; i++) {
                try {
                    await this.deleteSectionById(String(project.sections[i]))
                } catch (error: any) {
                    console.log('Error: ', error)
                }
            }

            // Update project managers
            for (let i = 0; i < project.projectManager.length; i++) {
                try {
                    let manager = await UserModel.findById(
                        project.projectManager[i]
                    ).exec()
                    if (manager) {
                        deleteElementInArray(projectId, manager.managedProjects)
                        await UserModel.findByIdAndUpdate(
                            project.projectManager[i],
                            {
                                managedProjects: manager.managedProjects,
                            }
                        )
                    }
                } catch (error: any) {
                    console.log('Error: ', error)
                }
            }

            // Update project contriutors
            for (let i = 0; i < project.contributors.length; i++) {
                try {
                    let user = await UserModel.findById(
                        project.contributors[i]
                    ).exec()
                    if (user) {
                        deleteElementInArray(projectId, user.projects)
                        await UserModel.findByIdAndUpdate(
                            project.contributors[i],
                            {
                                projects: user.projects,
                            }
                        )
                    }
                } catch (error: any) {
                    console.log('Error: ', error)
                }
            }

            // Delete project
            await ProjectModel.findByIdAndDelete(projectId).exec()
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * Add a manager to a project
     */
    public async addManager(req: Request): Promise<void | Error> {
        try {
            const { projectId, managerId } = req.body
            const project = await ProjectModel.findById(projectId).exec()
            if (!project) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    'Project not found'
                )
            }

            const manager = await UserModel.findById(managerId).exec()
            if (!manager) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    'Manager not found'
                )
            }

            if (!manager.isMember) {
                throw new HttpException(
                    STATUS_CODES.ERROR.BAD_REQUEST,
                    'Manager is not a member'
                )
            }

            if (project.projectManager.length == 2) {
                throw new HttpException(
                    STATUS_CODES.ERROR.BAD_REQUEST,
                    'A project can have at most two managers'
                )
            }

            deleteElementInArray(managerId, project.contributors)
            addElementToArray(managerId, project.projectManager)
            deleteElementInArray(projectId, manager.projects)
            addElementToArray(projectId, manager.managedProjects)

            await ProjectModel.findByIdAndUpdate(project._id, {
                contributors: project.contributors,
                projectManager: project.projectManager,
            })

            await UserModel.findByIdAndUpdate(manager._id, {
                projects: manager.projects,
                managedProjects: manager.managedProjects,
            })
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * Remove a manager from a project
     */
    public async removeManager(req: Request): Promise<void | Error> {
        try {
            const { projectId, managerId } = req.body
            const project = await ProjectModel.findById(projectId).exec()
            if (!project) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    'Project not found'
                )
            }

            const manager = await UserModel.findById(managerId).exec()
            if (!manager) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    'Manager not found'
                )
            }

            if (project.projectManager.length < 2) {
                throw new HttpException(
                    STATUS_CODES.ERROR.BAD_REQUEST,
                    'A project must have at least one manager'
                )
            }

            deleteElementInArray(managerId, project.projectManager)
            deleteElementInArray(projectId, manager.managedProjects)

            await ProjectModel.findByIdAndUpdate(project._id, {
                projectManager: project.projectManager,
            })

            await UserModel.findByIdAndUpdate(manager._id, {
                managedProjects: manager.managedProjects,
            })
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * Add attachments to a project
     */
    public async addAttachments(req: Request): Promise<void | Error> {
        try {
            const projectId = req.params.projectId
            const userId = req.user._id

            // Perform project manager authorisation
            if (!isProjectManager(projectId, req.user.managedProjects) && req.user.role !== ROLES.SUPER_ADMIN) {
                throw new HttpException(
                    STATUS_CODES.ERROR.FORBIDDEN,
                    'Only the project manager is authorized to perform this operation'
                )
            }

            const project = await ProjectModel.findById(projectId).exec()
            if (!project) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    'Project not found'
                )
            }

            const { files } = req
            const attachments = files?.attachments as UploadedFile[]

            // Add attachments
            let fileIds = []
            if (attachments) {
                if (Array.isArray(attachments)) {
                    for (let i = 0; i < attachments.length; i++) {
                        let id = await this.saveAttachment(attachments[i], userId)
                        fileIds.push(id)
                    }
                } else {
                    let id = await this.saveAttachment(attachments, userId)
                    fileIds.push(id)
                }
            } else {
                throw new HttpException(
                    STATUS_CODES.ERROR.BAD_REQUEST,
                    'Atleast one file is required'
                )
            }

            await ProjectModel.findByIdAndUpdate(project._id, {
                attachments: [...project.attachments, ...fileIds],
            })
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * Remove an attacheent from a project
     */
    public async removeAttachment(req: Request): Promise<void | Error> {
        try {
            const { projectId, filepath } = req.body

            // Perform project manager authorisation
            if (!isProjectManager(projectId, req.user.managedProjects) && req.user.role !== ROLES.SUPER_ADMIN) {
                throw new HttpException(
                    STATUS_CODES.ERROR.FORBIDDEN,
                    'Only the project manager is authorized to perform this operation'
                )
            }

            const project = await ProjectModel.findById(projectId).exec()
            if (!project) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    'Project not found'
                )
            }

            let arr = filepath.split('/')
            let file = arr[arr.length - 1]
            arr = file.split('.')
            let fileId = arr[0]
            deleteElementInArray(fileId, project.attachments)
            await ProjectModel.findByIdAndUpdate(projectId, {
                attachments: project.attachments,
            })
            await FileModel.findByIdAndUpdate(fileId, {
                deleted: true
            })
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    private async deleteSectionById(sectionId: string): Promise<void | Error> {
        const section = await SectionModel.findById(sectionId).exec()
        if (!section) {
            throw new HttpException(
                STATUS_CODES.ERROR.NOT_FOUND,
                'Section not found'
            )
        }

        // Delete tasks
        for (let i = 0; i < section.tasks.length; i++) {
            try {
                await this.deleteTaskById(String(section.tasks[i]))
            } catch (error: any) {
                console.log('Error: ', error)
            }
        }

        // Delete section
        await SectionModel.findByIdAndDelete(sectionId).exec()
    }

    private async deleteTaskById(taskId: string): Promise<void | Error> {
        const task = await TaskModel.findById(taskId).exec()
        if (!task) {
            throw new HttpException(
                STATUS_CODES.ERROR.NOT_FOUND,
                'Task not found'
            )
        }

        // Delete sub tasks
        for (let i = 0; i < task.subTasks.length; i++) {
            try {
                await SubTaskModel.findByIdAndDelete(task.subTasks[i]).exec()
            } catch (error: any) {
                console.log('Error: ', error)
            }
        }

        // Delete task
        await TaskModel.findByIdAndDelete(taskId).exec()
    }

    private async validProjectContributors(
        userIds: string[]
    ): Promise<boolean | Error> {
        for (let i = 0; i < userIds.length; i++) {
            let user = await UserModel.findById(userIds[i]).exec()
            if (!user || !user.isMember) {
                return false
            }
        }
        return true
    }

    private async validTaskContributors(
        projectContributorIds: string[],
        managerIds: string[],
        taskContributorIds: string[]
    ): Promise<boolean | Error> {
        for (let i = 0; i < taskContributorIds.length; i++) {
            if (!projectContributorIds.includes(taskContributorIds[i]) && !managerIds.includes(taskContributorIds[i])) {
                return false
            }
        }
        return true
    }

    private async getProjectPercentage(projectSections: { tasks: Task[] }[]
    ): Promise<number | Error> {
        let subTaskTotal = 0;
        let subTaskCompleted = 0;
        for (let i = 0; i < projectSections.length; i++) {
            projectSections[i].tasks.forEach((task) => {
                subTaskTotal += task.subTaskTotal
                subTaskCompleted += task.subTaskCompleted
            })
        }
        let percentage = (subTaskCompleted * 100) / subTaskTotal
        return percentage
    }
}

export default ProjectService
