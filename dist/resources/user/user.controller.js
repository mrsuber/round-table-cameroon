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
const user_1 = require("@/resources/user");
const auth_1 = require("@/resources/auth");
const index_1 = require("@/middleware/index");
const constants_1 = require("@/utils/helper/constants");
class UserController {
    constructor() {
        this.path = '/users';
        this.router = (0, express_1.Router)();
        this.userService = new user_1.UserService();
        this.getUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).send({
                    user: yield this.userService.getUser(req),
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.uploadProfileImage = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.files) {
                    const file = req.files.image;
                    yield this.userService.uploadProfileImage(req);
                }
                else {
                    throw new Error('Upload failed, no image found');
                }
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                    message: 'Profile photo uploaded successfully',
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.updateGeneralSettings = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.userService.updateGeneralSettings(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                    message: 'General settings updated successfully',
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.updateNotificationSettings = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.userService.updateNotificationSettings(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                    message: 'Notification settings updated successfully',
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.approveMember = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.userService.approveMember(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                    message: 'User has been approved succcessfully',
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.makeAdmin = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.userService.makeAdmin(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                    message: 'User has been made admin succcessfully',
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        // Provide members, six at a time by default
        this.getMembers = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userService.getMembers(req, { isMember: true, isDeleted: false });
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({ result });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.getUsers = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userService.getMembers(req, { isUser: true, isMember: false, isDeleted: false });
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({ result });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.getDeletedUsers = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userService.getMembers(req, { isDeleted: true });
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({ result });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.updateProfile = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.userService.updateProfile(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                    success: true,
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.deleteAccount = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.userService.deleteAccount(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                    success: true,
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.deleteUserAccount = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.userService.deleteUserAccount(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                    success: true,
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        // To be removed
        this.activateUsers = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.userService.activateUsers();
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                    success: true,
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        // Revoke someone as a member but keep as a user
        this.revokeMember = (req, res, next) => __awaiter(this, void 0, void 0, function* () { });
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}/profile`, index_1.authJwt.isMember, this.getUser);
        this.router.patch(`${this.path}/upload-profile-image`, [index_1.authJwt.isMember], this.uploadProfileImage);
        this.router.patch(`${this.path}/update-general-settings`, [(0, index_1.validationMiddleware)(auth_1.validate.updateGeneralSettings), index_1.authJwt.isMember], this.updateGeneralSettings);
        this.router.patch(`${this.path}/update-notification-settings`, [(0, index_1.validationMiddleware)(auth_1.validate.updateNotificationSettings), index_1.authJwt.isMember], this.updateNotificationSettings);
        this.router.patch(`${this.path}/approve-member`, [
            (0, index_1.validationMiddleware)(auth_1.validate.emailProvided),
            index_1.authJwt.isSuperAdmin,
        ], this.approveMember);
        this.router.patch(`${this.path}/make-admin`, [
            (0, index_1.validationMiddleware)(auth_1.validate.emailProvided),
            index_1.authJwt.isSuperAdmin,
        ], this.makeAdmin);
        this.router.patch(`${this.path}/update-profile`, [
            (0, index_1.validationMiddleware)(auth_1.validate.updateProfile),
            index_1.authJwt.isMember,
        ], this.updateProfile);
        this.router.delete(`${this.path}/delete-account`, [
            index_1.authJwt.isUser,
        ], this.deleteAccount);
        this.router.delete(`${this.path}/delete-user-account/:userId`, [
            index_1.authJwt.isSuperAdmin,
        ], this.deleteUserAccount);
        this.router.get(`${this.path}/get-members`, this.getMembers);
        this.router.get(`${this.path}/get-users`, this.getUsers);
        this.router.get(`${this.path}/deleted-users`, index_1.authJwt.isSuperAdmin, this.getDeletedUsers);
        // this.router.patch(`${this.path}/activate-users`, this.activateUsers)
    }
}
exports.default = UserController;
