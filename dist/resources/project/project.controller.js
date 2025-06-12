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
const project_1 = require("@/resources/project");
const index_1 = require("@/middleware/index");
const constants_1 = require("@/utils/helper/constants");
class ProjectController {
    constructor() {
        this.path = '/projects';
        this.router = (0, express_1.Router)();
        this.projectService = new project_1.ProjectService();
        this.initializeRoutes = () => {
            this.router.post(`${this.path}/add-project`, [index_1.authJwt.isSuperAdmin], this.addProject);
            this.router.get(`${this.path}/all`, [index_1.authJwt.isMember], this.getAllProjects);
            this.router.get(`${this.path}`, this.getProjects);
            this.router.get(`${this.path}/:projectId`, [index_1.authJwt.isMember], this.getProjectDetails);
            this.router.patch(`${this.path}/update-project-image`, [index_1.authJwt.isMember], this.updateProjectImage);
            this.router.patch(`${this.path}/toggle-project-status`, [
                (0, index_1.validationMiddleware)(project_1.validate.toggleProjectStatus),
                index_1.authJwt.isSuperAdmin,
            ], this.toggleProjectStatus);
            this.router.patch(`${this.path}/toggle-project-visibility`, [
                (0, index_1.validationMiddleware)(project_1.validate.toggleProjectStatus),
                index_1.authJwt.isSuperAdmin,
            ], this.toggleProjectVisibility);
            this.router.patch(`${this.path}/add-contributors`, [
                (0, index_1.validationMiddleware)(project_1.validate.addContributors),
                index_1.authJwt.isMember,
            ], this.addContributors);
            this.router.patch(`${this.path}/remove-contributor`, [
                (0, index_1.validationMiddleware)(project_1.validate.removeContributor),
                index_1.authJwt.isMember,
            ], this.removeContributor);
            this.router.patch(`${this.path}/edit-project`, [
                (0, index_1.validationMiddleware)(project_1.validate.editProject),
                index_1.authJwt.isMember,
            ], this.editProject);
            this.router.patch(`${this.path}/add-manager`, [
                (0, index_1.validationMiddleware)(project_1.validate.addManager),
                index_1.authJwt.isSuperAdmin,
            ], this.addManager);
            this.router.patch(`${this.path}/remove-manager`, [
                (0, index_1.validationMiddleware)(project_1.validate.addManager),
                index_1.authJwt.isSuperAdmin,
            ], this.removeManager);
            this.router.patch(`${this.path}/add-attachments/:projectId`, [index_1.authJwt.isMember], this.addAttachments);
            this.router.patch(`${this.path}/remove-attachment`, [
                (0, index_1.validationMiddleware)(project_1.validate.removeAttachment),
                index_1.authJwt.isMember,
            ], this.removeAttachment);
            this.router.delete(`${this.path}/:projectId`, [index_1.authJwt.isSuperAdmin], this.deleteProjectById);
        };
        this.addProject = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.projectService.addProject(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.CREATED_SUCCESSFULLY).json({
                    message: 'Project added successfully',
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.editProject = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.projectService.editProject(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                    message: 'Project edited successfully',
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        // Provide ongoing projects, six at a time by default
        this.getProjects = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const pageNumber = parseInt(req.query.pageNumber) ||
                    constants_1.PAGINATION.DEFAULT_PAGE_NUMBER;
                const pageLimit = parseInt(req.query.limit) ||
                    constants_1.PAGINATION.DEFAULT_PAGE_LIMIT;
                const result = yield this.projectService.getProjects(pageNumber, pageLimit, true);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({ result });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.getAllProjects = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const pageNumber = parseInt(req.query.pageNumber) ||
                    constants_1.PAGINATION.DEFAULT_PAGE_NUMBER;
                const pageLimit = parseInt(req.query.limit) ||
                    constants_1.PAGINATION.DEFAULT_PAGE_LIMIT;
                const result = yield this.projectService.getProjects(pageNumber, pageLimit, false);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({ result });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.getProjectDetails = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const project = (yield this.projectService.getProjectDetails(req.params.projectId));
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json(project);
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.updateProjectImage = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.files) {
                    yield this.projectService.updateProjectImage(req);
                }
                else {
                    throw new Error('Upload failed, no image found');
                }
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                    message: 'Project image uploaded successfully',
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.toggleProjectStatus = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { projectId } = req.body;
                yield this.projectService.toggleProjectStatus(projectId);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                    message: 'Project status toggled succesfully',
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.toggleProjectVisibility = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { projectId } = req.body;
                yield this.projectService.toggleProjectVisibility(projectId);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                    message: 'Project visibility toggled succesfully',
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.addContributors = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.projectService.addContributors(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                    message: 'Contributors added succesfully',
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.removeContributor = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.projectService.removeContributor(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                    message: 'Contributor removed succesfully',
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.deleteProjectById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.projectService.deleteProjectById(req.params.projectId);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                    success: true,
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.addManager = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.projectService.addManager(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                    success: true,
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.removeManager = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.projectService.removeManager(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                    success: true,
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.addAttachments = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.projectService.addAttachments(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                    success: true,
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.removeAttachment = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.projectService.removeAttachment(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                    success: true,
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.assignProjectManagers = (req, res, next) => __awaiter(this, void 0, void 0, function* () { });
        this.updateProjectInfos = (req, res, next) => __awaiter(this, void 0, void 0, function* () { });
        this.initializeRoutes();
    }
}
exports.default = ProjectController;
