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
const express_1 = require("express");
const http_exception_1 = __importDefault(require("@/utils/exceptions/http.exception"));
const task_1 = require("@/resources/task");
const index_1 = require("@/middleware/index");
const constants_1 = require("@/utils/helper/constants");
class TaskController {
    constructor() {
        this.path = '/tasks';
        this.router = (0, express_1.Router)();
        this.taskService = new task_1.TaskService();
        this.initializeRoutes = () => {
            this.router.post(`${this.path}/add-section`, [
                (0, index_1.validationMiddleware)(task_1.validate.addSection),
                index_1.authJwt.isMember,
            ], this.addSection);
            this.router.post(`${this.path}/add-task`, [index_1.authJwt.isMember], this.addTask);
            this.router.get(`${this.path}/get-task/:taskId`, [index_1.authJwt.isMember], this.getTaskById);
            this.router.delete(`${this.path}/delete-sub-task/:subtaskId`, [index_1.authJwt.isMember], this.deleteSubtaskById);
            this.router.delete(`${this.path}/delete-task/:taskId`, [index_1.authJwt.isMember], this.deleteTaskById);
            this.router.delete(`${this.path}/delete-section/:sectionId`, [index_1.authJwt.isMember], this.deleteSectionById);
            // Project contributors only
            this.router.patch(`${this.path}/change-section`, [
                (0, index_1.validationMiddleware)(task_1.validate.changeTaskSection),
                index_1.authJwt.isMember,
            ], this.changeTaskSection);
            // Project contributors only
            this.router.patch(`${this.path}/edit-sub-task`, [
                (0, index_1.validationMiddleware)(task_1.validate.editSubtaskDetails),
                index_1.authJwt.isMember,
            ], this.editSubtaskDetails);
            // Project contributors only
            this.router.patch(`${this.path}/sub-task/toggle-completed/:subtaskId`, [index_1.authJwt.isMember], this.toogleSubtaskStatus);
            this.router.patch(`${this.path}/edit-task/:taskId`, [index_1.authJwt.isMember], this.editTask);
            this.router.patch(`${this.path}/remove-task-assignee`, [
                (0, index_1.validationMiddleware)(task_1.validate.removeTaskAssignee),
                index_1.authJwt.isMember,
            ], this.removeTaskAssignee);
            this.router.patch(`${this.path}/remove-sub-task`, [
                (0, index_1.validationMiddleware)(task_1.validate.removeSubtask),
                index_1.authJwt.isMember,
            ], this.removeSubtask);
            this.router.patch(`${this.path}/delete-attachment`, [
                (0, index_1.validationMiddleware)(task_1.validate.deleteAttachment),
                index_1.authJwt.isMember,
            ], this.deleteAttachment);
        };
        this.addSection = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const sectionId = yield this.taskService.addSection(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.CREATED_SUCCESSFULLY).json({
                    message: 'Section added successfully',
                    sectionId,
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.addTask = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const taskId = yield this.taskService.addTask(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.CREATED_SUCCESSFULLY).json({
                    message: 'Task added successfully',
                    taskId,
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.getTaskById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const task = yield this.taskService.getTaskById(req.params.taskId);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                    task,
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.deleteSubtaskById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.taskService.deleteSubtaskById(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                    success: true,
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.deleteTaskById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.taskService.deleteTaskById(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                    success: true,
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.deleteSectionById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.taskService.deleteSectionById(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                    success: true,
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.changeTaskSection = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const project = yield this.taskService.changeTaskSection(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json(project);
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.editSubtaskDetails = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.taskService.editSubtaskDescription(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                    success: true,
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.toogleSubtaskStatus = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.taskService.toogleSubtaskStatus(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                    success: true,
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.editTask = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.taskService.editTask(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                    success: true,
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.removeTaskAssignee = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.taskService.removeTaskAssignee(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                    success: true,
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.removeSubtask = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.taskService.removeSubtask(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                    success: true,
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.deleteAttachment = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.taskService.deleteAttachment(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                    success: true,
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.initializeRoutes();
    }
}
exports.default = TaskController;
