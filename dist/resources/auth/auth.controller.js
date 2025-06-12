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
const authHelper_1 = require("@/utils/helper/authHelper");
const http_exception_1 = __importDefault(require("@/utils/exceptions/http.exception"));
const auth_1 = require("@/resources/auth");
const mailingService_1 = require("@/utils/helper/mailingService");
const index_1 = require("@/middleware/index");
const constants_1 = require("@/utils/helper/constants");
class UserController {
    constructor() {
        this.path = '/users';
        this.router = (0, express_1.Router)();
        this.authService = new auth_1.AuthService();
        this.register = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { firstName, lastName, email } = req.body;
                const user = yield this.authService.register(req);
                const otpCode = (yield (0, authHelper_1.createOTP)(user));
                yield (0, mailingService_1.sendMail)({
                    email: email,
                    otpCode: otpCode,
                    firstName: firstName,
                    lastName: lastName,
                    verification: true,
                });
                res.status(constants_1.STATUS_CODES.SUCCESS.CREATED_SUCCESSFULLY).json({ user });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const tokens = yield this.authService.login(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({ tokens });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.verifyAccount = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authService.verifyAccount(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                    message: 'User successfully verified.',
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.refreshToken = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const tokens = yield this.authService.refreshToken(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({ tokens });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.forgotPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const data = (yield this.authService.createPasswordToken(req));
                yield (0, mailingService_1.sendMail)({
                    email: email,
                    otpCode: data.token,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    verification: false,
                });
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                    message: 'Reset link sent.',
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.resetPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authService.resetPassword(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                    message: 'Password changed successfully.',
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.resendVerificationCode = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const data = (yield this.authService.resendVerificationCode(req));
                yield (0, mailingService_1.sendMail)({
                    email: email,
                    otpCode: data.token,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    verification: true,
                });
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                    message: 'Verification code resent.',
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.changePassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authService.changePassword(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                    message: 'Password changed successfully.',
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}/register`, (0, index_1.validationMiddleware)(auth_1.validate.register), this.register);
        this.router.post(`${this.path}/login`, (0, index_1.validationMiddleware)(auth_1.validate.login), this.login);
        this.router.patch(`${this.path}/verify-account`, (0, index_1.validationMiddleware)(auth_1.validate.verifyAccount), this.verifyAccount);
        this.router.post(`${this.path}/refresh-token`, (0, index_1.validationMiddleware)(auth_1.validate.refreshToken), this.refreshToken);
        this.router.post(`${this.path}/forgot-password`, (0, index_1.validationMiddleware)(auth_1.validate.emailProvided), this.forgotPassword);
        this.router.patch(`${this.path}/reset-password`, (0, index_1.validationMiddleware)(auth_1.validate.resetPassword), this.resetPassword);
        this.router.post(`${this.path}/resend-verification-code`, (0, index_1.validationMiddleware)(auth_1.validate.emailProvided), this.resendVerificationCode);
        this.router.patch(`${this.path}/change-password`, [(0, index_1.validationMiddleware)(auth_1.validate.changePassword), index_1.authJwt.isUser], this.changePassword);
    }
}
exports.default = UserController;
