import { Request } from 'express'
import { UploadedFile } from 'express-fileupload'

import {
    Task,
    SectionModel,
    SubTaskModel,
    TaskModel,
} from '@/resources/task'
import { FileModel } from '@/resources/file'
import { ProjectModel } from '@/resources/project'
import {
    FILE_STRUCTURE,
    STATUS_CODES,
    API_HOST,
    ROLES,
    UPLOADS_SHORT_URL
} from '@/utils/helper/constants'
import HttpException from '@/utils/exceptions/http.exception'
import {
    deleteElementInArray,
    saveFile,
    capitalizeString,
    isProjectManager,
    addElementToArray
} from '@/utils/helper/utils'
class TaskService {
    /**
     * Add a new section
     */
    public async addSection(req: Request): Promise<string | Error> {
        try {
            const { name, projectId } = req.body

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

            const uniqueName = projectId + '____' + capitalizeString(name)

            const savedSection = await SectionModel.findOne({
                uniqueName,
            }).exec()
            if (savedSection) {
                throw new HttpException(
                    STATUS_CODES.ERROR.CONFLICT,
                    'There is already a section in this project with the name: ' +
                    capitalizeString(name)
                )
            }

            const newSection = await new SectionModel({
                name,
                tasks: [],
                project: project._id,
                uniqueName,
            }).save()

            await ProjectModel.findByIdAndUpdate(project._id, {
                sections: [...project.sections, newSection._id],
            })

            return newSection._id
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * Add a new task
     */
    public async addTask(req: Request): Promise<string | Error> {
        try {
            const { body, files } = req
            const taskInfo = JSON.parse(body.taskInfo)
            const { name, description, sectionId, priority, date } = taskInfo
            let assignees = body.assignees
            const subtasks = body.subtasks
            const attachments = files?.files as UploadedFile[]
            const userId = req.user._id

            const section = await SectionModel.findById(sectionId).exec()
            if (!section) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    'Section not found'
                )
            }

            // Perform project manager authorisation
            if (!isProjectManager(String(section.project), req.user.managedProjects) && req.user.role !== ROLES.SUPER_ADMIN) {
                throw new HttpException(
                    STATUS_CODES.ERROR.FORBIDDEN,
                    'Only the project manager is authorized to perform this operation'
                )
            }

            if (!subtasks || !assignees) {
                throw new HttpException(
                    STATUS_CODES.ERROR.BAD_REQUEST,
                    'A task must have at least one subtask and one assignee'
                )
            }
            let subTaskTotal = Array.isArray(subtasks) ? subtasks.length : 1

            // TODO: Clean assignees
            // let validTaskContributors = await this.validTaskContributors(
            //     project.contributors,
            //     assignees
            // )
            // if (!validTaskContributors) {
            //     throw new HttpException(
            //         STATUS_CODES.ERROR.NOT_FOUND,
            //         'Tasks can only be assigned to project contributors'
            //     )
            // }

            if (!Array.isArray(assignees)) {
                assignees = [assignees]
            }

            const task = await new TaskModel({
                name,
                description,
                priority: capitalizeString(priority),
                date,
                subTasks: [],
                assignees,
                subTaskTotal,
                section: sectionId,
            }).save()

            const subtaskIds = []
            if (Array.isArray(subtasks)) {
                for (let i = 0; i < subtasks.length; i++) {
                    let subTaskData = JSON.parse(subtasks[i])
                    let subTask = await new SubTaskModel({
                        description: subTaskData.description,
                        task: String(task._id),
                    }).save()
                    subtaskIds.push(subTask._id)
                }
            } else {
                let subTaskData = JSON.parse(subtasks)
                let subTask = await new SubTaskModel({
                    description: subTaskData.description,
                    task: String(task._id),
                }).save()
                subtaskIds.push(subTask._id)
            }

            await TaskModel.findByIdAndUpdate(task._id, {
                subTasks: subtaskIds,
            })

            await SectionModel.findByIdAndUpdate(sectionId, {
                tasks: [...section.tasks, task._id],
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

            await TaskModel.findByIdAndUpdate(task._id, {
                files: fileIds,
            })

            return task._id
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * Get task by id
     */
    public async getTaskById(taskId: string): Promise<Task | Error> {
        try {
            const task = await TaskModel.findById(taskId)
                .populate({
                    path: 'subTasks',
                    select: {
                        description: 1,
                        completed: 1,
                    },
                })
                .populate({
                    path: 'assignees',
                    select: {
                        email: 1,
                        firstName: 1,
                        lastName: 1,
                        numberOfProjects: 1,
                    },
                })
                .populate({
                    path: 'section',
                    select: {
                        name: 1,
                    },
                })
                .populate({
                    path: 'files',
                    select: {
                        deleted: 0
                    }
                })
                .exec()
            if (!task) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    'Task not found'
                )
            }
            for (let i = 0; i < task.files.length; i++) {
                task.files[i].dirPath = undefined as unknown as string
                task.files[i].httpPath = API_HOST + UPLOADS_SHORT_URL + String(task.files[i]._id) + '.' + task.files[i].httpPath
            }
            return task
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * Delete subtask by id
     */
    public async deleteSubtaskById(req: Request): Promise<void | Error> {
        try {
            const subtaskId = req.params.subtaskId
            const subtask = await SubTaskModel.findById(subtaskId).exec()
            if (!subtask) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    'Subtask not found'
                )
            }
            const task = await TaskModel.findById(subtask.task).exec()
            if (!task) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    'Task not found'
                )
            }

            const section = await SectionModel.findById(task.section).exec()
            if (!section) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    'Section not found'
                )
            }

            // Perform project manager authorisation
            if (!isProjectManager(String(section.project), req.user.managedProjects) && req.user.role !== ROLES.SUPER_ADMIN) {
                throw new HttpException(
                    STATUS_CODES.ERROR.FORBIDDEN,
                    'Only the project manager is authorized to perform this operation'
                )
            }

            await SubTaskModel.findByIdAndDelete(subtaskId).exec()

            await deleteElementInArray(subtaskId, task.subTasks)

            await TaskModel.findByIdAndUpdate(task._id, {
                subTasks: task.subTasks,
                subTaskTotal: task.subTaskTotal - 1,
                subTaskCompleted: subtask.completed
                    ? task.subTaskCompleted - 1
                    : task.subTaskCompleted,
            })
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * Delete task by id
     */
    public async deleteTaskById(req: Request): Promise<void | Error> {
        try {
            const taskId = req.params.taskId
            const task = await TaskModel.findById(taskId).exec()
            if (!task) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    'Task not found'
                )
            }
            const section = await SectionModel.findById(task.section).exec()
            if (!section) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    'Section not found'
                )
            }

            // Perform project manager authorisation
            if (!isProjectManager(String(section.project), req.user.managedProjects) && req.user.role !== ROLES.SUPER_ADMIN) {
                throw new HttpException(
                    STATUS_CODES.ERROR.FORBIDDEN,
                    'Only the project manager is authorized to perform this operation'
                )
            }

            // Delete sub tasks
            for (let i = 0; i < task.subTasks.length; i++) {
                try {
                    await SubTaskModel.findByIdAndDelete(
                        task.subTasks[i]
                    ).exec()
                } catch (error: any) {
                    console.log('Error: ', error)
                }
            }

            // Delete task
            await TaskModel.findByIdAndDelete(taskId).exec()

            await deleteElementInArray(taskId, section.tasks)

            // Update section
            await SectionModel.findByIdAndUpdate(section._id, {
                tasks: section.tasks,
            })
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * Delete section by id
     */
    public async deleteSectionById(req: Request): Promise<void | Error> {
        try {
            const sectionId = req.params.sectionId
            const section = await SectionModel.findById(sectionId).exec()
            if (!section) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    'Section not found'
                )
            }
            const project = await ProjectModel.findById(section.project).exec()
            if (!project) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    'Project not found'
                )
            }

            // Perform project manager authorisation
            if (!isProjectManager(String(project._id), req.user.managedProjects) && req.user.role !== ROLES.SUPER_ADMIN) {
                throw new HttpException(
                    STATUS_CODES.ERROR.FORBIDDEN,
                    'Only the project manager is authorized to perform this operation'
                )
            }

            // Delete tasks
            for (let i = 0; i < section.tasks.length; i++) {
                try {
                    await this.deleteSectionTaskById(String(section.tasks[i]))
                } catch (error: any) {
                    console.log('Error: ', error)
                }
            }

            // Delete section
            await SectionModel.findByIdAndDelete(sectionId).exec()

            await deleteElementInArray(sectionId, project.sections)

            // Update project
            await ProjectModel.findByIdAndUpdate(project._id, {
                sections: project.sections,
            })
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * Change task section
     */
    public async changeTaskSection(
        req: Request
    ): Promise<object | null | Error> {
        try {
            const { newSectionId, taskId } = req.body

            const newSection = await SectionModel.findById(newSectionId).exec()
            if (!newSection) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    'New Section not found'
                )
            }

            const task = await TaskModel.findById(taskId).exec()
            if (!task) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    'Task not found'
                )
            }

            const oldSection = await SectionModel.findById(task.section).exec()
            if (!oldSection) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    'Old Section not found'
                )
            }

            await TaskModel.findByIdAndUpdate(taskId, {
                section: newSectionId,
            })

            await SectionModel.findByIdAndUpdate(newSectionId, {
                tasks: [...newSection.tasks, taskId],
            })

            await deleteElementInArray(taskId, oldSection.tasks)

            await SectionModel.findByIdAndUpdate(oldSection._id, {
                tasks: oldSection.tasks,
            })
            const project = await ProjectModel.findById(newSection.project)
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
                                profileImage: 1,
                            },
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
                    path: 'projectManager',
                    select: {
                        email: 1,
                        firstName: 1,
                        lastName: 1,
                        profileImage: 1,
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
                })
                .exec()
            return project
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * Edit subtask description
     */
    public async editSubtaskDescription(req: Request): Promise<void | Error> {
        try {
            const { subtaskId, description } = req.body

            await SubTaskModel.findByIdAndUpdate(subtaskId, {
                description,
            })
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * Toogle subtask status
     */
    public async toogleSubtaskStatus(req: Request): Promise<void | Error> {
        try {
            const subtaskId = req.params.subtaskId

            const subtask = await SubTaskModel.findById(subtaskId).exec()
            if (!subtask) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    'Subtask not found'
                )
            }

            const task = await TaskModel.findById(subtask.task).exec()
            if (!task) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    'Task not found'
                )
            }

            const completed = !subtask.completed
            await SubTaskModel.findByIdAndUpdate(subtaskId, {
                completed,
            })
            await TaskModel.findByIdAndUpdate(task._id, {
                subTaskCompleted: completed
                    ? task.subTaskCompleted + 1
                    : task.subTaskCompleted - 1,
            })
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * Edit a task
     */
    public async editTask(req: Request): Promise<void | Error> {
        try {
            const taskId = req.params.taskId
            const task = await TaskModel.findById(taskId).exec()
            const userId = req.user._id
            if (!task) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    'Task not found'
                )
            }

            const section = await SectionModel.findById(task.section).exec()
            if (!section) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    'Section not found'
                )
            }

            // Perform project manager authorisation
            if (!isProjectManager(String(section.project), req.user.managedProjects) && req.user.role !== ROLES.SUPER_ADMIN) {
                throw new HttpException(
                    STATUS_CODES.ERROR.FORBIDDEN,
                    'Only the project manager is authorized to perform this operation'
                )
            }

            const project = await ProjectModel.findById(section.project).exec()
            if (!project) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    'Project not found'
                )
            }

            const { body, files } = req
            const taskInfo = JSON.parse(body.taskInfo)
            const { name, description, priority, date } = taskInfo
            let newAssignees = body.assignees
            const newSubtasks = body.subtasks
            const attachments = files?.files as UploadedFile[]

            let numberOfNewSubtask = newSubtasks
                ? Array.isArray(newSubtasks)
                    ? newSubtasks.length
                    : 1
                : 0

            const subtaskIds = []
            if (newSubtasks) {
                if (Array.isArray(newSubtasks)) {
                    for (let i = 0; i < newSubtasks.length; i++) {
                        let subTaskData = JSON.parse(newSubtasks[i])
                        let subTask = await new SubTaskModel({
                            description: subTaskData.description,
                            task: String(task._id),
                        }).save()
                        subtaskIds.push(subTask._id)
                    }
                } else {
                    let subTaskData = JSON.parse(newSubtasks)
                    let subTask = await new SubTaskModel({
                        description: subTaskData.description,
                        task: String(task._id),
                    }).save()
                    subtaskIds.push(subTask._id)
                }
            }

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

            if (!Array.isArray(newAssignees)) {
                newAssignees = [newAssignees]
            }

            const assignees = task.assignees
            const projectContributors = [...project.projectManager, ...project.contributors]

            for (let i = 0; i < newAssignees.length; i++) {
                const validAssignee = this.isValidAssignee(newAssignees[i], projectContributors);
                if (!validAssignee) {
                    throw new HttpException(
                        STATUS_CODES.ERROR.BAD_REQUEST,
                        'Only project contributors can be assigned to tasks.'
                    )
                }
                addElementToArray(newAssignees[i], assignees);
            }

            await TaskModel.findByIdAndUpdate(taskId, {
                name,
                description,
                priority: capitalizeString(priority),
                date,
                subTaskTotal: task.subTaskTotal + numberOfNewSubtask,
                assignees,
                subTasks: [...task.subTasks, ...subtaskIds],
                files: [...task.files, ...fileIds],
            })
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * Remove someone assigned to a task
     */
    public async removeTaskAssignee(req: Request): Promise<void | Error> {
        try {
            const { taskId, assigneeId } = req.body
            const task = await TaskModel.findById(taskId).exec()
            if (!task) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    'Task not found'
                )
            }

            const section = await SectionModel.findById(task.section).exec()
            if (!section) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    'Section not found'
                )
            }

            // Perform project manager authorisation
            if (!isProjectManager(String(section.project), req.user.managedProjects) && req.user.role !== ROLES.SUPER_ADMIN) {
                throw new HttpException(
                    STATUS_CODES.ERROR.FORBIDDEN,
                    'Only the project manager is authorized to perform this operation'
                )
            }

            deleteElementInArray(assigneeId, task.assignees)
            await TaskModel.findByIdAndUpdate(taskId, {
                assignees: task.assignees,
            })
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * Remove someone assigned to a task
     */
    public async removeSubtask(req: Request): Promise<void | Error> {
        try {
            const { taskId, subtaskId } = req.body
            const task = await TaskModel.findById(taskId).exec()
            if (!task) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    'Task not found'
                )
            }

            const section = await SectionModel.findById(task.section).exec()
            if (!section) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    'Section not found'
                )
            }

            // Perform project manager authorisation
            if (!isProjectManager(String(section.project), req.user.managedProjects) && req.user.role !== ROLES.SUPER_ADMIN) {
                throw new HttpException(
                    STATUS_CODES.ERROR.FORBIDDEN,
                    'Only the project manager is authorized to perform this operation'
                )
            }

            deleteElementInArray(subtaskId, task.subTasks)
            await SubTaskModel.findByIdAndDelete(subtaskId).exec()
            await TaskModel.findByIdAndUpdate(taskId, {
                subTasks: task.subTasks,
            })
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * Delete file attachment
     */
    public async deleteAttachment(req: Request): Promise<void | Error> {
        try {
            const { taskId, filePath } = req.body
            const task = await TaskModel.findById(taskId).exec()
            if (!task) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    'Task not found'
                )
            }

            const section = await SectionModel.findById(task.section).exec()
            if (!section) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    'Section not found'
                )
            }

            // Perform project manager authorisation
            if (!isProjectManager(String(section.project), req.user.managedProjects) && req.user.role !== ROLES.SUPER_ADMIN) {
                throw new HttpException(
                    STATUS_CODES.ERROR.FORBIDDEN,
                    'Only the project manager is authorized to perform this operation'
                )
            }

            let arr = filePath.split('/')
            let file = arr[arr.length - 1]
            arr = file.split('.')
            let fileId = arr[0]
            deleteElementInArray(fileId, task.files)
            await TaskModel.findByIdAndUpdate(taskId, {
                files: task.files,
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

    /**
     * Save attachement
     */
    private async saveAttachment(attachment: UploadedFile, uploaderEmail: string): Promise<String | Error> {
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
            uploadedBy: uploaderEmail
        }).save()
        return newFile._id
    }

    // private async validTaskContributors(
    //     projectContributorIds: any[],
    //     taskContributorIds: string[]
    // ): Promise<boolean | Error> {
    //     for (let i = 0; i < taskContributorIds.length; i++) {
    //         if (!projectContributorIds.includes(taskContributorIds[i])) {
    //             return false
    //         }
    //     }
    //     return true
    // }

    public async deleteSectionTaskById(taskId: string): Promise<void | Error> {
        try {
            const task = await TaskModel.findById(taskId).exec()
            if (task) {
                // Delete sub tasks
                for (let i = 0; i < task.subTasks.length; i++) {
                    try {
                        await SubTaskModel.findByIdAndDelete(
                            task.subTasks[i]
                        ).exec()
                    } catch (error: any) {
                        console.log('Error: ', error)
                    }
                }
                // Delete task
                await TaskModel.findByIdAndDelete(taskId).exec()
            }
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    private isValidAssignee(userId: string, projectContributors: any[]): boolean {
        for (let i = 0; i < projectContributors.length; i++) {
            if (userId === String(projectContributors[i])) {
                return true
            }
        }
        return false
    }
}

export default TaskService
