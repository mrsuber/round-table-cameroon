"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const task_1 = require("@/resources/task");
const file_1 = require("@/resources/file");
const project_1 = require("@/resources/project");
const constants_1 = require("@/utils/helper/constants");
const http_exception_1 = __importDefault(require("@/utils/exceptions/http.exception"));
const utils_1 = require("@/utils/helper/utils");
class TaskService {
    /**
     * Add a new section
     */
    addSection(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, projectId } = req.body;
                // Perform project manager authorisation
                if (!(0, utils_1.isProjectManager)(projectId, req.user.managedProjects) && req.user.role !== constants_1.ROLES.SUPER_ADMIN) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.FORBIDDEN, 'Only the project manager is authorized to perform this operation');
                }
                const project = yield project_1.ProjectModel.findById(projectId).exec();
                if (!project) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Project not found');
                }
                const uniqueName = projectId + '____' + (0, utils_1.capitalizeString)(name);
                const savedSection = yield task_1.SectionModel.findOne({
                    uniqueName,
                }).exec();
                if (savedSection) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.CONFLICT, 'There is already a section in this project with the name: ' +
                        (0, utils_1.capitalizeString)(name));
                }
                const newSection = yield new task_1.SectionModel({
                    name,
                    tasks: [],
                    project: project._id,
                    uniqueName,
                }).save();
                yield project_1.ProjectModel.findByIdAndUpdate(project._id, {
                    sections: [...project.sections, newSection._id],
                });
                return newSection._id;
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Add a new task
     */
    addTask(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { body, files } = req;
                const taskInfo = JSON.parse(body.taskInfo);
                const { name, description, sectionId, priority, date } = taskInfo;
                let assignees = body.assignees;
                const subtasks = body.subtasks;
                const attachments = files === null || files === void 0 ? void 0 : files.files;
                const userId = req.user._id;
                const section = yield task_1.SectionModel.findById(sectionId).exec();
                if (!section) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Section not found');
                }
                // Perform project manager authorisation
                if (!(0, utils_1.isProjectManager)(String(section.project), req.user.managedProjects) && req.user.role !== constants_1.ROLES.SUPER_ADMIN) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.FORBIDDEN, 'Only the project manager is authorized to perform this operation');
                }
                if (!subtasks || !assignees) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.BAD_REQUEST, 'A task must have at least one subtask and one assignee');
                }
                let subTaskTotal = Array.isArray(subtasks) ? subtasks.length : 1;
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
                    assignees = [assignees];
                }
                const task = yield new task_1.TaskModel({
                    name,
                    description,
                    priority: (0, utils_1.capitalizeString)(priority),
                    date,
                    subTasks: [],
                    assignees,
                    subTaskTotal,
                    section: sectionId,
                }).save();
                const subtaskIds = [];
                if (Array.isArray(subtasks)) {
                    for (let i = 0; i < subtasks.length; i++) {
                        let subTaskData = JSON.parse(subtasks[i]);
                        let subTask = yield new task_1.SubTaskModel({
                            description: subTaskData.description,
                            task: String(task._id),
                        }).save();
                        subtaskIds.push(subTask._id);
                    }
                }
                else {
                    let subTaskData = JSON.parse(subtasks);
                    let subTask = yield new task_1.SubTaskModel({
                        description: subTaskData.description,
                        task: String(task._id),
                    }).save();
                    subtaskIds.push(subTask._id);
                }
                yield task_1.TaskModel.findByIdAndUpdate(task._id, {
                    subTasks: subtaskIds,
                });
                yield task_1.SectionModel.findByIdAndUpdate(sectionId, {
                    tasks: [...section.tasks, task._id],
                });
                // Add attachments
                let fileIds = [];
                if (attachments) {
                    if (Array.isArray(attachments)) {
                        for (let i = 0; i < attachments.length; i++) {
                            let id = yield this.saveAttachment(attachments[i], userId);
                            fileIds.push(id);
                        }
                    }
                    else {
                        let id = yield this.saveAttachment(attachments, userId);
                        fileIds.push(id);
                    }
                }
                yield task_1.TaskModel.findByIdAndUpdate(task._id, {
                    files: fileIds,
                });
                return task._id;
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Get task by id
     */
    getTaskById(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const task = yield task_1.TaskModel.findById(taskId)
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
                    .exec();
                if (!task) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Task not found');
                }
                for (let i = 0; i < task.files.length; i++) {
                    task.files[i].dirPath = undefined;
                    task.files[i].httpPath = constants_1.API_HOST + constants_1.UPLOADS_SHORT_URL + String(task.files[i]._id) + '.' + task.files[i].httpPath;
                }
                return task;
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Delete subtask by id
     */
    deleteSubtaskById(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const subtaskId = req.params.subtaskId;
                const subtask = yield task_1.SubTaskModel.findById(subtaskId).exec();
                if (!subtask) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Subtask not found');
                }
                const task = yield task_1.TaskModel.findById(subtask.task).exec();
                if (!task) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Task not found');
                }
                const section = yield task_1.SectionModel.findById(task.section).exec();
                if (!section) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Section not found');
                }
                // Perform project manager authorisation
                if (!(0, utils_1.isProjectManager)(String(section.project), req.user.managedProjects) && req.user.role !== constants_1.ROLES.SUPER_ADMIN) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.FORBIDDEN, 'Only the project manager is authorized to perform this operation');
                }
                yield task_1.SubTaskModel.findByIdAndDelete(subtaskId).exec();
                yield (0, utils_1.deleteElementInArray)(subtaskId, task.subTasks);
                yield task_1.TaskModel.findByIdAndUpdate(task._id, {
                    subTasks: task.subTasks,
                    subTaskTotal: task.subTaskTotal - 1,
                    subTaskCompleted: subtask.completed
                        ? task.subTaskCompleted - 1
                        : task.subTaskCompleted,
                });
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Delete task by id
     */
    deleteTaskById(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const taskId = req.params.taskId;
                const task = yield task_1.TaskModel.findById(taskId).exec();
                if (!task) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Task not found');
                }
                const section = yield task_1.SectionModel.findById(task.section).exec();
                if (!section) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Section not found');
                }
                // Perform project manager authorisation
                if (!(0, utils_1.isProjectManager)(String(section.project), req.user.managedProjects) && req.user.role !== constants_1.ROLES.SUPER_ADMIN) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.FORBIDDEN, 'Only the project manager is authorized to perform this operation');
                }
                // Delete sub tasks
                for (let i = 0; i < task.subTasks.length; i++) {
                    try {
                        yield task_1.SubTaskModel.findByIdAndDelete(task.subTasks[i]).exec();
                    }
                    catch (error) {
                        console.log('Error: ', error);
                    }
                }
                // Delete task
                yield task_1.TaskModel.findByIdAndDelete(taskId).exec();
                yield (0, utils_1.deleteElementInArray)(taskId, section.tasks);
                // Update section
                yield task_1.SectionModel.findByIdAndUpdate(section._id, {
                    tasks: section.tasks,
                });
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Delete section by id
     */
    deleteSectionById(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sectionId = req.params.sectionId;
                const section = yield task_1.SectionModel.findById(sectionId).exec();
                if (!section) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Section not found');
                }
                const project = yield project_1.ProjectModel.findById(section.project).exec();
                if (!project) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Project not found');
                }
                // Perform project manager authorisation
                if (!(0, utils_1.isProjectManager)(String(project._id), req.user.managedProjects) && req.user.role !== constants_1.ROLES.SUPER_ADMIN) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.FORBIDDEN, 'Only the project manager is authorized to perform this operation');
                }
                // Delete tasks
                for (let i = 0; i < section.tasks.length; i++) {
                    try {
                        yield this.deleteSectionTaskById(String(section.tasks[i]));
                    }
                    catch (error) {
                        console.log('Error: ', error);
                    }
                }
                // Delete section
                yield task_1.SectionModel.findByIdAndDelete(sectionId).exec();
                yield (0, utils_1.deleteElementInArray)(sectionId, project.sections);
                // Update project
                yield project_1.ProjectModel.findByIdAndUpdate(project._id, {
                    sections: project.sections,
                });
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Change task section
     */
    changeTaskSection(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { newSectionId, taskId } = req.body;
                const newSection = yield task_1.SectionModel.findById(newSectionId).exec();
                if (!newSection) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'New Section not found');
                }
                const task = yield task_1.TaskModel.findById(taskId).exec();
                if (!task) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Task not found');
                }
                const oldSection = yield task_1.SectionModel.findById(task.section).exec();
                if (!oldSection) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Old Section not found');
                }
                yield task_1.TaskModel.findByIdAndUpdate(taskId, {
                    section: newSectionId,
                });
                yield task_1.SectionModel.findByIdAndUpdate(newSectionId, {
                    tasks: [...newSection.tasks, taskId],
                });
                yield (0, utils_1.deleteElementInArray)(taskId, oldSection.tasks);
                yield task_1.SectionModel.findByIdAndUpdate(oldSection._id, {
                    tasks: oldSection.tasks,
                });
                const project = yield project_1.ProjectModel.findById(newSection.project)
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
                    .exec();
                return project;
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Edit subtask description
     */
    editSubtaskDescription(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { subtaskId, description } = req.body;
                yield task_1.SubTaskModel.findByIdAndUpdate(subtaskId, {
                    description,
                });
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Toogle subtask status
     */
    toogleSubtaskStatus(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const subtaskId = req.params.subtaskId;
                const subtask = yield task_1.SubTaskModel.findById(subtaskId).exec();
                if (!subtask) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Subtask not found');
                }
                const task = yield task_1.TaskModel.findById(subtask.task).exec();
                if (!task) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Task not found');
                }
                const completed = !subtask.completed;
                yield task_1.SubTaskModel.findByIdAndUpdate(subtaskId, {
                    completed,
                });
                yield task_1.TaskModel.findByIdAndUpdate(task._id, {
                    subTaskCompleted: completed
                        ? task.subTaskCompleted + 1
                        : task.subTaskCompleted - 1,
                });
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Edit a task
     */
    editTask(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const taskId = req.params.taskId;
                const task = yield task_1.TaskModel.findById(taskId).exec();
                const userId = req.user._id;
                if (!task) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Task not found');
                }
                const section = yield task_1.SectionModel.findById(task.section).exec();
                if (!section) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Section not found');
                }
                // Perform project manager authorisation
                if (!(0, utils_1.isProjectManager)(String(section.project), req.user.managedProjects) && req.user.role !== constants_1.ROLES.SUPER_ADMIN) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.FORBIDDEN, 'Only the project manager is authorized to perform this operation');
                }
                const project = yield project_1.ProjectModel.findById(section.project).exec();
                if (!project) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Project not found');
                }
                const { body, files } = req;
                const taskInfo = JSON.parse(body.taskInfo);
                const { name, description, priority, date } = taskInfo;
                let newAssignees = body.assignees;
                const newSubtasks = body.subtasks;
                const attachments = files === null || files === void 0 ? void 0 : files.files;
                let numberOfNewSubtask = newSubtasks
                    ? Array.isArray(newSubtasks)
                        ? newSubtasks.length
                        : 1
                    : 0;
                const subtaskIds = [];
                if (newSubtasks) {
                    if (Array.isArray(newSubtasks)) {
                        for (let i = 0; i < newSubtasks.length; i++) {
                            let subTaskData = JSON.parse(newSubtasks[i]);
                            let subTask = yield new task_1.SubTaskModel({
                                description: subTaskData.description,
                                task: String(task._id),
                            }).save();
                            subtaskIds.push(subTask._id);
                        }
                    }
                    else {
                        let subTaskData = JSON.parse(newSubtasks);
                        let subTask = yield new task_1.SubTaskModel({
                            description: subTaskData.description,
                            task: String(task._id),
                        }).save();
                        subtaskIds.push(subTask._id);
                    }
                }
                // Add attachments
                let fileIds = [];
                if (attachments) {
                    if (Array.isArray(attachments)) {
                        for (let i = 0; i < attachments.length; i++) {
                            let id = yield this.saveAttachment(attachments[i], userId);
                            fileIds.push(id);
                        }
                    }
                    else {
                        let id = yield this.saveAttachment(attachments, userId);
                        fileIds.push(id);
                    }
                }
                if (!Array.isArray(newAssignees)) {
                    newAssignees = [newAssignees];
                }
                const assignees = task.assignees;
                const projectContributors = [...project.projectManager, ...project.contributors];
                for (let i = 0; i < newAssignees.length; i++) {
                    const validAssignee = this.isValidAssignee(newAssignees[i], projectContributors);
                    if (!validAssignee) {
                        throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.BAD_REQUEST, 'Only project contributors can be assigned to tasks.');
                    }
                    (0, utils_1.addElementToArray)(newAssignees[i], assignees);
                }
                yield task_1.TaskModel.findByIdAndUpdate(taskId, {
                    name,
                    description,
                    priority: (0, utils_1.capitalizeString)(priority),
                    date,
                    subTaskTotal: task.subTaskTotal + numberOfNewSubtask,
                    assignees,
                    subTasks: [...task.subTasks, ...subtaskIds],
                    files: [...task.files, ...fileIds],
                });
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Remove someone assigned to a task
     */
    removeTaskAssignee(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { taskId, assigneeId } = req.body;
                const task = yield task_1.TaskModel.findById(taskId).exec();
                if (!task) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Task not found');
                }
                const section = yield task_1.SectionModel.findById(task.section).exec();
                if (!section) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Section not found');
                }
                // Perform project manager authorisation
                if (!(0, utils_1.isProjectManager)(String(section.project), req.user.managedProjects) && req.user.role !== constants_1.ROLES.SUPER_ADMIN) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.FORBIDDEN, 'Only the project manager is authorized to perform this operation');
                }
                (0, utils_1.deleteElementInArray)(assigneeId, task.assignees);
                yield task_1.TaskModel.findByIdAndUpdate(taskId, {
                    assignees: task.assignees,
                });
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Remove someone assigned to a task
     */
    removeSubtask(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { taskId, subtaskId } = req.body;
                const task = yield task_1.TaskModel.findById(taskId).exec();
                if (!task) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Task not found');
                }
                const section = yield task_1.SectionModel.findById(task.section).exec();
                if (!section) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Section not found');
                }
                // Perform project manager authorisation
                if (!(0, utils_1.isProjectManager)(String(section.project), req.user.managedProjects) && req.user.role !== constants_1.ROLES.SUPER_ADMIN) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.FORBIDDEN, 'Only the project manager is authorized to perform this operation');
                }
                (0, utils_1.deleteElementInArray)(subtaskId, task.subTasks);
                yield task_1.SubTaskModel.findByIdAndDelete(subtaskId).exec();
                yield task_1.TaskModel.findByIdAndUpdate(taskId, {
                    subTasks: task.subTasks,
                });
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Delete file attachment
     */
    deleteAttachment(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { taskId, filePath } = req.body;
                const task = yield task_1.TaskModel.findById(taskId).exec();
                if (!task) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Task not found');
                }
                const section = yield task_1.SectionModel.findById(task.section).exec();
                if (!section) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Section not found');
                }
                // Perform project manager authorisation
                if (!(0, utils_1.isProjectManager)(String(section.project), req.user.managedProjects) && req.user.role !== constants_1.ROLES.SUPER_ADMIN) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.FORBIDDEN, 'Only the project manager is authorized to perform this operation');
                }
                let arr = filePath.split('/');
                let file = arr[arr.length - 1];
                arr = file.split('.');
                let fileId = arr[0];
                (0, utils_1.deleteElementInArray)(fileId, task.files);
                yield task_1.TaskModel.findByIdAndUpdate(taskId, {
                    files: task.files,
                });
                yield file_1.FileModel.findByIdAndUpdate(fileId, {
                    deleted: true
                });
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Save attachement
     */
    saveAttachment(attachment, uploaderEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            let arr = attachment.name.split('.');
            let ext = arr[arr.length - 1];
            let filePath = (0, utils_1.saveFile)(constants_1.FILE_STRUCTURE.PROJECT_ATTACHMENT_DIR, attachment);
            let newFile = yield new file_1.FileModel({
                httpPath: ext,
                dirPath: filePath,
                name: attachment.name,
                size: attachment.size,
                mimetype: attachment.mimetype,
                uploadedBy: uploaderEmail
            }).save();
            return newFile._id;
        });
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
    deleteSectionTaskById(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const task = yield task_1.TaskModel.findById(taskId).exec();
                if (task) {
                    // Delete sub tasks
                    for (let i = 0; i < task.subTasks.length; i++) {
                        try {
                            yield task_1.SubTaskModel.findByIdAndDelete(task.subTasks[i]).exec();
                        }
                        catch (error) {
                            console.log('Error: ', error);
                        }
                    }
                    // Delete task
                    yield task_1.TaskModel.findByIdAndDelete(taskId).exec();
                }
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    isValidAssignee(userId, projectContributors) {
        for (let i = 0; i < projectContributors.length; i++) {
            if (userId === String(projectContributors[i])) {
                return true;
            }
        }
        return false;
    }
}
exports.default = TaskService;
