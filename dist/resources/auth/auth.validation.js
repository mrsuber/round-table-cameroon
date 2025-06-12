"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const register = joi_1.default.object({
    firstName: joi_1.default.string().max(30).required(),
    lastName: joi_1.default.string().max(30).required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(8).required(),
});
const login = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
});
const verifyAccount = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    otp: joi_1.default.string().length(6).required(),
});
const refreshToken = joi_1.default.object({
    refreshToken: joi_1.default.string().required(),
});
const emailProvided = joi_1.default.object({
    email: joi_1.default.string().email().required(),
});
const resetPassword = joi_1.default.object({
    password: joi_1.default.string().min(8).required(),
    token: joi_1.default.string().required(),
});
const changePassword = joi_1.default.object({
    oldPassword: joi_1.default.string().min(8).required(),
    newPassword: joi_1.default.string().min(8).required(),
});
const updateProfile = joi_1.default.object({
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    about: joi_1.default.string().required(),
    linkedIn: joi_1.default.string().required(),
    facebook: joi_1.default.string().required(),
    twitter: joi_1.default.string().required(),
    username: joi_1.default.string().required(),
    profession: joi_1.default.string().required(),
    town: joi_1.default.string().required(),
    gender: joi_1.default.string().required(),
});
const updateGeneralSettings = joi_1.default.object({
    region: joi_1.default.string().required(),
    language: joi_1.default.string().required(),
    timezone: joi_1.default.string().required(),
    twelveHourFormat: joi_1.default.boolean().required(),
});
const updateNotificationSettings = joi_1.default.object({
    dailyNewsletter: joi_1.default.boolean().required(),
    message: joi_1.default.boolean().required(),
    projectUpdate: joi_1.default.boolean().required(),
    projectDeadline: joi_1.default.boolean().required(),
});
exports.default = {
    register,
    login,
    verifyAccount,
    refreshToken,
    emailProvided,
    resetPassword,
    changePassword,
    updateProfile,
    updateGeneralSettings,
    updateNotificationSettings
};
