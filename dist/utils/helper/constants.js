"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MOMO_SECRETS = exports.DONATION_STATE = exports.JWT_INFO = exports.SUPER_ADMIN = exports.PAGINATION = exports.STATUS_CODES = exports.UPLOADS_SHORT_URL = exports.API_HOST = exports.OTP_LENGTH = exports.OTP_CONFIG = exports.FILE_STRUCTURE = exports.AUTH_SETTINGS = exports.ROLES = exports.MAIL_SETTINGS = exports.FRONTEND_HOSTNAME = void 0;
require('dotenv').config();
const path = require('path');
exports.FRONTEND_HOSTNAME = process.env.APP_HOST;
exports.MAIL_SETTINGS = {
    service: 'gmail',
    auth: {
        user: process.env.MAIL_EMAIL,
        pass: process.env.MAIL_PASSWORD,
    },
    port: 465,
    host: 'smtp.gmail.com',
};
exports.ROLES = {
    SUPER_ADMIN: 'superAdmin',
    ADMIN: 'admin',
    MEMBER: 'member',
    USER: 'user',
};
exports.AUTH_SETTINGS = {
    SALT_ROUNDS: 8,
    TOKEN_JWT_SECRET: process.env.TOKEN_JWT_SECRET,
    TOKEN_JWT_EXPIRY: process.env.TOKEN_JWT_EXPIRY,
    REFRESH_TOKEN_JWT_EXPIRY: process.env.REFRESH_TOKEN_JWT_EXPIRY,
    OTP_EXPIRY: process.env.OTP_EXPIRY,
    PASSWORD_TOKEN_EXPIRY: process.env.PASSWORD_TOKEN_EXPIRY,
    SECRET: process.env.SECRET,
};
exports.FILE_STRUCTURE = {
    ROOT_DIRECTORY: process.cwd(),
    PUBLIC_DIR: path.join(process.cwd(), 'public'),
    USER_PROFILE_DIR: path.join(process.cwd(), 'public', 'userProfiles'),
    PARTNER_LOGO_DIR: path.join(process.cwd(), 'public', 'partnerLogos'),
    PROJECT_IMAGE_DIR: path.join(process.cwd(), 'public', 'projectImage'),
    PROJECT_ATTACHMENT_DIR: path.join(process.cwd(), 'public', 'projectAttachment'),
    MESSAGE_FILES_DIR: path.join(process.cwd(), 'public', 'messageFiles'),
    CLIENT_BUILD_PATH: path.join(process.cwd(), 'client', 'build'),
};
exports.OTP_CONFIG = {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    digits: true,
    specialChars: false,
};
exports.OTP_LENGTH = 6;
exports.API_HOST = process.env.APP_HOST;
exports.UPLOADS_SHORT_URL = '/api/uploads/';
exports.STATUS_CODES = {
    ERROR: {
        MOVED_PERMANENTLY: 301,
        MOVED_TEMPORARILY: 302,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        PAYMENT_REQUIRED: 402,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        METHOD_NOT_ALLOWED: 405,
        CONFLICT: 409,
        ACCOUNT_SUSPENDED: 410,
        UNSUPPORTED_MEDIA_FORMAT: 415,
        VALIDATION_ERRORS: 422,
        REQUEST_CONTROL: 429,
        SERVER_ERROR: 500,
    },
    SUCCESS: {
        SUCCESSFUL_REQUEST: 200,
        CREATED_SUCCESSFULLY: 201,
    },
};
exports.PAGINATION = {
    DEFAULT_PAGE_NUMBER: 0,
    DEFAULT_PAGE_LIMIT: 6,
};
exports.SUPER_ADMIN = {
    EMAIL: process.env.SUPER_ADMIN_EMAIL,
    PASSWORD: process.env.SUPER_ADMIN_PASSWORD,
    FIRST_NAME: process.env.SUPER_ADMIN_FIRST_NAME,
    LAST_NAME: process.env.SUPER_ADMIN_LAST_NAME,
};
exports.JWT_INFO = {
    SECRET: process.env.JWT_SECRET,
    ACCESS_TOKEN_DUR: process.env.TOKEN_JWT_EXPIRY,
    REFRESH_TOKEN_DUR: process.env.REFRESH_TOKEN_JWT_EXPIRY,
    RESET_TOKEN_SECRET: process.env.RESET_TOKEN_SECRET,
};
exports.DONATION_STATE = {
    INITIATED: 'INITIATED',
    PENDING: 'PENDING',
    SUCCESSFUL: 'SUCCESSFUL',
    FAILED: 'FAILED',
};
exports.MOMO_SECRETS = {
    VALLET_PAY_CLIENT_SECRET: process.env.VALLET_PAY_CLIENT_SECRET,
    VALLET_PAY_CLIENT_SECRET_ID: process.env.VALLET_PAY_CLIENT_SECRET_ID,
    VALLET_PAY_BASE_URL: process.env.VALLET_PAY_BASE_URL,
    PERCENTAGE_COMMISION: 1,
    BENEFACTOR_MOMO_NUMBER: process.env.BENEFACTOR_MOMO_NUMBER,
};
const CONSTANTS = {
    FRONTEND_HOSTNAME: exports.FRONTEND_HOSTNAME,
    MAIL_SETTINGS: exports.MAIL_SETTINGS,
    ROLES: exports.ROLES,
    AUTH_SETTINGS: exports.AUTH_SETTINGS,
    FILE_STRUCTURE: exports.FILE_STRUCTURE,
    OTP_CONFIG: exports.OTP_CONFIG,
    OTP_LENGTH: exports.OTP_LENGTH,
    STATUS_CODES: exports.STATUS_CODES,
    PAGINATION: exports.PAGINATION,
    API_HOST: exports.API_HOST,
    UPLOADS_SHORT_URL: exports.UPLOADS_SHORT_URL,
    SUPER_ADMIN: exports.SUPER_ADMIN,
    JWT_INFO: exports.JWT_INFO,
    DONATION_STATE: exports.DONATION_STATE,
    MOMO_SECRETS: exports.MOMO_SECRETS,
};
exports.default = CONSTANTS;
