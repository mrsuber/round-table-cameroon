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
const project_1 = require("@/resources/project");
const file_1 = require("@/resources/file");
const user_1 = require("@/resources/user");
const task_1 = require("@/resources/task");
const constants_1 = require("@/utils/helper/constants");
const utils_1 = require("@/utils/helper/utils");
const http_exception_1 = __importDefault(require("@/utils/exceptions/http.exception"));
class ProjectService {
    /**
     * Add a new project
     */
    addProject(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { body, files } = req;
                const projectInfo = JSON.parse(body.projectInfo);
                const { publicProject, title, date, ongoing } = projectInfo;
                const projectManagers = body.projectManager;
                let projectMembers = body.projectMembers;
                const labels = body.labels;
                const description = body.description;
                const tasks = body.tasks;
                const projectImage = files === null || files === void 0 ? void 0 : files.projectImage;
                const attachments = files === null || files === void 0 ? void 0 : files.attachments;
                let managers = [];
                const userId = req.user._id;
                if (!Array.isArray(projectMembers)) {
                    projectMembers = [projectMembers];
                }
                if (Array.isArray(projectManagers)) {
                    for (let i = 0; i < projectManagers.length; i++) {
                        let manager = yield user_1.UserModel.findById(projectManagers[i]).exec();
                        managers.push(manager);
                    }
                }
                else {
                    let manager = yield user_1.UserModel.findById(projectManagers).exec();
                    managers.push(manager);
                }
                for (let i = 0; i < managers.length; i++) {
                    if (!managers[i]) {
                        throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Project manager not found');
                    }
                    if (!managers[i].isMember) {
                        throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.BAD_REQUEST, 'Project managers must be members');
                    }
                    // Remove project manager from array of contributors
                    (0, utils_1.deleteElementInArray)(projectManagers[i], projectMembers);
                }
                const validContributors = yield this.validProjectContributors(projectMembers);
                if (!validContributors) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.BAD_REQUEST, 'All contributors must be menbers');
                }
                // Add project image
                const filePath = (0, utils_1.saveFile)(constants_1.FILE_STRUCTURE.PROJECT_IMAGE_DIR, projectImage);
                const arr = projectImage.name.split('.');
                const ext = arr[arr.length - 1];
                let newFile = yield new file_1.FileModel({
                    httpPath: ext,
                    dirPath: filePath,
                    name: projectImage.name,
                    size: projectImage.size,
                    mimetype: projectImage.mimetype,
                    uploadedBy: userId
                }).save();
                // Save project
                const project = yield new project_1.ProjectModel({
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
                }).save();
                for (let i = 0; i < managers.length; i++) {
                    yield user_1.UserModel.findByIdAndUpdate(managers[i]._id, {
                        managedProjects: [...managers[i].managedProjects, project._id],
                    });
                }
                for (let i = 0; i < projectMembers.length; i++) {
                    let projectMember = yield user_1.UserModel.findById(projectMembers[i]).exec();
                    if (projectMember) {
                        yield user_1.UserModel.findByIdAndUpdate(projectMembers[i], {
                            projects: [...projectMember.projects, project._id],
                        });
                    }
                }
                const uniqueName = String(project._id) + '____' + 'Backlog';
                const backlogSection = yield new task_1.SectionModel({
                    name: 'Backlog',
                    tasks: [],
                    project: project._id,
                    uniqueName,
                }).save();
                yield project_1.ProjectModel.findByIdAndUpdate(project._id, {
                    sections: [backlogSection._id],
                });
                // Create tasks
                const taskIds = [];
                if (tasks) {
                    if (Array.isArray(tasks)) {
                        for (let i = 0; i < tasks.length; i++) {
                            let taskData = JSON.parse(tasks[i]);
                            let validTaskContributors = yield this.validTaskContributors(projectMembers, projectManagers, taskData.assignees);
                            if (!validTaskContributors) {
                                throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Tasks can only be assigned to project contributors');
                            }
                            let id = yield this.createTask(tasks[i], backlogSection._id);
                            taskIds.push(id);
                        }
                    }
                    else {
                        let taskData = JSON.parse(tasks);
                        let validTaskContributors = yield this.validTaskContributors(projectMembers, projectManagers, taskData.assignees);
                        if (!validTaskContributors) {
                            throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Tasks can only be assigned to project contributors');
                        }
                        let id = yield this.createTask(tasks, backlogSection._id);
                        taskIds.push(id);
                    }
                }
                yield task_1.SectionModel.findByIdAndUpdate(backlogSection._id, {
                    tasks: taskIds,
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
                yield project_1.ProjectModel.findByIdAndUpdate(project._id, {
                    attachments: fileIds,
                });
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    editProject(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { publicProject, title, date, ongoing, description, labels, projectId, } = req.body;
                // Perform project manager authorisation
                if (!(0, utils_1.isProjectManager)(projectId, req.user.managedProjects) && req.user.role !== constants_1.ROLES.SUPER_ADMIN) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.FORBIDDEN, 'Only the project manager is authorized to perform this operation');
                }
                const project = yield project_1.ProjectModel.findById(projectId).exec();
                if (!project) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Project not found');
                }
                yield project_1.ProjectModel.findByIdAndUpdate(project._id, {
                    publicProject,
                    title,
                    date,
                    ongoing,
                    description,
                    labels,
                });
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Get saved projects
     */
    getProjects(pageNumber, pageLimit, publicProjectOnly) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchParams = publicProjectOnly ? { publicProject: true } : {};
            try {
                const startIndex = pageNumber * pageLimit;
                const endIndex = (pageNumber + 1) * pageLimit;
                const result = {
                    total: 0,
                    data: [],
                    rowsPerPage: 0,
                };
                result.total = yield project_1.ProjectModel.find(Object.assign({}, searchParams))
                    .countDocuments()
                    .exec();
                // Check if previous page exists and give page number
                if (startIndex > 0) {
                    result.previous = {
                        pageNumber: pageNumber - 1,
                        pageLimit,
                    };
                }
                // Check if next page exists and give page number
                if (endIndex < result.total) {
                    result.next = {
                        pageNumber: pageNumber + 1,
                        pageLimit,
                    };
                }
                result.data = yield project_1.ProjectModel.find(Object.assign({}, searchParams), '')
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
                    .exec();
                result.rowsPerPage = pageLimit;
                for (let i = 0; i < result.data.length; i++) {
                    let project = result.data[i];
                    project.percentage = yield this.getProjectPercentage(project.sections);
                    for (let j = 0; j < project.projectManager.length; j++) {
                        let manager = project.projectManager[j];
                        if (manager.profileImage) {
                            manager.profileImage.dirPath = undefined;
                            manager.profileImage.deleted = undefined;
                            manager.profileImage.httpPath = constants_1.API_HOST + constants_1.UPLOADS_SHORT_URL + String(manager.profileImage._id) + '.' + manager.profileImage.httpPath;
                        }
                    }
                    for (let j = 0; j < project.contributors.length; j++) {
                        let contributor = project.contributors[j];
                        if (contributor.profileImage) {
                            contributor.profileImage.dirPath = undefined;
                            contributor.profileImage.deleted = undefined;
                            contributor.profileImage.httpPath = constants_1.API_HOST + constants_1.UPLOADS_SHORT_URL + String(contributor.profileImage._id) + '.' + contributor.profileImage.httpPath;
                        }
                    }
                    for (let j = 0; j < project.attachments.length; j++) {
                        let attachment = project.attachments[j];
                        attachment.dirPath = undefined;
                        attachment.deleted = undefined;
                        attachment.httpPath = constants_1.API_HOST + constants_1.UPLOADS_SHORT_URL + String(attachment._id) + '.' + attachment.httpPath;
                    }
                    if (project.projectImage) {
                        project.projectImage.dirPath = undefined;
                        project.projectImage.deleted = undefined;
                        project.projectImage.httpPath = constants_1.API_HOST + constants_1.UPLOADS_SHORT_URL + String(project.projectImage._id) + '.' + project.projectImage.httpPath;
                    }
                }
                return result;
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Get project details
     */
    getProjectDetails(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const project = yield project_1.ProjectModel.findById(projectId)
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
                    .exec();
                if (!project) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Project not found');
                }
                if (project.projectImage) {
                    project.projectImage.dirPath = undefined;
                    project.projectImage.deleted = undefined;
                    project.projectImage.httpPath = constants_1.API_HOST + constants_1.UPLOADS_SHORT_URL + String(project.projectImage._id) + '.' + project.projectImage.httpPath;
                }
                for (let i = 0; i < project.contributors.length; i++) {
                    if (project.contributors[i].profileImage) {
                        project.contributors[i].profileImage.dirPath = undefined;
                        project.contributors[i].profileImage.deleted = undefined;
                        project.contributors[i].profileImage.httpPath = constants_1.API_HOST + constants_1.UPLOADS_SHORT_URL + String(project.contributors[i].profileImage._id) + '.' + project.contributors[i].profileImage.httpPath;
                    }
                    project.contributors[i].about = project.contributors[i].about ? project.contributors[i].about : null;
                }
                for (let i = 0; i < project.projectManager.length; i++) {
                    if (project.projectManager[i].profileImage) {
                        project.projectManager[i].profileImage.dirPath = undefined;
                        project.projectManager[i].profileImage.deleted = undefined;
                        project.projectManager[i].profileImage.httpPath = constants_1.API_HOST + constants_1.UPLOADS_SHORT_URL + String(project.projectManager[i].profileImage._id) + '.' + project.projectManager[i].profileImage.httpPath;
                    }
                    project.projectManager[i].about = project.projectManager[i].about ? project.projectManager[i].about : null;
                }
                for (let i = 0; i < project.attachments.length; i++) {
                    project.attachments[i].dirPath = undefined;
                    project.attachments[i].deleted = undefined;
                    project.attachments[i].httpPath = constants_1.API_HOST + constants_1.UPLOADS_SHORT_URL + String(project.attachments[i]._id) + '.' + project.attachments[i].httpPath;
                }
                for (let i = 0; i < project.sections.length; i++) {
                    let section = project.sections[i];
                    for (let j = 0; j < section.tasks.length; j++) {
                        let task = section.tasks[j];
                        for (let k = 0; k < task.files.length; k++) {
                            let file = task.files[k];
                            file.dirPath = undefined;
                            file.deleted = undefined;
                            file.httpPath = constants_1.API_HOST + constants_1.UPLOADS_SHORT_URL + String(file._id) + '.' + file.httpPath;
                        }
                        for (let k = 0; k < task.assignees.length; k++) {
                            let assignee = task.assignees[k];
                            if (assignee.profileImage && assignee.profileImage.dirPath) {
                                assignee.profileImage.dirPath = undefined;
                                assignee.profileImage.deleted = undefined;
                                assignee.profileImage.httpPath = constants_1.API_HOST + constants_1.UPLOADS_SHORT_URL + String(assignee.profileImage._id) + '.' + assignee.profileImage.httpPath;
                            }
                        }
                    }
                }
                return project;
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Update project image
     */
    updateProjectImage(req) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { projectId } = req.body;
                const userId = req.user._id;
                // Perform project manager authorisation
                if (!(0, utils_1.isProjectManager)(projectId, req.user.managedProjects) && req.user.role !== constants_1.ROLES.SUPER_ADMIN) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.FORBIDDEN, 'Only the project manager is authorized to perform this operation');
                }
                const file = (_a = req.files) === null || _a === void 0 ? void 0 : _a.image;
                if (!file) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.BAD_REQUEST, 'No image uploaded');
                }
                const project = yield project_1.ProjectModel.findById(projectId).exec();
                if (!project) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Project not found');
                }
                const filePath = (0, utils_1.saveFile)(constants_1.FILE_STRUCTURE.PROJECT_IMAGE_DIR, file);
                const arr = file.name.split('.');
                const ext = arr[arr.length - 1];
                const fileId = project.projectImage;
                if (fileId) {
                    yield file_1.FileModel.findByIdAndUpdate(fileId, {
                        deleted: true
                    });
                }
                let newFile = yield new file_1.FileModel({
                    httpPath: ext,
                    dirPath: filePath,
                    name: file.name,
                    size: file.size,
                    mimetype: file.mimetype,
                    uploadedBy: userId
                }).save();
                yield project_1.ProjectModel.findByIdAndUpdate(project._id, {
                    projectImage: newFile._id,
                });
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Toggle project state between ongoing or not
     */
    toggleProjectStatus(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const project = yield project_1.ProjectModel.findById(projectId).exec();
                if (!project) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Project not found');
                }
                yield project_1.ProjectModel.findByIdAndUpdate(projectId, {
                    ongoing: !project.ongoing,
                });
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Toggle project visibility between publicly accessible or not
     */
    toggleProjectVisibility(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const project = yield project_1.ProjectModel.findById(projectId).exec();
                if (!project) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Project not found');
                }
                yield project_1.ProjectModel.findByIdAndUpdate(projectId, {
                    publicProject: !project.publicProject,
                });
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Add a new contributors to a project
     */
    addContributors(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { projectId, contributorId } = req.body;
                // Perform project manager authorisation
                if (!(0, utils_1.isProjectManager)(projectId, req.user.managedProjects) && req.user.role !== constants_1.ROLES.SUPER_ADMIN) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.FORBIDDEN, 'Only the project manager is authorized to perform this operation');
                }
                const project = yield project_1.ProjectModel.findById(projectId).exec();
                if (!project) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Project not found');
                }
                // Remove all ids that are project manager ids
                for (let i = 0; i < project.projectManager.length; i++) {
                    (0, utils_1.deleteElementInArray)(String(project.projectManager[i]), contributorId);
                }
                //Screen contributor ids
                for (let i = 0; i < contributorId.length; i++) {
                    let contributor = yield user_1.UserModel.findById(contributorId[i]).exec();
                    if (!contributor) {
                        throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Contributor not found');
                    }
                    if (!contributor.isMember) {
                        throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.BAD_REQUEST, 'This user is not yet a member');
                    }
                    (0, utils_1.addElementToArray)(contributorId[i], project.contributors);
                }
                for (let i = 0; i < contributorId.length; i++) {
                    let contributor = yield user_1.UserModel.findById(contributorId[i]).exec();
                    if (contributor) {
                        (0, utils_1.addElementToArray)(projectId, contributor.projects);
                        yield user_1.UserModel.findByIdAndUpdate(contributorId[i], {
                            projects: contributor.projects,
                        });
                    }
                }
                yield project_1.ProjectModel.findByIdAndUpdate(projectId, {
                    contributors: project.contributors,
                });
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Remove a contributor from a project
     */
    removeContributor(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { projectId, contributorId } = req.body;
                // Perform project manager authorisation
                if (!(0, utils_1.isProjectManager)(projectId, req.user.managedProjects) && req.user.role !== constants_1.ROLES.SUPER_ADMIN) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.FORBIDDEN, 'Only the project manager is authorized to perform this operation');
                }
                const project = yield project_1.ProjectModel.findById(projectId).exec();
                if (!project) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Project not found');
                }
                const contributor = yield user_1.UserModel.findById(contributorId).exec();
                if (!contributor) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Contributor not found');
                }
                (0, utils_1.deleteElementInArray)(contributorId, project.contributors);
                (0, utils_1.deleteElementInArray)(projectId, contributor.projects);
                yield project_1.ProjectModel.findByIdAndUpdate(projectId, {
                    contributors: project.contributors,
                });
                yield user_1.UserModel.findByIdAndUpdate(contributorId, {
                    projects: contributor.projects,
                });
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Create a task
     */
    createTask(tasks, sectionId) {
        return __awaiter(this, void 0, void 0, function* () {
            let taskData = JSON.parse(tasks);
            const task = yield new task_1.TaskModel({
                name: taskData.name,
                date: taskData.date,
                description: taskData.description,
                priority: 'Low',
                subTasks: [],
                assignees: taskData.assignees,
                section: sectionId,
            }).save();
            const subTask = yield new task_1.SubTaskModel({
                description: taskData.description,
                task: task._id,
            }).save();
            yield task_1.TaskModel.findByIdAndUpdate(task._id, {
                subTasks: [subTask._id],
            });
            return task._id;
        });
    }
    /**
     * Save attachement
     */
    saveAttachment(attachment, uploaderId) {
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
                uploadedBy: uploaderId
            }).save();
            return newFile._id;
        });
    }
    /**
     * Delete project by id
     */
    deleteProjectById(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const project = yield project_1.ProjectModel.findById(projectId).exec();
                if (!project) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Project not found');
                }
                // Delete sections
                for (let i = 0; i < project.sections.length; i++) {
                    try {
                        yield this.deleteSectionById(String(project.sections[i]));
                    }
                    catch (error) {
                        console.log('Error: ', error);
                    }
                }
                // Update project managers
                for (let i = 0; i < project.projectManager.length; i++) {
                    try {
                        let manager = yield user_1.UserModel.findById(project.projectManager[i]).exec();
                        if (manager) {
                            (0, utils_1.deleteElementInArray)(projectId, manager.managedProjects);
                            yield user_1.UserModel.findByIdAndUpdate(project.projectManager[i], {
                                managedProjects: manager.managedProjects,
                            });
                        }
                    }
                    catch (error) {
                        console.log('Error: ', error);
                    }
                }
                // Update project contriutors
                for (let i = 0; i < project.contributors.length; i++) {
                    try {
                        let user = yield user_1.UserModel.findById(project.contributors[i]).exec();
                        if (user) {
                            (0, utils_1.deleteElementInArray)(projectId, user.projects);
                            yield user_1.UserModel.findByIdAndUpdate(project.contributors[i], {
                                projects: user.projects,
                            });
                        }
                    }
                    catch (error) {
                        console.log('Error: ', error);
                    }
                }
                // Delete project
                yield project_1.ProjectModel.findByIdAndDelete(projectId).exec();
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Add a manager to a project
     */
    addManager(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { projectId, managerId } = req.body;
                const project = yield project_1.ProjectModel.findById(projectId).exec();
                if (!project) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Project not found');
                }
                const manager = yield user_1.UserModel.findById(managerId).exec();
                if (!manager) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Manager not found');
                }
                if (!manager.isMember) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.BAD_REQUEST, 'Manager is not a member');
                }
                if (project.projectManager.length == 2) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.BAD_REQUEST, 'A project can have at most two managers');
                }
                (0, utils_1.deleteElementInArray)(managerId, project.contributors);
                (0, utils_1.addElementToArray)(managerId, project.projectManager);
                (0, utils_1.deleteElementInArray)(projectId, manager.projects);
                (0, utils_1.addElementToArray)(projectId, manager.managedProjects);
                yield project_1.ProjectModel.findByIdAndUpdate(project._id, {
                    contributors: project.contributors,
                    projectManager: project.projectManager,
                });
                yield user_1.UserModel.findByIdAndUpdate(manager._id, {
                    projects: manager.projects,
                    managedProjects: manager.managedProjects,
                });
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Remove a manager from a project
     */
    removeManager(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { projectId, managerId } = req.body;
                const project = yield project_1.ProjectModel.findById(projectId).exec();
                if (!project) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Project not found');
                }
                const manager = yield user_1.UserModel.findById(managerId).exec();
                if (!manager) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Manager not found');
                }
                if (project.projectManager.length < 2) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.BAD_REQUEST, 'A project must have at least one manager');
                }
                (0, utils_1.deleteElementInArray)(managerId, project.projectManager);
                (0, utils_1.deleteElementInArray)(projectId, manager.managedProjects);
                yield project_1.ProjectModel.findByIdAndUpdate(project._id, {
                    projectManager: project.projectManager,
                });
                yield user_1.UserModel.findByIdAndUpdate(manager._id, {
                    managedProjects: manager.managedProjects,
                });
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Add attachments to a project
     */
    addAttachments(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const projectId = req.params.projectId;
                const userId = req.user._id;
                // Perform project manager authorisation
                if (!(0, utils_1.isProjectManager)(projectId, req.user.managedProjects) && req.user.role !== constants_1.ROLES.SUPER_ADMIN) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.FORBIDDEN, 'Only the project manager is authorized to perform this operation');
                }
                const project = yield project_1.ProjectModel.findById(projectId).exec();
                if (!project) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Project not found');
                }
                const { files } = req;
                const attachments = files === null || files === void 0 ? void 0 : files.attachments;
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
                else {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.BAD_REQUEST, 'Atleast one file is required');
                }
                yield project_1.ProjectModel.findByIdAndUpdate(project._id, {
                    attachments: [...project.attachments, ...fileIds],
                });
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Remove an attacheent from a project
     */
    removeAttachment(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { projectId, filepath } = req.body;
                // Perform project manager authorisation
                if (!(0, utils_1.isProjectManager)(projectId, req.user.managedProjects) && req.user.role !== constants_1.ROLES.SUPER_ADMIN) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.FORBIDDEN, 'Only the project manager is authorized to perform this operation');
                }
                const project = yield project_1.ProjectModel.findById(projectId).exec();
                if (!project) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Project not found');
                }
                let arr = filepath.split('/');
                let file = arr[arr.length - 1];
                arr = file.split('.');
                let fileId = arr[0];
                (0, utils_1.deleteElementInArray)(fileId, project.attachments);
                yield project_1.ProjectModel.findByIdAndUpdate(projectId, {
                    attachments: project.attachments,
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
    deleteSectionById(sectionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const section = yield task_1.SectionModel.findById(sectionId).exec();
            if (!section) {
                throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Section not found');
            }
            // Delete tasks
            for (let i = 0; i < section.tasks.length; i++) {
                try {
                    yield this.deleteTaskById(String(section.tasks[i]));
                }
                catch (error) {
                    console.log('Error: ', error);
                }
            }
            // Delete section
            yield task_1.SectionModel.findByIdAndDelete(sectionId).exec();
        });
    }
    deleteTaskById(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield task_1.TaskModel.findById(taskId).exec();
            if (!task) {
                throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Task not found');
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
        });
    }
    validProjectContributors(userIds) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < userIds.length; i++) {
                let user = yield user_1.UserModel.findById(userIds[i]).exec();
                if (!user || !user.isMember) {
                    return false;
                }
            }
            return true;
        });
    }
    validTaskContributors(projectContributorIds, managerIds, taskContributorIds) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < taskContributorIds.length; i++) {
                if (!projectContributorIds.includes(taskContributorIds[i]) && !managerIds.includes(taskContributorIds[i])) {
                    return false;
                }
            }
            return true;
        });
    }
    getProjectPercentage(projectSections) {
        return __awaiter(this, void 0, void 0, function* () {
            let subTaskTotal = 0;
            let subTaskCompleted = 0;
            for (let i = 0; i < projectSections.length; i++) {
                projectSections[i].tasks.forEach((task) => {
                    subTaskTotal += task.subTaskTotal;
                    subTaskCompleted += task.subTaskCompleted;
                });
            }
            let percentage = (subTaskCompleted * 100) / subTaskTotal;
            return percentage;
        });
    }
}
exports.default = ProjectService;
